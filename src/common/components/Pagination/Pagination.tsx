import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { cn } from '../../../utils/cn';
import './Pagination.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageNumbers: (number | 'ellipsis')[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageNumbers,
  className,
}) => {
  const { isRtl, t } = useLanguage();

  if (totalPages <= 1) return null;

  // In RTL, the previous icon points right and next icon points left
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav className={cn('maestro-pagination', className)} aria-label="Pagination">
      <button
        type="button"
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label={t.common.actions.prev}
      >
        <PrevIcon size={18} />
      </button>

      {pageNumbers.map((p, idx) => {
        if (p === 'ellipsis') {
          return (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              …
            </span>
          );
        }

        const isActive = p === currentPage;

        return (
          <button
            key={p}
            type="button"
            className={cn('pagination-btn', isActive && 'active')}
            onClick={() => onPageChange(p)}
            aria-current={isActive ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label={t.common.actions.next}
      >
        <NextIcon size={18} />
      </button>
    </nav>
  );
};
