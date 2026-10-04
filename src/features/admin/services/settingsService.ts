import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import { settingsRepository, SETTINGS_UPDATED_EVENT } from './settingsRepository';
import type { RestaurantSettingsRow } from '../../../types/database.types';

export interface AdminRestaurantSettings {
  id: number;
  isKitchenOpen: boolean;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  announcementBannerActive: boolean;
  announcementBannerTextAr: string;
  announcementBannerTextEn: string;
  phone: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  updatedAt: string;
}

export const SETTINGS_SERVICE_UPDATED_EVENT = 'maestro:settings-service-updated';

export const DEFAULT_RESTAURANT_SETTINGS: AdminRestaurantSettings = {
  id: 1,
  isKitchenOpen: true,
  deliveryTimeAr: '30 - 45 دقيقة',
  deliveryTimeEn: '30 - 45 mins',
  announcementBannerActive: false,
  announcementBannerTextAr: 'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها',
  announcementBannerTextEn: 'Now accepting orders with express delivery in Al-Nabek and surrounding areas',
  phone: '7247721',
  whatsapp: '0969697587',
  addressAr: 'سوريا، النبك، شارع أمين',
  addressEn: 'Syria, Al-Nabek, Amin Street',
  updatedAt: new Date().toISOString(),
};

const emitSettingsUpdated = (settings: AdminRestaurantSettings) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SETTINGS_SERVICE_UPDATED_EVENT, { detail: settings }));
    window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: settings }));
  }
};

/**
 * Service for restaurant settings and operating state with Supabase and local cache fallback
 */
