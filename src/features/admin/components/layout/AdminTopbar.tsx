import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus, Utensils, Tag, ShieldCheck, LogOut } from 'lucide-react';
import type { AdminNavTab } from './AdminSidebar';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminTopbarProps {
  activeTab: AdminNavTab;
  language: 'ar' | 'en';
  onOpenMobileMenu: () => void;
  onQuickAddMeal?: () => void;
  dishesCount: number;
  promosCount: number;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  activeTab,
  language,
  onOpenMobileMenu,
  onQuickAddMeal,
  dishesCount,
  promosCount,
}) => {
  const isAr = language === 'ar';
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    if (window.confirm(isAr ? 'هل ترغب في تسجيل الخروج من لوحة التحكم؟' : 'Are you sure you want to log out?')) {
      await logout();
      navigate('/admin/login', { replace: true });
    }
  };

  const tabTitles: Record<AdminNavTab, { titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
    dashboard: {
      titleAr: 'نظرة عامة ومؤشرات الأداء',
      titleEn: 'Performance & Operations',
      descAr: 'متابعة حية لحالة مطعم مايسترو، الوجبات النشطة، والعروض الحالية',
      descEn: 'Live operational summary of Maestro restaurant, active items, and deals',
    },
    menu: {
      titleAr: 'قائمة المأكولات والتصنيفات',
      titleEn: 'Menu & Category Manager',
      descAr: '',
      descEn: '',
    },
    promotions: {
      titleAr: 'إدارة العروض الترويجية',
      titleEn: 'Promotions & Special Deals',
      descAr: 'باقات المناسبات الملكية، خصومات الشاورما، ونسب التوفير',
      descEn: 'Configure limited-time discounts, celebratory towers, and badges',
    },
    settings: {
      titleAr: 'إعدادات الفرع وساعات العمل',
      titleEn: 'Branch Info & Working Hours',
      descAr: 'إدارة تشغيل الفرع، مواعيد العمل الأسبوعية، وقنوات التواصل والطلبات',
      descEn: 'Manage live store operations, weekly schedules, and contact channels',
    },
    theme: {
      titleAr: 'محرر الهوية البصرية والألوان',
      titleEn: 'Visual Identity & Theming',
      descAr: '',
      descEn: '',
    },
  };

  const current = tabTitles[activeTab];

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/60">
      {/* Title & Mobile Toggle */}
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-card border border-border text-foreground hover:text-amber-500 shadow-sm cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <span>{isAr ? current.titleAr : current.titleEn}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">
              <ShieldCheck size={13} />
              {isAr ? 'مدير النظام' : 'Admin'}
            </span>
          </h1>
          {Boolean(isAr ? current.descAr : current.descEn) && (
            <p className="text-xs sm:text-[13px] text-muted-foreground mt-1 max-w-2xl font-medium">
              {isAr ? current.descAr : current.descEn}
            </p>
          )}
        </div>
      </div>

      {/* Quick Action Badges & Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 shadow-sm whitespace-nowrap">
          <Utensils size={14} className="text-amber-500 shrink-0" />
          <span className="font-numeric">{dishesCount} {isAr ? 'وجبة في القائمة' : 'Dishes'}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 shadow-sm whitespace-nowrap">
          <Tag size={14} className="text-emerald-500 shrink-0" />
          <span className="font-numeric">{promosCount} {isAr ? 'عروض نشطة' : 'Active Promos'}</span>
        </div>

        {onQuickAddMeal && (
          <button
            type="button"
            onClick={onQuickAddMeal}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Plus size={15} className="stroke-[3]" />
            <span>{isAr ? 'إضافة وجبة جديدة' : 'Add New Meal'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-rose-500 hover:border-rose-500/30 dark:hover:border-rose-500/30 transition-colors shadow-sm cursor-pointer"
          title={isAr ? 'تسجيل الخروج' : 'Log out'}
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
