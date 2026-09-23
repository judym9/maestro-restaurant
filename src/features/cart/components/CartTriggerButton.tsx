import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { cn } from '../../../utils/cn';
import './CartTriggerButton.css';

export interface CartTriggerButtonProps {
  className?: string;
  showTotal?: boolean;
}

export const CartTriggerButton: React.FC<CartTriggerButtonProps> = ({
  className,
  showTotal = true,
}) => {
  const { totalItems, total, toggleCart } = useCart();
  const { language, t } = useLanguage();

  return (
    <button
      type="button"
      className={cn(
        'cart-trigger-btn',
        totalItems > 0 && 'has-items',
        className
      )}
      onClick={toggleCart}
      aria-label={t.common.cart.title}
      title={t.common.cart.title}
    >
      <div className="cart-trigger-icon-wrap">
        <ShoppingBag size={18} />
        {totalItems > 0 && (
          <span key={totalItems} className="cart-count-badge">
            {totalItems}
          </span>
        )}
      </div>

      {showTotal && totalItems > 0 && (
        <span className="cart-trigger-total hidden md:inline">
          {formatSYP(total, { locale: language })}
        </span>
      )}
    </button>
  );
};
