import React, { useState } from 'react';
import {
  Eye,
  Sun,
  Moon,
  Award,
  Sparkles,
  Star,
  ShoppingBag,
  Bell,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import type { ThemeTokens } from '../../types/settings.types';
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
  const cardBg = isDark ? (tokens.darkSurface || '#1A1D24') : (tokens.lightSurface || '#FFFFFF');
  const pageBg = isDark ? (tokens.darkBg || '#0B0F17') : (tokens.lightBg || '#FAF7F2');
  const textColor = isDark ? '#F9FAFB' : '#0F172A';
  const mutedColor = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? (tokens.darkBorder || 'rgba(255, 255, 255, 0.1)') : (tokens.lightBorder || 'rgba(226, 232, 240, 0.8)');
  const primaryAccent = tokens.primaryAccent || '#D97706';
  const secondaryAccent = tokens.secondaryAccent || '#F59E0B';
  const successColor = tokens.successColor || '#10B981';
  const fontFamily = tokens.fontFamily || 'Cairo';
  const buttonTextColor = getContrastTextColor(primaryAccent);

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm space-y-5">
      {/* Header & Simulator Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <Eye size={16} />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'شاشة المعاينة الحية التفاعلية' : 'Live Interactive Canvas'}
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 block">
              {isAr ? 'انعكاس فوري للألوان والخطوط' : 'Real-time UI component simulation'}
            </span>
          </div>
        </div>

        {/* Mode Selector Switch */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPreviewMode('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-zinc-900 text-amber-400 shadow-sm border border-amber-500/30'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <Moon size={13} className={isDark ? 'text-amber-400' : ''} />
            <span>{isAr ? 'الداكن' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isDark
                ? 'bg-white text-amber-600 shadow-sm border border-amber-500/30'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <Sun size={13} className={!isDark ? 'text-amber-600' : ''} />
            <span>{isAr ? 'الفاتح' : 'Light'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Canvas Frame */}
      <div
        className="w-full rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border transition-all duration-300 shadow-inner overflow-hidden"
        style={{
          backgroundColor: pageBg,
          borderColor: borderColor,
          fontFamily: `${fontFamily}, sans-serif`,
        }}
      >
        {/* Component 1: Mini Store Header / Navigation Mockup */}
        <div
          className="p-3 rounded-xl border flex items-center justify-between gap-3 shadow-xs transition-colors"
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-950 p-1 shrink-0 flex items-center justify-center">
              <img
                src={tokens.logoUrl || BrandAssets.logo.src}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-black block" style={{ color: textColor }}>
                {isAr ? 'مايسترو النبك' : 'Maestro Al-Nabek'}
              </span>
              <div className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: successColor }}
                />
                <span className="text-[9px] font-semibold" style={{ color: successColor }}>
                  {isAr ? 'مفتوح للطلب' : 'Open'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
              style={{
                backgroundColor: `${primaryAccent}20`,
                color: primaryAccent,
              }}
            >
              <ShoppingBag size={11} />
              <span>3</span>
            </span>
          </div>
        </div>

        {/* Component 2: Sample Royal Meal Card */}
        <div
          className="w-full rounded-2xl overflow-hidden shadow-lg border transition-all"
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
          }}
        >
          {/* Meal Photo Container */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={sampleMeal.image}
              alt="Meal Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black shadow-md"
                style={{
                  backgroundColor: primaryAccent,
                  color: buttonTextColor,
                }}
              >
                <Award size={11} />
                <span>{isAr ? 'طبق ملكي مميز' : 'Signature'}</span>
              </span>

              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-white/10">
                <Star size={10} className="fill-amber-400" />
                <span>4.95</span>
              </span>
            </div>
          </div>

          {/* Meal Body */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
                style={{
                  backgroundColor: `${primaryAccent}18`,
                  color: primaryAccent,
                  border: `1px solid ${primaryAccent}33`,
                }}
              >
                <Sparkles size={10} />
                <span>{isAr ? sampleMeal.categoryAr : sampleMeal.categoryEn}</span>
              </span>
            </div>

            <h4
              className="text-sm font-black tracking-tight"
              style={{ color: textColor }}
            >
              {isAr ? sampleMeal.titleAr : sampleMeal.titleEn}
            </h4>

            <p
              className="text-[11px] leading-relaxed line-clamp-2"
              style={{ color: mutedColor }}
            >
              {isAr ? sampleMeal.descAr : sampleMeal.descEn}
            </p>

            {/* Price & Action Button */}
            <div
              className="flex items-center justify-between pt-3 border-t"
              style={{ borderColor: borderColor }}
            >
              <div>
                <span className="text-[9px] block opacity-70 font-semibold" style={{ color: mutedColor }}>
                  {isAr ? 'السعر' : 'Price'}
                </span>
                <span
                  className="text-base font-black font-numeric"
                  style={{ color: primaryAccent }}
                >
                  {sampleMeal.price.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                </span>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                style={{
                  backgroundColor: primaryAccent,
                  color: buttonTextColor,
                }}
              >
                <span>{isAr ? 'إضافة للطلب' : 'Order'}</span>
                <ArrowIcon size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Component 3: Showcase of UI Chips, Buttons & Badges */}
        <div
          className="p-3.5 rounded-xl border space-y-3"
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
          }}
        >
          <span className="text-[10px] font-bold block" style={{ color: mutedColor }}>
            {isAr ? 'عناصر واجهة المستخدم التفاعلية:' : 'UI Micro-Components:'}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Filled Button */}
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              style={{
                backgroundColor: primaryAccent,
                color: buttonTextColor,
              }}
            >
              {isAr ? 'زر أساسي' : 'Primary'}
            </button>

            {/* Outline Button */}
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer active:scale-95"
              style={{
                border: `1.5px solid ${primaryAccent}`,
                color: primaryAccent,
                backgroundColor: 'transparent',
              }}
            >
              {isAr ? 'زر مفرغ' : 'Outline'}
            </button>

            {/* Promo Discount Badge */}
            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
              style={{
                backgroundColor: `${secondaryAccent}20`,
                color: secondaryAccent,
                border: `1px solid ${secondaryAccent}40`,
              }}
            >
              {isAr ? 'خصم -25%' : '-25% OFF'}
            </span>

            {/* Success Open Badge */}
            <span
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
              style={{
                backgroundColor: `${successColor}20`,
                color: successColor,
                border: `1px solid ${successColor}40`,
              }}
            >
              {isAr ? 'متاح للطلب' : 'Available'}
            </span>
          </div>
        </div>

        {/* Component 4: Top Announcement Alert Banner */}
        <div
          className="p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold"
          style={{
            backgroundColor: `${primaryAccent}12`,
            borderColor: `${primaryAccent}33`,
            color: primaryAccent,
          }}
        >
          <Bell size={13} className="shrink-0" />
          <span className="truncate">
            {isAr
              ? 'نستقبلكم بكل حب وسرور يومياً في فرع النبك وخدمة التوصيل السريع متاحة!'
              : 'Warmly welcoming you daily in Al-Nabek with express delivery!'}
          </span>
        </div>
      </div>
    </div>
  );
};
