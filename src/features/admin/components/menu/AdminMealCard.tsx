import React from 'react';
import { Edit3, Trash2, Flame, Award, Star, Sparkles } from 'lucide-react';
import type { AdminMealItem } from '../../types/menu.types';
import { getMealImage } from '../../../../utils/imageRegistry';

interface AdminMealCardProps {
  meal: AdminMealItem;
  categoryName?: string;
  onEdit: (meal: AdminMealItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  language: 'ar' | 'en';
}

export const AdminMealCard: React.FC<AdminMealCardProps> = ({
  meal,
  categoryName,
  onEdit,
  onDelete,
  onToggleAvailability,
  language,
}) => {
  const isAr = language === 'ar';
  const imgAsset = getMealImage(meal.imageKey);

  const formattedPrice = new Intl.NumberFormat(isAr ? 'ar-SY' : 'en-US').format(meal.price);
  const formattedOrigPrice = meal.originalPrice
    ? new Intl.NumberFormat(isAr ? 'ar-SY' : 'en-US').format(meal.originalPrice)
    : null;

  const discountPercent =
    meal.originalPrice && meal.originalPrice > meal.price
      ? Math.round(((meal.originalPrice - meal.price) / meal.originalPrice) * 100)
      : 0;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border transition-all duration-200 bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-md min-w-0 ${
        meal.isAvailable
          ? 'border-slate-200 dark:border-zinc-800 hover:border-amber-500/40 dark:hover:border-amber-500/40'
          : 'border-slate-200/80 dark:border-zinc-800/80 opacity-85'
      }`}
    >
      {/* Top Subtle Accent Strip on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-300 rounded-t-xl pointer-events-none z-10" />

      {/* Top Media Banner (Clean 16:10 aspect ratio, no dark overlay blocking text) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-zinc-950 rounded-t-xl">
        <picture>
          {imgAsset.webp && <source srcSet={imgAsset.webp} type="image/webp" />}
          <img
            src={imgAsset.src}
            alt={isAr ? meal.nameAr : meal.nameEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </picture>

        {/* Minimal Gradient for Corner Badge Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges (Floating Pills) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {meal.isSignature && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-black tracking-wide shadow-sm">
                <Award size={12} />
                <span>{isAr ? 'ملكي' : 'Signature'}</span>
              </span>
            )}
            {meal.isBestseller && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black tracking-wide shadow-sm">
                <Sparkles size={12} />
                <span>{isAr ? 'الأكثر طلباً' : 'Bestseller'}</span>
              </span>
            )}
            {meal.isSpicy && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black tracking-wide shadow-sm">
                <Flame size={12} />
                <span>{isAr ? 'حار' : 'Spicy'}</span>
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold">
            <Star size={11} className="fill-amber-400" />
            <span className="font-numeric">{meal.rating}</span>
          </div>
        </div>

        {/* Category Pill Floating in Corner */}
        {categoryName && (
          <div className="absolute bottom-2.5 rtl:right-2.5 ltr:left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90">
            {categoryName}
          </div>
        )}
      </div>

      {/* Card Content Section (Separated from photo) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 min-w-0">
        <div className="space-y-1.5">
          {/* Title */}
          <h4 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight leading-snug group-hover:text-amber-500 transition-colors line-clamp-1">
            {isAr ? meal.nameAr : meal.nameEn}
          </h4>

          {/* Description Snippet */}
          {Boolean(isAr ? meal.descriptionAr : meal.descriptionEn) ? (
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
              {isAr ? meal.descriptionAr : meal.descriptionEn}
            </p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
              {isAr ? 'وجبة مميزة تحضر بأعلى معايير الجودة' : 'Specially prepared with premium ingredients'}
            </p>
          )}
        </div>

        {/* Price & Discount Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight font-numeric leading-none">
              {formattedPrice}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              {isAr ? 'ل.س' : 'SYP'}
            </span>
            {formattedOrigPrice && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through mr-1 rtl:mr-1.5 opacity-70 font-numeric">
                {formattedOrigPrice}
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 font-numeric whitespace-nowrap">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Footer Row: Availability Toggle + Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
          {/* Availability Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={meal.isAvailable}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleAvailability(meal.id);
            }}
            className="flex items-center gap-2 group/toggle cursor-pointer select-none py-1"
            title={meal.isAvailable ? (isAr ? 'تعطيل توفر الوجبة' : 'Disable availability') : (isAr ? 'تفعيل توفر الوجبة' : 'Enable availability')}
          >
            <div
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 border ${
                meal.isAvailable
                  ? 'bg-emerald-500 border-emerald-400'
                  : 'bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  meal.isAvailable
                    ? (isAr ? '-translate-x-4' : 'translate-x-4')
                    : (isAr ? '-translate-x-0.5' : 'translate-x-0.5')
                }`}
              />
            </div>
            <span
              className={`text-xs font-bold transition-colors whitespace-nowrap ${
                meal.isAvailable
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
            >
              {meal.isAvailable ? (isAr ? 'متاح للطلب' : 'Available') : (isAr ? 'غير متاح' : 'Unavailable')}
            </span>
          </button>

          {/* Action Buttons: Quick Edit & Delete */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(meal);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 hover:bg-amber-500/10 text-slate-700 dark:text-zinc-300 hover:text-amber-500 border border-slate-200/80 dark:border-zinc-700/80 hover:border-amber-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title={isAr ? 'تعديل بيانات الوجبة' : 'Edit meal'}
            >
              <Edit3 size={13} className="text-amber-500" />
              <span>{isAr ? 'تعديل' : 'Edit'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(meal.id);
              }}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border border-slate-200/80 dark:border-zinc-700/80 hover:border-rose-500/30 transition-all active:scale-95 cursor-pointer"
              title={isAr ? 'حذف الوجبة' : 'Delete meal'}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
