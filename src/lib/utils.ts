// ============================================================
// WiT Platform - Utility Functions
// ============================================================

import type { Language, LessonStatus } from './types';

/**
 * Merge CSS class names, filtering out falsy values
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Determine lesson status based on completed lessons
 */
export function getLessonStatus(
  lessonNo: number,
  completedLessons: Set<number>
): LessonStatus {
  if (completedLessons.has(lessonNo)) return 'completed';
  const maxCompleted = completedLessons.size > 0
    ? Math.max(...completedLessons)
    : 0;
  const currentLesson = maxCompleted + 1;
  if (lessonNo <= currentLesson) return 'accessible';
  return 'locked';
}

/**
 * Get the current lesson number based on completed lessons
 */
export function getCurrentLessonNo(completedLessons: Set<number>): number {
  if (completedLessons.size === 0) return 1;
  return Math.max(...completedLessons) + 1;
}

/**
 * Format a date to localized string
 */
export function formatDate(date: Date, lang: Language): string {
  const locale = lang === 'vi' ? 'vi-VN' : lang === 'jp' ? 'ja-JP' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Speak text using Web Speech API
 */
export function speakText(text: string, lang: Language): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'vi' ? 'vi-VN' : lang === 'jp' ? 'ja-JP' : 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get a random subset of items from an array
 */
export function getRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Parse CSV string to array of objects
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}
