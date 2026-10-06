import type { BranchContactInfo, OperatingSchedule, ThemeTokens } from '../types/settings.types';

export const SETTINGS_UPDATED_EVENT = 'maestro:admin-settings-updated';
export const THEME_UPDATED_EVENT = 'maestro:admin-theme-updated';

const STORAGE_CONTACT_KEY = 'maestro_admin_contact_info';
const STORAGE_SCHEDULE_KEY = 'maestro_admin_operating_schedule';
const STORAGE_THEME_KEY = 'maestro_admin_theme_tokens';

export const DEFAULT_CONTACT_INFO: BranchContactInfo = {
  restaurantNameAr: 'مايسترو النبك',
  restaurantNameEn: 'Maestro Al-Nabek',
  phonePrimary: '0969 697 587',
  phoneSecondary: '011 722 0000',
  whatsappNumber: '963969697587',
  addressAr: 'شارع الأمين، النبك، ريف دمشق، سوريا',
  addressEn: 'Amin Street, Al-Nabek, Rural Damascus, Syria',
  googleMapsUrl: 'https://maps.google.com/?q=Amin+Street,+Al-Nabek,+Syria',
  workingHoursAr: 'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل',
  workingHoursEn: 'Daily: 12:00 PM - 02:00 AM',
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
  openingTime: '12:00',
  closingTime: '02:00',
  emergencyNoticeAr: 'نستقبلكم بكل حب وسرور يومياً في فرعنا بالنبك وخدمة التوصيل السريع متاحة!',
  emergencyNoticeEn: 'Welcoming you with warmth daily in Al-Nabek with fast delivery available!',
  showEmergencyBanner: false,
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  minOrderAmount: 50000,
  deliveryFee: 15000,
  estimatedDeliveryTimeAr: '30 - 45 دقيقة',
  estimatedDeliveryTimeEn: '30 - 45 mins',
};

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  primaryAccent: '#D97706', // Customer light theme accent gold
  darkBg: '#0B0F17', // Customer dark mode bg
  darkSurface: '#1A1D24', // Customer dark mode surface
  darkBorder: 'rgba(255, 255, 255, 0.1)',
  lightBg: '#FAF7F2', // Customer light mode bg-primary
  lightSurface: '#FFFFFF', // Customer light mode card surface
  lightBorder: 'rgba(226, 232, 240, 0.8)', // Customer light mode subtle border
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

    if (tokens.primaryAccent) {
      root.style.setProperty('--color-primary', tokens.primaryAccent);
      root.style.setProperty('--gold-500', tokens.primaryAccent);
      root.style.setProperty('--primary', tokens.primaryAccent);
      root.style.setProperty('--accent-gold', tokens.primaryAccent);
    }
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

    dynamicStyle.textContent = `
      :root, [data-theme='light'], html.light {
        --background: ${tokens.lightBg || '#FAF7F2'};
        --bg-page: ${tokens.lightBg || '#FAF7F2'};
        --card: ${tokens.lightSurface || '#FFFFFF'};
        --bg-surface: ${tokens.lightSurface || '#FFFFFF'};
        --border: ${tokens.lightBorder || 'rgba(226, 232, 240, 0.8)'};
        --color-bg: ${tokens.lightBg || '#FAF7F2'};
        --color-card: ${tokens.lightSurface || '#FFFFFF'};
        --border-color: ${tokens.lightBorder || 'rgba(226, 232, 240, 0.8)'};
        --text-primary: #0F172A;
        --text-secondary: #334155;
        --text-muted: #64748B;
        --primary: ${tokens.primaryAccent || '#D97706'};
      }
      .dark, [data-theme='dark'], html.dark {
        --background: ${tokens.darkBg || '#0B0F17'};
        --bg-page: ${tokens.darkBg || '#0B0F17'};
        --card: ${tokens.darkSurface || '#1A1D24'};
        --bg-surface: ${tokens.darkSurface || '#1A1D24'};
        --border: ${tokens.darkBorder || 'rgba(255, 255, 255, 0.1)'};
        --color-bg: ${tokens.darkBg || '#0B0F17'};
        --color-card: ${tokens.darkSurface || '#1A1D24'};
        --border-color: ${tokens.darkBorder || 'rgba(255, 255, 255, 0.1)'};
        --text-primary: #F9FAFB;
        --text-secondary: #CBD5E1;
        --text-muted: #9CA3AF;
        --primary: ${tokens.primaryAccent || '#F59E0B'};
      }
    `;
  }
}

export const settingsRepository: ISettingsRepository = new LocalStorageSettingsRepository();
