import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Settings,
  Palette,
  ExternalLink,
  Sun,
  Moon,
  Globe,
  Store,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { BrandAssets } from '../../../../utils/imageRegistry';

export type AdminNavTab = 'dashboard' | 'menu' | 'promotions' | 'settings' | 'theme';

const STORAGE_KEY = 'maestro_admin_sidebar_width';
const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 240;
const MAX_WIDTH = 420;

const getInitialWidth = (): number => {
  if (typeof window === 'undefined') return DEFAULT_WIDTH;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AdminSidebar] Failed to read saved width:', err);
  }
  return DEFAULT_WIDTH;
};

interface AdminSidebarProps {
  activeTab: AdminNavTab;
  setActiveTab: (tab: AdminNavTab) => void;
  isRtl: boolean;
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;
  isOpenNow: boolean;
  isResizable?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isRtl,
  language,
  toggleLanguage,
  themeMode,
  toggleThemeMode,
  isOpenNow,
  isResizable = false,
  onCloseMobile,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [width, setWidth] = useState<number>(getInitialWidth);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const sidebarRef = useRef<HTMLElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(DEFAULT_WIDTH);

  // Clean up any stray body styles if unmounted during drag
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizable) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    // Disable text selection and force resize cursor on whole screen while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - startXRef.current;
      // In LTR: dragging right increases width. In RTL: dragging left increases width.
      const targetWidth = isRtl
        ? startWidthRef.current - dx
        : startWidthRef.current + dx;

      const clampedWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(targetWidth)));
      setWidth(clampedWidth);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      setIsDragging(false);
      isDraggingRef.current = false;

      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      const dx = upEvent.clientX - startXRef.current;
      const targetWidth = isRtl
        ? startWidthRef.current - dx
        : startWidthRef.current + dx;
      const finalWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(targetWidth)));

      setWidth(finalWidth);
      try {
        localStorage.setItem(STORAGE_KEY, String(finalWidth));
      } catch (err) {
        console.warn('[AdminSidebar] Failed to save sidebar width:', err);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleDoubleClick = () => {
    if (!isResizable) return;
    setWidth(DEFAULT_WIDTH);
    try {
      localStorage.setItem(STORAGE_KEY, String(DEFAULT_WIDTH));
    } catch (err) {
      console.warn('[AdminSidebar] Failed to save sidebar width:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isResizable) return;
    let step = 0;
    if (e.key === 'ArrowRight') {
      step = isRtl ? -12 : 12;
    } else if (e.key === 'ArrowLeft') {
      step = isRtl ? 12 : -12;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDoubleClick();
      return;
    }

    if (step !== 0) {
      e.preventDefault();
      const nextWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width + step));
      setWidth(nextWidth);
      try {
        localStorage.setItem(STORAGE_KEY, String(nextWidth));
      } catch (err) {
        console.warn('[AdminSidebar] Failed to save sidebar width:', err);
      }
    }
  };

  const navItems: { id: AdminNavTab; labelAr: string; labelEn: string; icon: React.ComponentType<{ size: number; className?: string }> }[] = [
    {
      id: 'dashboard',
      labelAr: 'لوحة التحكم والمؤشرات',
      labelEn: 'Dashboard & Metrics',
      icon: LayoutDashboard,
    },
    {
      id: 'menu',
      labelAr: 'إدارة الوجبات والقوائم',
      labelEn: 'Menu & Dishes',
      icon: UtensilsCrossed,
    },
    {
      id: 'promotions',
      labelAr: 'العروض والباقات الملكية',
      labelEn: 'Promotions & Deals',
      icon: Tag,
    },
    {
      id: 'settings',
      labelAr: 'بيانات الفرع ومواعيد العمل',
      labelEn: 'Branch & Hours',
      icon: Settings,
    },
    {
      id: 'theme',
      labelAr: 'تخصيص الهوية والألوان',
      labelEn: 'Theme & Palette',
      icon: Palette,
    },
  ];

  const handleSelect = (tab: AdminNavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      ref={sidebarRef}
      style={isResizable ? { width: `${width}px` } : undefined}
      className={`relative shrink-0 border-l rtl:border-l-0 rtl:border-r border-border bg-sidebar p-6 flex flex-col min-h-screen transition-colors duration-200 ${
        isResizable
          ? isDragging
            ? 'transition-none select-none'
            : 'transition-[width] duration-150 ease-out select-none'
          : 'w-80 select-none'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 pb-6 border-b border-border min-w-0">
        <picture className="shrink-0">
          <source srcSet={BrandAssets.logo.webp} type="image/webp" />
          <img
            src={BrandAssets.logo.src}
            alt="Maestro Logo"
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-md rounded-2xl p-1 bg-[#D97706]/10 dark:bg-amber-500/10 border border-[#D97706]/25 dark:border-amber-500/30"
          />
        </picture>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-black text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] dark:from-[#FCD34D] dark:via-[#F59E0B] dark:to-[#D97706] truncate">
            {isAr ? 'مايسترو النبك' : 'MAESTRO'}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#D97706]/10 dark:bg-amber-500/20 text-[#D97706] dark:text-amber-400 border border-[#D97706]/25 dark:border-amber-500/30 shrink-0">
            PRO
          </span>
        </div>
      </div>

      {/* Operating Status Pill */}
      <div className="mt-5 px-3.5 sm:px-4 py-3 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm min-w-0 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${
              isOpenNow ? 'bg-emerald-500 shadow-emerald-500/50 shadow-md' : 'bg-rose-500 shadow-rose-500/50 shadow-md'
            }`}
          />
          <span className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] truncate">
            {isOpenNow ? (isAr ? 'يستقبل الطلبات' : 'Receiving Orders') : (isAr ? 'المطعم مغلق' : 'Closed Currently')}
          </span>
        </div>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
            isOpenNow ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
          }`}
        >
          {isOpenNow ? (isAr ? 'مفتوح' : 'OPEN') : (isAr ? 'مغلق' : 'CLOSED')}
        </span>
      </div>

      {/* Navigation Menu */}
      <nav aria-label="Admin Navigation" className="mt-6 flex-1 flex flex-col gap-2.5 sm:gap-3 py-1 min-w-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`relative w-full min-h-[50px] flex items-center justify-between py-3.5 px-4 rounded-2xl font-medium text-sm transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-[0.985] min-w-0 ${
                isActive
                  ? 'bg-card text-amber-500 border border-amber-500/50 shadow-sm shadow-amber-500/10 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent hover:border-border'
              }`}
            >
              {/* Subtle leading active accent bar */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-1.5 rtl:left-auto rtl:right-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#D97706] dark:bg-amber-500 shadow-sm shadow-[#D97706]/40 dark:shadow-amber-500/60"
                />
              )}

              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span
                  className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-[#D97706]/12 dark:bg-amber-500/20 text-[#D97706] dark:text-amber-400 shadow-sm'
                      : 'text-[#64748B] dark:text-[#9CA3AF] group-hover:text-[#D97706] dark:group-hover:text-amber-400 group-hover:bg-[#FAF7F2] dark:group-hover:bg-[#222632] group-hover:scale-105'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className={`tracking-tight truncate text-start ${
                  isActive
                    ? 'text-[#0F172A] dark:text-white font-extrabold'
                    : 'text-[#334155] dark:text-[#CBD5E1] group-hover:text-[#0F172A] dark:group-hover:text-[#F9FAFB] font-medium'
                }`}>
                  {isAr ? item.labelAr : item.labelEn}
                </span>
              </div>

              <ArrowIcon
                size={16}
                className={`transition-all duration-200 shrink-0 ml-1 rtl:ml-0 rtl:mr-1 ${
                  isActive
                    ? 'opacity-100 text-[#D97706] dark:text-amber-400 translate-x-0'
                    : 'opacity-0 -translate-x-1.5 rtl:translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400 dark:text-slate-500'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls & Storefront Link */}
      <div className="mt-auto pt-6 border-t border-border space-y-3 min-w-0">
        {/* Language & Theme Controls */}
        <div className="grid grid-cols-2 gap-2 min-w-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl bg-card hover:bg-card/80 border border-border text-xs font-semibold text-foreground transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 active:scale-[0.98] min-w-0"
            title={isAr ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <Globe size={15} className="text-amber-500 shrink-0" />
            <span className="truncate">{isAr ? 'English' : 'عربي'}</span>
          </button>

          <button
            type="button"
            onClick={toggleThemeMode}
            className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl bg-card hover:bg-card/80 border border-border text-xs font-semibold text-foreground transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 active:scale-[0.98] min-w-0"
            title={themeMode === 'dark' ? (isAr ? 'الوضع النهاري' : 'Light Mode') : (isAr ? 'الوضع الليلي' : 'Dark Mode')}
          >
            {themeMode === 'dark' ? (
              <>
                <Sun size={15} className="text-amber-400 shrink-0" />
                <span className="truncate">{isAr ? 'فاتح' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-amber-500 shrink-0" />
                <span className="truncate">{isAr ? 'داكن' : 'Dark'}</span>
              </>
            )}
          </button>
        </div>

        {/* View Customer Storefront Button */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 px-3.5 sm:px-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] dark:from-[#FCD34D] dark:via-[#F59E0B] dark:to-[#D97706] text-white dark:text-[#0B0F17] font-extrabold text-xs transition-all shadow-md shadow-[#D97706]/20 dark:shadow-amber-500/20 hover:brightness-105 active:scale-[0.985] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 min-w-0"
        >
          <Store size={16} className="text-white dark:text-[#0B0F17] shrink-0" />
          <span className="truncate">{isAr ? 'عرض واجهة الزبائن' : 'View Customer Store'}</span>
          <ExternalLink size={14} className="opacity-80 group-hover:opacity-100 transition-opacity shrink-0 text-white dark:text-[#0B0F17]" />
        </Link>
      </div>

      {/* Vertical Drag Handle (مقبض السحب لتعديل عرض القائمة الجانبية) */}
      {isResizable && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={width}
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          tabIndex={0}
          title={isAr ? 'اسحب لتغيير العرض (انقر نقراً مزدوجاً لإعادة الضبط)' : 'Drag to resize (Double click to reset)'}
          onPointerDown={handlePointerDown}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          className={`absolute top-0 bottom-0 z-30 cursor-col-resize group touch-none select-none w-4 flex items-center justify-center ${
            isRtl ? '-left-2' : '-right-2'
          }`}
        >
          {/* Subtle resize indicator line */}
          <div
            className={`w-[2px] h-full transition-colors duration-150 ${
              isDragging
                ? 'bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                : 'bg-transparent group-hover:bg-amber-500/60 dark:group-hover:bg-amber-400/60'
            }`}
          />

          {/* Centered ergonomic grip pill */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-8 rounded-full border flex flex-col items-center justify-center gap-1 transition-all duration-150 ${
              isDragging
                ? 'bg-amber-500 border-amber-400 text-white shadow-md scale-110'
                : 'bg-white dark:bg-[#1A1D24] border-slate-300 dark:border-white/20 text-slate-400 dark:text-slate-500 group-hover:border-amber-500/70 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:scale-105 shadow-sm'
            }`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="w-1 h-1 rounded-full bg-current" />
          </div>
        </div>
      )}
    </aside>
  );
};
