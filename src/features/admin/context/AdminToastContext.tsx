import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface AdminToastContextType {
  showToast: (type: ToastType, message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const AdminToastContext = createContext<AdminToastContextType | undefined>(undefined);

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { isRtl } = useLanguage();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <AdminToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <aside
        className={`fixed bottom-6 ${isRtl ? 'start-6' : 'end-6'} z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none`}
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto flex items-start gap-3.5 p-4 px-4.5 rounded-2xl border shadow-xl
                bg-[var(--bg-surface-elevated)] backdrop-blur-md transition-all duration-300
                ${
                  isSuccess
                    ? 'border-emerald-500/30 text-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)]'
                    : isError
                    ? 'border-rose-500/30 text-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.15)]'
                    : 'border-[var(--accent-gold)]/30 text-[var(--text-primary)] shadow-[0_4px_20px_rgba(245,158,11,0.15)]'
                }
              `}
              role="alert"
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-[var(--accent-gold)]" />}
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                {toast.title && (
                  <span className="text-xs font-bold text-[var(--text-primary)] mb-1">
                    {toast.title}
                  </span>
                )}
                <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {toast.message}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </aside>
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = (): AdminToastContextType => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};
