import React, { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { NavBadgeKey } from '../config/navigation';

const SIDEBAR_COLLAPSED_KEY = 'maestro_admin_sidebar_collapsed';

export const AdminLayout: React.FC = () => {
  const { isRtl } = useLanguage();
  // 1. Sidebar desktop collapsed state (persisted in localStorage)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // 2. Sidebar mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // 3. Admin domain data for live badges
  const { dishes, promotions, restaurantSettings } = useAdminData();

  // Save collapsed state changes
  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch (err) {
        console.warn('Unable to save sidebar state to localStorage', err);
      }
      return next;
    });
  };

  // Compute live badges
  const badges = useMemo<Partial<Record<NavBadgeKey, number | string>>>(() => {
    const activePromosCount = promotions.filter((p) => p.isActive).length;
    const totalDishesCount = dishes.length;

    return {
      promotions: activePromosCount > 0 ? activePromosCount : undefined,
      dishes: totalDishesCount > 0 ? totalDishesCount : undefined,
      settings: restaurantSettings.isKitchenOpen ? 'ON' : 'OFF',
    };
  }, [promotions, dishes, restaurantSettings.isKitchenOpen]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex w-full bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 antialiased font-['Cairo',sans-serif]"
      id="admin-platform-shell"
    >
      {/* Primary Sidebar Rail (Desktop Fixed + Mobile Off-Canvas) */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        badges={badges}
      />

      {/* Main Administrative Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Sticky Frosted Header */}
        <AdminHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

        {/* Scrollable Sub-Route Canvas */}
        <main
          className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col focus:outline-none"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
