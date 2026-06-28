// ============================================================
// WiT Platform - Dictionary diagram (đồ hình) resolver
// ============================================================
// Diagram filenames are derived from the Vietnamese term using the
// same normalization as the Firestore doc-id, but WITHOUT separators.
// e.g. "Chân thật" → slug "chanthat" → /dict-images/{thumb,full}/chanthat_vi.webp
// This lets us attach a diagram to a term purely from its viTerm, with
// no data migration. See scripts/optimize-dict-images.ts.

import { DICT_DIAGRAMS, type DiagramAsset } from '../data/dictImages.generated';
import type { Language } from './types';

export type DiagramLang = 'vi' | 'en';

const BASE = '/dict-images';
const BY_SLUG = new Map<string, DiagramAsset>(DICT_DIAGRAMS.map((d) => [d.slug, d]));

/** Normalize a Vietnamese term to its diagram filename slug (no separators). */
export function imgKey(viTerm: string): string {
  return (viTerm || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '');
}

/** Map a UI/source language to an available diagram language (jp falls back to en). */
function toDiagramLang(lang: Language): DiagramLang {
  return lang === 'vi' ? 'vi' : 'en';
}

/** Pick an available language for a slug, preferring `prefer`, else the other. */
export function pickDiagramLang(slug: string, prefer: DiagramLang): DiagramLang | null {
  const e = BY_SLUG.get(slug);
  if (!e) return null;
  if (prefer === 'vi') return e.vi ? 'vi' : e.en ? 'en' : null;
  return e.en ? 'en' : e.vi ? 'vi' : null;
}

export function diagramThumbUrl(slug: string, lang: DiagramLang): string {
  return `${BASE}/thumb/${slug}_${lang}.webp`;
}

export function diagramFullUrl(slug: string, lang: DiagramLang): string {
  return `${BASE}/full/${slug}_${lang}.webp`;
}

export function hasDiagram(slug: string): boolean {
  return BY_SLUG.has(slug);
}

/** Resolve the diagram slug for a dictionary term, or null if none exists. */
export function diagramSlugForTerm(viTerm: string): string | null {
  const key = imgKey(viTerm);
  return BY_SLUG.has(key) ? key : null;
}

/**
 * Resolve a ready-to-use thumbnail + full URL for a term in a given language,
 * with language fallback. Returns null if the term has no diagram.
 */
export function resolveTermDiagram(
  viTerm: string,
  lang: Language,
): { slug: string; lang: DiagramLang; thumb: string; full: string } | null {
  const slug = diagramSlugForTerm(viTerm);
  if (!slug) return null;
  const dl = pickDiagramLang(slug, toDiagramLang(lang));
  if (!dl) return null;
  return { slug, lang: dl, thumb: diagramThumbUrl(slug, dl), full: diagramFullUrl(slug, dl) };
}

// ── Gallery helpers (visual tab) ─────────────────────────────

/** Human-ish title fallback for composite posters with no matching term. */
export function prettifySlug(slug: string): string {
  return slug
    .replace(/^[0-9]+_/, '') // strip leading "7_" numbering
    .split('_')
    .filter(Boolean)
    .join(' · ');
}

export { DICT_DIAGRAMS };
export type { DiagramAsset };
