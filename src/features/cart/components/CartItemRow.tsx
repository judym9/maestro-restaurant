import React from 'react';
import { Minus, Plus, Trash2, Flame } from 'lucide-react';
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

  return (
    <div className="cart-item-row animate-fade-in">
      {/* Thumbnail */}
      <div className="cart-item-thumb">
        <ImageWithFallback
          src={imageAsset.src}
          webpSrc={imageAsset.webp}
          alt={name}
          aspectRatio="1 / 1"
          containerClassName="w-full h-full"
        />
      </div>

      {/* Details */}
      <div className="cart-item-details">
        <h4 className="cart-item-name" title={name}>
          {name}
        </h4>

        <div className="cart-item-meta">
          {optionName && <span className="cart-item-tag">{optionName}</span>}
          {item.spiciness && item.spiciness !== 'mild' && (
            <span className="cart-item-tag spicy">
              <Flame size={11} style={{ display: 'inline', marginInlineEnd: '2px' }} />
              {item.spiciness === 'extraSpicy'
                ? isRtl ? 'حار ناري' : 'Fiery Hot'
                : isRtl ? 'متوسط' : 'Medium'}
            </span>
          )}
        </div>

        {item.instructions && (
          <p className="cart-item-note" title={item.instructions}>
            {t.common.cart.instructions}: {item.instructions}
          </p>
        )}
      </div>

      {/* Actions & Price */}
      <div className="cart-item-actions-col">
        <div className="cart-item-pricing">
          <span className="cart-item-price" title={isRtl ? 'سعر المفرد' : 'Unit Price'}>
            {formatSYP(unitPrice, { locale: language })}
          </span>
          {item.quantity > 1 && (
            <span className="cart-item-line-total">
              {isRtl ? 'الإجمالي: ' : 'Total: '}
              {formatSYP(lineTotal, { locale: language })}
            </span>
          )}
        </div>

        <div className="cart-item-qty-row">
          <div className="cart-qty-ctrl">
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="cart-qty-val">{item.quantity}</span>
            <button
              type="button"
              className="cart-qty-btn"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            className="cart-remove-btn"
            onClick={() => removeItem(item.id)}
            aria-label={t.common.cart.remove}
            title={t.common.cart.remove}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
