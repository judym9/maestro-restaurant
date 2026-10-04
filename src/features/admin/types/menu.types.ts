export interface MealOption {
  id: string;
  nameAr: string;
  nameEn: string;
  priceDiff: number;
}

export interface AdminMealItem {
  id: string;
  imageKey: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  isSignature: boolean;
  isBestseller: boolean;
  isSpicy: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount: number;
  ingredientsAr: string[];
  ingredientsEn: string[];
  options: MealOption[];
}

export interface CategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  itemCount?: number;
}

export interface MealFormData {
  id?: string;
  imageKey: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  isAvailable: boolean;
  isSignature: boolean;
  isBestseller: boolean;
  isSpicy: boolean;
  isNew: boolean;
  ingredientsArText: string;
  ingredientsEnText: string;
  options: MealOption[];
}

export interface CategoryFormData {
  id?: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export type MenuStatusFilter = 'all' | 'available' | 'unavailable';
export type MenuTagFilter = 'all' | 'signature' | 'spicy' | 'bestseller';
