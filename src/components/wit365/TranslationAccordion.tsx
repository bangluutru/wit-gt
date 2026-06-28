import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Language } from '../../lib/types';

interface Props {
  lang: Language;
  viText: string;
  enLiteral: string;
  enNatural: string;
}

export function TranslationAccordion({ lang, viText, enLiteral, enNatural }: Props) {
  const [open, setOpen] = useState(false);
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  const isViUI = lang === 'vi' || lang === 'jp';

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-wit-red hover:text-wit-red-dark transition-colors cursor-pointer group"
      >
        {open ? (
          <ChevronUp className="h-4 w-4 transition-transform" />
        ) : (
          <ChevronDown className="h-4 w-4 transition-transform" />
        )}
        {isViUI
          ? L('Hiện bản dịch tiếng Anh', 'Show English translation', '英語訳を表示')
          : 'View original Vietnamese'}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-4 pl-1 border-l-2 border-wit-gold/30 ml-1">
          {isViUI ? (
            /* ── Vietnamese UI: show English translations ── */
            <>
              <div className="pl-4">
                <div className="text-[10px] font-bold uppercase tracking-[1.6px] text-wit-gold mb-1.5">
                  Literal Translation
                </div>
                <p className="text-[15px] text-wit-text leading-relaxed italic">
                  {enLiteral}
                </p>
              </div>
              <div className="mx-4 border-t border-wit-line/60" />
              <div className="pl-4">
                <div className="text-[10px] font-bold uppercase tracking-[1.6px] text-wit-gold mb-1.5">
                  Natural Translation
                </div>
                <p className="text-[15px] text-wit-text-secondary leading-relaxed">
                  {enNatural}
                </p>
              </div>
            </>
          ) : (
            /* ── English UI: show Vietnamese original + natural ── */
            <>
              <div className="pl-4">
                <div className="text-[10px] font-bold uppercase tracking-[1.6px] text-wit-gold mb-1.5">
                  {L('Câu gốc tiếng Việt', 'Original Vietnamese', 'ベトナム語原文')}
                </div>
                <p className="text-[15px] text-wit-text leading-relaxed font-serif">
                  {viText}
                </p>
              </div>
              <div className="mx-4 border-t border-wit-line/60" />
              <div className="pl-4">
                <div className="text-[10px] font-bold uppercase tracking-[1.6px] text-wit-gold mb-1.5">
                  Natural expression
                </div>
                <p className="text-[15px] text-wit-text-secondary leading-relaxed">
                  {enNatural}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
