import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { QuizQuestion } from '../lib/types';
import { SEED_QUIZ_QUESTIONS } from '../lib/seedQuiz';
import { getRandomSubset } from '../lib/utils';

interface QuizFilters {
  chapterId?: string;
  lessonNo?: number;
}

export function useQuizQuestions() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'quiz_questions'), where('status', '==', 'published'))
        );
        const fetched = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as QuizQuestion[];
        // Fall back to bundled seed questions when Firestore is empty.
        setQuestions(fetched.length > 0 ? fetched : SEED_QUIZ_QUESTIONS);
      } catch (err) {
        console.error('Failed to fetch quiz questions:', err);
        setQuestions(SEED_QUIZ_QUESTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  /** Pick `count` random published questions, optionally filtered by scope. */
  const getRandomQuestions = useCallback(
    (count: number, filters?: QuizFilters): QuizQuestion[] => {
      let filtered = questions.filter((q) => q.status === 'published');
      if (filters?.chapterId) {
        filtered = filtered.filter((q) => q.chapterId === filters.chapterId);
      }
      if (typeof filters?.lessonNo === 'number') {
        filtered = filtered.filter((q) => q.lessonNo === filters.lessonNo);
      }
      return getRandomSubset(filtered, count);
    },
    [questions]
  );

  return { questions, loading, getRandomQuestions };
}
