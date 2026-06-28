// ============================================================
// WiT Platform - Custom diagram title overrides (Firestore)
// ============================================================
// Admin users can manually set a display title for any diagram
// slug so that posters without a matching DictionaryTerm still
// show a human-friendly, diacritics-correct Vietnamese name
// instead of the raw filename slug.
//
// Collection: diagramOverrides/{slug}
//   - title: string
//   - updatedAt: Timestamp
//   - updatedBy: string (email)

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COL = 'diagramOverrides';

export interface DiagramOverride {
  title: string;
  updatedAt?: Date;
  updatedBy?: string;
}

/**
 * Subscribe to the `diagramOverrides` collection and expose a
 * read-only Map<slug, title> plus write helpers for admin use.
 */
export function useDiagramOverrides() {
  const [overrides, setOverrides] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, COL),
      (snap) => {
        const m = new Map<string, string>();
        snap.forEach((d) => {
          const data = d.data();
          if (data.title) m.set(d.id, data.title as string);
        });
        setOverrides(m);
        setLoading(false);
      },
      (err) => {
        console.error('[diagramOverrides] snapshot error', err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  /** Set (create / update) a custom title for a diagram slug. */
  const setOverride = async (slug: string, title: string, email: string) => {
    await setDoc(doc(db, COL, slug), {
      title: title.trim(),
      updatedAt: serverTimestamp(),
      updatedBy: email,
    });
  };

  /** Remove the custom title so the diagram falls back to its default name. */
  const removeOverride = async (slug: string) => {
    await deleteDoc(doc(db, COL, slug));
  };

  return useMemo(
    () => ({ overrides, loading, setOverride, removeOverride }),
    [overrides, loading],
  );
}
