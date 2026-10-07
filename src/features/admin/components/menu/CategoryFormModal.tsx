import React, { useState, useEffect } from 'react';
import { X, Layers, Flame, Utensils, Sandwich, Sparkles, Coffee, Crown, Pizza, Fish, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { CategoryFormData, CategoryItem } from '../../types/menu.types';

export interface CategoryFormModalProps {
  isOpen: boolean;
  editingCategory: CategoryItem | null;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
}

const AVAILABLE_ICONS = [
  { id: 'Flame', label: 'شعلة / مشاوي', Icon: Flame },
  { id: 'Utensils', label: 'أدوات طعام / بروستد', Icon: Utensils },
  { id: 'Sandwich', label: 'ساندويش / برغر', Icon: Sandwich },
  { id: 'Crown', label: 'تاج / ملكي', Icon: Crown },
  { id: 'Sparkles', label: 'نجمة / مقبلات', Icon: Sparkles },
  { id: 'Coffee', label: 'مشروبات', Icon: Coffee },
  { id: 'Pizza', label: 'بيتزا / معجنات', Icon: Pizza },
  { id: 'Fish', label: 'مأكولات بحرية', Icon: Fish },
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  editingCategory,
  onClose,
  onSave,
}) => {
  const { language } = useLanguage();

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('Flame');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (editingCategory) {
      setNameAr(editingCategory.nameAr);
      setNameEn(editingCategory.nameEn);
      setSlug(editingCategory.slug);
      setIcon(editingCategory.icon || 'Flame');
      setIsActive(editingCategory.isActive);
      setSortOrder(editingCategory.sortOrder || 1);
    } else {
      setNameAr('');
      setNameEn('');
      setSlug('');
      setIcon('Flame');
      setIsActive(true);
      setSortOrder(1);
    }
    setErrors({});
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nameAr.trim()) {
      newErrors.nameAr = language === 'ar' ? 'اسم الفئة بالعربية مطلوب' : 'Arabic name is required';
    }
    if (!nameEn.trim()) {
      newErrors.nameEn = language === 'ar' ? 'اسم الفئة بالإنجليزية مطلوب' : 'English name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const generatedSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, '-')
      : nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    onSave({
      id: editingCategory ? editingCategory.id : undefined,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      slug: generatedSlug,
      icon,
      isActive,
      sortOrder: Number(sortOrder) || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6 shadow-2xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {editingCategory
                  ? language === 'ar'
                    ? 'تعديل فئة الطعام'
                    : 'Edit Food Category'
                  : language === 'ar'
                  ? 'إضافة فئة طعام جديدة'
                  : 'Add New Food Category'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)]">
              {language === 'ar' ? 'اسم الفئة (بالعربية) *' : 'Category Name (Arabic) *'}
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: المشاوي الملكية"
              className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                errors.nameAr ? 'border-rose-500' : 'border-[var(--border-subtle)]'
              }`}
              dir="rtl"
            />
            {errors.nameAr && (
              <span className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.nameAr}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)]">
              {language === 'ar' ? 'اسم الفئة (بالإنجليزية) *' : 'Category Name (English) *'}
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Royal Grills"
              className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                errors.nameEn ? 'border-rose-500' : 'border-[var(--border-subtle)]'
              }`}
              dir="ltr"
            />
            {errors.nameEn && (
              <span className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.nameEn}
              </span>
            )}
          </div>

          {/* Icon Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--text-secondary)]">
              {language === 'ar' ? 'أيقونة التصنيف:' : 'Category Icon:'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map(({ id, Icon }) => {
                const isSelected = icon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setIcon(id)}
                    className={`
                      flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all
                      ${
                        isSelected
                          ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-bold scale-105'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active status & Sort order */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
              />
              <span>{language === 'ar' ? 'الفئة نشطة وظاهرة في القائمة' : 'Active Category'}</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--text-muted)]">{language === 'ar' ? 'الترتيب:' : 'Order:'}</span>
              <input
                type="number"
                min="1"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 1)}
                className="w-14 px-2 py-1 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono text-center outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[42px]"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-md transition-all min-h-[42px]"
            >
              {editingCategory
                ? language === 'ar'
                  ? 'حفظ التعديلات'
                  : 'Save Changes'
                : language === 'ar'
                ? 'إضافة الفئة'
                : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
