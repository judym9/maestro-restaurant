import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  SlidersHorizontal,
  Palette,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { BrandLogo } from './BrandLogo';

interface NavRouteItem {
  path: string;
  labelAr: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badgeKey?: 'dishes' | 'promotions';
}

const NAV_ITEMS: NavRouteItem[] = [
  { path: '/admin', labelAr: 'لوحة القيادة', icon: LayoutDashboard, exact: true },
  { path: '/admin/menu', labelAr: 'قائمة الطعام', icon: UtensilsCrossed, badgeKey: 'dishes' },
  { path: '/admin/promotions', labelAr: 'العروض الملكية', icon: Sparkles, badgeKey: 'promotions' },
  { path: '/admin/settings', labelAr: 'إعدادات الفرع', icon: SlidersHorizontal },
  { path: '/admin/theme', labelAr: 'تخصيص المظهر', icon: Palette },
];

/**
 * Modern Executive Administration Shell Layout
 * Fully responsive with luxury dark styling, live telemetry badges, and mobile slide-over drawer.
 */
export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const { dishes, promotions, restaurantSettings } = useAdminData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Automatically close mobile drawer when navigating to a new route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const getBadgeValue = (badgeKey?: 'dishes' | 'promotions') => {
    if (badgeKey === 'dishes') return dishes.length;
    if (badgeKey === 'promotions') return promotions.filter((p) => p.isActive).length;
    return null;
  };

  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] flex flex-col bg-[#070b12] text-slate-100 font-['Cairo',sans-serif] selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden"
    >
      {/* Top Administrative Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b101b]/95 backdrop-blur-md shadow-lg shadow-black/20 pt-safe">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo & Platform Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/admin" className="flex items-center gap-2 sm:gap-2.5 group">
                <BrandLogo className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    مايسترو الملكي
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium text-amber-500 tracking-wider">
                    لوحة تحكم الإدارة
                  </span>
                </div>
              </Link>

              {/* Kitchen Live Status Badge (Hidden on small mobile, visible inside drawer) */}
              <div
                className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                  restaurantSettings.isKitchenOpen
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    restaurantSettings.isKitchenOpen
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-rose-400'
                  }`}
                />
                <span>
                  {restaurantSettings.isKitchenOpen ? 'المطبخ يستقبل الطلبات' : 'المطبخ متوقف'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                const badge = getBadgeValue(item.badgeKey);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.labelAr}</span>
                    {badge !== null && badge > 0 && (
                      <span
                        className={`px-2 py-0.5 min-w-[20px] text-center rounded-full text-[11px] font-mono font-bold leading-none ${
                          isActive
                            ? 'bg-amber-500/25 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Link to Public Storefront */}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                title="معاينة المتجر العام للزبائن"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span>المتجر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {/* User Role Badge (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] text-amber-400 uppercase font-semibold">
                  {user?.role || 'admin'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="max-w-[120px] truncate text-slate-300">
                  {user?.email || 'admin@elmaestro.com'}
                </span>
              </div>

              {/* Desktop Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>

              {/* Mobile Hamburger Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors active:scale-95"
                aria-label="فتح القائمة الرئيسية"
              >
                <MenuIcon className="w-5 h-5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer & Dark Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="إغلاق القائمة"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[#0c121e]/98 backdrop-blur-xl border-l border-slate-800/80 z-50 p-4 sm:p-5 pt-safe pb-safe shadow-2xl flex flex-col justify-between overflow-y-auto max-h-full transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        aria-label="قائمة التنقل للأجهزة الذكية"
      >
        {/* Drawer Header */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <BrandLogo className="w-7 h-7 rounded-lg" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white">مايسترو الملكي</span>
                <span className="text-[9px] text-amber-400 font-medium">لوحة تحكم الإدارة</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Kitchen Live Status in Mobile Drawer */}
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold border ${
              restaurantSettings.isKitchenOpen
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  restaurantSettings.isKitchenOpen
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span>استقبال الطلبات:</span>
            </div>
            <span className="font-bold">
              {restaurantSettings.isKitchenOpen ? 'المطبخ نشط' : 'متوقف'}
            </span>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1 pt-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              const badge = getBadgeValue(item.badgeKey);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-amber-400/90" />
                    <span>{item.labelAr}</span>
                  </div>
                  {badge !== null && badge > 0 && (
                    <span className="px-2 py-0.5 min-w-[20px] text-center rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="space-y-2.5 pt-3.5 border-t border-slate-800/80">
          {/* User Email & Role */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-amber-400 font-mono font-semibold uppercase">
                {user?.role || 'admin'}
              </span>
              <span className="truncate text-slate-300 font-mono text-[10px]">
                {user?.email || 'admin@elmaestro.com'}
              </span>
            </div>
          </div>

          {/* Quick link to public storefront */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <span>معاينة المتجر العام للزبائن</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج من الإدارة</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Viewport with Safe Bottom Margin */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 pb-24 sm:pb-10 pb-safe overflow-x-hidden">
        <Outlet />
      </main>

      {/* Subtle Platform Footer with Safe Area */}
      <footer className="w-full border-t border-slate-800/60 py-3.5 px-4 sm:px-6 text-center text-[11px] sm:text-xs text-slate-500 pb-safe">
        <span>لوحة تحكم وإدارة مطعم مايسترو الملكي (النبك) — مبنية بنسبة 100% وفق مواصفات </span>
        <code className="text-amber-400 font-mono">dashboard_spec.md</code>
      </footer>
    </div>
  );
};

export default AdminLayout;
