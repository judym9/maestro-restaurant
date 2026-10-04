import React, { useState } from 'react';
import { AdminSidebar, type AdminNavTab } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { useAdminSettingsContext } from '../../context/AdminSettingsContext';
import { useAdminMenuContext } from '../../context/AdminMenuContext';
import { usePromotions } from '../../hooks/usePromotions';
import type { AdminPromoDeal } from '../../types/promotions.types';

interface AdminLayoutProps {
  activeTab: AdminNavTab;
  setActiveTab: (tab: AdminNavTab) => void;
  children: React.ReactNode;
  onQuickAddMeal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  onQuickAddMeal,
}) => {
  const { language, toggleLanguage, isRtl } = useLanguage();
  const { mode: themeMode, toggleMode: toggleThemeMode } = useAdminTheme();
  const { operatingSchedule } = useAdminSettingsContext();
  const { totalDishesCount } = useAdminMenuContext();
  const { promos } = usePromotions();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className={`flex min-h-screen w-full bg-background text-foreground antialiased selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-200 ${themeMode}`}
      data-theme={themeMode}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Desktop Resizable Sidebar (Dynamic width with drag handle) */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isRtl={isRtl}
          language={language}
          toggleLanguage={toggleLanguage}
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
          isOpenNow={operatingSchedule.isOpen}
          isResizable={true}
        />
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-80 max-w-[85vw] h-full animate-slide-in">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isRtl={isRtl}
              language={language}
              toggleLanguage={toggleLanguage}
              themeMode={themeMode}
              toggleThemeMode={toggleThemeMode}
              isOpenNow={operatingSchedule.isOpen}
              isResizable={false}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Scrollable Main Viewport (Zero-Squashing Guarantee with py-10 md:py-12) */}
      <main className="flex-1 min-w-0 px-6 py-10 sm:px-8 md:px-12 md:py-12 overflow-y-auto space-y-10 custom-admin-scrollbar">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <AdminTopbar
            activeTab={activeTab}
            language={language}
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            onQuickAddMeal={onQuickAddMeal}
            dishesCount={totalDishesCount}
            promosCount={promos.filter((p: AdminPromoDeal) => p.isActive).length}
          />

          {/* Content View Container */}
          <div className="w-full min-w-0 animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
