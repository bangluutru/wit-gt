import { Search } from 'lucide-react';
import type { Chapter } from '../../lib/types';

interface FilterBarProps {
  chapters: Chapter[];
  selectedChapter: string;
  selectedStatus: string;
  searchQuery: string;
  onChapterChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'completed', label: 'Đã học' },
  { value: 'accessible', label: 'Đang mở' },
  { value: 'locked', label: 'Chưa mở' },
];

export function FilterBar({
  chapters,
  selectedChapter,
  selectedStatus,
  searchQuery,
  onChapterChange,
  onStatusChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Chapter select */}
      <select
        value={selectedChapter}
        onChange={(e) => onChapterChange(e.target.value)}
        className="
          h-10 px-3 rounded-button border border-wit-line bg-wit-surface
          text-sm text-wit-text focus:outline-none focus:ring-2
          focus:ring-wit-red/20 focus:border-wit-red
          transition-colors duration-200
        "
      >
        <option value="all">Tất cả học phần</option>
        {chapters.map((ch) => (
          <option key={ch.id} value={ch.id}>
            {ch.titleVi}
          </option>
        ))}
      </select>

      {/* Status pills */}
      <div className="flex items-center gap-1 bg-wit-surface-2 rounded-full p-1">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200
              ${
                selectedStatus === opt.value
                  ? 'bg-wit-red text-white shadow-card'
                  : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wit-text-tertiary" />
        <input
          type="text"
          placeholder="Tìm bài học..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full h-10 pl-9 pr-4 rounded-button border border-wit-line
            bg-wit-surface text-sm text-wit-text placeholder:text-wit-text-tertiary
            focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red
            transition-colors duration-200
          "
        />
      </div>
    </div>
  );
}
