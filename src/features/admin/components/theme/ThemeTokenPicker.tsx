import React from 'react';
import { Palette, RotateCcw, Check } from 'lucide-react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { useThemeCustomizer } from '../../hooks/useThemeCustomizer';
import { LivePreviewCard } from './LivePreviewCard';

export const ThemeTokenPicker: React.FC = () => {
  const { isRTL } = useAdminLanguage();
  const { tokens, presets, activePresetId, applyPreset, updateTokens, resetTokens } = useThemeCustomizer();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Card */}
      <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Palette size={28} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              {isRTL ? 'محرك تخصيص المظهر والألوان الملكية' : 'Dynamic Theme & Luxury Palette Engine'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {isRTL
                ? 'تخصيص اللون الذهبي للعلامة التجارية، وتدرجات الأسطح والخلفيات الداكنة والفاتحة'
                : 'Configure brand primary accent gold, surface tones, and contrast tokens'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetTokens}
          className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RotateCcw size={15} />
          <span>{isRTL ? 'استعادة الافتراضي' : 'Reset to Default'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Presets & Token Pickers */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Buttons */}
          <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isRTL ? 'الأنماط اللونية الفاخرة الجاهزة' : 'Curated Luxury Palette Presets'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`p-4 rounded-2xl border text-start transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/80 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shrink-0"
                          style={{ backgroundColor: preset.tokens.primaryAccent }}
                        />
                        <span className="font-bold text-white text-xs truncate">
                          {isRTL ? preset.nameAr : preset.nameEn}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {isRTL ? preset.descAr : preset.descEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Tokens Form */}
          <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isRTL ? 'تخصيص رموز الألوان يدوياً' : 'Fine-Tune Palette Tokens'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'اللون الذهبي الرئيسي (Primary Accent)' : 'Primary Accent Color'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.primaryAccent}
                    onChange={(e) => updateTokens({ primaryAccent: e.target.value })}
                    className="w-12 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tokens.primaryAccent}
                    onChange={(e) => updateTokens({ primaryAccent: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'خلفية السطح الداكن (Dark Surface)' : 'Dark Surface Background'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.darkSurface}
                    onChange={(e) => updateTokens({ darkSurface: e.target.value })}
                    className="w-12 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tokens.darkSurface}
                    onChange={(e) => updateTokens({ darkSurface: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'الخلفية العميقة (Dark Background)' : 'Dark Background'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.darkBg}
                    onChange={(e) => updateTokens({ darkBg: e.target.value })}
                    className="w-12 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tokens.darkBg}
                    onChange={(e) => updateTokens({ darkBg: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'خلفية الوضع النهاري (Light Bg)' : 'Light Mode Background'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tokens.lightBg}
                    onChange={(e) => updateTokens({ lightBg: e.target.value })}
                    className="w-12 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tokens.lightBg}
                    onChange={(e) => updateTokens({ lightBg: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5">
          <LivePreviewCard tokens={tokens} />
        </div>
      </div>
    </div>
  );
};
