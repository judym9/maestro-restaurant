import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Tag,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  TrendingUp,
  Plus,
  ChevronRight,
  ChevronLeft,
  Power,
  CheckCircle2,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { AdminMenuProvider, useAdminMenuContext } from '../context/AdminMenuContext';
import { AdminSettingsProvider, useAdminSettingsContext } from '../context/AdminSettingsContext';
import { AdminThemeProvider } from '../context/AdminThemeContext';
import { AdminDataProvider, useAdminData } from '../context/AdminDataContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import type { AdminNavTab } from '../components/layout/AdminSidebar';
import { AdminMenuPage } from './AdminMenuPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import { usePromotions } from '../hooks/usePromotions';
import { PromoCard } from '../components/promotions/PromoCard';
import { PromoFormModal } from '../components/promotions/PromoFormModal';
import { PromoPagination } from '../components/promotions/PromoPagination';
import { useThemeCustomizer } from '../hooks/useThemeCustomizer';
import { ColorTokenPicker } from '../components/theme/ColorTokenPicker';
import { ThemeCardPreview } from '../components/theme/ThemeCardPreview';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { MealAssets } from '../../../utils/imageRegistry';
import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';
import { KpiMetricCard, KpiMetricCardSkeleton } from '../components/dashboard/KpiMetricCard';

/**
 * Inner Dashboard Component that has access to all admin contexts
 */
