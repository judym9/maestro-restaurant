export interface BusinessInfo {
  restaurantNameAr: string;
  restaurantNameEn: string;
  phone: string;
  whatsapp: string;
  addressAr: string;
  addressEn: string;
  mapsEmbedUrl: string;
  deliveryTimeEstimateAr: string;
  deliveryTimeEstimateEn: string;
  deliveryFee: number;
  minimumOrder: number;
}

export interface OperatingStatus {
  isOpen: boolean;
  bannerNoticeAr: string;
  bannerNoticeEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
}

export interface ThemeTokenConfig {
  primaryAccent: string;
  darkBg: string;
  darkSurface: string;
  lightBg: string;
  lightSurface: string;
  darkBorder?: string;
  lightBorder?: string;
}

export interface ThemePresetOption {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  tokens: ThemeTokenConfig;
}
