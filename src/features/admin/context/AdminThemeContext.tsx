import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeTokenConfig, ThemePresetOption } from '../types/settings.types';
import { settingsService, THEME_PRESETS } from '../services/settingsService';

interface AdminThemeContextType {
  tokens: ThemeTokenConfig;
  activePresetId: string | null;
  presets: ThemePresetOption[];
  updateTokens: (partial: Partial<ThemeTokenConfig>) => void;
  applyPreset: (presetId: string) => void;
  resetTokens: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<ThemeTokenConfig>(() => settingsService.getThemeTokens());
  const [activePresetId, setActivePresetId] = useState<string | null>('maestro-gold');

  useEffect(() => {
    settingsService.applyTokensToDom(tokens);
  }, [tokens]);

  const updateTokens = (partial: Partial<ThemeTokenConfig>) => {
    const updated = { ...tokens, ...partial };
    setTokens(updated);
    settingsService.saveThemeTokens(updated);
    setActivePresetId(null);
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setTokens(preset.tokens);
      settingsService.saveThemeTokens(preset.tokens);
      setActivePresetId(presetId);
    }
  };

  const resetTokens = () => {
    const defaultPreset = THEME_PRESETS[0];
    setTokens(defaultPreset.tokens);
    settingsService.saveThemeTokens(defaultPreset.tokens);
    setActivePresetId(defaultPreset.id);
  };

  return (
    <AdminThemeContext.Provider
      value={{
        tokens,
        activePresetId,
        presets: THEME_PRESETS,
        updateTokens,
        applyPreset,
        resetTokens,
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return ctx;
};
