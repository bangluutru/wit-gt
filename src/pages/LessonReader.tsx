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
} from 'lucide-react';
import { useLessons } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useDictionary } from '../hooks/useDictionary';
import { useSettings } from '../contexts/SettingsContext';
import { getLessonStatus, speakText } from '../lib/utils';
import { getLocalized } from '../lib/types';
import type { Language, DictionaryTerm, LessonStatus } from '../lib/types';
import { TermHighlighter } from '../components/reader/TermHighlighter';
import { TermPopover } from '../components/reader/TermPopover';
import { BottomSheet } from '../components/reader/BottomSheet';
import { ReadingToolbar } from '../components/reader/ReadingToolbar';
import { LoadingState } from '../components/ui';

const LANG_LABELS: Record<Language, string> = {
  vi: 'VI',
  en: 'EN',
  jp: 'JP',
};

export default function LessonReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { lessons, chapters, loading: lessonsLoading, getLessonById, getChapter } = useLessons();
  const { completedLessons, loading: progressLoading, completeLesson } = useProgress();
  const { terms } = useDictionary();
  const { interfaceLang, preferredSourceLang, preferredTargetLang, displayMode, setDisplayMode } =
    useSettings();

  // Local state
  const [contentLang, setContentLang] = useState<Language>(preferredSourceLang);
  const [dualMode, setDualMode] = useState(displayMode === 'dual');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [completing, setCompleting] = useState(false);

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
    ? getLessonStatus(lesson.lessonNo, completedLessons)
    : 'locked';

  // Find next lesson
  const nextLesson = lesson
    ? lessons.find((l) => l.lessonNo === lesson.lessonNo + 1)
    : undefined;

  // Handle term click — desktop: popover, mobile: bottom sheet
  const handleTermClick = useCallback(
    (term: DictionaryTerm, rect: DOMRect) => {
      setSelectedTerm(term);
      if (isMobile) {
        setShowBottomSheet(true);
      } else {
        setPopoverPos({ top: rect.bottom + window.scrollY, left: rect.left });
      }
    },
    [isMobile]
  );

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

  // Access check
  if (status === 'locked') {
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

      {/* Title */}
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-wit-text leading-tight mb-6">
        {title}
      </h1>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-wit-surface-alt rounded-full p-1">
          {(['vi', 'en', 'jp'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setContentLang(lang)}
              className={`
                px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200
                ${
                  contentLang === lang
                    ? 'bg-wit-red text-white shadow-sm'
                    : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
                }
              `}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Dual mode toggle (desktop only) */}
        <button
          onClick={toggleDualMode}
          className={`
            desktop-only flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
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
      </div>

      {/* Content area */}
      {dualMode && !isMobile ? (
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
              flex items-center gap-2 px-6 py-3 rounded-xl
              bg-wit-red text-white font-medium text-sm
              hover:bg-wit-red-hover transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md
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
              flex items-center gap-2 px-6 py-3 rounded-xl
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

      {/* Term popover (desktop) */}
      {selectedTerm && popoverPos && !isMobile && (
        <TermPopover
          term={selectedTerm}
          sourceLang={contentLang}
          targetLang={contentLang === preferredTargetLang ? preferredSourceLang : preferredTargetLang}
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
            targetLang={contentLang === preferredTargetLang ? preferredSourceLang : preferredTargetLang}
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
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-surface-alt text-wit-text-secondary">
            {sourcePos}
          </span>
        )}
      </div>

      {sourceDef && (
        <p className="text-sm text-wit-text leading-relaxed">{sourceDef}</p>
      )}

      {/* Translation */}
      {(targetTerm || targetDef) && (
        <>
          <div className="border-t border-wit-line" />
          <div>
            <p className="text-xs text-wit-text-tertiary mb-1 uppercase tracking-wider">
              {targetLang === 'vi' ? 'Tiếng Việt' : targetLang === 'en' ? 'English' : '日本語'}
            </p>
            {targetTerm && (
              <p className="text-sm font-semibold text-wit-text">{targetTerm}</p>
            )}
            {targetDef && (
              <p className="text-sm text-wit-text-secondary mt-0.5 leading-relaxed">
                {targetDef}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
