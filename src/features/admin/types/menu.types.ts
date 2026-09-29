import type { MealOption } from '../../menu/mealsData';

export interface AdminCategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  dishCount?: number;
}

export interface AdminDishItem {
  id: string;
  categoryId: string;
  imageKey: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  isAvailable: boolean;
  preparationTime?: string;
  rating?: number;
  reviewsCount?: number;
  ingredientsAr?: string[];
  ingredientsEn?: string[];
  options?: MealOption[];
}

export interface DishFormData {
  categoryId: string;
  imageKey: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  isAvailable: boolean;
  preparationTime?: string;
}

export interface CategoryFormData {
  nameAr: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}
