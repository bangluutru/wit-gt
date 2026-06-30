// ============================================================
// WiT Platform - Lesson Navigator Drawer ("76 học phần")
// ============================================================
// Slide-out panel listing every lesson grouped by chapter, with the
// current lesson highlighted, completed lessons marked, and locked
// lessons dimmed. Mirrors the "76 học phần" design.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Lock } from 'lucide-react';
import type { Chapter, Lesson, Language } from '../../lib/types';
import { getLocalized } from '../../lib/types';
import { getLessonStatusForUser } from '../../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  lessons: Lesson[];
  currentLessonId: string;
  completedLessons: Set<number>;
  isAdmin: boolean;
  lang: Language;
}

export function LessonNavDrawer({
  isOpen,
  onClose,
  chapters,
  lessons,
  currentLessonId,
  completedLessons,
  isAdmin,
  lang,
}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sortedChapters = [...chapters].sort((a, b) => a.orderIndex - b.orderIndex);

  const go = (lessonId: string) => {
    onClose();
    navigate(`/lessons/${lessonId}`);
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="76 học phần">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1C1814]/45 animate-fade-in" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <aside className="absolute top-0 left-0 bottom-0 w-[min(420px,90vw)] flex flex-col bg-wit-paper border-r border-wit-line shadow-popover animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-wit-line shrink-0">
          <div className="min-w-0">
            <div className="font-serif text-lg font-bold text-wit-text leading-tight">76 Học phần</div>
            <div className="text-xs text-wit-text-tertiary mt-0.5 truncate">
              Giáo trình Nâng tầm nhận thức nội tâm
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-button bg-wit-surface-2 text-wit-text-secondary hover:text-wit-text transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 pb-10">
          {sortedChapters.map((ch) => {
            const chLessons = lessons
              .filter((l) => l.chapterId === ch.id)
              .sort((a, b) => a.lessonNo - b.lessonNo);
            if (chLessons.length === 0) return null;

            return (
              <div key={ch.id} className="mb-4">
                {/* Chapter header */}
                <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
                  <span className="shrink-0 w-6 h-6 rounded-md bg-wit-gold text-white text-xs font-bold flex items-center justify-center">
                    {ch.orderIndex}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-wit-text-secondary leading-snug">
                    {getLocalized(ch, 'title', lang)}
                  </span>
                </div>

                {/* Lessons */}
                {chLessons.map((l) => {
                  const isCurrent = l.id === currentLessonId;
                  const isDone = completedLessons.has(l.lessonNo);
                  const status = getLessonStatusForUser(l.lessonNo, completedLessons, isAdmin);
                  const locked = status === 'locked';

                  return (
                    <button
                      key={l.id}
                      type="button"
                      disabled={locked}
                      onClick={() => !locked && go(l.id)}
                      className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 mb-0.5 rounded-button text-[13px] font-medium transition-colors ${
                        isCurrent
                          ? 'bg-wit-red-soft text-wit-red'
                          : locked
                          ? 'text-wit-text-tertiary opacity-60 cursor-not-allowed'
                          : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text cursor-pointer'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-[30px] h-6 rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums ${
                          isCurrent ? 'bg-wit-red text-white' : 'bg-wit-surface-2 text-wit-text-tertiary'
                        }`}
                      >
                        {l.lessonNo}
                      </span>
                      <span className="flex-1 leading-snug line-clamp-2">{getLocalized(l, 'title', lang)}</span>
                      {locked ? (
                        <Lock className="h-3.5 w-3.5 shrink-0 text-wit-text-tertiary" />
                      ) : isDone ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-wit-success" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
