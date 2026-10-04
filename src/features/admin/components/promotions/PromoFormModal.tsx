import React, { useState, useEffect } from 'react';
import { X, Tag, Sparkles } from 'lucide-react';
import type { AdminPromoDeal, PromoFormData } from '../../types/promotions.types';
import { MealAssets } from '../../../../utils/imageRegistry';

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PromoFormData) => void;
  initialData?: AdminPromoDeal | null;
  language: 'ar' | 'en';
}

export const PromoFormModal: React.FC<PromoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  language,
}) => {
  const isAr = language === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [badgeAr, setBadgeAr] = useState('');
  const [badgeEn, setBadgeEn] = useState('');
  const [imageKey, setImageKey] = useState('shawarma-tower');
  const [price, setPrice] = useState<number>(210000);
  const [originalPrice, setOriginalPrice] = useState<number>(280000);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [remainingDays, setRemainingDays] = useState<number>(7);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sync initial data
  useEffect(() => {
    if (initialData) {
      setTitleAr(initialData.titleAr);
      setTitleEn(initialData.titleEn);
      setDescAr(initialData.descriptionAr);
      setDescEn(initialData.descriptionEn);
      setBadgeAr(initialData.badgeAr);
      setBadgeEn(initialData.badgeEn);
      setImageKey(initialData.imageKey);
      setPrice(initialData.price);
      setOriginalPrice(initialData.originalPrice);
      setDiscountPercent(initialData.discountPercent);
      setRemainingDays(initialData.remainingDays);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescAr('');
      setDescEn('');
      setBadgeAr('عرض التوفير الملكي');
      setBadgeEn('Royal Special Deal');
      setImageKey('shawarma-tower');
      setPrice(210000);
      setOriginalPrice(280000);
      setDiscountPercent(25);
      setRemainingDays(7);
    }
  }, [initialData, isOpen]);

  // Auto-calculate discount percentage when original price or price changes
  const handleOriginalPriceChange = (newOrig: number) => {
    setOriginalPrice(newOrig);
    if (newOrig > 0 && price > 0 && newOrig > price) {
      const calcDiscount = Math.round(((newOrig - price) / newOrig) * 100);
      setDiscountPercent(calcDiscount);
    }
  };

  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
    if (originalPrice > 0 && newPrice > 0 && originalPrice > newPrice) {
      const calcDiscount = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
      setDiscountPercent(calcDiscount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !titleEn.trim()) return;

    onSave({
      id: initialData?.id,
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim(),
      descriptionAr: descAr.trim(),
      descriptionEn: descEn.trim(),
      badgeAr: badgeAr.trim(),
      badgeEn: badgeEn.trim(),
      imageKey,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent: Number(discountPercent),
      remainingDays: Number(remainingDays),
      featured: initialData?.featured ?? false,
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder ?? 1,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-6 shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
              <Sparkles size={18} />
            </span>
            <span>
              {initialData ? (isAr ? 'تعديل العرض الترويجي' : 'Edit Promo Deal') : (isAr ? 'إضافة باقة أو عرض جديد' : 'New Promotion Deal')}
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

        {/* Scrollable Form Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-admin-scrollbar">
            {/* 1. Deal Titles (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'عنوان العرض *' : 'Deal Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder={isAr ? 'اسم العرض بالعربية' : 'Deal title in Arabic'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'العنوان بالإنجليزية *' : 'Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Offer Title"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 2. Badge Labels (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'شارة العرض' : 'Badge Label'}
                </label>
                <div className="relative flex items-center">
                  <Tag size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={badgeAr}
                    onChange={(e) => setBadgeAr(e.target.value)}
                    placeholder={isAr ? 'مثال: باقة ملكية' : 'e.g. Royal Deal'}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'الشارة بالإنجليزية' : 'Badge (English)'}
                </label>
                <input
                  type="text"
                  value={badgeEn}
                  onChange={(e) => setBadgeEn(e.target.value)}
                  placeholder="e.g. Royal Special"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 3. Pricing Grid (Row 1: Original Price & Discount Price) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'السعر الأصلي (ل.س)' : 'Original Price (SYP)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={originalPrice || ''}
                  onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                  placeholder="280000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'السعر المخفض (ل.س) *' : 'Discount Price (SYP) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={price}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  placeholder="210000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-400 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 4. Pricing Grid (Row 2: Discount % & Validity Days) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'نسبة الخصم %' : 'Discount %'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-rose-400 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'فترة الصلاحية (بالأيام)' : 'Validity Period (Days)'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={remainingDays}
                  onChange={(e) => setRemainingDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 5. Image Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {isAr ? 'الصورة المرفقة' : 'Image Asset'}
              </label>
              <select
                value={imageKey}
                onChange={(e) => setImageKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors cursor-pointer"
              >
                {Object.keys(MealAssets).map((k) => (
                  <option key={k} value={k} className="bg-slate-900 text-white">
                    {MealAssets[k]?.altAr || k}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Optional Descriptions (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'تفاصيل العرض بالعربية' : 'Details in Arabic'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'تفاصيل العرض بالعربية...' : 'Details in Arabic...'}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm leading-relaxed transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'تفاصيل العرض بالإنجليزية' : 'Details in English'}
                </label>
                <textarea
                  rows={2}
                  placeholder="Offer details in English..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm leading-relaxed transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3 mt-4 shrink-0">
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
              {isAr ? 'حفظ العرض' : 'Save Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
