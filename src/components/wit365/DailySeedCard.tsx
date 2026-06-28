import { useState, useEffect } from 'react';
import { TranslationAccordion } from './TranslationAccordion';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import type { Wit365Quote, Language } from '../../lib/types';

interface Props {
  quote: Wit365Quote;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  /** Key for triggering crossfade animation */
  animationKey?: number;
}

export function DailySeedCard({
  quote,
  lang,
  isFavorite,
  onToggleFavorite,
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

  // Crossfade animation
  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, [animationKey]);

  return (
    <div
      className={`relative bg-wit-surface rounded-card border border-wit-line shadow-card transition-all duration-300 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
      }`}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-b-full bg-gradient-to-r from-wit-red to-wit-gold" />

      <div className="px-8 sm:px-12 md:px-16 py-12 sm:py-16 md:py-20">
        {/* Quote number + Label */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[2px] text-wit-gold">
              {mainLabel}
            </div>
            <div className="text-xs text-wit-text-tertiary mt-1 tabular-nums">
              #{String(quote.index).padStart(3, '0')} / 365
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
            <ShareButton quoteText={mainText} quoteIndex={quote.index} lang={lang} />
          </div>
        </div>

        {/* Main quote */}
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-[34px] font-bold text-wit-text leading-[1.4] whitespace-pre-line">
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
    </div>
  );
}
