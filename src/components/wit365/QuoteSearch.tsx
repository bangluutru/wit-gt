import { Search, X } from 'lucide-react';
import type { Language } from '../../lib/types';

interface Props {
  lang: Language;
  value: string;
  onChange: (value: string) => void;
}

export function QuoteSearch({ lang, value, onChange }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-wit-text-tertiary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={L(
          'Tìm kiếm trong 365 hạt giống...',
          'Search across 365 seeds...',
          '365の種を検索...'
        )}
        className="w-full pl-10 pr-10 py-3 rounded-xl bg-wit-surface border border-wit-line text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red/40 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-wit-text-tertiary hover:text-wit-text hover:bg-wit-surface-2 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
