// ============================================================
// WiT Platform - Dashboard Page
// ============================================================

import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Map,
  Languages,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Calendar,
  Play,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../hooks/useProgress';
import { useLessons } from '../hooks/useLessons';
import { useDictionary } from '../hooks/useDictionary';
import { getLocalized } from '../lib/types';
import { getCurrentLessonNo } from '../lib/utils';
import { TOTAL_LESSONS, QUOTES } from '../lib/constants';

export default function Dashboard() {
  const { profile } = useAuth();
  const { interfaceLang } = useSettings();
  const { completedLessons, loading: progressLoading } = useProgress();
  const { lessons, chapters, loading: lessonsLoading, getLessonByNo } = useLessons();
  const { terms, loading: dictLoading } = useDictionary();
  const navigate = useNavigate();

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

  const nextChapter = nextLesson
    ? chapters.find((c) => c.id === nextLesson.chapterId)
    : null;

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Greeting Quote Section */}
      <section className="space-y-1.5">
        <h1 className="text-2xl font-bold text-wit-text">
          {getLocalizedText('Chào', 'Welcome,', 'こんにちは、')} {profile?.displayName || getLocalizedText('bạn', 'student', '学習者')},
        </h1>
        <p className="font-serif italic text-wit-text-secondary text-[15px] leading-relaxed">
          "{getLocalized(quote, '', interfaceLang) || quote.vi}"
        </p>
      </section>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-gradient-to-br from-wit-red-dark via-wit-red to-[#A6201F] text-[#FDF3EC] shadow-lg">
        {/* Decorative background circle */}
        <div className="absolute right-[-40px] top-[-40px] w-[300px] h-[300px] rounded-full border-[30px] border-white/5 opacity-10 pointer-events-none" />
        
        <div className="relative max-w-lg space-y-4">
          <div className="text-xs font-bold tracking-[2px] uppercase opacity-80">
            {getLocalizedText('Giáo trình Nhân Sinh · WiT', 'Life Curriculum · WiT', '人生カリキュラム · WiT')}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
            {getLocalizedText(
              'Chào mừng trở lại,\nhành trình tỉnh thức của bạn đang tiếp diễn.',
              'Welcome back,\nyour awakening journey is continuing.',
              'おかえりなさい、\nあなたの覚醒の旅は続いています。'
            )}
          </h2>
          <p className="text-sm sm:text-[15px] opacity-90 leading-relaxed">
            {getLocalizedText(
              `Bạn đã hoàn thành ${completedCount} trong số ${TOTAL_LESSONS} học phần. Mỗi học phần được mở khoá khi bạn học xong phần trước — đi chậm, đi chắc, đi đến tận gốc.`,
              `You have completed ${completedCount} out of ${TOTAL_LESSONS} lessons. Each lesson unlocks sequentially — go slow, go steady, go to the root.`,
              `あなたは${TOTAL_LESSONS}レッスン中${completedCount}レッスンを完了しました。各レッスンは順番にアンロックされます。ゆっくり、確実に、根本まで。`
            )}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {!allCompleted && nextLesson ? (
              <button
                onClick={() => navigate(`/lessons/${nextLesson.id}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FDF3EC] text-wit-red-dark font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              >
                <Play className="h-4 w-4 fill-current stroke-none" />
                <span>
                  {getLocalizedText(
                    `Tiếp tục: Phần ${nextLesson.lessonNo}`,
                    `Continue: Part ${nextLesson.lessonNo}`,
                    `続ける: パート ${nextLesson.lessonNo}`
                  )}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/curriculum')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FDF3EC] text-wit-red-dark font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              >
                <BookOpen className="h-4 w-4" />
                <span>{getLocalizedText('Xem giáo trình', 'View Curriculum', 'カリキュラムを見る')}</span>
              </button>
            )}
            <Link
              to="/roadmap"
              className="px-5 py-3 rounded-xl border border-white/40 bg-white/10 hover:bg-white/20 transition-all font-semibold text-sm"
            >
              {getLocalizedText('Xem lộ trình', 'View Roadmap', 'ロードマップを見る')}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm">
          <div className="font-serif text-3xl font-bold text-wit-red">{completedCount}</div>
          <div className="text-[13px] text-wit-text-secondary mt-1">
            {getLocalizedText('Đã hoàn thành', 'Completed', '完了済み')}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm">
          <div className="font-serif text-3xl font-bold text-wit-gold">
            {allCompleted ? '0' : '1'}
          </div>
          <div className="text-[13px] text-wit-text-secondary mt-1">
            {getLocalizedText('Đang học', 'Learning', '学習中')}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm">
          <div className="font-serif text-3xl font-bold text-wit-text">{TOTAL_LESSONS}</div>
          <div className="text-[13px] text-wit-text-secondary mt-1">
            {getLocalizedText('Tổng học phần', 'Total parts', '全パート')}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm">
          <div className="font-serif text-3xl font-bold text-wit-red">5</div>
          <div className="text-[13px] text-wit-text-secondary mt-1">
            {getLocalizedText('Ngày liên tục', 'Day streak', '継続日数')}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Current Lesson & Dictionary Quick search */}
      <div className="grid grid-cols-1 md:grid-cols-[1.55fr_1fr] gap-6 items-start">
        {/* Left Column: Continue Learning */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-wit-text">
            {getLocalizedText('Tiếp tục học phần', 'Continue Lesson', 'レッスンを続ける')}
          </h2>

          {!allCompleted && nextLesson ? (
            <div
              onClick={() => navigate(`/lessons/${nextLesson.id}`)}
              className="wit-card group cursor-pointer p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm hover:shadow-card-hover transition-all flex gap-4 items-center"
            >
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-wit-red to-wit-red-dark text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                {nextLesson.lessonNo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-wit-gold tracking-[0.4px] uppercase truncate">
                  {nextChapter
                    ? getLocalized(nextChapter, 'title', interfaceLang)
                    : getLocalizedText('CHƯƠNG ĐANG HỌC', 'CURRENT CHAPTER', '現在の章')}
                </div>
                <h3 className="font-serif font-bold text-base text-wit-text truncate group-hover:text-wit-red transition-colors mt-0.5">
                  {getLocalized(nextLesson, 'title', interfaceLang)}
                </h3>
                <p className="text-xs text-wit-text-secondary mt-1">
                  {getLocalizedText('Đang học · còn lại ~12 phút', 'Learning · ~12m remaining', '学習中・残り約12分')}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-wit-red shrink-0 transition-transform group-hover:translate-x-1" />
            </div>
          ) : allCompleted ? (
            <div className="p-6 rounded-2xl bg-wit-surface border border-wit-line text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-wit-success-soft">
                <GraduationCap className="h-8 w-8 text-wit-success" />
              </div>
              <h3 className="font-serif font-bold text-lg text-wit-text">
                {getLocalizedText('Chúc mừng bạn!', 'Congratulations!', 'おめでとうございます！')}
              </h3>
              <p className="text-sm text-wit-text-secondary max-w-sm mx-auto">
                {getLocalizedText(
                  'Bạn đã xuất sắc hoàn thành toàn bộ giáo trình nhân sinh. Hãy tiếp tục ôn tập lại các chương hoặc tra cứu thêm từ điển.',
                  'You have successfully completed the entire life curriculum. Keep reviewing chapters or look up terms in the dictionary.',
                  'あなたは人生カリキュラム全体を無事に完了しました。章を復習し続けるか、辞書で用語を検索してください。'
                )}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-wit-surface border border-wit-line text-center py-8">
              <BookOpen className="h-8 w-8 text-wit-text-tertiary mx-auto mb-2" />
              <h3 className="font-semibold text-wit-text">
                {getLocalizedText('Chưa có bài học nào', 'No lessons loaded', 'レッスンがありません')}
              </h3>
              <p className="text-xs text-wit-text-secondary mt-1.5 max-w-xs mx-auto">
                {getLocalizedText(
                  'Nếu bạn là admin, vui lòng vào trang Import CSV để nạp giáo trình mẫu lên hệ thống.',
                  'If you are an admin, please visit the Import CSV page to load sample curriculum data.',
                  '管理者の場合は、CSVインポートページにアクセスしてサンプルカリキュラムデータをロードしてください。'
                )}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Dictionary & Quote */}
        <div className="space-y-6">
          {/* Quick Dictionary Panel */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-wit-red-soft to-wit-surface border border-wit-line shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-xl bg-wit-red text-white flex items-center justify-center font-serif font-bold text-lg">
                辞
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-wit-text leading-tight">
                  {getLocalizedText('Tra từ điển nhanh', 'Quick Dictionary', 'クイック辞書')}
                </h3>
                <p className="text-[11px] text-wit-text-secondary">
                  {getLocalizedText('Việt · Anh · Nhật', 'VI · EN · JP', 'ベトナム語 · 英語 · 日本語')}
                </p>
              </div>
            </div>
            <p className="text-xs text-wit-text-secondary leading-relaxed">
              {getLocalizedText(
                'Gặp thuật ngữ lạ trong bài học? Rê chuột vào từ được gạch chân để xem nghĩa, hoặc mở từ điển chuyên sâu WiT.',
                'Encountered an unfamiliar term? Hover over underlined words to see definition, or open full dictionary.',
                '聞き慣れない用語に出会いましたか？下線の引かれた単語にホバーして定義を表示するか、完全な辞書を開きます。'
              )}
            </p>
            <button
              onClick={() => navigate('/dictionary')}
              className="w-full py-2.5 rounded-xl bg-wit-red text-white text-sm font-semibold hover:bg-wit-red-dark transition-colors cursor-pointer"
            >
              {getLocalizedText('Mở từ điển nhân sinh', 'Open Dictionary', '辞書を開く')}
            </button>
          </div>

          {/* Motivation Quote Card */}
          <div className="p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm">
            <div className="font-serif text-3xl text-wit-gold leading-none">“</div>
            <p className="font-serif text-sm italic text-wit-text leading-relaxed mt-1">
              {getLocalizedText(
                'Gieo một nhân thiện lành hôm nay, là gặt một quả an vui mai sau.',
                'Sowing a wholesome seed today harvests a peaceful fruit tomorrow.',
                '今日善い種を蒔けば、明日穏やかな果実が実ります。'
              )}
            </p>
            <div className="text-[11px] text-wit-text-tertiary mt-3">
              — {getLocalizedText('Tinh thần Nhân quả, Phần 1', 'Spirit of Cause & Effect, Part 1', '因果の精神、パート 1')}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Footer Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Link
          to="/roadmap"
          className="bg-wit-surface rounded-2xl border border-wit-line p-5 hover:shadow-card-hover transition-all group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-wit-surface-2 flex items-center justify-center shrink-0">
            <Map className="w-5 h-5 text-wit-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-wit-text text-sm">{getLocalizedText('Lộ trình học tập', 'Learning Roadmap', '学習ロードマップ')}</h3>
            <p className="text-xs text-wit-text-tertiary mt-1 truncate">{getLocalizedText('Xem tiến trình theo từng chương', 'Track progress by chapters', '章ごとの進捗追跡')}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-wit-text-tertiary mt-1 transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>
        <Link
          to="/curriculum"
          className="bg-wit-surface rounded-2xl border border-wit-line p-5 hover:shadow-card-hover transition-all group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-wit-surface-2 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-wit-red" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-wit-text text-sm">{getLocalizedText('Giáo trình', 'Curriculum', 'カリキュラム')}</h3>
            <p className="text-xs text-wit-text-tertiary mt-1 truncate">{getLocalizedText('Danh sách tất cả bài học', 'List of all parts', '全レッスンのリスト')}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-wit-text-tertiary mt-1 transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>
        <Link
          to="/dictionary"
          className="bg-wit-surface rounded-2xl border border-wit-line p-5 hover:shadow-card-hover transition-all group flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-wit-surface-2 flex items-center justify-center shrink-0">
            <Languages className="w-5 h-5 text-wit-info" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-wit-text text-sm">{getLocalizedText('Từ điển thuật ngữ', 'Dictionary', '用語辞書')}</h3>
            <p className="text-xs text-wit-text-tertiary mt-1 truncate">{getLocalizedText('Tra cứu thuật ngữ đa ngôn ngữ', 'Look up multilingual terms', '多言語の用語検索')}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-wit-text-tertiary mt-1 transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
