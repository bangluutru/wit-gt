// ============================================================
// WiT Platform - Header Component
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Globe, Moon, Sun, Sunset, Menu, BookOpen, Languages, Lock, Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useLessons } from '../../hooks/useLessons';
import { useDictionary } from '../../hooks/useDictionary';
import { useProgress } from '../../hooks/useProgress';
import { getLocalized, type Theme } from '../../lib/types';

const THEME_ORDER: Theme[] = ['light', 'warm', 'dark'];
const THEME_ICONS: Record<Theme, typeof Sun> = { light: Sun, warm: Sunset, dark: Moon };
const THEME_LABELS: Record<Theme, string> = { light: 'Sáng', warm: 'Ấm', dark: 'Tối' };
import { getLessonStatusForUser } from '../../lib/utils';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { interfaceLang, theme, setTheme, setInterfaceLang } = useSettings();
  
  const cycleTheme = () => {
    const i = THEME_ORDER.indexOf(theme);
    setTheme(THEME_ORDER[(i + 1) % THEME_ORDER.length]);
  };
  const ThemeIcon = THEME_ICONS[theme];
  const { lessons } = useLessons();
  const { terms } = useDictionary();
  const { completedLessons } = useProgress();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocus(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  const cycleLang = () => {
    const langs: ('vi' | 'en' | 'jp')[] = ['vi', 'en', 'jp'];
    const nextIdx = (langs.indexOf(interfaceLang) + 1) % langs.length;
    setInterfaceLang(langs[nextIdx]);
  };

  // Search logic
  const normalizedQuery = query.trim().toLowerCase();
  const matchedLessons = normalizedQuery
    ? lessons
        .filter((l) => {
          const title = getLocalized(l, 'title', interfaceLang) || '';
          return title.toLowerCase().includes(normalizedQuery);
        })
        .slice(0, 5)
    : [];

  const matchedTerms = normalizedQuery
    ? terms
        .filter((t) => {
          const term = t.viTerm.toLowerCase();
          const definition = t.viDef.toLowerCase();
          return term.includes(normalizedQuery) || definition.includes(normalizedQuery);
        })
        .slice(0, 4)
    : [];

  const hasResults = matchedLessons.length > 0 || matchedTerms.length > 0;
  const showDropdown = searchFocus && normalizedQuery.length > 0;

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-wit-surface/80 backdrop-blur-md border-b border-wit-line flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-button text-wit-text-secondary hover:bg-wit-surface-2 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="WiT" className="h-9 w-auto rounded-full" />
        </Link>
      </div>

      {/* Autocomplete Search Box */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-[480px] mx-4 lg:mx-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            placeholder={getLocalizedText(
              'Tìm học phần, thuật ngữ nhân sinh…',
              'Search lessons, terms...',
              'レッスン、用語を検索...'
            )}
            className="w-full pl-11 pr-4 py-2.5 rounded-button border border-wit-line bg-wit-surface-2 text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
          />
        </div>

        {/* Dropdown Results */}
        {showDropdown && (
          <div className="absolute top-[52px] left-0 right-0 bg-wit-surface border border-wit-line rounded-card shadow-popover p-2 max-h-[380px] overflow-y-auto animate-scale-in z-50">
            {matchedLessons.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] font-bold tracking-wider uppercase text-wit-text-tertiary px-3 py-1.5 border-b border-wit-line/50">
                  {getLocalizedText('Học phần', 'Lessons', 'レッスン')}
                </div>
                <div className="space-y-0.5 mt-1">
                  {matchedLessons.map((l) => {
                    const status = getLessonStatusForUser(l.lessonNo, completedLessons, isAdmin);
                    const accessible = status !== 'locked';

                    return (
                      <button
                        key={l.id}
                        onClick={() => {
                          if (accessible) {
                            navigate(`/lessons/${l.id}`);
                            setQuery('');
                            setSearchFocus(false);
                          }
                        }}
                        disabled={!accessible}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-button text-left text-sm transition-colors ${
                          accessible
                            ? 'hover:bg-wit-surface-2 cursor-pointer text-wit-text'
                            : 'opacity-50 cursor-not-allowed text-wit-text-tertiary'
                        }`}
                      >
                        <span className="font-serif font-bold text-wit-text-secondary w-6 text-center shrink-0">
                          {l.lessonNo}
                        </span>
                        <span className="flex-1 truncate">
                          {getLocalized(l, 'title', interfaceLang)}
                        </span>
                        {accessible ? (
                          <Play className="h-3 w-3 text-wit-red shrink-0" />
                        ) : (
                          <Lock className="h-3 w-3 text-wit-text-tertiary shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {matchedTerms.length > 0 && (
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-wit-text-tertiary px-3 py-1.5 border-b border-wit-line/50">
                  {getLocalizedText('Thuật ngữ', 'Terms', '用語')}
                </div>
                <div className="space-y-0.5 mt-1">
                  {matchedTerms.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigate('/dictionary');
                        // Prefill dictionary search via settings/state if possible
                        // For simplicity, just route to dictionary and let user search
                        setQuery('');
                        setSearchFocus(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-button text-left text-sm hover:bg-wit-surface-2 cursor-pointer text-wit-text"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-button bg-wit-red-soft text-wit-red font-serif font-bold text-xs shrink-0">
                        辞
                      </span>
                      <span className="flex-1 truncate font-medium">
                        {t.viTerm}
                      </span>
                      <span className="text-[11px] text-wit-text-tertiary">
                        {getLocalizedText('tra từ điển →', 'look up →', '辞書へ →')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <div className="py-6 text-center text-sm text-wit-text-tertiary">
                {getLocalizedText('Không tìm thấy kết quả', 'No results found', '結果が見つかりません')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Globe Language Picker */}
        <button
          onClick={cycleLang}
          className="flex items-center gap-1.5 px-3 py-2 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text hover:bg-wit-surface-2 transition-all cursor-pointer shadow-card"
        >
          <Globe className="h-4 w-4 text-wit-text-secondary" />
          <span>{interfaceLang.toUpperCase()}</span>
        </button>

        {/* Theme Switcher — cycles Sáng → Ấm → Tối */}
        <button
          onClick={cycleTheme}
          title={`${getLocalizedText('Giao diện', 'Theme', 'テーマ')}: ${THEME_LABELS[theme]}`}
          aria-label={`${getLocalizedText('Giao diện', 'Theme', 'テーマ')}: ${THEME_LABELS[theme]}`}
          className="h-10 w-10 flex items-center justify-center rounded-button border border-wit-line bg-wit-surface text-wit-text hover:bg-wit-surface-2 transition-all cursor-pointer shadow-card"
        >
          <ThemeIcon className="h-4.5 w-4.5" />
        </button>

        {/* User Info Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-wit-line/80">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-wit-red to-wit-red-dark text-white flex items-center justify-center font-serif font-bold text-sm shadow-card">
            {profile?.displayName ? profile.displayName[0].toUpperCase() : 'H'}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold text-wit-text">
              {profile?.displayName || getLocalizedText('Học viên', 'Student', '学生')}
            </div>
            <div className="text-[10px] text-wit-text-tertiary">
              {getLocalizedText('Đã đăng nhập', 'Signed in', 'ログイン中')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
