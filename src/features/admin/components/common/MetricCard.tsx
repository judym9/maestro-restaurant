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
      className={`relative px-5 sm:px-6 py-5 sm:py-6 rounded-2xl bg-[#0b101b] border border-slate-800/80 shadow-lg shadow-black/20 hover:border-slate-700 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl' : ''
      } ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-2 end-2 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3.5">
        <div className="space-y-1.5 min-w-0">
          <span className="text-xs font-medium text-slate-400 block truncate">
            {title}
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {value}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 truncate pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
