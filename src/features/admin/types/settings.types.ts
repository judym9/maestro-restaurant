export interface BranchContactInfo {
  restaurantNameAr: string;
  restaurantNameEn: string;
  taglineAr?: string;
  taglineEn?: string;
  aboutStoryAr?: string;
  aboutStoryEn?: string;
  logoUrl?: string;
  coverBannerUrl?: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  emailContact?: string;
  addressAr: string;
  addressEn: string;
  googleMapsUrl: string;
  workingHoursAr: string;
  workingHoursEn: string;
  cityAr?: string;
  cityEn?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export interface DaySchedule {
  dayId: string;
  nameAr: string;
  nameEn: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface OperatingSchedule {
  isOpen: boolean;
  autoToggle: boolean;
  is24HourFormat?: boolean;
  openingTime: string;
  closingTime: string;
  emergencyNoticeAr: string;
  emergencyNoticeEn: string;
  showEmergencyBanner: boolean;
  weeklySchedule?: DaySchedule[];
  minOrderAmount?: number;
  deliveryFee?: number;
  taxRatePercent?: number;
  estimatedDeliveryTimeAr?: string;
  estimatedDeliveryTimeEn?: string;
}

export interface ThemeTokens {
  presetId?: string;
  primaryAccent: string;
  darkBg: string;
  darkSurface: string;
  darkBorder: string;
  lightBg: string;
  lightSurface: string;
  lightBorder: string;
  textPrimary?: string;
  darkText?: string;
  lightText?: string;
  fontFamily?: string;
  secondaryAccent?: string;
  successColor?: string;
  dangerColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

