// ============================================================
// WiT Platform - Roadmap Page
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  BookOpen,
  Lock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useLessons } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../contexts/SettingsContext';
import { getLocalized, type Language } from '../lib/types';
import { getLessonStatus, getCurrentLessonNo } from '../lib/utils';
import type { Chapter, Lesson, LessonStatus } from '../lib/types';

type ChapterStatus = 'completed' | 'current' | 'locked';

export default function Roadmap() {
  const { lessons, chapters, loading } = useLessons();
  const { completedLessons, loading: progressLoading } = useProgress();
  const { interfaceLang } = useSettings();

  const currentLessonNo = getCurrentLessonNo(completedLessons);

  // Determine which chapter contains the current lesson
  const currentChapterId = useMemo(() => {
    if (!lessons.length) return null;
    const currentLesson = lessons.find((l) => l.lessonNo === currentLessonNo);
    return currentLesson?.chapterId ?? chapters[0]?.id ?? null;
  }, [lessons, chapters, currentLessonNo]);

  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    () => new Set(currentChapterId ? [currentChapterId] : [])
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  /** Get derived data for a chapter */
  const getChapterData = (chapter: Chapter) => {
    const chapterLessons = lessons
      .filter((l) => l.chapterId === chapter.id)
      .sort((a, b) => a.lessonNo - b.lessonNo);

    const completedInChapter = chapterLessons.filter((l) =>
      completedLessons.has(l.lessonNo)
    ).length;

    let status: ChapterStatus = 'locked';
    if (completedInChapter === chapterLessons.length && chapterLessons.length > 0) {
      status = 'completed';
    } else if (
      chapterLessons.some(
        (l) => getLessonStatus(l.lessonNo, completedLessons) === 'accessible'
      )
    ) {
      status = 'current';
    }

    return { chapterLessons, completedInChapter, status };
  };

  if (loading || progressLoading) {
    return (
      <div className="page-enter flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-wit-line border-t-wit-gold rounded-full animate-spin" />
          <p className="text-wit-text-secondary text-sm">Đang tải lộ trình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      {/* ── Header ── */}
      <h1 className="font-serif text-2xl font-semibold text-wit-text">
        Lộ trình học tập
      </h1>

      {/* ── Timeline ── */}
      <div className="space-y-0">
        {chapters.map((chapter, idx) => {
          const { chapterLessons, completedInChapter, status } = getChapterData(chapter);
          const isExpanded = expandedChapters.has(chapter.id);
          const isLast = idx === chapters.length - 1;

          return (
            <ChapterBlock
              key={chapter.id}
              chapter={chapter}
              chapterLessons={chapterLessons}
              completedInChapter={completedInChapter}
              totalInChapter={chapterLessons.length}
              status={status}
              isExpanded={isExpanded}
              isLast={isLast}
              lang={interfaceLang}
              completedLessons={completedLessons}
              onToggle={() => toggleChapter(chapter.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Chapter Block ── */

function ChapterBlock({
  chapter,
  chapterLessons,
  completedInChapter,
  totalInChapter,
  status,
  isExpanded,
  isLast,
  lang,
  completedLessons,
  onToggle,
}: {
  chapter: Chapter;
  chapterLessons: Lesson[];
  completedInChapter: number;
  totalInChapter: number;
  status: ChapterStatus;
  isExpanded: boolean;
  isLast: boolean;
  lang: Language;
  completedLessons: Set<number>;
  onToggle: () => void;
}) {
  // Line color
  const lineColor =
    status === 'completed'
      ? 'bg-wit-success'
      : status === 'current'
        ? 'bg-wit-gold'
        : 'bg-wit-line';

  // Node style
  const nodeStyle =
    status === 'completed'
      ? 'bg-wit-success text-white'
      : status === 'current'
        ? 'bg-wit-red text-white'
        : 'bg-wit-line text-wit-text-tertiary';

  // Completion badge style
  const badgeStyle =
    status === 'completed'
      ? 'bg-wit-success-soft text-wit-success'
      : status === 'current'
        ? 'bg-wit-gold-soft text-wit-gold'
        : 'bg-wit-surface-alt text-wit-text-tertiary';

  return (
    <div className={`relative pl-10 ${isLast ? 'pb-2' : 'pb-8'}`}>
      {/* Vertical line */}
      {!isLast && (
        <div
          className={`absolute left-4 top-0 bottom-0 w-0.5 ${lineColor}`}
          style={{ transform: 'translateX(-50%)' }}
        />
      )}

      {/* Circle node */}
      <div
        className={`absolute left-[9px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${nodeStyle}`}
      >
        {status === 'completed' ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          chapter.orderIndex
        )}
      </div>

      {/* Header — clickable */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full cursor-pointer flex items-start sm:items-center gap-3 text-left group"
      >
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-lg font-semibold text-wit-text leading-snug group-hover:text-wit-red transition-colors">
            {getLocalized(chapter, 'title', lang)}
          </h2>
          <p className="text-sm text-wit-text-secondary mt-0.5 line-clamp-1">
            {getLocalized(chapter, 'description', lang)}
          </p>
        </div>

        {/* Completion badge */}
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${badgeStyle}`}
        >
          {completedInChapter}/{totalInChapter}
        </span>

        {/* Chevron */}
        <span className="shrink-0 text-wit-text-tertiary mt-0.5">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* Expanded lesson list */}
      {isExpanded && chapterLessons.length > 0 && (
        <div className="space-y-2 mt-4">
          {chapterLessons.map((lesson) => {
            const lessonStatus = getLessonStatus(lesson.lessonNo, completedLessons);
            return (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                status={lessonStatus}
                lang={lang}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Lesson Row ── */

function LessonRow({
  lesson,
  status,
  lang,
}: {
  lesson: Lesson;
  status: LessonStatus;
  lang: Language;
}) {
  const icon =
    status === 'completed' ? (
      <CheckCircle className="w-4 h-4 text-wit-success shrink-0" />
    ) : status === 'accessible' ? (
      <BookOpen className="w-4 h-4 text-wit-gold shrink-0" />
    ) : (
      <Lock className="w-3.5 h-3.5 text-wit-text-tertiary shrink-0" />
    );

  const rowStyle =
    status === 'completed'
      ? 'hover:bg-wit-success-soft/30 cursor-pointer'
      : status === 'accessible'
        ? 'bg-wit-gold-soft/30 cursor-pointer'
        : 'opacity-50 cursor-not-allowed';

  const content = (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${rowStyle}`}
    >
      {icon}
      <span className="w-6 text-sm text-wit-text-tertiary text-right shrink-0 tabular-nums">
        {lesson.lessonNo}
      </span>
      <span
        className={`text-sm ${
          status === 'locked' ? 'text-wit-text-tertiary' : 'text-wit-text'
        }`}
      >
        {getLocalized(lesson, 'title', lang)}
      </span>
    </div>
  );

  if (status === 'locked') {
    return content;
  }

  return (
    <Link to={`/lessons/${lesson.id}`} className="block">
      {content}
    </Link>
  );
}
