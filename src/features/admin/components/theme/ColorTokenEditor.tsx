import React from 'react';
import { Type } from 'lucide-react';
import type { ThemeTokens } from '../../types/settings.types';
import { ACCENT_SWATCHES, type AccentSwatch } from '../../hooks/useThemeCustomizer';

export interface ColorTokenEditorProps {
  tokens: ThemeTokens;
  onChangeToken: (key: keyof ThemeTokens, value: string) => void;
}

const ARABIC_FONTS = [
  { id: 'Cairo', name: 'خط كايرو الملكي (Cairo)' },
  { id: 'Readex Pro', name: 'ريديكس برو العصري (Readex Pro)' },
  { id: 'Tajawal', name: 'تجوّل الكلاسيكي (Tajawal)' },
  { id: 'IBM Plex Sans Arabic', name: 'آي بي إم بليكس (IBM Plex)' },
];

export const ColorTokenEditor: React.FC<ColorTokenEditorProps> = ({
  tokens,
  onChangeToken,
}) => {
  return (
    <div className="space-y-6">
      {/* Signature Swatches */}
      <div>
        <span className="block text-xs font-bold text-slate-300 mb-2.5">
          العينات اللونية السريعة (Signature Swatches)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ACCENT_SWATCHES.map((swatch: AccentSwatch) => {
            const isSelected =
              tokens.primaryAccent.toLowerCase() === swatch.hex.toLowerCase();

            return (
              <button
                type="button"
                key={swatch.hex}
                onClick={() => onChangeToken('primaryAccent', swatch.hex)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-start transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-lg border border-white/20 shrink-0 shadow-sm"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-white block truncate">
                    {swatch.nameAr}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {swatch.hex}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary & Secondary Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 sm:px-6 py-5 sm:py-6 rounded-2xl bg-[#090d16] border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>اللون التمييزي الأساسي (Primary Accent)</span>
            <span className="font-mono text-[11px] text-amber-400">
              {tokens.primaryAccent}
            </span>
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={tokens.primaryAccent}
              onChange={(e) => onChangeToken('primaryAccent', e.target.value)}
              className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
            />
            <input
              type="text"
              value={tokens.primaryAccent}
              onChange={(e) => onChangeToken('primaryAccent', e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>اللون التمييزي الثانوي (Secondary Accent)</span>
            <span className="font-mono text-[11px] text-amber-400">
              {tokens.secondaryAccent}
            </span>
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={tokens.secondaryAccent}
              onChange={(e) => onChangeToken('secondaryAccent', e.target.value)}
              className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
            />
            <input
              type="text"
              value={tokens.secondaryAccent}
              onChange={(e) => onChangeToken('secondaryAccent', e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Surface & Background Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 sm:px-6 py-5 sm:py-6 rounded-2xl bg-[#090d16] border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            الخلفية الداكنة (Dark BG)
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={tokens.darkBg}
              onChange={(e) => onChangeToken('darkBg', e.target.value)}
              className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer p-0"
            />
            <input
              type="text"
              value={tokens.darkBg}
              onChange={(e) => onChangeToken('darkBg', e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            أسطح البطاقات الداكنة (Dark Surface)
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={tokens.darkSurface}
              onChange={(e) => onChangeToken('darkSurface', e.target.value)}
              className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer p-0"
            />
            <input
              type="text"
              value={tokens.darkSurface}
              onChange={(e) => onChangeToken('darkSurface', e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Arabic Font Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-amber-500" />
          <span>نوع الخط العربي الأساسي للعلامة</span>
        </label>
        <select
          value={tokens.fontFamily || 'Cairo'}
          onChange={(e) => onChangeToken('fontFamily', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
        >
          {ARABIC_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ColorTokenEditor;
