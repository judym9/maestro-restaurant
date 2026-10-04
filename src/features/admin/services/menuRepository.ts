import type { AdminMealItem, CategoryItem, MealFormData, CategoryFormData } from '../types/menu.types';
import { MEALS_DATA } from '../../menu/mealsData';

export const MENU_UPDATED_EVENT = 'maestro:admin-menu-updated';

const STORAGE_CATEGORIES_KEY = 'maestro_admin_categories';
const STORAGE_DISHES_KEY = 'maestro_admin_dishes';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-towers', nameAr: 'أبراج وتورتات المناسبات', nameEn: 'Celebration Towers', slug: 'towers', icon: 'Sparkles', isActive: true, sortOrder: 1 },
  { id: 'cat-shawarma', nameAr: 'شاورما مايسترو الأصيلة', nameEn: 'Maestro Shawarma', slug: 'shawarma', icon: 'Flame', isActive: true, sortOrder: 2 },
  { id: 'cat-broasted', nameAr: 'بروستد كرسبي ذهبي', nameEn: 'Crispy Broasted', slug: 'broasted', icon: 'Utensils', isActive: true, sortOrder: 3 },
  { id: 'cat-sandwiches', nameAr: 'ساندوتشات وسوبريم', nameEn: 'Subs & Baguettes', slug: 'sandwiches', icon: 'Sandwich', isActive: true, sortOrder: 4 },
  { id: 'cat-drinks', nameAr: 'عصائر ومشروبات', name_en: 'Drinks & Toum', slug: 'drinks', icon: 'Coffee', isActive: true, sortOrder: 5 } as any,
];

// Helper to seed dishes from MEALS_DATA
export const INITIAL_DISHES: AdminMealItem[] = MEALS_DATA.map((meal) => {
  let categoryId = 'cat-shawarma';
  if (meal.category === 'towers') categoryId = 'cat-towers';
  else if (meal.category === 'broasted') categoryId = 'cat-broasted';
  else if (meal.category === 'sandwiches') categoryId = 'cat-sandwiches';
  else if (meal.category === 'drinks') categoryId = 'cat-drinks';

  return {
    id: meal.id,
    imageKey: meal.imageKey,
    categoryId,
    nameAr: meal.nameAr,
    nameEn: meal.nameEn,
    descriptionAr: meal.descriptionAr,
    descriptionEn: meal.descriptionEn,
    price: meal.price,
    originalPrice: meal.originalPrice,
    isAvailable: true,
    isSignature: Boolean(meal.isSignature),
    isBestseller: Boolean(meal.isBestseller),
    isSpicy: Boolean(meal.isSpicy),
    isNew: Boolean(meal.isNew),
    rating: meal.rating || 4.9,
    reviewsCount: meal.reviewsCount || 120,
    ingredientsAr: meal.ingredientsAr || ['دجاج بلدي طازج', 'بهارات شامية عريقة'],
    ingredientsEn: meal.ingredientsEn || ['Fresh Farm Chicken', 'Levantine Spices'],
    options: meal.options || [],
  };
});

export interface IMenuRepository {
  getCategories(): CategoryItem[];
  saveCategory(formData: CategoryFormData): CategoryItem;
  deleteCategory(id: string): boolean;
  getDishes(): AdminMealItem[];
  saveDish(formData: MealFormData): AdminMealItem;
  deleteDish(id: string): boolean;
  toggleDishAvailability(id: string, isAvailable?: boolean): AdminMealItem | null;
}

class LocalStorageMenuRepository implements IMenuRepository {
  public getCategories(): CategoryItem[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    try {
      const stored = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[menuRepository] Failed to read categories from localStorage:', e);
    }
    return INITIAL_CATEGORIES;
  }

  private saveCategoriesToStorage(categories: CategoryItem[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
        window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
      } catch (e) {
        console.warn('[menuRepository] Failed to write categories to localStorage:', e);
      }
    }
  }

  public saveCategory(formData: CategoryFormData): CategoryItem {
    const list = this.getCategories();
    let result: CategoryItem;

    if (formData.id) {
      // Edit
      const index = list.findIndex((c) => c.id === formData.id);
      if (index >= 0) {
        result = {
          ...list[index],
          ...formData,
        };
        list[index] = result;
      } else {
        result = {
          id: formData.id,
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          slug: formData.slug || `cat-${Date.now()}`,
          isActive: formData.isActive ?? true,
          sortOrder: formData.sortOrder ?? list.length + 1,
        };
        list.push(result);
      }
    } else {
      // New
      result = {
        id: `cat-${Date.now()}`,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        slug: formData.slug || `cat-${Date.now()}`,
        isActive: formData.isActive ?? true,
        sortOrder: formData.sortOrder ?? list.length + 1,
      };
      list.push(result);
    }

    this.saveCategoriesToStorage(list);
    return result;
  }

  public deleteCategory(id: string): boolean {
    const list = this.getCategories();
    const updated = list.filter((c) => c.id !== id);
    if (updated.length !== list.length) {
      this.saveCategoriesToStorage(updated);
      return true;
    }
    return false;
  }

  public getDishes(): AdminMealItem[] {
    if (typeof window === 'undefined') return INITIAL_DISHES;
    try {
      const stored = localStorage.getItem(STORAGE_DISHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[menuRepository] Failed to read dishes from localStorage:', e);
    }
    return INITIAL_DISHES;
  }

  private saveDishesToStorage(dishes: AdminMealItem[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_DISHES_KEY, JSON.stringify(dishes));
        window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
      } catch (e) {
        console.warn('[menuRepository] Failed to write dishes to localStorage:', e);
      }
    }
  }

  public saveDish(formData: MealFormData): AdminMealItem {
    const list = this.getDishes();
    let result: AdminMealItem;

    const ingredientsAr = formData.ingredientsArText
      ? formData.ingredientsArText.split(',').map((s) => s.trim()).filter(Boolean)
      : ['مكونات مايسترو الطازجة'];
    const ingredientsEn = formData.ingredientsEnText
      ? formData.ingredientsEnText.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Fresh Maestro Ingredients'];

    if (formData.id) {
      const index = list.findIndex((d) => d.id === formData.id);
      if (index >= 0) {
        result = {
          ...list[index],
          ...formData,
          id: formData.id,
          ingredientsAr,
          ingredientsEn,
        };
        list[index] = result;
      } else {
        result = {
          id: formData.id,
          ...formData,
          rating: 5.0,
          reviewsCount: 1,
          ingredientsAr,
          ingredientsEn,
        };
        list.push(result);
      }
    } else {
      result = {
        id: `dish-${Date.now()}`,
        ...formData,
        rating: 5.0,
        reviewsCount: 1,
        ingredientsAr,
        ingredientsEn,
      };
      list.push(result);
    }

    this.saveDishesToStorage(list);
    return result;
  }

  public deleteDish(id: string): boolean {
    const list = this.getDishes();
    const updated = list.filter((d) => d.id !== id);
    if (updated.length !== list.length) {
      this.saveDishesToStorage(updated);
      return true;
    }
    return false;
  }

  public toggleDishAvailability(id: string, isAvailable?: boolean): AdminMealItem | null {
    const list = this.getDishes();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const current = list[index];
    const newStatus = isAvailable !== undefined ? isAvailable : !current.isAvailable;
    const updated = { ...current, isAvailable: newStatus };
    list[index] = updated;

    this.saveDishesToStorage(list);
    return updated;
  }
}

export const menuRepository: IMenuRepository = new LocalStorageMenuRepository();
