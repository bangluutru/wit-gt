import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, Home, CheckCircle2, ArrowRight, ArrowLeft, Lock,
  Pencil, Save, X, SlidersHorizontal, Sun, Sunset, Moon, List, LayoutGrid,
  Upload, ImageOff, Volume2,
} from 'lucide-react';
import { useLessons, type LessonEditableField } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useDictionary } from '../hooks/useDictionary';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { getLessonStatusForUser, getDefaultTargetLanguage, speakText } from '../lib/utils';
import { getLocalized } from '../lib/types';
import type { Language, Theme, DictionaryTerm, LessonStatus } from '../lib/types';
import { parseLesson, parseBlocks, SECTION_ICON, type Block } from '../lib/lessonParser';
import { getMatchableTerms } from '../components/reader/TermHighlighter';
import { RichInline } from '../components/reader/RichInline';
import { StructureDiagram } from '../components/reader/StructureDiagram';
import { TermPopover } from '../components/reader/TermPopover';
import { TermTooltip } from '../components/reader/TermTooltip';
import { BottomSheet } from '../components/reader/BottomSheet';
import { LessonNavDrawer } from '../components/reader/LessonNavDrawer';
import { LoadingState, AdminPreviewBadge } from '../components/ui';

type ReaderStyle = 'A' | 'B' | 'C';
const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: 'vi', label: 'Tiếng Việt' }, { code: 'en', label: 'English' }, { code: 'jp', label: '日本語' },
];
const LANG_LABELS: Record<Language, string> = { vi: 'VI', en: 'EN', jp: 'JP' };
const THEME_ORDER: Theme[] = ['light', 'warm', 'dark'];
const THEME_META: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: 'Sáng' }, warm: { icon: Sunset, label: 'Ấm' }, dark: { icon: Moon, label: 'Tối' },
};

