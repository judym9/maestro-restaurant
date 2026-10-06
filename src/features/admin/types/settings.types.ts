export interface BranchContactInfo {
  restaurantNameAr: string;
  restaurantNameEn: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  addressAr: string;
  addressEn: string;
  googleMapsUrl: string;
  workingHoursAr: string;
  workingHoursEn: string;
  cityAr?: string;
  cityEn?: string;
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
  openingTime: string;
  closingTime: string;
  emergencyNoticeAr: string;
  emergencyNoticeEn: string;
  showEmergencyBanner: boolean;
  weeklySchedule?: DaySchedule[];
  minOrderAmount?: number;
  deliveryFee?: number;
  estimatedDeliveryTimeAr?: string;
  estimatedDeliveryTimeEn?: string;
}

export interface ThemeTokens {
  primaryAccent: string;
  darkBg: string;
  darkSurface: string;
  darkBorder: string;
  lightBg: string;
  lightSurface: string;
  lightBorder: string;
  fontFamily?: string;
  secondaryAccent?: string;
  successColor?: string;
  dangerColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
}
