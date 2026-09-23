import React from 'react';
import { Phone, Clock, MapPin, Heart, MessageCircle } from 'lucide-react';
import { BrandAssets } from '../../utils/imageRegistry';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './Footer.css';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

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
                  {language === 'ar' ? 'مطعم مايسترو' : 'MAESTRO Restaurant'}
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
              <span>{t.home.footer.hoursText}</span>
            </div>

            <div className="footer-contact-item">
              <MapPin size={18} className="footer-contact-icon" />
              <span>{t.home.footer.location}</span>
            </div>

            <div className="footer-contact-item">
              <Phone size={18} className="footer-contact-icon" />
              <a
                href="tel:+963969697587"
                className="footer-phone-link"
                dir="ltr"
              >
                0969 697 587
              </a>
            </div>

            <div className="footer-contact-item">
              <MessageCircle size={18} className="footer-contact-icon" />
              <a
                href="https://wa.me/963969697587"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-phone-link"
                dir="ltr"
              >
                +963 969 697 587 (WhatsApp)
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
