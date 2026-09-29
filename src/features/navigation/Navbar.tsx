import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, PhoneCall, ShieldCheck } from 'lucide-react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';
import { CartTriggerButton } from '../cart/components/CartTriggerButton';
import { Button } from '../../common/components/Button/Button';
import { BrandAssets } from '../../utils/imageRegistry';
import { useLanguage } from '../../app/providers/LanguageProvider';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Initial scroll reference
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // 1. Top of page threshold: always keep visible
          if (currentScrollY <= 10) {
            setIsVisible(true);
          } else {
            const diff = currentScrollY - lastScrollY.current;

            // Downward scroll hides navbar
            if (diff > 5) {
              setIsVisible(false);
            }
            // Upward scroll immediately reveals navbar
            else if (diff < -5) {
              setIsVisible(true);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isNavbarVisible = isVisible || mobileMenuOpen;

  return (
    <header
      className={`maestro-navbar fixed top-0 left-0 right-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isNavbarVisible
          ? 'translate-y-0 navbar-visible'
          : 'translate-y-[-100%] navbar-hidden'
      }`}
    >
      <div className="container navbar-inner">
        {/* Brand Identity */}
        <div className="navbar-brand" onClick={() => scrollTo('hero-section')}>
          <picture>
            <source srcSet={BrandAssets.logo.webp} type="image/webp" />
            <img
              src={BrandAssets.logo.src}
              alt={language === 'ar' ? BrandAssets.logo.altAr : BrandAssets.logo.altEn}
              className="brand-logo-img"
              width="52"
              height="52"
            />
          </picture>
          <div className="brand-text-col">
            <span className="brand-name">
              <span className="gold-gradient-text">
                {language === 'ar' ? 'مايسترو' : 'MAESTRO'}
              </span>
            </span>
            <span className="brand-tagline">{t.common.tagline}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation">
          <ul className="navbar-links">
            <li>
              <a
                href="#hero-section"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('hero-section');
                }}
              >
                {t.common.nav.home}
              </a>
            </li>
            <li>
              <a
                href="#menu-section"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('menu-section');
                }}
              >
                {t.common.nav.menu}
              </a>
            </li>
            <li>
              <a
                href="#promotions-section"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('promotions-section');
                }}
              >
                {t.common.nav.promotions}
              </a>
            </li>
            <li>
              <a
                href="#about-section"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('about-section');
                }}
              >
                {t.common.nav.about}
              </a>
            </li>
            <li>
              <a
                href="#footer-section"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('footer-section');
                }}
              >
                {t.common.nav.contact}
              </a>
            </li>
            <li>
              <Link
                to="/admin"
                className="nav-link"
                title={language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Portal'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#F59E0B',
                  fontWeight: 600,
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <ShieldCheck size={14} />
                <span>{language === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions & Utilities */}
        <div className="navbar-actions">
          {/* Cart Trigger (Always visible) */}
          <CartTriggerButton />

          {/* Language Switcher (Collapsed on mobile < 640px) */}
          <button
            type="button"
            className="lang-toggle-btn hidden sm:inline-flex navbar-desktop-only"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            title="Toggle Arabic / English"
          >
            <Globe size={16} />
            <span>{t.common.language.toggle}</span>
          </button>

          {/* Theme Switcher (Collapsed on mobile < 640px) */}
          <ThemeSwitcher className="hidden sm:inline-flex navbar-desktop-only" />

          {/* Order CTA (Collapsed on mobile < 640px) */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PhoneCall size={16} />}
            onClick={() => scrollTo('menu-section')}
            className="hidden sm:inline-flex navbar-desktop-only"
          >
            {t.common.nav.orderNow}
          </Button>

          {/* Mobile Menu Button (Visible on mobile/tablet) */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-fade-in">
          <a
            href="#hero-section"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero-section');
            }}
          >
            {t.common.nav.home}
          </a>
          <a
            href="#menu-section"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('menu-section');
            }}
          >
            {t.common.nav.menu}
          </a>
          <a
            href="#promotions-section"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('promotions-section');
            }}
          >
            {t.common.nav.promotions}
          </a>
          <a
            href="#about-section"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('about-section');
            }}
          >
            {t.common.nav.about}
          </a>
          <a
            href="#footer-section"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('footer-section');
            }}
          >
            {t.common.nav.contact}
          </a>
          <Link
            to="/admin"
            className="mobile-nav-link"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B', fontWeight: 600 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShieldCheck size={18} />
            <span>{language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</span>
          </Link>

          {/* Mobile Drawer Utility Controls: Language & Theme Switcher */}
          <div className="mobile-drawer-utilities">
            <button
              type="button"
              className="lang-toggle-btn mobile-drawer-lang-btn"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <Globe size={18} />
              <span>{t.common.language.toggle}</span>
            </button>

            <div className="mobile-drawer-theme-box">
              <ThemeSwitcher />
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            leftIcon={<PhoneCall size={16} />}
            onClick={() => scrollTo('menu-section')}
            className="mt-2"
          >
            {t.common.nav.orderNow}
          </Button>
        </div>
      )}
    </header>
  );
};
