import React from 'react';
import { CheckCircle, MessageCircle, Utensils, Clock, DollarSign } from 'lucide-react';
import { Modal } from '../../../common/components/Modal/Modal';
import { Button } from '../../../common/components/Button/Button';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
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

  const handleOpenWhatsApp = () => {
    const phone = '963969697587';
    const message = isRtl
      ? `مرحباً مطعم مايسترو، قمت بتقديم الطلب رقم *${orderNumber}* باسم *${customerName}* بقيمة *${formatSYP(totalPrice, { locale: language })}*. يرجى تأكيد استلامه. شكراً لكم!`
      : `Hello Maestro Restaurant, I just placed order *${orderNumber}* under *${customerName}* for *${formatSYP(totalPrice, { locale: language })}*. Please confirm. Thank you!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <div className="order-success-modal animate-fade-in">
        <div className="order-success-icon-wrap">
          <CheckCircle size={46} />
        </div>

        <div>
          <h3 className="order-success-title">{t.common.cart.orderSuccessTitle}</h3>
          <p className="order-success-subtitle">{t.common.cart.orderSuccessSubtitle}</p>
        </div>

        <div className="order-code-card">
          <span className="order-code-label">{t.common.cart.orderNumberLabel}</span>
          <span className="order-code-val">{orderNumber}</span>
          <div className="order-meta-pill-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={15} color="var(--accent-gold)" />
              {t.common.cart.prepMinutes}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <DollarSign size={15} color="var(--accent-gold)" />
              {formatSYP(totalPrice, { locale: language })}
            </span>
          </div>
        </div>

        <div className="order-success-actions">
          <button
            type="button"
            className="whatsapp-checkout-btn"
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
          >
            {t.common.cart.backToMenu}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
