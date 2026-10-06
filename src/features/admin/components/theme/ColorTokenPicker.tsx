import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Save,
  Upload,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import type { ThemeTokens } from '../../types/settings.types';
import { THEME_PRESETS } from '../../hooks/useThemeCustomizer';
import { BrandAssets } from '../../../../utils/imageRegistry';

interface ColorTokenPickerProps {
  tokens: ThemeTokens;
  onChangeToken: (key: keyof ThemeTokens, value: string) => void;
  onApplyPreset: (preset: ThemeTokens) => void;
  onSaveTokens: () => void;
  onResetTokens: () => void;
  saveSuccess: boolean;
  language: 'ar' | 'en';
}

const FONT_OPTIONS = [
  { id: 'Cairo', nameAr: 'القاهرة (Cairo)', nameEn: 'Cairo', descAr: 'عصري هندسي، الخط المعتمد لمطاعم مايسترو' },
  { id: 'Readex Pro', nameAr: 'ريدكس برو (Readex Pro)', nameEn: 'Readex Pro', descAr: 'فائق النعومة والمقروئية على شاشات الجوال' },
  { id: 'Tajawal', nameAr: 'تجوال (Tajawal)', nameEn: 'Tajawal', descAr: 'طابع شامي أصيل وأنيق ذو حضور متوازن' },
  { id: 'IBM Plex Sans Arabic', nameAr: 'آي بي إم بلكس (IBM Plex)', nameEn: 'IBM Plex Sans Arabic', descAr: 'خط احترافي ورصين للمطاعم المعاصرة' },
];

