import React from 'react';

export interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`} />
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full space-y-3 p-4">
    <div className="h-10 bg-slate-800/80 rounded-xl w-full animate-pulse" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 bg-slate-900/60 border border-slate-800/60 rounded-xl w-full animate-pulse" />
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-28 bg-[#0b101b] border border-slate-800/80 rounded-2xl p-5 animate-pulse flex justify-between">
        <div className="space-y-2 w-2/3">
          <div className="h-3 bg-slate-800 rounded w-1/2" />
          <div className="h-7 bg-slate-800 rounded w-3/4" />
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-800/80" />
      </div>
    ))}
  </div>
);
