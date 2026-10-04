import { useState, useCallback } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { ThemeTokens } from '../types/settings.types';

export const THEME_PRESETS: { nameAr: string; nameEn: string; tokens: ThemeTokens }[] = [
  {
    nameAr: 'مايسترو الذهبي الملكي (الافتراضي)',
    nameEn: 'Maestro Royal Gold (Default)',
    tokens: {
      primaryAccent: '#D97706',
      darkBg: '#0B0F17',
      darkSurface: '#1A1D24',
      darkBorder: 'rgba(255, 255, 255, 0.1)',
      lightBg: '#FAF7F2',
      lightSurface: '#FFFFFF',
      lightBorder: 'rgba(226, 232, 240, 0.8)',
    },
  },
  {
    nameAr: 'ياقوت دمشقي قرمزي',
    nameEn: 'Damascus Crimson Ruby',
    tokens: {
      primaryAccent: '#e11d48',
      darkBg: '#0f0a0d',
      darkSurface: '#1f1015',
      darkBorder: 'rgba(225, 29, 72, 0.25)',
      lightBg: '#FFF5F6',
      lightSurface: '#ffffff',
      lightBorder: '#fecdd3',
    },
  },
  {
    nameAr: 'زمرد بلاد الشام الفاخر',
    nameEn: 'Levant Emerald Prestige',
    tokens: {
      primaryAccent: '#10b981',
      darkBg: '#07120e',
      darkSurface: '#0d221a',
      darkBorder: 'rgba(16, 185, 129, 0.25)',
      lightBg: '#F0FDF4',
      lightSurface: '#ffffff',
      lightBorder: '#bbf7d0',
    },
  },
  {
    nameAr: 'العنبر الفحمي العميق',
    nameEn: 'Obsidian Amber Night',
    tokens: {
      primaryAccent: '#d97706',
      darkBg: '#05070a',
      darkSurface: '#0d131f',
      darkBorder: 'rgba(217, 119, 6, 0.3)',
      lightBg: '#FBF9F5',
      lightSurface: '#ffffff',
      lightBorder: '#e5e7eb',
    },
  },
];

export const useThemeCustomizer = () => {
  const themeContext = useAdminTheme();
  const [activeDraft, setActiveDraft] = useState<ThemeTokens>(themeContext.tokens);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTokenChange = useCallback((key: keyof ThemeTokens, value: string) => {
    setActiveDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const applyPreset = useCallback((preset: ThemeTokens) => {
    setActiveDraft(preset);
    themeContext.updateTokens(preset);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [themeContext]);

  const saveTokens = useCallback(() => {
    themeContext.updateTokens(activeDraft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [themeContext, activeDraft]);

  const resetToDefault = useCallback(() => {
    themeContext.resetTokens();
    setActiveDraft(THEME_PRESETS[0].tokens);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [themeContext]);

  return {
    mode: themeContext.mode,
    toggleMode: themeContext.toggleMode,
    tokens: themeContext.tokens,
    activeDraft,
    handleTokenChange,
    applyPreset,
    saveTokens,
    resetToDefault,
    saveSuccess,
  };
};
