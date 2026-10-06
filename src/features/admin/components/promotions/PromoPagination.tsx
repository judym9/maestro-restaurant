import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isRtl: boolean;
  language: 'ar' | 'en';
}

export const PromoPagination: React.FC<PromoPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
  isRtl,
  language,
}) => {
  if (totalPages <= 1) return null;

  const isAr = language === 'ar';
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80 flex-wrap">
      <span className="text-xs text-slate-500 dark:text-zinc-400 font-numeric">
        {isAr
          ? `عرض الصفحة ${currentPage} من أصل ${totalPages}`
          : `Showing Page ${currentPage} of ${totalPages}`}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer shadow-xs"
          aria-label="Previous Page"
        >
          <PrevIcon size={15} />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all font-numeric cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-xs'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer shadow-xs"
          aria-label="Next Page"
        >
          <NextIcon size={15} />
        </button>
      </div>
    </div>
  );
};
