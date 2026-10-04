import React from 'react';
import { RefreshCw, Check, Sparkles, Sliders, Save } from 'lucide-react';
import type { ThemeTokens } from '../../types/settings.types';
import { THEME_PRESETS } from '../../hooks/useThemeCustomizer';
import { Card } from '../common/Card';

interface ColorTokenPickerProps {
  tokens: ThemeTokens;
  onChangeToken: (key: keyof ThemeTokens, value: string) => void;
  onApplyPreset: (preset: ThemeTokens) => void;
  onSaveTokens: () => void;
  onResetTokens: () => void;
  saveSuccess: boolean;
  language: 'ar' | 'en';
}

export const ColorTokenPicker: React.FC<ColorTokenPickerProps> = ({
  tokens,
  onChangeToken,
  onApplyPreset,
  onSaveTokens,
  onResetTokens,
  saveSuccess,
  language,
}) => {
  const isAr = language === 'ar';

  const tokenFields: { key: keyof ThemeTokens; labelAr: string; labelEn: string; subtextAr: string; subtextEn: string }[] = [
    {
      key: 'primaryAccent',
      labelAr: 'اللون الذهبي الرئيسي',
      labelEn: 'Primary Brand Accent',
      subtextAr: 'لون الهوية للأزرار والشارات والنصوص المميزة',
      subtextEn: 'Brand accent for buttons, badges & highlights',
    },
    {
      key: 'darkBg',
      labelAr: 'خلفية النمط الداكن',
      labelEn: 'Dark Canvas Background',
      subtextAr: 'الخلفية العامة لصفحات الموقع في النمط الليلي',
      subtextEn: 'Overall page background in dark mode',
    },
    {
      key: 'darkSurface',
      labelAr: 'بطاقات النمط الداكن',
      labelEn: 'Dark Card Surface',
      subtextAr: 'لون مساحة الكروت والقوائم في النمط الليلي',
      subtextEn: 'Card surface & container fill in dark mode',
    },
    {
      key: 'lightBg',
      labelAr: 'خلفية النمط الفاتح',
      labelEn: 'Light Canvas Background',
      subtextAr: 'الخلفية العامة لصفحات الموقع في النمط النهاري',
      subtextEn: 'Overall page background in light mode',
    },
    {
      key: 'lightSurface',
      labelAr: 'بطاقات النمط الفاتح',
      labelEn: 'Light Card Surface',
      subtextAr: 'لون مساحة الكروت والقوائم في النمط النهاري',
      subtextEn: 'Card surface & container fill in light mode',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Presets Selector Card */}
      <Card
        variant="default"
        header={
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isAr ? 'حزم الهوية البصرية الجاهزة' : 'Pre-Engineered Brand Presets'}
                </h3>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-4 py-2">
          {THEME_PRESETS.map((preset) => {
            const isSelected =
              tokens.primaryAccent?.toLowerCase() === preset.tokens.primaryAccent?.toLowerCase() &&
              tokens.darkBg?.toLowerCase() === preset.tokens.darkBg?.toLowerCase();

            return (
              <button
                key={preset.nameEn}
                type="button"
                onClick={() => onApplyPreset(preset.tokens)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 ring-2 ring-amber-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Color Palette Dots */}
                <div className="flex items-center -space-x-1.5 rtl:space-x-reverse shrink-0">
                  <span
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs"
                    style={{ backgroundColor: preset.tokens.primaryAccent }}
                    title="Accent"
                  />
                  <span
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs"
                    style={{ backgroundColor: preset.tokens.darkBg }}
                    title="Dark Canvas"
                  />
                  <span
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-xs"
                    style={{ backgroundColor: preset.tokens.lightBg }}
                    title="Light Canvas"
                  />
                </div>

                {/* Preset Name */}
                <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                  {isAr ? preset.nameAr : preset.nameEn}
                </span>

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Granular Color Pickers */}
      <Card
        variant="default"
        header={
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <Sliders size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isAr ? 'تخصيص ألوان الهوية البصرية' : 'Custom Color Palette'}
                </h3>
              </div>
            </div>
          </div>
        }
      >
        {/* Color Inputs 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tokenFields.map((f) => {
            const rawValue = tokens[f.key] || '';
            const isValidHex = rawValue.startsWith('#') && rawValue.length === 7;
            const colorPickerValue = isValidHex ? rawValue : '#000000';

            return (
              <div
                key={f.key}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-amber-500/30 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {isAr ? f.labelAr : f.labelEn}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                    {isAr ? f.subtextAr : f.subtextEn}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Color Swatch with Native Color Picker */}
                  <label
                    className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer shrink-0 block hover:scale-105 transition-transform"
                    style={{ backgroundColor: colorPickerValue }}
                    title={isAr ? 'انقر لاختيار اللون' : 'Click to pick color'}
                  >
                    <input
                      type="color"
                      value={colorPickerValue}
                      onChange={(e) => onChangeToken(f.key, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>

                  {/* Hex Code Input */}
                  <input
                    type="text"
                    value={rawValue}
                    onChange={(e) => onChangeToken(f.key, e.target.value)}
                    dir="ltr"
                    placeholder="#000000"
                    className="w-24 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white text-left focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all uppercase tracking-wider"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Action Buttons (Positioned at bottom with zero horizontal clipping) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={onResetTokens}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw size={15} />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset to Default'}</span>
          </button>

          <button
            type="button"
            onClick={onSaveTokens}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {saveSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{saveSuccess ? (isAr ? 'تم حفظ التعديلات!' : 'Saved Successfully!') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
