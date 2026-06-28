// ============================================================
// WiT Platform - Core Types
// ============================================================

export type Language = 'vi' | 'en' | 'jp';
export type Theme = 'light' | 'warm' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type DisplayMode = 'single' | 'dual';
export type LessonStatus = 'completed' | 'accessible' | 'locked';
export type UserRole = 'user' | 'admin';

// ============================================================
// Database Models
// ============================================================

export interface Chapter {
  id: string;
  orderIndex: number;
  titleVi: string;
  titleEn: string;
  titleJp: string;
  descriptionVi: string;
  descriptionEn: string;
  descriptionJp: string;
}

export interface Lesson {
  id: string;
  lessonNo: number;
  chapterId: string;
  titleVi: string;
  titleEn: string;
  titleJp: string;
  summaryVi: string;
  summaryEn: string;
  summaryJp: string;
  contentVi: string;
  contentEn: string;
  contentJp: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  interfaceLang: Language;
  preferredSourceLang: Language;
  preferredTargetLang: Language;
  readerFontSize: FontSize;
  theme: Theme;
  displayMode: DisplayMode;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  lessonNo: number;
  status: 'completed';
  completedAt: Date;
}

export interface QuizQuestion {
  id: string;
  lessonId?: string;
  lessonNo?: number;
  chapterId?: string;
  questionVi: string;
  questionEn?: string;
  questionJp?: string;
  optionsVi: string[];
  optionsEn?: string[];
  optionsJp?: string[];
  correctIndex: number;
  explanationVi?: string;
  explanationEn?: string;
  explanationJp?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  status: 'published' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DictionaryTerm {
  id: string;
  category: string;
  viTerm: string;
  viDef: string;
  viPos: string;
  viIpa: string;
  enTerm: string;
  enDef: string;
  enPos: string;
  enIpa: string;
  jpTerm: string;
  jpDef: string;
  jpPos: string;
  jpKana: string;
  viImg: string;
  enImg: string;
  jpImg: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================
// UI / Component Types
// ============================================================

export interface LessonWithStatus extends Lesson {
  userStatus: LessonStatus;
  chapter?: Chapter;
}

export type DictionaryViewMode = 'dictionary' | 'definition' | 'visual' | 'flashcard' | 'multilingual';

export interface FlashcardConfig {
  count: 10 | 20 | 30;
  sourceLanguage: Language;
  targetLanguage: Language;
}

export interface FlashcardItem {
  term: DictionaryTerm;
  isFlipped: boolean;
  isKnown: boolean | null;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar?: string;
}

export interface TeamSection {
  title: string;
  members: TeamMember[];
}

// ============================================================
// Helpers
// ============================================================

/** Get localized field from an object based on language */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalized(
  obj: any,
  field: string,
  lang: Language
): string {
  const langSuffix = lang === 'vi' ? 'Vi' : lang === 'en' ? 'En' : 'Jp';
  const key = `${field}${langSuffix}`;
  return (obj[key] as string) || '';
}

// ============================================================
// Editorial board (Team / Advisors) — admin-editable, multilingual
// ============================================================

export type EditorialSection = 'team' | 'advisors';

export interface EditorialMember {
  id: string;
  initials: string;
  nameVi: string;
  nameEn: string;
  nameJp: string;
  roleVi: string;
  roleEn: string;
  roleJp: string;
  noteVi: string;
  noteEn: string;
  noteJp: string;
}
