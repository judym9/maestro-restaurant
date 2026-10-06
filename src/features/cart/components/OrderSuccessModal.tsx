import React, { useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Utensils,
  Clock,
  Copy,
  Check,
  User,
  Receipt
} from 'lucide-react';
import { Modal } from '../../../common/components/Modal/Modal';
import { Button } from '../../../common/components/Button/Button';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useSiteSettings } from '../../../features/settings/context/SiteSettingsContext';
import './OrderSuccessModal.css';

export interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  customerName,
  totalPrice,
}) => {
  const { language, isRtl, t } = useLanguage();
  const { settings } = useSiteSettings();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    const phone = settings.whatsapp_number ? settings.whatsapp_number.replace(/\D/g, '') : '963969697587';
    const message = isRtl
      ? `مرحباً مطعم مايسترو، قمت بتقديم الطلب رقم *${orderNumber}* باسم *${customerName}* بقيمة *${formatSYP(totalPrice, { locale: language })}*. يرجى تأكيد استلامه. شكراً لكم!`
      : `Hello Maestro Restaurant, I just placed order *${orderNumber}* under *${customerName}* for *${formatSYP(totalPrice, { locale: language })}*. Please confirm. Thank you!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <div className="order-success-card">
        {/* Animated Success Badge */}
        <div className="order-success-icon-wrapper">
          <div className="order-success-ambient-glow" />
          <div className="order-success-icon-badge">
            <CheckCircle2 size={44} />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="order-success-header">
          <h3 className="order-success-title">{t.common.cart.orderSuccessTitle}</h3>
          <p className="order-success-subtitle">{t.common.cart.orderSuccessSubtitle}</p>
        </div>

        {/* Digital Ticket / Receipt Card */}
        <div className="order-ticket-container">
          <div className="order-ticket-header">
            <div className="order-ticket-label-group">
              <Receipt size={14} className="order-ticket-icon" />
              <span className="order-ticket-label">{t.common.cart.orderNumberLabel}</span>
            </div>

            {/* Interactive 1-click Copy */}
            <button
              type="button"
              className={`order-code-copy-btn ${copied ? 'is-copied' : ''}`}
              onClick={handleCopyCode}
              title={copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ رقم الطلب' : 'Copy order code')}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <div className="order-code-display font-numeric">{orderNumber}</div>

          <div className="order-ticket-perforation">
            <div className="ticket-notch left" />
            <div className="ticket-dashed-line" />
            <div className="ticket-notch right" />
          </div>

          {/* Details Row */}
          <div className="order-meta-grid">
            <div className="order-meta-item">
              <User size={13} className="order-meta-item-icon" />
              <span className="order-meta-item-text">{customerName}</span>
            </div>

            <div className="order-meta-item">
              <Clock size={13} className="order-meta-item-icon" />
              <span className="order-meta-item-text">{t.common.cart.prepMinutes}</span>
            </div>

            <div className="order-meta-item highlight">
              <span className="order-meta-item-text font-numeric">
                {formatSYP(totalPrice, { locale: language })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="order-success-action-stack">
          <button
            type="button"
            className="cart-whatsapp-button order-whatsapp-cta"
            onClick={handleOpenWhatsApp}
          >
            <MessageCircle size={20} />
            <span>{t.common.cart.whatsappFollowup}</span>
          </button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<Utensils size={16} />}
            onClick={onClose}
            className="w-full"
          >
            {t.common.cart.backToMenu}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

