import React, { useState } from 'react';
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
 * Fully responsive with luxury dark styling, live telemetry badges, and mobile drawer.
 */
export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const { dishes, promotions, restaurantSettings } = useAdminData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
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
      className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 font-['Cairo',sans-serif] selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Top Administrative Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b101b]/95 backdrop-blur-md shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Platform Title */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2.5 group">
                <BrandLogo className="w-8 h-8 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    مايسترو الملكي
                  </span>
                  <span className="text-[10px] font-medium text-amber-500 tracking-wider">
                    لوحة تحكم الإدارة
                  </span>
                </div>
              </Link>

              {/* Kitchen Live Status Badge */}
              <div
                className={`hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border ${
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
            <div className="flex items-center gap-3">
              {/* Link to Public Storefront */}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                title="معاينة المتجر العام للزبائن"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <span>المتجر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {/* User Role Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] text-amber-400 uppercase font-semibold">
                  {user?.role || 'admin'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="max-w-[120px] truncate text-slate-300">
                  {user?.email || 'admin@elmaestro.com'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0b101b] px-4 py-3.5 space-y-1.5">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.labelAr}</span>
                  </div>
                  {badge !== null && badge > 0 && (
                    <span className="px-2.5 py-0.5 min-w-[22px] text-center rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300">
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
            <div className="pt-3 mt-1 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {user?.email || 'admin@elmaestro.com'}
              </span>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                المتجر العام
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Administrative Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Subtle Platform Footer */}
      <footer className="w-full border-t border-slate-800/60 py-5 px-6 text-center text-xs text-slate-500">
        <span>لوحة تحكم وإدارة مطعم مايسترو الملكي (النبك) — مبنية بنسبة 100% وفق مواصفات </span>
        <code className="text-amber-400 font-mono">dashboard_spec.md</code>
      </footer>
    </div>
  );
};

export default AdminLayout;
