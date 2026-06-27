// ============================================================
// WiT Platform - Dashboard Page
// ============================================================

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Map,
  Languages,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../hooks/useProgress';
import { useLessons } from '../hooks/useLessons';
import { useDictionary } from '../hooks/useDictionary';
import { getLocalized } from '../lib/types';
import { getCurrentLessonNo } from '../lib/utils';
import { TOTAL_LESSONS, TOTAL_CHAPTERS, QUOTES } from '../lib/constants';

export default function Dashboard() {
  const { profile } = useAuth();
  const { interfaceLang } = useSettings();
  const { completedLessons, loading: progressLoading } = useProgress();
  const { lessons, chapters, loading: lessonsLoading, getLessonByNo } = useLessons();
  const { terms, loading: dictLoading } = useDictionary();

  const loading = progressLoading || lessonsLoading || dictLoading;

  // Random quote, stable per render
  const quote = useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    []
  );

  const completedCount = completedLessons.size;
  const currentLessonNo = getCurrentLessonNo(completedLessons);
  const allCompleted = completedCount >= TOTAL_LESSONS;
  const nextLesson = getLessonByNo(currentLessonNo);

  // Progress ring geometry
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = completedCount / TOTAL_LESSONS;
  const dashOffset = circumference * (1 - progress);

  // Determine chapter of next lesson
  const nextChapter = nextLesson
    ? chapters.find((c) => c.id === nextLesson.chapterId)
    : null;

  // Stats
  const chaptersCompleted = useMemo(() => {
    if (!chapters.length || !lessons.length) return 0;
    return chapters.filter((ch) => {
      const chLessons = lessons.filter((l) => l.chapterId === ch.id);
      return chLessons.length > 0 && chLessons.every((l) => completedLessons.has(l.lessonNo));
    }).length;
  }, [chapters, lessons, completedLessons]);

  if (loading) {
    return (
      <div className="page-enter flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-wit-line border-t-wit-gold rounded-full animate-spin" />
          <p className="text-wit-text-secondary text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-8">
      {/* ── Greeting ── */}
      <section>
        <h1 className="text-2xl font-semibold text-wit-text">
          Chào {profile?.displayName || 'bạn'},
        </h1>
        <p className="mt-2 font-serif italic text-wit-text-secondary text-base">
          "{getLocalized(quote, '', interfaceLang) || quote.vi}"
        </p>
      </section>

      {/* ── Main Row: Progress Ring + Continue Learning ── */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Progress Ring Card */}
        <div className="bg-wit-surface rounded-xl shadow-card p-8 flex flex-col items-center min-w-[220px]">
          <svg
            width={radius * 2 + strokeWidth * 2}
            height={radius * 2 + strokeWidth * 2}
            className="mb-4"
          >
            {/* Background circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="#E8DFD2"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="#C99A3F"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="progress-ring-circle"
            />
          </svg>
          <div className="text-center">
            <span className="text-3xl font-bold text-wit-text">{completedCount}</span>
            <span className="text-lg text-wit-text-secondary">/{TOTAL_LESSONS}</span>
          </div>
          <p className="text-sm text-wit-text-tertiary mt-1">học phần</p>
          <p className="text-xs text-wit-text-tertiary mt-3">
            {Math.round(progress * 100)}% hoàn thành
          </p>
        </div>

        {/* Continue Learning Card */}
        <div className="flex-1 bg-wit-surface rounded-xl shadow-card p-8 flex flex-col justify-between">
          {allCompleted ? (
            /* All lessons completed */
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-wit-success-soft flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-wit-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-wit-text font-serif">
                  Chúc mừng bạn!
                </h2>
                <p className="text-wit-text-secondary mt-2 max-w-md">
                  Bạn đã hoàn thành tất cả {TOTAL_LESSONS} học phần. Hãy ôn tập lại hoặc khám phá
                  từ điển để củng cố kiến thức.
                </p>
              </div>
              <Link
                to="/curriculum"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-wit-success text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <BookOpen className="w-4 h-4" />
                Xem giáo trình
              </Link>
            </div>
          ) : nextLesson ? (
            /* Next lesson available */
            <div className="flex flex-col justify-between h-full gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-wit-gold" />
                  <span className="text-sm font-medium text-wit-gold">Tiếp tục học</span>
                </div>
                <h2 className="text-xl font-semibold text-wit-text font-serif leading-snug">
                  Bài {nextLesson.lessonNo}:{' '}
                  {getLocalized(nextLesson, 'title', interfaceLang)}
                </h2>
                <p className="text-sm text-wit-text-secondary mt-2 line-clamp-2">
                  {getLocalized(nextLesson, 'summary', interfaceLang)}
                </p>
                {nextChapter && (
                  <p className="text-xs text-wit-text-tertiary mt-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {getLocalized(nextChapter, 'title', interfaceLang)}
                  </p>
                )}
              </div>
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-wit-red text-white rounded-lg font-medium text-sm hover:bg-wit-red-hover transition-colors"
              >
                Bắt đầu học
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* No lessons loaded yet */
            <div className="flex items-center justify-center h-full">
              <p className="text-wit-text-tertiary">Chưa có bài học nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-wit-red" />}
          value={completedCount}
          label="Bài đã học"
          bgColor="bg-wit-red-soft"
        />
        <StatCard
          icon={<Map className="w-5 h-5 text-wit-success" />}
          value={chaptersCompleted}
          label="Chương hoàn thành"
          bgColor="bg-wit-success-soft"
        />
        <StatCard
          icon={<Languages className="w-5 h-5 text-wit-info" />}
          value={terms.length}
          label="Thuật ngữ"
          bgColor="bg-wit-info-soft"
        />
        <StatCard
          icon={<GraduationCap className="w-5 h-5 text-wit-gold" />}
          value={TOTAL_CHAPTERS}
          label="Tổng chương"
          bgColor="bg-wit-gold-soft"
        />
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickLink
          to="/roadmap"
          icon={<Map className="w-5 h-5 text-wit-gold" />}
          title="Lộ trình học tập"
          description="Xem tiến trình theo từng chương"
        />
        <QuickLink
          to="/curriculum"
          icon={<BookOpen className="w-5 h-5 text-wit-red" />}
          title="Giáo trình"
          description="Danh sách tất cả bài học"
        />
        <QuickLink
          to="/dictionary"
          icon={<Languages className="w-5 h-5 text-wit-info" />}
          title="Từ điển thuật ngữ"
          description="Tra cứu thuật ngữ đa ngôn ngữ"
        />
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({
  icon,
  value,
  label,
  bgColor,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  bgColor: string;
}) {
  return (
    <div className="bg-wit-surface rounded-xl shadow-card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-wit-text leading-none">{value}</p>
        <p className="text-xs text-wit-text-secondary mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickLink({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="bg-wit-surface rounded-xl shadow-card p-5 hover:shadow-card-hover transition-shadow group flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-lg bg-wit-surface-alt flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-wit-text text-sm">{title}</h3>
        <p className="text-xs text-wit-text-tertiary mt-1">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-wit-text-tertiary mt-1 transition-transform group-hover:translate-x-1 shrink-0" />
    </Link>
  );
}
