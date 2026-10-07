import React from 'react';
import { Sparkles, Clock, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { AdminPromoDeal } from '../../types/promotions.types';
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
  const { language } = useLanguage();
  const imageSrc = promo.imageKey.startsWith('http') || promo.imageKey.startsWith('data:')
    ? promo.imageKey
    : getMealImage(promo.imageKey).src;

  const formattedPrice = promo.price.toLocaleString('ar-SY');
  const formattedOriginal = promo.originalPrice.toLocaleString('ar-SY');
  const savings = Math.max(0, promo.originalPrice - promo.price);
  const formattedSavings = savings.toLocaleString('ar-SY');

  return (
    <div
      className={`
        flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]
        overflow-hidden transition-all duration-300 group hover:shadow-[var(--card-hover-shadow)]
        hover:border-[var(--border-hover)]
        ${!promo.isActive ? 'opacity-65 grayscale-[40%]' : ''}
      `}
    >
      {/* Banner Image with Overlays */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden shrink-0">
        <img
          src={imageSrc}
          alt={language === 'ar' ? promo.titleAr : promo.titleEn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 start-3 end-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md">
              <Sparkles className="w-3 h-3 stroke-[2.5]" />
              {language === 'ar' ? promo.badgeAr : promo.badgeEn}
            </span>

            {promo.featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-md">
                {language === 'ar' ? 'مميز' : 'Featured'}
              </span>
            )}
          </div>

          {/* Discount Pill */}
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md font-mono">
            -{promo.discountPercent}%
          </span>
        </div>

        {/* Expiration Timer (Bottom overlay) */}
        <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-xs text-white/95">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-sm border border-white/15 text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>
              {language === 'ar'
                ? `متبقي ${promo.remainingDays} أيام`
                : `${promo.remainingDays} Days Left`}
            </span>
          </span>

          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
              promo.isActive ? 'bg-emerald-500/80 text-black' : 'bg-rose-500/80 text-white'
            }`}
          >
            {promo.isActive ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                {language === 'ar' ? 'نشط' : 'Active'}
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                {language === 'ar' ? 'معطل' : 'Paused'}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-4">
        {/* Deal Title */}
        <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight line-clamp-1 mb-1 font-['Cairo',sans-serif]">
          {language === 'ar' ? promo.titleAr : promo.titleEn}
        </h3>

        {/* Description */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4 flex-1">
          {language === 'ar' ? promo.descriptionAr : promo.descriptionEn}
        </p>

        {/* Price & Savings Pill */}
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-black text-[var(--accent-gold)] font-mono">
              {formattedPrice} <span className="text-[10px] font-normal">{language === 'ar' ? 'ل.س' : 'SP'}</span>
            </span>
            <span className="text-[11px] line-through text-[var(--text-muted)] font-mono">
              {formattedOriginal} {language === 'ar' ? 'ل.س' : 'SP'}
            </span>
          </div>

          {savings > 0 && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              {language === 'ar' ? `وفر ${formattedSavings} ل.س` : `Save ${formattedSavings} SP`}
            </span>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
          {/* Active Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={promo.isActive}
              onChange={() => onToggleActive(promo.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative" />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {promo.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'متوقف' : 'Paused')}
            </span>
          </label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(promo)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
              title={language === 'ar' ? 'تعديل العرض' : 'Edit promotion'}
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(promo.id)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-rose-400 hover:border-rose-500/40 transition-colors"
              title={language === 'ar' ? 'حذف العرض' : 'Delete promotion'}
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
