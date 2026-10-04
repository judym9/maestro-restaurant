import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';
import { promotionsRepository, PROMOTIONS_UPDATED_EVENT } from '../services/promotionsRepository';
import { promotionsService } from '../services/promotionsService';

export const usePromotions = (pageSize: number = 3) => {
  const [promos, setPromos] = useState<AdminPromoDeal[]>(() => promotionsRepository.getPromotions());
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPromo, setEditingPromo] = useState<AdminPromoDeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const refreshPromos = useCallback(() => {
    setPromos(promotionsRepository.getPromotions());
  }, []);

  useEffect(() => {
    window.addEventListener(PROMOTIONS_UPDATED_EVENT, refreshPromos);
    return () => window.removeEventListener(PROMOTIONS_UPDATED_EVENT, refreshPromos);
  }, [refreshPromos]);

  const totalPages = Math.max(1, Math.ceil(promos.length / pageSize));

  const paginatedPromos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return promos.slice(start, start + pageSize);
  }, [promos, currentPage, pageSize]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  const openNewPromoModal = useCallback(() => {
    setEditingPromo(null);
    setIsModalOpen(true);
  }, []);

  const openEditPromoModal = useCallback((promo: AdminPromoDeal) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingPromo(null);
    setIsModalOpen(false);
  }, []);

  const savePromo = useCallback((data: PromoFormData) => {
    const saved = promotionsRepository.savePromotion(data);
    promotionsService.savePromotion(data).catch(console.warn);
    refreshPromos();
    closeModal();
    return saved;
  }, [refreshPromos, closeModal]);

  const deletePromo = useCallback((id: string) => {
    const res = promotionsRepository.deletePromotion(id);
    promotionsService.deletePromotion(id).catch(console.warn);
    refreshPromos();
    setDeleteConfirmId(null);
    return res;
  }, [refreshPromos]);

  const togglePromoActive = useCallback((id: string) => {
    const res = promotionsRepository.toggleActive(id);
    promotionsService.togglePromotionActive(id).catch(console.warn);
    refreshPromos();
    return res;
  }, [refreshPromos]);

  return {
    promos,
    paginatedPromos,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    editingPromo,
    isModalOpen,
    deleteConfirmId,
    setDeleteConfirmId,
    openNewPromoModal,
    openEditPromoModal,
    closeModal,
    savePromo,
    deletePromo,
    togglePromoActive,
  };
};