export default function LessonReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { lessons, chapters, loading: lessonsLoading, getLessonById, getChapter, updateLesson } = useLessons();
  const { completedLessons, loading: progressLoading, completeLesson } = useProgress();
  const { terms } = useDictionary();
  const { interfaceLang, theme, setTheme } = useSettings();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const txt = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  const [contentLang, setContentLang] = useState<Language>(interfaceLang);

  // Sync content language when interface language changes
  useEffect(() => {
    setContentLang(interfaceLang);
  }, [interfaceLang]);
  const [direction, setDirection] = useState<ReaderStyle>('A');
  const [tocHidden, setTocHidden] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const [openSec, setOpenSec] = useState<Record<number, boolean>>({});
  const [quizAns, setQuizAns] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState(0);
  const [activeSec, setActiveSec] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const [imgByLesson, setImgByLesson] = useState<Record<string, string>>({});

  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [hoverTerm, setHoverTerm] = useState<DictionaryTerm | null>(null);
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number; bottom: number } | null>(null);

  const [completing, setCompleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Reset transient view state when navigating to another lesson.
  useEffect(() => {
    setOpenSec({});
    setEditing(false);
    window.scrollTo({ top: 0 });
  }, [id]);

  const lesson = id ? getLessonById(id) : undefined;

  // Load admin-uploaded images from localStorage once lessons are available.
  useEffect(() => {
    const m: Record<string, string> = {};
    for (const l of lessons) {
      try {
        const v = localStorage.getItem('wit-img-' + l.id);
        if (v) m[l.id] = v;
      } catch { /* ignore */ }
    }
    setImgByLesson(m);
  }, [lessons]);

  const chapter = lesson ? getChapter(lesson.chapterId) : undefined;
  const status: LessonStatus = lesson ? getLessonStatusForUser(lesson.lessonNo, completedLessons, isAdmin) : 'locked';

  const content = lesson ? getLocalized(lesson, 'content', contentLang) : '';
  const parsed = useMemo(() => parseLesson(content), [content]);
  const matchable = useMemo(() => getMatchableTerms(terms, contentLang), [terms, contentLang]);

  // Fall back to a single implicit section for lessons without "PHẦN" headings.
  const sections = useMemo(() => {
    if (parsed.sections.length > 0) return parsed.sections;
    if (!content.trim()) return [];
    const lines = content.split(/\r?\n/).filter((l) => !/^#\s+/.test(l) && !/CHUYÊN ĐỀ|^#*\s*TOPIC\s*:/i.test(l));
    return [{ num: '1', rawLabel: 'Nội dung', type: 'other' as const, blocks: parseBlocks(lines), quiz: [] }];
  }, [parsed, content]);

  const showRail = !editing && !isMobile && !tocHidden && sections.length > 1;

  // TOC scroll-spy + reading progress.
  useEffect(() => {
    if (editing) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
      const el = contentRef.current;
      if (el) {
        let active = 0;
        el.querySelectorAll('[data-sec]').forEach((s) => {
          if (s.getBoundingClientRect().top <= 130) active = Number(s.getAttribute('data-sec'));
        });
        setActiveSec(active);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [editing, sections.length, direction]);

  const scrollToSec = (idx: number) => {
    const el = contentRef.current?.querySelector(`[data-sec="${idx}"]`);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  };

  // Term handlers
  const handleTermClick = useCallback((term: DictionaryTerm, rect: DOMRect) => {
    setHoverTerm(null);
    setSelectedTerm(term);
    if (isMobile) setShowBottomSheet(true);
    else setPopoverPos({ top: rect.bottom, left: rect.left });
  }, [isMobile]);
  const handleTermHover = useCallback((term: DictionaryTerm, rect: DOMRect) => {
    if (isMobile) return;
    setHoverTerm(term);
    setHoverPos({ top: rect.top, bottom: rect.bottom, left: rect.left + rect.width / 2 });
  }, [isMobile]);
  const handleTermLeave = useCallback(() => setHoverTerm(null), []);
  const closePopover = useCallback(() => {
    setSelectedTerm(null);
    setPopoverPos(null);
    setShowBottomSheet(false);
  }, []);

  const handleComplete = async () => {
    if (!lesson || completing) return;
    setCompleting(true);
    try { await completeLesson(lesson.lessonNo, lesson.id); } catch { /* handled */ } finally { setCompleting(false); }
  };

  // Admin editing
  const cap = contentLang === 'vi' ? 'Vi' : contentLang === 'en' ? 'En' : 'Jp';
  const titleField = `title${cap}` as LessonEditableField;
  const contentField = `content${cap}` as LessonEditableField;
  const startEditing = () => {
    if (!lesson) return;
    setEditTitle((lesson[titleField] as string) || '');
    setEditContent((lesson[contentField] as string) || '');
    setSaveError(null);
    setEditing(true);
  };
  const cancelEditing = () => { setEditing(false); setSaveError(null); };
  const saveEditing = async () => {
    if (!lesson || saving) return;
    setSaving(true);
    setSaveError(null);
    const ok = await updateLesson(lesson.id, { [titleField]: editTitle, [contentField]: editContent });
    setSaving(false);
    if (ok) setEditing(false);
    else setSaveError('Lưu thất bại — kiểm tra quyền admin hoặc kết nối mạng.');
  };

  // Admin image upload
  const onUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !lesson) return;
    const r = new FileReader();
    r.onload = () => {
      const data = String(r.result);
      setImgByLesson((m) => ({ ...m, [lesson.id]: data }));
      try { localStorage.setItem('wit-img-' + lesson.id, data); } catch { /* ignore */ }
    };
    r.readAsDataURL(file);
  };
  const clearImg = () => {
    if (!lesson) return;
    setImgByLesson((m) => { const n = { ...m }; delete n[lesson.id]; return n; });
    try { localStorage.removeItem('wit-img-' + lesson.id); } catch { /* ignore */ }
  };

  if (lessonsLoading || progressLoading) return <LoadingState message="Đang tải bài học..." />;
  if (!lesson) {
    return (
      <div className="page-enter text-center py-20">
        <p className="text-wit-text-secondary mb-4">Không tìm thấy bài học</p>
        <Link to="/curriculum" className="text-wit-red hover:underline">Quay lại giáo trình</Link>
      </div>
    );
  }
  if (status === 'locked' && !isAdmin) {
    return (
      <div className="page-enter text-center py-20">
        <Lock className="h-12 w-12 text-wit-text-tertiary mx-auto mb-4" />
        <p className="text-wit-text-secondary mb-4">Bài học này chưa được mở khoá</p>
        <Link to="/curriculum" className="text-wit-red hover:underline">Quay lại giáo trình</Link>
      </div>
    );
  }

  const title = getLocalized(lesson, 'title', interfaceLang);
  const chapterTitle = chapter ? getLocalized(chapter, 'title', interfaceLang) : '';
  const dictionaryTargetLang = getDefaultTargetLanguage(contentLang);

  const words = (content.replace(/[#*\->]/g, ' ').match(/\S+/g) || []).length;
  const readMin = Math.max(3, Math.round(words / 200));
  const quizCount = sections.reduce((n, s) => n + s.quiz.length, 0);

  const prev = lessons.find((l) => l.lessonNo === lesson.lessonNo - 1);
  const next = lessons.find((l) => l.lessonNo === lesson.lessonNo + 1);
  const isStruct = lesson.chapterId === 'ch2';
  const img = imgByLesson[lesson.id];
  const showImagePanel = !editing && (!!img || isStruct || isAdmin);

  // ── block renderer ──
  const renderBlock = (b: Block, i: number) => {
    const rich = (
      <RichInline text={b.text} matchable={matchable} lang={contentLang}
        onTermClick={handleTermClick} onTermHover={handleTermHover} onTermLeave={handleTermLeave} />
    );
    const fs: React.CSSProperties = {
      fontSize: 'var(--reader-font-size, 16px)',
      lineHeight: direction === 'B' ? 1.95 : 'var(--reader-line-height, 1.8)',
    };
    switch (b.kind) {
      case 'h':
        return <div key={i} className="font-serif font-semibold text-[17.5px] leading-[1.35] text-wit-text mt-5 mb-2">{rich}</div>;
      case 'li':
        return (
          <div key={i} className="relative pl-5 my-1.5 text-wit-text-secondary" style={fs}>
            <span className="absolute left-0 top-[0.62em] w-1.5 h-1.5 rounded-full bg-wit-gold" />{rich}
          </div>
        );
      case 'callout':
        return <div key={i} className="border-l-[3px] border-wit-gold bg-wit-gold-soft rounded-r-[12px] px-4 py-3 my-3.5 text-[14.5px] leading-[1.65] text-wit-text-secondary">{rich}</div>;
      case 'quote':
        return direction === 'B'
          ? <blockquote key={i} className="font-serif italic font-medium text-center mx-auto my-7 max-w-[620px] text-wit-text leading-[1.45] text-[clamp(20px,2.6vw,26px)]">{rich}</blockquote>
          : <blockquote key={i} className="font-serif italic font-medium border-l-[3px] border-wit-gold pl-5 py-1 my-5 text-wit-text leading-[1.5] text-[clamp(17px,2vw,21px)]">{rich}</blockquote>;
      default:
        return <p key={i} className="text-wit-text-secondary my-2.5" style={fs}>{rich}</p>;
    }
  };

  // ── quiz renderer ──
  const renderQuiz = (quiz: typeof sections[number]['quiz']) => {
    const answeredCount = quiz.filter((_, qi) => quizAns[`${lesson.id}:${qi}`] !== undefined).length;
    const score = quiz.filter((q, qi) => quizAns[`${lesson.id}:${qi}`] === q.correct).length;
    return (
      <div>
        <div className="flex items-center justify-between gap-3.5 flex-wrap mb-3.5">
          <p className="text-sm text-wit-text-tertiary m-0">Chọn đáp án — chấm điểm &amp; giải thích ngay.</p>
          <div className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full bg-wit-gold-soft text-wit-gold border border-wit-gold">
            Điểm: {score}/{answeredCount} · còn {quiz.length - answeredCount}
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          {quiz.map((q, qi) => {
            const key = `${lesson.id}:${qi}`;
            const sel = quizAns[key];
            const answered = sel !== undefined;
            const correct = answered && sel === q.correct;
            return (
              <div key={qi} className="border border-wit-line rounded-card bg-wit-surface p-4">
                <div className="flex gap-2.5 mb-3">
                  <span className="shrink-0 w-6 h-6 rounded-md bg-wit-surface-2 text-wit-text-secondary text-xs font-bold flex items-center justify-center">{qi + 1}</span>
                  <span className="text-[15px] leading-[1.55] text-wit-text font-medium">{q.prompt}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.opts.map((opt, oi) => {
                    const isSel = sel === oi;
                    const isCorrect = oi === q.correct;
                    let cls = 'border-wit-line bg-wit-surface text-wit-text';
                    let badge = 'bg-wit-surface-2 text-wit-text-secondary';
                    let mark = '';
                    if (answered) {
                      if (isCorrect) { cls = 'border-wit-success bg-wit-success-soft text-wit-success'; badge = 'bg-wit-success text-white'; mark = '✓'; }
                      else if (isSel) { cls = 'border-wit-red bg-wit-red-soft text-wit-red'; badge = 'bg-wit-red text-white'; mark = '✕'; }
                      else cls = 'border-wit-line text-wit-text-tertiary';
                    }
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={answered}
                        onClick={() => setQuizAns((a) => ({ ...a, [key]: oi }))}
                        className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-button border text-[13.5px] font-medium transition-all ${cls} ${answered ? 'cursor-default' : 'cursor-pointer hover:border-wit-red/40'}`}
                      >
                        <span className={`shrink-0 w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px] font-bold ${badge}`}>{['A', 'B', 'C', 'D'][oi]}</span>
                        <span className="flex-1">{opt}</span>
                        {mark && <span className="text-sm">{mark}</span>}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className={`mt-3 px-3 py-2 rounded-button text-[13px] leading-[1.55] font-medium ${correct ? 'bg-wit-success-soft text-wit-success' : 'bg-wit-red-soft text-wit-red'}`}>
                    {correct
                      ? `Chính xác!${q.explanation ? ' ' + q.explanation : ''}`
                      : `Đáp án đúng: ${['A', 'B', 'C', 'D'][q.correct] || '?'}${q.opts[q.correct] ? '. ' + q.opts[q.correct] : ''}${q.explanation ? ' — ' + q.explanation : ''}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter">
      {/* Reading progress bar */}
      {!editing && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
          <div className="h-full bg-gradient-to-r from-wit-red to-wit-gold transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="max-w-[1180px] mx-auto">
        {/* Top bar: breadcrumb + actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <nav className="flex items-center gap-1.5 text-sm text-wit-text-tertiary flex-wrap min-w-0">
            <Link to="/" className="hover:text-wit-text transition-colors flex items-center gap-1"><Home className="h-3.5 w-3.5" /> {txt('Trang chủ', 'Home', 'ホーム')}</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link to="/curriculum" className="hover:text-wit-text transition-colors">{txt('Giáo trình', 'Curriculum', 'カリキュラム')}</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-wit-text font-medium">{txt('Học phần', 'Part', 'パート')} {String(lesson.lessonNo).padStart(2, '0')}</span>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && !editing && (
              <button onClick={startEditing} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text-secondary hover:border-wit-red/30 hover:text-wit-red transition-colors">
                <Pencil className="h-4 w-4" /> {txt('Sửa', 'Edit', '編集')}
              </button>
            )}
            <button onClick={() => setNavOpen(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text hover:bg-wit-surface-2 transition-colors">
              <LayoutGrid className="h-4 w-4" /> {txt('76 học phần', '76 Parts', '76パート')}
            </button>
          </div>
        </div>

        {/* Hero */}
        <header>
          <div className="flex items-center gap-2 flex-wrap">
            {chapterTitle && (
              <span className="inline-block px-3 py-1 text-[11.5px] font-semibold rounded-full bg-wit-gold-soft text-wit-gold">
                {txt('Chương', 'Chapter', '章')} {chapter?.orderIndex} · {chapterTitle}
              </span>
            )}
            {isAdmin && <AdminPreviewBadge />}
          </div>
          <h1 className="font-serif font-bold text-wit-text leading-[1.14] tracking-tight mt-3.5 text-[clamp(28px,4.2vw,44px)] max-w-[900px]">{title}</h1>
          {parsed.chuyenDe && (
            <p className="mt-3 text-[15.5px] leading-relaxed text-wit-text-secondary max-w-[680px]">{parsed.chuyenDe}</p>
          )}
          <div className="mt-4.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-wit-text-secondary mt-4">
            <span className="inline-flex items-center gap-1.5">⏱ <b className="font-semibold text-wit-text">~{readMin} {txt('phút đọc', 'min read', '分で読める')}</b></span>
            <span className="inline-flex items-center gap-1.5">◷ {sections.length} {txt('phần', 'sections', 'セクション')}</span>
            {quizCount > 0 && <span className="inline-flex items-center gap-1.5">✎ {quizCount} {txt('câu trắc nghiệm', 'quiz questions', 'クイズ問題')}</span>}
            <span className="inline-flex items-center gap-1.5 text-wit-gold">◉ {LANG_OPTIONS.find((l) => l.code === contentLang)?.label}</span>
          </div>
        </header>

        {/* Editor (admin) */}
        {editing ? (
          <div className="mt-6 space-y-3 pb-24">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-semibold text-wit-text"><Pencil className="h-4 w-4 text-wit-red" /> Đang sửa · {LANG_LABELS[contentLang]}</div>
              <div className="flex items-center gap-2">
                <button onClick={cancelEditing} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-medium border border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2 transition-all disabled:opacity-50"><X className="h-4 w-4" /> Huỷ</button>
                <button onClick={saveEditing} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 rounded-button text-sm font-semibold bg-wit-red text-white hover:bg-wit-red-hover shadow-card transition-all disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
              </div>
            </div>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Tiêu đề học phần" className="w-full px-4 py-2.5 rounded-button border border-wit-line bg-wit-surface font-serif text-lg font-bold text-wit-text focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red" />
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} spellCheck={false} className="w-full min-h-[60vh] px-4 py-3 rounded-button border border-wit-line bg-wit-surface font-mono text-[13px] leading-relaxed text-wit-text focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red resize-y" />
            {saveError && <p className="text-sm text-wit-red font-medium">{saveError}</p>}
            <p className="text-xs text-wit-text-tertiary leading-relaxed">Markdown: <code>## PHẦN N:</code> chia phần · <code>**đậm**</code> · <code>-</code> danh sách · <code>&gt;</code> trích dẫn. Phần trắc nghiệm dùng <code>**Câu N:**</code> + <code>- A.</code> + <code>&gt; Đáp án đúng: **X**</code>.</p>
          </div>
        ) : (
          <div className={showRail ? 'lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 lg:items-start mt-6' : 'mt-6'}>
            {/* TOC rail */}
            {showRail && (
              <aside className="hidden lg:block sticky top-7 self-start">
                <div className="flex items-center justify-between gap-2 pl-1 pb-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-[1.6px] text-wit-text-tertiary">{txt('Mục lục bài', 'Table of Contents', '目次')}</span>
                  <button onClick={() => setTocHidden(true)} className="text-[11.5px] font-semibold text-wit-text-tertiary hover:text-wit-text transition-colors" title={txt('Ẩn mục lục', 'Hide Table of Contents', '目次を隠す')}>{txt('Ẩn ✕', 'Hide ✕', '非表示 ✕')}</button>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {sections.map((s, i) => {
                    const on = activeSec === i;
                    return (
                      <button key={i} onClick={() => scrollToSec(i)} className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-button text-[13px] transition-all ${on ? 'bg-wit-red-soft text-wit-red font-semibold' : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'}`}>
                        <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs ${on ? 'bg-wit-red text-white' : 'bg-wit-surface-2 text-wit-text-tertiary'}`}>{SECTION_ICON[s.type]}</span>
                        <span className="flex-1 line-clamp-2">{s.rawLabel}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="mt-3.5 p-3.5 rounded-card border border-wit-line bg-wit-surface">
                  <div className="flex justify-between text-[11.5px] text-wit-text-tertiary mb-2"><span>{txt('Tiến độ đọc', 'Reading Progress', '読書の進捗')}</span><span className="font-bold text-wit-red">{Math.round(progress)}%</span></div>
                  <div className="h-1.5 rounded-full bg-wit-line overflow-hidden"><div className="h-full bg-gradient-to-r from-wit-red to-wit-gold rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} /></div>
                </div>
              </aside>
            )}

            {/* Content column */}
            <main ref={contentRef} className={`min-w-0 ${direction === 'B' ? 'max-w-[720px] mx-auto' : ''}`}>
              {/* Image / diagram panel */}
              {showImagePanel && (
                <div className="mb-2 mt-1 rounded-card border border-wit-line p-4" style={{ background: 'var(--color-wit-surface)' }}>
                  {isAdmin && (
                    <div className="flex items-center gap-2.5 flex-wrap mb-3.5 px-3 py-2.5 rounded-button border border-dashed border-wit-gold bg-wit-gold-soft">
                      <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-gold">⤓ Admin</span>
                      <span className="text-[12.5px] text-wit-text-secondary flex-1 min-w-[140px]">
                        {img ? 'Đang dùng hình admin tải lên.' : isStruct ? 'Đang dùng sơ đồ tương tác dựng sẵn. Tải hình riêng để thay thế.' : 'Học phần này chưa gắn hình minh hoạ.'}
                      </span>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-white bg-wit-gold px-3 py-1.5 rounded-button">
                        <Upload className="h-3.5 w-3.5" /> Tải hình lên
                        <input type="file" accept="image/*" onChange={onUploadImg} className="hidden" />
                      </label>
                      {img && <button onClick={clearImg} className="text-xs font-semibold border border-wit-line bg-wit-surface text-wit-text-secondary px-3 py-1.5 rounded-button hover:bg-wit-surface-2">Gỡ hình</button>}
                    </div>
                  )}
                  {img ? (
                    <div className="text-center"><img src={img} alt={title} className="max-w-full h-auto inline-block rounded-card border border-wit-line" /></div>
                  ) : isStruct ? (
                    <StructureDiagram lang={contentLang} />
                  ) : (
                    isAdmin && (
                      <div className="text-center py-7 px-4 rounded-card border border-dashed border-wit-line text-wit-text-tertiary">
                        <ImageOff className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-[13.5px]">Chưa có hình minh hoạ cho học phần này — admin có thể tải lên ở trên.</div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Parsed sections */}
              {sections.map((sec, idx) => {
                const open = openSec[idx] !== false;
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <section key={idx} data-sec={idx} style={{ scrollMarginTop: 84, marginTop: direction === 'B' ? 56 : 28 }}>
                    <div className={`relative mb-1.5 ${direction === 'B' ? 'border-t border-wit-line pt-6 flex items-center gap-4' : direction === 'C' ? 'border-l-4 border-wit-red pl-3.5' : ''}`}>
                      {direction === 'B' && <div className="font-serif text-[60px] font-bold leading-[0.8] text-wit-gold opacity-20">{numStr}</div>}
                      <button onClick={() => setOpenSec((o) => ({ ...o, [idx]: o[idx] === false ? true : false }))} className="flex items-center gap-3.5 w-full text-left py-1.5">
                        {direction !== 'B' && (
                          <span className="shrink-0 w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-base font-semibold bg-wit-red-soft text-wit-red">{SECTION_ICON[sec.type]}</span>
                        )}
                        <span className="flex-1">
                          <span className="block text-[10.5px] font-bold uppercase tracking-[1.5px] text-wit-gold mb-0.5">Phần {numStr}</span>
                          <span className="font-serif font-semibold text-wit-text text-[clamp(19px,2.4vw,25px)]">{sec.rawLabel}</span>
                        </span>
                        <span className="shrink-0 text-[20px] text-wit-text-tertiary transition-transform duration-200" style={{ transform: open ? 'none' : 'rotate(-90deg)' }}>⌄</span>
                      </button>
                    </div>
                    {open && (
                      <div className={direction === 'B' ? 'pt-3 max-w-[680px]' : 'pt-1.5 px-1'}>
                        {sec.type === 'quiz' ? renderQuiz(sec.quiz) : sec.blocks.map(renderBlock)}
                      </div>
                    )}
                  </section>
                );
              })}

              {/* Bottom actions: complete + prev/next */}
              <div className="mt-8 pt-6 border-t border-wit-line flex flex-col gap-4 pb-24 md:pb-12">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {status === 'completed' ? (
                    <div className="flex items-center gap-2 text-wit-success"><CheckCircle2 className="h-5 w-5" /><span className="text-sm font-medium">{txt('Đã hoàn thành bài này', 'Completed this lesson', 'このレッスンを完了しました')}</span></div>
                  ) : (
                    <button onClick={handleComplete} disabled={completing} className="flex items-center gap-2 px-6 py-3 rounded-button bg-wit-red text-white font-medium text-sm hover:bg-wit-red-hover transition-colors disabled:opacity-60 shadow-card hover:shadow-card-hover">
                      <CheckCircle2 className="h-4 w-4" /> {completing ? txt('Đang lưu...', 'Saving...', '保存中...') : txt('Hoàn thành bài học', 'Complete Lesson', 'レッスンを完了する')}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {prev ? (
                    <button onClick={() => navigate(`/lessons/${prev.id}`)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text-secondary hover:text-wit-text transition-colors">
                      <ArrowLeft className="h-4 w-4 text-wit-red" /> {txt('HP', 'Part', 'パート')} {String(prev.lessonNo).padStart(2, '0')}
                    </button>
                  ) : <span />}
                  {next && (
                    <button onClick={() => navigate(`/lessons/${next.id}`)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text hover:border-wit-red/30 transition-colors text-right max-w-[60%]">
                      <span className="truncate">{txt('HP', 'Part', 'パート')} {String(next.lessonNo).padStart(2, '0')} · {getLocalized(next, 'title', interfaceLang)}</span>
                      <ArrowRight className="h-4 w-4 text-wit-red shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Restore-TOC floating button */}
      {!editing && tocHidden && sections.length > 1 && (
        <button onClick={() => setTocHidden(false)} className="hidden lg:inline-flex items-center gap-2 fixed left-5 bottom-5 z-[55] px-4 py-2.5 rounded-full bg-wit-surface border border-wit-line shadow-popover text-sm font-semibold text-wit-text-secondary hover:text-wit-text transition-colors">
          <List className="h-4 w-4" /> {txt('Mục lục', 'TOC', '目次')}
        </button>
      )}

      {/* Floating controls */}
      {!editing && (
        <div className="fixed right-4 bottom-[84px] md:bottom-5 z-[55] flex flex-col items-end gap-2">
          {panelOpen && (
            <div className="flex flex-col items-end gap-2 animate-slide-up">
              {/* Language */}
              <div className="flex items-center gap-1.5 bg-wit-surface border border-wit-line shadow-popover rounded-card pl-3 pr-1.5 py-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-text-tertiary mr-0.5">{txt('Ngôn ngữ', 'Language', '言語')}</span>
                {LANG_OPTIONS.map((l) => (
                  <button key={l.code} onClick={() => setContentLang(l.code)} className={`px-2.5 py-1.5 rounded-button text-xs font-semibold transition-colors ${contentLang === l.code ? 'bg-wit-gold text-white' : 'text-wit-text-secondary hover:bg-wit-surface-2'}`}>{l.label}</button>
                ))}
              </div>
              {/* Reader style */}
              <div className="flex items-center gap-1.5 bg-wit-surface border border-wit-line shadow-popover rounded-card pl-3 pr-1.5 py-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-text-tertiary mr-0.5">{txt('Phong cách', 'Style', 'スタイル')}</span>
                {(['A', 'B', 'C'] as ReaderStyle[]).map((s) => (
                  <button key={s} onClick={() => setDirection(s)} className={`px-2.5 py-1.5 rounded-button text-xs font-semibold transition-colors ${direction === s ? 'bg-wit-red text-white' : 'text-wit-text-secondary hover:bg-wit-surface-2'}`}>
                    {s === 'A' ? txt('A · Giáo trình', 'A · Curriculum', 'A · 教材') : s === 'B' ? txt('B · Tĩnh lặng', 'B · Focus', 'B · 静観') : txt('C · Tương tác', 'C · Interactive', 'C · 双方向')}
                  </button>
                ))}
              </div>
              {/* Theme */}
              <div className="flex items-center gap-1.5 bg-wit-surface border border-wit-line shadow-popover rounded-card pl-3 pr-1.5 py-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-text-tertiary mr-0.5">{txt('Nền', 'Theme', 'テーマ')}</span>
                {THEME_ORDER.map((t) => {
                  const Icon = THEME_META[t].icon;
                  return (
                    <button key={t} onClick={() => setTheme(t)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-button text-xs font-semibold transition-colors ${theme === t ? 'bg-wit-gold text-white' : 'text-wit-text-secondary hover:bg-wit-surface-2'}`}>
                      <Icon className="h-3.5 w-3.5" /> {txt(THEME_META[t].label, THEME_META[t].label === 'Sáng' ? 'Light' : THEME_META[t].label === 'Ấm' ? 'Warm' : 'Dark', THEME_META[t].label === 'Sáng' ? 'ライト' : THEME_META[t].label === 'Ấm' ? 'ウォーム' : 'ダーク')}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button onClick={() => setPanelOpen((o) => !o)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-wit-surface border border-wit-line shadow-popover text-sm font-semibold text-wit-text-secondary hover:text-wit-text transition-colors">
            {panelOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            <span className="hidden sm:inline">{panelOpen ? txt('Ẩn tùy chọn', 'Hide Options', 'オプション非表示') : txt('Tùy chọn', 'Options', 'オプション')}</span>
          </button>
        </div>
      )}

      {/* Term interaction */}
      {hoverTerm && hoverPos && !isMobile && !selectedTerm && (
        <TermTooltip term={hoverTerm} targetLang={dictionaryTargetLang} position={hoverPos} />
      )}
      {selectedTerm && popoverPos && !isMobile && (
        <TermPopover term={selectedTerm} sourceLang={contentLang} targetLang={dictionaryTargetLang} position={popoverPos} onClose={closePopover} />
      )}
      <BottomSheet isOpen={showBottomSheet} onClose={closePopover}>
        {selectedTerm && <TermSheetContent term={selectedTerm} sourceLang={contentLang} targetLang={dictionaryTargetLang} />}
      </BottomSheet>

      {/* 76-lesson drawer */}
      <LessonNavDrawer
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        chapters={chapters}
        lessons={lessons}
        currentLessonId={lesson.id}
        completedLessons={completedLessons}
        isAdmin={isAdmin}
        lang={interfaceLang}
      />
    </div>
  );
}

/* ---- Inline helper for bottom sheet term display ---- */

function TermSheetContent({ term, sourceLang, targetLang }: { term: DictionaryTerm; sourceLang: Language; targetLang: Language }) {
  const getField = (field: string, lang: Language): string => {
    const suffix = lang === 'vi' ? 'vi' : lang === 'en' ? 'en' : 'jp';
    const key = `${suffix}${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof DictionaryTerm;
    return (term[key] as string) || '';
  };
  const sourceTerm = getField('term', sourceLang);
  const sourceIpa = getField('ipa', sourceLang);
  const sourceKana = sourceLang === 'jp' ? getField('kana', sourceLang) : '';
  const sourceDef = getField('def', sourceLang);
  const sourcePos = getField('pos', sourceLang);
  const targetTerm = getField('term', targetLang);
  const targetDef = getField('def', targetLang);
  const targetPos = getField('pos', targetLang);
  const targetIpa = getField('ipa', targetLang);
  const targetKana = targetLang === 'jp' ? getField('kana', targetLang) : '';
  const hasTranslation = Boolean(targetTerm || targetDef);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-wit-text">{sourceTerm}</span>
          <button onClick={() => speakText(sourceTerm, sourceLang)} className="text-wit-text-tertiary hover:text-wit-red transition-colors"><Volume2 className="h-4 w-4" /></button>
        </div>
        {(sourceIpa || sourceKana) && (
          <p className="text-xs text-wit-text-tertiary">{sourceIpa && `/${sourceIpa}/`}{sourceIpa && sourceKana && ' · '}{sourceKana}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {term.category && <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-red-soft text-wit-red">{term.category}</span>}
        {sourcePos && <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-surface-2 text-wit-text-secondary">{sourcePos}</span>}
      </div>
      {sourceDef && <p className="text-sm text-wit-text leading-relaxed">{sourceDef}</p>}
      <div className="border-t border-wit-line" />
      <div>
        <p className="text-xs text-wit-text-tertiary mb-1 uppercase tracking-wider">{targetLang === 'vi' ? 'Tiếng Việt' : targetLang === 'en' ? 'English' : '日本語'}</p>
        {hasTranslation ? (
          <>
            {targetTerm && (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-wit-text">{targetTerm}</p>
                <button onClick={() => speakText(targetTerm, targetLang)} className="text-wit-text-tertiary hover:text-wit-red transition-colors"><Volume2 className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {(targetIpa || targetKana || targetPos) && (
              <p className="text-xs text-wit-text-tertiary mt-0.5">{targetIpa && `/${targetIpa}/`}{targetIpa && (targetKana || targetPos) && ' · '}{targetKana}{targetKana && targetPos && ' · '}{targetPos}</p>
            )}
            {targetDef && <p className="text-sm text-wit-text-secondary mt-1 leading-relaxed">{targetDef}</p>}
          </>
        ) : (
          <p className="text-sm text-wit-text-tertiary italic">Chưa có dữ liệu dịch cho thuật ngữ này.</p>
        )}
      </div>
    </div>
  );
}
