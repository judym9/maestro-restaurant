import React, { useState, useEffect, useRef } from 'react';
import { X, FolderPlus } from 'lucide-react';
import type { CategoryItem, CategoryFormData } from '../../types/menu.types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  initialData?: CategoryItem | null;
  language: 'ar' | 'en';
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  language,
}) => {
  const isAr = language === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial data when modal opens
  useEffect(() => {
    if (initialData) {
      setNameAr(initialData.nameAr);
      setNameEn(initialData.nameEn);
      setSlug(initialData.slug);
    } else {
      setNameAr('');
      setNameEn('');
      setSlug('');
    }
  }, [initialData, isOpen]);

  // Smooth scroll to center, focus, lock body scroll, and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const scrollTimer = setTimeout(() => {
      const categorySection = cardRef.current || document.getElementById('add-category-section');
      if (categorySection) {
        categorySection.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;

    onSave({
      id: initialData?.id,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      slug: slug.trim() || `cat-${Date.now()}`,
      isActive: true,
      sortOrder: initialData ? initialData.sortOrder : 1,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        id="add-category-section"
        ref={cardRef}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl flex flex-col p-6 shadow-2xl z-10 text-slate-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-200 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4 mb-5 shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
              <FolderPlus size={18} />
            </span>
            <span>
              {initialData
                ? (isAr ? 'تعديل التصنيف' : 'Edit Category')
                : (isAr ? 'إضافة تصنيف جديد' : 'Add New Category')}
            </span>
          </h3>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {isAr ? 'اسم التصنيف بالعربية *' : 'Category Name (Arabic) *'}
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={isAr ? 'مثال: وجبات سريعة، مقبلات...' : 'e.g. Fast Food, Appetizers...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {isAr ? 'اسم التصنيف بالإنجليزية *' : 'Category Name (English) *'}
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Fast Food, Appetizers..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {isAr ? 'الرمز التعريفي (Slug)' : 'URL Slug'}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. fast-food"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left font-mono"
              dir="ltr"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-end gap-3 mt-4 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-xs font-semibold cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl shadow-sm transition-all active:scale-95 text-xs cursor-pointer"
            >
              {initialData ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة التصنيف' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
