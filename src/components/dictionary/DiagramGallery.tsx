// ============================================================
// WiT Platform - Diagram Gallery (tab "Đồ hình")
// ============================================================
// Shows every đồ hình as a thumbnail, matched to a dictionary term
// when the filename slug equals imgKey(viTerm). Click → lightbox.
// Admin users can rename any diagram title via inline editing.

import { useMemo, useState, useRef, useEffect } from 'react';
import { Link2, Pencil, Check, X, RotateCcw } from 'lucide-react';
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
import { useDiagramOverrides } from '../../hooks/useDiagramOverrides';
import { useAuth } from '../../contexts/AuthContext';

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
  defaultTitle: string;
  searchBlob: string;
}

export default function DiagramGallery({
  terms,
  sourceLang,
  searchQuery,
  emptyLabel,
}: DiagramGalleryProps) {
  const preferLang: DiagramLang = sourceLang === 'vi' ? 'vi' : 'en';
  const { overrides, setOverride, removeOverride } = useDiagramOverrides();
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === 'admin';

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
      const defaultTitle = matchedTermName || prettifySlug(d.slug);
      // Priority: custom override > matched term > prettified slug
      const customTitle = overrides.get(d.slug);
      const title = customTitle || defaultTitle;
      const searchBlob = [
        d.slug,
        customTitle,
        matchedTermName,
        term?.viTerm,
        term?.enTerm,
        prettifySlug(d.slug),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return { slug: d.slug, lang, title, matchedTermName, defaultTitle, searchBlob };
    });
    // Matched (linked to a term) first, then the rest, each alphabetical.
    list.sort((a, b) => {
      const am = a.matchedTermName ? 0 : 1;
      const bm = b.matchedTermName ? 0 : 1;
      if (am !== bm) return am - bm;
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [termBySlug, preferLang, sourceLang, overrides]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.searchBlob.includes(q));
  }, [items, searchQuery]);

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openItem = filtered.find((it) => it.slug === openSlug) || null;

  // ── Inline editing state ────────────────────────────────────
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSlug && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingSlug]);

  const startEditing = (slug: string, currentTitle: string) => {
    setEditingSlug(slug);
    setEditValue(currentTitle);
  };

  const cancelEditing = () => {
    setEditingSlug(null);
    setEditValue('');
  };

  const saveEditing = async () => {
    if (!editingSlug || !editValue.trim() || !user?.email) return;
    await setOverride(editingSlug, editValue.trim(), user.email);
    setEditingSlug(null);
    setEditValue('');
  };

  const handleResetTitle = async (slug: string) => {
    await removeOverride(slug);
  };

  const handleLightboxRename = async (slug: string, newTitle: string) => {
    if (!user?.email) return;
    await setOverride(slug, newTitle, user.email);
  };

  if (filtered.length === 0) {
    return <p className="text-center text-wit-text-secondary py-12">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((it) => {
          const isEditing = editingSlug === it.slug;
          const hasOverride = overrides.has(it.slug);

          return (
            <div
              key={it.slug}
              className="group text-left bg-wit-surface rounded-card border border-wit-line/50 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex flex-col"
            >
              {/* Thumbnail — click opens lightbox */}
              <button
                type="button"
                onClick={() => setOpenSlug(it.slug)}
                className="aspect-[7/10] bg-wit-surface-2 overflow-hidden cursor-pointer"
              >
                <img
                  src={diagramThumbUrl(it.slug, it.lang)}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-200"
                />
              </button>

              {/* Title area */}
              <div className="px-3 py-2.5 flex items-start gap-1.5 min-h-[44px]">
                {it.matchedTermName && !isEditing && (
                  <Link2 className="h-3.5 w-3.5 text-wit-red shrink-0 mt-0.5" />
                )}

                {isEditing ? (
                  /* ── Inline edit mode ─────────────────── */
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      className="flex-1 text-[12px] leading-snug px-1.5 py-0.5 rounded border border-wit-red/40 bg-wit-surface-2 text-wit-text focus:outline-none focus:ring-1 focus:ring-wit-red/30 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={saveEditing}
                      className="p-0.5 text-green-600 hover:text-green-700 cursor-pointer shrink-0"
                      title="Lưu"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="p-0.5 text-wit-text-tertiary hover:text-wit-text cursor-pointer shrink-0"
                      title="Hủy"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  /* ── Display mode ────────────────────── */
                  <>
                    <span
                      className={`text-[12.5px] leading-snug line-clamp-2 flex-1 ${
                        it.matchedTermName
                          ? 'font-serif font-semibold text-wit-text'
                          : 'text-wit-text-secondary'
                      }`}
                    >
                      {it.title}
                    </span>

                    {/* Admin action buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(it.slug, it.title);
                          }}
                          className="p-0.5 text-wit-text-tertiary hover:text-wit-red cursor-pointer"
                          title="Sửa tên"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        {hasOverride && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetTitle(it.slug);
                            }}
                            className="p-0.5 text-wit-text-tertiary hover:text-amber-600 cursor-pointer"
                            title="Đặt lại tên mặc định"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openItem && (
        <DiagramLightbox
          slug={openItem.slug}
          preferLang={preferLang}
          title={openItem.title}
          isAdmin={isAdmin}
          onRenameTitle={isAdmin ? handleLightboxRename : undefined}
          onClose={() => setOpenSlug(null)}
        />
      )}
    </>
  );
}
