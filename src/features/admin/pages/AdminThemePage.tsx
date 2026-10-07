import React, { useState } from 'react';
import {
  RotateCcw,
  Check,
  Crown,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useThemeCustomizer } from '../hooks/useThemeCustomizer';
import { useAdminToast } from '../context/AdminToastContext';
import { ThemePresetSelector } from '../components/theme/ThemePresetSelector';
import { ColorTokenEditor } from '../components/theme/ColorTokenEditor';
import { ContrastRatioCard } from '../components/theme/ContrastRatioCard';
import { LiveStorefrontMockup } from '../components/theme/LiveStorefrontMockup';
import type { ThemeTokens } from '../types/settings.types';

export const AdminThemePage: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { showToast } = useAdminToast();

  const {
    mode,
    toggleMode,
    activeDraft,
    activePresetId,
    hasUnsavedChanges,
    handleTokenChange,
    applyPreset,
    saveTokens,
    resetToDefault,
    saveSuccess,
  } = useThemeCustomizer();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle Save
  const handleSave = () => {
    saveTokens();
    showToast(
      'success',
      isAr
        ? 'تم حفظ وتطبيق ألوان الهوية الملكية بنجاح على كامل النظام'
        : 'Brand identity tokens successfully saved and applied store-wide',
      isAr ? 'تم الحفظ بنجاح' : 'Changes Saved'
    );
  };

  // Handle Preset Select
  const handleSelectPreset = (presetTokens: ThemeTokens) => {
    applyPreset(presetTokens);
    showToast(
      'info',
      isAr
        ? 'تم تفعيل الحزمة في لوحة المعاينة. اضغط "حفظ التغييرات" لتطبيقها نهائياً.'
        : 'Preset applied in preview. Click "Save Changes" to commit permanently.'
    );
  };

  // Handle Reset to Brand Defaults
  const handleConfirmReset = () => {
    resetToDefault();
    setShowResetConfirm(false);
    showToast(
      'info',
      isAr
        ? 'تمت استعادة سمة مايسترو الذهبية الفاخرة الافتراضية بنجاح'
        : 'Restored original El Maestro luxury gold brand defaults',
      isAr ? 'استعادة الافتراضي' : 'Brand Reset'
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in pb-12">
      {/* =========================================================================
          PAGE HEADER BAR
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight font-['Cairo',sans-serif]">
              {isAr ? 'تخصيص المظهر والهوية البصرية' : 'Theme & Brand Identity Customizer'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
            {isAr
              ? 'التحكم الديناميكي الكامل في ألوان العلامة التجارية، حزم الهوية الملكية، والمحاكي التفاعلي اللحظي لمطعم مايسترو'
              : 'Full autonomous control over brand palette tokens, luxury presets, and real-time storefront simulator'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{isAr ? 'تغييرات غير محفوظة' : 'Unsaved changes'}</span>
            </div>
          )}

          {/* Reset Defaults Button */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all min-h-[44px]"
            title={isAr ? 'استعادة إعدادات الهوية الافتراضية' : 'Reset to brand defaults'}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          {/* Save Changes Button */}
          <button
            type="button"
            onClick={handleSave}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all min-h-[44px]
              ${
                saveSuccess
                  ? 'bg-emerald-500 text-black shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:brightness-110 shadow-amber-900/30 active:scale-95'
              }
            `}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>
              {saveSuccess
                ? isAr
                  ? 'تم الحفظ والتطبيق!'
                  : 'Saved & Applied!'
                : isAr
                ? 'حفظ التغييرات'
                : 'Save Changes'}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TWO-COLUMN SPLIT SCREEN LAYOUT
          Left Side (col-span-7): Controls Panel
          Right Side (col-span-5): Sticky Interactive Live Mockup Canvas
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONTROLS (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Curated 3 Presets Selector */}
          <ThemePresetSelector
            activeDraft={activeDraft}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
          />

          {/* 2. Granular Color Palette Editor */}
          <ColorTokenEditor
            activeDraft={activeDraft}
            onTokenChange={handleTokenChange}
          />

          {/* 3. WCAG Accessibility & Contrast Calculator */}
          <ContrastRatioCard accentColor={activeDraft.primaryAccent} />

          {/* Guidelines / Tips Card */}
          <div className="p-4 sm:p-5 rounded-3xl border border-white/5 bg-white/5 flex items-start gap-3 text-xs text-[var(--text-muted)] leading-relaxed">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[var(--text-secondary)]">
                {isAr ? 'نصيحة مهندس الواجهات الملكية:' : 'Elite UI Architecture Note:'}
              </span>
              <span>
                {isAr
                  ? 'تنعكس جميع التغييرات مباشرة في المحاكي اللحظي على الجانب المقابل. عند الضغط على "حفظ التغييرات"، يتم تخزين الرموز محلياً في متصفحك وحقنها فورياً في متغيرات CSS للموقع بالكامل.'
                  : 'All changes render instantly in the live simulator canvas. Clicking "Save Changes" commits the tokens to localStorage and directly updates root CSS variables across the entire application.'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE PREVIEW CANVAS (5 Columns) */}
        <div className="lg:col-span-5">
          <LiveStorefrontMockup
            activeDraft={activeDraft}
            mode={mode}
            onToggleMode={toggleMode}
          />
        </div>
      </div>

      {/* =========================================================================
          RESET CONFIRMATION MODAL
         ========================================================================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-[var(--bg-surface-elevated)] backdrop-blur-xl shadow-2xl flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {isAr ? 'استعادة إعدادات الهوية الافتراضية؟' : 'Reset to Brand Defaults?'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {isAr
                    ? 'سيتم التراجع عن كافة التخصيصات والرجوع إلى مظهر مايسترو الذهبي الملكي.'
                    : 'This will reset all custom tokens back to the original El Maestro Luxury Gold theme.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px]"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-900/30 transition-all min-h-[44px]"
              >
                {isAr ? 'تأكيد الاستعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminThemePage;
