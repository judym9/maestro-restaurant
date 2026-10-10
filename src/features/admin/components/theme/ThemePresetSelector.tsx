import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { THEME_PRESETS, type ThemePreset } from '../../hooks/useThemeCustomizer';
import type { ThemeTokens } from '../../types/settings.types';

export interface ThemePresetSelectorProps {
  activePresetId?: string | null;
  onSelectPreset: (preset: ThemeTokens) => void;
}

export const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>حزم الهوية الملكية الجاهزة (Theme Presets)</span>
        </span>
        <span className="text-[11px] text-slate-400">اختر حزمة لتطبيق ألوانها فوراً</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {THEME_PRESETS.map((preset: ThemePreset) => {
          const isSelected = activePresetId === preset.id;

          return (
            <button
              type="button"
              key={preset.id}
              onClick={() => onSelectPreset(preset.tokens)}
              className={`group relative px-5 py-4.5 sm:px-5.5 sm:py-5 rounded-2xl border text-start transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {preset.nameAr}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {preset.badgeAr}
                  </span>
                </div>

                {isSelected && (
                  <div className="w-5.5 h-5.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Color swatches preview */}
              <div className="flex items-center gap-2 pt-1">
                <span
                  className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: preset.tokens.primaryAccent }}
                  title="اللون الأساسي"
                />
                <span
                  className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: preset.tokens.secondaryAccent }}
                  title="اللون الثانوي"
                />
                <span
                  className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: preset.tokens.darkBg }}
                  title="الخلفية الداكنة"
                />
                <span
                  className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: preset.tokens.lightBg }}
                  title="الخلفية الفاتحة"
                />
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1">
                {preset.tagAr}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePresetSelector;
