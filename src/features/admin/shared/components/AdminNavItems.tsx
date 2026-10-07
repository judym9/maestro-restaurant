import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  ADMIN_NAV_GROUPS,
  type NavBadgeKey,
  type NavItemConfig,
  isNavItemActive,
} from '../config/navigation';

export interface AdminNavItemsProps {
  collapsed?: boolean;
  onItemClick?: () => void;
  badges?: Partial<Record<NavBadgeKey, number | string>>;
}

export const AdminNavItems: React.FC<AdminNavItemsProps> = ({
  collapsed = false,
  onItemClick,
  badges = {},
}) => {
  const { language, isRtl } = useLanguage();
  const { user } = useAdminAuth();
  const location = useLocation();

  // Role permissions check helper
  const isAuthorized = (item: NavItemConfig): boolean => {
    if (!item.requiredRole) return true;
    const userRole = user?.role || 'admin';
    if (userRole === 'admin') return true;
    if (item.requiredRole === 'manager' && userRole === 'manager') {
      return true;
    }
    return userRole === item.requiredRole;
  };

  return (
    <nav className="flex flex-col gap-6 w-full" aria-label="Admin Navigation">
      {ADMIN_NAV_GROUPS.map((group) => {
        const visibleItems = group.items.filter(isAuthorized);
        if (visibleItems.length === 0) return null;

        return (
          <div key={group.id} className="flex flex-col gap-1.5 w-full">
            {/* Group Header (only visible when expanded) */}
            {!collapsed ? (
              <div className="px-3.5 pb-1 text-[11px] font-semibold tracking-wider uppercase select-none text-[var(--text-muted)] opacity-75">
                {language === 'ar' ? group.titleAr : group.titleEn}
              </div>
            ) : (
              <div className="h-px mx-3 my-1 bg-[var(--border-subtle)]" aria-hidden="true" />
            )}

            {/* Navigation Links */}
            <div className="flex flex-col gap-1 w-full">
              {visibleItems.map((item) => {
                const isActive = isNavItemActive(location.pathname, item.path, item.exact);
                const Icon = item.icon;
                const label = language === 'ar' ? item.labelAr : item.labelEn;
                const badgeValue = item.badgeKey ? badges[item.badgeKey] : undefined;

                return (
                  <div key={item.id} className="relative group w-full">
                    <NavLink
                      to={item.path}
                      onClick={onItemClick}
                      className={`
                        relative flex items-center min-h-[46px] w-full rounded-xl text-sm font-medium
                        transition-all duration-200 outline-none
                        focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2
                        focus-visible:ring-offset-[var(--bg-primary)]
                        ${
                          collapsed
                            ? 'justify-center px-0 py-2.5'
                            : 'justify-between px-3.5 py-2.5'
                        }
                        ${
                          isActive
                            ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-semibold shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                        }
                      `}
                    >
                      {/* Active Indicator Accent Pill */}
                      {isActive && (
                        <span
                          className={`
                            absolute top-2 bottom-2 w-1 rounded-full bg-[var(--accent-gold)] shadow-[0_0_10px_var(--accent-gold)]
                            ${isRtl ? 'end-0 rounded-s-full' : 'start-0 rounded-e-full'}
                          `}
                          aria-hidden="true"
                        />
                      )}

                      {/* Icon + Label Row */}
                      <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'justify-center' : ''}`}>
                        <span
                          className={`
                            flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform duration-200
                            ${
                              isActive
                                ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] scale-105'
                                : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:scale-105'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 stroke-[1.8]" />
                        </span>

                        {!collapsed && (
                          <span className="truncate tracking-normal text-[13.5px]">
                            {label}
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      {!collapsed && badgeValue !== undefined && badgeValue !== null && (
                        <div className="flex items-center gap-1.5 ms-2 shrink-0">
                          {item.badgeLive && (
                            <span className="relative flex h-2 w-2" title="Live status">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-gold)] opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-gold)]" />
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/25">
                            {badgeValue}
                          </span>
                        </div>
                      )}
                    </NavLink>

                    {/* Tooltip on Collapsed Rail Hover */}
                    {collapsed && (
                      <div
                        role="tooltip"
                        className={`
                          pointer-events-none absolute top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-lg text-xs font-medium
                          bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]
                          shadow-[var(--card-shadow)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                          transition-all duration-150 ease-out whitespace-nowrap flex items-center gap-2
                          ${isRtl ? 'right-full me-3' : 'left-full ms-3'}
                        `}
                      >
                        <span>{label}</span>
                        {badgeValue !== undefined && badgeValue !== null && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-bold">
                            {badgeValue}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default AdminNavItems;
