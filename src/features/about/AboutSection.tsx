import React from 'react';
import { CheckCircle2, HeartHandshake } from 'lucide-react';
import { Badge } from '../../common/components/Badge/Badge';
import { ImageWithFallback } from '../../common/components/ImageWithFallback/ImageWithFallback';
import { MealAssets } from '../../utils/imageRegistry';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './AboutSection.css';

export const AboutSection: React.FC = () => {
  const { language, isRtl, t } = useLanguage();

  const highlights = isRtl
    ? [
        'خلطة توابل مايسترو المبتكرة ذات الطابع الشامي العريق',
        'شاورما دجاج صافية محمرة على الحطب وسيخ الشاورما العملاق',
        'تورتات وأبراج شاورما مخصصة للحفلات والجمعات السعيدة',
        'صلصات ثوم وتومية منزلية خالية من المواد الحافظة',
      ]
    : [
        'Proprietary Levantine spice blends passed down through generations',
        'Pure succulent chicken carved fresh from our giant rotisserie spit',
        'Signature celebration towers & cakes for unforgettable events',
        'House-crafted garlic toum dips made daily with zero preservatives',
      ];

  return (
    <section id="about-section" className="about-section">
      <div className="container">
        <div className="about-grid">
          {/* Photos Cluster */}
          <div className="about-images-cluster">
            <div className="about-image-card">
              <ImageWithFallback
                src={MealAssets['shawarma-spit'].src}
                webpSrc={MealAssets['shawarma-spit'].webp}
                alt={language === 'ar' ? MealAssets['shawarma-spit'].altAr : MealAssets['shawarma-spit'].altEn}
                aspectRatio="4 / 5"
              />
            </div>
            <div className="about-image-card" style={{ marginTop: '2rem' }}>
              <ImageWithFallback
                src={MealAssets['shawarma-cake'].src}
                webpSrc={MealAssets['shawarma-cake'].webp}
                alt={language === 'ar' ? MealAssets['shawarma-cake'].altAr : MealAssets['shawarma-cake'].altEn}
                aspectRatio="4 / 5"
              />
            </div>
          </div>

          {/* About Narrative */}
          <div className="about-content">
            <Badge variant="gold" icon={<HeartHandshake size={14} />}>
              {t.common.nav.about}
            </Badge>

            <h2 className="about-title">
              <span className="gold-gradient-text">{t.home.about.title}</span>
            </h2>

            <p className="about-text">{t.home.about.paragraph1}</p>
            <p className="about-text">{t.home.about.paragraph2}</p>

            <div className="about-highlights-list">
              {highlights.map((item, idx) => (
                <div key={idx} className="about-highlight-item">
                  <CheckCircle2 size={19} className="about-check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
