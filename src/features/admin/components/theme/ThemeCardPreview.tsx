import React, { useState } from 'react';
import { Eye, Sun, Moon, Award, Sparkles, Star } from 'lucide-react';
import type { ThemeTokens } from '../../types/settings.types';
import { Card } from '../common/Card';
import { BrandAssets, MealAssets } from '../../../../utils/imageRegistry';

interface ThemeCardPreviewProps {
  tokens: ThemeTokens;
  language: 'ar' | 'en';
}

const getContrastTextColor = (hexColor?: string) => {
  if (!hexColor || !hexColor.startsWith('#')) return '#090d16';
  const hex = hexColor.replace('#', '');
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 145 ? '#090d16' : '#ffffff';
  }
  return '#090d16';
};

export const ThemeCardPreview: React.FC<ThemeCardPreviewProps> = ({
  tokens,
  language,
}) => {
  const isAr = language === 'ar';
  const [previewMode, setPreviewMode] = useState<'dark' | 'light'>('dark');

  const sampleMeal = {
    titleAr: 'برج شاورما مايسترو الملكي',
    titleEn: 'Maestro Royal Shawarma Tower',
    descAr: 'تحفة فنية فاخرة من لفائف الشاورما المقطعة مع صوصات المايسترو الخاصة وتشكيلة المخللات.',
    descEn: 'A magnificent multi-tiered celebration tower of sliced toasted shawarma rolls with toum dips.',
    price: 240000,
    categoryAr: 'الأطباق الملكية الخاصة',
    categoryEn: 'Royal Signature Platters',
    image: MealAssets['shawarma-tower']?.src || BrandAssets.fallback.src,
  };

  const isDark = previewMode === 'dark';
  const cardBg = isDark ? tokens.darkSurface : tokens.lightSurface;
  const pageBg = isDark ? tokens.darkBg : tokens.lightBg;
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? tokens.darkBorder : tokens.lightBorder;
  const buttonTextColor = getContrastTextColor(tokens.primaryAccent);

  return (
    <Card
      variant="default"
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <Eye size={20} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'المعاينة الحية للبطاقات والمكونات' : 'Live Card & Token Simulator'}
              </h3>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full max-w-full flex flex-col min-w-0">
        {/* Toggle / Tabs Attached directly to the top of the preview frame */}
        <div className="w-full flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800/80 mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'محاكاة بيئة العرض المباشرة:' : 'Live Simulation Canvas:'}
            </span>
          </div>

          {/* Segmented Mode Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setPreviewMode('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-amber-500/30 ring-1 ring-amber-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon size={14} className={isDark ? 'text-amber-400' : ''} />
              <span>{isAr ? 'النمط الداكن' : 'Dark Mode'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isDark
                  ? 'bg-white text-amber-600 shadow-sm border border-amber-500/30 ring-1 ring-amber-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun size={14} className={!isDark ? 'text-amber-600' : ''} />
              <span>{isAr ? 'النمط الفاتح' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Canvas Frame */}
        <div
          className="w-full max-w-full overflow-hidden rounded-3xl p-4 sm:p-10 flex flex-col items-center justify-center border transition-all duration-300 shadow-inner"
          style={{
            backgroundColor: pageBg,
            borderColor: borderColor,
          }}
        >
          {/* Sample Product Card */}
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border hover:scale-[1.01]"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
            }}
          >
            {/* Card Media */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={sampleMeal.image}
                alt="Preview Meal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black shadow-lg"
                  style={{
                    backgroundColor: tokens.primaryAccent,
                    color: buttonTextColor,
                  }}
                >
                  <Award size={13} />
                  <span>{isAr ? 'طبق ملكي مميز' : 'Signature Dish'}</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                  <Star size={12} className="fill-amber-400" />
                  <span>4.95</span>
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold"
                  style={{
                    backgroundColor: `${tokens.primaryAccent}18`,
                    color: tokens.primaryAccent,
                    border: `1px solid ${tokens.primaryAccent}33`,
                  }}
                >
                  <Sparkles size={11} />
                  <span>{isAr ? sampleMeal.categoryAr : sampleMeal.categoryEn}</span>
                </span>
              </div>

              <h4
                className="text-base font-bold tracking-tight"
                style={{ color: textColor }}
              >
                {isAr ? sampleMeal.titleAr : sampleMeal.titleEn}
              </h4>
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: mutedColor }}
              >
                {isAr ? sampleMeal.descAr : sampleMeal.descEn}
              </p>

              {/* Price & Action Button */}
              <div
                className="flex items-center justify-between pt-3.5 border-t"
                style={{ borderColor: borderColor }}
              >
                <div>
                  <span className="text-[10px] block opacity-75 font-semibold" style={{ color: mutedColor }}>
                    {isAr ? 'السعر للشخصين' : 'Price for two'}
                  </span>
                  <span
                    className="text-lg font-black"
                    style={{ color: tokens.primaryAccent }}
                  >
                    {sampleMeal.price.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                  </span>
                </div>

                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95 cursor-pointer hover:opacity-95"
                  style={{
                    backgroundColor: tokens.primaryAccent,
                    color: buttonTextColor,
                  }}
                >
                  {isAr ? 'إضافة للطلب' : 'Add to Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
