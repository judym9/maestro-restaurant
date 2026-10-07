import type { BranchContactInfo, OperatingSchedule, ThemeTokens } from '../types/settings.types';
import { getOptimalButtonTextColor } from '../utils/themeContrast';

export const SETTINGS_UPDATED_EVENT = 'maestro:admin-settings-updated';
export const THEME_UPDATED_EVENT = 'maestro:admin-theme-updated';

const STORAGE_CONTACT_KEY = 'maestro_admin_contact_info';
const STORAGE_SCHEDULE_KEY = 'maestro_admin_operating_schedule';
const STORAGE_THEME_KEY = 'maestro_admin_theme_tokens';

export const DEFAULT_CONTACT_INFO: BranchContactInfo = {
  restaurantNameAr: 'مطعم مايسترو الملكي',
  restaurantNameEn: 'El Maestro Royal Restaurant',
  taglineAr: 'سيمفونية المذاق الأصيل والمشاوي الملكية في النبك',
  taglineEn: 'The Symphony of Levantine Flavors & Royal Grills in Al-Nabek',
  aboutStoryAr: 'يقدم مطعم المايسترو منذ تأسيسه تجربة طهي شامية استثنائية تمزج بين عراقة التوابل الدمشقية وجودة المكونات البلدية الطازجة، ليكون وجهتكم الأولى للشاورما والبروستد والمشاوي الفاخرة.',
  aboutStoryEn: 'Since our establishment, El Maestro has delivered an exceptional Syrian culinary voyage, blending heritage Levantine spices with farm-fresh meats to be your premiere destination for shawarma, crispy broasted, and royal grills.',
  logoUrl: '',
  coverBannerUrl: '',
  phonePrimary: '0969 697 587',
  phoneSecondary: '011 724 7721',
  whatsappNumber: '963969697587',
  emailContact: 'info@maestro-restaurant.com',
  addressAr: 'شارع الأمين، ساحة الميدان، النبك، ريف دمشق، سوريا',
  addressEn: 'Amin Street, Al-Midan Square, Al-Nabek, Rural Damascus, Syria',
  googleMapsUrl: 'https://maps.google.com/?q=Amin+Street,+Al-Nabek,+Syria',
  workingHoursAr: 'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل',
  workingHoursEn: 'Daily: 12:00 PM - 02:00 AM',
  cityAr: 'النبك',
  cityEn: 'Al-Nabek',
  instagramUrl: 'https://instagram.com/maestro.restaurant',
  facebookUrl: 'https://facebook.com/maestro.alnabek',
  tiktokUrl: 'https://tiktok.com/@maestro_syria',
};

