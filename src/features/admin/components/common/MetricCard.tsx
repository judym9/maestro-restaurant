import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'danger' | 'gold';
  };
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  onClick,
  className = '',
}) => {
  const badgeClasses = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    gold: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
  }[badge?.variant || 'info'];

  return (
    <div
      onClick={onClick}
      className={`relative px-3.5 sm:px-6 py-3.5 sm:py-5.5 rounded-2xl bg-slate-900/60 sm:bg-[#0b101b] border border-slate-800/80 shadow-md shadow-black/20 hover:border-slate-700/80 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99]' : ''
      } ${className}`}
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-2 end-2 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-2 sm:gap-3.5">
        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 block truncate leading-tight">
            {title}
          </span>
          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-2xl font-extrabold text-white tracking-tight font-mono leading-none">
              {value}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold border ${badgeClasses}`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[9px] sm:text-[11px] text-slate-500 truncate pt-0.5 leading-tight">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