const CURATED_ACCENTS = ['#D97706', '#E11D48', '#10B981', '#F59E0B', '#B45309', '#0284C7', '#8B5CF6'];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const selectedFont = tokens.fontFamily || 'Cairo';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isAr ? 'حجم الملف يجب ألا يتجاوز 2 ميجابايت' : 'File size must not exceed 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onChangeToken('logoUrl', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const primaryTokens: { key: keyof ThemeTokens; labelAr: string; labelEn: string; descAr: string; defaultColor: string }[] = [
    {
      key: 'primaryAccent',
      labelAr: 'اللون الأساسي للهوية (Brand Accent)',
      labelEn: 'Primary Brand Accent',
      descAr: 'لون الأزرار الرئيسية، شارات التميز، وأسعار الوجبات',
      defaultColor: '#D97706',
    },
    {
      key: 'secondaryAccent',
      labelAr: 'لون التمييز الثانوي (Secondary Accent)',
      labelEn: 'Secondary Accent',
      descAr: 'شارات الخصم، الأيقونات الثانوية، وعناصر التفاعل',
      defaultColor: '#F59E0B',
    },
    {
      key: 'darkBg',
      labelAr: 'خلفية النمط الداكن (Dark Canvas)',
      labelEn: 'Dark Canvas Background',
      descAr: 'لون مساحة الصفحة العامة في الوضع الليلي',
      defaultColor: '#0B0F17',
    },
    {
      key: 'darkSurface',
      labelAr: 'بطاقات النمط الداكن (Dark Card Surface)',
      labelEn: 'Dark Card Surface',
      descAr: 'لون كروت الأطباق والقوائم في الوضع الليلي',
      defaultColor: '#1A1D24',
    },
    {
      key: 'lightBg',
      labelAr: 'خلفية النمط الفاتح (Light Canvas)',
      labelEn: 'Light Canvas Background',
      descAr: 'لون مساحة الصفحة العامة في الوضع النهاري',
      defaultColor: '#FAF7F2',
    },
    {
      key: 'lightSurface',
      labelAr: 'بطاقات النمط الفاتح (Light Card Surface)',
      labelEn: 'Light Card Surface',
      descAr: 'لون كروت الأطباق والقوائم في الوضع النهاري',
      defaultColor: '#FFFFFF',
    },
  ];

  const semanticTokens: { key: keyof ThemeTokens; labelAr: string; labelEn: string; descAr: string; defaultColor: string }[] = [
    {
      key: 'successColor',
      labelAr: 'حالة الفتح والنجاح (Success / Open)',
      labelEn: 'Success / Open Status',
      descAr: 'مؤشرات فتح المطعم، رسائل النجاح، والأطباق المتاحة',
      defaultColor: '#10B981',
    },
    {
      key: 'dangerColor',
      labelAr: 'حالة الإغلاق والتنبيه (Danger / Closed)',
      labelEn: 'Danger / Closed Status',
      descAr: 'مؤشرات إغلاق الفرع، الحذف، والرسائل التحذيرية',
      defaultColor: '#F43F5E',
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Curated Brand Presets */}
      <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800/80 mb-5">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'حزم الهوية البصرية الملكية الجاهزة' : 'Curated Brand Presets'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'أنماط ألوان متناسقة ومعدة خصيصاً لمطاعم المأكولات الشامية والوجبات السريعة الفاخرة'
                : 'Pre-engineered luxury color harmonies optimized for modern gourmet dining'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected =
              tokens.primaryAccent?.toLowerCase() === preset.tokens.primaryAccent?.toLowerCase() &&
              tokens.darkBg?.toLowerCase() === preset.tokens.darkBg?.toLowerCase();

            return (
              <button
                key={preset.nameEn}
                type="button"
                onClick={() => onApplyPreset(preset.tokens)}
                className={`relative p-3.5 rounded-xl border text-start transition-all cursor-pointer group flex flex-col justify-between gap-3 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-sm'
                    : 'bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center -space-x-1.5 rtl:space-x-reverse shrink-0">
                    <span
                      className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-xs"
                      style={{ backgroundColor: preset.tokens.primaryAccent }}
                      title="Primary Accent"
                    />
                    <span
                      className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-xs"
                      style={{ backgroundColor: preset.tokens.secondaryAccent || preset.tokens.primaryAccent }}
                      title="Secondary"
                    />
                    <span
                      className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-xs"
                      style={{ backgroundColor: preset.tokens.darkBg }}
                      title="Dark Canvas"
                    />
                    <span
                      className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-xs"
                      style={{ backgroundColor: preset.tokens.lightBg }}
                      title="Light Canvas"
                    />
                  </div>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/80 dark:bg-zinc-700/60 text-slate-700 dark:text-zinc-300">
                    {isAr ? preset.tagAr : preset.tagEn}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                    {isAr ? preset.nameAr : preset.nameEn}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate mt-0.5">
                    {isAr ? `الخط: ${preset.tokens.fontFamily || 'Cairo'}` : `Font: ${preset.tokens.fontFamily || 'Cairo'}`}
                  </span>
                </div>

                {isSelected && (
                  <span className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-auto rtl:left-2.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                    <Check size={10} className="stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Granular Color Swatches & Surface Colors */}
      <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800/80 mb-5">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sliders size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'تخصيص الألوان الأساسية وسطوح العرض' : 'Primary Palette & Surface Tokens'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'تحكم دقيق في درجات الألوان للوضع الليلي والنهاري مع فحص فوري لكود الـ HEX'
                : 'Fine-tune exact color tokens for light and dark environments with instant validation'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {primaryTokens.map((f) => {
            const rawVal = (tokens[f.key] as string) || f.defaultColor;
            const isValidHex = rawVal.startsWith('#') && rawVal.length === 7;
            const pickerVal = isValidHex ? rawVal : f.defaultColor;

            return (
              <div
                key={f.key}
                className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      {isAr ? f.labelAr : f.labelEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                    {isAr ? f.descAr : f.labelEn}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-zinc-700/60">
                  {/* Swatch & Native Color Picker */}
                  <div className="flex items-center gap-2">
                    <label
                      className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-300 dark:border-zinc-700 shadow-xs cursor-pointer shrink-0 block hover:scale-105 transition-transform"
                      style={{ backgroundColor: pickerVal }}
                      title={isAr ? 'انقر لاختيار اللون' : 'Click to pick color'}
                    >
                      <input
                        type="color"
                        value={pickerVal}
                        onChange={(e) => onChangeToken(f.key, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>

                    {f.key === 'primaryAccent' && (
                      <div className="flex items-center gap-1">
                        {CURATED_ACCENTS.slice(0, 4).map((acc) => (
                          <button
                            key={acc}
                            type="button"
                            onClick={() => onChangeToken('primaryAccent', acc)}
                            className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 shadow-xs cursor-pointer hover:scale-125 transition-transform"
                            style={{ backgroundColor: acc }}
                            title={acc}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HEX Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={rawVal}
                      onChange={(e) => onChangeToken(f.key, e.target.value)}
                      placeholder="#000000"
                      maxLength={7}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-bold text-slate-900 dark:text-zinc-100 text-left focus:outline-none focus:border-amber-500 uppercase tracking-wider"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Semantic Status Colors */}
      <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800/80 mb-5">
          <span className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <AlertCircle size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'ألوان الحالة الدلالية والتشغيلية' : 'Semantic Status & Alert Colors'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'ألوان شارات التوفر، حالة الفرع (مفتوح / مغلق)، ورسائل النظام التفاعلية'
                : 'Colors representing kitchen readiness, branch operational state, and feedback alerts'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {semanticTokens.map((f) => {
            const rawVal = (tokens[f.key] as string) || f.defaultColor;
            const isValidHex = rawVal.startsWith('#') && rawVal.length === 7;
            const pickerVal = isValidHex ? rawVal : f.defaultColor;

            return (
              <div
                key={f.key}
                className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block truncate">
                    {isAr ? f.labelAr : f.labelEn}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500 block truncate mt-0.5">
                    {isAr ? f.descAr : f.labelEn}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label
                    className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-zinc-700 shadow-xs cursor-pointer block"
                    style={{ backgroundColor: pickerVal }}
                  >
                    <input
                      type="color"
                      value={pickerVal}
                      onChange={(e) => onChangeToken(f.key, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>

                  <input
                    type="text"
                    value={rawVal}
                    onChange={(e) => onChangeToken(f.key, e.target.value)}
                    maxLength={7}
                    className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-bold text-slate-900 dark:text-zinc-100 text-left focus:outline-none uppercase"
                    dir="ltr"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Arabic Typography & Font Studio */}
      <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800/80 mb-5">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Type size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'الهوية الطباعية والخطوط العربية' : 'Typography & Arabic Font Families'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'اختيار عائلة الخط العربي المعتمدة لجميع عناوين الوجبات والقوائم والأسعار'
                : 'Select the primary font family for all menu headings, dish titles, and prices'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          {FONT_OPTIONS.map((font) => {
            const isSelected = selectedFont === font.id;

            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onChangeToken('fontFamily', font.id)}
                className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-sm'
                    : 'bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-sm font-bold text-slate-900 dark:text-zinc-100"
                    style={{ fontFamily: font.id }}
                  >
                    {isAr ? font.nameAr : font.nameEn}
                  </span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-amber-500 text-slate-950">
                      <Check size={12} className="stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                  {font.descAr}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Font Sample Strip */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block">
            {isAr ? 'معاينة تجريبية للخط المختار:' : 'Typography Live Sample:'}
          </span>
          <p
            className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 transition-all"
            style={{ fontFamily: selectedFont }}
          >
            {isAr
              ? 'مايسترو النبك: أشهى مأكولات الشاورما الشامية والدجاج البروستد الملكي في القلمون'
              : 'Maestro Al-Nabek: Authentic Damascus Shawarma & Golden Broasted Chicken'}
          </p>
        </div>
      </div>

      {/* 5. Brand Assets & Logo Manager */}
      <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-zinc-800/80 mb-5">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ImageIcon size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'أصول العلامة التجارية وشعار المطعم' : 'Brand Assets & Logo Manager'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'إدارة الشعار الرسمي والبانرات الترويجية مع الحفاظ على الأبعاد الموصى بها'
                : 'Upload and configure the official restaurant logo and promotional graphics'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Active Logo Thumbnail Display */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
              <img
                src={tokens.logoUrl || BrandAssets.logo.src}
                alt="Maestro Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                {isAr ? 'شعار مايسترو المعتمد' : 'Official Maestro Logo'}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 block mt-0.5">
                {tokens.logoUrl
                  ? (isAr ? 'شعار مخصص تم رفعه' : 'Custom uploaded logo')
                  : (isAr ? 'الشعار الافتراضي (PNG شفاف)' : 'Default transparent PNG')}
              </span>
              {tokens.logoUrl && (
                <button
                  type="button"
                  onClick={() => onChangeToken('logoUrl', '')}
                  className="text-[11px] text-rose-500 hover:underline mt-1 cursor-pointer"
                >
                  {isAr ? 'استعادة الشعار الأصلي' : 'Reset to default'}
                </button>
              )}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-amber-500/50 bg-slate-50/50 dark:bg-zinc-800/20 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Upload size={18} />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                {isAr ? 'انقر لرفع شعار جديد' : 'Click to upload logo'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block mt-0.5">
                {isAr ? 'PNG شفاف بدقة 512×512 بكسل (الحد الأقصى 2MB)' : 'Transparent PNG 512x512px (Max 2MB)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <HelpCircle size={14} className="text-amber-500 shrink-0" />
          <span>{isAr ? 'التعديلات اللونية تنعكس فورياً في المعاينة الحية' : 'Color edits reflect instantly in the live canvas'}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={onSaveTokens}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            {saveSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>
              {saveSuccess
                ? (isAr ? 'تم حفظ الهوية بنجاح!' : 'Saved Successfully!')
                : (isAr ? 'حفظ ونشر التعديلات' : 'Save & Publish')}
            </span>
          </button>
        </div>
      </div>

      {/* Safe Reset Confirmation Dialog Modal */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl text-slate-900 dark:text-zinc-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                <span>{isAr ? 'استعادة الألوان الافتراضية؟' : 'Reset to Default Theme?'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {isAr
                ? 'سيتم إلغاء كافة تخصيصات الألوان الحالية والعودة لنمط مايسترو الذهبي الملكي الأصلي. هل ترغب بالمتابعة؟'
                : 'This will reset all customized colors back to the default Maestro Royal Gold theme. Continue?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetTokens();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                {isAr ? 'نعم، استعادة الافتراضي' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
