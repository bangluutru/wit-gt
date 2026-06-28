import type { Language } from '../../lib/types';

interface LanguageSwitcherProps {
  value: Language;
  onChange: (lang: Language) => void;
  label?: string;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
  { code: 'jp', label: 'JP' },
];

export default function LanguageSwitcher({ value, onChange, label }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-wit-text-secondary">{label}</span>
      )}
      <div className="inline-flex rounded-button bg-wit-surface-2 p-1 gap-0.5">
        {LANGUAGES.map(({ code, label: langLabel }) => (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={`
              px-3.5 py-1.5 text-sm font-semibold rounded-md
              transition-all duration-200 cursor-pointer select-none
              ${
                value === code
                  ? 'bg-wit-red text-white shadow-card'
                  : 'bg-transparent text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
              }
            `}
          >
            {langLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
