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

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl ${
        meal.isAvailable
          ? 'bg-card border-border hover:border-amber-500/40'
          : 'bg-card/60 border-border opacity-75'
      }`}
    >
      {/* Top Media Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <picture>
          {imgAsset.webp && <source srcSet={imgAsset.webp} type="image/webp" />}
          <img
            src={imgAsset.src}
            alt={isAr ? meal.nameAr : meal.nameEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </picture>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {meal.isSignature && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-black tracking-wide shadow-md">
                <Award size={13} />
                <span>{isAr ? 'ملكي فاخر' : 'Signature'}</span>
              </span>
            )}
            {meal.isSpicy && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-black tracking-wide shadow-md">
                <Flame size={13} />
                <span>{isAr ? 'حار' : 'Spicy'}</span>
              </span>
            )}
            {meal.isBestseller && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-black tracking-wide shadow-md">
                <Sparkles size={13} />
                <span>{isAr ? 'الأكثر طلباً' : 'Bestseller'}</span>
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold">
            <Star size={12} className="fill-amber-400" />
            <span>{meal.rating}</span>
          </div>
        </div>

        {/* Category Pill on bottom of image */}
        {categoryName && (
          <div className="absolute bottom-3 rtl:right-3 ltr:left-3 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200">
            {categoryName}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-amber-500 transition-colors">
            {isAr ? meal.nameAr : meal.nameEn}
          </h4>
        </div>

        {/* 2-Row Footer Structure */}
        <div className="space-y-3 pt-3 border-t border-border">
          {/* Row 1: Prominent Price & Availability Toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight font-mono">
                {formattedPrice}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {isAr ? 'ل.س' : 'SYP'}
              </span>
              {formattedOrigPrice && (
                <span className="text-xs text-muted-foreground line-through mr-1 rtl:mr-1.5 opacity-60">
                  {formattedOrigPrice}
                </span>
              )}
            </div>

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
                    : 'bg-muted border-border'
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
                className={`text-xs font-bold transition-colors ${
                  meal.isAvailable
                    ? 'text-emerald-500'
                    : 'text-muted-foreground'
                }`}
              >
                {meal.isAvailable ? (isAr ? 'متوفر' : 'Available') : (isAr ? 'غير متوفر' : 'Unavailable')}
              </span>
            </button>
          </div>

          {/* Row 2: Subtle Divider & Spaced Action Buttons */}
          <div className="pt-2.5 border-t border-border flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(meal);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card hover:bg-amber-500/10 text-foreground hover:text-amber-500 border border-border hover:border-amber-500/30 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title={isAr ? 'تعديل بيانات الوجبة' : 'Edit meal'}
            >
              <Edit3 size={14} className="text-amber-500" />
              <span>{isAr ? 'تعديل سريع' : 'Quick Edit'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(meal.id);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 border border-border hover:border-rose-500/30 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title={isAr ? 'حذف الوجبة' : 'Delete meal'}
            >
              <Trash2 size={14} className="text-rose-500" />
              <span>{isAr ? 'حذف' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
