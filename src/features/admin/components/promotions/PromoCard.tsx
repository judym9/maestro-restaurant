import React from 'react';
import { Edit3, Trash2, Tag, Calendar } from 'lucide-react';
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

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl ${
        deal.isActive
          ? 'bg-card border-border hover:border-amber-500/40'
          : 'bg-card/60 border-border opacity-70'
      }`}
    >
      {/* Banner Media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <picture>
          {imgAsset.webp && <source srcSet={imgAsset.webp} type="image/webp" />}
          <img
            src={imgAsset.src}
            alt={isAr ? deal.titleAr : deal.titleEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </picture>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/35 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none">
          {deal.badgeAr && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-md">
              <Tag size={12} className="text-amber-400" />
              <span>{isAr ? deal.badgeAr : deal.badgeEn}</span>
            </span>
          )}

          <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 tracking-wider font-mono">
            -{deal.discountPercent}%
          </span>
        </div>

        {/* Remaining Days Bottom Badge */}
        <div className="absolute bottom-3 rtl:right-3 ltr:left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200">
          <Calendar size={13} className="text-amber-400" />
          <span>
            {deal.remainingDays > 0
              ? (isAr ? `متبقي ${deal.remainingDays} أيام` : `${deal.remainingDays} days left`)
              : (isAr ? 'ينتهي اليوم' : 'Ends today')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-amber-500 transition-colors">
            {isAr ? deal.titleAr : deal.titleEn}
          </h4>
        </div>

        {/* 2-Row Footer Structure */}
        <div className="space-y-3 pt-3 border-t border-border">
          {/* Row 1: Prominent Price, Savings & Availability Toggle */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight font-mono">
                  {formattedPrice}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {isAr ? 'ل.س' : 'SYP'}
                </span>
                <span className="text-xs text-muted-foreground line-through mr-1 rtl:mr-1.5 font-mono opacity-60">
                  {formattedOrigPrice}
                </span>
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">
                {isAr
                  ? `وفر ${(deal.originalPrice - deal.price).toLocaleString()} ل.س`
                  : `Save ${(deal.originalPrice - deal.price).toLocaleString()} SYP`}
              </div>
            </div>

            {/* Availability Toggle Switch */}
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
              title={deal.isActive ? (isAr ? 'تعطيل العرض' : 'Disable deal') : (isAr ? 'تفعيل العرض' : 'Activate deal')}
            >
              <div
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 border ${
                  deal.isActive
                    ? 'bg-emerald-500 border-emerald-400'
                    : 'bg-muted border-border'
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
                className={`text-xs font-bold transition-colors ${
                  deal.isActive
                    ? 'text-emerald-500'
                    : 'text-muted-foreground'
                }`}
              >
                {deal.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Off')}
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
                onEdit(deal);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card hover:bg-amber-500/10 text-foreground hover:text-amber-500 border border-border hover:border-amber-500/30 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title={isAr ? 'تعديل بيانات العرض' : 'Edit deal'}
            >
              <Edit3 size={14} className="text-amber-500" />
              <span>{isAr ? 'تعديل سريع' : 'Quick Edit'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(deal.id);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 border border-border hover:border-rose-500/30 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title={isAr ? 'حذف العرض' : 'Delete deal'}
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

