// ============================================================
// WiT Platform - Diagram Gallery (tab "Hình ảnh")
// ============================================================
// Shows every đồ hình as a thumbnail, matched to a dictionary term
// when the filename slug equals imgKey(viTerm). Click → lightbox.

import { useMemo, useState } from 'react';
import { Link2 } from 'lucide-react';
import type { DictionaryTerm, Language } from '../../lib/types';
import {
  DICT_DIAGRAMS,
  imgKey,
  pickDiagramLang,
  diagramThumbUrl,
  prettifySlug,
  type DiagramLang,
} from '../../lib/dictImages';
import DiagramLightbox from './DiagramLightbox';

interface DiagramGalleryProps {
  terms: DictionaryTerm[];
  sourceLang: Language;
  searchQuery: string;
  emptyLabel: string;
}

interface GalleryItem {
  slug: string;
  lang: DiagramLang;
  title: string;
  matchedTermName?: string;
  searchBlob: string;
}

export default function DiagramGallery({
  terms,
  sourceLang,
  searchQuery,
  emptyLabel,
}: DiagramGalleryProps) {
  const preferLang: DiagramLang = sourceLang === 'vi' ? 'vi' : 'en';

  // Map imgKey(viTerm) → term, to label/link matched diagrams.
  const termBySlug = useMemo(() => {
    const m = new Map<string, DictionaryTerm>();
    for (const t of terms) {
      const k = imgKey(t.viTerm);
      if (k && !m.has(k)) m.set(k, t);
    }
    return m;
  }, [terms]);

  const items = useMemo<GalleryItem[]>(() => {
    const list = DICT_DIAGRAMS.map((d) => {
      const lang = pickDiagramLang(d.slug, preferLang) ?? 'vi';
      const term = termBySlug.get(d.slug);
      const matchedTermName = term
        ? sourceLang === 'en'
          ? term.enTerm || term.viTerm
          : term.viTerm
        : undefined;
      const title = matchedTermName || prettifySlug(d.slug);
      const searchBlob = [
        d.slug,
        matchedTermName,
        term?.viTerm,
        term?.enTerm,
        prettifySlug(d.slug),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return { slug: d.slug, lang, title, matchedTermName, searchBlob };
    });
    // Matched (linked to a term) first, then the rest, each alphabetical.
    list.sort((a, b) => {
      const am = a.matchedTermName ? 0 : 1;
      const bm = b.matchedTermName ? 0 : 1;
      if (am !== bm) return am - bm;
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [termBySlug, preferLang, sourceLang]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.searchBlob.includes(q));
  }, [items, searchQuery]);

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openItem = filtered.find((it) => it.slug === openSlug) || null;

  if (filtered.length === 0) {
    return <p className="text-center text-wit-text-secondary py-12">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((it) => (
          <button
            key={it.slug}
            type="button"
            onClick={() => setOpenSlug(it.slug)}
            className="group text-left bg-wit-surface rounded-card border border-wit-line/50 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col"
          >
            <div className="aspect-[7/10] bg-wit-surface-2 overflow-hidden">
              <img
                src={diagramThumbUrl(it.slug, it.lang)}
                alt={it.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-200"
              />
            </div>
            <div className="px-3 py-2.5 flex items-start gap-1.5">
              {it.matchedTermName && (
                <Link2 className="h-3.5 w-3.5 text-wit-red shrink-0 mt-0.5" />
              )}
              <span
                className={`text-[12.5px] leading-snug line-clamp-2 ${
                  it.matchedTermName
                    ? 'font-serif font-semibold text-wit-text'
                    : 'text-wit-text-secondary'
                }`}
              >
                {it.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      {openItem && (
        <DiagramLightbox
          slug={openItem.slug}
          preferLang={preferLang}
          title={openItem.title}
          onClose={() => setOpenSlug(null)}
        />
      )}
    </>
  );
}