const AdminDashboardInner: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [activeTab, setActiveTab] = useState<AdminNavTab>('dashboard');

  // Menu context
  const {
    dishes,
    totalDishesCount,
    availableDishesCount,
    categoriesCount,
  } = useAdminMenuContext();

  // Admin Data context for loading state
  const { isLoading } = useAdminData();

  // Settings context
  const {
    contactInfo,
    operatingSchedule,
    toggleOpenStatus,
  } = useAdminSettingsContext();

  // Promotions Hook
  const {
    promos,
    paginatedPromos,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    editingPromo,
    isModalOpen: isPromoModalOpen,
    deleteConfirmId: promoDeleteConfirmId,
    setDeleteConfirmId: setPromoDeleteConfirmId,
    openNewPromoModal,
    openEditPromoModal,
    closeModal: closePromoModal,
    savePromo,
    deletePromo,
    togglePromoActive,
  } = usePromotions(6);

  // Theme Customizer Hook
  const {
    activeDraft,
    handleTokenChange,
    applyPreset,
    saveTokens,
    resetToDefault,
    saveSuccess,
  } = useThemeCustomizer();

  const handleOpenPromoModal = (deal?: AdminPromoDeal) => {
    if (deal) {
      openEditPromoModal(deal);
    } else {
      openNewPromoModal();
    }
  };

  const handleSavePromo = (data: PromoFormData) => {
    savePromo(data);
  };

  const signatureDishes = dishes.filter((d) => d.isSignature || d.isBestseller).slice(0, 4);

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onQuickAddMeal={activeTab === 'menu' ? undefined : () => setActiveTab('menu')}
    >
      {/* Tab: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col gap-y-6 sm:gap-y-8 min-w-0">
          {/* Top KPI Stat Cards (الصف العلوي: مؤشرات سريعة) */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 w-full min-w-0">
              <KpiMetricCardSkeleton />
              <KpiMetricCardSkeleton />
              <KpiMetricCardSkeleton />
              <KpiMetricCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 w-full min-w-0">
              {/* Stat 1: Total Dishes (إجمالي الأطباق) */}
              <KpiMetricCard
                label={isAr ? 'إجمالي الأطباق' : 'Total Dishes'}
                value={totalDishesCount}
                icon={UtensilsCrossed}
                iconColorVariant="amber"
                badge={{
                  text: isAr ? `${availableDishesCount} متاح للطلب` : `${availableDishesCount} available`,
                  variant: 'emerald',
                  icon: <CheckCircle2 size={12} />,
                }}
                onClick={() => setActiveTab('menu')}
                tooltip={isAr ? 'انقر لإدارة الأطباق في القائمة' : 'Click to manage menu dishes'}
              />

              {/* Stat 2: Categories Count (أقسام القائمة) */}
              <KpiMetricCard
                label={isAr ? 'أقسام القائمة' : 'Menu Sections'}
                value={categoriesCount}
                icon={TrendingUp}
                iconColorVariant="blue"
                badge={{
                  text: isAr ? 'تصنيفات رئيسية نشطة' : 'Active food categories',
                  variant: 'blue',
                  icon: <Layers size={12} />,
                }}
                onClick={() => setActiveTab('menu')}
                tooltip={isAr ? 'انقر لعرض وتعديل أقسام القائمة' : 'Click to view menu categories'}
              />

              {/* Stat 3: Active Promos (العروض النشطة) */}
              <KpiMetricCard
                label={isAr ? 'العروض النشطة' : 'Active Promotions'}
                value={promos.filter((p) => p.isActive).length}
                icon={Tag}
                iconColorVariant="emerald"
                badge={{
                  text: isAr
                    ? `${promos.filter((p) => p.isActive).length} عروض نشطة`
                    : `${promos.filter((p) => p.isActive).length} active deals`,
                  variant: promos.filter((p) => p.isActive).length > 0 ? 'emerald' : 'muted',
                  icon: <Sparkles size={12} />,
                }}
                onClick={() => setActiveTab('promotions')}
                tooltip={isAr ? 'انقر لإدارة العروض الترويجية' : 'Click to manage promotions'}
              />

              {/* Stat 4: Restaurant Operating Status (استقبال الطلبات) */}
              <KpiMetricCard
                label={isAr ? 'استقبال الطلبات' : 'Kitchen Status'}
                icon={Clock}
                iconColorVariant={operatingSchedule.isOpen ? 'emerald' : 'rose'}
                value={
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        operatingSchedule.isOpen
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse'
                          : 'bg-rose-500 shadow-sm shadow-rose-500/50'
                      }`}
                    />
                    <span
                      className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
                        operatingSchedule.isOpen ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {operatingSchedule.isOpen ? (isAr ? 'مفتوح للزبائن' : 'OPEN') : (isAr ? 'مغلق حالياً' : 'CLOSED')}
                    </span>
                  </div>
                }
                actionNode={
                  <div className="w-full flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                      {operatingSchedule.isOpen
                        ? (isAr ? 'يستقبل الطلبات الآن' : 'Accepting orders')
                        : (isAr ? 'الطلبات متوقفة مؤقتاً' : 'Orders paused')}
                    </span>
                    <button
                      type="button"
                      onClick={toggleOpenStatus}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                        operatingSchedule.isOpen
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      }`}
                      title={
                        operatingSchedule.isOpen
                          ? (isAr ? 'إغلاق استقبال الطلبات' : 'Close kitchen')
                          : (isAr ? 'فتح استقبال الطلبات' : 'Open kitchen')
                      }
                    >
                      <Power size={13} className="shrink-0" />
                      <span>
                        {operatingSchedule.isOpen
                          ? (isAr ? 'التبديل إلى مغلق' : 'Switch to closed')
                          : (isAr ? 'التبديل إلى مفتوح' : 'Switch to open')}
                      </span>
                    </button>
                  </div>
                }
              />
            </div>
          )}

          {/* Bottom Management & Data Cards (الصف السفلي: كروت الإدارة والبيانات) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 w-full min-w-0 items-stretch">
            {/* Card 1: Branch Details & Hours (بيانات الفرع) */}
            <div className="relative bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between min-w-0 group">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-300 rounded-t-xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  {isAr ? 'بيانات فرع النبك' : 'Al-Nabek Branch Info'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-3.5 flex flex-col justify-between gap-2.5 text-xs">
                {/* Item 1: Address */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80 min-w-0">
                  <span className="p-1 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400 shrink-0">
                    <MapPin size={13} />
                  </span>
                  <span className="font-medium text-slate-600 dark:text-zinc-300 text-xs truncate" title={isAr ? contactInfo.addressAr : contactInfo.addressEn}>
                    {isAr ? contactInfo.addressAr : contactInfo.addressEn}
                  </span>
                </div>

                {/* Item 2: Phone */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80 min-w-0">
                  <span className="p-1 rounded-md bg-sky-500/10 text-sky-500 dark:text-sky-400 shrink-0">
                    <Phone size={13} />
                  </span>
                  <span dir="ltr" className="font-bold text-slate-900 dark:text-zinc-100 text-xs text-start font-numeric truncate">
                    {contactInfo.phonePrimary}
                  </span>
                </div>

                {/* Item 3: WhatsApp */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80 min-w-0">
                  <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shrink-0">
                    <MessageCircle size={13} />
                  </span>
                  <span dir="ltr" className="font-bold text-slate-900 dark:text-zinc-100 text-xs text-start font-numeric truncate">
                    +{contactInfo.whatsappNumber}
                  </span>
                </div>

                {/* Item 4: Hours */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80 min-w-0">
                  <span className="p-1 rounded-md bg-purple-500/10 text-purple-500 dark:text-purple-400 shrink-0">
                    <Clock size={13} />
                  </span>
                  <span className="font-medium text-slate-600 dark:text-zinc-300 text-xs truncate" title={isAr ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}>
                    {isAr ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}
                  </span>
                </div>
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center justify-center gap-2 text-center text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors pt-3 border-t border-slate-100 dark:border-zinc-800/80 mt-auto bg-transparent cursor-pointer group/btn"
              >
                <span>{isAr ? 'إدارة بيانات الفرع' : 'Manage Branch Info'}</span>
                <ArrowIcon size={14} className="text-amber-500 dark:text-amber-400 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: Menu & Dishes Management (قائمة الوجبات) */}
            <div className="relative bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between min-w-0 group">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-300 rounded-t-xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <UtensilsCrossed size={16} />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  {isAr ? 'قائمة الطعام والوجبات' : 'Menu & Dishes'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-3.5 flex flex-col justify-between gap-2.5 text-xs">
                {/* Category 1: Shawarma */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200 truncate text-xs">
                    {isAr ? 'الشاورما الشامية' : 'Authentic Shawarma'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/50 text-[11px] font-bold text-slate-700 dark:text-zinc-300 font-numeric shrink-0 whitespace-nowrap">
                    {dishes.filter((d) => d.categoryId.includes('shawarma')).length} {isAr ? 'وجبة' : 'items'}
                  </span>
                </div>

                {/* Category 2: Broasted */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200 truncate text-xs">
                    {isAr ? 'الدجاج البروستد' : 'Golden Broasted'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/50 text-[11px] font-bold text-slate-700 dark:text-zinc-300 font-numeric shrink-0 whitespace-nowrap">
                    {dishes.filter((d) => d.categoryId.includes('broasted')).length} {isAr ? 'وجبة' : 'items'}
                  </span>
                </div>

                {/* Category 3: Towers */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200 truncate text-xs">
                    {isAr ? 'أبراج مايسترو' : 'Shawarma Towers'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/50 text-[11px] font-bold text-slate-700 dark:text-zinc-300 font-numeric shrink-0 whitespace-nowrap">
                    {dishes.filter((d) => d.categoryId.includes('tower')).length} {isAr ? 'صنف' : 'items'}
                  </span>
                </div>

                {/* Category 4: Sides */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200 truncate text-xs">
                    {isAr ? 'المقبلات والإضافات' : 'Appetizers & Drinks'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/50 text-[11px] font-bold text-slate-700 dark:text-zinc-300 font-numeric shrink-0 whitespace-nowrap">
                    {dishes.filter((d) => !d.categoryId.includes('shawarma') && !d.categoryId.includes('broasted') && !d.categoryId.includes('tower')).length} {isAr ? 'أصناف' : 'items'}
                  </span>
                </div>
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="w-full flex items-center justify-center gap-2 text-center text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors pt-3 border-t border-slate-100 dark:border-zinc-800/80 mt-auto bg-transparent cursor-pointer group/btn"
              >
                <span>{isAr ? 'إدارة الوجبات والأسعار' : 'Open Menu & Dish Manager'}</span>
                <ArrowIcon size={14} className="text-amber-500 dark:text-amber-400 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 3: Promotions & Royal Deals (العروض والكيانات) */}
            <div className="relative bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between min-w-0 group">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/40 transition-all duration-300 rounded-t-xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Tag size={16} />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  {isAr ? 'العروض والباقات الملكية' : 'Promotions & Deals'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-3.5 flex flex-col justify-between gap-2.5 text-xs">
                {promos.slice(0, 2).map((deal) => (
                  <div
                    key={deal.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80 flex flex-col gap-1.5 min-w-0"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="font-bold text-slate-900 dark:text-zinc-100 truncate text-xs">
                        {isAr ? deal.titleAr : deal.titleEn}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 whitespace-nowrap ${deal.isActive ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/40'}`}>
                        {deal.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Off')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-900 dark:text-zinc-100 font-black text-xs font-numeric">
                          {deal.price.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                        </span>
                        <span className="line-through text-muted-foreground text-[10px] font-numeric opacity-60">
                          {deal.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 whitespace-nowrap">
                        -{deal.discountPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('promotions')}
                className="w-full flex items-center justify-center gap-2 text-center text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors pt-3 border-t border-slate-100 dark:border-zinc-800/80 mt-auto bg-transparent cursor-pointer group/btn"
              >
                <span>{isAr ? 'إدارة وتفعيل العروض' : 'Manage Royal Deals'}</span>
                <ArrowIcon size={14} className="text-amber-500 dark:text-amber-400 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 4: Maestro Signature Dishes (أطباق مايسترو) */}
            <div className="relative bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between min-w-0 group">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-300 rounded-t-xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                  {isAr ? 'أطباق مايسترو الملكية' : 'Maestro Signature Dishes'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-3.5 flex flex-col justify-between gap-2 text-xs">
                {signatureDishes.slice(0, 3).map((dish) => (
                  <div
                    key={dish.id}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/80 flex items-center justify-between gap-2.5 min-w-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={MealAssets[dish.imageKey]?.src || MealAssets['shawarma-tower'].src}
                        alt={isAr ? dish.nameAr : dish.nameEn}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200/80 dark:border-zinc-700/80"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-zinc-100 truncate block text-xs">
                          {isAr ? dish.nameAr : dish.nameEn}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground block font-numeric">
                          {dish.price.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 whitespace-nowrap ${
                        dish.isAvailable
                          ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20'
                      }`}
                    >
                      {dish.isAvailable ? (isAr ? 'متوفر' : 'Available') : (isAr ? 'معطل' : 'Sold Out')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="w-full flex items-center justify-center gap-2 text-center text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors pt-3 border-t border-slate-100 dark:border-zinc-800/80 mt-auto bg-transparent cursor-pointer group/btn"
              >
                <span>{isAr ? 'إدارة الأطباق المميزة' : 'Manage Signature Dishes'}</span>
                <ArrowIcon size={14} className="text-amber-500 dark:text-amber-400 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Menu Management */}
      {activeTab === 'menu' && <AdminMenuPage />}

      {/* Tab: Promotions / Royal Bundles (العروض والباقات الملكية) */}
      {activeTab === 'promotions' && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-16 min-w-0">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-100 dark:border-zinc-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <Tag size={20} />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                  {isAr ? 'العروض والباقات الملكية' : 'Royal Offers & Bundles'}
                </h2>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400">
                {isAr
                  ? 'إدارة باقات التوفير الحصرية، خصومات الوجبات العائلية، وتحديد فترات الصلاحية.'
                  : 'Manage exclusive savings bundles, family deals, and validity periods.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Micro Stats Counter */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-numeric">
                  {promos.length} {isAr ? 'باقة إجمالاً' : 'Total Bundles'}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-numeric">
                  {promos.filter((p) => p.isActive).length} {isAr ? 'عروض نشطة' : 'Active'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPromoModal()}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4.5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer whitespace-nowrap"
              >
                <Plus size={17} className="stroke-[3]" />
                <span>{isAr ? 'إضافة باقة جديدة' : 'Add New Bundle'}</span>
              </button>
            </div>
          </div>

          {/* Bundles Grid */}
          {paginatedPromos.length === 0 ? (
            <div className="py-16 text-center rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Tag size={28} className="stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {isAr ? 'لا توجد عروض ترويجية مسجلة حالياً' : 'No promotional deals registered'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  {isAr
                    ? 'أضف باقات ملكية خاصة لتقديم أسعار مميزة وجذب المزيد من الزبائن.'
                    : 'Add special royal bundles to offer attractive discounts and delight customers.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPromoModal()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm cursor-pointer"
              >
                {isAr ? 'إضافة باقة جديدة' : 'Add New Bundle'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {paginatedPromos.map((deal) => (
                <PromoCard
                  key={deal.id}
                  deal={deal}
                  onEdit={handleOpenPromoModal}
                  onDelete={(id) => setPromoDeleteConfirmId(id)}
                  onToggleActive={togglePromoActive}
                  language={language}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <PromoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNext={nextPage}
            onPrev={prevPage}
            isRtl={isRtl}
            language={language}
          />

          {/* Promotion Form Modal */}
          <PromoFormModal
            isOpen={isPromoModalOpen}
            onClose={closePromoModal}
            onSave={handleSavePromo}
            initialData={editingPromo}
            language={language}
          />

          {/* Delete Promo Confirmation Modal */}
          <Modal
            isOpen={Boolean(promoDeleteConfirmId)}
            onClose={() => setPromoDeleteConfirmId(null)}
            size="sm"
            title={isAr ? 'تأكيد حذف الباقة الملكية' : 'Confirm Bundle Deletion'}
          >
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mx-auto flex items-center justify-center">
                <AlertCircle size={26} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {isAr ? 'هل أنت متأكد من حذف هذه الباقة؟' : 'Are you sure you want to delete this bundle?'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {isAr
                    ? 'سيتم حذف الباقة نهائياً ولن يتمكن الزبائن من طلب هذا العرض بعد الآن.'
                    : 'This offer will be permanently deleted and customers won’t be able to order it.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPromoDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (promoDeleteConfirmId) deletePromo(promoDeleteConfirmId);
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm shadow-rose-600/20 active:scale-95 cursor-pointer"
                >
                  {isAr ? 'نعم، احذف الباقة' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && <AdminSettingsPage />}

      {/* Tab: Theme Customizer */}
      {activeTab === 'theme' && (
        <div className="w-full max-w-7xl mx-auto pb-16 min-w-0">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left / Forms Column (7 cols on XL) */}
            <div className="xl:col-span-7 space-y-6 min-w-0">
              <ColorTokenPicker
                tokens={activeDraft}
                onChangeToken={handleTokenChange}
                onApplyPreset={applyPreset}
                onSaveTokens={saveTokens}
                onResetTokens={resetToDefault}
                saveSuccess={saveSuccess}
                language={language}
              />
            </div>

            {/* Right / Sticky Live Preview Column (5 cols on XL) */}
            <div className="xl:col-span-5 min-w-0 xl:sticky xl:top-6">
              <ThemeCardPreview
                tokens={activeDraft}
                language={language}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

/**
 * Root Admin Dashboard Page with Provider Wrapping
 */
export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminDataProvider>
      <AdminThemeProvider>
        <AdminSettingsProvider>
          <AdminMenuProvider>
            <AdminDashboardInner />
          </AdminMenuProvider>
        </AdminSettingsProvider>
      </AdminThemeProvider>
    </AdminDataProvider>
  );
};

export default AdminDashboardPage;
