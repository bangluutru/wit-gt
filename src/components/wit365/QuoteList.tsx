import { useState } from 'react';
import { ChevronDown, Library } from 'lucide-react';
import { QuoteSearch } from './QuoteSearch';
import { QuoteListItem } from './QuoteListItem';
import type { Wit365Quote, Language } from '../../lib/types';

interface Props {
  lang: Language;
  quotes: Wit365Quote[];
  searchQuotes: (query: string) => Wit365Quote[];
  isFavorite: (id: string) => boolean;
  onSelectQuote: (quote: Wit365Quote) => void;
}

export function QuoteList({ lang, quotes, searchQuotes, isFavorite, onSelectQuote }: Props) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  const filteredQuotes = searchValue ? searchQuotes(searchValue) : quotes;

  return (
    <section className="mt-5">
      <div className="text-center">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2.5 px-[18px] py-[9px] rounded-button border border-wit-line text-[13.5px] font-medium text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text transition-all duration-200 cursor-pointer"
        >
          <Library className="h-4 w-4" />
          {L(
            `Xem toàn bộ ${quotes.length} hạt giống`,
            `Browse all ${quotes.length} seeds`,
            `全${quotes.length}の種を閲覧`
          )}
          <ChevronDown
            className={`h-[15px] w-[15px] ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-400 ease-out ${
          open ? 'max-h-[4000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-wit-surface rounded-card border border-wit-line shadow-card p-5 space-y-4">
          <QuoteSearch lang={lang} value={searchValue} onChange={setSearchValue} />

          {searchValue && (
            <p className="text-xs text-wit-text-tertiary px-1">
              {filteredQuotes.length} {L('kết quả', 'results', '件')}
            </p>
          )}

          <div className="max-h-[480px] overflow-y-auto -mx-1 px-1 space-y-0.5">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <QuoteListItem
                  key={quote.id}
                  quote={quote}
                  lang={lang}
                  isFavorite={isFavorite(quote.id)}
                  onClick={() => {
                    onSelectQuote(quote);
                    setOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))
            ) : (
              <div className="py-12 text-center text-sm text-wit-text-tertiary">
                {L(
                  'Không tìm thấy kết quả nào.',
                  'No results found.',
                  '結果が見つかりませんでした。'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
