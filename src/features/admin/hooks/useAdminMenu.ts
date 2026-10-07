import { useState, useCallback } from 'react';
import { useAdminMenuContext } from '../context/AdminMenuContext';
import type { AdminMealItem, MealFormData, CategoryFormData } from '../types/menu.types';

export const useAdminMenu = () => {
  const context = useAdminMenuContext();

  const [editingMeal, setEditingMeal] = useState<AdminMealItem | null>(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleQuickEdit = useCallback((meal: AdminMealItem) => {
    setEditingMeal(meal);
    setIsMealModalOpen(true);
  }, []);

  const openNewMealModal = useCallback(() => {
    setEditingMeal(null);
    setIsMealModalOpen(true);
  }, []);

  const openEditMealModal = useCallback((meal: AdminMealItem) => {
    handleQuickEdit(meal);
  }, [handleQuickEdit]);

  const closeMealModal = useCallback(() => {
    setEditingMeal(null);
    setIsMealModalOpen(false);
  }, []);

  const openCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
  }, []);

  const handleSaveMeal = useCallback((data: MealFormData) => {
    const saved = context.saveDish(data);
    closeMealModal();
    return saved;
  }, [context, closeMealModal]);

  const handleSaveCategory = useCallback((data: CategoryFormData) => {
    const saved = context.saveCategory(data);
    closeCategoryModal();
    return saved;
  }, [context, closeCategoryModal]);

  const confirmDeleteDish = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const executeDeleteDish = useCallback(() => {
    if (deleteConfirmId) {
      context.deleteDish(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, context]);

  const cancelDeleteDish = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  return {
    ...context,
    editingMeal,
    selectedMeal: editingMeal,
    isMealModalOpen,
    isEditing: isMealModalOpen,
    isCategoryModalOpen,
    deleteConfirmId,
    openNewMealModal,
    openEditMealModal,
    handleQuickEdit,
    closeMealModal,
    openCategoryModal,
    closeCategoryModal,
    handleSaveMeal,
    handleSaveCategory,
    confirmDeleteDish,
    executeDeleteDish,
    cancelDeleteDish,
  };
};
