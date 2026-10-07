import React from 'react';
import {
  Edit3,
  Trash2,
  Clock,
  Sparkles,
  Flame,
  Award,
  Layers,
  Leaf,
  CheckCircle2,
  XCircle,
  Copy,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { AdminMealItem } from '../../types/menu.types';
import { getMealImage } from '../../../../utils/imageRegistry';

export interface MealCardProps {
  meal: AdminMealItem;
  categoryName?: string;
  onEdit: (meal: AdminMealItem) => void;
  onDuplicate?: (meal: AdminMealItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  categoryName,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleAvailability,
}) => {
  const { language } = useLanguage();
  const imageSrc = meal.imageKey.startsWith('http') || meal.imageKey.startsWith('data:')
    ? meal.imageKey
    : getMealImage(meal.imageKey).src;

  const formattedPrice = meal.price.toLocaleString('ar-SY');
  const formattedOriginal = meal.originalPrice?.toLocaleString('ar-SY');

  return (
    <div
      className={`
        flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]
        overflow-hidden transition-all duration-300 group hover:shadow-[var(--card-hover-shadow)]
        hover:border-[var(--border-hover)]
        ${!meal.isAvailable ? 'opacity-70 grayscale-[35%]' : ''}
      `}
    >
      {/* Card Image Banner & Badges */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden shrink-0">
        <img
          src={imageSrc}
          alt={language === 'ar' ? meal.nameAr : meal.nameEn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Dietary & Status Badges (Top) */}
        <div className="absolute top-3 start-3 end-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {meal.isSignature && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md">
                <Sparkles className="w-3 h-3 stroke-[2.5]" />
                {language === 'ar' ? 'توقيع الشيف' : 'Signature'}
              </span>
            )}
            {meal.isBestseller && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-md">
                <Award className="w-3 h-3 stroke-[2.5]" />
                {language === 'ar' ? 'الأكثر طلباً' : 'Bestseller'}
              </span>
            )}
            {meal.isSpicy && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-orange-600 text-white shadow-md">
                <Flame className="w-3 h-3 stroke-[2.5]" />
                {language === 'ar' ? 'حار' : 'Spicy'}
              </span>
            )}
            {meal.isVegetarian && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md">
                <Leaf className="w-3 h-3 stroke-[2.5]" />
                {language === 'ar' ? 'نباتي' : 'Veg'}
              </span>
            )}
          </div>

          {/* Quick Availability Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md shrink-0 ${
              meal.isAvailable
                ? 'bg-emerald-500/90 text-black backdrop-blur-sm'
                : 'bg-rose-500/90 text-white backdrop-blur-sm'
            }`}
          >
            {meal.isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                {language === 'ar' ? 'متوفر' : 'In Stock'}
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 stroke-[2.5]" />
                {language === 'ar' ? 'غير متوفر' : 'Out of Stock'}
              </>
            )}
          </span>
        </div>

        {/* Category & Prep Time (Bottom overlay) */}
        <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-xs text-white/90">
          {categoryName && (
            <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/15 font-medium">
              {categoryName}
            </span>
          )}

          {meal.prepTimeMinutes && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/15 text-[11px]">
              <Clock className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>{meal.prepTimeMinutes} {language === 'ar' ? 'دقيقة' : 'mins'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 flex flex-col p-4">
        {/* Name & Pricing */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight line-clamp-1 font-['Cairo',sans-serif]">
            {language === 'ar' ? meal.nameAr : meal.nameEn}
          </h3>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-base font-black text-[var(--accent-gold)] font-mono">
              {formattedPrice} <span className="text-[11px] font-normal">{language === 'ar' ? 'ل.س' : 'SP'}</span>
            </span>
            {formattedOriginal && (
              <span className="text-[11px] line-through text-[var(--text-muted)] font-mono">
                {formattedOriginal} {language === 'ar' ? 'ل.س' : 'SP'}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4 flex-1">
          {language === 'ar' ? meal.descriptionAr : meal.descriptionEn}
        </p>

        {/* Options & Ingredients Indicators */}
        <div className="flex items-center gap-2 mb-4 pt-2 border-t border-[var(--border-subtle)]/60 text-[11px] text-[var(--text-secondary)]">
          {meal.options && meal.options.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <Layers className="w-3 h-3 text-[var(--accent-gold)]" />
              <span>{meal.options.length} {language === 'ar' ? 'خيارات' : 'options'}</span>
            </span>
          )}

          {meal.ingredientsAr && meal.ingredientsAr.length > 0 && (
            <span className="truncate text-[var(--text-muted)]">
              {language === 'ar' ? meal.ingredientsAr.slice(0, 3).join(' • ') : meal.ingredientsEn.slice(0, 3).join(' • ')}
            </span>
          )}
        </div>

        {/* Card Controls & Actions Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
          {/* Availability Toggle Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={meal.isAvailable}
              onChange={() => onToggleAvailability(meal.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative" />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {meal.isAvailable ? (language === 'ar' ? 'متاح' : 'Available') : (language === 'ar' ? 'معطل' : 'Disabled')}
            </span>
          </label>

          {/* Action Buttons: Edit, Duplicate & Delete */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(meal)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
              title={language === 'ar' ? 'تعديل الوجبة' : 'Edit meal'}
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(meal)}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-sky-400 hover:border-sky-500/40 transition-colors cursor-pointer"
                title={language === 'ar' ? 'نسخ الصنف (تكرار)' : 'Duplicate dish'}
              >
                <Copy className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onDelete(meal.id)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
              title={language === 'ar' ? 'حذف الوجبة' : 'Delete meal'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
