import React, { useState } from 'react';
import { BrandAssets } from '../../../utils/imageRegistry';
import { cn } from '../../../utils/cn';
import './ImageWithFallback.css';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  webpSrc?: string;
  fallbackSrc?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  webpSrc,
  fallbackSrc = BrandAssets.fallback.src,
  alt = 'Maestro culinary specialty',
  className,
  containerClassName,
  aspectRatio,
  loading = 'lazy',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const effectiveSrc = hasError ? fallbackSrc : (src || fallbackSrc);

  return (
    <div
      className={cn('image-container', containerClassName)}
      style={{ aspectRatio: aspectRatio || undefined }}
    >
      {/* Shimmer skeleton while loading */}
      <div
        className={cn(
          'image-skeleton skeleton-shimmer',
          isLoaded && 'hidden'
        )}
      />

      <picture>
        {!hasError && webpSrc && (
          <source srcSet={webpSrc} type="image/webp" />
        )}
        <img
          src={effectiveSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'image-element',
            isLoaded && 'loaded',
            hasError && 'fallback',
            className
          )}
          {...rest}
        />
      </picture>
    </div>
  );
};
