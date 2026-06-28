import { useEffect, useRef } from 'react';
import { X, Volume2 } from 'lucide-react';
import type { DictionaryTerm, Language } from '../../lib/types';
import { speakText } from '../../lib/utils';

interface TermPopoverProps {
  term: DictionaryTerm;
  sourceLang: Language;
  targetLang: Language;
  position: { top: number; left: number };
  onClose: () => void;
}

function getField(term: DictionaryTerm, field: string, lang: Language): string {
  const suffix = lang === 'vi' ? 'vi' : lang === 'en' ? 'en' : 'jp';
  const key = `${suffix}${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof DictionaryTerm;
  return (term[key] as string) || '';
}

export function TermPopover({
  term,
  sourceLang,
  targetLang,
  position,
  onClose,
}: TermPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const sourceTerm = getField(term, 'term', sourceLang);
  const sourceIpa = getField(term, 'ipa', sourceLang);
  const sourceKana = sourceLang === 'jp' ? getField(term, 'kana', sourceLang) : '';
  const sourceDef = getField(term, 'def', sourceLang);
  const sourcePos = getField(term, 'pos', sourceLang);

  const targetTerm = getField(term, 'term', targetLang);
  const targetDef = getField(term, 'def', targetLang);
  const targetIpa = getField(term, 'ipa', targetLang);
  const targetKana = targetLang === 'jp' ? getField(term, 'kana', targetLang) : '';
  const targetPos = getField(term, 'pos', targetLang);
  const hasTranslation = Boolean(targetTerm || targetDef);

  // Compute popover position — keep it on screen
  const popoverWidth = 320;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1024;
  let left = position.left;
  let top = position.top + 8; // 8px below the element

  if (left + popoverWidth > viewportW - 16) {
    left = viewportW - popoverWidth - 16;
  }
  if (left < 16) left = 16;

  return (
    <div
      ref={ref}
      className="fixed z-40 animate-scale-in"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <div className="bg-wit-surface rounded-xl shadow-popover p-4 w-[320px] border border-wit-line/50">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-wit-text">{sourceTerm}</span>
              <button
                onClick={() => speakText(sourceTerm, sourceLang)}
                className="text-wit-text-tertiary hover:text-wit-red transition-colors"
                title="Phát âm"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {(sourceIpa || sourceKana) && (
              <p className="text-xs text-wit-text-tertiary mt-0.5">
                {sourceIpa && `/${sourceIpa}/`}
                {sourceIpa && sourceKana && ' · '}
                {sourceKana}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="
              w-7 h-7 rounded-full flex items-center justify-center
              text-wit-text-tertiary hover:text-wit-text hover:bg-wit-surface-alt
              transition-colors flex-shrink-0
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Category + POS */}
        <div className="flex items-center gap-2 mb-3">
          {term.category && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-red-soft text-wit-red">
              {term.category}
            </span>
          )}
          {sourcePos && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-surface-alt text-wit-text-secondary">
              {sourcePos}
            </span>
          )}
        </div>

        {/* Source definition */}
        {sourceDef && (
          <p className="text-sm text-wit-text mb-3 leading-relaxed">
            {sourceDef}
          </p>
        )}

        {/* Divider + Translation — always shown, with a fallback when missing */}
        <div className="border-t border-wit-line my-3" />
        <div>
          <p className="text-xs text-wit-text-tertiary mb-1 uppercase tracking-wider">
            {targetLang === 'vi' ? 'Tiếng Việt' : targetLang === 'en' ? 'English' : '日本語'}
          </p>
          {hasTranslation ? (
            <>
              {targetTerm && (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-wit-text">{targetTerm}</p>
                  <button
                    onClick={() => speakText(targetTerm, targetLang)}
                    className="text-wit-text-tertiary hover:text-wit-red transition-colors"
                    title="Phát âm"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {(targetIpa || targetKana || targetPos) && (
                <p className="text-xs text-wit-text-tertiary mt-0.5">
                  {targetIpa && `/${targetIpa}/`}
                  {targetIpa && (targetKana || targetPos) && ' · '}
                  {targetKana}
                  {targetKana && targetPos && ' · '}
                  {targetPos}
                </p>
              )}
              {targetDef && (
                <p className="text-sm text-wit-text-secondary mt-1 leading-relaxed">
                  {targetDef}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-wit-text-tertiary italic">
              Chưa có dữ liệu dịch cho thuật ngữ này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
