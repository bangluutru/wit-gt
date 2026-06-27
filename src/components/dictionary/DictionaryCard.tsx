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
  const targetTerm = getTermField(term, targetLang);
  const targetDef = getDefField(term, targetLang);
  const imgUrl = getImgField(term, sourceLang);

  if (viewMode === 'visual') {
    return (
      <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 overflow-hidden hover:shadow-card-hover transition-shadow duration-200">
        {imgUrl ? (
          <div className="aspect-square bg-wit-surface-alt flex items-center justify-center overflow-hidden">
            <img src={imgUrl} alt={sourceTerm} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-square bg-wit-surface-alt flex items-center justify-center">
            <span className="text-3xl font-serif text-wit-text-tertiary">
              {sourceTerm?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="p-3">
          <p className={`font-semibold text-wit-text ${sourceLang === 'jp' ? 'font-jp' : ''}`}>
            {sourceTerm}
          </p>
          <p className={`text-xs text-wit-text-secondary mt-0.5 ${targetLang === 'jp' ? 'font-jp' : ''}`}>
            {targetTerm}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-5 hover:shadow-card-hover transition-shadow duration-200">
      {/* Header: term + speak button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className={`text-lg font-semibold text-wit-text ${sourceLang === 'jp' ? 'font-jp' : ''}`}>
            {sourceTerm}
          </h3>
          {sourcePhonetic && (
            <p className="text-xs text-wit-text-tertiary mt-0.5 font-mono">
              {sourceLang === 'jp' ? sourcePhonetic : `/${sourcePhonetic}/`}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => speakText(sourceTerm, sourceLang)}
          className="shrink-0 p-2 rounded-lg hover:bg-wit-surface-alt transition-colors text-wit-text-secondary hover:text-wit-red cursor-pointer"
          aria-label="Phát âm"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      {/* POS + Category badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {sourcePos && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-wit-info-soft text-wit-text-secondary">
            {sourcePos}
          </span>
        )}
        {term.category && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-wit-gold-soft text-wit-gold">
            {term.category}
          </span>
        )}
      </div>

      {/* Definition */}
      {viewMode !== 'dictionary' && sourceDef && (
        <p className={`text-sm text-wit-text mb-3 leading-relaxed ${sourceLang === 'jp' ? 'font-jp' : ''}`}>
          {sourceDef}
        </p>
      )}

      {/* Translation */}
      <div className="pt-3 border-t border-wit-line/50">
        <p className={`text-sm font-medium text-wit-text ${targetLang === 'jp' ? 'font-jp' : ''}`}>
          {targetTerm}
        </p>
        {viewMode === 'definition' && targetDef && (
          <p className={`text-xs text-wit-text-secondary mt-1 ${targetLang === 'jp' ? 'font-jp' : ''}`}>
            {targetDef}
          </p>
        )}
      </div>
    </div>
  );
}
