import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import { MEALS_DATA } from '../mealsData';
import type { MealItem, MealCategory } from '../mealsData';
import { PROMOS_DATA } from '../../promotions/promosData';
import type { PromoDeal } from '../../promotions/promosData';

export interface MealsServiceResponse<T> {
  data: T;
  error: Error | null;
  fromFallback: boolean;
}

/**
 * Maps Supabase meal + category joined row to domain MealItem
 */
const mapDbMealToDomain = (row: any, fallbackMap: Map<string, MealItem>): MealItem => {
  const categorySlug = (row.categories?.slug || 'shawarma') as MealCategory;
  const existingLocal = fallbackMap.get(row.name_en) || fallbackMap.get(row.image_url);

  return {
    id: row.id,
    imageKey: row.image_url || existingLocal?.imageKey || 'shawarma-spit',
    category: categorySlug,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    descriptionAr: row.description_ar || existingLocal?.descriptionAr || '',
    descriptionEn: row.description_en || existingLocal?.descriptionEn || '',
    price: Number(row.price),
    originalPrice: existingLocal?.originalPrice,
    isSignature: existingLocal?.isSignature ?? false,
    isBestseller: existingLocal?.isBestseller ?? false,
    isSpicy: existingLocal?.isSpicy ?? false,
    rating: existingLocal?.rating || 4.9,
    reviewsCount: existingLocal?.reviewsCount || 100,
    ingredientsAr: existingLocal?.ingredientsAr || ['مكونات مايسترو الطازجة', 'بهارات شامية أصيلة'],
    ingredientsEn: existingLocal?.ingredientsEn || ['Fresh Maestro Ingredients', 'Levantine Spices'],
    options: existingLocal?.options || [],
  };
};

/**
 * Fetches all available meals from Supabase with joined category info
 */
export async function getMeals(): Promise<MealsServiceResponse<MealItem[]>> {
  if (!isSupabaseConfigured) {
    return { data: MEALS_DATA, error: null, fromFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*, categories(*)')
      .eq('is_available', true)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('[mealsService] Supabase fetch error, using local fallback:', error.message);
      return { data: MEALS_DATA, error: error ? new Error(error.message) : null, fromFallback: true };
    }

    const fallbackMap = new Map<string, MealItem>();
    MEALS_DATA.forEach((m) => {
      fallbackMap.set(m.nameEn, m);
      fallbackMap.set(m.imageKey, m);
    });

    const mapped = data.map((row) => mapDbMealToDomain(row, fallbackMap));
    return { data: mapped, error: null, fromFallback: false };
  } catch (err: any) {
    console.warn('[mealsService] Exception querying Supabase, falling back to local dataset:', err);
    return { data: MEALS_DATA, error: err, fromFallback: true };
  }
}

/**
 * Fetches active promoted meals for promotions section
 */
export async function getPromotions(): Promise<MealsServiceResponse<PromoDeal[]>> {
  if (!isSupabaseConfigured) {
    return { data: PROMOS_DATA, error: null, fromFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*, categories(*)')
      .eq('is_promoted', true)
      .eq('is_available', true)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.warn('[mealsService] Supabase promo fetch error, using local fallback:', error.message);
      return { data: PROMOS_DATA, error: error ? new Error(error.message) : null, fromFallback: true };
    }

    // Map DB promotions
    const promos: PromoDeal[] = data.map((row, idx) => {
      const price = Number(row.price);
      const originalPrice = Math.round(price * 1.25);
      return {
        id: row.id,
        imageKey: row.image_url || 'shawarma-tower',
        badgeAr: 'عرض خاص',
        badgeEn: 'Special Offer',
        titleAr: row.name_ar,
        titleEn: row.name_en,
        descriptionAr: row.description_ar || '',
        descriptionEn: row.description_en || '',
        price: price,
        originalPrice: originalPrice,
        discountPercent: 20,
        remainingDays: 3 + (idx % 4),
        featured: idx === 0,
      };
    });

    return { data: promos, error: null, fromFallback: false };
  } catch (err: any) {
    console.warn('[mealsService] Exception querying promotions, falling back to local dataset:', err);
    return { data: PROMOS_DATA, error: err, fromFallback: true };
  }
}
