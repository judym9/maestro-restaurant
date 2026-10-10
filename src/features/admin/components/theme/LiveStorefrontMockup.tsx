import React, { useState } from 'react';
import { Moon, Sun, ShoppingBag, Crown, Sparkles } from 'lucide-react';
import type { ThemeTokens } from '../../types/settings.types';
import { getOptimalButtonTextColor } from '../../utils/themeContrast';

export interface LiveStorefrontMockupProps {
  tokens: ThemeTokens;
}

export const LiveStorefrontMockup: React.FC<LiveStorefrontMockupProps> = ({
  tokens,
}) => {
  const [previewMode, setPreviewMode] = useState<'dark' | 'light'>('dark');

  const isDark = previewMode === 'dark';
  const bgColor = isDark ? tokens.darkBg : tokens.lightBg;
  const surfaceColor = isDark ? tokens.darkSurface : tokens.lightSurface;
  const textColor = isDark ? tokens.darkText || '#FFFDF8' : tokens.lightText || '#0F172A';
  const borderColor = isDark ? tokens.darkBorder : tokens.lightBorder;
  const buttonTextColor = getOptimalButtonTextColor(tokens.primaryAccent);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>محاكي واجهة المتجر الحية (Live Storefront Simulator)</span>
        </span>

        {/* Toggle Dark/Light Simulator mode */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setPreviewMode('dark')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              isDark
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>ليلي</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('light')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              !isDark
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>نهاري</span>
          </button>
        </div>
      </div>

      {/* Mockup Canvas */}
      <div
        className="rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          fontFamily: tokens.fontFamily || 'Cairo, sans-serif',
        }}
      >
        {/* Mock Top Navbar */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between transition-colors rounded-t-2xl"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: buttonTextColor,
              }}
            >
              👑
            </div>
            <span className="text-xs font-extrabold" style={{ color: textColor }}>
              مايسترو النبك
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: `${tokens.primaryAccent}20`,
                color: tokens.primaryAccent,
              }}
            >
              المطبخ مفتوح
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: buttonTextColor,
              }}
            >
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Mock Hero Banner */}
        <div className="p-6 sm:p-7 text-center space-y-3 border-b" style={{ borderColor }}>
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${tokens.primaryAccent}15`,
              color: tokens.primaryAccent,
            }}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>سيمفونية المذاق الأصيل</span>
          </span>

          <h4
            className="text-base sm:text-lg font-extrabold tracking-tight"
            style={{ color: textColor }}
          >
            الشاورما والمشاوي الملكية في النبك
          </h4>

          <p className="text-xs opacity-75 max-w-xs mx-auto leading-relaxed" style={{ color: textColor }}>
            أشهى الوجبات الشامية المحضرة بتوابل بلدية طازجة وتوصيل سريع لكافة أرجاء المدينة.
          </p>

          <div className="pt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-transform active:scale-95"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: buttonTextColor,
              }}
            >
              اطلب وجبتك الآن 🛒
            </button>
          </div>
        </div>

        {/* Mock Dish Card Preview */}
        <div className="p-5 sm:p-6">
          <div
            className="p-4 sm:p-4.5 rounded-2xl border transition-colors flex items-center justify-between gap-3.5"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
          >
            <div className="space-y-1.5 min-w-0">
              <span
                className="text-xs font-bold block truncate"
                style={{ color: textColor }}
              >
                برج شاورما مايسترو الملكي
              </span>
              <span className="text-[11px] opacity-75 block" style={{ color: textColor }}>
                وجبة عائلية فاخرة مع البطاطا والثومية
              </span>
              <span
                className="text-xs font-extrabold font-mono block pt-1"
                style={{ color: tokens.primaryAccent }}
              >
                120,000 ل.س
              </span>
            </div>

            <button
              type="button"
              className="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: buttonTextColor,
              }}
            >
              + إضافة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStorefrontMockup;
