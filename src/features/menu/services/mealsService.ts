import { MEALS_DATA } from '../mealsData';
import type { MealItem } from '../mealsData';
import { PROMOS_DATA } from '../../promotions/promosData';
import type { PromoDeal } from '../../promotions/promosData';
import type { CategoryRow } from '../../../types/database.types';
import { menuService } from '../../admin/services/menuService';
import { promotionsService } from '../../admin/services/promotionsService';

export interface MealsServiceResponse<T> {
  data: T;
  error: Error | null;
  fromFallback: boolean;
}

const DEFAULT_CATEGORIES: CategoryRow[] = [
  { id: 'cat-towers', name_ar: 'أبراج وتورتات المناسبات', name_en: 'Celebration Towers', slug: 'towers', sort_order: 1, is_active: true, created_at: '' },
  { id: 'cat-shawarma', name_ar: 'شاورما مايسترو', name_en: 'Maestro Shawarma', slug: 'shawarma', sort_order: 2, is_active: true, created_at: '' },
  { id: 'cat-broasted', name_ar: 'بروستد ومقرمش', name_en: 'Broasted & Crispy', slug: 'broasted', sort_order: 3, is_active: true, created_at: '' },
  { id: 'cat-sandwiches', name_ar: 'ساندوتشات وسوبريم', name_en: 'Subs & Supreme', slug: 'sandwiches', sort_order: 4, is_active: true, created_at: '' },
  { id: 'cat-drinks', name_ar: 'عصائر ومشروبات', name_en: 'Fresh Drinks', slug: 'drinks', sort_order: 5, is_active: true, created_at: '' },
];

/**
 * Fetches all active categories dynamically from Supabase
 */
export async function getActiveMenuCategories(): Promise<CategoryRow[]> {
  try {
    const cats = await menuService.fetchCategories();
    const activeCats = cats.filter((c) => c.isActive);
    if (activeCats && activeCats.length > 0) {
      return activeCats.map((c) => ({
        id: c.id,
        name_ar: c.nameAr,
        name_en: c.nameEn,
        slug: c.slug,
        sort_order: c.sortOrder,
        is_active: c.isActive,
        created_at: '',
      }));
    }
  } catch (err) {
    console.warn('[mealsService] Error fetching categories, using fallback:', err);
  }

  return DEFAULT_CATEGORIES;
}

/**
 * Fetches all available meals dynamically from Supabase
 */
export async function getMeals(): Promise<MealsServiceResponse<MealItem[]>> {
  const fallbackMap = new Map<string, MealItem>();
  MEALS_DATA.forEach((m) => {
    fallbackMap.set(m.nameEn, m);
    fallbackMap.set(m.imageKey, m);
  });

  const categories = await getActiveMenuCategories();
  const categoriesMap = new Map<string, string>();
  categories.forEach((c) => categoriesMap.set(c.id, c.slug));

  try {
    const dishes = await menuService.fetchMenuItems();
    const availableDishes = dishes.filter((d) => d.isAvailable);

    if (availableDishes && availableDishes.length > 0) {
      const mapped: MealItem[] = availableDishes.map((dish) => {
        const categorySlug = categoriesMap.get(dish.categoryId) || 'shawarma';
        const existingLocal = fallbackMap.get(dish.nameEn) || fallbackMap.get(dish.imageKey);

        return {
          id: dish.id,
          imageKey: dish.imageKey,
          category: categorySlug as any,
          nameAr: dish.nameAr,
          nameEn: dish.nameEn,
          descriptionAr: dish.descriptionAr,
          descriptionEn: dish.descriptionEn,
          price: dish.price,
          originalPrice: dish.originalPrice,
          isSignature: Boolean(dish.isSignature || existingLocal?.isSignature),
          isBestseller: Boolean(dish.isBestseller || existingLocal?.isBestseller),
          isSpicy: Boolean(dish.isSpicy || existingLocal?.isSpicy),
          isNew: Boolean(dish.isNew || existingLocal?.isNew),
          rating: dish.rating || existingLocal?.rating || 4.9,
          reviewsCount: dish.reviewsCount || existingLocal?.reviewsCount || 120,
          ingredientsAr: dish.ingredientsAr || existingLocal?.ingredientsAr || ['مكونات مايسترو الطازجة', 'بهارات شامية أصيلة'],
          ingredientsEn: dish.ingredientsEn || existingLocal?.ingredientsEn || ['Fresh Maestro Ingredients', 'Levantine Spices'],
          options: dish.options || existingLocal?.options || [],
        };
      });
      return { data: mapped, error: null, fromFallback: false };
    }
  } catch (err) {
    console.warn('[mealsService] Error fetching dishes, using fallback:', err);
  }

  return { data: MEALS_DATA, error: null, fromFallback: true };
}

/**
 * Fetches active promoted meals dynamically from Supabase
 */
export async function getPromotions(): Promise<MealsServiceResponse<PromoDeal[]>> {
  try {
    const deals = await promotionsService.fetchPromotions();
    const active = deals.filter((p) => p.isActive);
    if (active.length > 0) {
      return { data: active, error: null, fromFallback: false };
    }
  } catch (err) {
    console.warn('[mealsService] Error fetching promotions, using fallback:', err);
  }

  return { data: PROMOS_DATA, error: null, fromFallback: false };
}


