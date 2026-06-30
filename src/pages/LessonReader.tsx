import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Home,
  CheckCircle2,
  ArrowRight,
  Lock,
  Columns2,
  AlignLeft,
  Volume2,
  Pencil,
  Save,
  X,
  Clock,
  LayoutList,
  ListChecks,
  List,
  SlidersHorizontal,
  Sun,
  Sunset,
  Moon,
  Minus,
  Plus,
  LayoutGrid,
} from 'lucide-react';
import { useLessons, type LessonEditableField } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useDictionary } from '../hooks/useDictionary';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { getLessonStatusForUser, getDefaultTargetLanguage, speakText } from '../lib/utils';
import { getLocalized } from '../lib/types';
import type { Language, Theme, FontSize, DictionaryTerm, LessonStatus } from '../lib/types';
import { TermHighlighter } from '../components/reader/TermHighlighter';
import { TermPopover } from '../components/reader/TermPopover';
import { TermTooltip } from '../components/reader/TermTooltip';
import { BottomSheet } from '../components/reader/BottomSheet';
import { LessonNavDrawer } from '../components/reader/LessonNavDrawer';
import { LoadingState, AdminPreviewBadge } from '../components/ui';

const LANG_LABELS: Record<Language, string> = { vi: 'VI', en: 'EN', jp: 'JP' };

/** Reading presentation styles (from design: A · Giáo trình, B · Tĩnh lặng). */
type ReaderStyle = 'A' | 'B';

const THEME_ORDER: Theme[] = ['light', 'warm', 'dark'];
const THEME_META: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: 'Sáng' },
  warm: { icon: Sunset, label: 'Ấm' },
  dark: { icon: Moon, label: 'Tối' },
};
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large'];

