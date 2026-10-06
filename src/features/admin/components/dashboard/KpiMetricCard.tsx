import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type KpiColorVariant = 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';

export interface KpiBadge {
  text: string;
  variant?: 'emerald' | 'amber' | 'blue' | 'rose' | 'muted';
  icon?: React.ReactNode;
}

export interface KpiMetricCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconColorVariant?: KpiColorVariant;
  badge?: KpiBadge;
  actionNode?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}

const ICON_COLOR_STYLES: Record<KpiColorVariant, string> = {
  amber: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/25',
  blue: 'bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/25',
  emerald: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/25',
  purple: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/25',
  rose: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/25',
};

const BADGE_COLOR_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
  blue: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
  muted: 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/50',
};

/**
 * Modern SaaS KPI Metric Card (Stripe / Vercel style)
 * Clean rounded-xl cards, subtle border-zinc-800, zero text cut-off.
 */
export const KpiMetricCard: React.FC<KpiMetricCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColorVariant = 'amber',
  badge,
  actionNode,
  onClick,
  className = '',
  tooltip,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      title={tooltip}
      className={`relative bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-w-0 group ${
        isClickable
          ? 'cursor-pointer hover:border-amber-500/40 hover:-translate-y-0.5'
          : 'hover:border-slate-300 dark:hover:border-zinc-700'
      } ${className}`}
    >
      {/* Top Subtle Accent Strip */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-300 rounded-t-xl" />

      {/* Top Header: Label + Icon */}
      <div className="w-full flex items-center justify-between gap-3 min-w-0">
        <span className="text-[13px] font-semibold text-slate-500 dark:text-zinc-400">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
            ICON_COLOR_STYLES[iconColorVariant]
          }`}
        >
          <Icon size={16} />
        </div>
      </div>

      {/* Middle Metric Value */}
      <div className="my-3 flex items-baseline gap-2 min-w-0">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 font-numeric tracking-tight leading-tight">
          {value}
        </span>
      </div>

      {/* Bottom Footer: Badges & Actions (Zero cut-off, natural wrap) */}
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 min-w-0 flex-wrap">
        {badge && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border leading-normal whitespace-nowrap ${
              BADGE_COLOR_STYLES[badge.variant || 'muted']
            }`}
          >
            {badge.icon && <span className="shrink-0">{badge.icon}</span>}
            <span>{badge.text}</span>
          </span>
        )}

        {actionNode && (
          <div className="w-full flex items-center justify-between gap-2 min-w-0 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {actionNode}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader matching KpiMetricCard dimensions and layout
 */
export const KpiMetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between min-w-0 animate-pulse space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 shrink-0" />
      </div>

      {/* Value */}
      <div className="my-2">
        <div className="h-8 w-16 bg-slate-200 dark:bg-zinc-800 rounded-md" />
      </div>

      {/* Bottom pill */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="h-5 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
      </div>
    </div>
  );
};
