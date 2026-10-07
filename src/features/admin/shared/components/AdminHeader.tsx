import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Crown,
  Globe,
  Bell,
  LogOut,
  ChefHat,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { useTheme } from '../../../../app/providers/ThemeProvider';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { getActiveNavItem } from '../config/navigation';
import { BrandLogo } from './BrandLogo';

export interface AdminHeaderProps {
  /** Callback to trigger mobile sidebar opening */
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, isRtl } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAdminAuth();
  const { restaurantSettings, toggleKitchenStatus } = useAdminData();

  // Dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeNav = getActiveNavItem(location.pathname);
  const currentTitle = activeNav
    ? language === 'ar'
      ? activeNav.labelAr
      : activeNav.labelEn
    : language === 'ar'
    ? 'الإدارة'
    : 'Admin';

  const isKitchenOpen = restaurantSettings?.isKitchenOpen ?? true;

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-20 w-full h-20 border-b border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-md transition-colors duration-200"
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 gap-4">
        {/* ========================================================
            LEFT SECTION: Mobile Toggle + Breadcrumb Title
            ======================================================== */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex items-center justify-center w-11 h-11 rounded-xl md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Official Logo */}
          <div className="md:hidden flex items-center shrink-0">
            <BrandLogo className="w-8 h-8 object-contain" />
          </div>

          {/* Active Page Title & Path */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] truncate font-['Cairo',sans-serif]">
                {currentTitle}
              </h1>
            </div>
            {activeNav && (
              <p className="text-xs text-[var(--text-muted)] truncate hidden sm:block">
                {language === 'ar' ? activeNav.descriptionAr : activeNav.descriptionEn}
              </p>
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT SECTION: Actions & Quick Controls
            ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Live Kitchen Status Quick Toggle Chip */}
          <button
            type="button"
            onClick={() => toggleKitchenStatus(!isKitchenOpen)}
            className={`
              hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
              border transition-all duration-200 min-h-[42px] cursor-pointer
              focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]
              ${
                isKitchenOpen
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15'
                  : 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/15'
              }
            `}
            title={
              language === 'ar'
                ? isKitchenOpen
                  ? 'المطبخ يستقبل الطلبات حالياً (اضغط للتبديل)'
                  : 'المطبخ متوقف مؤقتاً (اضغط للتشغيل)'
                : isKitchenOpen
                ? 'Kitchen accepting orders (Click to toggle)'
                : 'Kitchen paused (Click to toggle)'
            }
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isKitchenOpen ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isKitchenOpen ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </span>
            <ChefHat className="w-4 h-4 shrink-0" />
            <span>
              {language === 'ar'
                ? isKitchenOpen
                  ? 'المطبخ نشط'
                  : 'المطبخ مغلق'
                : isKitchenOpen
                ? 'Kitchen Open'
                : 'Kitchen Closed'}
            </span>
          </button>

          {/* 2. Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
            aria-label="Toggle language between Arabic and English"
            title={language === 'ar' ? 'التحويل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <Globe className="w-4 h-4 text-[var(--accent-gold)]" />
            <span className="font-bold uppercase tracking-wider">
              {language === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* 3. Segmented Theme Selector (Light, Dark, Maestro Luxury) */}
          <div
            className="flex items-center p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] gap-0.5"
            role="radiogroup"
            aria-label="Select color theme"
          >
            {/* Light Theme */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`
                flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]
                ${
                  theme === 'light'
                    ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }
              `}
              title={language === 'ar' ? 'الوضع النهاري' : 'Light Mode'}
              aria-checked={theme === 'light'}
              role="radio"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* Dark Theme */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`
                flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]
                ${
                  theme === 'dark'
                    ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }
              `}
              title={language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}
              aria-checked={theme === 'dark'}
              role="radio"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Maestro Luxury Theme */}
            <button
              type="button"
              onClick={() => setTheme('mastro-luxury')}
              className={`
                flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 relative
                focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]
                ${
                  theme === 'mastro-luxury'
                    ? 'bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-600)] text-[var(--btn-primary-text)] shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }
              `}
              title={language === 'ar' ? 'مايسترو الذهبي الملكي' : 'Maestro Royal Luxury'}
              aria-checked={theme === 'mastro-luxury'}
              role="radio"
            >
              <Crown className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Notifications Bell with Popover Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="relative flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
              aria-label="View notifications"
              aria-haspopup="true"
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 end-2.5 w-2 h-2 rounded-full bg-[var(--accent-gold)] ring-2 ring-[var(--bg-surface)]" />
            </button>

            {/* Notifications Popover Dropdown */}
            {notificationsOpen && (
              <div
                className={`
                  absolute top-full mt-2.5 w-80 sm:w-96 rounded-2xl
                  border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]
                  shadow-[var(--card-shadow)] p-4 z-50 flex flex-col gap-3 animate-fade-in
                  ${isRtl ? 'start-0' : 'end-0'}
                `}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {language === 'ar' ? 'التنبيهات الإدارية' : 'Admin Alerts'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--accent-gold)] px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/15">
                    {language === 'ar' ? 'نشط الآن' : 'Live Sync'}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col text-xs min-w-0">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {language === 'ar' ? 'المزامنة السحابية نشطة' : 'Realtime Sync Connected'}
                      </span>
                      <span className="text-[var(--text-muted)] text-[11px]">
                        {language === 'ar' ? 'قاعدة البيانات متصلة وجاهزة للعمل' : 'Supabase Realtime is operational.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <Clock className="w-4 h-4 text-[var(--accent-gold)] mt-0.5 shrink-0" />
                    <div className="flex flex-col text-xs min-w-0">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {language === 'ar' ? 'ساعات عمل اليوم' : "Today's Schedule"}
                      </span>
                      <span className="text-[var(--text-muted)] text-[11px]">
                        {language === 'ar' ? 'المطبخ جاهز لاستقبال طلبات الزبائن' : 'Ready to receive customer orders.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
                  >
                    {language === 'ar' ? 'إغلاق القائمة' : 'Dismiss'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. User Manager Avatar & Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 ps-2 pe-3 py-1.5 min-h-[44px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] group"
              aria-label="Manager account menu"
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] font-bold text-sm ring-1 ring-[var(--accent-gold)]/30 group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0) : 'M'}
              </div>
              <div className="hidden sm:flex flex-col text-start min-w-0">
                <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[110px]">
                  {user?.name || (language === 'ar' ? 'مدير النظام' : 'System Admin')}
                </span>
                <span className="text-[10px] text-[var(--accent-gold)] font-medium capitalize">
                  {user?.role || 'admin'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            </button>

            {/* Profile Dropdown Popover */}
            {profileOpen && (
              <div
                className={`
                  absolute top-full mt-2.5 w-64 rounded-2xl
                  border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]
                  shadow-[var(--card-shadow)] p-3 z-50 flex flex-col gap-2 animate-fade-in
                  ${isRtl ? 'start-0' : 'end-0'}
                `}
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-1 shrink-0">
                    <BrandLogo className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {user?.name || (language === 'ar' ? 'مدير النظام' : 'System Admin')}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] truncate">
                      {user?.email || 'admin@maestro.com'}
                    </span>
                  </div>
                </div>

                {/* Sign Out Action */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
