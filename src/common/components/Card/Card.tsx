import React from 'react';
import { cn } from '../../../utils/cn';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  interactive?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = false,
  interactive = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'maestro-card',
        glass && 'maestro-card-glass',
        interactive && 'maestro-card-interactive',
        glow && 'maestro-card-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
