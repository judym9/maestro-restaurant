import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import './FloatingWhatsApp.css';

export interface FloatingWhatsAppProps {
  phoneNumber?: string;
  displayNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '963969697587',
  displayNumber = '0969 697 587',
}) => {
  const { isRtl } = useLanguage();

  const labelText = isRtl
    ? `واتساب | ${displayNumber}`
    : `WhatsApp | ${displayNumber}`;

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      aria-label={labelText}
      title={labelText}
    >
      <div className="floating-whatsapp-icon-wrap">
        <span className="floating-whatsapp-pulse" />
        <MessageCircle size={24} />
      </div>
      <span className="floating-whatsapp-label">{labelText}</span>
    </a>
  );
};
