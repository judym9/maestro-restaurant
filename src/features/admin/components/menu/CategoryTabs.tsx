import React, { useState } from 'react';
import { Edit2, Trash2, FolderPlus } from 'lucide-react';
import type { CategoryItem, CategoryFormData } from '../../types/menu.types';
import { CategoryFormModal } from './CategoryFormModal';

interface CategoryTabsProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onSaveCategory: (data: CategoryFormData) => void;
  onDeleteCategory: (id: string) => void;
  language: 'ar' | 'en';
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
  hideAddButton?: boolean;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onSaveCategory,
  onDeleteCategory,
  language,
  isAddModalOpen = false,
  onCloseAddModal,
  hideAddButton = false,
}) => {
  const isAr = language === 'ar';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Sync external add modal trigger
  React.useEffect(() => {
    if (isAddModalOpen) {
      setEditingCategory(null);
      setIsModalOpen(true);
    }
  }, [isAddModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSave = (data: CategoryFormData) => {
    onSaveCategory(data);
    handleCloseModal();
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto py-1 custom-admin-scrollbar max-w-full">
        {/* "All" Tab */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white shadow-xs'
          }`}
        >
          {isAr ? 'جميع التصنيفات' : 'All Categories'}
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-xs font-bold'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white shadow-xs'
              }`}
            >
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
              {typeof cat.itemCount === 'number' && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-numeric ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200'
                  }`}
                >
                  {cat.itemCount}
                </span>
              )}
              {/* Edit & Delete hover icons */}
              <div className="hidden group-hover:flex items-center gap-1 rtl:mr-1 ltr:ml-1">
                <button
                  type="button"
                  onClick={(e) => openEditModal(cat, e)}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  title={isAr ? 'تعديل التصنيف' : 'Edit Category'}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(isAr ? `هل أنت متأكد من حذف تصنيف "${cat.nameAr}"؟` : `Delete category "${cat.nameEn}"?`)) {
                      onDeleteCategory(cat.id);
                    }
                  }}
                  className="p-1 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                  title={isAr ? 'حذف التصنيف' : 'Delete Category'}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Category Action */}
        {!hideAddButton && (
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <FolderPlus size={15} />
            <span>{isAr ? 'تصنيف جديد' : 'New Category'}</span>
          </button>
        )}
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingCategory}
        language={language}
      />
    </div>
  );
};
