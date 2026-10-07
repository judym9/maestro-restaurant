import React, { useState } from 'react';
import { Crown } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  alt?: string;
  showFallbackBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-9 h-9 object-contain',
  alt = 'El Maestro Logo',
  showFallbackBadge = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 ${className}`}
        title={alt}
      >
        <Crown className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <img
        src="/logo.png"
        alt={alt}
        className={`${className} transition-transform duration-300`}
        onError={() => setHasError(true)}
        loading="eager"
      />
      {showFallbackBadge && (
        <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-primary)] shadow-sm" />
      )}
    </div>
  );
};

export default BrandLogo;
