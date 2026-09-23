import { useMemo, useState } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  canNext: boolean;
  canPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  pageNumbers: (number | 'ellipsis')[];
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Adjust page if total items change and current page exceeds total
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const canNext = safeCurrentPage < totalPages;
  const canPrev = safeCurrentPage > 1;

  const nextPage = () => {
    if (canNext) setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const prevPage = () => {
    if (canPrev) setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('ellipsis');
      
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    canNext,
    canPrev,
    nextPage,
    prevPage,
    setPage,
    pageNumbers,
  };
}
