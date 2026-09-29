import React from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { MealAssets } from '../../../../utils/imageRegistry';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import type { AdminDishItem, AdminCategoryItem } from '../../types/menu.types';

interface MealCardAdminProps {
  dish: AdminDishItem;
  categories: AdminCategoryItem[];
  onEdit: (dish: AdminDishItem) => void;
  onDelete: (id: string, name: string) => void;
  onToggleAvailability: (id: string) => void;
}

export const MealCardAdmin: React.FC<MealCardAdminProps> = ({
  dish,
  categories,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const { isRTL } = useAdminLanguage();
  const asset = MealAssets[dish.imageKey];
  const category = categories.find((c) => c.id === dish.categoryId);

  const currencySymbol = isRTL ? 'ل.س' : 'SYP';
  const formatPrice = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

  return (
    <div className="group relative rounded-3xl bg-[#141b29] border border-white/10 hover:border-amber-500/40 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
      {/* Dish Header & Image */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          {asset ? (
            <picture>
              {asset.webp && <source srcSet={asset.webp} type="image/webp" />}
              <img
                src={asset.src}
                alt={dish.nameEn}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </picture>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
              No image
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#141b29] via-transparent to-black/30" />

          {/* Badges on Top */}
          <div className="absolute top-3 start-3 end-3 flex items-center justify-between gap-2">
            {category && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/15">
                {isRTL ? category.nameAr : category.nameEn}
              </span>
            )}
            {dish.badge && (
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30">
                {dish.badge}
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                {dish.nameAr}
              </h4>
              <div className="text-xs text-slate-400 font-medium">{dish.nameEn}</div>
            </div>

            {/* Syrian Lira Price */}
            <div className="text-end shrink-0">
              <div className="text-base font-extrabold text-amber-400 tracking-tight">
                {formatPrice(dish.price)}{' '}
                <span className="text-xs font-semibold">{currencySymbol}</span>
              </div>
              {dish.originalPrice && dish.originalPrice > dish.price && (
                <div className="text-xs text-slate-500 line-through">
                  {formatPrice(dish.originalPrice)} {currencySymbol}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {isRTL ? dish.descriptionAr || dish.descriptionEn : dish.descriptionEn || dish.descriptionAr}
          </p>

          {dish.preparationTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <Clock size={13} className="text-amber-400" />
              <span>{dish.preparationTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls: Availability Toggle & Action Buttons */}
      <div className="p-4 px-6 bg-slate-950/40 border-t border-white/10 flex items-center justify-between gap-3">
        {/* Availability Toggle */}
        <button
          type="button"
          onClick={() => onToggleAvailability(dish.id)}
          className="inline-flex items-center gap-2 cursor-pointer transition-colors text-xs font-bold"
          title={isRTL ? 'تبديل التوافر للطلب' : 'Toggle availability'}
        >
          {dish.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <CheckCircle size={15} />
              <span>{isRTL ? 'متوفرة للطلب' : 'Available'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-rose-400">
              <XCircle size={15} />
              <span>{isRTL ? 'معطلة مؤقتاً' : 'Unavailable'}</span>
            </span>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(dish)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-colors border border-white/10 cursor-pointer"
            title={isRTL ? 'تعديل الوجبة' : 'Edit dish'}
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(dish.id, isRTL ? dish.nameAr : dish.nameEn)}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 transition-colors border border-rose-500/20 cursor-pointer"
            title={isRTL ? 'حذف الوجبة' : 'Delete dish'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
