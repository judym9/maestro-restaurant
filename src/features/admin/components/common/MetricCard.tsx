import React, { type ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ComponentType<LucideProps>;
  accentColor?: 'gold' | 'emerald' | 'crimson' | 'blue';
  trendText?: string;
  trendPositive?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'gold',
  trendText,
  trendPositive,
  onClick,
}) => {
  const accentClasses = {
    gold: 'text-[var(--brand-accent,var(--accent-gold))]',
    emerald: 'text-emerald-400',
    crimson: 'text-rose-400',
    blue: 'text-sky-400',
  }[accentColor] || 'text-[var(--brand-accent,var(--accent-gold))]';

  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-between p-4 sm:p-5 rounded-2xl
        bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden
        transition-all duration-200 hover:border-white/20 w-full min-w-0 text-start group shadow-sm
        ${onClick ? 'cursor-pointer hover:bg-white/[0.08] active:scale-[0.99]' : ''}
      `}
    >
      <div className="flex flex-col gap-1 min-w-0 flex-1 text-start me-3">
        <span className="text-xs sm:text-sm font-medium text-[var(--text-muted)] opacity-70 truncate">
          {title}
        </span>
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] font-mono truncate">
          {value}
        </span>
        {(subtitle || trendText) && (
          <div className="flex items-center gap-2 mt-0.5 min-w-0">
            {subtitle && (
              <span className="text-xs text-[var(--text-muted)] opacity-50 truncate flex-1">
                {subtitle}
              </span>
            )}
            {trendText && (
              <span
                dir="ltr"
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
                  trendPositive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                }`}
              >
                {trendText}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-3 rounded-xl bg-white/10 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 border border-white/5">
        <Icon className={`w-6 h-6 stroke-[2] ${accentClasses}`} />
      </div>
    </div>
  );
};

export default MetricCard;
