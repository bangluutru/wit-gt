// ============================================================
// WiT Platform - Roadmap Page
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Play, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { useLessons } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { getLocalized } from '../lib/types';
import { getLessonStatusForUser } from '../lib/utils';
import { AdminPreviewBadge } from '../components/ui';
import { CHAPTER_LESSON_RANGES, TOTAL_LESSONS } from '../lib/constants';

export default function Roadmap() {
  const { lessons, chapters, loading: lessonsLoading } = useLessons();
  const { completedLessons, loading: progressLoading } = useProgress();
  const { interfaceLang } = useSettings();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const loading = lessonsLoading || progressLoading;

  // Track expanded chapters
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Determine current lesson number
  const currentLessonNo = useMemo(() => {
    let next = 1;
    while (completedLessons.has(next) && next <= TOTAL_LESSONS) {
      next++;
    }
    return Math.min(next, TOTAL_LESSONS);
  }, [completedLessons]);

  // Set default expanded chapter to the one containing current lesson
  useMemo(() => {
    if (loading || !chapters.length) return;
    const currentChapter = chapters.find((ch) => {
      const range = CHAPTER_LESSON_RANGES[ch.orderIndex];
      return range && currentLessonNo >= range[0] && currentLessonNo <= range[1];
    });
    if (currentChapter && expandedChapters.size === 0) {
      setExpandedChapters(new Set([currentChapter.id]));
    }
  }, [loading, chapters, currentLessonNo, expandedChapters.size]);

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  // Toggle expand
  const toggleChapter = (chapterId: string) => {
    const next = new Set(expandedChapters);
    if (next.has(chapterId)) {
      next.delete(chapterId);
    } else {
      next.add(chapterId);
    }
    setExpandedChapters(next);
  };

  // Calculate chapter stats
  const chapterDetails = useMemo(() => {
    return chapters.map((ch, idx) => {
      const chLessons = lessons.filter((l) => l.chapterId === ch.id);
      const total = chLessons.length;
      const completed = chLessons.filter((l) => completedLessons.has(l.lessonNo)).length;

      const isFirstLessonInChAccessible = chLessons.length > 0 &&
        getLessonStatusForUser(chLessons[0].lessonNo, completedLessons, isAdmin) !== 'locked';

      let status: 'done' | 'current' | 'locked' = 'locked';
      if (completed === total && total > 0) {
        status = 'done';
      } else if (isFirstLessonInChAccessible) {
        status = 'current';
      }

      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const rangeText = chLessons.length > 0 
        ? `${getLocalizedText('Phần', 'Part', 'パート')} ${chLessons[0].lessonNo}–${chLessons[chLessons.length - 1].lessonNo}`
        : '';

      return {
        ...ch,
        total,
        completed,
        status,
        pct,
        rangeText,
        lessons: chLessons,
        showLine: idx < chapters.length - 1,
      };
    });
  }, [chapters, lessons, completedLessons, interfaceLang, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-wit-line border-t-wit-gold rounded-full animate-spin" />
          <p className="text-wit-text-secondary text-sm">
            {getLocalizedText('Đang tải...', 'Loading...', '読み込み中...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
            {getLocalizedText('Hành trình 76 học phần', '76-part journey', '76レッスンの旅')}
          </span>
          {isAdmin && <AdminPreviewBadge />}
        </div>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">
          {getLocalizedText('Lộ trình học tập', 'Learning Roadmap', '学習ロードマップ')}
        </h1>
        <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
          {getLocalizedText(
            'Chín chương nối tiếp nhau như một con đường. Hoàn thành chương trước để mở chương sau — đi từ nền tảng nhận thức đến sự nghiệp giáo dục cho nhân sinh.',
            'Nine chapters connect like a path. Complete the previous chapter to unlock the next — going from foundation awareness to legacy education.',
            '9つの章は小道のように繋がっています。前の章を完了して次の章のロックを解除します。認知の基礎から人類の教育活動のキャリアまで。'
          )}
        </p>
      </div>

      {/* Chapters Timeline List */}
      <div className="relative pl-2">
        {chapterDetails.map((ch) => {
          const isExpanded = expandedChapters.has(ch.id);
          const isCurrent = ch.status === 'current';
          const isDone = ch.status === 'done';
          const isLocked = ch.status === 'locked';

          // Node styling from prototype
          const nodeBg = isCurrent
            ? 'bg-gradient-to-br from-wit-red to-[#8E1B1B] text-white shadow-[0_6px_16px_rgba(198,33,40,0.32)] font-serif'
            : isDone
            ? 'bg-wit-gold text-white font-serif'
            : 'bg-wit-surface-2 text-wit-text-tertiary';

          const cardBorder = isCurrent ? 'border-wit-red' : 'border-wit-line';
          const cardOpacity = isLocked ? 'opacity-60' : 'opacity-100';

          return (
            <div key={ch.id} className="flex gap-5 relative">
              {/* Timeline Node Column */}
              <div className="flex flex-col items-center shrink-0 w-14">
                <div
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300
                    ${nodeBg}
                  `}
                >
                  {isDone ? '✓' : isLocked ? <Lock className="h-4.5 w-4.5" /> : ch.orderIndex}
                </div>
                {ch.showLine && <div className="w-0.5 flex-1 bg-wit-line my-1.5 min-h-[40px]" />}
              </div>

              {/* Chapter Card Panel */}
              <div
                className={`
                  flex-1 mb-5 p-5 bg-wit-surface border rounded-2xl shadow-sm transition-all duration-200 cursor-pointer
                  ${cardBorder} ${cardOpacity} hover:shadow-card-hover
                `}
                onClick={() => !isLocked && toggleChapter(ch.id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold text-wit-text-tertiary tracking-[0.4px] uppercase">
                      {getLocalizedText('CHƯƠNG', 'CHAPTER', '章')} {ch.orderIndex} · {ch.rangeText}
                    </div>
                    <h3 className="font-serif font-bold text-[18px] text-wit-text mt-1 leading-snug">
                      {getLocalized(ch, 'title', interfaceLang)}
                    </h3>
                    <p className="text-xs text-wit-text-secondary mt-1.5 leading-relaxed">
                      {getLocalized(ch, 'description', interfaceLang)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`
                      shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
                      ${
                        isDone
                          ? 'bg-wit-red-soft text-wit-gold'
                          : isCurrent
                          ? 'bg-wit-red text-white'
                          : 'bg-wit-surface-2 text-wit-text-tertiary'
                      }
                    `}
                  >
                    {isDone
                      ? getLocalizedText('Hoàn thành', 'Completed', '完了')
                      : isCurrent
                      ? getLocalizedText('Đang mở', 'Active', '進行中')
                      : getLocalizedText('Đã khoá', 'Locked', 'ロック')}
                  </span>
                </div>

                {/* Progress bar inside active chapter */}
                {isCurrent && ch.total > 0 && (
                  <div className="mt-4 pt-3 border-t border-wit-line/60">
                    <div className="h-1.5 rounded-full bg-wit-line overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-wit-red to-[#E0524F] rounded-full"
                        style={{ width: `${ch.pct}%` }}
                      />
                    </div>
                    <div className="text-[11.5px] text-wit-text-tertiary mt-2">
                      {ch.completed}/{ch.total} {getLocalizedText('học phần · ', 'parts · ', 'パート · ')}
                      {ch.pct}% {getLocalizedText('hoàn thành', 'completed', '完了')}
                    </div>
                  </div>
                )}

                {/* Chapter Lesson list */}
                {isExpanded && ch.lessons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-wit-line space-y-1 animate-scale-in">
                    {ch.lessons.map((lesson) => {
                      const status = getLessonStatusForUser(lesson.lessonNo, completedLessons, isAdmin);
                      const accessible = status !== 'locked';

                      let itemBg = 'bg-transparent';
                      let iconColor = 'text-wit-text-tertiary';
                      let titleColor = 'text-wit-text-tertiary';

                      if (status === 'completed') {
                        itemBg = 'hover:bg-wit-success-soft/20';
                        iconColor = 'text-wit-success';
                        titleColor = 'text-wit-text';
                      } else if (status === 'accessible') {
                        itemBg = 'bg-wit-red-soft hover:bg-wit-red-soft/75';
                        iconColor = 'text-wit-red';
                        titleColor = 'text-wit-red font-semibold';
                      }

                      return (
                        <Link
                          key={lesson.id}
                          to={accessible ? `/lessons/${lesson.id}` : '#'}
                          onClick={(e) => !accessible && e.preventDefault()}
                          className={`
                            flex items-center gap-3.5 p-3 rounded-xl text-sm transition-all duration-200
                            ${itemBg} ${!accessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                          `}
                        >
                          {/* Inner Icon */}
                          <div className="shrink-0">
                            {status === 'completed' ? (
                              <Check className={`h-4.5 w-4.5 ${iconColor}`} />
                            ) : status === 'accessible' ? (
                              <Play className={`h-4.5 w-4.5 fill-current ${iconColor}`} />
                            ) : (
                              <Lock className={`h-4.5 w-4.5 ${iconColor}`} />
                            )}
                          </div>

                          {/* Lesson Label */}
                          <span className="font-serif font-bold text-wit-text-tertiary w-6 shrink-0 text-center">
                            {lesson.lessonNo}
                          </span>

                          {/* Title */}
                          <span className={`flex-1 truncate ${titleColor}`}>
                            {getLocalized(lesson, 'title', interfaceLang)}
                          </span>

                          {/* CTA indicator */}
                          {accessible && (
                            <span className="text-[11.5px] text-wit-red font-semibold">
                              {status === 'completed'
                                ? getLocalizedText('Xem lại', 'Review', '復習')
                                : getLocalizedText('Tiếp tục →', 'Continue →', '続ける →')}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
