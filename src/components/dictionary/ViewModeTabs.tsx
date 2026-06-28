import { Book, FileText, Image, Layers, Globe } from 'lucide-react';
import type { DictionaryViewMode } from '../../lib/types';

interface ViewModeTabsProps {
  value: DictionaryViewMode;
  onChange: (mode: DictionaryViewMode) => void;
}

const TABS: { mode: DictionaryViewMode; icon: typeof Book; label: string }[] = [
  { mode: 'dictionary', icon: Book, label: 'Từ điển' },
  { mode: 'definition', icon: FileText, label: 'Định nghĩa' },
  { mode: 'visual', icon: Image, label: 'Đồ hình' },
  { mode: 'flashcard', icon: Layers, label: 'Flashcard' },
  { mode: 'multilingual', icon: Globe, label: 'Đa ngôn ngữ' },
];

export default function ViewModeTabs({ value, onChange }: ViewModeTabsProps) {
  return (
    <div className="flex border-b border-wit-line">
      {TABS.map(({ mode, icon: Icon, label }) => {
        const isActive = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium
              transition-all duration-200 cursor-pointer select-none
              border-b-2 -mb-px
              ${
                isActive
                  ? 'border-wit-red text-wit-red'
                  : 'border-transparent text-wit-text-secondary hover:text-wit-text hover:border-wit-line'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
