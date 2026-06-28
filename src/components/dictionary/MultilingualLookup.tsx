// ============================================================
// WiT Platform - Multilingual lookup (powered by dict.minhqnd.com)
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Volume2, ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import type { Language } from '../../lib/types';
import {
  lookupWord,
  suggestWords,
  multiDictUrl,
  ttsUrl,
  MULTIDICT_ATTRIBUTION_URL,
  type LookupResponse,
  type DefLang,
} from '../../lib/multiDict';

interface Props {
  interfaceLang: Language;
  defaultDefLang: DefLang;
}

export default function MultilingualLookup({ interfaceLang, defaultDefLang }: Props) {
  const t = (vi: string, en: string, jp: string) =>
    interfaceLang === 'en' ? en : interfaceLang === 'jp' ? jp : vi;

  const [query, setQuery] = useState('');
  const [defLang, setDefLang] = useState<DefLang>(defaultDefLang);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState('');

  const boxRef = useRef<HTMLDivElement>(null);
  const lookupAbort = useRef<AbortController | null>(null);
  const suggestAbort = useRef<AbortController | null>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setShowSuggest(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Debounced suggestions
  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(async () => {
      suggestAbort.current?.abort();
      const ac = new AbortController();
      suggestAbort.current = ac;
      try {
        setSuggestions(await suggestWords(q, 6, ac.signal));
      } catch {
        /* ignore */
      }
    }, 220);
    return () => clearTimeout(id);
  }, [query]);

  const runLookup = useCallback(
    async (word: string, dl: DefLang) => {
      const q = word.trim();
      if (!q) return;
      setShowSuggest(false);
      setLoading(true);
      setError(false);
      setSearched(q);
      lookupAbort.current?.abort();
      const ac = new AbortController();
      lookupAbort.current = ac;
      try {
        setResult(await lookupWord(q, dl, ac.signal));
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError(true);
          setResult(null);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const play = (word: string, lang: string) => {
    try {
      new Audio(ttsUrl(word, lang)).play().catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const defLangOptions: { value: DefLang; label: string }[] = [
    { value: 'vi', label: t('Tiếng Việt', 'Vietnamese', 'ベトナム語') },
    { value: 'en', label: t('Tiếng Anh', 'English', '英語') },
    { value: '', label: t('Tất cả', 'All', 'すべて') },
  ];

  return (
    <div className="space-y-5">
      {/* Search */}
      <div ref={boxRef} className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runLookup(query, defLang);
          }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-wit-text-tertiary" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              placeholder={t('Tra từ bất kỳ (Việt, Anh, Trung, Nhật…)', 'Look up any word (VI, EN, ZH, JA…)', '任意の単語を検索（越・英・中・日…）')}
              className="w-full h-14 pl-12 pr-10 rounded-2xl border border-wit-line bg-wit-surface text-base text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-wit-text-tertiary hover:text-wit-text cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        {/* Suggestions dropdown */}
        {showSuggest && suggestions.length > 0 && (
          <div className="absolute z-30 top-[60px] left-0 right-0 bg-wit-surface border border-wit-line rounded-2xl shadow-popover p-1.5 animate-scale-in">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s);
                  runLookup(s, defLang);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm text-wit-text hover:bg-wit-surface-2 cursor-pointer flex items-center gap-2.5"
              >
                <Search className="h-3.5 w-3.5 text-wit-text-tertiary shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Definition-language filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-wit-text-tertiary">
          {t('Ngôn ngữ nghĩa:', 'Definition language:', '定義言語:')}
        </span>
        {defLangOptions.map((o) => (
          <button
            key={o.value || 'all'}
            type="button"
            onClick={() => {
              setDefLang(o.value);
              if (searched) runLookup(searched, o.value);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              defLang === o.value
                ? 'bg-wit-red text-white'
                : 'bg-wit-surface-2 text-wit-text-secondary hover:bg-wit-line'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-wit-text-secondary">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          {t('Đang tra cứu...', 'Looking up...', '検索中...')}
        </div>
      )}

      {!loading && error && (
        <div className="bg-wit-red-soft border border-wit-red/30 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-wit-red shrink-0 mt-0.5" />
          <div className="text-sm text-wit-text">
            {t(
              'Không kết nối được tới từ điển đa ngôn ngữ. Vui lòng thử lại sau.',
              'Could not reach the multilingual dictionary. Please try again later.',
              '多言語辞書に接続できませんでした。後でもう一度お試しください。'
            )}
          </div>
        </div>
      )}

      {!loading && !error && result && !result.exists && (
        <div className="text-center py-14 text-wit-text-secondary">
          {t('Không tìm thấy', 'No results for', '結果なし')} “{searched}”.
        </div>
      )}

      {/* Results */}
      {!loading && !error && result?.exists && result.results && (
        <div className="space-y-5">
          {result.results.map((r, ri) => (
            <div key={ri} className="bg-wit-surface rounded-2xl border border-wit-line shadow-sm p-5 space-y-4">
              {/* Headword */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-serif text-2xl font-bold text-wit-text">{result.word}</h3>
                <button
                  type="button"
                  onClick={() => play(result.word, r.lang_code)}
                  className="text-wit-text-tertiary hover:text-wit-red transition-colors cursor-pointer"
                  title={t('Phát âm', 'Pronounce', '発音')}
                >
                  <Volume2 className="h-4.5 w-4.5" />
                </button>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-wit-gold-soft text-wit-gold">
                  {r.lang_name}
                </span>
              </div>

              {/* Pronunciations */}
              {r.pronunciations?.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-wit-text-tertiary">
                  {r.pronunciations.map((p, i) => (
                    <span key={i}>
                      {p.ipa}
                      {p.region ? ` · ${p.region}` : ''}
                    </span>
                  ))}
                </div>
              )}

              {/* Meanings */}
              <ol className="space-y-3">
                {r.meanings.map((m, mi) => (
                  <li key={mi} className="border-l-2 border-wit-line pl-3.5">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      {m.pos && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-wit-surface-2 text-wit-text-secondary">
                          {m.pos}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-wide text-wit-text-tertiary">
                        {m.definition_lang}
                      </span>
                    </div>
                    <p className="text-sm text-wit-text leading-relaxed">{m.definition}</p>
                    {m.example && (
                      <p className="text-[13px] text-wit-text-secondary italic mt-1">“{m.example}”</p>
                    )}
                    {m.source && (
                      <p className="text-[10.5px] text-wit-text-tertiary mt-1">
                        {t('Nguồn', 'Source', '出典')}: {m.source}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              {/* Translations */}
              {r.translations?.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-wit-text-tertiary mb-1.5">
                    {t('Bản dịch', 'Translations', '翻訳')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.translations.map((tr, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-wit-surface-2 text-xs text-wit-text"
                        title={tr.lang_name}
                      >
                        <span className="text-wit-text-tertiary uppercase mr-1">{tr.lang_code}</span>
                        {tr.translation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relations */}
              {r.relations?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {r.relations.map((rel, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setQuery(rel.related_word);
                        runLookup(rel.related_word, defLang);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-wit-line text-xs text-wit-text-secondary hover:border-wit-red/40 hover:text-wit-red transition-colors cursor-pointer"
                      title={rel.relation_type}
                    >
                      {rel.related_word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Idle hint */}
      {!loading && !error && !result && (
        <div className="text-center py-14 text-sm text-wit-text-tertiary">
          {t(
            'Nhập một từ bất kỳ để tra cứu nghĩa, phát âm và bản dịch đa ngôn ngữ.',
            'Enter any word to look up meaning, pronunciation and multilingual translations.',
            '任意の単語を入力して、意味・発音・多言語翻訳を検索してください。'
          )}
        </div>
      )}

      {/* Attribution (required by CC BY-SA 4.0) */}
      <div className="pt-2 border-t border-wit-line/60 text-[11px] text-wit-text-tertiary flex items-center gap-1.5">
        {t('Dữ liệu từ điển tổng hợp bởi', 'Dictionary data by', '辞書データ提供:')}
        <a
          href={MULTIDICT_ATTRIBUTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-wit-red hover:underline"
        >
          dict.minhqnd.com <ExternalLink className="h-3 w-3" />
        </a>
        <span>· CC BY-SA 4.0</span>
      </div>
    </div>
  );
}
