import { MEALS_DATA } from '../../menu/mealsData';
import type { AdminCategoryItem, AdminDishItem, DishFormData, CategoryFormData } from '../types/menu.types';

export const MENU_UPDATED_EVENT = 'maestro:menu-updated';

const STORAGE_CATEGORIES_KEY = 'maestro_admin_categories';
const STORAGE_DISHES_KEY = 'maestro_admin_dishes';

export const INITIAL_CATEGORIES: AdminCategoryItem[] = [
  { id: 'cat-towers', nameAr: 'أبراج وتورتات المناسبات', nameEn: 'Celebration Towers', slug: 'towers', sortOrder: 1, isActive: true },
  { id: 'cat-shawarma', nameAr: 'شاورما مايسترو', nameEn: 'Maestro Shawarma', slug: 'shawarma', sortOrder: 2, isActive: true },
  { id: 'cat-broasted', nameAr: 'بروستد ومقرمش', nameEn: 'Broasted & Crispy', slug: 'broasted', sortOrder: 3, isActive: true },
  { id: 'cat-sandwiches', nameAr: 'ساندوتشات وسوبريم', nameEn: 'Subs & Supreme', slug: 'sandwiches', sortOrder: 4, isActive: true },
  { id: 'cat-drinks', nameAr: 'عصائر ومشروبات', nameEn: 'Fresh Drinks', slug: 'drinks', sortOrder: 5, isActive: true },
];

export const INITIAL_DISHES: AdminDishItem[] = MEALS_DATA.map((meal, index) => {
  let categoryId = 'cat-shawarma';
  if (meal.category === 'towers') categoryId = 'cat-towers';
  else if (meal.category === 'broasted') categoryId = 'cat-broasted';
  else if (meal.category === 'sandwiches') categoryId = 'cat-sandwiches';
  else if (meal.category === 'drinks') categoryId = 'cat-drinks';

  let badge = '';
  if (meal.isSignature) badge = 'Signature';
  else if (meal.isBestseller) badge = 'Best Seller';
  else if (meal.isSpicy) badge = 'Spicy';
  else if (meal.isNew) badge = 'New';

  return {
    id: meal.id || `dish-${index + 1}`,
    categoryId,
    imageKey: meal.imageKey,
    nameAr: meal.nameAr,
    nameEn: meal.nameEn,
    descriptionAr: meal.descriptionAr,
    descriptionEn: meal.descriptionEn,
    price: meal.price,
    originalPrice: meal.originalPrice,
    badge,
    isAvailable: true,
    preparationTime: '15-20 دقيقة',
    rating: meal.rating,
    reviewsCount: meal.reviewsCount,
    ingredientsAr: meal.ingredientsAr,
    ingredientsEn: meal.ingredientsEn,
    options: meal.options,
  };
});

class MenuService {
  private broadcastUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
    }
  }

  public getCategories(): AdminCategoryItem[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    try {
      const stored = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      this.saveCategoriesToStorage(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  private saveCategoriesToStorage(cats: AdminCategoryItem[]) {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
    this.broadcastUpdate();
  }

  public saveCategory(formData: CategoryFormData, id?: string): AdminCategoryItem {
    const cats = this.getCategories();
    let result: AdminCategoryItem;
    if (id) {
      const index = cats.findIndex((c) => c.id === id);
      if (index !== -1) {
        cats[index] = { ...cats[index], ...formData };
        result = cats[index];
      } else {
        result = { id, ...formData };
        cats.push(result);
      }
    } else {
      result = {
        id: `cat-${Date.now().toString(36)}`,
        ...formData,
      };
      cats.push(result);
    }
    this.saveCategoriesToStorage(cats);
    return result;
  }

  public deleteCategory(id: string): boolean {
    const cats = this.getCategories().filter((c) => c.id !== id);
    this.saveCategoriesToStorage(cats);
    return true;
  }

  public getDishes(categoryId?: string): AdminDishItem[] {
    if (typeof window === 'undefined') return INITIAL_DISHES;
    let list: AdminDishItem[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_DISHES_KEY);
      if (stored) {
        list = JSON.parse(stored);
      } else {
        list = INITIAL_DISHES;
        this.saveDishesToStorage(list);
      }
    } catch {
      list = INITIAL_DISHES;
    }

    if (categoryId && categoryId !== 'all') {
      return list.filter((d) => d.categoryId === categoryId);
    }
    return list;
  }

  private saveDishesToStorage(dishes: AdminDishItem[]) {
    localStorage.setItem(STORAGE_DISHES_KEY, JSON.stringify(dishes));
    this.broadcastUpdate();
  }

  public saveDish(formData: DishFormData, id?: string): AdminDishItem {
    const dishes = this.getDishes();
    let result: AdminDishItem;
    if (id) {
      const index = dishes.findIndex((d) => d.id === id);
      if (index !== -1) {
        dishes[index] = { ...dishes[index], ...formData };
        result = dishes[index];
      } else {
        result = { id, ...formData };
        dishes.push(result);
      }
    } else {
      result = {
        id: `dish-${Date.now().toString(36)}`,
        ...formData,
      };
      dishes.unshift(result);
    }
    this.saveDishesToStorage(dishes);
    return result;
  }

  public deleteDish(id: string): boolean {
    const dishes = this.getDishes().filter((d) => d.id !== id);
    this.saveDishesToStorage(dishes);
    return true;
  }

  public toggleDishAvailability(id: string, isAvailable?: boolean): AdminDishItem | null {
    const dishes = this.getDishes();
    const index = dishes.findIndex((d) => d.id === id);
    if (index === -1) return null;

    dishes[index].isAvailable = isAvailable !== undefined ? isAvailable : !dishes[index].isAvailable;
    this.saveDishesToStorage(dishes);
    return dishes[index];
  }

  public resetMenuToDefault() {
    this.saveCategoriesToStorage(INITIAL_CATEGORIES);
    this.saveDishesToStorage(INITIAL_DISHES);
  }
}

export const menuService = new MenuService();
