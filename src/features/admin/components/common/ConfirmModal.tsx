import React from 'react';
import { AlertTriangle, Trash2, Check } from 'lucide-react';
import { Modal } from './Modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأكيد الحذف',
  cancelText = 'إلغاء',
  variant = 'danger',
  isLoading = false,
}) => {
  const iconConfig = {
    danger: {
      icon: Trash2,
      wrapperClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      btnClass:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
    },
    warning: {
      icon: AlertTriangle,
      wrapperClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      btnClass:
        'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20',
    },
    primary: {
      icon: Check,
      wrapperClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      btnClass:
        'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold',
    },
  }[variant];

  const Icon = iconConfig.icon;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex flex-col items-center text-center space-y-5 py-3">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${iconConfig.wrapperClass}`}
        >
          <Icon className="w-8 h-8" />
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-sm px-2">
          {message}
        </p>

        <div className="flex items-center gap-3.5 w-full pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${iconConfig.btnClass}`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
