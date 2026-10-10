import React from 'react';
import {
  Clock,
  Edit2,
  Copy,
  Trash2,
  Flame,
  Crown,
  Sparkles,
  Leaf,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { AdminMealItem, CategoryItem } from '../../types/menu.types';
import { calculateDiscountPercentage, formatCurrencySYP } from '../../utils/mathCalculations';
import { getMealImage } from '../../../../utils/imageRegistry';

export interface MealCardProps {
  meal: AdminMealItem;
  category?: CategoryItem;
  onEdit: (meal: AdminMealItem) => void;
  onDuplicate: (meal: AdminMealItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  category,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleAvailability,
}) => {
  const discountPercent = calculateDiscountPercentage(meal.originalPrice, meal.price);
  const imageAsset = getMealImage(meal.imageKey);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-[#0b101b] border transition-all duration-200 shadow-lg ${
        meal.isAvailable
          ? 'border-slate-800 hover:border-amber-500/40 hover:shadow-amber-500/5'
          : 'border-slate-800/60 opacity-75 grayscale-[30%]'
      }`}
    >
      {/* Dish Visual Header */}
      <div className="relative h-44 w-full bg-slate-900 rounded-t-2xl overflow-hidden">
        <img
          src={imageAsset.webp || imageAsset.src}
          alt={meal.nameAr}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101b] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-4 start-4 flex flex-wrap gap-2 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm font-mono">
              خصم {discountPercent}%
            </span>
          )}
          {meal.isSignature && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
              <Crown className="w-3.5 h-3.5" />
              <span>توقيع الشيف</span>
            </span>
          )}
          {meal.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الأكثر طلباً</span>
            </span>
          )}
        </div>

        {/* Availability Quick Switch in Top End Corner */}
        <div className="absolute top-4 end-4 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAvailability(meal.id);
            }}
            title={meal.isAvailable ? 'تعطيل التوفر مؤقتاً' : 'تفعيل التوفر للطلب'}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-sm ${
              meal.isAvailable
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {meal.isAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>متوفر</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>غير متوفر</span>
              </>
            )}
          </button>
        </div>

        {/* Category Chip */}
        {category && (
          <div className="absolute bottom-3 start-4 z-10">
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/70 text-slate-200 backdrop-blur-md border border-white/10 shadow-sm">
              {category.icon || '🍽️'} {category.nameAr}
            </span>
          </div>
        )}
      </div>

      {/* Dish Body Details */}
      <div className="px-5 sm:px-6 pt-4.5 pb-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2.5">
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {meal.nameAr}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                {meal.nameEn}
              </p>
            </div>

            {/* Preparation Time */}
            {meal.prepTimeMinutes && (
              <span className="shrink-0 flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{meal.prepTimeMinutes} د</span>
              </span>
            )}
          </div>

          {meal.descriptionAr && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {meal.descriptionAr}
            </p>
          )}

          {/* Dietary Flags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meal.isSpicy && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                <span>حار</span>
              </span>
            )}
            {meal.isVegetarian && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                <span>نباتي</span>
              </span>
            )}
            {meal.isNew && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                جديد
              </span>
            )}
            {meal.options && meal.options.length > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-400">
                {meal.options.length} إضافات/أحجام
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Buttons Footer */}
        <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {/* Prices */}
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-amber-400 font-mono">
              {formatCurrencySYP(meal.price)}
            </span>
            {meal.originalPrice && meal.originalPrice > meal.price && (
              <span className="text-[11px] text-slate-500 line-through font-mono">
                {formatCurrencySYP(meal.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicate(meal)}
              title="نسخ وتكرار الوجبة"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(meal)}
              title="تعديل الوجبة"
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(meal.id)}
              title="حذف الوجبة"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
