// ============================================================
// WiT Platform - Diagram Lightbox (fullscreen đồ hình viewer)
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { diagramFullUrl, pickDiagramLang, type DiagramLang } from '../../lib/dictImages';

interface DiagramLightboxProps {
  slug: string;
  /** Preferred language; falls back to the other if unavailable. */
  preferLang: DiagramLang;
  title?: string;
  onClose: () => void;
}

const LANG_LABEL: Record<DiagramLang, string> = { vi: 'VI', en: 'EN' };

export default function DiagramLightbox({ slug, preferLang, title, onClose }: DiagramLightboxProps) {
  const initial = pickDiagramLang(slug, preferLang) ?? 'vi';
  const [lang, setLang] = useState<DiagramLang>(initial);
  const [zoomed, setZoomed] = useState(false);

  // Which language variants exist for this slug (for the VI/EN toggle).
  const hasVi = pickDiagramLang(slug, 'vi') === 'vi';
  const hasEn = pickDiagramLang(slug, 'en') === 'en';
  const bothLangs = hasVi && hasEn;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
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
        <span className="text-white/90 font-serif text-sm sm:text-base truncate">{title}</span>
        <div className="flex items-center gap-2">
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
