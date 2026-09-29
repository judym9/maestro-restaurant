import type { BusinessInfo, OperatingStatus, ThemeTokenConfig, ThemePresetOption } from '../types/settings.types';

const STORAGE_BUSINESS_KEY = 'maestro_admin_business_info';
const STORAGE_STATUS_KEY = 'maestro_admin_operating_status';
const STORAGE_THEME_KEY = 'maestro_admin_theme_tokens';

export const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  restaurantNameAr: 'مطعم مايسترو',
  restaurantNameEn: 'Maestro Restaurant',
  phone: '011-7247721',
  whatsapp: '0969697587',
  addressAr: 'سوريا، ريف دمشق، النبك، شارع أمين',
  addressEn: 'Amin Street, Al-Nabek, Rural Damascus, Syria',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Al-Nabek%20Syria&t=&z=15&ie=UTF8&iwloc=&output=embed',
  deliveryTimeEstimateAr: '20 - 35 دقيقة',
  deliveryTimeEstimateEn: '20 - 35 mins',
  deliveryFee: 15000,
  minimumOrder: 50000,
};

export const DEFAULT_OPERATING_STATUS: OperatingStatus = {
  isOpen: true,
  bannerNoticeAr: 'المطعم يستقبل طلباتكم بكل حب - توصيل سريع لجميع أحياء النبك وما حولها',
  bannerNoticeEn: 'Warmly accepting orders - Fast delivery across Al-Nabek and surrounding areas',
  workingHoursAr: 'يومياً من 11:00 صباحاً حتى 2:00 بعد منتصف الليل',
  workingHoursEn: 'Daily from 11:00 AM to 2:00 AM',
};

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'maestro-gold',
    nameAr: 'مايسترو الذهبي الملكي (الافتراضي)',
    nameEn: 'Maestro Royal Amber Gold (Default)',
    descAr: 'توهج العنبر الذهبي الفاخر مع خلفية أوبسيديان مخملية راقية',
    descEn: 'Iconic warm golden amber accents paired with deep obsidian slate',
    tokens: {
      primaryAccent: '#F59E0B',
      darkBg: '#090d16',
      darkSurface: '#0f172a',
      lightBg: '#F8FAFC',
      lightSurface: '#FFFFFF',
      darkBorder: 'rgba(245, 158, 11, 0.2)',
      lightBorder: 'rgba(245, 158, 11, 0.25)',
    },
  },
  {
    id: 'royal-emerald',
    nameAr: 'الزمرد الشامي الراقي',
    nameEn: 'Royal Damascus Emerald',
    descAr: 'لمسات زمردية منعشة تعكس نقاء المكونات والأصالة',
    descEn: 'Fresh culinary emerald tones with deep forest charcoal surfaces',
    tokens: {
      primaryAccent: '#10B981',
      darkBg: '#06130E',
      darkSurface: '#0F241C',
      lightBg: '#F2F8F5',
      lightSurface: '#FFFFFF',
      darkBorder: 'rgba(16, 185, 129, 0.2)',
      lightBorder: 'rgba(16, 185, 129, 0.25)',
    },
  },
  {
    id: 'crimson-fire',
    nameAr: 'اللهب القرمزي للشاورما',
    nameEn: 'Crimson Flame Shawarma',
    descAr: 'حيوية نارية حارة تناسب أطباق الشاورما والبروستد الذهبي المقرمش',
    descEn: 'Vibrant fiery crimson hues highlighting sizzling spit-roasted specialties',
    tokens: {
      primaryAccent: '#E11D48',
      darkBg: '#12080B',
      darkSurface: '#221016',
      lightBg: '#FFF5F6',
      lightSurface: '#FFFFFF',
      darkBorder: 'rgba(225, 29, 72, 0.2)',
      lightBorder: 'rgba(225, 29, 72, 0.25)',
    },
  },
  {
    id: 'sapphire-night',
    nameAr: 'الياقوت الليلي الفاخر',
    nameEn: 'Midnight Sapphire Elegance',
    descAr: 'فخامة ملكية زرقاء عالية التباين للمناسبات الخاصة',
    descEn: 'Prestigious midnight sapphire blue with pristine high-contrast surfaces',
    tokens: {
      primaryAccent: '#3B82F6',
      darkBg: '#080F1E',
      darkSurface: '#101C33',
      lightBg: '#F0F5FF',
      lightSurface: '#FFFFFF',
      darkBorder: 'rgba(59, 130, 246, 0.2)',
      lightBorder: 'rgba(59, 130, 246, 0.25)',
    },
  },
];

class SettingsService {
  public getBusinessInfo(): BusinessInfo {
    if (typeof window === 'undefined') return DEFAULT_BUSINESS_INFO;
    try {
      const stored = localStorage.getItem(STORAGE_BUSINESS_KEY);
      if (stored) return { ...DEFAULT_BUSINESS_INFO, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_BUSINESS_INFO;
  }

  public saveBusinessInfo(info: Partial<BusinessInfo>): BusinessInfo {
    const current = this.getBusinessInfo();
    const updated = { ...current, ...info };
    localStorage.setItem(STORAGE_BUSINESS_KEY, JSON.stringify(updated));
    return updated;
  }

  public getOperatingStatus(): OperatingStatus {
    if (typeof window === 'undefined') return DEFAULT_OPERATING_STATUS;
    try {
      const stored = localStorage.getItem(STORAGE_STATUS_KEY);
      if (stored) return { ...DEFAULT_OPERATING_STATUS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_OPERATING_STATUS;
  }

  public saveOperatingStatus(status: Partial<OperatingStatus>): OperatingStatus {
    const current = this.getOperatingStatus();
    const updated = { ...current, ...status };
    localStorage.setItem(STORAGE_STATUS_KEY, JSON.stringify(updated));
    return updated;
  }

  public getThemeTokens(): ThemeTokenConfig {
    if (typeof window === 'undefined') return THEME_PRESETS[0].tokens;
    try {
      const stored = localStorage.getItem(STORAGE_THEME_KEY);
      if (stored) return { ...THEME_PRESETS[0].tokens, ...JSON.parse(stored) };
    } catch {}
    return THEME_PRESETS[0].tokens;
  }

  public saveThemeTokens(tokens: ThemeTokenConfig): ThemeTokenConfig {
    localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(tokens));
    this.applyTokensToDom(tokens);
    return tokens;
  }

  public applyTokensToDom(tokens: ThemeTokenConfig) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--accent-gold', tokens.primaryAccent);
    root.style.setProperty('--border-active', tokens.primaryAccent);
  }
}

export const settingsService = new SettingsService();
