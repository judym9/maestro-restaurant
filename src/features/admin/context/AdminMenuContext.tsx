import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  AdminMealItem,
  CategoryItem,
  MealFormData,
  CategoryFormData,
  MenuStatusFilter,
  MenuTagFilter,
} from '../types/menu.types';
import { menuRepository, MENU_UPDATED_EVENT } from '../services/menuRepository';
import { menuService } from '../services/menuService';

interface AdminMenuContextType {
  dishes: AdminMealItem[];
  categories: CategoryItem[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: MenuStatusFilter;
  setStatusFilter: (filter: MenuStatusFilter) => void;
  tagFilter: MenuTagFilter;
  setTagFilter: (filter: MenuTagFilter) => void;
  filteredDishes: AdminMealItem[];
  // CRUD
  saveDish: (formData: MealFormData) => AdminMealItem;
  deleteDish: (id: string) => boolean;
  toggleDishAvailability: (id: string) => void;
  saveCategory: (formData: CategoryFormData) => CategoryItem;
  deleteCategory: (id: string) => boolean;
  // Stats
  totalDishesCount: number;
  availableDishesCount: number;
  categoriesCount: number;
}

const AdminMenuContext = createContext<AdminMenuContextType | undefined>(undefined);

export const AdminMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => menuRepository.getCategories());
  const [dishes, setDishes] = useState<AdminMealItem[]>(() => menuRepository.getDishes());

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<MenuStatusFilter>('all');
  const [tagFilter, setTagFilter] = useState<MenuTagFilter>('all');

  const refreshData = useCallback(() => {
    setCategories(menuRepository.getCategories());
    setDishes(menuRepository.getDishes());
  }, []);

  useEffect(() => {
    window.addEventListener(MENU_UPDATED_EVENT, refreshData);
    return () => window.removeEventListener(MENU_UPDATED_EVENT, refreshData);
  }, [refreshData]);

  // Compute item counts for categories
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      itemCount: dishes.filter((d) => d.categoryId === cat.id).length,
    }));
  }, [categories, dishes]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (selectedCategoryId !== 'all' && dish.categoryId !== selectedCategoryId) {
        return false;
      }

      // Status filter
      if (statusFilter === 'available' && !dish.isAvailable) return false;
      if (statusFilter === 'unavailable' && dish.isAvailable) return false;

      // Tag filter
      if (tagFilter === 'signature' && !dish.isSignature) return false;
      if (tagFilter === 'spicy' && !dish.isSpicy) return false;
      if (tagFilter === 'bestseller' && !dish.isBestseller) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchAr = dish.nameAr.toLowerCase().includes(q) || dish.descriptionAr.toLowerCase().includes(q);
        const matchEn = dish.nameEn.toLowerCase().includes(q) || dish.descriptionEn.toLowerCase().includes(q);
        if (!matchAr && !matchEn) return false;
      }

      return true;
    });
  }, [dishes, selectedCategoryId, statusFilter, tagFilter, searchQuery]);

  const saveDish = (formData: MealFormData): AdminMealItem => {
    const saved = menuRepository.saveDish(formData);
    menuService.saveDish(formData).catch(console.warn);
    refreshData();
    return saved;
  };

  const deleteDish = (id: string): boolean => {
    const success = menuRepository.deleteDish(id);
    if (success) {
      menuService.deleteDish(id).catch(console.warn);
      refreshData();
    }
    return success;
  };

  const toggleDishAvailability = (id: string) => {
    menuRepository.toggleDishAvailability(id);
    menuService.toggleDishAvailability(id).catch(console.warn);
    refreshData();
  };

  const saveCategory = (formData: CategoryFormData): CategoryItem => {
    const saved = menuRepository.saveCategory(formData);
    menuService.saveCategory(formData).catch(console.warn);
    refreshData();
    return saved;
  };

  const deleteCategory = (id: string): boolean => {
    const success = menuRepository.deleteCategory(id);
    if (success) {
      menuService.deleteCategory(id).catch(console.warn);
      if (selectedCategoryId === id) {
        setSelectedCategoryId('all');
      }
      refreshData();
    }
    return success;
  };

  const totalDishesCount = dishes.length;
  const availableDishesCount = dishes.filter((d) => d.isAvailable).length;
  const categoriesCount = categories.length;

  return (
    <AdminMenuContext.Provider
      value={{
        dishes,
        categories: categoriesWithCounts,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        tagFilter,
        setTagFilter,
        filteredDishes,
        saveDish,
        deleteDish,
        toggleDishAvailability,
        saveCategory,
        deleteCategory,
        totalDishesCount,
        availableDishesCount,
        categoriesCount,
      }}
    >
      {children}
    </AdminMenuContext.Provider>
  );
};

export const useAdminMenuContext = (): AdminMenuContextType => {
  const context = useContext(AdminMenuContext);
  if (!context) {
    throw new Error('useAdminMenuContext must be used within an AdminMenuProvider');
  }
  return context;
};
