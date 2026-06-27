// ============================================================
// WiT Platform - DictionaryCard Component
// ============================================================

import { Volume2 } from 'lucide-react';
import type { DictionaryTerm, Language, DictionaryViewMode } from '../../lib/types';
import { speakText } from '../../lib/utils';

interface DictionaryCardProps {
  term: DictionaryTerm;
  sourceLang: Language;
  targetLang: Language;
  viewMode: DictionaryViewMode;
}

function getTermField(term: DictionaryTerm, lang: Language): string {
  return lang === 'vi' ? term.viTerm : lang === 'en' ? term.enTerm : term.jpTerm;
}

function getDefField(term: DictionaryTerm, lang: Language): string {
  return lang === 'vi' ? term.viDef : lang === 'en' ? term.enDef : term.jpDef;
}

function getPosField(term: DictionaryTerm, lang: Language): string {
  return lang === 'vi' ? term.viPos : lang === 'en' ? term.enPos : term.jpPos;
}

function getPhoneticField(term: DictionaryTerm, lang: Language): string {
  return lang === 'jp' ? term.jpKana : lang === 'vi' ? term.viIpa : term.enIpa;
}

function getImgField(term: DictionaryTerm, lang: Language): string {
  return lang === 'vi' ? term.viImg : lang === 'en' ? term.enImg : term.jpImg;
}

const LANG_CODE_MAP = {
  vi: 'VI',
  en: 'EN',
  jp: 'JA',
};

export default function DictionaryCard({
  term,
  sourceLang,
  targetLang,
  viewMode,
}: DictionaryCardProps) {
  const sourceTerm = getTermField(term, sourceLang);
  const sourcePhonetic = getPhoneticField(term, sourceLang);
  const sourcePos = getPosField(term, sourceLang);
  const sourceDef = getDefField(term, sourceLang);
  const imgUrl = getImgField(term, sourceLang);

  // Translate to all other languages for cross-reference
  const otherLanguages: ('vi' | 'en' | 'jp')[] = ['vi', 'en', 'jp'];
  const others = otherLanguages
    .filter((l) => l !== sourceLang)
    .map((l) => ({
      code: LANG_CODE_MAP[l],
      term: getTermField(term, l),
      phonetic: getPhoneticField(term, l),
      lang: l,
    }));

  return (
    <div className="wit-card overflow-hidden bg-wit-surface-2 border border-dashed border-[#BFAF9D] rounded-[20px] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover flex flex-col h-full">
      {/* Illustration Area */}
      <div className="relative aspect-[16/10] bg-wit-line/40 border-b border-wit-line flex items-center justify-center overflow-hidden shrink-0">
        {imgUrl ? (
          <img src={imgUrl} alt={sourceTerm} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-wit-text-tertiary">
            <span className="text-4xl font-serif font-bold text-wit-text-tertiary opacity-30">
              {sourceTerm?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
        {/* Category tag absolute on top left */}
        {term.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2B2622]/70 text-white font-semibold text-[11px] backdrop-blur-sm">
            {term.category}
          </span>
        )}
      </div>

      {/* Body Area */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Header: term + IPA + POS + Speak button */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={`font-serif text-[22px] font-bold text-wit-text leading-snug ${sourceLang === 'jp' ? 'font-jp' : ''}`}>
              {sourceTerm}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {sourcePhonetic && (
                <span className="font-mono text-xs text-wit-red font-semibold">
                  {sourceLang === 'jp' ? sourcePhonetic : `/${sourcePhonetic}/`}
                </span>
              )}
              {sourcePos && (
                <span className="px-2 py-0.5 rounded bg-wit-surface border border-wit-line text-[10px] font-semibold text-wit-text-secondary">
                  {sourcePos}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => speakText(sourceTerm, sourceLang)}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-wit-red to-[#8E1B1B] text-white hover:opacity-90 transition-opacity cursor-pointer shadow-[0_4px_12px_rgba(198,33,40,0.25)]"
            aria-label="Phát âm"
          >
            <Volume2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Definition (Only shown if not visual mode) */}
        {viewMode !== 'visual' && sourceDef && (
          <div className="mt-4 pt-4 border-t border-wit-line">
            <div className="text-[10px] font-bold tracking-wider uppercase text-wit-text-tertiary mb-1">
              Giải nghĩa · {sourceLang === 'vi' ? 'Tiếng Việt' : sourceLang === 'en' ? 'English' : '日本語'}
            </div>
            <p className={`text-[13.5px] text-wit-text-secondary leading-relaxed ${sourceLang === 'jp' ? 'font-jp' : ''}`}>
              {sourceDef}
            </p>
          </div>
        )}

        {/* Translation details */}
        <div className="mt-auto pt-4 border-t border-wit-line space-y-2">
          {others.map((oth) => (
            <div key={oth.code} className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-[10px] text-wit-text-tertiary w-6 shrink-0 tracking-wider">
                {oth.code}
              </span>
              <span className={`flex-1 font-semibold text-wit-text truncate ${oth.lang === 'jp' ? 'font-jp' : ''}`}>
                {oth.term}
              </span>
              {oth.phonetic && (
                <span className="font-mono text-[11px] text-wit-text-tertiary shrink-0">
                  {oth.lang === 'jp' ? oth.phonetic : `/${oth.phonetic}/`}
                </span>
              )}
              <button
                type="button"
                onClick={() => speakText(oth.term, oth.lang)}
                className="w-7 h-7 rounded-lg border border-wit-line bg-wit-surface flex items-center justify-center text-wit-red hover:bg-wit-red-soft transition-colors cursor-pointer"
                title="Speak translation"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
