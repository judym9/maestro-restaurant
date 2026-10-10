import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import type { CategoryItem, CategoryFormData } from '../../types/menu.types';
import { generateCategorySlug } from '../../utils/mathCalculations';

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  category?: CategoryItem | null;
}

const CATEGORY_ICONS = ['🔥', '👑', '🥪', '🍗', '✨', '☕', '🍕', '🥗', '🍔', '🍟', '🍲', '🥩'];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🔥');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setNameAr(category.nameAr || '');
      setNameEn(category.nameEn || '');
      setSlug(category.slug || '');
      setIcon(category.icon || '🔥');
      setSortOrder(category.sortOrder || 0);
      setIsActive(category.isActive ?? true);
    } else {
      setNameAr('');
      setNameEn('');
      setSlug('');
      setIcon('🔥');
      setSortOrder(0);
      setIsActive(true);
    }
    setErrors({});
  }, [category, isOpen]);

  // Auto-slugify when typing English name if slug wasn't manually edited
  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!category) {
      setSlug(generateCategorySlug(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nameAr.trim()) {
      newErrors.nameAr = 'اسم الفئة بالعربية مطلوب';
    }
    if (!nameEn.trim()) {
      newErrors.nameEn = 'اسم الفئة بالإنجليزية مطلوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CategoryFormData = {
      ...(category?.id ? { id: category.id } : {}),
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      slug: slug.trim() || generateCategorySlug(nameEn || nameAr),
      icon,
      sortOrder: Number(sortOrder) || 0,
      isActive,
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'تعديل بيانات التصنيف' : 'إضافة تصنيف طعام جديد'}
      subtitle="تنظيم وهيكلة أقسام المأكولات في قائمة الطعام"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            اسم التصنيف بالعربية <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="مثال: الشاورما الملكية"
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
              errors.nameAr
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
            }`}
          />
          {errors.nameAr && (
            <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.nameAr}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            اسم التصنيف بالإنجليزية <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => handleNameEnChange(e.target.value)}
            placeholder="e.g. Royal Shawarma"
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
              errors.nameEn
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
            }`}
          />
          {errors.nameEn && (
            <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.nameEn}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            المسار المختصر (Slug)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="royal-shawarma"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Icon Picker Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            أيقونة التصنيف
          </label>
          <div className="flex flex-wrap gap-2.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            {CATEGORY_ICONS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                  icon === emoji
                    ? 'bg-amber-500/20 border-2 border-amber-500 scale-105 shadow-sm'
                    : 'bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Order & Active */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ترتيب العرض
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>تنشيط الفئة في القائمة</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 pb-1 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التصنيف</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
