import React from 'react';
import {
  Edit2,
  Copy,
  Trash2,
  Clock,
  Crown,
  Sparkles,
  Flame,
  Leaf,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { AdminMealItem, CategoryItem } from '../../types/menu.types';
import { calculateDiscountPercentage, formatCurrencySYP } from '../../utils/mathCalculations';
import { getMealImage } from '../../../../utils/imageRegistry';

export interface AdminMenuTableProps {
  dishes: AdminMealItem[];
  categories: CategoryItem[];
  onEdit: (meal: AdminMealItem) => void;
  onDuplicate: (meal: AdminMealItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export const AdminMenuTable: React.FC<AdminMenuTableProps> = ({
  dishes,
  categories,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleAvailability,
}) => {
  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? `${cat.icon || '🍽️'} ${cat.nameAr}` : 'غير مصنف';
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-[#0b101b] shadow-xl">
      <table className="w-full text-start border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-[#0e1422] text-slate-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
            <th className="py-4 ps-6 pe-4 text-start">الوجبة</th>
            <th className="py-4 px-4 sm:px-5 text-start">التصنيف</th>
            <th className="py-4 px-4 sm:px-5 text-start">السعر (SYP)</th>
            <th className="py-4 px-4 sm:px-5 text-start">التحضير</th>
            <th className="py-4 px-4 sm:px-5 text-start">الخصائص</th>
            <th className="py-4 px-4 sm:px-5 text-center">التوفر</th>
            <th className="py-4 ps-4 pe-6 text-end">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {dishes.map((meal) => {
            const imageAsset = getMealImage(meal.imageKey);
            const discount = calculateDiscountPercentage(meal.originalPrice, meal.price);

            return (
              <tr
                key={meal.id}
                className="hover:bg-slate-900/60 transition-colors group"
              >
                {/* Dish info & image */}
                <td className="py-3.5 ps-6 pe-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageAsset.webp || imageAsset.src}
                      alt={meal.nameAr}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700/60 shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-white block group-hover:text-amber-400 transition-colors truncate">
                        {meal.nameAr}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block truncate">
                        {meal.nameEn}
                      </span>
                      {meal.options && meal.options.length > 0 && (
                        <span className="text-[10px] text-amber-500 font-medium">
                          {meal.options.length} إضافات متوفرة
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
                    {getCategoryName(meal.categoryId)}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-amber-400 font-mono">
                      {formatCurrencySYP(meal.price)}
                    </span>
                    {discount > 0 && meal.originalPrice && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-500 line-through font-mono">
                          {formatCurrencySYP(meal.originalPrice)}
                        </span>
                        <span className="text-rose-400 font-bold font-mono">
                          -{discount}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Prep Time */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>{meal.prepTimeMinutes || 15} دقيقة</span>
                  </span>
                </td>

                {/* Badges / Dietary Flags */}
                <td className="py-3.5 px-4 sm:px-5">
                  <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                    {meal.isSignature && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        <span>توقيع الشيف</span>
                      </span>
                    )}
                    {meal.isBestseller && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>الأكثر طلباً</span>
                      </span>
                    )}
                    {meal.isSpicy && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>حار</span>
                      </span>
                    )}
                    {meal.isVegetarian && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        <span>نباتي</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Availability Toggle */}
                <td className="py-3.5 px-4 sm:px-5 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onToggleAvailability(meal.id)}
                    title={meal.isAvailable ? 'تعطيل التوفر' : 'تفعيل التوفر'}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      meal.isAvailable
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                    }`}
                  >
                    {meal.isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>متوفر</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>معطل</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3.5 ps-4 pe-6 text-end whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDuplicate(meal)}
                      title="نسخ وتكرار الوجبة"
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(meal)}
                      title="تعديل الوجبة"
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(meal.id)}
                      title="حذف الوجبة"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMenuTable;
