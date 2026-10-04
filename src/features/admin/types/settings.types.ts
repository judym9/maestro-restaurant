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
}

export interface OperatingSchedule {
  isOpen: boolean;
  autoToggle: boolean;
  openingTime: string;
  closingTime: string;
  emergencyNoticeAr: string;
  emergencyNoticeEn: string;
  showEmergencyBanner: boolean;
}

export interface ThemeTokens {
  primaryAccent: string;
  darkBg: string;
  darkSurface: string;
  darkBorder: string;
  lightBg: string;
  lightSurface: string;
  lightBorder: string;
}
