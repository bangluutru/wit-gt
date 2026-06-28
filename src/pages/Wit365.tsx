// ============================================================
// WiT365 – Mỗi ngày một hạt giống nhận thức
// ============================================================

import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useWit365 } from '../hooks/useWit365';
import { Wit365Hero } from '../components/wit365/Wit365Hero';
import { DailySeedCard } from '../components/wit365/DailySeedCard';
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
    }
  }, [getRandomQuote, displayedQuote]);

  // Step prev/next through the ordered quotes (wraps around)
  const handleStep = useCallback(
    (dir: number) => {
      if (!displayedQuote || quotes.length === 0) return;
      const i = quotes.findIndex((q) => q.id === displayedQuote.id);
      const next = (i + dir + quotes.length) % quotes.length;
      setActiveQuote(quotes[next]);
      setAnimKey((k) => k + 1);
    },
    [quotes, displayedQuote]
  );

  const handleSelectQuote = useCallback((quote: Wit365Quote) => {
    setActiveQuote(quote);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-wit-red" />
      </div>
    );
  }

  return (
    <div className="page-enter max-w-[720px] mx-auto pb-20">
      <Wit365Hero lang={interfaceLang} />

      {displayedQuote && (
        <DailySeedCard
          quote={displayedQuote}
          lang={interfaceLang}
          isFavorite={isFavorite(displayedQuote.id)}
          onToggleFavorite={() => toggleFavorite(displayedQuote.id)}
          onPrev={() => handleStep(-1)}
          onNext={() => handleStep(1)}
          onRandom={handleRandom}
          animationKey={animKey}
        />
      )}

      {/* Archive (collapsible) */}
      <QuoteList
        lang={interfaceLang}
        quotes={quotes}
        searchQuotes={searchQuotes}
        isFavorite={isFavorite}
        onSelectQuote={handleSelectQuote}
      />
    </div>
  );
}
