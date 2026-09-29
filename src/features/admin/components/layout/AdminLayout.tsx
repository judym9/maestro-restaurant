import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import type { AdminTab } from '../../types/admin.types';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const { isRTL } = useAdminLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full bg-[#090d16] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 font-sans"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main View Area */}
      <main className="flex-1 min-w-0 px-8 py-10 md:px-12 md:py-12 overflow-y-auto space-y-10">
        <AdminTopbar
          activeTab={activeTab}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />
        {children}
      </main>
    </div>
  );
};
