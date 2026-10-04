import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import { promotionsRepository, PROMOTIONS_UPDATED_EVENT } from './promotionsRepository';
import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';
import type { PromotionRow } from '../../../types/database.types';

export const PROMOTIONS_SERVICE_UPDATED_EVENT = 'maestro:promotions-service-updated';

const emitPromosUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROMOTIONS_SERVICE_UPDATED_EVENT));
    window.dispatchEvent(new CustomEvent(PROMOTIONS_UPDATED_EVENT));
  }
};

/**
 * Service for managing promotions with Supabase and local cache fallback
 */
export const promotionsService = {
  /**
   * Fetches all promotions
   */
  async fetchPromotions(): Promise<AdminPromoDeal[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: AdminPromoDeal[] = data.map((p: PromotionRow) => ({
            id: p.id,
            imageKey: p.image_url || 'shawarma-tower',
            badgeAr: p.badge || 'عرض خاص',
            badgeEn: p.badge || 'Special Deal',
            titleAr: p.title_ar,
            titleEn: p.title_en,
            descriptionAr: p.description_ar || '',
            descriptionEn: p.description_en || '',
            price: 210000,
            originalPrice: 280000,
            discountPercent: p.discount_percentage,
            remainingDays: 7,
            featured: false,
            isActive: p.is_active,
            sortOrder: p.sort_order,
          }));
          return mapped;
        }
      } catch (err) {
        console.warn('[promotionsService] Supabase fetch failed, using fallback:', err);
      }
    }
    return promotionsRepository.getPromotions();
  },

  /**
   * Saves or updates a promotion
   */
  async savePromotion(data: PromoFormData): Promise<AdminPromoDeal> {
    const localSaved = promotionsRepository.savePromotion(data);

    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, any> = {
          title_ar: data.titleAr,
          title_en: data.titleEn,
          description_ar: data.descriptionAr,
          description_en: data.descriptionEn,
          discount_percentage: data.discountPercent,
          badge: data.badgeAr || data.badgeEn,
          image_url: data.imageKey,
          is_active: data.isActive,
          sort_order: data.sortOrder,
        };

        if (data.id && data.id.includes('-') && data.id.length >= 32) {
          payload.id = data.id;
        }

        const { data: result, error } = await supabase
          .from('promotions')
          .upsert(payload)
          .select()
          .single();

        if (error) {
          console.warn('[promotionsService] Supabase savePromotion error:', error.message);
        } else if (result) {
          localSaved.id = result.id;
        }
      } catch (err) {
        console.warn('[promotionsService] Supabase savePromotion exception:', err);
      }
    }

    emitPromosUpdated();
    return localSaved;
  },

  /**
   * Deletes a promotion
   */
  async deletePromotion(id: string): Promise<boolean> {
    const localDeleted = promotionsRepository.deletePromotion(id);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('promotions')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('[promotionsService] Supabase deletePromotion error:', error.message);
        }
      } catch (err) {
        console.warn('[promotionsService] Supabase deletePromotion exception:', err);
      }
    }

    emitPromosUpdated();
    return localDeleted;
  },

  /**
   * Toggles promotion active status
   */
  async togglePromotionActive(id: string, isActive?: boolean): Promise<boolean> {
    const localResult = promotionsRepository.toggleActive(id);
    const newStatus = isActive ?? (localResult ? localResult.isActive : true);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('promotions')
          .update({ is_active: newStatus })
          .eq('id', id);

        if (error) {
          console.warn('[promotionsService] Supabase toggle active error:', error.message);
        }
      } catch (err) {
        console.warn('[promotionsService] Supabase toggle active exception:', err);
      }
    }

    emitPromosUpdated();
    return !!localResult;
  },
};
