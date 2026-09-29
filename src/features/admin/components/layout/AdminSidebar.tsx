import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Sparkles,
  Store,
  Palette,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { BrandAssets } from '../../../../utils/imageRegistry';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import type { AdminTab } from '../../types/admin.types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isRTL } = useAdminLanguage();

  const navItems = [
    {
      id: 'menu' as AdminTab,
      labelAr: 'قائمة الطعام والتصنيفات',
      labelEn: 'Menu & Categories',
      descAr: 'إدارة الوجبات والأسعار والتصنيفات',
      descEn: 'Dishes, SYP pricing & categories',
      icon: UtensilsCrossed,
    },
    {
      id: 'promotions' as AdminTab,
      labelAr: 'العروض والخصومات',
      labelEn: 'Promotions & Deals',
      descAr: 'ترتيب وعرض شرائح العروض',
      descEn: 'Reorder & manage active deals',
      icon: Sparkles,
    },
    {
      id: 'operations' as AdminTab,
      labelAr: 'حالة المطعم والتشغيل',
      labelEn: 'Operations & Status',
      descAr: 'مفتوح/مغلق، هاتف وعنوان النبك',
      descEn: 'Live toggle & Al-Nabek branch info',
      icon: Store,
    },
    {
      id: 'theme' as AdminTab,
      labelAr: 'محرك المظهر والألوان',
      labelEn: 'Theme & Customizer',
      descAr: 'تخصيص اللون الذهبي وتدرجات الأسطح',
      descEn: 'Tailor brand gold & luxury surfaces',
      icon: Palette,
    },
  ];

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-80 shrink-0 border-l rtl:border-l-0 rtl:border-r border-white/10 bg-[#0f172a] p-6 flex flex-col justify-between min-h-screen z-40 transition-transform duration-300 ${
          isOpenMobile
            ? 'fixed inset-y-0 start-0 z-50 shadow-2xl flex overflow-y-auto'
            : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* Brand & Logo Header */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-white/10 shrink-0">
            <picture>
              <source srcSet={BrandAssets.logo.webp} type="image/webp" />
              <img
                src={BrandAssets.logo.src}
                alt="Maestro Logo"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/30 p-1 bg-[#141b29] shrink-0"
              />
            </picture>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-base tracking-wide truncate">
                  {isRTL ? 'مطعم مايسترو' : 'MAESTRO'}
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold border border-amber-500/30 shrink-0">
                  {isRTL ? 'الإدارة' : 'Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {isRTL ? 'لوحة التحكم المركزية' : 'Management Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
              {isRTL ? 'الوحدات الإدارية' : 'Admin Modules'}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-start transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                          : 'bg-white/5 text-slate-400 group-hover:text-amber-400 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-bold text-sm truncate">
                        {isRTL ? item.labelAr : item.labelEn}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate mt-0.5">
                        {isRTL ? item.descAr : item.descEn}
                      </span>
                    </div>
                  </div>
                  <ArrowIcon
                    size={16}
                    className={`shrink-0 transition-transform ${
                      isActive ? 'text-amber-400 opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Group: Storefront Link & User Info */}
        <div className="space-y-4 pt-6 border-t border-white/10 shrink-0">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-colors text-sm font-semibold border border-white/5"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink size={16} />
              <span>{isRTL ? 'عرض واجهة المطعم' : 'View Storefront'}</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
          </Link>

          <div className="p-3.5 rounded-2xl border border-white/10 bg-[#0c1322]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {isRTL ? 'المدير العام' : 'Administrator'}
                </div>
                <div className="text-[11px] text-amber-400 font-medium">
                  {isRTL ? 'صلاحيات كاملة • فرع النبك' : 'Full Access • Al-Nabek'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
