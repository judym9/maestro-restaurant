import React from 'react';
import { Clock, Sparkles, ShoppingBag } from 'lucide-react';
import type { PromoDeal } from './promosData';
import { ImageWithFallback } from '../../common/components/ImageWithFallback/ImageWithFallback';
import { Badge } from '../../common/components/Badge/Badge';
import { Button } from '../../common/components/Button/Button';
import { getMealImage } from '../../utils/imageRegistry';
import { formatSYP } from '../../utils/currency';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './PromoCard.css';

export interface PromoCardProps {
  deal: PromoDeal;
  onClaim: (deal: PromoDeal) => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({ deal, onClaim }) => {
  const { language, isRtl, t } = useLanguage();
  const imageAsset = getMealImage(deal.imageKey);

  const title = language === 'ar' ? deal.titleAr : deal.titleEn;
  const description = language === 'ar' ? deal.descriptionAr : deal.descriptionEn;
  const badgeLabel = language === 'ar' ? deal.badgeAr : deal.badgeEn;
  const alt = language === 'ar' ? imageAsset.altAr : imageAsset.altEn;

  return (
    <article className="promo-card animate-fade-in">
      <div className="promo-image-container">
        <ImageWithFallback
          src={imageAsset.src}
          webpSrc={imageAsset.webp}
          alt={alt}
          containerClassName="h-full"
        />

        <div className="promo-top-badges">
          <Badge variant="crimson" pulse icon={<Sparkles size={13} />}>
            {isRtl ? `${deal.discountPercent}% ${t.home.promotions.saveBadge}` : `${deal.discountPercent}% ${t.home.promotions.saveBadge}`}
          </Badge>
          <Badge variant="gold">
            {badgeLabel}
          </Badge>
        </div>

        <div className="promo-countdown-badge">
          <Clock size={13} />
          <span>
            {t.home.promotions.expiresIn} {deal.remainingDays} {t.home.promotions.days}
          </span>
        </div>
      </div>

      <div className="promo-card-body">
        <h3 className="promo-card-title">{title}</h3>
        <p className="promo-card-desc">{description}</p>

        <div className="promo-card-bottom">
          <div className="promo-price-group">
            <span className="promo-current-price">
              {formatSYP(deal.price, { locale: language })}
            </span>
            <span className="promo-old-price">
              {formatSYP(deal.originalPrice, { locale: language })}
            </span>
          </div>

          <Button
            variant="crimson"
            size="sm"
            leftIcon={<ShoppingBag size={16} />}
            onClick={() => onClaim(deal)}
          >
            {t.home.promotions.orderDeal}
          </Button>
        </div>
      </div>
    </article>
  );
};
