import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, LanguageProvider } from './providers';
import { SiteSettingsProvider } from '../features/settings/context/SiteSettingsContext';
import { CartProvider, CartDrawer } from '../features/cart';

// Storefront components
import { StorefrontBanner } from '../common/components/StorefrontBanner/StorefrontBanner';
import { Navbar } from '../features/navigation/Navbar';
import { HeroSection } from '../features/hero/HeroSection';
import { PromoSection } from '../features/promotions/PromoSection';
import { MenuGrid } from '../features/menu/MenuGrid';
import { AboutSection } from '../features/about/AboutSection';
import { Footer } from '../features/navigation/Footer';
import { FloatingWhatsApp } from '../common/components/FloatingWhatsApp/FloatingWhatsApp';

import { AdminDashboardPage } from '../features/admin';

/**
 * Customer-Facing Storefront Home Page
 */
export const StorefrontPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] mx-auto overflow-x-hidden">
      <StorefrontBanner />
      <Navbar />
      <main className="main-content flex-grow w-full max-w-[100vw] mx-auto overflow-x-hidden">
        <HeroSection />
        <PromoSection />
        <MenuGrid />
        <AboutSection />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </div>
  );
};

/**
 * Main Application with Customer Storefront & Admin Routes
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SiteSettingsProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <Routes>
                {/* Public Customer Storefront */}
                <Route path="/" element={<StorefrontPage />} />

                {/* Administration Platform */}
                <Route path="/admin" element={<AdminDashboardPage />} />

                {/* Catch-all redirect to storefront */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SiteSettingsProvider>
    </BrowserRouter>
  );
};

export default App;
