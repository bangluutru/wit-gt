import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import type { Theme, FontSize, Language, DisplayMode } from '../lib/types';

interface SettingsState {
  theme: Theme;
  fontSize: FontSize;
  interfaceLang: Language;
  preferredSourceLang: Language;
  preferredTargetLang: Language;
  displayMode: DisplayMode;
  focusMode: boolean;
}

interface SettingsContextType extends SettingsState {
  setTheme: (t: Theme) => void;
  setFontSize: (f: FontSize) => void;
  setInterfaceLang: (l: Language) => void;
  setSourceLang: (l: Language) => void;
  setTargetLang: (l: Language) => void;
  setDisplayMode: (m: DisplayMode) => void;
  toggleFocusMode: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'light',
  fontSize: 'medium',
  interfaceLang: 'vi',
  preferredSourceLang: 'vi',
  preferredTargetLang: 'en',
  displayMode: 'single',
  focusMode: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

function loadLocal(): Partial<SettingsState> {
  try {
    const raw = localStorage.getItem('wit-settings');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocal(s: SettingsState) {
  localStorage.setItem('wit-settings', JSON.stringify(s));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [state, setState] = useState<SettingsState>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadLocal(),
  }));

  // Sync from profile when available
  useEffect(() => {
    if (profile) {
      setState((prev) => ({
        ...prev,
        theme: profile.theme || prev.theme,
        fontSize: profile.readerFontSize || prev.fontSize,
        interfaceLang: profile.interfaceLang || prev.interfaceLang,
        preferredSourceLang: profile.preferredSourceLang || prev.preferredSourceLang,
        preferredTargetLang: profile.preferredTargetLang || prev.preferredTargetLang,
        displayMode: profile.displayMode || prev.displayMode,
      }));
    }
  }, [profile]);

  // Apply theme + font size to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('data-font-size', state.fontSize);
    document.documentElement.setAttribute('data-focus-mode', String(state.focusMode));
    saveLocal(state);
  }, [state]);

  const persist = async (updates: Partial<SettingsState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    saveLocal(newState);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          theme: newState.theme,
          readerFontSize: newState.fontSize,
          interfaceLang: newState.interfaceLang,
          preferredSourceLang: newState.preferredSourceLang,
          preferredTargetLang: newState.preferredTargetLang,
          displayMode: newState.displayMode,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Failed to save settings to Firestore:', err);
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        setTheme: (t) => persist({ theme: t }),
        setFontSize: (f) => persist({ fontSize: f }),
        setInterfaceLang: (l) => persist({ interfaceLang: l }),
        setSourceLang: (l) => persist({ preferredSourceLang: l }),
        setTargetLang: (l) => persist({ preferredTargetLang: l }),
        setDisplayMode: (m) => persist({ displayMode: m }),
        toggleFocusMode: () => setState((prev) => ({ ...prev, focusMode: !prev.focusMode })),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
