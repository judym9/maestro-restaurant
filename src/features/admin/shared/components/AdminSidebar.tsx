import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ExternalLink,
  Store,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminNavItems } from './AdminNavItems';
import { BrandLogo } from './BrandLogo';
import type { NavBadgeKey } from '../config/navigation';

export interface AdminSidebarProps {
  /** Desktop rail collapsed state */
  collapsed: boolean;
  /** Toggles desktop rail collapsed state */
  onToggleCollapse: () => void;
  /** Mobile off-canvas open state */
  mobileOpen: boolean;
  /** Closes mobile off-canvas drawer */
  onCloseMobile: () => void;
  /** Live badge indicators data */
  badges?: Partial<Record<NavBadgeKey, number | string>>;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  badges = {},
}) => {
  const { language, isRtl } = useLanguage();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Shared inner content for both desktop rail and mobile off-canvas
  const renderSidebarContent = (isMobileView: boolean) => {
    const isRailCollapsed = !isMobileView && collapsed;

    return (
      <div className="flex flex-col h-full select-none">
        {/* Brand Header */}
        <div
          className={`
            flex items-center border-b border-[var(--border-subtle)] transition-all duration-300
            ${isRailCollapsed ? 'justify-center h-20 px-2' : 'justify-between h-20 px-5'}
          `}
        >
          <Link
            to="/admin"
            onClick={isMobileView ? onCloseMobile : undefined}
            className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] rounded-xl"
            aria-label="Maestro Admin Home"
          >
            {/* Official Brand Logo */}
            <div
              className={`
                relative flex items-center justify-center shrink-0 rounded-xl transition-all duration-300
                bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-1
                shadow-sm group-hover:border-[var(--accent-gold)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]
                ${isRailCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
              `}
            >
              <BrandLogo className="w-8 h-8 object-contain" showFallbackBadge={true} />
            </div>

            {/* Brand Title & Subtitle */}
            {!isRailCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-base font-bold tracking-tight text-[var(--text-primary)] font-['Cairo',sans-serif] group-hover:text-[var(--accent-gold)] transition-colors">
                  {language === 'ar' ? 'مايسترو' : 'El Maestro'}
                </span>
                <span className="text-[11px] font-medium text-[var(--text-muted)] tracking-wider uppercase">
                  {language === 'ar' ? 'الإدارة التنفيذية' : 'Executive Suite'}
                </span>
              </div>
            )}
          </Link>

          {/* Close button for Mobile */}
          {isMobileView && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 scrollbar-thin scrollbar-thumb-[var(--border-subtle)]">
          <AdminNavItems
            collapsed={isRailCollapsed}
            onItemClick={isMobileView ? onCloseMobile : undefined}
            badges={badges}
          />
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
          {/* Quick link to Storefront */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center rounded-xl text-xs font-medium text-[var(--text-secondary)]
              hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-200
              border border-transparent hover:border-[var(--border-subtle)]
              ${isRailCollapsed ? 'justify-center h-11 w-11 mx-auto' : 'justify-between px-3 h-11 w-full'}
            `}
            title={language === 'ar' ? 'زيارة المتجر العام' : 'Visit Live Storefront'}
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
              {!isRailCollapsed && (
                <span className="truncate">
                  {language === 'ar' ? 'زيارة المتجر' : 'Visit Storefront'}
                </span>
              )}
            </div>
            {!isRailCollapsed && (
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            )}
          </Link>

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`
              flex items-center rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300
              hover:bg-rose-500/10 transition-all duration-200 border border-transparent hover:border-rose-500/20
              focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[44px]
              ${isRailCollapsed ? 'justify-center h-11 w-11 mx-auto' : 'justify-between px-3 h-11 w-full'}
            `}
            title={language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 shrink-0" />
              {!isRailCollapsed && (
                <span>
                  {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </span>
              )}
            </div>
          </button>

          {/* Desktop Rail Collapse Toggle Button */}
          {!isMobileView && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`
                flex items-center rounded-xl text-xs font-medium text-[var(--text-muted)]
                hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]
                ${isRailCollapsed ? 'justify-center h-11 w-11 mx-auto' : 'justify-between px-3 h-11 w-full'}
              `}
              aria-label={collapsed ? 'Expand sidebar rail' : 'Collapse sidebar rail'}
            >
              <div className="flex items-center gap-2.5">
                {collapsed ? (
                  isRtl ? (
                    <PanelLeftClose className="w-4 h-4 text-[var(--text-primary)]" />
                  ) : (
                    <PanelLeftOpen className="w-4 h-4 text-[var(--text-primary)]" />
                  )
                ) : isRtl ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
                {!isRailCollapsed && (
                  <span>
                    {language === 'ar'
                      ? 'تصغير القائمة'
                      : 'Collapse sidebar'}
                  </span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ========================================================
          DESKTOP SIDEBAR RAIL (Fixed / Sticky Left/Right Rail)
          ======================================================== */}
      <aside
        className={`
          hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30
          bg-[var(--bg-secondary)] border-e border-[var(--border-subtle)]
          transition-[width] duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
        `}
        aria-label="Desktop Admin Navigation"
      >
        {renderSidebarContent(false)}
      </aside>

      {/* ========================================================
          MOBILE OFF-CANVAS DRAWER
          ======================================================== */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden transition-visibility duration-300
          ${mobileOpen ? 'visible' : 'invisible pointer-events-none'}
        `}
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop overlay */}
        <div
          className={`
            fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ease-out
            ${mobileOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={onCloseMobile}
          aria-hidden="true"
        />

        {/* Off-canvas Sheet */}
        <div
          className={`
            fixed inset-y-0 start-0 w-72 max-w-[85vw]
            bg-[var(--bg-secondary)] border-e border-[var(--border-subtle)]
            shadow-[var(--card-shadow)] z-50 flex flex-col h-full
            transform transition-transform duration-300 ease-in-out
            ${
              mobileOpen
                ? 'translate-x-0'
                : isRtl
                ? 'translate-x-full'
                : '-translate-x-full'
            }
          `}
        >
          {renderSidebarContent(true)}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
