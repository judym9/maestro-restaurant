import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import type { SiteSettingsRow, ThemePaletteConfig } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../types';

interface SiteSettingsContextType {
  settings: SiteSettingsRow;
  isLoading: boolean;
  error: string | null;
  updateSettings: (partial: Partial<SiteSettingsRow>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  resetThemePalette: () => Promise<boolean>;
}

const STORAGE_KEY = 'maestro_site_settings_cache';
const SETTINGS_EVENT = 'maestro:settings-updated';

const getCachedSettings = (): SiteSettingsRow => {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
      // Enforce Al-Nabek location data across legacy cached data
      if (parsed.address_ar?.includes('دمشق') || parsed.address_ar?.includes('المزة')) {
        parsed.address_ar = DEFAULT_SITE_SETTINGS.address_ar;
      }
      if (parsed.address_en?.toLowerCase().includes('damascus') || parsed.address_en?.toLowerCase().includes('mezzeh')) {
        parsed.address_en = DEFAULT_SITE_SETTINGS.address_en;
      }
      if (parsed.maps_embed_url?.includes('Mezzeh') || parsed.maps_embed_url?.includes('Damascus')) {
        parsed.maps_embed_url = DEFAULT_SITE_SETTINGS.maps_embed_url;
      }
      if (parsed.banner_text_ar?.includes('دمشق')) {
        parsed.banner_text_ar = DEFAULT_SITE_SETTINGS.banner_text_ar;
      }
      if (parsed.banner_text_en?.toLowerCase().includes('damascus')) {
        parsed.banner_text_en = DEFAULT_SITE_SETTINGS.banner_text_en;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[SiteSettings] Failed to read cached settings:', e);
  }
  return DEFAULT_SITE_SETTINGS;
};

const applyDynamicPaletteToDom = (palette: ThemePaletteConfig) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Set primary accent colors
  if (palette.primary_accent) {
    root.style.setProperty('--accent-gold', palette.primary_accent);
    root.style.setProperty('--border-active', palette.primary_accent);
  }

  // Inject or update dynamic style element for theme overrides
  let dynamicStyleEl = document.getElementById('maestro-dynamic-palette');
  if (!dynamicStyleEl) {
    dynamicStyleEl = document.createElement('style');
    dynamicStyleEl.id = 'maestro-dynamic-palette';
    document.head.appendChild(dynamicStyleEl);
  }

  const css = `
    [data-theme='dark'], html.dark {
      --bg-primary: ${palette.dark_bg || '#0B0F17'} !important;
      --bg-surface: ${palette.dark_surface || '#1A1D24'} !important;
      ${palette.dark_border ? `--border-subtle: ${palette.dark_border} !important;` : ''}
    }
    [data-theme='light'], html.light {
      --bg-primary: ${palette.light_bg || '#FAF7F2'} !important;
      --bg-surface: ${palette.light_surface || '#FFFFFF'} !important;
      ${palette.light_border ? `--border-subtle: ${palette.light_border} !important;` : ''}
    }
  `;
  dynamicStyleEl.textContent = css;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsRow>(getCachedSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Apply palette whenever settings change
  useEffect(() => {
    if (settings.theme_palette) {
      applyDynamicPaletteToDom(settings.theme_palette);
    }
  }, [settings.theme_palette]);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // Local / Offline mode
      const cached = getCachedSettings();
      setSettings(cached);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: sbError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary')
        .maybeSingle();

      if (sbError) {
        console.warn('[SiteSettings] Supabase error, falling back to cache:', sbError.message);
        setError(sbError.message);
        setSettings(getCachedSettings());
      } else if (data) {
        const merged: SiteSettingsRow = {
          ...DEFAULT_SITE_SETTINGS,
          ...(data as any),
          theme_palette: {
            ...DEFAULT_SITE_SETTINGS.theme_palette,
            ...((data as any).theme_palette || {}),
          },
        };
        // Normalize any legacy Damascus values
        if (merged.address_ar?.includes('دمشق') || merged.address_ar?.includes('المزة')) {
          merged.address_ar = DEFAULT_SITE_SETTINGS.address_ar;
        }
        if (merged.address_en?.toLowerCase().includes('damascus') || merged.address_en?.toLowerCase().includes('mezzeh')) {
          merged.address_en = DEFAULT_SITE_SETTINGS.address_en;
        }
        if (merged.maps_embed_url?.includes('Mezzeh') || merged.maps_embed_url?.includes('Damascus')) {
          merged.maps_embed_url = DEFAULT_SITE_SETTINGS.maps_embed_url;
        }
        setSettings(merged);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {
          console.warn('[SiteSettings] Local storage cache write failed:', e);
        }
      } else {
        // Table exists but no row yet - insert default
        await supabase.from('site_settings').insert([DEFAULT_SITE_SETTINGS]);
        setSettings(DEFAULT_SITE_SETTINGS);
      }
    } catch (err: any) {
      console.warn('[SiteSettings] Exception fetching settings:', err);
      setError(err?.message || 'Network error');
      setSettings(getCachedSettings());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Listen to custom cross-tab or local updates
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettingsRow>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
        applyDynamicPaletteToDom(customEvent.detail.theme_palette);
      }
    };
    window.addEventListener(SETTINGS_EVENT, handleLocalUpdate);

    // Supabase Realtime subscription if configured
    let subscription: any = null;
    if (isSupabaseConfigured) {
      try {
        subscription = supabase
          .channel('public:site_settings')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'site_settings' },
            (payload) => {
              if (payload.new) {
                const updated = {
                  ...DEFAULT_SITE_SETTINGS,
                  ...(payload.new as any),
                };
                setSettings(updated);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('[SiteSettings] Realtime subscription not available:', err);
      }
    }

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleLocalUpdate);
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [fetchSettings]);

  const updateSettings = async (partial: Partial<SiteSettingsRow>): Promise<boolean> => {
    const updated: SiteSettingsRow = {
      ...settings,
      ...partial,
      updated_at: new Date().toISOString(),
    };

    // Optimistically update local state & cache
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: updated }));
    } catch (e) {
      console.warn('[SiteSettings] Local cache update error:', e);
    }

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const { error: sbError } = await supabase
        .from('site_settings')
        .upsert(updated, { onConflict: 'id' });

      if (sbError) {
        console.error('[SiteSettings] Error updating Supabase settings:', sbError.message);
        setError(sbError.message);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('[SiteSettings] Exception saving settings to Supabase:', err);
      setError(err?.message || 'Save error');
      return false;
    }
  };

  const resetThemePalette = async (): Promise<boolean> => {
    return updateSettings({ theme_palette: DEFAULT_SITE_SETTINGS.theme_palette });
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings,
        refreshSettings: fetchSettings,
        resetThemePalette,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
