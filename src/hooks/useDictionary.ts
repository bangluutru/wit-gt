import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { DictionaryTerm, Language } from '../lib/types';

export function useDictionary() {
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const snap = await getDocs(collection(db, 'dictionary'));
        setTerms(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as DictionaryTerm[]
        );
      } catch (err) {
        console.error('Failed to fetch dictionary:', err);
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
    sourceLang: Language,
    category?: string
  ): DictionaryTerm[] => {
    const q = searchQuery.toLowerCase().trim();
    return terms.filter((t) => {
      // Category filter
      if (category && t.category !== category) return false;
      if (!q) return true;

      // Search in source language term + definition
      const termField = sourceLang === 'vi' ? t.viTerm : sourceLang === 'en' ? t.enTerm : t.jpTerm;
      const defField = sourceLang === 'vi' ? t.viDef : sourceLang === 'en' ? t.enDef : t.jpDef;

      return (
        termField?.toLowerCase().includes(q) ||
        defField?.toLowerCase().includes(q)
      );
    });
  };

  const getTermsByIds = (ids: string[]) =>
    terms.filter((t) => ids.includes(t.id));

  return { terms, categories, loading, searchTerms, getTermsByIds };
}
