import { Book, FileText, Image, Layers, Globe } from 'lucide-react';
import type { DictionaryViewMode, Language } from '../../lib/types';

interface ViewModeTabsProps {
  value: DictionaryViewMode;
  onChange: (mode: DictionaryViewMode) => void;
  interfaceLang: Language;
}

const TABS: { mode: DictionaryViewMode; icon: typeof Book; vi: string; en: string; jp: string }[] = [
  { mode: 'dictionary', icon: Book, vi: 'Từ điển', en: 'Dictionary', jp: '辞書' },
  { mode: 'definition', icon: FileText, vi: 'Định nghĩa', en: 'Definitions', jp: '定義' },
  { mode: 'visual', icon: Image, vi: 'Đồ hình', en: 'Diagrams', jp: '図表' },
  { mode: 'flashcard', icon: Layers, vi: 'Flashcard', en: 'Flashcard', jp: 'Flashcard' },
  { mode: 'multilingual', icon: Globe, vi: 'Đa ngôn ngữ', en: 'Multilingual', jp: '多言語' },
];

export default function ViewModeTabs({ value, onChange, interfaceLang }: ViewModeTabsProps) {
  const getLabel = (tab: typeof TABS[number]) => {
    if (interfaceLang === 'en') return tab.en;
    if (interfaceLang === 'jp') return tab.jp;
    return tab.vi;
  };

  return (
    <div className="flex border-b border-wit-line">
      {TABS.map((tab) => {
        const { mode, icon: Icon } = tab;
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
            <span className="hidden sm:inline">{getLabel(tab)}</span>
          </button>
        );
      })}
    </div>
  );
}
