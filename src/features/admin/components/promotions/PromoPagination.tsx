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
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10 flex-wrap">
      <span className="text-xs text-[#64748B] dark:text-slate-400">
        {isAr
          ? `عرض الصفحة ${currentPage} من أصل ${totalPages}`
          : `Showing Page ${currentPage} of ${totalPages}`}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-[#F8F5EE] dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous Page"
        >
          <PrevIcon size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#D97706] text-white shadow-md shadow-amber-500/20'
                  : 'bg-[#F8F5EE] dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
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
          className="p-2 rounded-xl bg-[#F8F5EE] dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Next Page"
        >
          <NextIcon size={16} />
        </button>
      </div>
    </div>
  );
};
