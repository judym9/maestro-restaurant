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
  const [isActive, setIsActive] = useState<boolean>(true);

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
      setIsActive(initialData.isActive);
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
      setIsActive(true);
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

  const currentSavings = Math.max(0, originalPrice - price);

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
      isActive,
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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl flex flex-col p-6 shadow-2xl z-10 text-slate-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4 mb-4 shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
              <Sparkles size={18} />
            </span>
            <span>
              {initialData
                ? (isAr ? 'تعديل بيانات الباقة الملكية' : 'Edit Royal Offer')
                : (isAr ? 'إضافة باقة أو عرض ملكي جديد' : 'New Royal Offer')}
            </span>
          </h3>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-admin-scrollbar">
            {/* 1. Deal Titles (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'عنوان الباقة بالعربية (استخدم + للفصل بين الأصناف) *' : 'Offer Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder={isAr ? 'مثال: برج الشاورما الملكي + تومية وبطاطا' : 'Offer title in Arabic'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'عنوان الباقة بالإنجليزية *' : 'Offer Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Royal Shawarma Tower + Family Fries"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 2. Badge Labels (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'شارة العرض الترويجية' : 'Offer Badge Label'}
                </label>
                <div className="relative flex items-center">
                  <Tag size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={badgeAr}
                    onChange={(e) => setBadgeAr(e.target.value)}
                    placeholder={isAr ? 'مثال: عرض التوفير الملكي' : 'e.g. Royal Deal'}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'الشارة بالإنجليزية' : 'Badge (English)'}
                </label>
                <input
                  type="text"
                  value={badgeEn}
                  onChange={(e) => setBadgeEn(e.target.value)}
                  placeholder="e.g. Royal Special Deal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 3. Pricing Grid (Row 1: Original Price & Offer Price) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'السعر الأصلي للباقة (ل.س)' : 'Original Bundle Price (SYP)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={originalPrice || ''}
                  onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                  placeholder="280000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'سعر العرض المخفض (ل.س) *' : 'Discounted Offer Price (SYP) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={price}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  placeholder="210000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-amber-500 dark:text-amber-400 font-bold focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 4. Live Value Preview Strip: Savings + Discount % */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">
                  {isAr ? 'مبلغ التوفير المحسوب للزبون:' : 'Customer Savings Amount:'}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-numeric">
                  {currentSavings.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">
                  {isAr ? 'نسبة الخصم:' : 'Discount Rate:'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold font-numeric">
                  -{discountPercent}%
                </span>
              </div>
            </div>

            {/* 5. Pricing Grid (Row 2: Discount % & Validity Days) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'تعديل نسبة الخصم يدوياً (%)' : 'Manual Discount % Override'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-rose-500 font-bold focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'فترة الصلاحية المتبقية (بالأيام)' : 'Remaining Validity Period (Days)'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={remainingDays}
                  onChange={(e) => setRemainingDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>
            </div>

            {/* 6. Image Asset Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'الصورة المرفقة للباقة' : 'Associated Photo Asset'}
              </label>
              <select
                value={imageKey}
                onChange={(e) => setImageKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm transition-colors cursor-pointer"
              >
                {Object.keys(MealAssets).map((k) => (
                  <option key={k} value={k} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
                    {MealAssets[k]?.altAr || k}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Active Status Toggle */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-zinc-100">
                  {isAr ? 'حالة تفعيل العرض' : 'Offer Activation Status'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {isAr
                    ? 'عند تفعيل العرض سيظهر مباشرة للزبائن في الصفحة الرئيسية وقسم العروض'
                    : 'When active, this offer appears directly to customers on the home page'}
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {isActive ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Disabled')}
                </span>
              </label>
            </div>

            {/* 8. Optional Descriptions (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'محتويات وتفاصيل الباقة بالعربية' : 'Bundle Contents & Details in Arabic'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'وصف للمكونات والوجبات المشمولة بالباقة...' : 'Bundle details in Arabic...'}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm leading-relaxed transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  {isAr ? 'محتويات وتفاصيل الباقة بالإنجليزية' : 'Bundle Contents & Details in English'}
                </label>
                <textarea
                  rows={2}
                  placeholder="Offer details in English..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 text-sm leading-relaxed transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
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
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-xs cursor-pointer"
            >
              {isAr ? 'حفظ العرض' : 'Save Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
