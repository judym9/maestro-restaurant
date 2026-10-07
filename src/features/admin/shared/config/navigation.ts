import type { ComponentType } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  SlidersHorizontal,
  Palette,
  type LucideProps,
} from 'lucide-react';

export type AdminRole = 'admin' | 'manager' | 'editor';

export type NavBadgeKey = 'dishes' | 'promotions' | 'settings' | 'alerts';

export interface NavItemConfig {
  id: string;
  path: string;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: ComponentType<LucideProps>;
  badgeKey?: NavBadgeKey;
  badgeLive?: boolean;
  requiredRole?: AdminRole;
  exact?: boolean;
}

export interface NavGroupConfig {
  id: string;
  titleAr: string;
  titleEn: string;
  items: NavItemConfig[];
}

export const ADMIN_NAV_GROUPS: readonly NavGroupConfig[] = [
  {
    id: 'operations',
    titleAr: 'العمليات وقائمة الطعام',
    titleEn: 'Operations & Menu',
    items: [
      {
        id: 'dashboard',
        path: '/admin',
        labelAr: 'لوحة القيادة',
        labelEn: 'Dashboard',
        descriptionAr: 'مؤشرات الأداء اللحظية وحالة المطبخ',
        descriptionEn: 'Real-time KPIs & kitchen status',
        icon: LayoutDashboard,
        exact: true,
      },
      {
        id: 'menu',
        path: '/admin/menu',
        labelAr: 'إدارة قائمة الطعام',
        labelEn: 'Menu Management',
        descriptionAr: 'الأصناف، الفئات وتوافر الوجبات',
        descriptionEn: 'Dishes, categories & availability',
        icon: UtensilsCrossed,
        badgeKey: 'dishes',
      },
      {
        id: 'promotions',
        path: '/admin/promotions',
        labelAr: 'العروض الملكية',
        labelEn: 'Royal Deals',
        descriptionAr: 'حزم التوفير والتخفيضات النشطة',
        descriptionEn: 'Active packages & discounts',
        icon: Sparkles,
        badgeKey: 'promotions',
        badgeLive: true,
      },
    ],
  },
  {
    id: 'system',
    titleAr: 'الإعدادات والهوية',
    titleEn: 'Settings & Identity',
    items: [
      {
        id: 'settings',
        path: '/admin/settings',
        labelAr: 'إعدادات الفرع',
        labelEn: 'Branch Settings',
        descriptionAr: 'ساعات العمل، التوصيل وأرقام التواصل',
        descriptionEn: 'Operating hours, delivery & contacts',
        icon: SlidersHorizontal,
        badgeKey: 'settings',
        requiredRole: 'manager',
      },
      {
        id: 'theme',
        path: '/admin/theme',
        labelAr: 'تخصيص المظهر',
        labelEn: 'Theme & Brand',
        descriptionAr: 'ألوان العلامة، الخطوط ومحاكي العرض',
        descriptionEn: 'Color tokens, fonts & simulator',
        icon: Palette,
        requiredRole: 'admin',
      },
    ],
  },
] as const;

export const ADMIN_NAV_ITEMS: readonly NavItemConfig[] = ADMIN_NAV_GROUPS.flatMap(
  (group) => group.items
);

/**
 * Resolves active navigation item based on current pathname
 */
export const getActiveNavItem = (pathname: string): NavItemConfig | undefined => {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  // 1. Check exact matches first
  const exactMatch = ADMIN_NAV_ITEMS.find((item) => item.exact && item.path === normalized);
  if (exactMatch) return exactMatch;

  // 2. Check prefix matches (excluding exact root)
  return ADMIN_NAV_ITEMS.find((item) => !item.exact && normalized.startsWith(item.path));
};

/**
 * Checks if a specific nav item path is considered active for current location
 */
export const isNavItemActive = (currentPath: string, targetPath: string, exact: boolean = false): boolean => {
  const current = currentPath.endsWith('/') && currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;
  const target = targetPath.endsWith('/') && targetPath.length > 1 ? targetPath.slice(0, -1) : targetPath;

  if (exact || target === '/admin') {
    return current === target;
  }
  return current === target || current.startsWith(target + '/');
};
