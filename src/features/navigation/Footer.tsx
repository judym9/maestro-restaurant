import React from 'react';
import { Phone, Clock, MapPin, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { BrandAssets } from '../../utils/imageRegistry';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { useSiteSettings } from '../settings/context/SiteSettingsContext';
import './Footer.css';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useSiteSettings();

  const isAr = language === 'ar';
  const restaurantName = isAr ? settings.restaurant_name_ar : settings.restaurant_name_en;
  const address = isAr ? settings.address_ar : settings.address_en;
  const hours = isAr ? settings.working_hours_ar : settings.working_hours_en;
  const primaryPhone = settings.primary_phone || '0969 697 587';
  const rawWa = settings.whatsapp_number || '963969697587';

  return (
    <footer id="footer-section" className="maestro-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <picture>
                <source srcSet={BrandAssets.logo.webp} type="image/webp" />
                <img
                  src={BrandAssets.logo.src}
                  alt={language === 'ar' ? BrandAssets.logo.altAr : BrandAssets.logo.altEn}
                  className="footer-logo-img"
                  width="52"
                  height="52"
                />
              </picture>
              <span className="footer-brand-title">
                <span className="gold-gradient-text">
                  {restaurantName}
                </span>
              </span>
            </div>
            <p className="footer-about-text">{t.home.footer.aboutText}</p>
          </div>

          {/* Working Hours & Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t.home.footer.openingHours}</h4>
            
            <div className="footer-contact-item">
              <Clock size={18} className="footer-contact-icon" />
              <span>{hours || t.home.footer.hoursText}</span>
            </div>

            <div className="footer-contact-item footer-address-block">
              <MapPin size={18} className="footer-contact-icon" />
              <div className="footer-address-content">
                <span className="footer-address-text">{address || t.home.footer.location}</span>
                <a
                  href="https://maps.google.com/?q=Amin+Street,+Al-Nabek,+Syria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-map-link"
                  title={isAr ? 'عرض الموقع على خرائط Google' : 'View on Google Maps'}
                >
                  <span>{isAr ? 'عرض على خرائط Google' : 'View on Google Maps'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <Phone size={18} className="footer-contact-icon" />
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="footer-phone-link"
                dir="ltr"
              >
                {primaryPhone}
              </a>
            </div>

            <div className="footer-contact-item">
              <MessageCircle size={18} className="footer-contact-icon" />
              <a
                href={`https://wa.me/${rawWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-phone-link"
                dir="ltr"
              >
                +{rawWa} (WhatsApp)
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom-row">
          <span>{t.home.footer.allRightsReserved}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            Made with <Heart size={14} color="#e11d48" fill="#e11d48" /> for Maestro Gastronomy
          </span>
        </div>
      </div>
    </footer>
  );
};
