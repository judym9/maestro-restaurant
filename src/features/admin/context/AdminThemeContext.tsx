import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeTokens } from '../types/settings.types';
import { settingsRepository, THEME_UPDATED_EVENT } from '../services/settingsRepository';

import { useTheme, type Theme } from '../../../app/providers/ThemeProvider';

export type AdminThemeMode = Theme;

interface AdminThemeContextType {
  mode: AdminThemeMode;
  tokens: ThemeTokens;
  toggleMode: () => void;
  setMode: (mode: AdminThemeMode) => void;
  updateTokens: (partial: Partial<ThemeTokens>) => void;
  resetTokens: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [tokens, setTokens] = useState<ThemeTokens>(() => settingsRepository.getThemeTokens());

  useEffect(() => {
    const handleUpdate = () => {
      setTokens(settingsRepository.getThemeTokens());
    };
    window.addEventListener(THEME_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(THEME_UPDATED_EVENT, handleUpdate);
  }, []);

  const updateTokens = (partial: Partial<ThemeTokens>) => {
    const updated = settingsRepository.saveThemeTokens(partial);
    setTokens(updated);
  };

  const resetTokens = () => {
    const res = settingsRepository.resetThemeTokens();
    setTokens(res);
  };

  return (
    <AdminThemeContext.Provider
      value={{
        mode: theme,
        tokens,
        toggleMode: toggleTheme,
        setMode: setTheme,
        updateTokens,
        resetTokens,
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = (): AdminThemeContextType => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};
