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

    // Smooth scroll to center of screen
    const scrollTimer = setTimeout(() => {
      const categorySection = cardRef.current || document.getElementById('add-category-section');
      if (categorySection) {
        categorySection.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);

    // Ensure autofocus on the first input
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

      {/* Modal Dialog Card / Add Category Section */}
      <div
        id="add-category-section"
        ref={cardRef}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-6 shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-200 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5 shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
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
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {isAr ? 'اسم التصنيف بالعربية *' : 'Category Name (Arabic) *'}
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              autoFocus
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={isAr ? 'مثال: وجبات سريعة، مقبلات...' : 'e.g. Fast Food, Appetizers...'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {isAr ? 'اسم التصنيف بالإنجليزية *' : 'Category Name (English) *'}
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Fast Food, Appetizers..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {isAr ? 'الرمز التعريفي (Slug)' : 'URL Slug'}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. fast-food"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left font-mono"
              dir="ltr"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 mt-4 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors text-sm font-semibold cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-sm cursor-pointer"
            >
              {isAr
                ? (initialData ? 'حفظ التعديلات' : 'إضافة التصنيف')
                : (initialData ? 'Save Changes' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
