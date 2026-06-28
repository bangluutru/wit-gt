import { Link } from 'react-router-dom';
import { CheckCircle2, BookOpen, Lock } from 'lucide-react';
import type { Lesson, LessonStatus, Chapter, Language } from '../../lib/types';
import { getLocalized } from '../../lib/types';
import { cn } from '../../lib/utils';

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  chapter?: Chapter;
  lang: Language;
}

const statusConfig: Record<
  LessonStatus,
  { bg: string; text: string; border: string; icon: typeof CheckCircle2; cta: string }
> = {
  completed: {
    bg: 'bg-wit-success',
    text: 'text-white',
    border: 'border-wit-success/30',
    icon: CheckCircle2,
    cta: 'Ôn lại',
  },
  accessible: {
    bg: 'bg-wit-red',
    text: 'text-white',
    border: 'border-wit-red/30',
    icon: BookOpen,
    cta: 'Học ngay',
  },
  locked: {
    bg: 'bg-wit-line',
    text: 'text-wit-text-tertiary',
    border: 'border-wit-line',
    icon: Lock,
    cta: 'Chưa mở',
  },
};

export function LessonCard({ lesson, status, chapter, lang }: LessonCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isLocked = status === 'locked';

  const title = getLocalized(lesson, 'title', lang);
  const summary = getLocalized(lesson, 'summary', lang);
  const chapterTitle = chapter ? getLocalized(chapter, 'title', lang) : '';

  const card = (
    <div
      className={cn(
        'group bg-wit-surface rounded-card shadow-card border border-wit-line/50 p-5',
        'transition-all duration-200',
        !isLocked && 'hover:shadow-card-hover hover:-translate-y-0.5',
        isLocked && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Lesson number circle */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            'text-sm font-bold',
            config.bg,
            config.text
          )}
        >
          {lesson.lessonNo}
        </div>

        <div className="flex-1 min-w-0">
          {/* Chapter badge */}
          {chapterTitle && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-gold-soft text-wit-gold mb-1.5">
              {chapterTitle}
            </span>
          )}

          {/* Title */}
          <h3
            className={cn(
              'font-semibold text-wit-text leading-snug mb-1',
              !isLocked && 'group-hover:text-wit-red transition-colors duration-200'
            )}
          >
            {title}
          </h3>

          {/* Summary */}
          {summary && (
            <p className="text-sm text-wit-text-secondary line-clamp-2 mb-3">
              {summary}
            </p>
          )}

          {/* Status CTA */}
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{config.cta}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLocked) return card;

  return (
    <Link to={`/lessons/${lesson.id}`} className="block no-underline text-inherit">
      {card}
    </Link>
  );
}
