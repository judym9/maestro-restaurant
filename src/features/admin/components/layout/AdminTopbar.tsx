import React from 'react';
import { Menu, Globe, ExternalLink, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { settingsService } from '../../services/settingsService';
import type { AdminTab } from '../../types/admin.types';

interface AdminTopbarProps {
  activeTab: AdminTab;
  onOpenMobileMenu: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  activeTab,
  onOpenMobileMenu,
}) => {
  const { isRTL, language, toggleLanguage } = useAdminLanguage();
  const [status, setStatus] = React.useState(() => settingsService.getOperatingStatus());

  const tabTitles: Record<AdminTab, { ar: string; en: string; descAr: string; descEn: string }> = {
    menu: {
      ar: 'إدارة قائمة الطعام والتصنيفات',
      en: 'Menu Catalog & Categories',
      descAr: 'تعديل أسعار الليرة السورية، إضافة وتعديل الوجبات والتصنيفات',
      descEn: 'Syrian Lira pricing, dish customization, and menu taxonomy',
    },
    promotions: {
      ar: 'العروض والخصومات الترويجية',
      en: 'Promotions & Special Deals',
      descAr: 'التحكم بشرائح العروض المعروضة للزبائن في الواجهة الرئيسية',
      descEn: 'Configure promotional slides and limited-time discount deals',
    },
    operations: {
      ar: 'حالة المطعم والتشغيل المباشر',
      en: 'Operations & Service Status',
      descAr: 'التحكم الفوري في فتح وإغلاق استقبال الطلبات ومعلومات فرع النبك',
      descEn: 'Toggle live ordering and configure Al-Nabek branch details',
    },
    theme: {
      ar: 'محرك تخصيص المظهر والألوان',
      en: 'Dynamic Theming Engine',
      descAr: 'تخصيص اللون الذهبي وتدرجات الأسطح الفاخرة للواجهة',
      descEn: 'Tailor brand gold accents, surface colors, and theme tokens',
    },
  };

  const currentTab = tabTitles[activeTab];

  const handleToggleStatus = () => {
    const updated = settingsService.saveOperatingStatus({ isOpen: !status.isOpen });
    setStatus(updated);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 shrink-0">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white md:hidden border border-white/10 cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide truncate">
              {isRTL ? currentTab.ar : currentTab.en}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10 shrink-0">
              {isRTL ? 'فرع النبك' : 'Al-Nabek Branch'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed truncate">
            {isRTL ? currentTab.descAr : currentTab.descEn}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-auto flex-wrap">
        {/* Live Restaurant Status Button */}
        <button
          type="button"
          onClick={handleToggleStatus}
          title={isRTL ? 'اضغط لتغيير حالة استقبال الطلبات' : 'Click to toggle open/closed'}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 bg-slate-900"
          style={{
            borderColor: status.isOpen ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)',
            color: status.isOpen ? '#34D399' : '#FB7185',
          }}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <Store size={13} />
          <span>
            {status.isOpen
              ? isRTL
                ? 'المطعم مفتوح للطلب'
                : 'Open for Orders'
              : isRTL
              ? 'المطعم مغلق حالياً'
              : 'Kitchen Closed'}
          </span>
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
          title="Toggle Arabic / English"
        >
          <Globe size={14} className="text-amber-400" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Storefront Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
          title={isRTL ? 'فتح واجهة المطعم في نافذة جديدة' : 'Open Storefront in new tab'}
        >
          <ExternalLink size={13} />
          <span>{isRTL ? 'عرض المتجر' : 'Storefront'}</span>
        </Link>
      </div>
    </div>
  );
};
