import type { SiteSettingsRow, ThemePaletteConfig } from '../../types/database.types';

export type { SiteSettingsRow, ThemePaletteConfig };

export const DEFAULT_THEME_PALETTE: ThemePaletteConfig = {
  primary_accent: '#F59E0B',
  dark_bg: '#0B0F17',
  dark_surface: '#1A1D24',
  light_bg: '#FAF7F2',
  light_surface: '#FFFFFF',
  dark_border: 'rgba(255, 255, 255, 0.08)',
  light_border: 'rgba(226, 232, 240, 0.8)',
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsRow = {
  id: 'primary',
  restaurant_name_ar: 'مطعم مايسترو',
  restaurant_name_en: 'MAESTRO Restaurant',
  address_ar: 'سوريا، النبك، شارع أمين',
  address_en: 'Syria, Al-Nabek, Amin Street',
  maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13145.4!2d36.726!3d34.024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518000000000000%3A0x0!2sAmin%20St%2C%20Al-Nabek%2C%20Syria!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s',
  primary_phone: '7247721',
  whatsapp_number: '0969697587',
  working_hours_ar: 'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل',
  working_hours_en: 'Daily: 12:00 PM - 02:00 AM',
  delivery_estimate_ar: '30 - 45 دقيقة',
  delivery_estimate_en: '30 - 45 mins',
  is_restaurant_open: true,
  banner_enabled: false,
  banner_text_ar: 'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها',
  banner_text_en: 'Now accepting orders with express delivery in Al-Nabek and surrounding areas',
  theme_palette: DEFAULT_THEME_PALETTE,
  updated_at: new Date().toISOString(),
};
