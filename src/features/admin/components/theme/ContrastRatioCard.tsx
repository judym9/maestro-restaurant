import React, { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { evaluateContrast, getYiqLuminance } from '../../utils/themeContrast';

interface ContrastRatioCardProps {
  accentColor: string;
}

export const ContrastRatioCard: React.FC<ContrastRatioCardProps> = ({ accentColor }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const evaluation = useMemo(() => {
    return evaluateContrast(accentColor);
  }, [accentColor]);

  const yiq = useMemo(() => {
    return Math.round(getYiqLuminance(accentColor));
  }, [accentColor]);

  const isLight = yiq >= 128;

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-4 shadow-xl transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {isAr ? 'مؤشر التباين وسهولة القراءة (WCAG 2.1)' : 'Accessibility & Contrast Ratio (WCAG 2.1)'}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isAr
                ? 'فحص مقروئية نصوص الأزرار فوق لون التمييز المحدد'
                : 'Evaluates button text legibility over chosen accent hue'}
            </p>
          </div>
        </div>

        {/* Rating Badge */}
        <div
          className={`
            flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
            ${
              evaluation.level === 'AAA'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : evaluation.level === 'AA'
                ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }
          `}
        >
          {evaluation.isAccessible ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>{evaluation.level === 'FAIL' ? (isAr ? 'ضعيف' : 'Low') : evaluation.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Ratio */}
        <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-center">
          <span className="text-[11px] text-[var(--text-muted)] font-medium">
            {isAr ? 'نسبة التباين الفعلية' : 'Contrast Ratio'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-[var(--text-primary)] font-mono">
              {evaluation.ratioFormatted}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {evaluation.ratio >= 7.0 ? 'AAA' : evaluation.ratio >= 4.5 ? 'AA' : ''}
            </span>
          </div>
        </div>

        {/* Metric 2: Optimal Text Color */}
        <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-center">
          <span className="text-[11px] text-[var(--text-muted)] font-medium">
            {isAr ? 'لون الخط المقترح' : 'Optimal Text Tone'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: evaluation.textColor }}
            />
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {evaluation.textColor === '#0B0F17'
                ? isAr
                  ? 'داكن (#0B0F17)'
                  : 'Dark (#0B0F17)'
                : isAr
                ? 'أبيض (#FFFFFF)'
                : 'White (#FFFFFF)'}
            </span>
          </div>
        </div>

        {/* Metric 3: Luminance Class */}
        <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-center">
          <span className="text-[11px] text-[var(--text-muted)] font-medium">
            {isAr ? 'كثافة الإضاءة (YIQ)' : 'Perceptual Luminance'}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {yiq} / 255
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-[var(--text-secondary)]">
              {isLight ? (isAr ? 'فاتح' : 'Light') : isAr ? 'داكن' : 'Dark'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Sample Button Preview with Optimal Contrast */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-[var(--text-secondary)]">
            {isAr
              ? 'معاينة الزر بالنص عالي التباين التلقائي:'
              : 'Simulated button with dynamic auto-contrast text:'}
          </span>
        </div>

        <button
          type="button"
          tabIndex={-1}
          className="px-5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all shrink-0 cursor-default"
          style={{
            backgroundColor: accentColor,
            color: evaluation.textColor,
            boxShadow: `0 4px 15px ${accentColor}33`,
          }}
        >
          {isAr ? 'أضف للطلب • 260,000 ل.س' : 'Add to Order • 260,000 SYP'}
        </button>
      </div>
    </div>
  );
};
