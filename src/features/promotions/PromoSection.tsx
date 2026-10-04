import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { getPromotions } from '../menu/services/mealsService';
import { PROMOTIONS_UPDATED_EVENT } from '../admin/services/promotionsRepository';
import type { PromoDeal } from './promosData';
import { PromoCard } from './PromoCard';
import { usePromoPagination } from './usePromoPagination';
import { Badge } from '../../common/components/Badge/Badge';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { useMediaQuery } from '../../common/hooks/useMediaQuery';
import { useCart } from '../cart/hooks/useCart';
import './PromoSection.css';

export const PromoSection: React.FC = () => {
  const { isRtl, t } = useLanguage();
  const { addItem } = useCart();
  const isMobile = useMediaQuery('(max-width: 840px)');

  const [promos, setPromos] = useState<PromoDeal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPromos = () => {
      getPromotions().then((res) => {
        if (isMounted) {
          setPromos(res.data);
          setIsLoading(false);
        }
      });
    };

    fetchPromos();
    window.addEventListener(PROMOTIONS_UPDATED_EVENT, fetchPromos);
    return () => {
      isMounted = false;
      window.removeEventListener(PROMOTIONS_UPDATED_EVENT, fetchPromos);
    };
  }, []);

  const {
    currentPage,
    totalPages,
    currentDeals,
    nextPage,
    prevPage,
    goToPage,
  } = usePromoPagination({
    deals: promos,
    pageSize: isMobile ? 1 : 2,
  });

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const handleClaim = (deal: PromoDeal) => {
    const title = isRtl ? deal.titleAr : deal.titleEn;
    setClaimedNotice(title);
    addItem({
      mealId: deal.id,
      nameAr: deal.titleAr,
      nameEn: deal.titleEn,
      imageKey: deal.imageKey,
      unitPrice: deal.price,
      quantity: 1,
      instructions: isRtl
        ? `عرض خاص (${deal.discountPercent}% خصم)`
        : `Special Deal (${deal.discountPercent}% OFF)`,
    });
    setTimeout(() => {
      setClaimedNotice(null);
    }, 3500);
  };

  return (
    <section id="promotions-section" className="promo-section">
      <div className="container">
        <div className="promo-section-header-wrap">
          <div className="promo-header-text">
            <Badge variant="crimson" pulse icon={<Tag size={13} />} className="mb-3">
              {t.common.badges.limited}
            </Badge>
            <h2 className="promo-section-title">
              <span className="crimson-gradient-text">{t.home.promotions.sectionTitle}</span>
            </h2>
            <p className="promo-section-subtitle">{t.home.promotions.sectionSubtitle}</p>
          </div>

          <div className="promo-nav-controls">
            <button
              type="button"
              className="promo-nav-btn"
              onClick={prevPage}
              aria-label={t.common.actions.prev}
            >
              <PrevIcon size={20} />
            </button>
            <button
              type="button"
              className="promo-nav-btn"
              onClick={nextPage}
              aria-label={t.common.actions.next}
            >
              <NextIcon size={20} />
            </button>
          </div>
        </div>

        {/* Claimed Notification Toast */}
        {claimedNotice && (
          <div
            className="animate-scale-up"
            style={{
              padding: '0.85rem 1.5rem',
              marginBottom: '1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--emerald-500)',
              color: 'var(--emerald-500)',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            ✓ {isRtl ? `تم اختيار: "${claimedNotice}" - يسعدنا تلبية طلبكم!` : `Selected: "${claimedNotice}" - We're excited to serve you!`}
          </div>
        )}

        <div className="promo-deals-grid">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="promo-card skeleton-shimmer"
                style={{ height: '380px', borderRadius: 'var(--radius-xl)' }}
              />
            ))
          ) : (
            currentDeals.map((deal) => (
              <PromoCard key={deal.id} deal={deal} onClaim={handleClaim} />
            ))
          )}
        </div>

        {/* Dot indicators */}
        <div className="promo-dots-indicator">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`promo-dot ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => goToPage(i + 1)}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
