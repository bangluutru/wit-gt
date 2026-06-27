// ============================================================
// WiT Platform - Curriculum Page
// ============================================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Play, Search, AlertCircle } from 'lucide-react';
import { useLessons } from '../hooks/useLessons';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../contexts/SettingsContext';
import { getLocalized } from '../lib/types';
import { getLessonStatus } from '../lib/utils';
import { TOTAL_LESSONS } from '../lib/constants';

export default function Curriculum() {
  const { lessons, chapters, loading: lessonsLoading } = useLessons();
  const { completedLessons, loading: progressLoading } = useProgress();
  const { interfaceLang } = useSettings();
  const navigate = useNavigate();

  const loading = lessonsLoading || progressLoading;

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  const chapterDetails = useMemo(() => {
    return chapters.map((ch) => {
      const chLessons = lessons.filter((l) => l.chapterId === ch.id);
      const total = chLessons.length;
      const completed = chLessons.filter((l) => completedLessons.has(l.lessonNo)).length;

      // Determine accessibility
      const isFirstLessonInChAccessible = chLessons.length > 0 &&
        getLessonStatus(chLessons[0].lessonNo, completedLessons) !== 'locked';

      let status: 'done' | 'current' | 'locked' = 'locked';
      if (completed === total && total > 0) {
        status = 'done';
      } else if (isFirstLessonInChAccessible) {
        status = 'current';
      }

      const rangeText = chLessons.length > 0
        ? `${getLocalizedText('Phần', 'Part', 'パート')} ${chLessons[0].lessonNo}–${chLessons[chLessons.length - 1].lessonNo}`
        : '';

      const parts = chLessons.map((l) => {
        const itemStatus = getLessonStatus(l.lessonNo, completedLessons);
        const accessible = itemStatus !== 'locked';
        return {
          ...l,
          status: itemStatus,
          accessible,
        };
      });

      return {
        ...ch,
        total,
        completed,
        status,
        rangeText,
        parts,
      };
    });
  }, [chapters, lessons, completedLessons, interfaceLang]);

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

  const hasData = lessons.length > 0 && chapters.length > 0;

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
          {getLocalizedText('76 học phần · 9 chương', '76 parts · 9 chapters', '76パート · 9章')}
        </span>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">
          {getLocalizedText('Giáo trình', 'Curriculum', 'Giáo trình')}
        </h1>
        <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
          {getLocalizedText(
            'Các học phần có ổ khoá sẽ tự mở khi bạn hoàn thành phần liền trước. Nhấn vào học phần đang mở để bắt đầu.',
            'Lessons with locks will automatically open when you finish the previous one. Click an unlocked lesson to start.',
            'ロックされているレッスンは、前のレッスンを完了すると自動的に開きます。ロック解除されたレッスンをクリックして開始します。'
          )}
        </p>
      </div>

      {/* Chapters list */}
      {hasData ? (
        <div className="space-y-6">
          {chapterDetails.map((ch) => {
            const isCur = ch.status === 'current';
            const isDone = ch.status === 'done';

            const chipBg = isCur
              ? 'bg-gradient-to-br from-wit-red to-wit-red-dark text-white'
              : isDone
              ? 'bg-wit-gold text-white'
              : 'bg-wit-surface-2 text-wit-text-tertiary';

            const tagLabel = isDone
              ? getLocalizedText('Hoàn thành', 'Completed', '完了')
              : isCur
              ? getLocalizedText('Đang mở', 'Active', '進行中')
              : getLocalizedText('Đã khoá', 'Locked', 'ロック');

            const tagBg = isDone
              ? 'bg-wit-red-soft text-wit-gold'
              : isCur
              ? 'bg-wit-red text-white'
              : 'bg-wit-surface-2 text-wit-text-tertiary';

            return (
              <div
                key={ch.id}
                className="rounded-2xl bg-wit-surface border border-wit-line overflow-hidden shadow-sm"
              >
                {/* Chapter header */}
                <div className="flex items-center gap-4.5 p-4 sm:p-5 border-b border-wit-line bg-wit-surface-2">
                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-base shrink-0
                      ${chipBg}
                    `}
                  >
                    {ch.orderIndex}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-[17px] font-bold text-wit-text truncate leading-snug">
                      {getLocalized(ch, 'title', interfaceLang)}
                    </h3>
                    <div className="text-xs text-wit-text-tertiary mt-0.5 truncate">
                      {ch.rangeText} · {getLocalized(ch, 'description', interfaceLang)}
                    </div>
                  </div>
                  <span
                    className={`
                      text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shrink-0
                      ${tagBg}
                    `}
                  >
                    {tagLabel}
                  </span>
                </div>

                {/* Chapter lesson list rows */}
                <div className="flex flex-col divide-y divide-wit-line">
                  {ch.parts.map((p) => {
                    const accessible = p.accessible;
                    const isDonePart = p.status === 'completed';
                    const isCurrentPart = p.status === 'accessible';

                    const iconBg = isDonePart
                      ? 'bg-wit-gold text-white'
                      : isCurrentPart
                      ? 'bg-wit-red text-white'
                      : 'bg-wit-surface-2 text-wit-text-tertiary';

                    return (
                      <button
                        key={p.id}
                        onClick={() => accessible && navigate(`/lessons/${p.id}`)}
                        disabled={!accessible}
                        className={`
                          w-full flex items-center gap-4 px-5 py-3.5 border-none bg-transparent text-left transition-all duration-150
                          ${
                            accessible
                              ? 'cursor-pointer hover:bg-wit-surface-2 text-wit-text'
                              : 'cursor-not-allowed opacity-55 text-wit-text-tertiary'
                          }
                        `}
                      >
                        {/* Icon status */}
                        <div
                          className={`
                            w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                            ${iconBg}
                          `}
                        >
                          {isDonePart ? (
                            <Check className="h-4 w-4 stroke-[2.5]" />
                          ) : isCurrentPart ? (
                            <Play className="h-3.5 w-3.5 fill-current stroke-none" />
                          ) : (
                            <Lock className="h-3.5 w-3.5" />
                          )}
                        </div>

                        {/* Part label */}
                        <span className="font-serif font-bold text-wit-text-tertiary w-10 text-center shrink-0 text-sm">
                          {getLocalizedText('Phần', 'Part', 'Phần')} {p.lessonNo}
                        </span>

                        {/* Part title */}
                        <span
                          className={`
                            flex-grow text-[14.5px] truncate pr-4
                            ${accessible ? 'text-wit-text font-medium' : 'text-wit-text-tertiary'}
                          `}
                        >
                          {getLocalized(p, 'title', interfaceLang)}
                        </span>

                        {/* Action badge */}
                        {accessible && (
                          <span className="text-[12px] font-bold text-wit-red shrink-0 uppercase tracking-wide">
                            {isDonePart
                              ? getLocalizedText('Xem lại', 'Review', '復習')
                              : getLocalizedText('Tiếp tục →', 'Continue →', '続ける →')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State with Seed instructions */
        <div className="bg-wit-surface rounded-2xl border border-wit-line p-8 text-center space-y-4 shadow-sm py-16">
          <div className="inline-flex p-4 bg-wit-gold-soft rounded-full">
            <AlertCircle className="h-10 w-10 text-wit-gold" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-wit-text">
              {getLocalizedText('Chưa có giáo trình mẫu', 'No curriculum data', 'カリキュラムデータがありません')}
            </h2>
            <p className="text-sm text-wit-text-secondary max-w-md mx-auto mt-2 leading-relaxed">
              {getLocalizedText(
                'Để hiển thị giáo trình, bạn cần có tài khoản quản trị viên và tải dữ liệu từ file CSV mẫu.',
                'To display the curriculum, you need to sign in as an admin and import lessons from the CSV template.',
                'カリキュラムを表示するには、管理者としてサインインし、CSVテンプレートからレッスンをインポートする必要があります。'
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/import')}
            className="px-6 py-2.5 rounded-xl bg-wit-red text-white text-sm font-semibold hover:bg-wit-red-dark transition-colors shadow-sm"
          >
            {getLocalizedText('Đến trang Admin Import', 'Go to Admin Import', '管理者インポートページへ')}
          </button>
        </div>
      )}
    </div>
  );
}
