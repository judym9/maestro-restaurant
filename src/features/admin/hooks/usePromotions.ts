import { useState, useEffect, useCallback, useMemo } from 'react';
import { PROMOS_DATA } from '../../promotions/promosData';
import type { PromoDeal } from '../../promotions/promosData';

const STORAGE_PROMOS_KEY = 'maestro_admin_promos';
export const PROMOS_UPDATED_EVENT = 'maestro:promos-updated';

export const usePromotions = (pageSize: number = 4) => {
  const [promos, setPromos] = useState<PromoDeal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_PROMOS_KEY);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return PROMOS_DATA;
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const savePromos = useCallback((updated: PromoDeal[]) => {
    setPromos(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_PROMOS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(PROMOS_UPDATED_EVENT));
    }
  }, []);

  const togglePromoActive = useCallback((id: string) => {
    const updated = promos.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    savePromos(updated);
  }, [promos, savePromos]);

  const movePromo = useCallback((index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= promos.length) return;
    const copy = [...promos];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    savePromos(copy);
  }, [promos, savePromos]);

  const deletePromo = useCallback((id: string) => {
    const updated = promos.filter((p) => p.id !== id);
    savePromos(updated);
  }, [promos, savePromos]);

  const savePromo = useCallback((deal: PromoDeal) => {
    const index = promos.findIndex((p) => p.id === deal.id);
    let updated: PromoDeal[];
    if (index !== -1) {
      updated = [...promos];
      updated[index] = deal;
    } else {
      updated = [deal, ...promos];
    }
    savePromos(updated);
  }, [promos, savePromos]);

  const totalPages = Math.max(1, Math.ceil(promos.length / pageSize));

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPromos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return promos.slice(start, start + pageSize);
  }, [promos, currentPage, pageSize]);

  return {
    promos,
    paginatedPromos,
    currentPage,
    totalPages,
    setCurrentPage,
    togglePromoActive,
    movePromo,
    deletePromo,
    savePromo,
  };
};
