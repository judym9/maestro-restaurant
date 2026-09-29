import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminLanguage = 'ar' | 'en';

interface AdminLanguageContextType {
  language: AdminLanguage;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: AdminLanguage) => void;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'maestro_admin_lang';

export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AdminLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as AdminLanguage;
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: AdminLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <AdminLanguageContext.Provider value={{ language, isRTL, toggleLanguage, setLanguage }}>
      {children}
    </AdminLanguageContext.Provider>
  );
};

export const useAdminLanguage = () => {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return ctx;
};
