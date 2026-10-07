// Clean Route Guard & Auth
export * from './guards/AdminRouteGuard';
export * from './auth/pages/AdminLoginPage';
export * from './placeholders/AdminPlaceholderLayout';
export * from './placeholders/AdminModulePlaceholder';

// Full Admin Pages
export * from './pages/AdminDashboardPage';
export * from './pages/AdminMenuPage';
export * from './pages/AdminPromotionsPage';
export * from './pages/AdminSettingsPage';
export * from './pages/AdminThemePage';

// Shared Layout & Navigation Architecture
export * from './shared/components';
export * from './shared/config/navigation';

// Contexts & Providers
export * from './context/AdminAuthContext';
export * from './context/AdminMenuContext';
export * from './context/AdminSettingsContext';
export * from './context/AdminThemeContext';
export * from './context/AdminDataContext';
export * from './context/AdminToastContext';

// Business Logic Hooks
export * from './hooks/useAdminMenu';
export * from './hooks/useAdminSettings';
export * from './hooks/usePromotions';
export * from './hooks/useThemeCustomizer';
export * from './hooks/useRealtimeSync';

// Services & Repositories
export * from './services/menuRepository';
export * from './services/promotionsRepository';
export * from './services/settingsRepository';
export * from './services/menuService';
export * from './services/promotionsService';
export * from './services/settingsService';

// Data Contracts & Types
export * from './types/menu.types';
export * from './types/settings.types';
export * from './types/promotions.types';
