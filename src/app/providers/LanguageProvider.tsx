import React, { createContext, useContext, useEffect, useState } from 'react';

import arCommon from '../../locales/ar/common.json';
import arMenu from '../../locales/ar/menu.json';
import arHome from '../../locales/ar/home.json';

import enCommon from '../../locales/en/common.json';
import enMenu from '../../locales/en/menu.json';
import enHome from '../../locales/en/home.json';

export type Language = 'ar' | 'en';

type Translations = {
  common: typeof arCommon;
  menu: typeof arMenu;
  home: typeof arHome;
};

const dictionaries: Record<Language, Translations> = {
  ar: { common: arCommon, menu: arMenu, home: arHome },
  en: { common: enCommon, menu: enMenu, home: enHome },
};

export interface LanguageContextType {
  language: Language;
  isRtl: boolean;
  isSystemLanguage: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  resetToSystemLanguage: () => void;
  t: Translations;
}

const PRIMARY_LOCALE_KEY = 'mastro_locale';
const LEGACY_LOCALE_KEYS = ['locale', 'language', 'maestro_language'];

/**
 * Checks for explicitly saved language preference in localStorage
 */
export const getSavedLanguage = (): Language | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(PRIMARY_LOCALE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
    for (const key of LEGACY_LOCALE_KEYS) {
      const val = localStorage.getItem(key);
      if (val === 'ar' || val === 'en') return val;
    }
  } catch (err) {
    console.warn('[LanguageProvider] Unable to read localStorage:', err);
  }
  return null;
};

/**
 * Detects device/browser language using navigator.language or navigator.languages:
 * - If the language starts with 'ar', returns 'ar' (Arabic) with dir="rtl"
 * - Otherwise (or if English is detected), returns 'en' (English) with dir="ltr"
 */
export const getSystemLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'ar';

  const navLangs: readonly string[] = (navigator.languages && navigator.languages.length > 0)
    ? navigator.languages
    : [navigator.language || (navigator as any).userLanguage || ''];

  for (const lang of navLangs) {
    if (typeof lang === 'string' && lang.trim()) {
      const lower = lang.toLowerCase().trim();
      if (lower.startsWith('ar')) return 'ar';
      if (lower.startsWith('en')) return 'en';
    }
  }

  const primary = (navigator.language || (navigator as any).userLanguage || '').toLowerCase().trim();
  if (primary.startsWith('ar')) return 'ar';

  return 'en';
};

/**
 * Resolves initial language with the order:
 * 1. Explicitly saved preference in localStorage
 * 2. System/Browser preferred language fallback
 */
export const getInitialLanguage = (): Language => {
  const saved = getSavedLanguage();
  if (saved) return saved;
  return getSystemLanguage();
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<Language>(getInitialLanguage);
  const [hasManualOverride, setHasManualOverride] = useState<boolean>(() => getSavedLanguage() !== null);

  const isRtl = currentLang === 'ar';

  // Synchronize HTML attributes immediately upon mount and on language change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [currentLang]);

  // Real-time system language listener (updates when device/browser language changes and no manual override exists)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSystemLanguageChange = () => {
      const saved = getSavedLanguage();
      if (!saved) {
        const detected = getSystemLanguage();
        setCurrentLang(detected);
      }
    };

    window.addEventListener('languagechange', handleSystemLanguageChange);

    // Multi-tab and DevTools storage synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === PRIMARY_LOCALE_KEY || LEGACY_LOCALE_KEYS.includes(e.key)) {
        const saved = getSavedLanguage();
        if (saved) {
          setHasManualOverride(true);
          setCurrentLang(saved);
        } else {
          setHasManualOverride(false);
          setCurrentLang(getSystemLanguage());
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('languagechange', handleSystemLanguageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(PRIMARY_LOCALE_KEY, lang);
    } catch (err) {
      console.warn('[LanguageProvider] Failed to save locale preference:', err);
    }
    setHasManualOverride(true);
    setCurrentLang(lang);
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => {
      const nextLang: Language = prev === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem(PRIMARY_LOCALE_KEY, nextLang);
      } catch (err) {
        console.warn('[LanguageProvider] Failed to save locale preference:', err);
      }
      setHasManualOverride(true);
      return nextLang;
    });
  };

  const resetToSystemLanguage = () => {
    try {
      localStorage.removeItem(PRIMARY_LOCALE_KEY);
      for (const k of LEGACY_LOCALE_KEYS) {
        localStorage.removeItem(k);
      }
    } catch (err) {
      console.warn('[LanguageProvider] Failed to clear locale override:', err);
    }
    setHasManualOverride(false);
    setCurrentLang(getSystemLanguage());
  };

  const currentTranslations = dictionaries[currentLang];

  return (
    <LanguageContext.Provider
      value={{
        language: currentLang,
        isRtl,
        isSystemLanguage: !hasManualOverride,
        setLanguage,
        toggleLanguage,
        resetToSystemLanguage,
        t: currentTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
