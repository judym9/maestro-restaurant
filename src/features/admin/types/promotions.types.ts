export interface AdminPromoDeal {
  id: string;
  imageKey: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  remainingDays: number;
  expirationDate?: string;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface PromoFormData {
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  badgeEn: string;
  imageKey: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  remainingDays: number;
  expirationDate?: string;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
}
