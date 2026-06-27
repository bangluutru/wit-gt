import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { LessonProgress } from '../lib/types';

export function useProgress() {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompletedLessons(new Set());
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const q = query(
          collection(db, 'users', user.uid, 'progress'),
          orderBy('lessonNo')
        );
        const snap = await getDocs(q);
        const completed = new Set<number>();
        snap.forEach((d) => {
          const data = d.data() as LessonProgress;
          completed.add(data.lessonNo);
        });
        setCompletedLessons(completed);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const completeLesson = async (lessonNo: number, lessonId: string) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'progress', lessonId), {
        lessonNo,
        status: 'completed',
        completedAt: serverTimestamp(),
      });
      setCompletedLessons((prev) => new Set([...prev, lessonNo]));
    } catch (err) {
      console.error('Failed to complete lesson:', err);
      throw err;
    }
  };

  const uncompleteLesson = async (lessonNo: number, lessonId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'progress', lessonId));
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        next.delete(lessonNo);
        return next;
      });
    } catch (err) {
      console.error('Failed to uncomplete lesson:', err);
    }
  };

  return { completedLessons, loading, completeLesson, uncompleteLesson };
}
