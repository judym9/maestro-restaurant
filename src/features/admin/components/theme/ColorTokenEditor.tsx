import React from 'react';
import { Palette, Check, Layers, Monitor, Type } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { ACCENT_SWATCHES } from '../../hooks/useThemeCustomizer';
import type { ThemeTokens } from '../../types/settings.types';

interface ColorTokenEditorProps {
  activeDraft: ThemeTokens;
  onTokenChange: (key: keyof ThemeTokens, value: string) => void;
}

export const ColorTokenEditor: React.FC<ColorTokenEditorProps> = ({
  activeDraft,
  onTokenChange,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const handleHexInput = (key: keyof ThemeTokens, input: string) => {
    let clean = input.trim();
    if (!clean.startsWith('#')) {
      clean = `#${clean}`;
    }
    onTokenChange(key, clean);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-6 shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {isAr ? 'محرر درجات الألوان ورموز الهوية' : 'Visual Color Palette Editor'}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isAr
                ? 'تحكم دقيق في الألوان الأساسية، الأسطح، والتباين مع انتقاء حر للألوان'
                : 'Fine-grained control over primary accents, surfaces, and typography tokens'}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Primary Accent Color (--brand-accent) */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white/10"
              style={{ backgroundColor: activeDraft.primaryAccent }}
            />
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)]">
                {isAr ? 'لون التمييز الرئيسي' : 'Primary Accent Color'}
              </label>
              <code className="text-[10px] text-amber-400/90 font-mono ms-2">
                --brand-accent / --accent-gold
              </code>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Color picker */}
            <input
              type="color"
              value={activeDraft.primaryAccent || '#F59E0B'}
              onChange={(e) => onTokenChange('primaryAccent', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0.5 shrink-0"
              title={isAr ? 'اختر لون التمييز' : 'Pick accent color'}
            />
            {/* Hex text input */}
            <input
              type="text"
              maxLength={7}
              value={activeDraft.primaryAccent || '#F59E0B'}
              onChange={(e) => handleHexInput('primaryAccent', e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-white/10 bg-black/30 text-xs text-[var(--text-primary)] font-mono uppercase focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Accent Swatches */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
          <span className="text-[10px] font-semibold text-[var(--text-muted)]">
            {isAr ? 'عينات سريعة جاهزة (Quick Swatches):' : 'Quick Swatches:'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_SWATCHES.map((swatch) => {
              const isMatch = activeDraft.primaryAccent?.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => onTokenChange('primaryAccent', swatch.hex)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all
                    ${
                      isMatch
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/50 shadow-sm'
                        : 'border-white/10 bg-black/20 text-[var(--text-secondary)] hover:border-white/30 hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span>{isAr ? swatch.nameAr : swatch.nameEn}</span>
                  {isMatch && <Check className="w-3 h-3 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Other 3 Tokens: Surface, App Background, Text & Headings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 2. Surface Background (--bg-surface) */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[var(--text-primary)]">
                {isAr ? 'خلفية الأسطح والبطاقات' : 'Surface Background'}
              </label>
              <code className="text-[9px] text-[var(--text-muted)] font-mono">--bg-surface</code>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={activeDraft.darkSurface || '#131926'}
              onChange={(e) => {
                onTokenChange('darkSurface', e.target.value);
                onTokenChange('lightSurface', e.target.value);
              }}
              className="w-7 h-7 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0.5 shrink-0"
            />
            <input
              type="text"
              maxLength={7}
              value={activeDraft.darkSurface || '#131926'}
              onChange={(e) => {
                handleHexInput('darkSurface', e.target.value);
                handleHexInput('lightSurface', e.target.value);
              }}
              className="flex-1 px-2.5 py-1 rounded-lg border border-white/10 bg-black/30 text-xs text-[var(--text-primary)] font-mono uppercase focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-white/5">
            {[
              { hex: '#131926', label: 'أوبسيديان' },
              { hex: '#141B29', label: 'حجري' },
              { hex: '#1A1D24', label: 'فحمي' },
              { hex: '#FFFFFF', label: 'أبيض' },
            ].map((chip) => (
              <button
                key={chip.hex}
                type="button"
                onClick={() => {
                  onTokenChange('darkSurface', chip.hex);
                  onTokenChange('lightSurface', chip.hex);
                }}
                className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125"
                style={{ backgroundColor: chip.hex }}
                title={chip.label}
              />
            ))}
          </div>
        </div>

        {/* 3. App Background (--bg-primary) */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[var(--text-primary)]">
                {isAr ? 'خلفية التطبيق العامة' : 'App Canvas Background'}
              </label>
              <code className="text-[9px] text-[var(--text-muted)] font-mono">--bg-primary</code>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={activeDraft.darkBg || '#06090E'}
              onChange={(e) => {
                onTokenChange('darkBg', e.target.value);
                onTokenChange('lightBg', e.target.value);
              }}
              className="w-7 h-7 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0.5 shrink-0"
            />
            <input
              type="text"
              maxLength={7}
              value={activeDraft.darkBg || '#06090E'}
              onChange={(e) => {
                handleHexInput('darkBg', e.target.value);
                handleHexInput('lightBg', e.target.value);
              }}
              className="flex-1 px-2.5 py-1 rounded-lg border border-white/10 bg-black/30 text-xs text-[var(--text-primary)] font-mono uppercase focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-white/5">
            {[
              { hex: '#06090E', label: 'أسود مخملي' },
              { hex: '#090D16', label: 'رمادي داكن' },
              { hex: '#0B0F17', label: 'فحم كلاسيكي' },
              { hex: '#FAF8F5', label: 'عاجي فاتح' },
            ].map((chip) => (
              <button
                key={chip.hex}
                type="button"
                onClick={() => {
                  onTokenChange('darkBg', chip.hex);
                  onTokenChange('lightBg', chip.hex);
                }}
                className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125"
                style={{ backgroundColor: chip.hex }}
                title={chip.label}
              />
            ))}
          </div>
        </div>

        {/* 4. Text & Heading Tones (--text-main) */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-300" />
            <div className="flex flex-col">
              <label className="text-xs font-bold text-[var(--text-primary)]">
                {isAr ? 'لون النصوص والعناوين' : 'Text & Heading Tone'}
              </label>
              <code className="text-[9px] text-[var(--text-muted)] font-mono">--text-main</code>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={activeDraft.textPrimary || activeDraft.darkText || '#FFFDF8'}
              onChange={(e) => {
                onTokenChange('textPrimary', e.target.value);
                onTokenChange('darkText', e.target.value);
              }}
              className="w-7 h-7 rounded-lg cursor-pointer border border-white/20 bg-transparent p-0.5 shrink-0"
            />
            <input
              type="text"
              maxLength={7}
              value={activeDraft.textPrimary || activeDraft.darkText || '#FFFDF8'}
              onChange={(e) => {
                handleHexInput('textPrimary', e.target.value);
                handleHexInput('darkText', e.target.value);
              }}
              className="flex-1 px-2.5 py-1 rounded-lg border border-white/10 bg-black/30 text-xs text-[var(--text-primary)] font-mono uppercase focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-white/5">
            {[
              { hex: '#FFFDF8', label: 'لؤلؤي دافئ' },
              { hex: '#F8FAFC', label: 'أبيض ناصع' },
              { hex: '#0F172A', label: 'كحلي داكن' },
              { hex: '#1E293B', label: 'رمادي ليلي' },
            ].map((chip) => (
              <button
                key={chip.hex}
                type="button"
                onClick={() => {
                  onTokenChange('textPrimary', chip.hex);
                  onTokenChange('darkText', chip.hex);
                }}
                className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125"
                style={{ backgroundColor: chip.hex }}
                title={chip.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
