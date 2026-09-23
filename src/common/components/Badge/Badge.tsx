import React from 'react';
import { cn } from '../../../utils/cn';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'crimson' | 'emerald' | 'neutral';
  pulse?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'gold',
  pulse = false,
  icon,
  ...props
}) => {
  return (
    <span
      className={cn(
        'maestro-badge',
        `maestro-badge-${variant}`,
        pulse && 'maestro-badge-pulse',
        className
      )}
      {...props}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
