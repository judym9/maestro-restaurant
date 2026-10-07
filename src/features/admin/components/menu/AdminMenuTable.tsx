import React from 'react';
import {
  Edit3,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  Flame,
  Award,
  Leaf,
  CheckCircle2,
  XCircle,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { getMealImage } from '../../../../utils/imageRegistry';
import type { AdminMealItem } from '../../types/menu.types';

export interface AdminMenuTableProps {
  dishes: AdminMealItem[];
  categoryMap: Map<string, string>;
  onEdit: (meal: AdminMealItem) => void;
  onDuplicate: (meal: AdminMealItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export const AdminMenuTable: React.FC<AdminMenuTableProps> = ({
  dishes,
  categoryMap,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleAvailability,
}) => {
  const { language } = useLanguage();

  const resolveImage = (key: string) => {
    if (key.startsWith('http') || key.startsWith('data:')) return key;
    return getMealImage(key).src;
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/70 text-[var(--text-muted)] uppercase text-[11px] font-semibold tracking-wider">
              <th scope="col" className="py-4 px-4 text-start font-bold">
                {language === 'ar' ? 'الوجبة والصورة' : 'Dish & Presentation'}
              </th>
              <th scope="col" className="py-4 px-3 text-start font-bold">
                {language === 'ar' ? 'التصنيف' : 'Category'}
              </th>
              <th scope="col" className="py-4 px-3 text-start font-bold">
                {language === 'ar' ? 'السعر والعروض' : 'Price & Discount'}
              </th>
              <th scope="col" className="py-4 px-3 text-start font-bold">
                {language === 'ar' ? 'وقت التحضير' : 'Prep Time'}
              </th>
              <th scope="col" className="py-4 px-3 text-start font-bold">
                {language === 'ar' ? 'الشارات الترويجية' : 'Dietary Tags'}
              </th>
              <th scope="col" className="py-4 px-3 text-center font-bold">
                {language === 'ar' ? 'حالة التوفر' : 'Availability'}
              </th>
              <th scope="col" className="py-4 px-4 text-center font-bold">
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]/60">
            {dishes.map((meal) => {
              const imageSrc = resolveImage(meal.imageKey);
              const categoryTitle = categoryMap.get(meal.categoryId) || meal.categoryId;

              const formattedPrice = meal.price.toLocaleString('ar-SY');
              const formattedOriginal = meal.originalPrice?.toLocaleString('ar-SY');
              const discountPercent =
                meal.originalPrice && meal.originalPrice > meal.price
                  ? Math.round(((meal.originalPrice - meal.price) / meal.originalPrice) * 100)
                  : 0;

              return (
                <tr
                  key={meal.id}
                  className={`
                    group transition-colors duration-200 hover:bg-[var(--bg-surface-elevated)]/60
                    ${!meal.isAvailable ? 'opacity-65 grayscale-[30%]' : ''}
                  `}
                >
                  {/* Column 1: Dish Thumbnail & Details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--border-subtle)] shadow-sm">
                        <img
                          src={imageSrc}
                          alt={language === 'ar' ? meal.nameAr : meal.nameEn}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[var(--text-primary)] text-sm tracking-tight font-['Cairo',sans-serif] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-1">
                          {language === 'ar' ? meal.nameAr : meal.nameEn}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                          {language === 'ar' ? meal.descriptionAr : meal.descriptionEn}
                        </span>
                        {meal.options && meal.options.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-[var(--accent-gold)] mt-1 font-medium">
                            <Layers className="w-3 h-3" />
                            <span>
                              {meal.options.length} {language === 'ar' ? 'خيارات إضافية' : 'add-ons'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Category Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {categoryTitle}
                    </span>
                  </td>

                  {/* Column 3: Price & Discount */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[var(--accent-gold)] font-mono">
                        {formattedPrice} <span className="text-[10px] font-normal">{language === 'ar' ? 'ل.س' : 'SP'}</span>
                      </span>
                      {meal.originalPrice && meal.originalPrice > meal.price && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-[var(--text-muted)] line-through font-mono">
                            {formattedOriginal}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                            %{discountPercent}-
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 4: Prep Time */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{meal.prepTimeMinutes || 15} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                    </span>
                  </td>

                  {/* Column 5: Dietary Tags */}
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap items-center gap-1 max-w-[170px]">
                      {meal.isSignature && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'توقيع الشيف' : 'Signature'}</span>
                        </span>
                      )}
                      {meal.isBestseller && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                          <Award className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'الأكثر طلباً' : 'Bestseller'}</span>
                        </span>
                      )}
                      {meal.isSpicy && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/20">
                          <Flame className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'حار' : 'Spicy'}</span>
                        </span>
                      )}
                      {meal.isVegetarian && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          <Leaf className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'نباتي' : 'Veg'}</span>
                        </span>
                      )}
                      {!meal.isSignature && !meal.isBestseller && !meal.isSpicy && !meal.isVegetarian && (
                        <span className="text-[11px] text-[var(--text-muted)] italic">
                          {language === 'ar' ? 'وجبة كلاسيك' : 'Classic'}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 6: Availability Toggle Switch */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleAvailability(meal.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        meal.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/25 hover:bg-rose-500/25'
                      }`}
                      title={language === 'ar' ? 'انقر لتغيير التوفر' : 'Click to toggle availability'}
                    >
                      {meal.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{language === 'ar' ? 'متوفر' : 'In Stock'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{language === 'ar' ? 'غير متوفر' : 'Out of Stock'}</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Column 7: Action Buttons (Edit, Duplicate, Delete) */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(meal)}
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
                        title={language === 'ar' ? 'تعديل الوجبة' : 'Edit meal'}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(meal)}
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-sky-400 hover:border-sky-500/40 transition-colors cursor-pointer"
                        title={language === 'ar' ? 'تكرار الوجبة (نسخ الصنف)' : 'Duplicate dish'}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(meal.id)}
                        className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                        title={language === 'ar' ? 'حذف الوجبة' : 'Delete meal'}
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
    </div>
  );
};

export default AdminMenuTable;