export const DEFAULT_WEEKLY_SCHEDULE = [
  { dayId: 'saturday', nameAr: 'السبت', nameEn: 'Saturday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
  { dayId: 'sunday', nameAr: 'الأحد', nameEn: 'Sunday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
  { dayId: 'monday', nameAr: 'الإثنين', nameEn: 'Monday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
  { dayId: 'tuesday', nameAr: 'الثلاثاء', nameEn: 'Tuesday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
  { dayId: 'wednesday', nameAr: 'الأربعاء', nameEn: 'Wednesday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
  { dayId: 'thursday', nameAr: 'الخميس', nameEn: 'Thursday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
  { dayId: 'friday', nameAr: 'الجمعة', nameEn: 'Friday', isOpen: true, openTime: '12:00', closeTime: '02:00' },
];

export const DEFAULT_OPERATING_SCHEDULE: OperatingSchedule = {
  isOpen: true,
  autoToggle: false,
  is24HourFormat: false,
  openingTime: '12:00',
  closingTime: '02:00',
  emergencyNoticeAr: 'نستقبلكم بكل حب وسرور يومياً في فرعنا بالنبك وخدمة التوصيل السريع متاحة!',
  emergencyNoticeEn: 'Welcoming you with warmth daily in Al-Nabek with fast delivery available!',
  showEmergencyBanner: false,
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  minOrderAmount: 50000,
  deliveryFee: 15000,
  taxRatePercent: 0,
  estimatedDeliveryTimeAr: '30 - 45 دقيقة',
  estimatedDeliveryTimeEn: '30 - 45 mins',
};

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  presetId: 'mastro-luxury',
  primaryAccent: '#F59E0B', // Mastro Luxury Gold
  secondaryAccent: '#D97706',
  darkBg: '#06090E', // Deep obsidian/black
  darkSurface: '#131926', // Luminous dark card surface
  darkBorder: 'rgba(245, 158, 11, 0.22)',
  lightBg: '#FAF8F5', // Soft warm white/beige
  lightSurface: '#FFFFFF',
  lightBorder: 'rgba(226, 232, 240, 0.8)',
  textPrimary: '#FFFDF8',
  darkText: '#FFFDF8',
  lightText: '#0F172A',
  fontFamily: 'Cairo',
  successColor: '#10B981',
  dangerColor: '#F43F5E',
};

export interface ISettingsRepository {
  getContactInfo(): BranchContactInfo;
  saveContactInfo(data: Partial<BranchContactInfo>): BranchContactInfo;
  getOperatingSchedule(): OperatingSchedule;
  saveOperatingSchedule(data: Partial<OperatingSchedule>): OperatingSchedule;
  getThemeTokens(): ThemeTokens;
  saveThemeTokens(data: Partial<ThemeTokens>): ThemeTokens;
  resetThemeTokens(): ThemeTokens;
}

class LocalStorageSettingsRepository implements ISettingsRepository {
  public getContactInfo(): BranchContactInfo {
    if (typeof window === 'undefined') return DEFAULT_CONTACT_INFO;
    try {
      const stored = localStorage.getItem(STORAGE_CONTACT_KEY);
      if (stored) {
        return { ...DEFAULT_CONTACT_INFO, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('[settingsRepository] Failed reading contact info:', e);
    }
    return DEFAULT_CONTACT_INFO;
  }

  public saveContactInfo(data: Partial<BranchContactInfo>): BranchContactInfo {
    const current = this.getContactInfo();
    const updated = { ...current, ...data };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CONTACT_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT));
      } catch (e) {
        console.warn('[settingsRepository] Failed saving contact info:', e);
      }
    }
    return updated;
  }

  public getOperatingSchedule(): OperatingSchedule {
    if (typeof window === 'undefined') return DEFAULT_OPERATING_SCHEDULE;
    try {
      const stored = localStorage.getItem(STORAGE_SCHEDULE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_OPERATING_SCHEDULE,
          ...parsed,
          weeklySchedule: parsed.weeklySchedule?.length ? parsed.weeklySchedule : DEFAULT_WEEKLY_SCHEDULE,
        };
      }
    } catch (e) {
      console.warn('[settingsRepository] Failed reading operating schedule:', e);
    }
    return DEFAULT_OPERATING_SCHEDULE;
  }

  public saveOperatingSchedule(data: Partial<OperatingSchedule>): OperatingSchedule {
    const current = this.getOperatingSchedule();
    const updated = { ...current, ...data };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT));
      } catch (e) {
        console.warn('[settingsRepository] Failed saving operating schedule:', e);
      }
    }
    return updated;
  }

  public getThemeTokens(): ThemeTokens {
    if (typeof window === 'undefined') return DEFAULT_THEME_TOKENS;
    try {
      const stored = localStorage.getItem(STORAGE_THEME_KEY);
      if (stored) {
        return { ...DEFAULT_THEME_TOKENS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('[settingsRepository] Failed reading theme tokens:', e);
    }
    return DEFAULT_THEME_TOKENS;
  }

  public saveThemeTokens(data: Partial<ThemeTokens>): ThemeTokens {
    const current = this.getThemeTokens();
    const updated = { ...current, ...data };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, JSON.stringify(updated));
        this.injectTokensToDOM(updated);
        window.dispatchEvent(new CustomEvent(THEME_UPDATED_EVENT));
      } catch (e) {
        console.warn('[settingsRepository] Failed saving theme tokens:', e);
      }
    }
    return updated;
  }

  public resetThemeTokens(): ThemeTokens {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_THEME_KEY);
        this.injectTokensToDOM(DEFAULT_THEME_TOKENS);
        window.dispatchEvent(new CustomEvent(THEME_UPDATED_EVENT));
      } catch (e) {
        console.warn('[settingsRepository] Failed resetting theme tokens:', e);
      }
    }
    return DEFAULT_THEME_TOKENS;
  }

  private injectTokensToDOM(tokens: ThemeTokens) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const accent = tokens.primaryAccent || '#F59E0B';
    const btnTextColor = getOptimalButtonTextColor(accent);

    root.style.setProperty('--color-primary', accent);
    root.style.setProperty('--gold-500', accent);
    root.style.setProperty('--primary', accent);
    root.style.setProperty('--accent-gold', accent);
    root.style.setProperty('--brand-accent', accent);
    root.style.setProperty('--btn-primary-text', btnTextColor);

    if (tokens.secondaryAccent) {
      root.style.setProperty('--color-secondary', tokens.secondaryAccent);
    }
    if (tokens.successColor) {
      root.style.setProperty('--color-success', tokens.successColor);
    }
    if (tokens.dangerColor) {
      root.style.setProperty('--color-danger', tokens.dangerColor);
    }
    if (tokens.fontFamily) {
      root.style.setProperty('--font-arabic', tokens.fontFamily);
    }

    let dynamicStyle = document.getElementById('maestro-admin-dynamic-palette');
    if (!dynamicStyle) {
      dynamicStyle = document.createElement('style');
      dynamicStyle.id = 'maestro-admin-dynamic-palette';
      document.head.appendChild(dynamicStyle);
    }

    const lightBg = tokens.lightBg || '#FAF8F5';
    const lightSurface = tokens.lightSurface || '#FFFFFF';
    const lightBorder = tokens.lightBorder || 'rgba(226, 232, 240, 0.8)';
    const lightText = tokens.lightText || '#0F172A';

    const darkBg = tokens.darkBg || '#06090E';
    const darkSurface = tokens.darkSurface || '#131926';
    const darkBorder = tokens.darkBorder || 'rgba(245, 158, 11, 0.22)';
    const darkText = tokens.darkText || tokens.textPrimary || '#FFFDF8';

    dynamicStyle.textContent = `
      :root, [data-theme='light'], html.light {
        --background: ${lightBg};
        --bg-page: ${lightBg};
        --bg-primary: ${lightBg};
        --card: ${lightSurface};
        --bg-surface: ${lightSurface};
        --border: ${lightBorder};
        --border-color: ${lightBorder};
        --border-subtle: ${lightBorder};
        --color-bg: ${lightBg};
        --color-card: ${lightSurface};
        --text-primary: ${lightText};
        --text-main: ${lightText};
        --foreground: ${lightText};
        --primary: ${accent};
        --brand-accent: ${accent};
        --accent-gold: ${accent};
        --btn-primary-text: ${btnTextColor};
      }
      .dark, [data-theme='dark'], html.dark, [data-theme='mastro-luxury'], html.mastro-luxury {
        --background: ${darkBg};
        --bg-page: ${darkBg};
        --bg-primary: ${darkBg};
        --card: ${darkSurface};
        --bg-surface: ${darkSurface};
        --border: ${darkBorder};
        --border-color: ${darkBorder};
        --border-subtle: ${darkBorder};
        --color-bg: ${darkBg};
        --color-card: ${darkSurface};
        --text-primary: ${darkText};
        --text-main: ${darkText};
        --foreground: ${darkText};
        --primary: ${accent};
        --brand-accent: ${accent};
        --accent-gold: ${accent};
        --btn-primary-text: ${btnTextColor};
      }
    `;
  }
}

export const settingsRepository: ISettingsRepository = new LocalStorageSettingsRepository();
