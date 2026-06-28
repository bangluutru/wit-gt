import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import { TranslationAccordion } from './TranslationAccordion';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import type { Wit365Quote, Language } from '../../lib/types';

interface Props {
  quote: Wit365Quote;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
  /** Key for triggering crossfade animation */
  animationKey?: number;
}

export function DailySeedCard({
  quote,
  lang,
  isFavorite,
  onToggleFavorite,
  onPrev,
  onNext,
  onRandom,
  animationKey = 0,
}: Props) {
  const [visible, setVisible] = useState(true);
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  const isViUI = lang === 'vi' || lang === 'jp';

  // Main display text based on UI language
  const mainText = isViUI ? quote.viText : quote.enLiteral;
  const mainLabel = isViUI
    ? L('Hạt giống hôm nay', "Today's seed", '今日の種')
    : "Today's seed";

  // Crossfade animation on quote change
  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, [animationKey]);

  return (
    <article className="relative bg-wit-surface rounded-card border border-wit-line shadow-card overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[62px] h-1 rounded-b-full bg-gradient-to-r from-wit-red to-wit-gold" />

      <div className="px-7 sm:px-10 py-9 sm:py-10">
        {/* ── Animated content region ── */}
        <div
          className={`transition-all duration-300 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
          }`}
        >
          {/* Header: label + index, favorite + share */}
          <div className="flex items-start justify-between gap-4 mb-[22px]">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-[2px] text-wit-gold">
                {mainLabel}
              </div>
              <div className="text-[12.5px] text-wit-text-tertiary mt-[3px] tabular-nums">
                #{String(quote.index).padStart(3, '0')} / 365
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
              <ShareButton quoteText={mainText} quoteIndex={quote.index} lang={lang} />
            </div>
          </div>

          {/* Main quote */}
          <blockquote className="font-serif text-[26px] sm:text-[31px] font-bold text-wit-text leading-[1.42] whitespace-pre-line">
            {mainText}
          </blockquote>

          {/* Translation accordion */}
          <TranslationAccordion
            lang={lang}
            viText={quote.viText}
            enLiteral={quote.enLiteral}
            enNatural={quote.enNatural}
          />
        </div>

        {/* ── Controls (static across quote changes) ── */}
        <div className="flex items-center justify-between gap-3.5 mt-[30px] pt-6 border-t border-wit-line">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              title={L('Hạt giống trước', 'Previous seed', '前の種')}
              className="flex items-center justify-center w-10 h-10 rounded-button border border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={onNext}
              title={L('Hạt giống tiếp theo', 'Next seed', '次の種')}
              className="flex items-center justify-center w-10 h-10 rounded-button border border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text transition-colors cursor-pointer"
            >
              <ChevronRight className="h-[18px] w-[18px]" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRandom}
            className="inline-flex items-center gap-2.5 px-5 py-[11px] rounded-button bg-wit-red text-white font-semibold text-[13.5px] shadow-card hover:bg-wit-red-hover hover:shadow-card-hover active:scale-[0.97] transition-all duration-200 cursor-pointer"
          >
            <Sprout className="h-[17px] w-[17px]" />
            {L('Gieo một hạt giống khác', 'Plant another seed', '別の種をまく')}
          </button>
        </div>
      </div>
    </article>
  );
}
