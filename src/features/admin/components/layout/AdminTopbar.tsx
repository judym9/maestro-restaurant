import React from 'react';
import { Menu, Plus, Utensils, Tag, ShieldCheck } from 'lucide-react';
import type { AdminNavTab } from './AdminSidebar';

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
      descAr: '',
      descEn: '',
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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 sm:pt-8 pb-6 sm:pb-7 mb-8 sm:mb-10 border-b border-border">
      {/* Title & Mobile Toggle */}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2.5 rounded-2xl bg-card border border-border text-foreground hover:text-amber-500 shadow-sm cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <span>{isAr ? current.titleAr : current.titleEn}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">
              <ShieldCheck size={14} />
              {isAr ? 'مدير النظام' : 'Admin'}
            </span>
          </h1>
          {Boolean(isAr ? current.descAr : current.descEn) && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl font-medium">
              {isAr ? current.descAr : current.descEn}
            </p>
          )}
        </div>
      </div>

      {/* Quick Action Badges & Buttons */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
          <Utensils size={15} className="text-amber-500" />
          <span>{dishesCount} {isAr ? 'وجبة في القائمة' : 'Dishes'}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm">
          <Tag size={15} className="text-emerald-500" />
          <span>{promosCount} {isAr ? 'عروض نشطة' : 'Active Promos'}</span>
        </div>

        {onQuickAddMeal && (
          <button
            type="button"
            onClick={onQuickAddMeal}
            className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>{isAr ? 'إضافة وجبة جديدة' : 'Add New Meal'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
