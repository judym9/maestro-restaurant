import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';

export interface RealtimeSyncCallbacks {
  onMenuItemsChange?: () => void;
  onCategoriesChange?: () => void;
  onPromotionsChange?: () => void;
  onSettingsChange?: () => void;
}

/**
 * Hook to subscribe to Supabase Realtime changes across menu_items, categories,
 * promotions, and restaurant_settings tables.
 */
export const useRealtimeSync = (callbacks: RealtimeSyncCallbacks) => {
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('maestro_admin_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          callbacks.onMenuItemsChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          callbacks.onCategoriesChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'promotions' },
        () => {
          callbacks.onPromotionsChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'restaurant_settings' },
        () => {
          callbacks.onSettingsChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          callbacks.onSettingsChange?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    callbacks.onMenuItemsChange,
    callbacks.onCategoriesChange,
    callbacks.onPromotionsChange,
    callbacks.onSettingsChange,
  ]);
};
