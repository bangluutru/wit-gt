// ============================================================
// WiT365 – Mỗi ngày một hạt giống nhận thức
// ============================================================

import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useWit365 } from '../hooks/useWit365';
import { Wit365Hero } from '../components/wit365/Wit365Hero';
import { DailySeedCard } from '../components/wit365/DailySeedCard';
import { RandomQuoteButton } from '../components/wit365/RandomQuoteButton';
import { QuoteList } from '../components/wit365/QuoteList';
import type { Wit365Quote } from '../lib/types';

export default function Wit365() {
  const { interfaceLang } = useSettings();
  const {
    quotes,
    loading,
    getTodayQuote,
    getRandomQuote,
    searchQuotes,
    toggleFavorite,
    isFavorite,
  } = useWit365();

  const [activeQuote, setActiveQuote] = useState<Wit365Quote | null>(null);
  const [animKey, setAnimKey] = useState(0);

  // Determine displayed quote (active override or today's)
  const displayedQuote = activeQuote || getTodayQuote();

  const handleRandom = useCallback(() => {
    const random = getRandomQuote(displayedQuote?.index);
    if (random) {
      setActiveQuote(random);
      setAnimKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [getRandomQuote, displayedQuote]);

  const handleSelectQuote = useCallback((quote: Wit365Quote) => {
    setActiveQuote(quote);
    setAnimKey((k) => k + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-wit-red" />
      </div>
    );
  }

  return (
    <div className="page-enter">
      <Wit365Hero lang={interfaceLang} />

      {/* Daily Seed Section */}
      <section className="max-w-2xl mx-auto pb-20 space-y-8">
        {displayedQuote && (
          <DailySeedCard
            quote={displayedQuote}
            lang={interfaceLang}
            isFavorite={isFavorite(displayedQuote.id)}
            onToggleFavorite={() => toggleFavorite(displayedQuote.id)}
            animationKey={animKey}
          />
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <RandomQuoteButton lang={interfaceLang} onRandom={handleRandom} />
        </div>

        {/* Full list */}
        <QuoteList
          lang={interfaceLang}
          quotes={quotes}
          searchQuotes={searchQuotes}
          isFavorite={isFavorite}
          onSelectQuote={handleSelectQuote}
        />
      </section>
    </div>
  );
}
