import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'accent' | 'stat';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  header,
  footer,
  children,
  className = '',
  glow = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-700/80 text-[#0F172A] dark:text-[#F9FAFB] shadow-xl hover:border-amber-500/40 dark:hover:border-amber-500/40',
    glass: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/80 dark:border-slate-700/60 text-[#0F172A] dark:text-[#F9FAFB] shadow-lg',
    accent: 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/30 dark:from-[#141a24] dark:to-[#0e131b] border-amber-500/30 dark:border-amber-500/30 text-[#0F172A] dark:text-[#F9FAFB] shadow-sm',
    stat: 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-700/60 text-[#0F172A] dark:text-[#F9FAFB] hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 shadow-lg',
  };

  return (
    <div
      className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-300 ${variantStyles[variant]} ${
        glow ? 'ring-1 ring-amber-500/20 shadow-amber-500/10 shadow-lg' : ''
      } ${className}`}
      {...props}
    >
      {header && <div className="mb-6 border-b border-slate-200/80 dark:border-slate-700/60 pb-5">{header}</div>}
      <div className="space-y-6">{children}</div>
      {footer && <div className="mt-6 border-t border-slate-200/80 dark:border-slate-700/60 pt-5">{footer}</div>}
    </div>
  );
};
