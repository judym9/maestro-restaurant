import React from 'react';
import { Edit3, Trash2, Tag, Calendar, Sparkles } from 'lucide-react';
import type { AdminPromoDeal } from '../../types/promotions.types';
import { getMealImage } from '../../../../utils/imageRegistry';

interface PromoCardProps {
  deal: AdminPromoDeal;
  onEdit: (deal: AdminPromoDeal) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  language: 'ar' | 'en';
}

export const PromoCard: React.FC<PromoCardProps> = ({
  deal,
  onEdit,
  onDelete,
  onToggleActive,
  language,
}) => {
  const isAr = language === 'ar';
  const imgAsset = getMealImage(deal.imageKey);

  const formattedPrice = new Intl.NumberFormat(isAr ? 'ar-SY' : 'en-US').format(deal.price);
  const formattedOrigPrice = new Intl.NumberFormat(isAr ? 'ar-SY' : 'en-US').format(deal.originalPrice);
  const savingsAmount = Math.max(0, deal.originalPrice - deal.price);
  const formattedSavings = new Intl.NumberFormat(isAr ? 'ar-SY' : 'en-US').format(savingsAmount);

  // Extract bundle items from title if separated by '+'
  const bundleItems = (isAr ? deal.titleAr : deal.titleEn)
    .split('+')
    .map((item) => item.trim())
    .filter(Boolean);

  const isExpired = deal.remainingDays <= 0;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border transition-all duration-200 bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-md min-w-0 ${
        deal.isActive
          ? 'border-slate-200 dark:border-zinc-800 hover:border-amber-500/40 dark:hover:border-amber-500/40'
          : 'border-slate-200/80 dark:border-zinc-800/80 opacity-80'
      }`}
    >
      {/* Top Subtle Amber Accent Strip on Hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-300 rounded-t-xl pointer-events-none z-10" />

      {/* Top Banner Media (16:10 Aspect Ratio, Clean Photography) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-zinc-950 rounded-t-xl">
        <picture>
          {imgAsset.webp && <source srcSet={imgAsset.webp} type="image/webp" />}
          <img
            src={imgAsset.src}
            alt={isAr ? deal.titleAr : deal.titleEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </picture>

        {/* Minimal Gradient Only for Corner Pill Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/35 pointer-events-none" />

        {/* Top Badges (Category / Royal Badge + Discount %) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {deal.badgeAr ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold shadow-sm">
              <Tag size={12} className="text-amber-400 shrink-0" />
              <span className="truncate">{isAr ? deal.badgeAr : deal.badgeEn}</span>
            </span>
          ) : (
            <span />
          )}

          <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/25 tracking-wide font-numeric shrink-0">
            -{deal.discountPercent}%
          </span>
        </div>

        {/* Bottom Corner: Remaining Days Pill */}
        <div className="absolute bottom-2.5 rtl:right-2.5 ltr:left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90">
          <Calendar size={12} className="text-amber-400 shrink-0" />
          <span className="font-numeric">
            {isExpired
              ? (isAr ? 'ينتهي اليوم' : 'Ends today')
              : (isAr ? `متبقي ${deal.remainingDays} أيام` : `${deal.remainingDays} days left`)}
          </span>
        </div>
      </div>

      {/* Card Body Section (Clean separation from media) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        <div className="space-y-2">
          {/* Offer Title */}
          <h4 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight leading-snug group-hover:text-amber-500 transition-colors line-clamp-1">
            {isAr ? deal.titleAr : deal.titleEn}
          </h4>

          {/* Bundle Items Micro-Chips Breakdown (الوجبات والمكونات المشمولة في الباقة) */}
          {bundleItems.length > 1 ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {bundleItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 text-[11px] font-semibold"
                >
                  <Sparkles size={11} className="text-amber-500 shrink-0" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {isAr ? deal.descriptionAr : deal.descriptionEn}
            </p>
          )}

          {/* If chips are shown, show description snippet below */}
          {bundleItems.length > 1 && Boolean(isAr ? deal.descriptionAr : deal.descriptionEn) && (
            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed pt-1">
              {isAr ? deal.descriptionAr : deal.descriptionEn}
            </p>
          )}
        </div>

        {/* Pricing & Value Proposition Block */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Offer Price & Strikethrough Original Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight font-numeric leading-none">
                {formattedPrice}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                {isAr ? 'ل.س' : 'SYP'}
              </span>
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through font-numeric opacity-70">
                {formattedOrigPrice}
              </span>
            </div>

            {/* Savings Pill (مبلغ التوفير) */}
            {savingsAmount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold font-numeric whitespace-nowrap">
                <span>{isAr ? `وفر ${formattedSavings} ل.س` : `Save ${formattedSavings} SYP`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Status Switch + Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
          {/* Availability / Status Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={deal.isActive}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleActive(deal.id);
            }}
            className="flex items-center gap-2 group/toggle cursor-pointer select-none py-1"
            title={deal.isActive ? (isAr ? 'تعطيل العرض' : 'Disable offer') : (isAr ? 'تفعيل العرض' : 'Activate offer')}
          >
            <div
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 border ${
                deal.isActive
                  ? 'bg-emerald-500 border-emerald-400'
                  : 'bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  deal.isActive
                    ? (isAr ? '-translate-x-4' : 'translate-x-4')
                    : (isAr ? '-translate-x-0.5' : 'translate-x-0.5')
                }`}
              />
            </div>
            <span
              className={`text-xs font-bold transition-colors whitespace-nowrap ${
                deal.isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
            >
              {deal.isActive
                ? (isAr ? 'عرض نشط' : 'Active Offer')
                : (isAr ? 'معطل مؤقتاً' : 'Inactive')}
            </span>
          </button>

          {/* Action Buttons: Edit & Delete */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(deal);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 hover:bg-amber-500/10 text-slate-700 dark:text-zinc-300 hover:text-amber-500 border border-slate-200/80 dark:border-zinc-700/80 hover:border-amber-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title={isAr ? 'تعديل بيانات العرض' : 'Edit deal'}
            >
              <Edit3 size={13} className="text-amber-500" />
              <span>{isAr ? 'تعديل' : 'Edit'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(deal.id);
              }}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border border-slate-200/80 dark:border-zinc-700/80 hover:border-rose-500/30 transition-all active:scale-95 cursor-pointer"
              title={isAr ? 'حذف العرض' : 'Delete deal'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
