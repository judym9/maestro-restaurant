import React, { useState } from 'react';
import {
  MessageCircle,
  Clock,
  MapPin,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  Phone,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/ordersService';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useSiteSettings } from '../../settings/context/SiteSettingsContext';
import { Button } from '../../../common/components/Button/Button';
import './CartSummary.css';

export interface CartSummaryProps {
  isCheckoutMode?: boolean;
  onToggleCheckoutMode?: (mode: boolean) => void;
  onOrderSuccess?: (orderInfo: {
    orderNumber: string;
    customerName: string;
    totalPrice: number;
  }) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  isCheckoutMode = false,
  onToggleCheckoutMode,
  onOrderSuccess,
}) => {
  const { items, subtotal, deliveryFee = 0, grandTotal, total, clearCart, checkoutViaWhatsApp } = useCart();
  const { language, isRtl, t } = useLanguage();
  const { settings } = useSiteSettings();
  const isKitchenOpen = settings.is_restaurant_open;

  const finalTotal = grandTotal ?? total ?? subtotal;

  const [confirmClear, setConfirmClear] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

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
      if (onToggleCheckoutMode) {
        onToggleCheckoutMode(false);
      }
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || (isRtl ? 'تعذر إرسال الطلب، يرجى المحاولة ثانية' : 'Failed to place order'));
    }
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <footer className="cart-summary-footer">
      {/* Financial Breakdown Section */}
      <div className="cart-financial-sheet">
        <div className="cart-summary-line">
          <span className="cart-line-label">{t.common.cart.subtotal}</span>
          <span className="cart-line-value font-numeric">
            {formatSYP(subtotal, { locale: language })}
          </span>
        </div>

        <div className="cart-summary-line">
          <span className="cart-line-label">{isRtl ? 'خدمة التوصيل' : 'Delivery Service'}</span>
          {deliveryFee > 0 ? (
            <span className="cart-line-value font-numeric">
              {formatSYP(deliveryFee, { locale: language })}
            </span>
          ) : (
            <span className="cart-free-badge">
              <Sparkles size={11} />
              <span>{isRtl ? 'مجاني' : 'Free'}</span>
            </span>
          )}
        </div>

        {/* Grand Total */}
        <div className="cart-total-highlight-row">
          <span className="cart-total-heading">{t.common.cart.total}</span>
          <div className="cart-total-number-wrap font-numeric">
            <span className="cart-total-amount">{formatSYP(finalTotal, { locale: language })}</span>
          </div>
        </div>
      </div>

      {/* Unified Delivery & Prep Information Strip */}
      <div className="cart-meta-info-card">
        <div className="cart-meta-pill">
          <Clock size={14} className="cart-meta-icon" />
          <span className="cart-meta-text">
            {t.common.cart.estimatedPrep}: <strong>{t.common.cart.prepMinutes}</strong>
          </span>
        </div>
        <div className="cart-meta-divider" />
        <div className="cart-meta-pill">
          <MapPin size={14} className="cart-meta-icon emerald" />
          <span className="cart-meta-text">{t.common.cart.deliveryNote}</span>
        </div>
      </div>

      {/* Kitchen Closed Banner */}
      {!isKitchenOpen && (
        <div className="cart-kitchen-alert" role="alert">
          <AlertCircle size={16} className="cart-alert-icon" />
          <span>
            {isRtl
              ? 'المطعم مغلق حالياً، سيتم استلام الطلبات عند إعادة الافتتاح'
              : 'Kitchen is currently closed for new orders'}
          </span>
        </div>
      )}

      {/* Mode 2: Checkout Form */}
      {isCheckoutMode ? (
        <form className="cart-checkout-form" onSubmit={handlePlaceOrder}>
          {errorMessage && (
            <div className="cart-form-error" role="alert">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Name */}
          <div className="cart-field-group">
            <label className="cart-field-label" htmlFor="cart-customer-name">
              <User size={13} className="cart-field-icon" />
              <span>{t.common.cart.nameLabel}</span>
              <span className="cart-required-star">*</span>
            </label>
            <input
              id="cart-customer-name"
              type="text"
              className="cart-input"
              placeholder={t.common.cart.namePlaceholder}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Customer Phone */}
          <div className="cart-field-group">
            <label className="cart-field-label" htmlFor="cart-customer-phone">
              <Phone size={13} className="cart-field-icon" />
              <span>{t.common.cart.phoneLabel}</span>
              <span className="cart-required-star">*</span>
            </label>
            <input
              id="cart-customer-phone"
              type="tel"
              className="cart-input"
              dir="ltr"
              placeholder={t.common.cart.phonePlaceholder}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="cart-field-group">
            <label className="cart-field-label" htmlFor="cart-customer-address">
              <MapPin size={13} className="cart-field-icon" />
              <span>{t.common.cart.addressLabel}</span>
            </label>
            <input
              id="cart-customer-address"
              type="text"
              className="cart-input"
              placeholder={t.common.cart.addressPlaceholder}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="cart-form-action-row">
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<BackIcon size={16} />}
              onClick={() => onToggleCheckoutMode && onToggleCheckoutMode(false)}
            >
              {t.common.cart.backToItems}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<CheckCircle2 size={17} />}
              isLoading={isSubmitting}
              disabled={!isKitchenOpen || isSubmitting}
              className="cart-submit-order-btn"
            >
              {isSubmitting ? t.common.cart.placingOrder : t.common.cart.placeOrderBtn}
            </Button>
          </div>
        </form>
      ) : (
        /* Mode 1: Cart Actions */
        <div className="cart-primary-action-stack">
          {/* Proceed to In-App Checkout */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => onToggleCheckoutMode && onToggleCheckoutMode(true)}
            rightIcon={<ForwardIcon size={18} />}
            disabled={!isKitchenOpen}
            className="cart-checkout-proceed-btn"
          >
            {t.common.cart.proceedToCheckout}
          </Button>

          {/* Direct WhatsApp Instant Checkout */}
          <button
            type="button"
            className="cart-whatsapp-button"
            onClick={checkoutViaWhatsApp}
            disabled={!isKitchenOpen}
            aria-label={t.common.cart.checkoutWhatsApp}
          >
            <MessageCircle size={20} className="cart-whatsapp-icon" />
            <span className="cart-whatsapp-label">{t.common.cart.checkoutWhatsApp}</span>
          </button>

          {/* Clear Cart Interactive Confirmation */}
          <div className="cart-clear-container">
            {confirmClear ? (
              <div className="cart-clear-confirm-banner animate-fade-in">
                <span className="cart-clear-prompt">
                  {isRtl ? 'تفريغ السلة بالكامل؟' : 'Empty your whole cart?'}
                </span>
                <div className="cart-clear-button-group">
                  <button
                    type="button"
                    className="cart-confirm-action-btn destructive"
                    onClick={() => {
                      clearCart();
                      setConfirmClear(false);
                    }}
                  >
                    <Trash2 size={13} />
                    <span>{isRtl ? 'نعم، أفرغ' : 'Yes, empty'}</span>
                  </button>
                  <button
                    type="button"
                    className="cart-confirm-action-btn cancel"
                    onClick={() => setConfirmClear(false)}
                  >
                    <X size={13} />
                    <span>{isRtl ? 'تراجع' : 'Cancel'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="cart-clear-link"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 size={13} />
                <span>{t.common.cart.clearCart}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

