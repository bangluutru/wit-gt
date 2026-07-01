// ============================================================
// WiT Platform - Dictionary Page
// ============================================================

import { useState, useMemo } from 'react';
import { Search, Filter, X, ExternalLink } from 'lucide-react';
import { useDictionary } from '../hooks/useDictionary';
import { useSettings } from '../contexts/SettingsContext';
import type { DictionaryViewMode } from '../lib/types';
import { LoadingState, EmptyState } from '../components/ui';
import ViewModeTabs from '../components/dictionary/ViewModeTabs';
import DictionaryCard from '../components/dictionary/DictionaryCard';
import MultilingualLookup from '../components/dictionary/MultilingualLookup';
import type { DefLang } from '../lib/multiDict';
import LanguageSwitcher from '../components/dictionary/LanguageSwitcher';
import FlashcardSession from '../components/dictionary/FlashcardSession';
import DiagramGallery from '../components/dictionary/DiagramGallery';

export default function Dictionary() {
  const { terms, categories, loading, searchTerms } = useDictionary();
  const { preferredSourceLang, preferredTargetLang, setSourceLang, setTargetLang, interfaceLang } = useSettings();

  const [viewMode, setViewMode] = useState<DictionaryViewMode>('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  // Default definition language for the multilingual tab follows the UI language.
  const defaultDefLang: DefLang = interfaceLang === 'en' ? 'en' : interfaceLang === 'jp' ? '' : 'vi';

  const filteredTerms = useMemo(
    () => searchTerms(searchQuery, preferredSourceLang, selectedCategory || undefined),
    [searchTerms, searchQuery, preferredSourceLang, selectedCategory]
  );

  if (loading) {
    return <LoadingState message={getLocalizedText('Đang tải từ điển...', 'Loading dictionary...', '辞書を読み込んでいます...')} />;
  }

  // Flashcard mode → render full session
  if (viewMode === 'flashcard') {
    return (
      <div className="page-enter">
        <FlashcardSession
          terms={filteredTerms.length > 0 ? filteredTerms : terms}
          onExit={() => setViewMode('dictionary')}
        />
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
          {getLocalizedText('Từ điển Nhân Sinh · witdict', 'Life Dictionary · witdict', '人生辞書 · witdict')}
        </span>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">
          {getLocalizedText('Tra cứu thuật ngữ', 'Search Terminology', '用語検索')}
        </h1>
        <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
          {getLocalizedText(
            'Tra nghĩa Việt · Anh · Nhật cho các thuật ngữ nhân sinh. Cần tra cứu chuyên sâu hơn? Mở bộ từ điển đầy đủ WiT.',
            'Look up Vietnamese · English · Japanese definitions for life terms. Need deeper search? Open the complete WiT dictionary.',
            '人生用語のベトナム語 · 英語 · 日本語の定義を検索します。より深い検索が必要ですか？完全なWiT辞書を開いてください。'
          )}
        </p>
      </div>

      {/* External full dictionary button */}
      <div>
        <a
          href="https://witdictmulti.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-wit-red text-white text-sm font-semibold hover:bg-wit-red-dark transition-colors shadow-card"
        >
          <ExternalLink className="h-4 w-4" />
          <span>{getLocalizedText('Mở từ điển đầy đủ WiT', 'Open full WiT Dictionary', '完全なWiT辞書を開く')}</span>
        </a>
      </div>

      {/* View mode tabs */}
      <ViewModeTabs value={viewMode} onChange={setViewMode} />

      {viewMode === 'multilingual' ? (
        <MultilingualLookup interfaceLang={interfaceLang} defaultDefLang={defaultDefLang} />
      ) : (
      <>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-wit-text-tertiary" />
          <input
            type="text"
            placeholder={getLocalizedText('Nhập thuật ngữ cần tra…', 'Enter term to look up...', '検索する用語を入力してください...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-10 rounded-button border border-wit-line bg-wit-surface text-base text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-wit-text-tertiary hover:text-wit-text cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center justify-center gap-2 h-14 px-5 rounded-button border text-sm font-semibold transition-all cursor-pointer shrink-0
            ${
              showFilters || selectedCategory
                ? 'border-wit-red bg-wit-red-soft text-wit-red'
                : 'border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2'
            }
          `}
        >
          <Filter className="h-[18px] w-[18px]" />
          <span>{getLocalizedText('Bộ lọc', 'Filters', 'フィルター')}</span>
          {selectedCategory && (
            <span className="ml-1 w-5 h-5 flex items-center justify-center text-xs rounded-full bg-wit-red text-white">1</span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-wit-surface rounded-card border border-wit-line p-5 animate-scale-in space-y-4 shadow-card">
          {/* Language selectors */}
          <div className="flex flex-wrap gap-6">
            <LanguageSwitcher
              value={preferredSourceLang}
              onChange={setSourceLang}
              label={getLocalizedText('Ngôn ngữ gốc', 'Source Language', '元の言語')}
            />
            <LanguageSwitcher
              value={preferredTargetLang}
              onChange={setTargetLang}
              label={getLocalizedText('Ngôn ngữ đích', 'Target Language', '対象言語')}
            />
          </div>

          {/* Category */}
          <div className="border-t border-wit-line pt-3">
            <label className="block text-sm font-semibold text-wit-text-secondary mb-2">
              {getLocalizedText('Danh mục', 'Category', 'カテゴリー')}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors cursor-pointer ${
                  !selectedCategory
                    ? 'bg-wit-red text-white'
                    : 'bg-wit-surface-2 text-wit-text-secondary hover:bg-wit-line'
                }`}
              >
                {getLocalizedText('Tất cả', 'All', 'すべて')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                  className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-wit-red text-white'
                      : 'bg-wit-surface-2 text-wit-text-secondary hover:bg-wit-line'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-[12px] text-wit-text-tertiary">
        {filteredTerms.length} {getLocalizedText('kết quả', 'results', '件の結果')}
        {searchQuery && ` ${getLocalizedText('cho', 'for', '（検索キーワード：')} "${searchQuery}"${getLocalizedText('', '', '）')}`}
        {selectedCategory && ` ${getLocalizedText('trong', 'in', '（カテゴリー：')} "${selectedCategory}"${getLocalizedText('', '', '）')}`}
      </p>

      {/* Visual tab → diagram gallery; other tabs → term grid */}
      {viewMode === 'visual' ? (
        <DiagramGallery
          terms={terms}
          sourceLang={interfaceLang}
          searchQuery={searchQuery}
          emptyLabel={getLocalizedText(
            'Không tìm thấy đồ hình phù hợp.',
            'No matching diagrams found.',
            '一致する図が見つかりません。'
          )}
        />
      ) : filteredTerms.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12 text-wit-text-tertiary" />}
          title={getLocalizedText('Không tìm thấy thuật ngữ', 'No terms found', '用語が見つかりません')}
          description={getLocalizedText('Thử đổi từ khoá hoặc mở bộ từ điển đầy đủ WiT ở trên.', 'Try changing keywords or open the full WiT Dictionary above.', 'キーワードを変更するか、上記の完全なWiT辞書を開いてください。')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredTerms.map((term) => (
            <DictionaryCard
              key={term.id}
              term={term}
              sourceLang={preferredSourceLang}
              targetLang={preferredTargetLang}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
