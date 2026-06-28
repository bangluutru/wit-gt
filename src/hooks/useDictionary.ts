import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { DictionaryTerm, Language } from '../lib/types';
import { SEED_TERMS } from '../lib/seedContent';
import { normalizeText } from '../lib/utils';

export function useDictionary() {
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const snap = await getDocs(collection(db, 'dictionary'));
        const fetched = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as DictionaryTerm[];
        // Fall back to bundled seed terms when Firestore is empty.
        setTerms(fetched.length > 0 ? fetched : SEED_TERMS);
      } catch (err) {
        console.error('Failed to fetch dictionary:', err);
        setTerms(SEED_TERMS);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    terms.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats).sort();
  }, [terms]);

  const searchTerms = (
    searchQuery: string,
    // Kept for backwards compatibility; search now spans every language.
    _sourceLang: Language,
    category?: string
  ): DictionaryTerm[] => {
    const q = normalizeText(searchQuery);
    return terms.filter((t) => {
      // Category filter
      if (category && t.category !== category) return false;
      if (!q) return true;

      // Two-way search across all VI · EN · JP fields, diacritic-insensitive.
      const haystack = [
        t.viTerm, t.viDef, t.viPos, t.viIpa,
        t.enTerm, t.enDef, t.enPos, t.enIpa,
        t.jpTerm, t.jpDef, t.jpPos, t.jpKana,
        t.category,
      ]
        .filter(Boolean)
        .join(' ');

      return normalizeText(haystack).includes(q);
    });
  };

  const getTermsByIds = (ids: string[]) =>
    terms.filter((t) => ids.includes(t.id));

  return { terms, categories, loading, searchTerms, getTermsByIds };
}
