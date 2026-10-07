import React, { useState } from 'react';
import {
  Eye,
  Sun,
  Moon,
  Sparkles,
  ShoppingBag,
  Star,
  Flame,
  Check,
  Tag,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { getOptimalButtonTextColor } from '../../utils/themeContrast';
import type { ThemeTokens } from '../../types/settings.types';

interface LiveStorefrontMockupProps {
  activeDraft: ThemeTokens;
  mode: 'dark' | 'light' | 'mastro-luxury';
  onToggleMode: () => void;
}

export const LiveStorefrontMockup: React.FC<LiveStorefrontMockupProps> = ({
  activeDraft,
  mode,
  onToggleMode,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [orderCount, setOrderCount] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const isLight = mode === 'light';

  // Active theme-driven variables
  const accent = activeDraft.primaryAccent || '#F59E0B';
  const surfaceBg = isLight ? activeDraft.lightSurface || '#FFFFFF' : activeDraft.darkSurface || '#131926';
  const canvasBg = isLight ? activeDraft.lightBg || '#FAF8F5' : activeDraft.darkBg || '#06090E';
  const textTitle = isLight ? '#0F172A' : activeDraft.textPrimary || activeDraft.darkText || '#FFFDF8';
  const textMuted = isLight ? '#64748B' : '#94A3B8';
  const borderColor = isLight ? activeDraft.lightBorder || 'rgba(226, 232, 240, 0.8)' : activeDraft.darkBorder || 'rgba(255, 255, 255, 0.12)';
  const btnTextColor = getOptimalButtonTextColor(accent);

  const handleSimulatedOrder = () => {
    setOrderCount((prev) => prev + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      {/* Container Frame with Glassmorphic styling and ambient glow */}
      <div
        className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-5 shadow-2xl transition-all duration-300"
        style={{
          boxShadow: `0 20px 50px -10px ${accent}20, 0 0 30px -5px ${accent}10`,
        }}
      >
        {/* Mockup Toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${accent}25`, color: accent }}
            >
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {isAr ? 'المحاكي المباشر للهوية' : 'Live Brand Simulator'}
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isAr ? 'مزامنة حية' : 'Live Sync'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <button
            type="button"
            onClick={onToggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/10 bg-black/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all"
            title={isAr ? 'تبديل وضع المحاكي (ليلي / نهاري)' : 'Toggle preview mode'}
          >
            {!isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-mono">{isAr ? 'الوضع الليلي' : 'Dark'}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-mono">{isAr ? 'الوضع الفاتح' : 'Light'}</span>
              </>
            )}
          </button>
        </div>

        {/* =========================================================================
            SIMULATED STOREFRONT CANVASES
           ========================================================================= */}
        <div
          className="rounded-2xl border p-4 sm:p-5 flex flex-col gap-4 shadow-inner transition-colors duration-300 relative overflow-hidden"
          style={{
            backgroundColor: canvasBg,
            borderColor: borderColor,
          }}
        >
          {/* Subtle Ambient Background Accent Glow */}
          <div
            className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: accent }}
          />

          {/* 1. TOP NAVIGATION BAR SNIPPET */}
          <div
            className="p-3 rounded-xl border flex items-center justify-between gap-3 shadow-md transition-all duration-300"
            style={{
              backgroundColor: surfaceBg,
              borderColor: borderColor,
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center p-0.5 shadow-sm"
                style={{
                  backgroundColor: `${accent}20`,
                  border: `1px solid ${accent}40`,
                }}
              >
                <img
                  src="/logo.png"
                  alt="El Maestro Logo"
                  className="w-7 h-7 object-contain drop-shadow-sm"
                  onError={(e) => {
                    // Fallback to crown icon
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className="text-xs font-black tracking-wider uppercase font-['Cairo',sans-serif]"
                  style={{ color: textTitle }}
                >
                  EL MAESTRO
                </span>
                <span className="text-[9px]" style={{ color: textMuted }}>
                  {isAr ? 'مطعم مايسترو الملكي' : 'Royal Culinary'}
                </span>
              </div>
            </div>

            {/* Nav link + Status pill */}
            <div className="flex items-center gap-2">
              {/* Status Indicator Pill */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                style={{
                  backgroundColor: !isLight ? '#071810' : '#ECFDF5',
                  borderColor: '#10B98140',
                  color: '#10B981',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? 'مفتوح الآن' : 'Open'}</span>
              </div>

              {/* Cart / Orders Pill */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: `${accent}15`,
                  borderColor: `${accent}40`,
                  color: accent,
                }}
                title={isAr ? 'سلة الطلبات' : 'Cart'}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="font-mono">{3 + orderCount}</span>
              </div>
            </div>
          </div>

          {/* 2. PROMOTIONAL BANNER SNIPPET */}
          <div
            className="p-3.5 rounded-xl border relative overflow-hidden flex items-center justify-between shadow-sm transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${accent}25 0%, ${surfaceBg} 100%)`,
              borderColor: `${accent}35`,
            }}
          >
            <div className="flex flex-col z-10">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: accent }}>
                  {isAr ? 'العرض الملكي الأسبوعي' : 'Royal Weekly Special'}
                </span>
              </div>
              <h4
                className="text-xs sm:text-sm font-black mt-0.5"
                style={{ color: textTitle }}
              >
                {isAr ? 'خصم 20% على باقة المشاوي العائلية' : '20% Off Family Grill Feast'}
              </h4>
            </div>

            <div
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border uppercase tracking-wider shrink-0 z-10"
              style={{
                backgroundColor: surfaceBg,
                borderColor: `${accent}60`,
                color: accent,
              }}
            >
              MAESTRO20
            </div>
          </div>

          {/* 3. SAMPLE MEAL CARD ("مشاوي مشكل مايسترو الملكية") */}
          <div
            className="rounded-2xl border p-4 flex flex-col gap-3.5 shadow-md transition-all duration-300"
            style={{
              backgroundColor: surfaceBg,
              borderColor: borderColor,
            }}
          >
            {/* Card Header: Tag + Rating */}
            <div className="flex items-center justify-between">
              <span
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  backgroundColor: `${accent}18`,
                  borderColor: `${accent}35`,
                  color: accent,
                }}
              >
                <Flame className="w-3 h-3" />
                <span>{isAr ? 'توقيع الشيف الملكي' : "Chef's Signature"}</span>
              </span>

              <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: accent }}>
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono text-xs">4.9</span>
              </div>
            </div>

            {/* Meal Title & Description */}
            <div className="flex flex-col">
              <h4
                className="text-sm sm:text-base font-black font-['Cairo',sans-serif]"
                style={{ color: textTitle }}
              >
                {isAr ? 'مشاوي مشكل مايسترو الملكية' : 'Maestro Royal Mixed Grill'}
              </h4>
              <p
                className="text-xs line-clamp-2 mt-1 leading-relaxed"
                style={{ color: textMuted }}
              >
                {isAr
                  ? 'تشكيلة فاخرة من الكباب الحلبي، الشيش طاووق، وريش الضأن المشوية على الفحم مع صوصات المايسترو الخاصة.'
                  : 'A lavish charcoal assortment of Aleppo kebab, shish tawook & lamb chops with signature sauces.'}
              </p>
            </div>

            {/* Price & Interactive "أضف للطلب" Button */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
              <div className="flex flex-col">
                <span className="text-[10px]" style={{ color: textMuted }}>
                  {isAr ? 'السعر الشامل' : 'Total Price'}
                </span>
                <span
                  className="text-sm sm:text-base font-black font-mono"
                  style={{ color: accent }}
                >
                  260,000 {isAr ? 'ل.س' : 'SYP'}
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSimulatedOrder}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-md
                  ${justAdded ? 'scale-105' : 'hover:opacity-95'}
                `}
                style={{
                  backgroundColor: accent,
                  color: btnTextColor,
                  boxShadow: `0 4px 15px ${accent}40`,
                }}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isAr ? 'تمت الإضافة!' : 'Added!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أضف للطلب' : 'Add to Order'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Token Debug Pill Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono text-[var(--text-secondary)]">
            <span className="text-[var(--text-muted)]">--brand-accent:</span>
            <span className="font-bold uppercase" style={{ color: accent }}>
              {accent}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono text-[var(--text-secondary)]">
            <span className="text-[var(--text-muted)]">--bg-surface:</span>
            <span className="font-bold uppercase text-[var(--text-primary)]">{surfaceBg}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono text-[var(--text-secondary)]">
            <span className="text-[var(--text-muted)]">--bg-primary:</span>
            <span className="font-bold uppercase text-[var(--text-primary)]">{canvasBg}</span>
          </div>
        </div>

        {/* Live Note Footer */}
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
          <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {isAr
              ? 'تنعكس جميع التغييرات مباشرة هنا، وتُطبَّق على المتجر عند الضغط على "حفظ التغييرات".'
              : 'All adjustments reflect instantaneously here and apply store-wide upon clicking "Save Changes".'}
          </span>
        </div>
      </div>
    </div>
  );
};
