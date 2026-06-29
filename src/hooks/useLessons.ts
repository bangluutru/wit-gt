import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Lesson, Chapter } from '../lib/types';
import { SEED_LESSONS, SEED_CHAPTERS } from '../lib/seedContent';

/** Fields an admin may edit in-place from the reader. */
export type LessonEditableField =
  | 'titleVi' | 'titleEn' | 'titleJp'
  | 'summaryVi' | 'summaryEn' | 'summaryJp'
  | 'contentVi' | 'contentEn' | 'contentJp';

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsSnap, chaptersSnap] = await Promise.all([
          getDocs(query(collection(db, 'lessons'), orderBy('lessonNo'))),
          getDocs(query(collection(db, 'chapters'), orderBy('orderIndex'))),
        ]);

        const fetchedLessons = lessonsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
          updatedAt: d.data().updatedAt?.toDate?.() || new Date(),
        })) as Lesson[];

        const fetchedChapters = chaptersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Chapter[];

        // Fall back to bundled seed content when Firestore is empty.
        setLessons(fetchedLessons.length > 0 ? fetchedLessons : SEED_LESSONS);
        setChapters(fetchedChapters.length > 0 ? fetchedChapters : SEED_CHAPTERS);
      } catch (err) {
        console.error('Failed to fetch lessons/chapters:', err);
        // Network/permission failure — use bundled seed content.
        setLessons(SEED_LESSONS);
        setChapters(SEED_CHAPTERS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChapter = (chapterId: string) =>
    chapters.find((c) => c.id === chapterId);

  const getLessonsByChapter = (chapterId: string) =>
    lessons.filter((l) => l.chapterId === chapterId);

  const getLessonByNo = (lessonNo: number) =>
    lessons.find((l) => l.lessonNo === lessonNo);

  const getLessonById = (id: string) =>
    lessons.find((l) => l.id === id);

  /**
   * Persist an admin edit to a lesson, then update local state so the reader
   * reflects it immediately. Writes only the provided fields (merge), so other
   * languages and metadata are never touched. Returns true on success.
   */
  const updateLesson = useCallback(
    async (id: string, patch: Partial<Record<LessonEditableField, string>>): Promise<boolean> => {
      try {
        await setDoc(
          doc(db, 'lessons', id),
          { ...patch, updatedAt: serverTimestamp() },
          { merge: true }
        );
        setLessons((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date() } : l))
        );
        return true;
      } catch (err) {
        console.error('Failed to update lesson:', err);
        return false;
      }
    },
    []
  );

  return {
    lessons,
    chapters,
    loading,
    getChapter,
    getLessonsByChapter,
    getLessonByNo,
    getLessonById,
    updateLesson,
  };
}
