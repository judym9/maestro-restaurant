import { supabase, isSupabaseConfigured } from '../../../lib/supabase/client';
import { menuRepository, MENU_UPDATED_EVENT } from './menuRepository';
import type { AdminMealItem, CategoryItem, MealFormData, CategoryFormData } from '../types/menu.types';
import type { CategoryRow, MenuItemRow } from '../../../types/database.types';

export const MENU_SERVICE_UPDATED_EVENT = 'maestro:menu-service-updated';

const emitMenuUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MENU_SERVICE_UPDATED_EVENT));
    window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
  }
};

/**
 * Service for managing categories and menu items with Supabase and local cache fallback
 */
export const menuService = {
  /**
   * Fetches all categories
   */
  async fetchCategories(): Promise<CategoryItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: CategoryItem[] = data.map((c: CategoryRow) => ({
            id: c.id,
            nameAr: c.name_ar,
            nameEn: c.name_en,
            slug: c.slug || `cat-${c.id}`,
            sortOrder: c.sort_order ?? 0,
            isActive: c.is_active ?? true,
          }));
          return mapped;
        }
      } catch (err) {
        console.warn('[menuService] Supabase fetchCategories failed, using fallback:', err);
      }
    }
    return menuRepository.getCategories();
  },

  /**
   * Saves or updates a category
   */
  async saveCategory(data: CategoryFormData): Promise<CategoryItem> {
    const localSaved = menuRepository.saveCategory(data);

    if (isSupabaseConfigured) {
      try {
        const payload: Partial<CategoryRow> = {
          name_ar: data.nameAr,
          name_en: data.nameEn,
          slug: data.slug,
          sort_order: data.sortOrder,
          is_active: data.isActive,
        };

        if (data.id && data.id.includes('-') && data.id.length >= 32) {
          payload.id = data.id;
        }

        const { data: result, error } = await supabase
          .from('categories')
          .upsert(payload as any)
          .select()
          .single();

        if (error) {
          console.warn('[menuService] Supabase saveCategory error:', error.message);
        } else if (result) {
          localSaved.id = result.id;
        }
      } catch (err) {
        console.warn('[menuService] Supabase saveCategory exception:', err);
      }
    }

    emitMenuUpdated();
    return localSaved;
  },

  /**
   * Deletes a category
   */
  async deleteCategory(id: string): Promise<boolean> {
    const localDeleted = menuRepository.deleteCategory(id);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('[menuService] Supabase deleteCategory error:', error.message);
        }
      } catch (err) {
        console.warn('[menuService] Supabase deleteCategory exception:', err);
      }
    }

    emitMenuUpdated();
    return localDeleted;
  },

  /**
   * Fetches all menu items
   */
  async fetchMenuItems(): Promise<AdminMealItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: AdminMealItem[] = data.map((item: MenuItemRow) => ({
            id: item.id,
            imageKey: item.image_url || 'shawarma-tower',
            categoryId: item.category_id || '',
            nameAr: item.name_ar || item.title_ar || '',
            nameEn: item.name_en || item.title_en || '',
            descriptionAr: item.description_ar || '',
            descriptionEn: item.description_en || '',
            price: Number(item.price) || 0,
            originalPrice: undefined,
            isAvailable: item.is_available ?? true,
            isSignature: item.badge === 'Signature',
            isBestseller: item.badge === 'Best Seller' || item.badge === 'Popular',
            isSpicy: false,
            isNew: false,
            rating: 4.9,
            reviewsCount: 120,
            ingredientsAr: ['مكونات مايسترو الفاخرة'],
            ingredientsEn: ['Fresh Maestro Ingredients'],
            options: [],
          }));
          return mapped;
        }
      } catch (err) {
        console.warn('[menuService] Supabase fetchMenuItems failed, using fallback:', err);
      }
    }
    return menuRepository.getDishes();
  },

  /**
   * Saves or updates a menu item
   */
  async saveMenuItem(data: MealFormData): Promise<AdminMealItem> {
    const localSaved = menuRepository.saveDish(data);

    if (isSupabaseConfigured) {
      try {
        let badgeValue: string | null = null;
        if (data.isSignature) badgeValue = 'Signature';
        else if (data.isBestseller) badgeValue = 'Best Seller';

        const payload: Record<string, any> = {
          name_ar: data.nameAr,
          name_en: data.nameEn,
          title_ar: data.nameAr,
          title_en: data.nameEn,
          description_ar: data.descriptionAr,
          description_en: data.descriptionEn,
          price: Math.round(Number(data.price)),
          image_url: data.imageKey,
          category_id: (data.categoryId && data.categoryId.length >= 32) ? data.categoryId : null,
          is_available: data.isAvailable,
          badge: badgeValue,
          prep_time_minutes: 20,
        };

        if (data.id && data.id.includes('-') && data.id.length >= 32) {
          payload.id = data.id;
        }

        const { data: result, error } = await supabase
          .from('menu_items')
          .upsert(payload)
          .select()
          .single();

        if (error) {
          console.warn('[menuService] Supabase saveMenuItem error:', error.message);
        } else if (result) {
          localSaved.id = result.id;
        }
      } catch (err) {
        console.warn('[menuService] Supabase saveMenuItem exception:', err);
      }
    }

    emitMenuUpdated();
    return localSaved;
  },

  /**
   * Deletes a menu item
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    const localDeleted = menuRepository.deleteDish(id);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('[menuService] Supabase deleteMenuItem error:', error.message);
        }
      } catch (err) {
        console.warn('[menuService] Supabase deleteMenuItem exception:', err);
      }
    }

    emitMenuUpdated();
    return localDeleted;
  },

  /**
   * Toggles menu item availability
   */
  async toggleMenuItemAvailability(id: string, isAvailable?: boolean): Promise<boolean> {
    const localResult = menuRepository.toggleDishAvailability(id, isAvailable);
    const newStatus = isAvailable ?? (localResult ? localResult.isAvailable : true);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .update({ is_available: newStatus })
          .eq('id', id);

        if (error) {
          console.warn('[menuService] Supabase toggle availability error:', error.message);
        }
      } catch (err) {
        console.warn('[menuService] Supabase toggle availability exception:', err);
      }
    }

    emitMenuUpdated();
    return !!localResult;
  },

  // Aliases for seamless naming compatibility
  saveDish(data: MealFormData): Promise<AdminMealItem> {
    return this.saveMenuItem(data);
  },
  deleteDish(id: string): Promise<boolean> {
    return this.deleteMenuItem(id);
  },
  toggleDishAvailability(id: string, isAvailable?: boolean): Promise<boolean> {
    return this.toggleMenuItemAvailability(id, isAvailable);
  },
};
