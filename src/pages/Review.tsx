// ============================================================
// WiT Platform - Review (Self-test Quiz) Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListChecks, Check, X, RotateCcw, BookOpen, ArrowRight, Trophy } from 'lucide-react';
import { useQuizQuestions } from '../hooks/useQuizQuestions';
import { useLessons } from '../hooks/useLessons';
import { useSettings } from '../contexts/SettingsContext';
import { getLocalized } from '../lib/types';
import type { QuizQuestion, Language } from '../lib/types';
import { LoadingState } from '../components/ui';

type Phase = 'config' | 'quiz' | 'summary';
const COUNT_OPTIONS = [5, 10, 20, 30] as const;

/** Pick the options array for a language, falling back to Vietnamese. */
function pickOptions(q: QuizQuestion, lang: Language): string[] {
  if (lang === 'en' && q.optionsEn && q.optionsEn.length) return q.optionsEn;
  if (lang === 'jp' && q.optionsJp && q.optionsJp.length) return q.optionsJp;
  return q.optionsVi;
}

/** Pick a localized text field, falling back to Vietnamese. */
function pickText(q: QuizQuestion, field: 'question' | 'explanation', lang: Language): string {
  return getLocalized(q, field, lang) || getLocalized(q, field, 'vi');
}

export default function Review() {
  const { loading, getRandomQuestions } = useQuizQuestions();
  const { chapters } = useLessons();
  const { interfaceLang } = useSettings();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('config');
  const [count, setCount] = useState<number>(10);
  const [scope, setScope] = useState<string>('all'); // 'all' | chapterId

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  const startQuiz = () => {
    const filters = scope !== 'all' ? { chapterId: scope } : undefined;
    const picked = getRandomQuestions(count, filters);
    setQuiz(picked);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setPhase('quiz');
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return; // lock after first answer
    setSelected(idx);
    if (idx === quiz[current].correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= quiz.length) {
      setPhase('summary');
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const restart = () => {
    setPhase('config');
    setQuiz([]);
    setCurrent(0);
    setSelected(null);
    setScore(0);
  };

  if (loading) {
    return <LoadingState message={getLocalizedText('Đang tải câu hỏi...', 'Loading questions...', '質問を読み込んでいます...')} />;
  }

  // ---- Config screen ----
  if (phase === 'config') {
    return (
      <div className="page-enter max-w-2xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
            {getLocalizedText('Tự ôn tập · trắc nghiệm', 'Self review · quiz', '自己復習 · クイズ')}
          </span>
          <h1 className="font-serif text-3xl font-bold text-wit-text mt-1 flex items-center gap-2">
            <ListChecks className="h-7 w-7 text-wit-red" />
            {getLocalizedText('Ôn tập', 'Review', '復習')}
          </h1>
          <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
            {getLocalizedText(
              'Chọn số câu và phạm vi muốn ôn. Câu hỏi được chọn ngẫu nhiên — không lưu lịch sử, ôn lại tuỳ thích.',
              'Choose how many questions and the scope. Questions are picked randomly — no history is saved, review as often as you like.',
              '問題数と範囲を選択してください。質問はランダムに選ばれます。履歴は保存されません。'
            )}
          </p>
        </div>

        {/* Question count */}
        <div className="bg-wit-surface rounded-2xl border border-wit-line p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-wit-text-secondary">
            {getLocalizedText('Số câu muốn ôn', 'Number of questions', '問題数')}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {COUNT_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  count === c
                    ? 'bg-wit-red text-white border-wit-red shadow-sm'
                    : 'bg-wit-surface text-wit-text-secondary border-wit-line hover:border-wit-red/40'
                }`}
              >
                {c} {getLocalizedText('câu', 'questions', '問')}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="bg-wit-surface rounded-2xl border border-wit-line p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-wit-text-secondary">
            {getLocalizedText('Phạm vi ôn tập', 'Scope', '範囲')}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setScope('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                scope === 'all'
                  ? 'bg-wit-red text-white border-wit-red shadow-sm'
                  : 'bg-wit-surface text-wit-text-secondary border-wit-line hover:border-wit-red/40'
              }`}
            >
              {getLocalizedText('Toàn bộ giáo trình', 'Entire curriculum', 'カリキュラム全体')}
            </button>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setScope(ch.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  scope === ch.id
                    ? 'bg-wit-red text-white border-wit-red shadow-sm'
                    : 'bg-wit-surface text-wit-text-secondary border-wit-line hover:border-wit-red/40'
                }`}
              >
                {getLocalizedText('Chương', 'Ch.', '章')} {ch.orderIndex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-3.5 rounded-xl bg-wit-red text-white text-sm font-bold hover:bg-wit-red-dark transition-colors shadow-sm cursor-pointer"
        >
          {getLocalizedText('Bắt đầu ôn tập', 'Start review', '復習を始める')}
        </button>
      </div>
    );
  }

  // ---- Quiz screen ----
  if (phase === 'quiz') {
    if (quiz.length === 0) {
      return (
        <div className="page-enter max-w-2xl mx-auto text-center py-20 space-y-4">
          <p className="text-wit-text-secondary">
            {getLocalizedText(
              'Chưa có câu hỏi cho phạm vi này. Hãy thử phạm vi khác.',
              'No questions for this scope yet. Try another scope.',
              'この範囲の質問はまだありません。'
            )}
          </p>
          <button onClick={restart} className="text-wit-red hover:underline cursor-pointer">
            {getLocalizedText('Quay lại', 'Go back', '戻る')}
          </button>
        </div>
      );
    }

    const q = quiz[current];
    const options = pickOptions(q, interfaceLang);
    const answered = selected !== null;
    const progressPct = Math.round(((current + (answered ? 1 : 0)) / quiz.length) * 100);

    return (
      <div className="page-enter max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-semibold text-wit-text-secondary">
              {getLocalizedText('Câu', 'Question', '問')} {current + 1}/{quiz.length}
            </span>
            <span className="text-xs font-bold text-wit-red">
              {getLocalizedText('Đúng', 'Correct', '正解')}: {score}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-wit-line overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-wit-red to-[#E0524F] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-wit-surface rounded-2xl border border-wit-line p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-wit-text leading-snug">
            {pickText(q, 'question', interfaceLang)}
          </h2>

          <div className="mt-5 space-y-3">
            {options.map((opt, idx) => {
              const isCorrect = idx === q.correctIndex;
              const isChosen = idx === selected;

              let cls = 'border-wit-line bg-wit-surface hover:border-wit-red/40';
              if (answered) {
                if (isCorrect) cls = 'border-wit-success bg-wit-success-soft';
                else if (isChosen) cls = 'border-wit-red bg-wit-red-soft';
                else cls = 'border-wit-line bg-wit-surface opacity-60';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls} ${
                    answered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="flex-1 text-wit-text">{opt}</span>
                  {answered && isCorrect && <Check className="h-4.5 w-4.5 text-wit-success shrink-0" />}
                  {answered && isChosen && !isCorrect && <X className="h-4.5 w-4.5 text-wit-red shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback + explanation */}
          {answered && (
            <div className="mt-5 pt-4 border-t border-wit-line animate-scale-in">
              <p className={`text-sm font-bold ${selected === q.correctIndex ? 'text-wit-success' : 'text-wit-red'}`}>
                {selected === q.correctIndex
                  ? getLocalizedText('Chính xác!', 'Correct!', '正解！')
                  : getLocalizedText('Chưa đúng', 'Not quite', '不正解')}
              </p>
              {pickText(q, 'explanation', interfaceLang) && (
                <p className="text-sm text-wit-text-secondary mt-1.5 leading-relaxed">
                  {pickText(q, 'explanation', interfaceLang)}
                </p>
              )}
              <button
                onClick={handleNext}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-wit-red text-white text-sm font-bold hover:bg-wit-red-dark transition-colors cursor-pointer"
              >
                {current + 1 >= quiz.length
                  ? getLocalizedText('Xem kết quả', 'See results', '結果を見る')
                  : getLocalizedText('Câu tiếp theo', 'Next question', '次の問題')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Summary screen ----
  const pct = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
  return (
    <div className="page-enter max-w-2xl mx-auto text-center space-y-6 py-8">
      <div className="inline-flex p-4 rounded-full bg-wit-gold-soft">
        <Trophy className="h-10 w-10 text-wit-gold" />
      </div>
      <div>
        <h1 className="font-serif text-3xl font-bold text-wit-text">
          {getLocalizedText('Hoàn thành!', 'Completed!', '完了！')}
        </h1>
        <p className="text-wit-text-secondary mt-2">
          {getLocalizedText('Bạn trả lời đúng', 'You answered', '正解数')}{' '}
          <span className="font-bold text-wit-red">{score}</span>/{quiz.length}{' '}
          {getLocalizedText('câu', 'questions', '問')}
        </p>
      </div>

      <div className="bg-wit-surface rounded-2xl border border-wit-line p-6 shadow-sm">
        <div className="font-serif text-5xl font-bold text-wit-red">{pct}%</div>
        <div className="h-2 rounded-full bg-wit-line overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-wit-red to-[#E0524F] rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={restart}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-wit-red text-white text-sm font-bold hover:bg-wit-red-dark transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          {getLocalizedText('Làm lại', 'Try again', 'もう一度')}
        </button>
        <button
          onClick={() => navigate('/curriculum')}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-wit-surface border border-wit-line text-wit-text text-sm font-semibold hover:border-wit-red/30 hover:text-wit-red transition-all cursor-pointer"
        >
          <BookOpen className="h-4 w-4" />
          {getLocalizedText('Quay lại giáo trình', 'Back to curriculum', 'カリキュラムへ')}
        </button>
      </div>
    </div>
  );
}
