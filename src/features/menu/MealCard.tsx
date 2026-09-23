import React from 'react';
import { Star, Flame, Award, Sparkles, Plus } from 'lucide-react';
import type { MealItem } from './mealsData';
import { ImageWithFallback } from '../../common/components/ImageWithFallback/ImageWithFallback';
import { Badge } from '../../common/components/Badge/Badge';
import { Button } from '../../common/components/Button/Button';
import { getMealImage } from '../../utils/imageRegistry';
import { formatSYP, calculateDiscount } from '../../utils/currency';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './MealCard.css';

export interface MealCardProps {
  meal: MealItem;
  onSelect: (meal: MealItem) => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onSelect }) => {
  const { language, isRtl, t } = useLanguage();
  const imageAsset = getMealImage(meal.imageKey);

  const discountPercent = meal.originalPrice
    ? calculateDiscount(meal.originalPrice, meal.price)
    : 0;

  const title = language === 'ar' ? meal.nameAr : meal.nameEn;
  const description = language === 'ar' ? meal.descriptionAr : meal.descriptionEn;
  const alt = language === 'ar' ? imageAsset.altAr : imageAsset.altEn;

  return (
    <article className="meal-card animate-fade-in" onClick={() => onSelect(meal)}>
      <div className="meal-card-image-wrap">
        <ImageWithFallback
          src={imageAsset.src}
          webpSrc={imageAsset.webp}
          alt={alt}
          containerClassName="h-full"
        />

        <div className="meal-card-badges">
          {meal.isSignature && (
            <Badge variant="gold" icon={<Award size={13} />}>
              {t.common.badges.signature}
            </Badge>
          )}
          {meal.isBestseller && !meal.isSignature && (
            <Badge variant="emerald" icon={<Sparkles size={13} />}>
              {t.common.badges.bestseller}
            </Badge>
          )}
          {meal.isSpicy && (
            <Badge variant="crimson" icon={<Flame size={13} />}>
              {t.common.badges.spicy}
            </Badge>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="meal-card-discount-badge">
            <Badge variant="crimson" pulse>
              {isRtl ? `${discountPercent}% خصم` : `${discountPercent}% OFF`}
            </Badge>
          </div>
        )}
      </div>

      <div className="meal-card-content">
        <div className="meal-card-header">
          <h3 className="meal-card-title">{title}</h3>
          <div className="meal-card-rating">
            <Star size={14} fill="currentColor" />
            <span>{meal.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="meal-card-desc">{description}</p>

        <div className="meal-card-footer">
          <div className="meal-card-price-block">
            <span className="meal-card-price">
              {formatSYP(meal.price, { locale: language })}
            </span>
            {meal.originalPrice && (
              <span className="meal-card-original-price">
                {formatSYP(meal.originalPrice, { locale: language })}
              </span>
            )}
          </div>

          <div className="meal-card-actions">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(meal);
              }}
            >
              {t.common.actions.order}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
