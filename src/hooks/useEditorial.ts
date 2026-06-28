import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { EditorialMember, EditorialSection } from '../lib/types';
import { SEED_TEAM, SEED_ADVISORS } from '../lib/seedEditorial';

const DOC_PATH = ['siteContent', 'editorial'] as const;

interface EditorialDoc {
  team: EditorialMember[];
  advisors: EditorialMember[];
}

const SEED: EditorialDoc = { team: SEED_TEAM, advisors: SEED_ADVISORS };

/**
 * Loads the editorial board (team + advisors) from a single Firestore document
 * `siteContent/editorial`. Falls back to bundled seed defaults until the
 * document is created. Admin writes persist the whole section array.
 */
export function useEditorial(section: EditorialSection) {
  const [data, setData] = useState<EditorialDoc>(SEED);
  const [fromFirestore, setFromFirestore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, ...DOC_PATH));
        if (!active) return;
        if (snap.exists()) {
          const d = snap.data() as Partial<EditorialDoc>;
          setData({
            team: d.team?.length ? d.team : SEED_TEAM,
            advisors: d.advisors?.length ? d.advisors : SEED_ADVISORS,
          });
          setFromFirestore(true);
        }
      } catch (err) {
        console.error('Failed to load editorial content:', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(
    async (nextSection: EditorialMember[]) => {
      setSaving(true);
      const next: EditorialDoc = { ...data, [section]: nextSection };
      try {
        await setDoc(
          doc(db, ...DOC_PATH),
          { [section]: nextSection, updatedAt: serverTimestamp() },
          { merge: true }
        );
        setData(next);
        setFromFirestore(true);
        return true;
      } catch (err) {
        console.error('Failed to save editorial content:', err);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [data, section]
  );

  const members = data[section];

  const saveMember = useCallback(
    (member: EditorialMember) => {
      const exists = members.some((m) => m.id === member.id);
      const next = exists
        ? members.map((m) => (m.id === member.id ? member : m))
        : [...members, member];
      return persist(next);
    },
    [members, persist]
  );

  const deleteMember = useCallback(
    (id: string) => persist(members.filter((m) => m.id !== id)),
    [members, persist]
  );

  return { members, loading, saving, fromFirestore, saveMember, deleteMember };
}
