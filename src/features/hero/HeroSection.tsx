import React from 'react';
import { Sparkles, Utensils, Award, Flame, Cake, ShieldCheck } from 'lucide-react';
import { Button } from '../../common/components/Button/Button';
import { Badge } from '../../common/components/Badge/Badge';
import { ImageWithFallback } from '../../common/components/ImageWithFallback/ImageWithFallback';
import { BrandAssets } from '../../utils/imageRegistry';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const { language, isRtl, t } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Utensils size={20} />,
      title: t.home.features.freshIngredients.title,
      desc: t.home.features.freshIngredients.desc,
    },
    {
      icon: <Flame size={20} />,
      title: t.home.features.authenticRecipe.title,
      desc: t.home.features.authenticRecipe.desc,
    },
    {
      icon: <Award size={20} />,
      title: t.home.features.fastService.title,
      desc: t.home.features.fastService.desc,
    },
    {
      icon: <Cake size={20} />,
      title: t.home.features.celebrationEvents.title,
      desc: t.home.features.celebrationEvents.desc,
    },
  ];

  return (
    <section id="hero-section" className="hero-section">
      <div className="hero-glow-orb" />

      <div className="container">
        <div className="hero-grid">
          {/* Main Copy */}
          <div className="hero-content animate-fade-in">
            <Badge variant="gold" icon={<Sparkles size={14} />}>
              {t.home.hero.badge}
            </Badge>

            <h1 className="hero-main-title">
              {t.home.hero.titlePrefix}{' '}
              <span className="gold-gradient-text">
                {t.home.hero.titleHighlight}
              </span>
            </h1>

            <p className="hero-description">{t.home.hero.description}</p>

            <div className="hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Utensils size={18} />}
                onClick={() => scrollTo('menu-section')}
              >
                {t.home.hero.exploreMenu}
              </Button>

              <Button
                variant="outline"
                size="lg"
                leftIcon={<Cake size={18} />}
                onClick={() => scrollTo('promotions-section')}
              >
                {t.home.hero.orderSpecial}
              </Button>
            </div>

            {/* Stats Row */}
            <div className="hero-stats-row grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-center">
              <div className="hero-stat-card text-center">
                <span className="hero-stat-number">+12</span>
                <span className="hero-stat-label">{t.home.hero.stats.experience}</span>
              </div>
              <div className="hero-stat-card text-center">
                <span className="hero-stat-number">+25</span>
                <span className="hero-stat-label">{t.home.hero.stats.dishes}</span>
              </div>
              <div className="hero-stat-card text-center">
                <span className="hero-stat-number">+50K</span>
                <span className="hero-stat-label">{t.home.hero.stats.satisfied}</span>
              </div>
              <div className="hero-stat-card text-center">
                <span className="hero-stat-number">4.9 ★</span>
                <span className="hero-stat-label">{t.home.hero.stats.rating}</span>
              </div>
            </div>
          </div>

          {/* Official Brand Hero Visual */}
          <div className="hero-media-wrapper animate-fade-in w-full max-w-sm sm:max-w-md mx-auto">
            <div className="hero-poster-frame w-full">
              <ImageWithFallback
                src={BrandAssets.heroBanner.src}
                webpSrc={BrandAssets.heroBanner.webp}
                alt={language === 'ar' ? BrandAssets.heroBanner.altAr : BrandAssets.heroBanner.altEn}
                aspectRatio="1 / 1"
              />
            </div>

            {/* Floating Quality Guarantee Tag */}
            <div className="hero-floating-tag">
              <div className="floating-tag-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="floating-tag-text">
                <span className="floating-tag-title">
                  {isRtl ? 'جودة ونظافة مضمونة 100%' : '100% Guaranteed Quality'}
                </span>
                <span className="floating-tag-subtitle">
                  {isRtl ? 'دجاج طازج وتتبيلة يومية' : 'Fresh Poultry & Daily Marinade'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Props */}
        <div className="hero-features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card animate-fade-in">
              <div className="feature-icon-box">{feat.icon}</div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
