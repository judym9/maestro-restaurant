import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { BrandAssets } from '../../../utils/imageRegistry';

export interface AdminRouteGuardProps {
  children?: React.ReactNode;
}

/**
 * Production-ready Route Guard protecting all /admin/* routes.
 * Immediately redirects unauthenticated visitors to /admin/login,
 * preserves intended destination in location state, and prevents back-button leaks.
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  // Polished luxury loader while verifying auth session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-primary,#06090E)] text-[var(--text-primary,#FFFDF8)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shadow-2xl animate-pulse">
            <picture>
              <source srcSet={BrandAssets.logo.webp} type="image/webp" />
              <img
                src={BrandAssets.logo.src}
                alt="El Maestro"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
            </picture>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-semibold text-[var(--text-muted,#94A3B8)] font-['Cairo',sans-serif]">
              جارِ التحقق من الصلاحيات التنفيذية...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized access interception: redirect to /admin/login with preserved target route
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRouteGuard;
