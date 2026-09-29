import React, { useState } from 'react';
import { useSiteSettings } from '../../../features/settings/context/SiteSettingsContext';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { Megaphone, X, Power, Clock } from 'lucide-react';
import './StorefrontBanner.css';

export const StorefrontBanner: React.FC = () => {
  const { settings } = useSiteSettings();
  const { language } = useLanguage();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isAr = language === 'ar';
  const bannerText = isAr ? settings.banner_text_ar : settings.banner_text_en;
  const deliveryEstimate = isAr ? settings.delivery_estimate_ar : settings.delivery_estimate_en;

  return (
    <>
      {/* Restaurant Closed Warning if closed */}
      {!settings.is_restaurant_open && (
        <div className="storefront-closed-bar animate-fade-in" role="alert">
          <div className="container storefront-banner-container">
            <div className="storefront-banner-content">
              <span className="storefront-closed-badge">
                <Power size={13} />
                <span>{isAr ? 'المطعم مغلق حالياً' : 'Kitchen Closed'}</span>
              </span>
              <span className="storefront-banner-text">
                {isAr
                  ? `نستقبل استفساراتكم وحجوزاتكم المسبقة. تصفح القائمة وسيعاود المطبخ العمل في الموعد المحدد (${settings.working_hours_ar})`
                  : `Currently closed for live orders. Feel free to browse our menu (${settings.working_hours_en})`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Announcement / Delivery Coverage Banner */}
      {settings.banner_enabled && !bannerDismissed && (
        <div className="storefront-announcement-bar animate-fade-in" role="status">
          <div className="container storefront-banner-container">
            <div className="storefront-banner-content">
              <span className="storefront-banner-icon-wrap">
                <Megaphone size={15} />
              </span>
              <span className="storefront-banner-text font-medium">
                {bannerText}
              </span>
              {deliveryEstimate && (
                <span className="storefront-delivery-pill">
                  <Clock size={12} />
                  <span>{deliveryEstimate}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="storefront-banner-close"
              aria-label="Dismiss banner"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
