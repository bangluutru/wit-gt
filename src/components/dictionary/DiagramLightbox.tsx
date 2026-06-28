// ============================================================
// WiT Platform - Diagram Lightbox (fullscreen đồ hình viewer)
// ============================================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Pencil, Check } from 'lucide-react';
import { diagramFullUrl, pickDiagramLang, type DiagramLang } from '../../lib/dictImages';

interface DiagramLightboxProps {
  slug: string;
  /** Preferred language; falls back to the other if unavailable. */
  preferLang: DiagramLang;
  title?: string;
  /** Whether the current user is admin (shows edit button). */
  isAdmin?: boolean;
  /** Called when admin saves a new title from the lightbox. */
  onRenameTitle?: (slug: string, newTitle: string) => void;
  onClose: () => void;
}

const LANG_LABEL: Record<DiagramLang, string> = { vi: 'VI', en: 'EN' };

export default function DiagramLightbox({
  slug,
  preferLang,
  title,
  isAdmin,
  onRenameTitle,
  onClose,
}: DiagramLightboxProps) {
  const initial = pickDiagramLang(slug, preferLang) ?? 'vi';
  const [lang, setLang] = useState<DiagramLang>(initial);
  const [zoomed, setZoomed] = useState(false);

  // ── Inline title editing ────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title || '');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editing]);

  const startEditing = () => {
    setEditValue(title || '');
    setEditing(true);
  };

  const saveEditing = () => {
    const trimmed = editValue.trim();
    if (trimmed && onRenameTitle) {
      onRenameTitle(slug, trimmed);
    }
    setEditing(false);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditValue(title || '');
  };

  // Which language variants exist for this slug (for the VI/EN toggle).
  const hasVi = pickDiagramLang(slug, 'vi') === 'vi';
  const hasEn = pickDiagramLang(slug, 'en') === 'en';
  const bothLangs = hasVi && hasEn;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editing) {
          cancelEditing();
        } else {
          onClose();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, editing],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/80 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Đồ hình'}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
        {/* Title area */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                ref={editInputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing();
                  if (e.key === 'Escape') cancelEditing();
                }}
                className="flex-1 min-w-0 px-2 py-1 rounded border border-white/30 bg-white/10 text-white text-sm font-serif focus:outline-none focus:ring-1 focus:ring-white/50"
              />
              <button
                type="button"
                onClick={saveEditing}
                className="w-7 h-7 flex items-center justify-center rounded-button bg-green-600/80 text-white hover:bg-green-600 transition-colors cursor-pointer"
                title="Lưu"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="w-7 h-7 flex items-center justify-center rounded-button bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Hủy"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <span className="text-white/90 font-serif text-sm sm:text-base truncate">
                {title}
              </span>
              {isAdmin && onRenameTitle && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="w-7 h-7 flex items-center justify-center rounded-button bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Sửa tên đồ hình"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 shrink-0">
          {bothLangs && (
            <div className="inline-flex rounded-button bg-white/10 p-0.5 gap-0.5">
              {(['vi', 'en'] as DiagramLang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-[10px] text-xs font-bold transition-colors cursor-pointer ${
                    lang === l ? 'bg-white text-wit-text' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="w-9 h-9 flex items-center justify-center rounded-button bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label={zoomed ? 'Thu nhỏ' : 'Phóng to'}
          >
            {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-button bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image area — click backdrop to close */}
      <div
        className={`flex-1 min-h-0 px-4 pb-4 ${
          zoomed ? 'overflow-auto' : 'overflow-hidden flex items-center justify-center'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          src={diagramFullUrl(slug, lang)}
          alt={title || slug}
          onClick={() => setZoomed((z) => !z)}
          className={`mx-auto rounded-card bg-wit-surface shadow-card-hover ${
            zoomed ? 'cursor-zoom-out w-auto max-w-none' : 'cursor-zoom-in max-h-full max-w-full object-contain'
          }`}
        />
      </div>
    </div>
  );
}
