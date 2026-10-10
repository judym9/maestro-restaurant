import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Sparkles, Image as ImageIcon, Calendar } from 'lucide-react';
import { Modal } from '../common/Modal';
import type { AdminPromoDeal, PromoFormData } from '../../types/promotions.types';
import {
  calculateDiscountPercentage,
  calculateSavings,
  formatCurrencySYP,
} from '../../utils/mathCalculations';
import { MealAssets } from '../../../../utils/imageRegistry';

export interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PromoFormData) => void;
  promo?: AdminPromoDeal | null;
}

const AVAILABLE_IMAGES = Object.keys(MealAssets) as (keyof typeof MealAssets)[];

export const PromoFormModal: React.FC<PromoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  promo,
}) => {
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [badgeAr, setBadgeAr] = useState('عرض خاص');
  const [badgeEn, setBadgeEn] = useState('Special Deal');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [remainingDays, setRemainingDays] = useState<number>(7);
  const [imageKey, setImageKey] = useState<string>('shawarma-tower');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promo) {
      setTitleAr(promo.titleAr || '');
      setTitleEn(promo.titleEn || '');
      setDescriptionAr(promo.descriptionAr || '');
      setDescriptionEn(promo.descriptionEn || '');
      setBadgeAr(promo.badgeAr || 'عرض خاص');
      setBadgeEn(promo.badgeEn || 'Special Deal');
      setPrice(promo.price || 0);
      setOriginalPrice(promo.originalPrice || 0);
      setRemainingDays(promo.remainingDays || 7);
      setImageKey(promo.imageKey || 'shawarma-tower');
      setIsActive(promo.isActive ?? true);
      setIsFeatured(promo.featured || false);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setBadgeAr('عرض خاص');
      setBadgeEn('Special Deal');
      setPrice(0);
      setOriginalPrice(0);
      setRemainingDays(7);
      setImageKey('shawarma-tower');
      setIsActive(true);
      setIsFeatured(false);
    }
    setErrors({});
  }, [promo, isOpen]);

  const discountPercent = calculateDiscountPercentage(originalPrice, price);
  const savingsAmount = calculateSavings(originalPrice, price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!titleAr.trim()) {
      newErrors.titleAr = 'عنوان العرض بالعربية مطلوب';
    }
    if (!titleEn.trim()) {
      newErrors.titleEn = 'عنوان العرض بالإنجليزية مطلوب';
    }
    if (!price || price <= 0) {
      newErrors.price = 'يرجى إدخال سعر العرض';
    }
    if (!originalPrice || originalPrice <= price) {
      newErrors.originalPrice = 'السعر الأصلي يجب أن يكون أكبر من سعر العرض المخفض';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: PromoFormData = {
      ...(promo?.id ? { id: promo.id } : {}),
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim(),
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      badgeAr: badgeAr.trim() || 'عرض خاص',
      badgeEn: badgeEn.trim() || 'Special Deal',
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent: discountPercent,
      remainingDays: Number(remainingDays) || 7,
      imageKey,
      isActive,
      featured: isFeatured,
      sortOrder: promo?.sortOrder || 0,
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={promo ? 'تعديل بيانات العرض الملكي' : 'إنشاء عرض ملكي جديد'}
      subtitle="حزم التوفير والخصومات الحصرية لمطعم مايسترو"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              عنوان العرض بالعربية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: وجبتين شاورما دبل + بطاطا + كولا"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
                errors.titleAr
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
              }`}
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              نصيحة: استخدم رمز <code>+</code> للفصل التلقائي بين محتويات الباقة.
            </span>
            {errors.titleAr && (
              <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.titleAr}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              عنوان العرض بالإنجليزية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. 2 Double Shawarma + Fries + Cola"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
                errors.titleEn
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
              }`}
            />
            {errors.titleEn && (
              <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.titleEn}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Automatic Discount calculation */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                سعر العرض بعد الخصم (ليرة سورية) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-sm text-white font-mono focus:outline-none focus:ring-1 transition-colors ${
                  errors.price
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
                }`}
              />
              {errors.price && (
                <span className="text-[11px] text-rose-400 mt-1 block">
                  {errors.price}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                السعر الأصلي المشطوب قبل الخصم <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-sm text-white font-mono focus:outline-none focus:ring-1 transition-colors ${
                  errors.originalPrice
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
                }`}
              />
              {errors.originalPrice && (
                <span className="text-[11px] text-rose-400 mt-1 block">
                  {errors.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Computed metrics telemetry */}
          {discountPercent > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>نسبة التخفيض المحسوبة:</span>
                <strong className="font-mono text-sm font-bold">
                  {discountPercent}%
                </strong>
              </span>
              <span>
                التوفير المالي للزبون:{' '}
                <strong className="font-mono">{formatCurrencySYP(savingsAmount)}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Badges & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              شارة العرض بالعربية
            </label>
            <input
              type="text"
              value={badgeAr}
              onChange={(e) => setBadgeAr(e.target.value)}
              placeholder="مثال: عرض التوفير الملكي"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              شارة العرض بالإنجليزية
            </label>
            <input
              type="text"
              value={badgeEn}
              onChange={(e) => setBadgeEn(e.target.value)}
              placeholder="Royal Savings Deal"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              الأيام المتبقية للصلاحية
            </label>
            <div className="relative">
              <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="1"
                max="90"
                value={remainingDays}
                onChange={(e) => setRemainingDays(Number(e.target.value))}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Image Selection Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>صورة العرض الترويجي</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-36 overflow-y-auto p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            {AVAILABLE_IMAGES.map((key) => {
              const asset = MealAssets[key];
              const isSelected = imageKey === key;

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setImageKey(key)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/40 scale-95 shadow-md'
                      : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={asset.webp || asset.src}
                    alt={asset.altAr}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              تفاصيل العرض بالعربية
            </label>
            <textarea
              rows={2}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="تفاصيل المكونات والوجبات المتضمنة..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              تفاصيل العرض بالإنجليزية
            </label>
            <textarea
              rows={2}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="English promotion details..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white"
            />
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="flex items-center gap-6 p-4 px-5 rounded-2xl bg-[#090d16] border border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <span>نشر العرض فوراً للزبائن</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <span>تمييز كباقة رئيسية في واجهة المتجر</span>
          </label>
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ العرض الملكي</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PromoFormModal;
