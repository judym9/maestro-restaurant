import { useState, useMemo } from 'react';
import type { PromoDeal } from './promosData';

export interface UsePromoPaginationOptions {
  deals: PromoDeal[];
  pageSize?: number;
}

export function usePromoPagination({ deals, pageSize = 2 }: UsePromoPaginationOptions) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(deals.length / pageSize));
  }, [deals.length, pageSize]);

  const currentDeals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return deals.slice(start, start + pageSize);
  }, [deals, currentPage, pageSize]);

  const nextPage = () => {
    setCurrentPage((p) => (p < totalPages ? p + 1 : 1)); // Cycles seamlessly
  };

  const prevPage = () => {
    setCurrentPage((p) => (p > 1 ? p - 1 : totalPages));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentDeals,
    nextPage,
    prevPage,
    goToPage,
  };
}
