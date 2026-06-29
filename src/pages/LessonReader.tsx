import { useState, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Home,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Lock,
  Columns2,
  AlignLeft,
  Volume2,
  Pencil,
  Save,
  X,
} from 'lucide-react';
import { useLessons, type LessonEditableField } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useDictionary } from '../hooks/useDictionary';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { getLessonStatusForUser, getDefaultTargetLanguage, speakText } from '../lib/utils';
import { getLocalized } from '../lib/types';
import type { Language, DictionaryTerm, LessonStatus } from '../lib/types';
import { TermHighlighter } from '../components/reader/TermHighlighter';
import { TermPopover } from '../components/reader/TermPopover';
import { TermTooltip } from '../components/reader/TermTooltip';
import { BottomSheet } from '../components/reader/BottomSheet';
import { ReadingToolbar } from '../components/reader/ReadingToolbar';
import { LoadingState, AdminPreviewBadge } from '../components/ui';

const LANG_LABELS: Record<Language, string> = {
  vi: 'VI',
  en: 'EN',
  jp: 'JP',
};

export default function LessonReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { lessons, chapters, loading: lessonsLoading, getLessonById, getChapter, updateLesson } = useLessons();
  const { completedLessons, loading: progressLoading, completeLesson } = useProgress();
  const { terms } = useDictionary();
  const { interfaceLang, preferredSourceLang, displayMode, setDisplayMode } =
    useSettings();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  // Local state
  const [contentLang, setContentLang] = useState<Language>(preferredSourceLang);
  const [dualMode, setDualMode] = useState(displayMode === 'dual');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [completing, setCompleting] = useState(false);
  // Admin in-place editing
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Hover tooltip (desktop): quick meaning in the target language.
  const [hoverTerm, setHoverTerm] = useState<DictionaryTerm | null>(null);
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number; bottom: number } | null>(null);

  // Determine if we're on mobile
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Sync dual mode with settings
  useEffect(() => {
    setDualMode(displayMode === 'dual');
  }, [displayMode]);

  const lesson = id ? getLessonById(id) : undefined;
  const chapter = lesson ? getChapter(lesson.chapterId) : undefined;
  const status: LessonStatus = lesson
    ? getLessonStatusForUser(lesson.lessonNo, completedLessons, isAdmin)
    : 'locked';

  // Find next lesson
  const nextLesson = lesson
    ? lessons.find((l) => l.lessonNo === lesson.lessonNo + 1)
    : undefined;

  // Handle term click — desktop: popover, mobile: bottom sheet.
  // The popover is position:fixed, so use viewport coordinates (no scrollY).
  const handleTermClick = useCallback(
    (term: DictionaryTerm, rect: DOMRect) => {
      setHoverTerm(null);
      setSelectedTerm(term);
      if (isMobile) {
        setShowBottomSheet(true);
      } else {
        setPopoverPos({ top: rect.bottom, left: rect.left });
      }
    },
    [isMobile]
  );

  // Hover (desktop only) — quick tooltip with the target-language meaning.
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

  // Complete lesson
  const handleComplete = async () => {
    if (!lesson || completing) return;
    setCompleting(true);
    try {
      await completeLesson(lesson.lessonNo, lesson.id);
    } catch {
      // Error handled in hook
    } finally {
      setCompleting(false);
    }
  };

  // Toggle dual mode
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
    const ok = await updateLesson(lesson.id, {
      [titleField]: editTitle,
      [contentField]: editContent,
    });
    setSaving(false);
    if (ok) {
      setEditing(false);
    } else {
      setSaveError('Lưu thất bại — kiểm tra quyền admin hoặc kết nối mạng.');
    }
  };

  // Loading
  if (lessonsLoading || progressLoading) {
    return <LoadingState message="Đang tải bài học..." />;
  }

  // Not found
  if (!lesson) {
    return (
      <div className="page-enter text-center py-20">
        <p className="text-wit-text-secondary mb-4">Không tìm thấy bài học</p>
        <Link to="/curriculum" className="text-wit-red hover:underline">
          Quay lại giáo trình
        </Link>
      </div>
    );
  }

  // Access check — admins bypass the sequential lock entirely.
  if (status === 'locked' && !isAdmin) {
    return (
      <div className="page-enter text-center py-20">
        <Lock className="h-12 w-12 text-wit-text-tertiary mx-auto mb-4" />
        <p className="text-wit-text-secondary mb-4">Bài học này chưa được mở khoá</p>
        <Link to="/curriculum" className="text-wit-red hover:underline">
          Quay lại giáo trình
        </Link>
      </div>
    );
  }

  const title = getLocalized(lesson, 'title', interfaceLang);
  const content = getLocalized(lesson, 'content', contentLang);
  const chapterTitle = chapter ? getLocalized(chapter, 'title', interfaceLang) : '';

  // Dictionary lookup direction: vi lesson → en, en lesson → vi.
  const dictionaryTargetLang = getDefaultTargetLanguage(contentLang);

  // Second language for dual mode
  const secondLang: Language =
    contentLang === 'vi' ? 'en' : contentLang === 'en' ? 'vi' : 'en';
  const secondContent = getLocalized(lesson, 'content', secondLang);

  const isCompleted = status === 'completed';

  return (
    <div className="page-enter max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-wit-text-tertiary mb-6 flex-wrap">
        <Link to="/" className="hover:text-wit-text transition-colors flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/curriculum" className="hover:text-wit-text transition-colors">
          Giáo trình
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-wit-text font-medium">Học phần {lesson.lessonNo}</span>
      </nav>

      {/* Chapter badge */}
      {chapterTitle && (
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-wit-gold-soft text-wit-gold mb-3">
          {chapterTitle}
        </span>
      )}

      {/* Admin preview badge — shown when an admin opens a not-yet-unlocked lesson */}
      {isAdmin && (
        <div className="mb-3">
          <AdminPreviewBadge />
        </div>
      )}

      {/* Title */}
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-wit-text leading-tight mb-6">
        {title}
      </h1>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        {/* Language switcher */}
        <div className={`flex items-center gap-1 bg-wit-surface-2 rounded-full p-1 ${editing ? 'opacity-40 pointer-events-none' : ''}`}>
          {(['vi', 'en', 'jp'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setContentLang(lang)}
              className={`
                px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200
                ${
                  contentLang === lang
                    ? 'bg-wit-red text-white shadow-card'
                    : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
                }
              `}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Right controls: dual mode + admin edit */}
        <div className="flex items-center gap-2">
          {/* Dual mode toggle (desktop only) */}
          {!editing && (
            <button
              onClick={toggleDualMode}
              className={`
                desktop-only flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium
                transition-all duration-200 border
                ${
                  dualMode
                    ? 'bg-wit-red-soft border-wit-red/30 text-wit-red'
                    : 'bg-wit-surface border-wit-line text-wit-text-secondary hover:border-wit-red/30 hover:text-wit-red'
                }
              `}
            >
              {dualMode ? (
                <>
                  <Columns2 className="h-4 w-4" />
                  Song ngữ
                </>
              ) : (
                <>
                  <AlignLeft className="h-4 w-4" />
                  Đơn ngữ
                </>
              )}
            </button>
          )}

          {/* Admin: edit lesson content in place */}
          {isAdmin && !editing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium border border-wit-line bg-wit-surface text-wit-text-secondary hover:border-wit-red/30 hover:text-wit-red transition-all duration-200"
            >
              <Pencil className="h-4 w-4" />
              Sửa nội dung
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      {editing ? (
        /* ── Admin editor ── */
        <div className="mb-12 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-wit-text">
              <Pencil className="h-4 w-4 text-wit-red" />
              Đang sửa · {LANG_LABELS[contentLang]}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-button text-sm font-medium border border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text transition-all duration-200 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Huỷ
              </button>
              <button
                onClick={saveEditing}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-button text-sm font-semibold bg-wit-red text-white hover:bg-wit-red-hover shadow-card transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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

          {saveError && (
            <p className="text-sm text-wit-red font-medium">{saveError}</p>
          )}
          <p className="text-xs text-wit-text-tertiary leading-relaxed">
            Nội dung dùng định dạng Markdown: <code>#</code> tiêu đề, <code>**đậm**</code>,{' '}
            <code>-</code> danh sách, <code>&gt;</code> trích dẫn. Thay đổi lưu trực tiếp vào học phần cho ngôn ngữ <b>{LANG_LABELS[contentLang]}</b>.
          </p>
        </div>
      ) : dualMode && !isMobile ? (
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="border-r border-wit-line pr-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-wit-text-tertiary uppercase tracking-wider">
                {LANG_LABELS[contentLang]}
              </span>
              <button
                onClick={() => speakText(title, contentLang)}
                className="text-wit-text-tertiary hover:text-wit-red transition-colors"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <TermHighlighter
              content={content}
              terms={terms}
              language={contentLang}
              onTermClick={handleTermClick}
              onTermHover={handleTermHover}
              onTermLeave={handleTermLeave}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-wit-text-tertiary uppercase tracking-wider">
                {LANG_LABELS[secondLang]}
              </span>
              <button
                onClick={() => speakText(getLocalized(lesson, 'title', secondLang), secondLang)}
                className="text-wit-text-tertiary hover:text-wit-red transition-colors"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <TermHighlighter
              content={secondContent}
              terms={terms}
              language={secondLang}
              onTermClick={handleTermClick}
              onTermHover={handleTermHover}
              onTermLeave={handleTermLeave}
            />
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <TermHighlighter
            content={content}
            terms={terms}
            language={contentLang}
            onTermClick={handleTermClick}
            onTermHover={handleTermHover}
            onTermLeave={handleTermLeave}
          />
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
            className="
              flex items-center gap-2 px-6 py-3 rounded-button
              bg-wit-red text-white font-medium text-sm
              hover:bg-wit-red-hover transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-card hover:shadow-card-hover
            "
          >
            <CheckCircle2 className="h-4 w-4" />
            {completing ? 'Đang lưu...' : 'Hoàn thành bài học'}
          </button>
        )}

        {nextLesson && (
          <Link
            to={`/lessons/${nextLesson.id}`}
            className="
              flex items-center gap-2 px-6 py-3 rounded-button
              bg-wit-surface border border-wit-line text-wit-text
              font-medium text-sm hover:border-wit-red/30 hover:text-wit-red
              transition-all duration-200
            "
          >
            Bài tiếp theo
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Hover tooltip (desktop) — quick meaning in the target language.
          Hidden while the full click-popover is open. */}
      {hoverTerm && hoverPos && !isMobile && !selectedTerm && (
        <TermTooltip
          term={hoverTerm}
          targetLang={dictionaryTargetLang}
          position={hoverPos}
        />
      )}

      {/* Term popover (desktop) */}
      {selectedTerm && popoverPos && !isMobile && (
        <TermPopover
          term={selectedTerm}
          sourceLang={contentLang}
          targetLang={dictionaryTargetLang}
          position={popoverPos}
          onClose={closePopover}
        />
      )}

      {/* Term bottom sheet (mobile) */}
      <BottomSheet isOpen={showBottomSheet} onClose={closePopover}>
        {selectedTerm && (
          <TermSheetContent
            term={selectedTerm}
            sourceLang={contentLang}
            targetLang={dictionaryTargetLang}
          />
        )}
      </BottomSheet>

      {/* Reading toolbar */}
      <ReadingToolbar />
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
      {/* Source */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl font-bold text-wit-text">{sourceTerm}</span>
          <button
            onClick={() => speakText(sourceTerm, sourceLang)}
            className="text-wit-text-tertiary hover:text-wit-red transition-colors"
          >
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
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-red-soft text-wit-red">
            {term.category}
          </span>
        )}
        {sourcePos && (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-surface-2 text-wit-text-secondary">
            {sourcePos}
          </span>
        )}
      </div>

      {sourceDef && (
        <p className="text-sm text-wit-text leading-relaxed">{sourceDef}</p>
      )}

      {/* Translation — always shown, with a fallback when data is missing */}
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
                  <button
                    onClick={() => speakText(targetTerm, targetLang)}
                    className="text-wit-text-tertiary hover:text-wit-red transition-colors"
                  >
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
              {targetDef && (
                <p className="text-sm text-wit-text-secondary mt-1 leading-relaxed">
                  {targetDef}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-wit-text-tertiary italic">
              Chưa có dữ liệu dịch cho thuật ngữ này.
            </p>
          )}
        </div>
      </>
    </div>
  );
}
