// ============================================================
// WiT Platform - Multilingual dictionary client (minhqnd API)
// ============================================================
//
// Thin client over the free, CORS-enabled multilingual dictionary API at
// dict.minhqnd.com (357k+ words, VI·EN·ZH·JA·KO…). The data is provided under
// CC BY-SA 4.0 — the UI must attribute "dict.minhqnd.com". This is a separate,
// general-purpose lookup and is intentionally NOT merged with WiT's curated
// "từ điển nội tâm" terms.
// ============================================================

export const MULTIDICT_BASE: string =
  (import.meta.env.VITE_MULTIDICT_API as string | undefined)?.replace(/\/$/, '') ||
  'https://dict.minhqnd.com';

export const MULTIDICT_ATTRIBUTION_URL = 'https://dict.minhqnd.com';

/** Definition-language filter accepted by the API. '' = no filter (show all). */
export type DefLang = 'vi' | 'en' | '';

export interface MultiMeaning {
  definition: string;
  definition_lang: string;
  example?: string | null;
  pos?: string | null;
  sub_pos?: string | null;
  source?: string | null;
  links?: string[];
}

export interface MultiPronunciation {
  ipa: string;
  region?: string | null;
}

export interface MultiTranslation {
  lang_code: string;
  translation: string;
  lang_name: string;
}

export interface MultiRelation {
  related_word: string;
  relation_type: string;
}

export interface MultiResult {
  lang_code: string;
  lang_name: string;
  audio?: string | null;
  meanings: MultiMeaning[];
  pronunciations: MultiPronunciation[];
  translations: MultiTranslation[];
  relations: MultiRelation[];
}

export interface LookupResponse {
  exists: boolean;
  word: string;
  results?: MultiResult[];
}

/** Absolute URL for an API-relative path (e.g. the TTS `audio` field). */
export function multiDictUrl(path: string): string {
  if (!path) return '';
  return path.startsWith('http') ? path : `${MULTIDICT_BASE}${path}`;
}

/** Look up a word. Returns `{ exists: false }` for 404 / not found. */
export async function lookupWord(
  word: string,
  defLang: DefLang = '',
  signal?: AbortSignal
): Promise<LookupResponse> {
  const q = word.trim();
  if (!q) return { exists: false, word: '' };
  const params = new URLSearchParams({ word: q });
  if (defLang) params.set('def_lang', defLang);
  const res = await fetch(`${MULTIDICT_BASE}/api/v1/lookup?${params}`, { signal });
  if (res.status === 404) return { exists: false, word: q };
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
  return (await res.json()) as LookupResponse;
}

/** Prefix suggestions for autocomplete. */
export async function suggestWords(
  prefix: string,
  limit = 6,
  signal?: AbortSignal
): Promise<string[]> {
  const q = prefix.trim();
  if (!q) return [];
  const params = new URLSearchParams({ q, limit: String(limit) });
  const res = await fetch(`${MULTIDICT_BASE}/api/v1/suggest?${params}`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as { suggestions?: string[] };
  return data.suggestions ?? [];
}

/** TTS audio URL for a word. */
export function ttsUrl(word: string, lang = 'vi'): string {
  const params = new URLSearchParams({ word, lang });
  return `${MULTIDICT_BASE}/api/v1/tts?${params}`;
}
