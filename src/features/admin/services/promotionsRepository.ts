import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';
import { PROMOS_DATA } from '../../promotions/promosData';

export const PROMOTIONS_UPDATED_EVENT = 'maestro:admin-promotions-updated';
const STORAGE_PROMOTIONS_KEY = 'maestro_admin_promos';

export const INITIAL_PROMOTIONS: AdminPromoDeal[] = PROMOS_DATA.map((promo, idx) => ({
  id: promo.id,
  imageKey: promo.imageKey,
  badgeAr: promo.badgeAr,
  badgeEn: promo.badgeEn,
  titleAr: promo.titleAr,
  titleEn: promo.titleEn,
  descriptionAr: promo.descriptionAr,
  descriptionEn: promo.descriptionEn,
  price: promo.price,
  originalPrice: promo.originalPrice,
  discountPercent: promo.discountPercent,
  remainingDays: promo.remainingDays,
  expirationDate: promo.expirationDate,
  featured: promo.featured ?? idx === 0,
  isActive: promo.isActive ?? true,
  sortOrder: promo.sortOrder ?? idx + 1,
}));

export interface IPromotionsRepository {
  getPromotions(): AdminPromoDeal[];
  savePromotion(formData: PromoFormData): AdminPromoDeal;
  deletePromotion(id: string): boolean;
  toggleActive(id: string): AdminPromoDeal | null;
}

class LocalStoragePromotionsRepository implements IPromotionsRepository {
  public getPromotions(): AdminPromoDeal[] {
    if (typeof window === 'undefined') return INITIAL_PROMOTIONS;
    try {
      const stored = localStorage.getItem(STORAGE_PROMOTIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[promotionsRepository] Failed reading promos from localStorage:', e);
    }
    return INITIAL_PROMOTIONS;
  }

  private saveToStorage(promos: AdminPromoDeal[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PROMOTIONS_KEY, JSON.stringify(promos));
        window.dispatchEvent(new CustomEvent(PROMOTIONS_UPDATED_EVENT));
      } catch (e) {
        console.warn('[promotionsRepository] Failed writing promos to localStorage:', e);
      }
    }
  }

  public savePromotion(formData: PromoFormData): AdminPromoDeal {
    const list = this.getPromotions();
    let result: AdminPromoDeal;

    if (formData.id) {
      const idx = list.findIndex((p) => p.id === formData.id);
      if (idx >= 0) {
        result = {
          ...list[idx],
          ...formData,
          id: formData.id,
        };
        list[idx] = result;
      } else {
        result = {
          id: formData.id,
          ...formData,
        };
        list.push(result);
      }
    } else {
      result = {
        id: `promo-${Date.now()}`,
        ...formData,
      };
      list.push(result);
    }

    this.saveToStorage(list);
    return result;
  }

  public deletePromotion(id: string): boolean {
    const list = this.getPromotions();
    const updated = list.filter((p) => p.id !== id);
    if (updated.length !== list.length) {
      this.saveToStorage(updated);
      return true;
    }
    return false;
  }

  public toggleActive(id: string): AdminPromoDeal | null {
    const list = this.getPromotions();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updated = { ...current, isActive: !current.isActive };
    list[idx] = updated;

    this.saveToStorage(list);
    return updated;
  }
}

export const promotionsRepository: IPromotionsRepository = new LocalStoragePromotionsRepository();
