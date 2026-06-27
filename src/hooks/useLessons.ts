import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Lesson, Chapter } from '../lib/types';

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

        setLessons(
          lessonsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate?.() || new Date(),
            updatedAt: d.data().updatedAt?.toDate?.() || new Date(),
          })) as Lesson[]
        );

        setChapters(
          chaptersSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Chapter[]
        );
      } catch (err) {
        console.error('Failed to fetch lessons/chapters:', err);
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

  return {
    lessons,
    chapters,
    loading,
    getChapter,
    getLessonsByChapter,
    getLessonByNo,
    getLessonById,
  };
}
