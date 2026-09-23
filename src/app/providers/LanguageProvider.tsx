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

interface LanguageContextType {
  language: Language;
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const PRIMARY_LOCALE_KEY = 'mastro_locale';

/**
 * Resolves initial language with the order:
 * 1. Saved preference in localStorage ('mastro_locale')
 * 2. System/Browser preferred language ((navigator.languages && navigator.languages[0]) || navigator.language)
 *    - if starts with 'ar' (e.g. 'ar', 'ar-EG', 'ar-SY') -> 'ar'
 *    - otherwise -> 'en'
 */
const getInitialLanguage = (): 'ar' | 'en' => {
  try {
    const saved = localStorage.getItem('mastro_locale');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch (err) {
    console.warn('[LanguageProvider] Unable to read localStorage:', err);
  }

  const systemLang = (
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    ''
  ).toLowerCase();

  return systemLang.startsWith('ar') ? 'ar' : 'en';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(getInitialLanguage);

  const isRtl = currentLang === 'ar';

  // Synchronize HTML attributes immediately upon mount and on language change
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(PRIMARY_LOCALE_KEY, lang);
    } catch (err) {
      console.warn('[LanguageProvider] Failed to save locale preference:', err);
    }
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
      return nextLang;
    });
  };

  const currentTranslations = dictionaries[currentLang];

  return (
    <LanguageContext.Provider
      value={{
        language: currentLang,
        isRtl,
        setLanguage,
        toggleLanguage,
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
