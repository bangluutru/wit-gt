import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useDictionary } from '../hooks/useDictionary';
import { useSettings } from '../contexts/SettingsContext';
import type { DictionaryViewMode } from '../lib/types';
import { LoadingState, EmptyState } from '../components/ui';
import ViewModeTabs from '../components/dictionary/ViewModeTabs';
import DictionaryCard from '../components/dictionary/DictionaryCard';
import LanguageSwitcher from '../components/dictionary/LanguageSwitcher';
import FlashcardSession from '../components/dictionary/FlashcardSession';

export default function Dictionary() {
  const { terms, categories, loading, searchTerms } = useDictionary();
  const { preferredSourceLang, preferredTargetLang, setSourceLang, setTargetLang } = useSettings();

  const [viewMode, setViewMode] = useState<DictionaryViewMode>('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTerms = useMemo(
    () => searchTerms(searchQuery, preferredSourceLang, selectedCategory || undefined),
    [searchTerms, searchQuery, preferredSourceLang, selectedCategory]
  );

  if (loading) {
    return <LoadingState message="Đang tải từ điển..." />;
  }

  // Flashcard mode → render full session
  if (viewMode === 'flashcard') {
    return (
      <div className="page-enter p-4 sm:p-6">
        <FlashcardSession
          terms={filteredTerms.length > 0 ? filteredTerms : terms}
          onExit={() => setViewMode('dictionary')}
        />
      </div>
    );
  }

  return (
    <div className="page-enter p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-wit-text font-serif">Từ điển WiT</h1>
        <p className="text-sm text-wit-text-secondary mt-1">
          {terms.length} thuật ngữ đa ngôn ngữ
        </p>
      </div>

      {/* View mode tabs */}
      <ViewModeTabs value={viewMode} onChange={setViewMode} />

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wit-text-tertiary" />
          <input
            type="text"
            placeholder="Tìm thuật ngữ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-wit-line bg-wit-surface text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/30 focus:border-wit-red transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-wit-text-tertiary hover:text-wit-text cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer
            ${
              showFilters || selectedCategory
                ? 'border-wit-red bg-wit-red-soft text-wit-red'
                : 'border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-alt'
            }
          `}
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          {selectedCategory && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded bg-wit-red text-white">1</span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-5 animate-scale-in space-y-4">
          {/* Language selectors */}
          <div className="flex flex-wrap gap-6">
            <LanguageSwitcher
              value={preferredSourceLang}
              onChange={setSourceLang}
              label="Ngôn ngữ gốc"
            />
            <LanguageSwitcher
              value={preferredTargetLang}
              onChange={setTargetLang}
              label="Ngôn ngữ đích"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-wit-text-secondary mb-2">
              Danh mục
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  !selectedCategory
                    ? 'bg-wit-red text-white'
                    : 'bg-wit-surface-alt text-wit-text-secondary hover:bg-wit-line'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-wit-red text-white'
                      : 'bg-wit-surface-alt text-wit-text-secondary hover:bg-wit-line'
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
      <p className="text-xs text-wit-text-tertiary">
        {filteredTerms.length} kết quả
        {searchQuery && ` cho "${searchQuery}"`}
        {selectedCategory && ` trong "${selectedCategory}"`}
      </p>

      {/* Term grid */}
      {filteredTerms.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Không tìm thấy"
          description="Thử thay đổi từ khóa hoặc bộ lọc."
        />
      ) : (
        <div
          className={
            viewMode === 'visual'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
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
    </div>
  );
}
