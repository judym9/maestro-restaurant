import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Utensils, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { OrderSuccessModal } from './OrderSuccessModal';
import { Button } from '../../../common/components/Button/Button';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import './CartDrawer.css';

interface PlacedOrderInfo {
  orderNumber: string;
  customerName: string;
  totalPrice: number;
}

export const CartDrawer: React.FC = () => {
  const { items, isOpen, totalItems, closeCart } = useCart();
  const { isRtl, t } = useLanguage();

  const [placedOrder, setPlacedOrder] = useState<PlacedOrderInfo | null>(null);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const drawerPanelRef = useRef<HTMLElement>(null);

  // Reset checkout mode when drawer closes or items become empty
  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setIsCheckoutMode(false);
    }
  }, [isOpen, items.length]);

  // Handle ESC key to dismiss & trap body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isCheckoutMode) {
          setIsCheckoutMode(false);
        } else {
          closeCart();
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isCheckoutMode, closeCart]);

  const handleBrowseMenu = () => {
    closeCart();
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const BackStepIcon = isRtl ? ChevronRight : ChevronLeft;

  return (
    <>
      {isOpen && (
        <div
          className="cart-drawer-backdrop"
          onClick={closeCart}
          aria-hidden={!isOpen}
        >
          <aside
            ref={drawerPanelRef}
            className="cart-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-heading"
          >
            {/* Elevated Sticky Header */}
            <header className="cart-drawer-header">
              <div className="cart-drawer-title-group">
                {isCheckoutMode ? (
                  <button
                    type="button"
                    className="cart-back-step-btn"
                    onClick={() => setIsCheckoutMode(false)}
                    aria-label={t.common.cart.backToItems}
                  >
                    <BackStepIcon size={18} />
                    <span>{t.common.cart.backToItems}</span>
                  </button>
                ) : (
                  <>
                    <div className="cart-header-icon-pill">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h2 id="cart-drawer-heading" className="cart-drawer-title">
                        {t.common.cart.title}
                      </h2>
                      {totalItems > 0 && (
                        <p className="cart-drawer-subtitle">
                          {totalItems} {totalItems === 1 ? t.common.cart.item : t.common.cart.items}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="cart-drawer-header-actions">
                {/* Step indicator pill when in checkout mode */}
                {isCheckoutMode && (
                  <span className="cart-step-pill">
                    <ShieldCheck size={13} />
                    <span>{isRtl ? 'الخطوة 2 من 2' : 'Step 2 of 2'}</span>
                  </span>
                )}

                <button
                  type="button"
                  className="cart-drawer-close"
                  onClick={closeCart}
                  aria-label={t.common.actions.close}
                  title={t.common.actions.close}
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Scrollable Items or Empty State */}
            {items.length === 0 ? (
              <div className="cart-empty-state">
                <div className="cart-empty-graphic-wrapper">
                  <div className="cart-empty-ambient-aura" />
                  <div className="cart-empty-icon-bubble">
                    <ShoppingBag size={38} />
                  </div>
                  <span className="cart-empty-sparkle-dot top">
                    <Sparkles size={14} />
                  </span>
                  <span className="cart-empty-sparkle-dot bottom">
                    <Utensils size={13} />
                  </span>
                </div>

                <div className="cart-empty-text-wrap">
                  <h3 className="cart-empty-title">{t.common.cart.emptyTitle}</h3>
                  <p className="cart-empty-subtitle">{t.common.cart.emptySubtitle}</p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Utensils size={16} />}
                  onClick={handleBrowseMenu}
                  className="cart-empty-cta-btn"
                >
                  {t.common.cart.browseMenu}
                </Button>
              </div>
            ) : (
              <>
                <div className="cart-items-scrollable" role="region" aria-label="Cart Items">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Sticky Summary & Checkout Footer */}
                <CartSummary
                  isCheckoutMode={isCheckoutMode}
                  onToggleCheckoutMode={setIsCheckoutMode}
                  onOrderSuccess={(orderInfo) => {
                    setPlacedOrder(orderInfo);
                    closeCart();
                  }}
                />
              </>
            )}
          </aside>
        </div>
      )}

      {/* Confirmation Modal when order is persisted */}
      {placedOrder && (
        <OrderSuccessModal
          isOpen={Boolean(placedOrder)}
          onClose={() => setPlacedOrder(null)}
          orderNumber={placedOrder.orderNumber}
          customerName={placedOrder.customerName}
          totalPrice={placedOrder.totalPrice}
        />
      )}
    </>
  );
};

