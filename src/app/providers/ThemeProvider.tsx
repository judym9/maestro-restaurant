import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'mastro-luxury';

export interface ThemeContextType {
  theme: Theme;
  isSystemTheme: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resetToSystemTheme: () => void;
}

const PRIMARY_THEME_KEY = 'theme';
const LEGACY_THEME_KEYS = ['mastro_theme', 'maestro_theme_preference', 'maestro_admin_theme_mode'];

/**
 * Reads manual override from localStorage if explicitly present and valid
 */
export const getSavedTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(PRIMARY_THEME_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'mastro-luxury') {
      return saved as Theme;
    }
    for (const key of LEGACY_THEME_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy === 'dark' || legacy === 'light' || legacy === 'mastro-luxury') {
        return legacy as Theme;
      }
    }
  } catch (err) {
    console.warn('[ThemeProvider] Unable to read localStorage:', err);
  }
  return null;
};

/**
 * Detects operating system theme via matchMedia('(prefers-color-scheme: dark)')
 */
export const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  }
  return 'dark'; // Fallback
};

/**
 * Detection order:
 * 1. Saved override in localStorage ('theme' or legacy keys)
 * 2. System theme via window.matchMedia('(prefers-color-scheme: dark)')
 */
export const getInitialTheme = (): Theme => {
  const saved = getSavedTheme();
  if (saved) return saved;
  return getSystemTheme();
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [hasManualOverride, setHasManualOverride] = useState<boolean>(() => getSavedTheme() !== null);

  const applyThemeToDom = (targetTheme: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', targetTheme);
      document.documentElement.classList.toggle('dark', targetTheme === 'dark' || targetTheme === 'mastro-luxury');
      document.documentElement.classList.toggle('light', targetTheme === 'light');
      document.documentElement.classList.toggle('mastro-luxury', targetTheme === 'mastro-luxury');
    }
  };

  // Immediate sync on mount & state change
  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  // Live system theme listener (updates in real time when no manual override exists)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // If user has not manually set and saved an override, follow device theme
      const saved = getSavedTheme();
      if (!saved) {
        const nextTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(nextTheme);
        applyThemeToDom(nextTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSystemChange);
    }

    // Storage event listener for cross-tab or DevTools clearing
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === PRIMARY_THEME_KEY || LEGACY_THEME_KEYS.includes(e.key)) {
        const saved = getSavedTheme();
        if (saved) {
          setHasManualOverride(true);
          setThemeState(saved);
          applyThemeToDom(saved);
        } else {
          setHasManualOverride(false);
          const sysTheme = getSystemTheme();
          setThemeState(sysTheme);
          applyThemeToDom(sysTheme);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleSystemChange);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(PRIMARY_THEME_KEY, newTheme);
      localStorage.setItem('mastro_theme', newTheme);
      localStorage.setItem('maestro_admin_theme_mode', newTheme);
    } catch (err) {
      console.warn('[ThemeProvider] Failed to save theme override:', err);
    }
    setHasManualOverride(true);
    applyThemeToDom(newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'mastro-luxury' : prev === 'mastro-luxury' ? 'light' : 'dark';
      try {
        localStorage.setItem(PRIMARY_THEME_KEY, nextTheme);
        localStorage.setItem('mastro_theme', nextTheme);
        localStorage.setItem('maestro_admin_theme_mode', nextTheme);
      } catch (err) {
        console.warn('[ThemeProvider] Failed to save theme override:', err);
      }
      setHasManualOverride(true);
      applyThemeToDom(nextTheme);
      return nextTheme;
    });
  };

  const resetToSystemTheme = () => {
    try {
      localStorage.removeItem(PRIMARY_THEME_KEY);
      for (const k of LEGACY_THEME_KEYS) {
        localStorage.removeItem(k);
      }
    } catch (err) {
      console.warn('[ThemeProvider] Failed to clear theme overrides:', err);
    }
    setHasManualOverride(false);
    const sysTheme = getSystemTheme();
    setThemeState(sysTheme);
    applyThemeToDom(sysTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isSystemTheme: !hasManualOverride,
        toggleTheme,
        setTheme,
        resetToSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
