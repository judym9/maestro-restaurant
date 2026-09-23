import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Utensils } from 'lucide-react';
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
  const { t } = useLanguage();

  const [placedOrder, setPlacedOrder] = useState<PlacedOrderInfo | null>(null);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
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
  }, [isOpen, closeCart]);

  const handleBrowseMenu = () => {
    closeCart();
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {isOpen && (
        <div className="cart-drawer-backdrop" onClick={closeCart}>
          <aside
            className="cart-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.common.cart.title}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <div className="cart-drawer-title-group">
                <h3 className="cart-drawer-title">{t.common.cart.title}</h3>
                {totalItems > 0 && (
                  <span className="cart-header-badge">
                    {totalItems} {totalItems === 1 ? t.common.cart.item : t.common.cart.items}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="cart-drawer-close"
                onClick={closeCart}
                aria-label={t.common.actions.close}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Items or Empty State */}
            {items.length === 0 ? (
              <div className="cart-empty-state animate-fade-in">
                <div className="cart-empty-icon-wrap">
                  <ShoppingBag size={38} />
                </div>
                <h4 className="cart-empty-title">{t.common.cart.emptyTitle}</h4>
                <p className="cart-empty-subtitle">{t.common.cart.emptySubtitle}</p>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Utensils size={16} />}
                  onClick={handleBrowseMenu}
                  className="mt-3"
                >
                  {t.common.cart.browseMenu}
                </Button>
              </div>
            ) : (
              <>
                <div className="cart-items-scrollable">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Sticky Summary & Checkout Footer */}
                <CartSummary
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
