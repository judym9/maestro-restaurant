import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AdminDishItem, AdminCategoryItem, DishFormData, CategoryFormData } from '../types/menu.types';
import { menuService, MENU_UPDATED_EVENT } from '../services/menuService';

interface AdminMenuContextType {
  dishes: AdminDishItem[];
  categories: AdminCategoryItem[];
  selectedCategoryId: string;
  searchQuery: string;
  availabilityFilter: 'all' | 'available' | 'unavailable';
  isLoading: boolean;
  setSelectedCategoryId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setAvailabilityFilter: (filter: 'all' | 'available' | 'unavailable') => void;
  saveDish: (data: DishFormData, id?: string) => Promise<AdminDishItem>;
  deleteDish: (id: string) => Promise<boolean>;
  toggleAvailability: (id: string) => Promise<void>;
  saveCategory: (data: CategoryFormData, id?: string) => Promise<AdminCategoryItem>;
  deleteCategory: (id: string) => Promise<boolean>;
  resetToDefault: () => void;
  filteredDishes: AdminDishItem[];
}

const AdminMenuContext = createContext<AdminMenuContextType | undefined>(undefined);

export const AdminMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<AdminDishItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const cats = menuService.getCategories();
      const items = menuService.getDishes();
      setCategories(cats);
      setDishes(items);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener(MENU_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MENU_UPDATED_EVENT, handleUpdate);
  }, [loadData]);

  const saveDish = async (data: DishFormData, id?: string) => {
    const saved = menuService.saveDish(data, id);
    loadData();
    return saved;
  };

  const deleteDish = async (id: string) => {
    const success = menuService.deleteDish(id);
    loadData();
    return success;
  };

  const toggleAvailability = async (id: string) => {
    menuService.toggleDishAvailability(id);
    loadData();
  };

  const saveCategory = async (data: CategoryFormData, id?: string) => {
    const saved = menuService.saveCategory(data, id);
    loadData();
    return saved;
  };

  const deleteCategory = async (id: string) => {
    const success = menuService.deleteCategory(id);
    if (selectedCategoryId === id) {
      setSelectedCategoryId('all');
    }
    loadData();
    return success;
  };

  const resetToDefault = () => {
    menuService.resetMenuToDefault();
    loadData();
  };

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (selectedCategoryId !== 'all' && dish.categoryId !== selectedCategoryId) {
        return false;
      }
      // Availability filter
      if (availabilityFilter === 'available' && !dish.isAvailable) return false;
      if (availabilityFilter === 'unavailable' && dish.isAvailable) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchAr = dish.nameAr.toLowerCase().includes(q);
        const matchEn = dish.nameEn.toLowerCase().includes(q);
        const matchDescAr = dish.descriptionAr.toLowerCase().includes(q);
        const matchDescEn = dish.descriptionEn.toLowerCase().includes(q);
        return matchAr || matchEn || matchDescAr || matchDescEn;
      }
      return true;
    });
  }, [dishes, selectedCategoryId, availabilityFilter, searchQuery]);

  return (
    <AdminMenuContext.Provider
      value={{
        dishes,
        categories,
        selectedCategoryId,
        searchQuery,
        availabilityFilter,
        isLoading,
        setSelectedCategoryId,
        setSearchQuery,
        setAvailabilityFilter,
        saveDish,
        deleteDish,
        toggleAvailability,
        saveCategory,
        deleteCategory,
        resetToDefault,
        filteredDishes,
      }}
    >
      {children}
    </AdminMenuContext.Provider>
  );
};

export const useAdminMenu = () => {
  const ctx = useContext(AdminMenuContext);
  if (!ctx) {
    throw new Error('useAdminMenu must be used within an AdminMenuProvider');
  }
  return ctx;
};
