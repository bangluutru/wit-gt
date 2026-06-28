import type { DictionaryTerm, Language } from '../../lib/types';

interface TermTooltipProps {
  term: DictionaryTerm;
  /** Language to show the meaning in (e.g. English for a Vietnamese lesson). */
  targetLang: Language;
  /** Viewport-relative anchor of the hovered word. */
  position: { top: number; bottom: number; left: number };
}

function getField(term: DictionaryTerm, field: string, lang: Language): string {
  const suffix = lang === 'vi' ? 'vi' : lang === 'en' ? 'en' : 'jp';
  const key = `${suffix}${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof DictionaryTerm;
  return (term[key] as string) || '';
}

const LANG_LABEL: Record<Language, string> = { vi: 'Tiếng Việt', en: 'English', jp: '日本語' };

/**
 * Lightweight hover tooltip showing the meaning of a term in the target
 * language. Non-interactive (pointer-events: none) so it never steals the
 * hover; click still opens the full popover.
 */
export function TermTooltip({ term, targetLang, position }: TermTooltipProps) {
  const word = getField(term, 'term', targetLang);
  const ipa = getField(term, 'ipa', targetLang);
  const kana = targetLang === 'jp' ? getField(term, 'kana', targetLang) : '';
  const def = getField(term, 'def', targetLang);
  const hasData = Boolean(word || def);

  const width = 280;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1024;
  let left = position.left - width / 2;
  if (left < 12) left = 12;
  if (left + width > viewportW - 12) left = viewportW - width - 12;

  // Prefer above the word; flip below if too close to the top.
  const showBelow = position.top < 140;
  const style = showBelow
    ? { top: position.bottom + 8, left }
    : { top: position.top - 8, left, transform: 'translateY(-100%)' };

  return (
    <div
      className="fixed z-[60] pointer-events-none animate-scale-in"
      style={{ ...style, width }}
    >
      <div className="rounded-xl px-3.5 py-3 shadow-popover border border-[rgba(216,176,98,0.25)] bg-[#2A211D] text-[#F0E9DF]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#D8B062]">
          {LANG_LABEL[targetLang]}
        </div>
        {hasData ? (
          <>
            {word && <div className="text-sm font-bold mt-0.5">{word}</div>}
            {(ipa || kana) && (
              <div className="text-[11px] text-[#B6AB9C] mt-0.5">
                {ipa && `/${ipa}/`}
                {ipa && kana && ' · '}
                {kana}
              </div>
            )}
            {def && <div className="text-[12.5px] leading-relaxed text-[#E8E0D5] mt-1.5">{def}</div>}
          </>
        ) : (
          <div className="text-[12.5px] italic text-[#B6AB9C] mt-1">
            Chưa có dữ liệu dịch cho thuật ngữ này.
          </div>
        )}
        <div className="text-[10px] text-[#8A7F70] mt-2">Nhấn để xem chi tiết</div>
      </div>
    </div>
  );
}
