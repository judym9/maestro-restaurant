import React from 'react';
import {
  Palette,
  Save,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { useThemeCustomizer } from '../hooks/useThemeCustomizer';
import { useAdminToast } from '../context/AdminToastContext';
import { ThemePresetSelector } from '../components/theme/ThemePresetSelector';
import { ColorTokenEditor } from '../components/theme/ColorTokenEditor';
import { ContrastRatioCard } from '../components/theme/ContrastRatioCard';
import { LiveStorefrontMockup } from '../components/theme/LiveStorefrontMockup';

export const AdminThemePage: React.FC = () => {
  const { showToast } = useAdminToast();
  const {
    activeDraft,
    activePresetId,
    hasUnsavedChanges,
    handleTokenChange,
    applyPreset,
    saveTokens,
    resetToDefault,
  } = useThemeCustomizer();

  const handleSave = () => {
    saveTokens();
    showToast('success', 'تم حفظ وتطبيق الهوية البصرية الجديدة للمطعم بنجاح');
  };

  const handleReset = () => {
    resetToDefault();
    showToast('info', 'تمت استعادة حزمة الألوان الافتراضية لمايسترو الملكي');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 pb-3.5 sm:pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 sm:gap-2.5">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            <span>تخصيص الهوية البصرية والمظهر</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
            التحكم بألوان العلامة التجارية، درجات التباين، ومحاكاة الواجهة الفورية للزبائن
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>الافتراضي</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 sm:flex-none justify-center flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 ${
              hasUnsavedChanges
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>
              {hasUnsavedChanges ? 'حفظ (غير محفوظة)' : 'حفظ المظهر'}
            </span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="p-3.5 sm:p-4 px-4 sm:px-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              لديك تعديلات غير محفوظة على لوحة الألوان. عاين النتيجة في المحاكي ثم انقر على حفظ التغييرات.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shrink-0 text-xs shadow-sm transition-transform active:scale-95"
          >
            حفظ الآن
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
        {/* Right Column: Controls & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* Preset Selector */}
          <div className="p-4.5 sm:p-7 rounded-2xl bg-slate-900/50 sm:bg-[#0b101b] border border-slate-800/80 shadow-xl">
            <ThemePresetSelector
              activePresetId={activePresetId}
              onSelectPreset={(preset) => {
                applyPreset(preset);
                showToast('info', 'تم تطبيق النمط على المحاكي للمعاينة');
              }}
            />
          </div>

          {/* Color Tokens & Fonts Editor */}
          <div className="p-4.5 sm:p-7 rounded-2xl bg-slate-900/50 sm:bg-[#0b101b] border border-slate-800/80 shadow-xl">
            <ColorTokenEditor
              tokens={activeDraft}
              onChangeToken={handleTokenChange}
            />
          </div>

          {/* WCAG 2.1 Contrast Ratio Analysis Card */}
          <ContrastRatioCard primaryAccent={activeDraft.primaryAccent} />
        </div>

        {/* Left Column: Live Storefront Simulator (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="p-6 sm:p-7 px-6 sm:px-7 py-6 sm:py-7 rounded-2xl bg-[#0b101b] border border-slate-800 shadow-xl">
            <LiveStorefrontMockup tokens={activeDraft} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemePage;
