import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { menuService } from '../services/menuService';
import { promotionsService } from '../services/promotionsService';
import { settingsService, DEFAULT_RESTAURANT_SETTINGS, type AdminRestaurantSettings } from '../services/settingsService';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import type { AdminMealItem, CategoryItem, MealFormData, CategoryFormData } from '../types/menu.types';
import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';

export interface AdminDataContextType {
  categories: CategoryItem[];
  dishes: AdminMealItem[];
  promotions: AdminPromoDeal[];
  restaurantSettings: AdminRestaurantSettings;
  isLoading: boolean;
  error: string | null;
  saveCategory: (data: CategoryFormData) => Promise<CategoryItem>;
  deleteCategory: (id: string) => Promise<boolean>;
  saveDish: (data: MealFormData) => Promise<AdminMealItem>;
  deleteDish: (id: string) => Promise<boolean>;
  toggleDishAvailability: (id: string, isAvailable?: boolean) => Promise<boolean>;
  savePromotion: (data: PromoFormData) => Promise<AdminPromoDeal>;
  deletePromotion: (id: string) => Promise<boolean>;
  togglePromotionActive: (id: string, isActive?: boolean) => Promise<boolean>;
  updateRestaurantSettings: (partial: Partial<AdminRestaurantSettings>) => Promise<AdminRestaurantSettings>;
  toggleKitchenStatus: (isOpen: boolean) => Promise<AdminRestaurantSettings>;
  refreshAll: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [dishes, setDishes] = useState<AdminMealItem[]>([]);
  const [promotions, setPromotions] = useState<AdminPromoDeal[]>([]);
  const [restaurantSettings, setRestaurantSettings] = useState<AdminRestaurantSettings>(DEFAULT_RESTAURANT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await menuService.fetchCategories();
      setCategories(cats);
    } catch (err: any) {
      console.warn('[AdminDataContext] fetchCategories error:', err);
    }
  }, []);

  const fetchDishes = useCallback(async () => {
    try {
      const items = await menuService.fetchMenuItems();
      setDishes(items);
    } catch (err: any) {
      console.warn('[AdminDataContext] fetchDishes error:', err);
    }
  }, []);

  const fetchPromotions = useCallback(async () => {
    try {
      const promos = await promotionsService.fetchPromotions();
      setPromotions(promos);
    } catch (err: any) {
      console.warn('[AdminDataContext] fetchPromotions error:', err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await settingsService.fetchSettings();
      setRestaurantSettings(settings);
    } catch (err: any) {
      console.warn('[AdminDataContext] fetchSettings error:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchCategories(),
        fetchDishes(),
        fetchPromotions(),
        fetchSettings(),
      ]);
    } catch (err: any) {
      setError(err?.message || 'Failed to load administration data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategories, fetchDishes, fetchPromotions, fetchSettings]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Hook into live Supabase Realtime synchronization
  useRealtimeSync({
    onCategoriesChange: fetchCategories,
    onMenuItemsChange: fetchDishes,
    onPromotionsChange: fetchPromotions,
    onSettingsChange: fetchSettings,
  });

  const saveCategory = useCallback(async (data: CategoryFormData) => {
    const saved = await menuService.saveCategory(data);
    await fetchCategories();
    return saved;
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    const success = await menuService.deleteCategory(id);
    await fetchCategories();
    return success;
  }, [fetchCategories]);

  const saveDish = useCallback(async (data: MealFormData) => {
    const saved = await menuService.saveMenuItem(data);
    await fetchDishes();
    return saved;
  }, [fetchDishes]);

  const deleteDish = useCallback(async (id: string) => {
    const success = await menuService.deleteMenuItem(id);
    await fetchDishes();
    return success;
  }, [fetchDishes]);

  const toggleDishAvailability = useCallback(async (id: string, isAvailable?: boolean) => {
    const success = await menuService.toggleMenuItemAvailability(id, isAvailable);
    await fetchDishes();
    return success;
  }, [fetchDishes]);

  const savePromotion = useCallback(async (data: PromoFormData) => {
    const saved = await promotionsService.savePromotion(data);
    await fetchPromotions();
    return saved;
  }, [fetchPromotions]);

  const deletePromotion = useCallback(async (id: string) => {
    const success = await promotionsService.deletePromotion(id);
    await fetchPromotions();
    return success;
  }, [fetchPromotions]);

  const togglePromotionActive = useCallback(async (id: string, isActive?: boolean) => {
    const success = await promotionsService.togglePromotionActive(id, isActive);
    await fetchPromotions();
    return success;
  }, [fetchPromotions]);

  const updateRestaurantSettings = useCallback(async (partial: Partial<AdminRestaurantSettings>) => {
    const updated = await settingsService.updateSettings(partial);
    setRestaurantSettings(updated);
    return updated;
  }, []);

  const toggleKitchenStatus = useCallback(async (isOpen: boolean) => {
    const updated = await settingsService.toggleKitchenStatus(isOpen);
    setRestaurantSettings(updated);
    return updated;
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        categories,
        dishes,
        promotions,
        restaurantSettings,
        isLoading,
        error,
        saveCategory,
        deleteCategory,
        saveDish,
        deleteDish,
        toggleDishAvailability,
        savePromotion,
        deletePromotion,
        togglePromotionActive,
        updateRestaurantSettings,
        toggleKitchenStatus,
        refreshAll,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = (): AdminDataContextType => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
