import { Minus, Plus, Focus, Sun, Moon, Sunset } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import type { Theme, FontSize } from '../../lib/types';

const FONT_SIZES: FontSize[] = ['small', 'medium', 'large'];
const THEMES: Theme[] = ['light', 'warm', 'dark'];
const THEME_ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  warm: Sunset,
  dark: Moon,
};

export function ReadingToolbar() {
  const { fontSize, setFontSize, theme, setTheme, focusMode, toggleFocusMode } =
    useSettings();

  const fontSizeIndex = FONT_SIZES.indexOf(fontSize);

  const decreaseFont = () => {
    if (fontSizeIndex > 0) setFontSize(FONT_SIZES[fontSizeIndex - 1]);
  };

  const increaseFont = () => {
    if (fontSizeIndex < FONT_SIZES.length - 1) setFontSize(FONT_SIZES[fontSizeIndex + 1]);
  };

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  const ThemeIcon = THEME_ICONS[theme];

  return (
    <div
      className="
        fixed z-20
        bottom-20 right-4
        md:bottom-6 md:right-6
        bg-wit-surface/90 backdrop-blur-sm rounded-full shadow-popover
        flex items-center gap-1 p-1.5
        animate-scale-in
      "
    >
      {/* Font size decrease */}
      <button
        onClick={decreaseFont}
        disabled={fontSizeIndex === 0}
        className="
          w-9 h-9 rounded-full flex items-center justify-center
          text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface-alt
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-200
        "
        title="Giảm cỡ chữ"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="text-xs font-medium text-wit-text-secondary w-5 text-center select-none">
        A
      </span>

      {/* Font size increase */}
      <button
        onClick={increaseFont}
        disabled={fontSizeIndex === FONT_SIZES.length - 1}
        className="
          w-9 h-9 rounded-full flex items-center justify-center
          text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface-alt
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-200
        "
        title="Tăng cỡ chữ"
      >
        <Plus className="h-4 w-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-wit-line mx-0.5" />

      {/* Focus mode */}
      <button
        onClick={toggleFocusMode}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center
          transition-colors duration-200
          ${
            focusMode
              ? 'bg-wit-red text-white'
              : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface-alt'
          }
        `}
        title="Chế độ tập trung"
      >
        <Focus className="h-4 w-4" />
      </button>

      {/* Theme cycle */}
      <button
        onClick={cycleTheme}
        className="
          w-9 h-9 rounded-full flex items-center justify-center
          text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface-alt
          transition-colors duration-200
        "
        title={`Theme: ${theme}`}
      >
        <ThemeIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
