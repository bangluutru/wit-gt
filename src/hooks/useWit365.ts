// ============================================================
// WiT365 - Custom Hook for daily seed quotes
// ============================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Wit365Quote } from '../lib/types';

const FAVORITES_KEY = 'wit365-favorites';

/** Strip Vietnamese diacritics for accent-insensitive search */
function stripDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/** Get day-of-year (1-based) */
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function useWit365() {
  const [quotes, setQuotes] = useState<Wit365Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // ── Fetch all quotes once ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchQuotes = async () => {
      try {
        const q = query(collection(db, 'wit365_quotes'), orderBy('index', 'asc'));
        const snap = await getDocs(q);
        if (cancelled) return;
        const data: Wit365Quote[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Wit365Quote, 'id'>),
        }));
        setQuotes(data);
      } catch (err) {
        console.error('Failed to fetch WiT365 quotes:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchQuotes();
    return () => { cancelled = true; };
  }, []);

  // ── Today's quote ────────────────────────────────────────
  const getTodayQuote = useCallback((): Wit365Quote | null => {
    if (quotes.length === 0) return null;
    const dayIndex = getDayOfYear() % quotes.length;
    return quotes[dayIndex];
  }, [quotes]);

  // ── Random quote (not current) ────────────────────────────
  const getRandomQuote = useCallback(
    (excludeIndex?: number): Wit365Quote | null => {
      if (quotes.length === 0) return null;
      if (quotes.length === 1) return quotes[0];

      const available = excludeIndex != null
        ? quotes.filter((q) => q.index !== excludeIndex)
        : quotes;

      return available[Math.floor(Math.random() * available.length)];
    },
    [quotes]
  );

  // ── Get by index ──────────────────────────────────────────
  const getQuote = useCallback(
    (index: number): Wit365Quote | null => {
      return quotes.find((q) => q.index === index) || null;
    },
    [quotes]
  );

  // ── Search ────────────────────────────────────────────────
  const searchQuotes = useCallback(
    (searchQuery: string): Wit365Quote[] => {
      if (!searchQuery.trim()) return quotes;

      const q = stripDiacritics(searchQuery.toLowerCase());

      return quotes.filter((quote) => {
        const vi = stripDiacritics(quote.viText.toLowerCase());
        const enLit = quote.enLiteral.toLowerCase();
        const enNat = quote.enNatural.toLowerCase();
        return vi.includes(q) || enLit.includes(q) || enNat.includes(q);
      });
    },
    [quotes]
  );

  // ── Favorites ─────────────────────────────────────────────
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string): boolean => favorites.has(id),
    [favorites]
  );

  const getFavorites = useMemo(
    () => quotes.filter((q) => favorites.has(q.id)),
    [quotes, favorites]
  );

  return {
    quotes,
    loading,
    getTodayQuote,
    getRandomQuote,
    getQuote,
    searchQuotes,
    toggleFavorite,
    isFavorite,
    getFavorites,
  };
}
