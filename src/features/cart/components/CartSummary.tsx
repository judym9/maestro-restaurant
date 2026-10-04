import React, { useState } from 'react';
import { MessageCircle, Clock, MapPin, Trash2, ArrowLeft, ArrowRight, CheckCircle2, User, Phone } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/ordersService';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useSiteSettings } from '../../settings/context/SiteSettingsContext';
import { Button } from '../../../common/components/Button/Button';
import './CartSummary.css';

export interface CartSummaryProps {
  onOrderSuccess?: (orderInfo: {
    orderNumber: string;
    customerName: string;
    totalPrice: number;
  }) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onOrderSuccess }) => {
  const { items, subtotal, deliveryFee = 0, grandTotal, total, clearCart, checkoutViaWhatsApp } = useCart();
  const { language, isRtl, t } = useLanguage();
  const { settings } = useSiteSettings();
  const isKitchenOpen = settings.is_restaurant_open;

  const finalTotal = grandTotal ?? total ?? subtotal;

  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleClear = () => {
    if (confirmClear) {
      clearCart();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال اسمك الكريم' : 'Please enter your name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMessage(isRtl ? 'يرجى إدخال رقم هاتف صالح' : 'Please enter a valid phone number');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await createOrder(
        {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: deliveryAddress.trim(),
        },
        items,
        finalTotal
      );

      setIsSubmitting(false);

      if (onOrderSuccess) {
        onOrderSuccess({
          orderNumber: response.orderNumber,
          customerName: customerName.trim(),
          totalPrice: finalTotal,
        });
      }

      // Reset form and clear cart
      clearCart();
      setIsCheckoutMode(false);
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Failed to place order');
    }
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="cart-summary-card">
      {/* Subtotal */}
      <div className="cart-summary-line">
        <span>{t.common.cart.subtotal}</span>
        <span className="cart-summary-val">
          {formatSYP(subtotal, { locale: language })}
        </span>
      </div>

      {deliveryFee > 0 && (
        <div className="cart-summary-line">
          <span>{isRtl ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
          <span className="cart-summary-val">
            {formatSYP(deliveryFee, { locale: language })}
          </span>
        </div>
      )}

      {/* Prep Time */}
      <div className="cart-summary-badge-line">
        <Clock size={16} />
        <span>
          {t.common.cart.estimatedPrep}: <strong>{t.common.cart.prepMinutes}</strong>
        </span>
      </div>

      {/* Delivery Note */}
      <div
        className="cart-summary-badge-line"
        style={{
          background: 'rgba(16, 185, 129, 0.08)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
          color: 'var(--emerald-500)',
        }}
      >
        <MapPin size={16} />
        <span>{t.common.cart.deliveryNote}</span>
      </div>

      {/* Total */}
      <div className="cart-summary-total-line">
        <span className="cart-total-label">{t.common.cart.total}</span>
        <span className="cart-total-amount">
          {formatSYP(finalTotal, { locale: language })}
        </span>
      </div>

      {/* Kitchen Closed Notice */}
      {!isKitchenOpen && (
        <div
          className="cart-summary-badge-line"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
            color: 'var(--crimson-500, #ef4444)',
            fontWeight: 700,
          }}
        >
          <span>⚠️ {isRtl ? 'المطعم مغلق حالياً - لا يمكن إتمام الطلب الآن' : 'Kitchen is currently closed for new orders'}</span>
        </div>
      )}

      {/* Checkout Form or Action Buttons */}
      {isCheckoutMode ? (
        <form className="checkout-form-box animate-fade-in" onSubmit={handlePlaceOrder}>
          <div className="checkout-form-title">
            <MapPin size={16} color="var(--accent-gold)" />
            <span>{t.common.cart.checkoutTitle}</span>
          </div>

          {errorMessage && (
            <div
              style={{
                color: 'var(--crimson-500)',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Name Field */}
          <div className="checkout-input-group">
            <label className="checkout-input-label">
              <User size={13} style={{ display: 'inline', marginInlineEnd: '4px' }} />
              {t.common.cart.nameLabel} *
            </label>
            <input
              type="text"
              className="checkout-input"
              placeholder={t.common.cart.namePlaceholder}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="checkout-input-group">
            <label className="checkout-input-label">
              <Phone size={13} style={{ display: 'inline', marginInlineEnd: '4px' }} />
              {t.common.cart.phoneLabel} *
            </label>
            <input
              type="tel"
              className="checkout-input"
              placeholder={t.common.cart.phonePlaceholder}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>

          {/* Address Field */}
          <div className="checkout-input-group">
            <label className="checkout-input-label">
              <MapPin size={13} style={{ display: 'inline', marginInlineEnd: '4px' }} />
              {t.common.cart.addressLabel}
            </label>
            <input
              type="text"
              className="checkout-input"
              placeholder={t.common.cart.addressPlaceholder}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div className="checkout-actions-row">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<BackIcon size={16} />}
              onClick={() => setIsCheckoutMode(false)}
            >
              {t.common.cart.backToItems}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<CheckCircle2 size={18} />}
              isLoading={isSubmitting}
              disabled={!isKitchenOpen || isSubmitting}
              className="flex-grow"
            >
              {isSubmitting ? t.common.cart.placingOrder : t.common.cart.placeOrderBtn}
            </Button>
          </div>
        </form>
      ) : (
        <div className="cart-summary-actions">
          {/* Proceed to In-App Checkout */}
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsCheckoutMode(true)}
            leftIcon={<CheckCircle2 size={18} />}
            disabled={!isKitchenOpen}
          >
            {t.common.cart.proceedToCheckout}
          </Button>

          {/* Direct WhatsApp Checkout */}
          <button
            type="button"
            className="whatsapp-checkout-btn"
            onClick={checkoutViaWhatsApp}
            disabled={!isKitchenOpen}
            style={!isKitchenOpen ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            <MessageCircle size={20} />
            <span>{t.common.cart.checkoutWhatsApp}</span>
          </button>

          {/* Clear Cart */}
          <button
            type="button"
            className="clear-cart-btn"
            onClick={handleClear}
          >
            <Trash2 size={14} />
            <span>
              {confirmClear
                ? t.common.cart.clearConfirm
                : t.common.cart.clearCart}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
