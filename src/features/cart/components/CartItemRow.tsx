import React from 'react';
import { Minus, Plus, Trash2, Flame, FileText } from 'lucide-react';
import type { CartItem } from '../types/cart.types';
import { useCart } from '../hooks/useCart';
import { ImageWithFallback } from '../../../common/components/ImageWithFallback/ImageWithFallback';
import { getMealImage } from '../../../utils/imageRegistry';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import './CartItemRow.css';

export interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { language, isRtl, t } = useLanguage();

  const imageAsset = getMealImage(item.imageKey);
  const name = isRtl ? item.nameAr : item.nameEn;
  const optionName = item.selectedOption
    ? isRtl
      ? item.selectedOption.nameAr
      : item.selectedOption.nameEn
    : null;

  const unitPrice = item.price ?? item.unitPrice ?? 0;
  const lineTotal = unitPrice * item.quantity;

  const handleDecrement = () => {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <article className="cart-item-card" aria-label={name}>
      {/* Food Thumbnail */}
      <div className="cart-item-media">
        <ImageWithFallback
          src={imageAsset.src}
          webpSrc={imageAsset.webp}
          alt={name}
          aspectRatio="1 / 1"
          containerClassName="w-full h-full"
        />
      </div>

      {/* Item Information & Customizations */}
      <div className="cart-item-body">
        <div className="cart-item-title-row">
          <h4 className="cart-item-title" title={name}>
            {name}
          </h4>
          <button
            type="button"
            className="cart-item-delete-btn"
            onClick={() => removeItem(item.id)}
            aria-label={`${t.common.cart.remove} ${name}`}
            title={t.common.cart.remove}
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Customization Pills */}
        <div className="cart-item-chips">
          {optionName && <span className="cart-chip option-chip">{optionName}</span>}
          {item.spiciness && item.spiciness !== 'mild' && (
            <span className="cart-chip spicy-chip">
              <Flame size={12} className="cart-chip-icon" />
              <span>
                {item.spiciness === 'extraSpicy'
                  ? isRtl ? 'حار ناري' : 'Fiery Hot'
                  : isRtl ? 'متوسط' : 'Medium'}
              </span>
            </span>
          )}
          {item.instructions && (
            <span className="cart-chip note-chip" title={item.instructions}>
              <FileText size={11} className="cart-chip-icon" />
              <span>{item.instructions}</span>
            </span>
          )}
        </div>

        {/* Price & Stepper Row */}
        <div className="cart-item-footer">
          <div className="cart-item-price-block">
            <span className="cart-item-total-price">
              {formatSYP(lineTotal, { locale: language })}
            </span>
            {item.quantity > 1 && (
              <span className="cart-item-unit-calc">
                {formatSYP(unitPrice, { locale: language })} × {item.quantity}
              </span>
            )}
          </div>

          {/* Stepper with WCAG compliant touch targets */}
          <div className="cart-stepper" role="group" aria-label="Quantity selector">
            <button
              type="button"
              className={`cart-stepper-btn ${item.quantity === 1 ? 'is-danger' : ''}`}
              onClick={handleDecrement}
              aria-label={item.quantity === 1 ? `${t.common.cart.remove} ${name}` : 'Decrease quantity'}
            >
              {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
            </button>

            <span className="cart-stepper-value" aria-live="polite">
              {item.quantity}
            </span>

            <button
              type="button"
              className="cart-stepper-btn"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

