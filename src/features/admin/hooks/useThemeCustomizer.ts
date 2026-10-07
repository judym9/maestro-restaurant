import { useState, useCallback, useEffect } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { DEFAULT_THEME_TOKENS } from '../services/settingsRepository';
import type { ThemeTokens } from '../types/settings.types';

export interface ThemePreset {
  id: 'mastro-luxury' | 'modern-dark' | 'clean-light';
  nameAr: string;
  nameEn: string;
  tagAr: string;
  tagEn: string;
  badgeAr: string;
  badgeEn: string;
  tokens: ThemeTokens;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'mastro-luxury',
    nameAr: 'مايسترو الذهبي الفاخر',
    nameEn: 'Mastro Luxury Gold',
    tagAr: 'أسود فحمي ملكي مع لمسات ذهبية وعنبرية غنية',
    tagEn: 'Deep obsidian/black with rich gold & amber accents',
    badgeAr: 'الملكي الأصيل',
    badgeEn: 'Royal Signature',
    tokens: {
      presetId: 'mastro-luxury',
      primaryAccent: '#F59E0B',
      secondaryAccent: '#D97706',
      darkBg: '#06090E',
      darkSurface: '#131926',
      darkBorder: 'rgba(245, 158, 11, 0.22)',
      lightBg: '#FAF8F5',
      lightSurface: '#FFFFFF',
      lightBorder: 'rgba(226, 232, 240, 0.8)',
      textPrimary: '#FFFDF8',
      darkText: '#FFFDF8',
      lightText: '#0F172A',
      fontFamily: 'Cairo',
      successColor: '#10B981',
      dangerColor: '#F43F5E',
    },
  },
  {
    id: 'modern-dark',
    nameAr: 'الداكن العصري النيو-مودرن',
    nameEn: 'Modern Dark',
    tagAr: 'رمادي حجري ناعم بلمسات زمردية منعشة',
    tagEn: 'Slate/zinc dark with vibrant emerald & crimson accents',
    badgeAr: 'عصري نيو-مودرن',
    badgeEn: 'Modern Slate',
    tokens: {
      presetId: 'modern-dark',
      primaryAccent: '#10B981',
      secondaryAccent: '#059669',
      darkBg: '#090D16',
      darkSurface: '#141B29',
      darkBorder: 'rgba(255, 255, 255, 0.12)',
      lightBg: '#F8FAFC',
      lightSurface: '#FFFFFF',
      lightBorder: '#E2E8F0',
      textPrimary: '#F8FAFC',
      darkText: '#F8FAFC',
      lightText: '#0F172A',
      fontFamily: 'Cairo',
      successColor: '#10B981',
      dangerColor: '#E11D48',
    },
  },
  {
    id: 'clean-light',
    nameAr: 'الفاتح الأنيق الهادئ',
    nameEn: 'Clean Light',
    tagAr: 'أبيض عاجي دافئ مع لمسات داكنة ملكية',
    tagEn: 'Soft warm white/beige with royal dark accents',
    badgeAr: 'نقاء وفخامة',
    badgeEn: 'Warm Elegance',
    tokens: {
      presetId: 'clean-light',
      primaryAccent: '#D97706',
      secondaryAccent: '#B45309',
      darkBg: '#0F172A',
      darkSurface: '#1E293B',
      darkBorder: 'rgba(255, 255, 255, 0.1)',
      lightBg: '#FAF8F5',
      lightSurface: '#FFFFFF',
      lightBorder: 'rgba(226, 232, 240, 0.8)',
      textPrimary: '#0F172A',
      darkText: '#F8FAFC',
      lightText: '#0F172A',
      fontFamily: 'Cairo',
      successColor: '#10B981',
      dangerColor: '#F43F5E',
    },
  },
];

export interface AccentSwatch {
  nameAr: string;
  nameEn: string;
  hex: string;
  descriptionAr: string;
}

export const ACCENT_SWATCHES: AccentSwatch[] = [
  { nameAr: 'ذهبي ملكي', nameEn: 'Imperial Gold', hex: '#F59E0B', descriptionAr: 'اللون التوقيعي لمايسترو' },
  { nameAr: 'عنبري دافئ', nameEn: 'Warm Amber', hex: '#D97706', descriptionAr: 'عنبر دمشقي أصيل' },
  { nameAr: 'قرمزي ياقوتي', nameEn: 'Crimson Red', hex: '#E11D48', descriptionAr: 'ياقوت أحمر فاخر' },
  { nameAr: 'زمردي ملكي', nameEn: 'Royal Emerald', hex: '#10B981', descriptionAr: 'زمرد شامي منعش' },
  { nameAr: 'برونزي حلبي', nameEn: 'Aleppo Bronze', hex: '#B45309', descriptionAr: 'نحاسي عريق دافئ' },
  { nameAr: 'نيلي إمبراطوري', nameEn: 'Royal Indigo', hex: '#6366F1', descriptionAr: 'حداثة كلاسيكية أنيقة' },
];

export const useThemeCustomizer = () => {
  const themeContext = useAdminTheme();
  const [activeDraft, setActiveDraft] = useState<ThemeTokens>(() => themeContext.tokens);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync draft if external tokens change and draft hasn't diverged
  useEffect(() => {
    setActiveDraft(themeContext.tokens);
  }, [themeContext.tokens]);

  const handleTokenChange = useCallback((key: keyof ThemeTokens, value: string) => {
    setActiveDraft((prev) => ({
      ...prev,
      [key]: value,
      presetId: 'custom',
    }));
  }, []);

  const applyPreset = useCallback((preset: ThemeTokens) => {
    setActiveDraft(preset);
  }, []);

  const saveTokens = useCallback(() => {
    themeContext.updateTokens(activeDraft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [themeContext, activeDraft]);

  const resetToDefault = useCallback(() => {
    themeContext.resetTokens();
    setActiveDraft(DEFAULT_THEME_TOKENS);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [themeContext]);

  // Determine active preset (if draft matches one of the presets)
  const activePresetId = THEME_PRESETS.find(
    (p) =>
      p.tokens.primaryAccent.toLowerCase() === activeDraft.primaryAccent?.toLowerCase() &&
      p.tokens.darkBg.toLowerCase() === activeDraft.darkBg?.toLowerCase()
  )?.id || (activeDraft.presetId === 'custom' ? null : activeDraft.presetId);

  const hasUnsavedChanges = JSON.stringify(activeDraft) !== JSON.stringify(themeContext.tokens);

  return {
    mode: themeContext.mode,
    toggleMode: themeContext.toggleMode,
    setMode: themeContext.setMode,
    tokens: themeContext.tokens,
    activeDraft,
    activePresetId,
    hasUnsavedChanges,
    handleTokenChange,
    applyPreset,
    saveTokens,
    resetToDefault,
    saveSuccess,
  };
};
