import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const PRIMARY_THEME_KEY = 'mastro_theme';
const LEGACY_THEME_KEY = 'maestro_theme_preference';

/**
 * Reads manual override from localStorage if present
 */
const getSavedTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(PRIMARY_THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (err) {
    console.warn('[ThemeProvider] Unable to read localStorage:', err);
  }
  return null;
};

/**
 * Detects operating system theme via matchMedia
 */
const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  }
  return 'dark'; // Default luxury mood
};

/**
 * Detection order:
 * 1. localStorage ('mastro_theme' or legacy key)
 * 2. System theme via window.matchMedia('(prefers-color-scheme: dark)')
 */
const getInitialTheme = (): Theme => {
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
      document.documentElement.classList.toggle('dark', targetTheme === 'dark');
      document.documentElement.classList.toggle('light', targetTheme === 'light');
    }
  };

  // Sync DOM on theme state changes
  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  // Live system theme listener (active only when no manual override in localStorage)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    // If user has manually overridden the theme, bypass the live system listener
    if (hasManualOverride) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Re-check localStorage in case it changed in another tab or action
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

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleSystemChange);
      }
    };
  }, [hasManualOverride]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(PRIMARY_THEME_KEY, newTheme);
    } catch (err) {
      console.warn('[ThemeProvider] Failed to save theme override:', err);
    }
    setHasManualOverride(true);
    applyThemeToDom(newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(PRIMARY_THEME_KEY, nextTheme);
      } catch (err) {
        console.warn('[ThemeProvider] Failed to save theme override:', err);
      }
      setHasManualOverride(true);
      applyThemeToDom(nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
