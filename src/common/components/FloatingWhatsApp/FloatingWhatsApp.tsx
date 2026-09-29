import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useSiteSettings } from '../../../features/settings/context/SiteSettingsContext';
import './FloatingWhatsApp.css';

export interface FloatingWhatsAppProps {
  phoneNumber?: string;
  displayNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  displayNumber,
}) => {
  const { isRtl } = useLanguage();
  const { settings } = useSiteSettings();

  const activePhone = phoneNumber || settings.whatsapp_number || '963969697587';
  const activeDisplay = displayNumber || settings.primary_phone || '0969 697 587';

  const labelText = isRtl
    ? `واتساب | ${activeDisplay}`
    : `WhatsApp | ${activeDisplay}`;

  return (
    <a
      href={`https://wa.me/${activePhone.replace(/\D/g, '')}`}
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
