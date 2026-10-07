import React from 'react';
import {
  Flame,
  Utensils,
  Sandwich,
  Sparkles,
  Coffee,
  Crown,
  Pizza,
  Fish,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { CategoryItem } from '../../types/menu.types';

export interface CategoryNavTabsProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
  totalDishesCount: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Utensils,
  Sandwich,
  Crown,
  Sparkles,
  Coffee,
  Pizza,
  Fish,
};

export const CategoryNavTabs: React.FC<CategoryNavTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorder,
  totalDishesCount,
}) => {
  const { language, isRtl } = useLanguage();

  const handleMove = (index: number, direction: 'prev' | 'next') => {
    const targetIdx = direction === 'prev' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const ids = categories.map((c) => c.id);
    const temp = ids[index];
    ids[index] = ids[targetIdx];
    ids[targetIdx] = temp;

    onReorder(ids);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Category Tabs Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent-gold)]" />
          <span className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
            {language === 'ar' ? 'فئات وتصنيفات القائمة' : 'Menu Categories'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            {categories.length}
          </span>
        </div>

        {/* Add Category Action */}
        <button
          type="button"
          onClick={onAddCategory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{language === 'ar' ? 'إضافة فئة' : 'Add Category'}</span>
        </button>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[var(--border-subtle)]">
        {/* All Categories Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 min-h-[42px]
            ${
              selectedCategoryId === 'all'
                ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-md shadow-amber-900/20'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
            }
          `}
        >
          <span>{language === 'ar' ? 'جميع الأصناف' : 'All Items'}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              selectedCategoryId === 'all' ? 'bg-black/20 text-black' : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'
            }`}
          >
            {totalDishesCount}
          </span>
        </button>

        {/* Category Pills */}
        {categories.map((cat, idx) => {
          const isSelected = selectedCategoryId === cat.id;
          const IconComponent = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Utensils;
          const itemCount = cat.itemCount ?? 0;

          return (
            <div
              key={cat.id}
              className={`
                group relative flex items-center gap-2 ps-3.5 pe-2 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 min-h-[42px] border
                ${
                  isSelected
                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                }
              `}
            >
              <button
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="flex items-center gap-2 outline-none"
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    isSelected ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)]' : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {itemCount}
                </span>
              </button>

              {/* Inline Action Controls (Reorder, Edit, Delete) */}
              <div className="flex items-center gap-0.5 ms-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                {/* Move Left / Right */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMove(idx, 'prev');
                  }}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors"
                  title={language === 'ar' ? 'تقديم الترتيب' : 'Move left'}
                >
                  {isRtl ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMove(idx, 'next');
                  }}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors"
                  title={language === 'ar' ? 'تأخير الترتيب' : 'Move right'}
                >
                  {isRtl ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                {/* Edit Category */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(cat);
                  }}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                  title={language === 'ar' ? 'تعديل الفئة' : 'Edit category'}
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                {/* Delete Category */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(cat.id);
                  }}
                  className="p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                  title={language === 'ar' ? 'حذف الفئة' : 'Delete category'}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavTabs;
