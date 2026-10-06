import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandAssets } from '../../../../utils/imageRegistry';
import { ShieldCheck } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  // 1. Sleek verification loading state (Zero FOUC or page flicker)
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0F17] text-white p-4">
        <div className="relative flex flex-col items-center gap-5 animate-in fade-in duration-300">
          {/* Glowing Logo Container */}
          <div className="relative">
            <div className="w-18 h-18 rounded-2xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center p-3 shadow-xl shadow-amber-500/10">
              <img
                src={BrandAssets.logo.src}
                alt="Maestro Logo"
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
            {/* Spinning Gold Arc Ring */}
            <div className="absolute -inset-2 rounded-3xl border-2 border-transparent border-t-amber-500 border-r-amber-500/50 animate-spin pointer-events-none" />
          </div>

          <div className="text-center space-y-1.5">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center justify-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-500" />
              <span>جاري التحقق من الجلسة والصلاحيات...</span>
            </h3>
            <p className="text-xs text-zinc-500">
              بوابة إدارة مطعم مايسترو النبك
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. If not authenticated, intercept and redirect to /admin/login preserving target route
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. User authenticated: render protected admin content
  return <>{children}</>;
};
