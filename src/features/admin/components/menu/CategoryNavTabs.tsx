import React from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import type { CategoryItem } from '../../types/menu.types';

export interface CategoryNavTabsProps {
  categories: CategoryItem[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: () => void;
  onEditCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategory?: (id: string, direction: 'up' | 'down') => void;
  totalDishesCount: number;
}

export const CategoryNavTabs: React.FC<CategoryNavTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategory,
  totalDishesCount,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2 shrink-0">
        {/* All Categories Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
            selectedCategoryId === null
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>جميع الأصناف</span>
          <span
            className={`px-2.5 py-0.5 min-w-[22px] text-center rounded-full text-xs font-mono font-bold leading-none ${
              selectedCategoryId === null
                ? 'bg-slate-950/20 text-slate-950'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {totalDishesCount}
          </span>
        </button>

        {/* Individual Category Tabs */}
        {categories.map((cat, index) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <div
              key={cat.id}
              className={`group relative flex items-center rounded-xl border transition-all duration-150 ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold"
              >
                <span>{cat.icon || '🍽️'}</span>
                <span>{cat.nameAr}</span>
                {typeof cat.itemCount === 'number' && (
                  <span
                    className={`px-2.5 py-0.5 min-w-[22px] text-center rounded-full text-xs font-mono font-bold leading-none ${
                      isSelected
                        ? 'bg-amber-500/25 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.itemCount}
                  </span>
                )}
              </button>

              {/* Action buttons on hover */}
              <div className="hidden group-hover:flex items-center gap-1 px-2 py-1 border-s border-slate-700/60">
                {onReorderCategory && (
                  <>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderCategory(cat.id, 'up');
                      }}
                      title="تقديم الترتيب"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 disabled:opacity-20"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === categories.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderCategory(cat.id, 'down');
                      }}
                      title="تأخير الترتيب"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 disabled:opacity-20"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(cat);
                  }}
                  title="تعديل الفئة"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-700/60"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(cat.id);
                  }}
                  title="حذف الفئة"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Category Button */}
      <button
        type="button"
        onClick={onAddCategory}
        className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>تصنيف جديد</span>
      </button>
    </div>
  );
};

export default CategoryNavTabs;
