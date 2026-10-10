import React from 'react';
import {
  Calendar,
  Tag,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Percent,
  Sparkles,
} from 'lucide-react';
import type { AdminPromoDeal } from '../../types/promotions.types';
import {
  calculateDiscountPercentage,
  calculateSavings,
  parseBundleItems,
  formatCurrencySYP,
} from '../../utils/mathCalculations';
import { getMealImage } from '../../../../utils/imageRegistry';

export interface PromoCardProps {
  promo: AdminPromoDeal;
  onEdit: (promo: AdminPromoDeal) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  promo,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const discountPercent =
    promo.discountPercent ||
    calculateDiscountPercentage(promo.originalPrice, promo.price);
  const savingsAmount = calculateSavings(promo.originalPrice, promo.price);
  const bundleItems = parseBundleItems(promo.titleAr);
  const imageAsset = getMealImage(promo.imageKey || 'shawarma-tower');

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-[#0b101b] border transition-all duration-200 shadow-xl ${
        promo.isActive
          ? 'border-slate-800 hover:border-amber-500/40 hover:shadow-amber-500/5'
          : 'border-slate-800/60 opacity-75'
      }`}
    >
      {/* Promo Visual Header */}
      <div className="relative h-48 w-full bg-slate-900 rounded-t-2xl overflow-hidden">
        <img
          src={imageAsset.webp || imageAsset.src}
          alt={promo.titleAr}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101b] via-transparent to-black/50" />

        {/* Top Badges */}
        <div className="absolute top-4 start-4 flex flex-wrap gap-2 z-10">
          {discountPercent > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md font-mono flex items-center gap-1">
              <Percent className="w-3 h-3" />
              <span>خصم {discountPercent}%</span>
            </span>
          )}
          {promo.badgeAr && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{promo.badgeAr}</span>
            </span>
          )}
        </div>

        {/* Countdown / Remaining Days Chip */}
        <div className="absolute top-4 end-4 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>متبقي {promo.remainingDays} أيام</span>
          </span>
        </div>

        {/* Active Switch Overlay */}
        <div className="absolute bottom-4 end-4 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(promo.id);
            }}
            title={promo.isActive ? 'إيقاف نشر العرض' : 'تنشيط ونشر العرض'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all shadow-md ${
              promo.isActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {promo.isActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>عرض نشط</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>متوقف</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Promo Content */}
      <div className="px-5 sm:px-6 pt-5 pb-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            {promo.titleAr}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {promo.titleEn}
          </p>

          {promo.descriptionAr && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {promo.descriptionAr}
            </p>
          )}

          {/* Parsed Bundle Items Chips */}
          {bundleItems.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {bundleItems.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1 shadow-sm"
                >
                  <Tag className="w-3 h-3 text-amber-500" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Actions Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {/* Price & Savings */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-amber-400 font-mono">
                {formatCurrencySYP(promo.price)}
              </span>
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatCurrencySYP(promo.originalPrice)}
              </span>
            </div>

            {savingsAmount > 0 && (
              <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">
                توفير صافي للزبون: {formatCurrencySYP(savingsAmount)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(promo)}
              title="تعديل العرض"
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(promo.id)}
              title="حذف العرض"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;
