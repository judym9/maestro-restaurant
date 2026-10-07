import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';

export interface ConfirmModalProps {
  isOpen: boolean;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  confirmLabelAr?: string;
  confirmLabelEn?: string;
  cancelLabelAr?: string;
  cancelLabelEn?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  titleAr,
  titleEn,
  messageAr,
  messageEn,
  confirmLabelAr = 'تأكيد الحذف',
  confirmLabelEn = 'Confirm Delete',
  cancelLabelAr = 'إلغاء',
  cancelLabelEn = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-6 shadow-2xl z-10 animate-scale-up">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 end-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-xl hover:bg-[var(--bg-surface)] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`
              flex items-center justify-center w-12 h-12 rounded-2xl shrink-0
              ${
                isDestructive
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                  : 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/25'
              }
            `}
          >
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="flex flex-col min-w-0 pt-0.5">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
              {language === 'ar' ? titleAr : titleEn}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === 'ar' ? messageAr : messageEn}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors min-h-[42px]"
          >
            {language === 'ar' ? cancelLabelAr : cancelLabelEn}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md min-h-[42px]
              ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                  : 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-amber-900/30'
              }
            `}
          >
            {isLoading ? (language === 'ar' ? 'جارٍ التنفيذ...' : 'Processing...') : language === 'ar' ? confirmLabelAr : confirmLabelEn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
