import React from 'react';
import { Sparkles, Check, Crown } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { THEME_PRESETS, type ThemePreset } from '../../hooks/useThemeCustomizer';
import type { ThemeTokens } from '../../types/settings.types';

interface ThemePresetSelectorProps {
  activeDraft: ThemeTokens;
  activePresetId?: string | null;
  onSelectPreset: (preset: ThemeTokens) => void;
}

export const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({
  activeDraft,
  activePresetId,
  onSelectPreset,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col gap-5 shadow-xl transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {isAr ? 'حزم الهوية الملكية الجاهزة' : 'Curated Brand Theme Presets'}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isAr
                ? '3 حزم احترافية جاهزة بضغطة زر واحدة تم تصميمها لمعايير الفخامة'
                : '3 elite one-click presets tailored for luxury culinary standards'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>{isAr ? 'تفعيل فوري' : 'Instant Activation'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {THEME_PRESETS.map((preset: ThemePreset) => {
          // Check if this preset is active
          const isSelected =
            activePresetId === preset.id ||
            (activeDraft.primaryAccent?.toLowerCase() === preset.tokens.primaryAccent.toLowerCase() &&
              activeDraft.darkBg?.toLowerCase() === preset.tokens.darkBg.toLowerCase());

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.tokens)}
              className={`
                group relative flex flex-col justify-between p-4 rounded-2xl border text-start transition-all duration-300
                ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.18)] scale-[1.02] ring-1 ring-amber-500/50'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }
              `}
            >
              {/* Header: Title & Active Checkmark */}
              <div className="flex items-start justify-between gap-2 w-full mb-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-amber-400 transition-colors">
                    {isAr ? preset.nameAr : preset.nameEn}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {isAr ? preset.tagAr : preset.tagEn}
                  </span>
                </div>

                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                    ${
                      isSelected
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'border border-white/20 text-transparent opacity-0 group-hover:opacity-100 group-hover:text-white/40'
                    }
                  `}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Preset Mini Badge */}
              <div className="flex items-center justify-between w-full pt-3 border-t border-white/5 mt-auto">
                <span
                  className={`
                    px-2 py-0.5 rounded-md text-[10px] font-bold border
                    ${
                      preset.id === 'mastro-luxury'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : preset.id === 'modern-dark'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                    }
                  `}
                >
                  {isAr ? preset.badgeAr : preset.badgeEn}
                </span>

                {/* Swatches preview */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="w-4 h-4 rounded-full ring-1 ring-white/20 shadow-sm"
                    title={`Accent: ${preset.tokens.primaryAccent}`}
                    style={{ backgroundColor: preset.tokens.primaryAccent }}
                  />
                  <span
                    className="w-4 h-4 rounded-full ring-1 ring-white/20 shadow-sm"
                    title={`Background: ${preset.id === 'clean-light' ? preset.tokens.lightBg : preset.tokens.darkBg}`}
                    style={{
                      backgroundColor:
                        preset.id === 'clean-light' ? preset.tokens.lightBg : preset.tokens.darkBg,
                    }}
                  />
                  <span
                    className="w-4 h-4 rounded-full ring-1 ring-white/20 shadow-sm"
                    title={`Surface: ${preset.id === 'clean-light' ? preset.tokens.lightSurface : preset.tokens.darkSurface}`}
                    style={{
                      backgroundColor:
                        preset.id === 'clean-light' ? preset.tokens.lightSurface : preset.tokens.darkSurface,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
