import { useState, useCallback } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import type { ThemeTokens } from '../types/settings.types';

export const THEME_PRESETS: { nameAr: string; nameEn: string; tagAr: string; tagEn: string; tokens: ThemeTokens }[] = [
  {
    nameAr: 'مايسترو الذهبي الملكي (الافتراضي)',
    nameEn: 'Maestro Royal Gold (Default)',
    tagAr: 'ذهبي ملكي',
    tagEn: 'Royal Gold',
    tokens: {
      primaryAccent: '#D97706',
      secondaryAccent: '#F59E0B',
      darkBg: '#0B0F17',
      darkSurface: '#1A1D24',
      darkBorder: 'rgba(255, 255, 255, 0.1)',
      lightBg: '#FAF7F2',
      lightSurface: '#FFFFFF',
      lightBorder: 'rgba(226, 232, 240, 0.8)',
      fontFamily: 'Cairo',
      successColor: '#10B981',
      dangerColor: '#F43F5E',
    },
  },
  {
    nameAr: 'ياقوت دمشقي قرمزي',
    nameEn: 'Damascus Crimson Ruby',
    tagAr: 'قرمزي فاخر',
    tagEn: 'Crimson Ruby',
    tokens: {
      primaryAccent: '#E11D48',
      secondaryAccent: '#F43F5E',
      darkBg: '#0F0A0D',
      darkSurface: '#1F1015',
      darkBorder: 'rgba(225, 29, 72, 0.25)',
      lightBg: '#FFF5F6',
      lightSurface: '#FFFFFF',
      lightBorder: '#FECDD3',
      fontFamily: 'Cairo',
      successColor: '#10B981',
      dangerColor: '#E11D48',
    },
  },
  {
    nameAr: 'زمرد بلاد الشام الفاخر',
    nameEn: 'Levant Emerald Prestige',
    tagAr: 'زمرد طبيعي',
    tagEn: 'Emerald Fresh',
    tokens: {
      primaryAccent: '#10B981',
      secondaryAccent: '#34D399',
      darkBg: '#07120E',
      darkSurface: '#0D221A',
      darkBorder: 'rgba(16, 185, 129, 0.25)',
      lightBg: '#F0FDF4',
      lightSurface: '#FFFFFF',
      lightBorder: '#BBF7D0',
      fontFamily: 'Readex Pro',
      successColor: '#10B981',
      dangerColor: '#F43F5E',
    },
  },
  {
    nameAr: 'العنبر الفحمي العميق',
    nameEn: 'Obsidian Amber Night',
    tagAr: 'فحمي داكن',
    tagEn: 'Luxury Dark',
    tokens: {
      primaryAccent: '#F59E0B',
      secondaryAccent: '#FBBF24',
      darkBg: '#05070A',
      darkSurface: '#0D131F',
      darkBorder: 'rgba(245, 158, 11, 0.3)',
      lightBg: '#FBF9F5',
      lightSurface: '#FFFFFF',
      lightBorder: '#E5E7EB',
      fontFamily: 'Tajawal',
      successColor: '#10B981',
      dangerColor: '#EF4444',
    },
  },
  {
    nameAr: 'برونزي حلب التراثي',
    nameEn: 'Aleppo Imperial Bronze',
    tagAr: 'برونزي نحاسي',
    tagEn: 'Warm Bronze',
    tokens: {
      primaryAccent: '#B45309',
      secondaryAccent: '#D97706',
      darkBg: '#0D0B08',
      darkSurface: '#1A1612',
      darkBorder: 'rgba(180, 83, 9, 0.25)',
      lightBg: '#FAF6F0',
      lightSurface: '#FFFFFF',
      lightBorder: '#E7DFD5',
      fontFamily: 'IBM Plex Sans Arabic',
      successColor: '#10B981',
      dangerColor: '#E11D48',
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
