import type { Wit365Quote, Language } from '../../lib/types';

interface Props {
  quote: Wit365Quote;
  lang: Language;
  isFavorite: boolean;
  onClick: () => void;
}

export function QuoteListItem({ quote, lang, isFavorite, onClick }: Props) {
  const isViUI = lang === 'vi' || lang === 'jp';
  const displayText = isViUI ? quote.viText : quote.enLiteral;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-start gap-3.5 px-4 py-3.5 rounded-xl hover:bg-wit-surface-2 transition-all duration-200 cursor-pointer group"
    >
      <span className="shrink-0 w-10 h-10 rounded-lg bg-wit-gold-soft text-wit-gold flex items-center justify-center text-xs font-bold tabular-nums">
        {String(quote.index).padStart(3, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-wit-text leading-relaxed line-clamp-2 group-hover:text-wit-red transition-colors">
          {displayText}
        </p>
      </div>
      {isFavorite && (
        <span className="shrink-0 mt-0.5 text-wit-red text-xs">♥</span>
      )}
    </button>
  );
}