export const settingsService = {
  /**
   * Fetches the current restaurant settings
   */
  async fetchSettings(): Promise<AdminRestaurantSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('restaurant_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (!error && data) {
          const row = data as RestaurantSettingsRow;
          const mapped: AdminRestaurantSettings = {
            id: row.id,
            isKitchenOpen: row.is_kitchen_open,
            deliveryTimeAr: row.delivery_time_ar,
            deliveryTimeEn: row.delivery_time_en,
            announcementBannerActive: row.announcement_banner_active,
            announcementBannerTextAr: row.announcement_banner_text_ar,
            announcementBannerTextEn: row.announcement_banner_text_en,
            phone: row.phone || DEFAULT_RESTAURANT_SETTINGS.phone,
            whatsapp: row.whatsapp || DEFAULT_RESTAURANT_SETTINGS.whatsapp,
            addressAr: row.address_ar || DEFAULT_RESTAURANT_SETTINGS.addressAr,
            addressEn: row.address_en || DEFAULT_RESTAURANT_SETTINGS.addressEn,
            updatedAt: row.updated_at,
          };
          return mapped;
        }
      } catch (err) {
        console.warn('[settingsService] Supabase fetchSettings failed, using fallback:', err);
      }
    }

    // Fallback: sync with local repository
    const localContact = settingsRepository.getContactInfo();
    const localOperating = settingsRepository.getOperatingSchedule();

    return {
      ...DEFAULT_RESTAURANT_SETTINGS,
      isKitchenOpen: localOperating.isOpen,
      phone: localContact.phonePrimary || DEFAULT_RESTAURANT_SETTINGS.phone,
      whatsapp: localContact.whatsappNumber || DEFAULT_RESTAURANT_SETTINGS.whatsapp,
      addressAr: localContact.addressAr || DEFAULT_RESTAURANT_SETTINGS.addressAr,
      addressEn: localContact.addressEn || DEFAULT_RESTAURANT_SETTINGS.addressEn,
    };
  },

  /**
   * Updates restaurant settings in Supabase and local cache
   */
  async updateSettings(partial: Partial<AdminRestaurantSettings>): Promise<AdminRestaurantSettings> {
    const current = await this.fetchSettings();
    const updated: AdminRestaurantSettings = {
      ...current,
      ...partial,
      // Lock official Al-Nabek defaults if cleared
      phone: partial.phone || current.phone || DEFAULT_RESTAURANT_SETTINGS.phone,
      whatsapp: partial.whatsapp || current.whatsapp || DEFAULT_RESTAURANT_SETTINGS.whatsapp,
      addressAr: partial.addressAr || current.addressAr || DEFAULT_RESTAURANT_SETTINGS.addressAr,
      addressEn: partial.addressEn || current.addressEn || DEFAULT_RESTAURANT_SETTINGS.addressEn,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const payload: Partial<RestaurantSettingsRow> = {
          id: 1,
          is_kitchen_open: updated.isKitchenOpen,
          delivery_time_ar: updated.deliveryTimeAr,
          delivery_time_en: updated.deliveryTimeEn,
          announcement_banner_active: updated.announcementBannerActive,
          announcement_banner_text_ar: updated.announcementBannerTextAr,
          announcement_banner_text_en: updated.announcementBannerTextEn,
          phone: updated.phone,
          whatsapp: updated.whatsapp,
          address_ar: updated.addressAr,
          address_en: updated.addressEn,
          updated_at: updated.updatedAt,
        };

        const { error } = await supabase
          .from('restaurant_settings')
          .upsert(payload as any);

        if (error) {
          console.warn('[settingsService] Supabase update error:', error.message);
        }

        // Also sync site_settings for backward compatibility
        await supabase
          .from('site_settings')
          .update({
            is_restaurant_open: updated.isKitchenOpen,
            banner_enabled: updated.announcementBannerActive,
            banner_text_ar: updated.announcementBannerTextAr,
            banner_text_en: updated.announcementBannerTextEn,
            primary_phone: updated.phone,
            whatsapp_number: updated.whatsapp,
            address_ar: updated.addressAr,
            address_en: updated.addressEn,
            delivery_estimate_ar: updated.deliveryTimeAr,
            delivery_estimate_en: updated.deliveryTimeEn,
          })
          .eq('id', 'primary');
      } catch (err) {
        console.warn('[settingsService] Supabase update exception:', err);
      }
    }

    // Sync with local repository
    settingsRepository.saveContactInfo({
      phonePrimary: updated.phone,
      whatsappNumber: updated.whatsapp,
      addressAr: updated.addressAr,
      addressEn: updated.addressEn,
    });

    settingsRepository.saveOperatingSchedule({
      isOpen: updated.isKitchenOpen,
      showEmergencyBanner: updated.announcementBannerActive,
      emergencyNoticeAr: updated.announcementBannerTextAr,
      emergencyNoticeEn: updated.announcementBannerTextEn,
    });

    emitSettingsUpdated(updated);
    return updated;
  },

  /**
   * Toggles kitchen open status
   */
  async toggleKitchenStatus(isOpen: boolean): Promise<AdminRestaurantSettings> {
    return this.updateSettings({ isKitchenOpen: isOpen });
  },

  /**
   * Updates announcement banner
   */
  async updateAnnouncementBanner(
    active: boolean,
    textAr?: string,
    textEn?: string
  ): Promise<AdminRestaurantSettings> {
    const updatePayload: Partial<AdminRestaurantSettings> = { announcementBannerActive: active };
    if (textAr !== undefined) updatePayload.announcementBannerTextAr = textAr;
    if (textEn !== undefined) updatePayload.announcementBannerTextEn = textEn;
    return this.updateSettings(updatePayload);
  },

  /**
   * Updates delivery estimate
   */
  async updateDeliveryTime(timeAr: string, timeEn: string): Promise<AdminRestaurantSettings> {
    return this.updateSettings({
      deliveryTimeAr: timeAr,
      deliveryTimeEn: timeEn,
    });
  },

  /**
   * Updates contact information
   */
  async updateContactInfo(
    phone: string,
    whatsapp: string,
    addressAr: string,
    addressEn: string
  ): Promise<AdminRestaurantSettings> {
    return this.updateSettings({
      phone,
      whatsapp,
      addressAr,
      addressEn,
    });
  },
};
