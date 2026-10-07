import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { AdminPromoDeal, PromoFormData } from '../../types/promotions.types';
import { getMealImage } from '../../../../utils/imageRegistry';

export interface PromoFormModalProps {
  isOpen: boolean;
  editingPromo: AdminPromoDeal | null;
  onClose: () => void;
  onSave: (data: PromoFormData) => void;
}

const PRESET_IMAGE_KEYS = [
  'shawarma-tower',
  'shawarma-cake',
  'shawarma-platters',
  'shawarma-spit',
  'broasted-pieces',
  'broasted-chips',
  'supreme-meal',
  'crispy-meal',
  'fajita-sub',
  'crispy-baguettes',
];

export const PromoFormModal: React.FC<PromoFormModalProps> = ({
  isOpen,
  editingPromo,
  onClose,
  onSave,
}) => {
  const { language } = useLanguage();

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [badgeAr, setBadgeAr] = useState('');
  const [badgeEn, setBadgeEn] = useState('');
  const [imageKey, setImageKey] = useState('shawarma-tower');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [remainingDays, setRemainingDays] = useState<number>(7);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculated discount percentage
  const calculatedDiscount =
    typeof price === 'number' && typeof originalPrice === 'number' && originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  useEffect(() => {
    if (!isOpen) return;

    if (editingPromo) {
      setTitleAr(editingPromo.titleAr);
      setTitleEn(editingPromo.titleEn);
      setDescriptionAr(editingPromo.descriptionAr);
      setDescriptionEn(editingPromo.descriptionEn);
      setBadgeAr(editingPromo.badgeAr);
      setBadgeEn(editingPromo.badgeEn);
      setImageKey(editingPromo.imageKey);
      setPrice(editingPromo.price);
      setOriginalPrice(editingPromo.originalPrice);
      setRemainingDays(editingPromo.remainingDays);
      setFeatured(editingPromo.featured);
      setIsActive(editingPromo.isActive);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setBadgeAr('عرض خاص');
      setBadgeEn('Special Deal');
      setImageKey('shawarma-tower');
      setPrice('');
      setOriginalPrice('');
      setRemainingDays(7);
      setFeatured(false);
      setIsActive(true);
    }
    setErrors({});
  }, [isOpen, editingPromo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!titleAr.trim()) {
      newErrors.titleAr = language === 'ar' ? 'عنوان العرض بالعربية مطلوب' : 'Arabic title is required';
    }
    if (!titleEn.trim()) {
      newErrors.titleEn = language === 'ar' ? 'عنوان العرض بالإنجليزية مطلوب' : 'English title is required';
    }
    if (price === '' || Number(price) <= 0) {
      newErrors.price = language === 'ar' ? 'يرجى إدخال سعر العرض' : 'Valid promo price is required';
    }
    if (originalPrice === '' || Number(originalPrice) <= 0) {
      newErrors.originalPrice = language === 'ar' ? 'يرجى إدخال السعر الأصلي' : 'Original price is required';
    } else if (typeof price === 'number' && Number(originalPrice) < price) {
      newErrors.originalPrice = language === 'ar' ? 'السعر الأصلي يجب أن يكون أكبر من سعر العرض' : 'Original price must exceed promo price';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: editingPromo ? editingPromo.id : undefined,
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim(),
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      badgeAr: badgeAr.trim() || 'عرض خاص',
      badgeEn: badgeEn.trim() || 'Special Deal',
      imageKey,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent: calculatedDiscount,
      remainingDays: Number(remainingDays) || 7,
      featured,
      isActive,
      sortOrder: editingPromo ? editingPromo.sortOrder : 1,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] shadow-2xl z-10 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-['Cairo',sans-serif]">
                {editingPromo
                  ? language === 'ar'
                    ? 'تعديل بيانات العرض الترويجي'
                    : 'Edit Promotional Deal'
                  : language === 'ar'
                  ? 'إنشاء عرض ملكي جديد'
                  : 'Create Royal Deal'}
              </h2>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'عنوان العرض (بالعربية) *' : 'Deal Title (Arabic) *'}
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: باقة برج الشاورما الملكي"
                className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                  errors.titleAr ? 'border-rose-500' : 'border-[var(--border-subtle)]'
                }`}
                dir="rtl"
              />
              {errors.titleAr && (
                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.titleAr}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'عنوان العرض (بالإنجليزية) *' : 'Deal Title (English) *'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Royal Shawarma Feast"
                className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                  errors.titleEn ? 'border-rose-500' : 'border-[var(--border-subtle)]'
                }`}
                dir="ltr"
              />
              {errors.titleEn && (
                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.titleEn}
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Auto-calculated Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'سعر العرض المخفض (ل.س) *' : 'Promo Price (SP) *'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="210000"
                className="px-3.5 py-2 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
              {errors.price && (
                <span className="text-[11px] text-rose-400">{errors.price}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'السعر الأصلي قبل الخصم *' : 'Original Value (SP) *'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="280000"
                className="px-3.5 py-2 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
              {errors.originalPrice && (
                <span className="text-[11px] text-rose-400">{errors.originalPrice}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'نسبة الخصم المحسوبة' : 'Calculated Discount'}
              </label>
              <div className="px-3.5 py-2 rounded-xl text-sm font-black bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-emerald-400 font-mono flex items-center justify-between">
                <span>{calculatedDiscount}%</span>
                <span className="text-[11px] text-[var(--text-muted)] font-normal">
                  {language === 'ar' ? 'توفير تلقائي' : 'Auto Savings'}
                </span>
              </div>
            </div>
          </div>

          {/* Badges & Expiration Days */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'شارة العرض (بالعربية)' : 'Badge Label (AR)'}
              </label>
              <input
                type="text"
                value={badgeAr}
                onChange={(e) => setBadgeAr(e.target.value)}
                placeholder="عرض التوفير الملكي"
                className="px-3.5 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'شارة العرض (بالإنجليزية)' : 'Badge Label (EN)'}
              </label>
              <input
                type="text"
                value={badgeEn}
                onChange={(e) => setBadgeEn(e.target.value)}
                placeholder="Royal Deal"
                className="px-3.5 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
                dir="ltr"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'صلاحية العرض (أيام)' : 'Duration (Days)'}
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={remainingDays}
                onChange={(e) => setRemainingDays(Number(e.target.value) || 7)}
                className="px-3.5 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'تفاصيل العرض (بالعربية)' : 'Description (AR)'}
              </label>
              <textarea
                rows={2}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none resize-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'تفاصيل العرض (بالإنجليزية)' : 'Description (EN)'}
              </label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Image Key Selector */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--border-subtle)]">
              <img
                src={imageKey.startsWith('http') || imageKey.startsWith('data:') ? imageKey : getMealImage(imageKey).src}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                {language === 'ar' ? 'صورة العرض الترويجي' : 'Promotion Image Asset'}
              </label>
              <select
                value={imageKey}
                onChange={(e) => setImageKey(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none"
              >
                {PRESET_IMAGE_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured & Active Switches */}
          <div className="flex items-center gap-6 p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
              />
              <span>{language === 'ar' ? 'عرض مميز في واجهة الموقع' : 'Featured in Hero Banner'}</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
              />
              <span>{language === 'ar' ? 'العرض نشط ومتاح للطلب' : 'Active Deal'}</span>
            </label>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[42px]"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-md transition-all min-h-[42px]"
            >
              {editingPromo
                ? language === 'ar'
                  ? 'حفظ التعديلات'
                  : 'Save Changes'
                : language === 'ar'
                ? 'نشر العرض'
                : 'Publish Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoFormModal;
