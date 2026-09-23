import React from 'react';
import { ThemeProvider, LanguageProvider } from './providers';
import { CartProvider, CartDrawer } from '../features/cart';
import { Navbar } from '../features/navigation/Navbar';
import { HeroSection } from '../features/hero/HeroSection';
import { PromoSection } from '../features/promotions/PromoSection';
import { MenuGrid } from '../features/menu/MenuGrid';
import { AboutSection } from '../features/about/AboutSection';
import { Footer } from '../features/navigation/Footer';
import { FloatingWhatsApp } from '../common/components/FloatingWhatsApp/FloatingWhatsApp';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] mx-auto overflow-x-hidden">
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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