export default function LessonReader() {
  const { id } = useParams<{ id: string }>();

  const { lessons, chapters, loading: lessonsLoading, getLessonById, getChapter, updateLesson } = useLessons();
  const { completedLessons, loading: progressLoading, completeLesson } = useProgress();
  const { terms } = useDictionary();
  const { interfaceLang, preferredSourceLang, displayMode, setDisplayMode, theme, setTheme, fontSize, setFontSize } =
    useSettings();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  // Reading state
  const [contentLang, setContentLang] = useState<Language>(preferredSourceLang);
  const [dualMode, setDualMode] = useState(displayMode === 'dual');
  const [readerStyle, setReaderStyle] = useState<ReaderStyle>('A');
  const [tocHidden, setTocHidden] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Reading shell: table of contents (from headings), scroll progress, active section
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);
  const [activeSec, setActiveSec] = useState(0);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Term interaction
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [hoverTerm, setHoverTerm] = useState<DictionaryTerm | null>(null);
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number; bottom: number } | null>(null);

  const [completing, setCompleting] = useState(false);

  // Admin in-place editing
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    setDualMode(displayMode === 'dual');
  }, [displayMode]);

  const lesson = id ? getLessonById(id) : undefined;
  const chapter = lesson ? getChapter(lesson.chapterId) : undefined;
  const status: LessonStatus = lesson
    ? getLessonStatusForUser(lesson.lessonNo, completedLessons, isAdmin)
    : 'locked';
  const nextLesson = lesson ? lessons.find((l) => l.lessonNo === lesson.lessonNo + 1) : undefined;

  const content = lesson ? getLocalized(lesson, 'content', contentLang) : '';
  const showRail = !editing && !dualMode && !tocHidden;

  // Build TOC from rendered H2 headings (single column only).
  useEffect(() => {
    if (editing || dualMode) {
      setToc([]);
      return;
    }
    const el = contentRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      const hs = Array.from(el.querySelectorAll('h2')) as HTMLElement[];
      const list = hs.map((h, i) => {
        const hid = `lr-sec-${i}`;
        h.id = hid;
        h.style.scrollMarginTop = '88px';
        return { id: hid, text: (h.textContent || `Phần ${i + 1}`).trim() };
      });
      setToc(list);
    });
    return () => cancelAnimationFrame(raf);
  }, [content, contentLang, editing, dualMode, readerStyle]);

  // Scroll progress + scroll-spy active section.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
      const el = contentRef.current;
      if (el) {
        const hs = Array.from(el.querySelectorAll('h2')) as HTMLElement[];
        let active = 0;
        hs.forEach((h, i) => {
          if (h.getBoundingClientRect().top <= 130) active = i;
        });
        setActiveSec(active);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [content, contentLang, editing, dualMode, toc.length]);

  const scrollToSec = (sid: string) => {
    const el = document.getElementById(sid);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Reading meta
  const readMinutes = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [content]);
  const partCount = useMemo(() => (content.match(/^##\s/gm) || []).length, [content]);

  // Term handlers
  const handleTermClick = useCallback(
    (term: DictionaryTerm, rect: DOMRect) => {
      setHoverTerm(null);
      setSelectedTerm(term);
      if (isMobile) setShowBottomSheet(true);
      else setPopoverPos({ top: rect.bottom, left: rect.left });
    },
    [isMobile]
  );
  const handleTermHover = useCallback(
    (term: DictionaryTerm, rect: DOMRect) => {
      if (isMobile) return;
      setHoverTerm(term);
      setHoverPos({ top: rect.top, bottom: rect.bottom, left: rect.left + rect.width / 2 });
    },
    [isMobile]
  );
  const handleTermLeave = useCallback(() => setHoverTerm(null), []);
  const closePopover = useCallback(() => {
    setSelectedTerm(null);
    setPopoverPos(null);
    setShowBottomSheet(false);
  }, []);

  const handleComplete = async () => {
    if (!lesson || completing) return;
    setCompleting(true);
    try {
      await completeLesson(lesson.lessonNo, lesson.id);
    } catch {
      // handled in hook
    } finally {
      setCompleting(false);
    }
  };

  const toggleDualMode = () => {
    const next = dualMode ? 'single' : 'dual';
    setDualMode(!dualMode);
    setDisplayMode(next);
  };

  // ── Admin in-place editing ──
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
  const cancelEditing = () => {
    setEditing(false);
    setSaveError(null);
  };
  const saveEditing = async () => {
    if (!lesson || saving) return;
    setSaving(true);
    setSaveError(null);
    const ok = await updateLesson(lesson.id, { [titleField]: editTitle, [contentField]: editContent });
    setSaving(false);
    if (ok) setEditing(false);
    else setSaveError('Lưu thất bại — kiểm tra quyền admin hoặc kết nối mạng.');
  };

  const cycleFont = (dir: number) => {
    const i = FONT_SIZES.indexOf(fontSize);
    const next = Math.min(FONT_SIZES.length - 1, Math.max(0, i + dir));
    setFontSize(FONT_SIZES[next]);
  };

  if (lessonsLoading || progressLoading) {
    return <LoadingState message="Đang tải bài học..." />;
  }
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
  const summary = getLocalized(lesson, 'summary', interfaceLang);
  const dictionaryTargetLang = getDefaultTargetLanguage(contentLang);
  const secondLang: Language = contentLang === 'vi' ? 'en' : contentLang === 'en' ? 'vi' : 'en';
  const secondContent = getLocalized(lesson, 'content', secondLang);
  const isCompleted = status === 'completed';

  // "Tĩnh lặng" reading style → airier line-height + narrower column.
  const contentStyle: React.CSSProperties =
    readerStyle === 'B'
      ? ({ ['--reader-line-height' as string]: '2', maxWidth: '720px', marginInline: 'auto' } as React.CSSProperties)
      : {};

  return (
    <div className="page-enter">
      {/* Top reading-progress bar */}
      {!editing && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-wit-red to-wit-gold transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="max-w-[1180px] mx-auto">
        {/* Top bar: breadcrumb + lesson navigator */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <nav className="flex items-center gap-1.5 text-sm text-wit-text-tertiary flex-wrap min-w-0">
            <Link to="/" className="hover:text-wit-text transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" /> Trang chủ
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link to="/curriculum" className="hover:text-wit-text transition-colors">Giáo trình</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-wit-text font-medium">Học phần {String(lesson.lessonNo).padStart(2, '0')}</span>
          </nav>
          <button
            onClick={() => setNavOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text hover:bg-wit-surface-2 transition-colors"
          >
            <LayoutGrid className="h-4 w-4" /> 76 học phần
          </button>
        </div>

        {/* Hero header */}
        <header>
          <div className="flex items-center gap-2 flex-wrap">
            {chapterTitle && (
              <span className="inline-block px-3 py-1 text-[11.5px] font-semibold rounded-full bg-wit-gold-soft text-wit-gold">
                {chapterTitle}
              </span>
            )}
            {isAdmin && <AdminPreviewBadge />}
          </div>
          <h1 className="font-serif font-bold text-wit-text leading-[1.12] tracking-tight mt-4 text-[clamp(28px,4.2vw,44px)] max-w-[880px]">
            {title}
          </h1>
          {summary && (
            <p className="mt-3.5 text-[15.5px] leading-relaxed text-wit-text-secondary max-w-[660px]">
              {summary}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-wit-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-wit-text-tertiary" />
              <b className="font-semibold text-wit-text">~{readMinutes} phút đọc</b>
            </span>
            {partCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <LayoutList className="h-4 w-4 text-wit-text-tertiary" /> {partCount} phần
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-4 w-4 text-wit-text-tertiary" /> {LANG_LABELS[contentLang]}
            </span>
          </div>
        </header>

        {/* Controls row: language + dual + admin edit */}
        <div className="flex items-center justify-between gap-4 mt-7 mb-6 flex-wrap">
          <div className={`flex items-center gap-1 bg-wit-surface-2 rounded-full p-1 ${editing ? 'opacity-40 pointer-events-none' : ''}`}>
            {(['vi', 'en', 'jp'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setContentLang(lang)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                  contentLang === lang
                    ? 'bg-wit-red text-white shadow-card'
                    : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
                }`}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={toggleDualMode}
                className={`desktop-only flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all duration-200 border ${
                  dualMode
                    ? 'bg-wit-red-soft border-wit-red/30 text-wit-red'
                    : 'bg-wit-surface border-wit-line text-wit-text-secondary hover:border-wit-red/30 hover:text-wit-red'
                }`}
              >
                {dualMode ? (<><Columns2 className="h-4 w-4" /> Song ngữ</>) : (<><AlignLeft className="h-4 w-4" /> Đơn ngữ</>)}
              </button>
            )}
            {isAdmin && !editing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium border border-wit-line bg-wit-surface text-wit-text-secondary hover:border-wit-red/30 hover:text-wit-red transition-all duration-200"
              >
                <Pencil className="h-4 w-4" /> Sửa nội dung
              </button>
            )}
          </div>
        </div>

        {/* Mobile TOC chip strip */}
        {!editing && !dualMode && toc.length > 1 && (
          <div className="lg:hidden sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 mb-4 bg-wit-paper/95 backdrop-blur border-b border-wit-line">
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {toc.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => scrollToSec(t.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    activeSec === i
                      ? 'bg-wit-red text-white border-wit-red'
                      : 'bg-wit-surface text-wit-text-secondary border-wit-line'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')} · {t.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main grid: TOC rail + content */}
        <div className={showRail ? 'lg:grid lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-10 lg:items-start' : ''}>
          {/* TOC rail (desktop) */}
          {showRail && (
            <aside className="hidden lg:block sticky top-7 self-start">
              <div className="flex items-center justify-between gap-2 pl-1 pb-3">
                <span className="text-[10.5px] font-bold uppercase tracking-[1.6px] text-wit-text-tertiary">
                  Nội dung học phần
                </span>
                <button
                  onClick={() => setTocHidden(true)}
                  className="text-[11.5px] font-semibold text-wit-text-tertiary hover:text-wit-text transition-colors"
                  title="Ẩn mục lục"
                >
                  Ẩn ✕
                </button>
              </div>
              <nav className="flex flex-col gap-0.5">
                {toc.length === 0 && (
                  <span className="text-[13px] text-wit-text-tertiary px-2 py-1">Đang lập mục lục…</span>
                )}
                {toc.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => scrollToSec(t.id)}
                    className={`flex items-center gap-3 w-full text-left px-2.5 py-2 rounded-button text-[13.5px] transition-all duration-150 ${
                      activeSec === i
                        ? 'bg-wit-red-soft text-wit-red font-semibold'
                        : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums ${
                        activeSec === i ? 'bg-wit-red text-white' : 'bg-wit-surface-2 text-wit-text-tertiary'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 line-clamp-2">{t.text}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-4 p-3.5 rounded-card border border-wit-line bg-wit-surface">
                <div className="flex justify-between text-[11.5px] text-wit-text-tertiary mb-2">
                  <span>Tiến độ đọc</span>
                  <span className="font-bold text-wit-red">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-wit-line overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-wit-red to-wit-gold rounded-full transition-[width] duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </aside>
          )}

          {/* Content column */}
          <main className="min-w-0">
            {editing ? (
              /* ── Admin editor ── */
              <div className="mb-12 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm font-semibold text-wit-text">
                    <Pencil className="h-4 w-4 text-wit-red" /> Đang sửa · {LANG_LABELS[contentLang]}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-medium border border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text transition-all duration-200 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" /> Huỷ
                    </button>
                    <button
                      onClick={saveEditing}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-button text-sm font-semibold bg-wit-red text-white hover:bg-wit-red-hover shadow-card transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Tiêu đề học phần"
                  className="w-full px-4 py-2.5 rounded-button border border-wit-line bg-wit-surface font-serif text-lg font-bold text-wit-text focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  spellCheck={false}
                  className="w-full min-h-[60vh] px-4 py-3 rounded-button border border-wit-line bg-wit-surface font-mono text-[13px] leading-relaxed text-wit-text focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all resize-y"
                />
                {saveError && <p className="text-sm text-wit-red font-medium">{saveError}</p>}
                <p className="text-xs text-wit-text-tertiary leading-relaxed">
                  Nội dung dùng định dạng Markdown: <code>#</code> tiêu đề, <code>**đậm**</code>,{' '}
                  <code>-</code> danh sách, <code>&gt;</code> trích dẫn. Thay đổi lưu trực tiếp vào học phần cho ngôn ngữ <b>{LANG_LABELS[contentLang]}</b>.
                </p>
              </div>
            ) : dualMode && !isMobile ? (
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="border-r border-wit-line pr-8 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-wit-text-tertiary uppercase tracking-wider">{LANG_LABELS[contentLang]}</span>
                    <button onClick={() => speakText(title, contentLang)} className="text-wit-text-tertiary hover:text-wit-red transition-colors">
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <TermHighlighter content={content} terms={terms} language={contentLang} onTermClick={handleTermClick} onTermHover={handleTermHover} onTermLeave={handleTermLeave} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-wit-text-tertiary uppercase tracking-wider">{LANG_LABELS[secondLang]}</span>
                    <button onClick={() => speakText(getLocalized(lesson, 'title', secondLang), secondLang)} className="text-wit-text-tertiary hover:text-wit-red transition-colors">
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <TermHighlighter content={secondContent} terms={terms} language={secondLang} onTermClick={handleTermClick} onTermHover={handleTermHover} onTermLeave={handleTermLeave} />
                </div>
              </div>
            ) : (
              <div ref={contentRef} className="mb-12" style={contentStyle}>
                <TermHighlighter content={content} terms={terms} language={contentLang} onTermClick={handleTermClick} onTermHover={handleTermHover} onTermLeave={handleTermLeave} />
              </div>
            )}

            {/* Bottom actions */}
            <div className="border-t border-wit-line pt-8 pb-24 md:pb-12 flex flex-col sm:flex-row items-center gap-4">
              {isCompleted ? (
                <div className="flex items-center gap-2 text-wit-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Đã hoàn thành bài này</span>
                </div>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="flex items-center gap-2 px-6 py-3 rounded-button bg-wit-red text-white font-medium text-sm hover:bg-wit-red-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-card hover:shadow-card-hover"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completing ? 'Đang lưu...' : 'Hoàn thành bài học'}
                </button>
              )}
              {nextLesson && (
                <Link
                  to={`/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-button bg-wit-surface border border-wit-line text-wit-text font-medium text-sm hover:border-wit-red/30 hover:text-wit-red transition-all duration-200"
                >
                  Bài tiếp theo <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Restore-TOC floating button (desktop, when hidden) */}
      {!editing && !dualMode && tocHidden && (
        <button
          onClick={() => setTocHidden(false)}
          className="hidden lg:inline-flex items-center gap-2 fixed left-5 bottom-5 z-[55] px-4 py-2.5 rounded-full bg-wit-surface border border-wit-line shadow-popover text-sm font-semibold text-wit-text-secondary hover:text-wit-text transition-colors"
        >
          <List className="h-4 w-4" /> Mục lục
        </button>
      )}

      {/* Floating presentation controls */}
      {!editing && (
        <div className="fixed right-4 bottom-[84px] md:bottom-5 z-[55] flex flex-col items-end gap-2">
          {panelOpen && (
            <div className="flex flex-col items-end gap-2 animate-slide-up">
              {/* Reader style */}
              <div className="flex items-center gap-1.5 bg-wit-surface border border-wit-line shadow-popover rounded-card pl-3 pr-1.5 py-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-text-tertiary mr-0.5">Phong cách</span>
                {(['A', 'B'] as ReaderStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setReaderStyle(s)}
                    className={`px-2.5 py-1.5 rounded-button text-xs font-semibold transition-colors ${
                      readerStyle === s ? 'bg-wit-red text-white' : 'text-wit-text-secondary hover:bg-wit-surface-2'
                    }`}
                  >
                    {s === 'A' ? 'A · Giáo trình' : 'B · Tĩnh lặng'}
                  </button>
                ))}
              </div>
              {/* Theme */}
              <div className="flex items-center gap-1.5 bg-wit-surface border border-wit-line shadow-popover rounded-card pl-3 pr-1.5 py-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-text-tertiary mr-0.5">Nền</span>
                {THEME_ORDER.map((t) => {
                  const Icon = THEME_META[t].icon;
                  return (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      title={THEME_META[t].label}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-button text-xs font-semibold transition-colors ${
                        theme === t ? 'bg-wit-gold text-white' : 'text-wit-text-secondary hover:bg-wit-surface-2'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {THEME_META[t].label}
                    </button>
                  );
                })}
              </div>
              {/* Font size */}
              <div className="flex items-center gap-1.5 bg-wit-surface border border-wit-line shadow-popover rounded-card pl-3 pr-1.5 py-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-[1.2px] text-wit-text-tertiary mr-0.5">Cỡ chữ</span>
                <button
                  onClick={() => cycleFont(-1)}
                  disabled={fontSize === 'small'}
                  className="w-7 h-7 flex items-center justify-center rounded-button text-wit-text-secondary hover:bg-wit-surface-2 disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-semibold text-wit-text w-12 text-center capitalize">
                  {fontSize === 'small' ? 'Nhỏ' : fontSize === 'large' ? 'Lớn' : 'Vừa'}
                </span>
                <button
                  onClick={() => cycleFont(1)}
                  disabled={fontSize === 'large'}
                  className="w-7 h-7 flex items-center justify-center rounded-button text-wit-text-secondary hover:bg-wit-surface-2 disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-wit-surface border border-wit-line shadow-popover text-sm font-semibold text-wit-text-secondary hover:text-wit-text transition-colors"
          >
            {panelOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            <span className="hidden sm:inline">{panelOpen ? 'Ẩn tùy chọn' : 'Tùy chọn'}</span>
          </button>
        </div>
      )}

      {/* Hover tooltip (desktop) */}
      {hoverTerm && hoverPos && !isMobile && !selectedTerm && (
        <TermTooltip term={hoverTerm} targetLang={dictionaryTargetLang} position={hoverPos} />
      )}

      {/* Term popover (desktop) */}
      {selectedTerm && popoverPos && !isMobile && (
        <TermPopover term={selectedTerm} sourceLang={contentLang} targetLang={dictionaryTargetLang} position={popoverPos} onClose={closePopover} />
      )}

      {/* Term bottom sheet (mobile) */}
      <BottomSheet isOpen={showBottomSheet} onClose={closePopover}>
        {selectedTerm && (
          <TermSheetContent term={selectedTerm} sourceLang={contentLang} targetLang={dictionaryTargetLang} />
        )}
      </BottomSheet>

      {/* Lesson navigator drawer ("76 học phần") */}
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

function TermSheetContent({
  term,
  sourceLang,
  targetLang,
}: {
  term: DictionaryTerm;
  sourceLang: Language;
  targetLang: Language;
}) {
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
          <button onClick={() => speakText(sourceTerm, sourceLang)} className="text-wit-text-tertiary hover:text-wit-red transition-colors">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        {(sourceIpa || sourceKana) && (
          <p className="text-xs text-wit-text-tertiary">
            {sourceIpa && `/${sourceIpa}/`}
            {sourceIpa && sourceKana && ' · '}
            {sourceKana}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {term.category && (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-red-soft text-wit-red">{term.category}</span>
        )}
        {sourcePos && (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-surface-2 text-wit-text-secondary">{sourcePos}</span>
        )}
      </div>

      {sourceDef && <p className="text-sm text-wit-text leading-relaxed">{sourceDef}</p>}

      <>
        <div className="border-t border-wit-line" />
        <div>
          <p className="text-xs text-wit-text-tertiary mb-1 uppercase tracking-wider">
            {targetLang === 'vi' ? 'Tiếng Việt' : targetLang === 'en' ? 'English' : '日本語'}
          </p>
          {hasTranslation ? (
            <>
              {targetTerm && (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-wit-text">{targetTerm}</p>
                  <button onClick={() => speakText(targetTerm, targetLang)} className="text-wit-text-tertiary hover:text-wit-red transition-colors">
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {(targetIpa || targetKana || targetPos) && (
                <p className="text-xs text-wit-text-tertiary mt-0.5">
                  {targetIpa && `/${targetIpa}/`}
                  {targetIpa && (targetKana || targetPos) && ' · '}
                  {targetKana}
                  {targetKana && targetPos && ' · '}
                  {targetPos}
                </p>
              )}
              {targetDef && <p className="text-sm text-wit-text-secondary mt-1 leading-relaxed">{targetDef}</p>}
            </>
          ) : (
            <p className="text-sm text-wit-text-tertiary italic">Chưa có dữ liệu dịch cho thuật ngữ này.</p>
          )}
        </div>
      </>
    </div>
  );
}
