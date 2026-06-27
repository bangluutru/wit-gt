import { useState, useCallback } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import type { DictionaryTerm, Language, FlashcardConfig, FlashcardItem } from '../../lib/types';
import { getRandomSubset } from '../../lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

interface FlashcardSessionProps {
  terms: DictionaryTerm[];
  onExit: () => void;
}

type Phase = 'config' | 'session' | 'summary';

const CARD_COUNTS: FlashcardConfig['count'][] = [10, 20, 30];

function getTermField(term: DictionaryTerm, lang: Language): string {
  return lang === 'vi' ? term.viTerm : lang === 'en' ? term.enTerm : term.jpTerm;
}

function getDefField(term: DictionaryTerm, lang: Language): string {
  return lang === 'vi' ? term.viDef : lang === 'en' ? term.enDef : term.jpDef;
}

function getPhoneticField(term: DictionaryTerm, lang: Language): string {
  return lang === 'jp' ? term.jpKana : lang === 'vi' ? term.viIpa : term.enIpa;
}

export default function FlashcardSession({ terms, onExit }: FlashcardSessionProps) {
  const [phase, setPhase] = useState<Phase>('config');
  const [config, setConfig] = useState<FlashcardConfig>({
    count: 10,
    sourceLanguage: 'vi',
    targetLanguage: 'en',
  });
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startSession = useCallback(() => {
    const subset = getRandomSubset(terms, config.count);
    setCards(
      subset.map((term) => ({
        term,
        isFlipped: false,
        isKnown: null,
      }))
    );
    setCurrentIndex(0);
    setPhase('session');
  }, [terms, config.count]);

  const flipCard = useCallback(() => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === currentIndex ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  }, [currentIndex]);

  const markCard = useCallback(
    (known: boolean) => {
      setCards((prev) =>
        prev.map((card, i) =>
          i === currentIndex ? { ...card, isKnown: known } : card
        )
      );
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setPhase('summary');
      }
    },
    [currentIndex, cards.length]
  );

  const goTo = useCallback(
    (dir: 'prev' | 'next') => {
      if (dir === 'prev' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (dir === 'next' && currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, cards.length]
  );

  // ─── Config Phase ───
  if (phase === 'config') {
    return (
      <div className="page-enter max-w-md mx-auto">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm text-wit-text-secondary hover:text-wit-text mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại từ điển
        </button>

        <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-wit-text font-serif">
            Cấu hình Flashcard
          </h2>

          {/* Card count */}
          <div>
            <label className="block text-sm font-medium text-wit-text-secondary mb-2">
              Số lượng thẻ
            </label>
            <div className="flex gap-2">
              {CARD_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, count }))}
                  className={`
                    px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${
                      config.count === count
                        ? 'bg-wit-red text-white shadow-sm'
                        : 'bg-wit-surface-alt text-wit-text-secondary hover:bg-wit-line'
                    }
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
            {terms.length < config.count && (
              <p className="text-xs text-wit-gold mt-1.5">
                Chỉ có {terms.length} thuật ngữ — sẽ dùng tất cả.
              </p>
            )}
          </div>

          {/* Source lang */}
          <div>
            <LanguageSwitcher
              value={config.sourceLanguage}
              onChange={(l) => setConfig((c) => ({ ...c, sourceLanguage: l }))}
              label="Mặt trước"
            />
          </div>

          {/* Target lang */}
          <div>
            <LanguageSwitcher
              value={config.targetLanguage}
              onChange={(l) => setConfig((c) => ({ ...c, targetLanguage: l }))}
              label="Mặt sau"
            />
          </div>

          <button
            type="button"
            onClick={startSession}
            disabled={terms.length === 0}
            className="w-full py-3 rounded-lg bg-wit-red text-white font-semibold hover:bg-wit-red-hover transition-colors disabled:opacity-50 cursor-pointer"
          >
            Bắt đầu ({Math.min(config.count, terms.length)} thẻ)
          </button>
        </div>
      </div>
    );
  }

  // ─── Summary Phase ───
  if (phase === 'summary') {
    const known = cards.filter((c) => c.isKnown === true).length;
    const unknown = cards.filter((c) => c.isKnown === false).length;
    const skipped = cards.filter((c) => c.isKnown === null).length;
    const percentage = Math.round((known / cards.length) * 100);

    return (
      <div className="page-enter max-w-md mx-auto">
        <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wit-gold-soft">
            <Trophy className="h-8 w-8 text-wit-gold" />
          </div>

          <h2 className="text-2xl font-semibold text-wit-text font-serif">
            Hoàn thành!
          </h2>

          <div className="text-5xl font-bold text-wit-red">{percentage}%</div>

          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-wit-success">{known}</div>
              <div className="text-wit-text-secondary">Đã biết</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-wit-red">{unknown}</div>
              <div className="text-wit-text-secondary">Chưa biết</div>
            </div>
            {skipped > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-wit-text-tertiary">{skipped}</div>
                <div className="text-wit-text-secondary">Bỏ qua</div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setPhase('config');
                setCurrentIndex(0);
              }}
              className="flex-1 py-2.5 rounded-lg bg-wit-surface-alt text-wit-text font-medium hover:bg-wit-line transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Học lại
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex-1 py-2.5 rounded-lg bg-wit-red text-white font-medium hover:bg-wit-red-hover transition-colors cursor-pointer"
            >
              Thoát
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Session Phase ───
  const currentCard = cards[currentIndex];
  const sourceTerm = getTermField(currentCard.term, config.sourceLanguage);
  const sourcePhonetic = getPhoneticField(currentCard.term, config.sourceLanguage);
  const targetTerm = getTermField(currentCard.term, config.targetLanguage);
  const targetDef = getDefField(currentCard.term, config.targetLanguage);

  return (
    <div className="page-enter max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm text-wit-text-secondary hover:text-wit-text cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Thoát
        </button>
        <span className="text-sm font-medium text-wit-text-secondary">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-wit-surface-alt rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-wit-red rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        className="flashcard-container mx-auto cursor-pointer"
        style={{ height: '320px' }}
        onClick={flipCard}
      >
        <div className={`flashcard-inner ${currentCard.isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-front bg-wit-surface border border-wit-line/50 shadow-card flex-col gap-2">
            <h3
              className={`text-3xl font-bold text-wit-text ${
                config.sourceLanguage === 'jp' ? 'font-jp' : ''
              }`}
            >
              {sourceTerm}
            </h3>
            {sourcePhonetic && (
              <p className="text-sm text-wit-text-tertiary font-mono">
                {config.sourceLanguage === 'jp' ? sourcePhonetic : `/${sourcePhonetic}/`}
              </p>
            )}
            <p className="text-xs text-wit-text-tertiary mt-4">Nhấn để lật thẻ</p>
          </div>

          {/* Back */}
          <div className="flashcard-back bg-wit-red-soft border border-wit-line/50 shadow-card flex-col gap-2">
            <h3
              className={`text-3xl font-bold text-wit-text ${
                config.targetLanguage === 'jp' ? 'font-jp' : ''
              }`}
            >
              {targetTerm}
            </h3>
            {targetDef && (
              <p
                className={`text-sm text-wit-text-secondary text-center max-w-[280px] ${
                  config.targetLanguage === 'jp' ? 'font-jp' : ''
                }`}
              >
                {targetDef}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation + answer buttons */}
      <div className="flex items-center justify-between mt-8 gap-3">
        <button
          type="button"
          onClick={() => goTo('prev')}
          disabled={currentIndex === 0}
          className="p-2.5 rounded-lg bg-wit-surface-alt text-wit-text-secondary hover:bg-wit-line disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => markCard(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-wit-surface border border-wit-line text-wit-red font-medium hover:bg-wit-red-soft transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
            Chưa biết
          </button>
          <button
            type="button"
            onClick={() => markCard(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-wit-success text-white font-medium hover:opacity-90 transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            Đã biết
          </button>
        </div>

        <button
          type="button"
          onClick={() => goTo('next')}
          disabled={currentIndex === cards.length - 1}
          className="p-2.5 rounded-lg bg-wit-surface-alt text-wit-text-secondary hover:bg-wit-line disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
