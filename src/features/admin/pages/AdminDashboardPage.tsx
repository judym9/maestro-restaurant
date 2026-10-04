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
} from 'lucide-react';
import { AdminMenuProvider, useAdminMenuContext } from '../context/AdminMenuContext';
import { AdminSettingsProvider, useAdminSettingsContext } from '../context/AdminSettingsContext';
import { AdminThemeProvider } from '../context/AdminThemeContext';
import { AdminDataProvider } from '../context/AdminDataContext';
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
    categoriesCount,
  } = useAdminMenuContext();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0">
            {/* Stat 1: Total Dishes (إجمالي الأطباق) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between min-w-0 group">
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold tracking-wide text-muted-foreground">
                  {isAr ? 'إجمالي الأطباق' : 'Total Dishes'}
                </span>
                <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <UtensilsCrossed size={18} />
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none text-center">
                  {totalDishesCount}
                </span>
              </div>
            </div>

            {/* Stat 2: Categories Count (أقسام القائمة) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between min-w-0 group">
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold tracking-wide text-muted-foreground">
                  {isAr ? 'أقسام القائمة' : 'Menu Sections'}
                </span>
                <span className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                  <TrendingUp size={18} />
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none text-center">
                  {categoriesCount}
                </span>
              </div>
            </div>

            {/* Stat 3: Active Promos (العروض النشطة) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between min-w-0 group">
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold tracking-wide text-muted-foreground">
                  {isAr ? 'العروض النشطة' : 'Active Promotions'}
                </span>
                <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                  <Tag size={18} />
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none text-center">
                  {promos.filter((p) => p.isActive).length}
                </span>
              </div>
            </div>

            {/* Stat 4: Restaurant Operating Status (استقبال الطلبات) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between min-w-0 group">
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-bold tracking-wide text-muted-foreground">
                  {isAr ? 'استقبال الطلبات' : 'Kitchen Status'}
                </span>
                <span
                  className={`p-2.5 rounded-2xl shrink-0 border ${
                    operatingSchedule.isOpen
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}
                >
                  <Clock size={18} />
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-2.5">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      operatingSchedule.isOpen
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse'
                        : 'bg-rose-500 shadow-sm shadow-rose-500/50'
                    }`}
                  />
                  <span
                    className={`text-lg sm:text-xl font-black tracking-tight leading-none text-center ${
                      operatingSchedule.isOpen
                        ? 'text-emerald-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {operatingSchedule.isOpen ? (isAr ? 'مفتوح للزبائن' : 'OPEN') : (isAr ? 'مغلق حالياً' : 'CLOSED')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleOpenStatus}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5 ${
                    operatingSchedule.isOpen
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  <Power size={13} className="shrink-0" />
                  <span>
                    {operatingSchedule.isOpen
                      ? (isAr ? 'التبديل إلى مغلق' : 'Switch to closed')
                      : (isAr ? 'التبديل إلى مفتوح' : 'Switch to open')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Management & Data Cards (الصف السفلي: كروت الإدارة والبيانات) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0 items-stretch">
            {/* Card 1: Branch Details & Hours (بيانات الفرع) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all h-full flex flex-col justify-between min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <MapPin size={17} />
                </span>
                <h3 className="text-sm font-black text-foreground leading-tight truncate">
                  {isAr ? 'بيانات فرع النبك' : 'Al-Nabek Branch Info'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-3 flex flex-col justify-around gap-3 text-xs">
                {/* Item 1: Address */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                    <MapPin size={14} />
                  </span>
                  <span className="font-normal text-muted-foreground text-xs truncate" title={isAr ? contactInfo.addressAr : contactInfo.addressEn}>
                    {isAr ? contactInfo.addressAr : contactInfo.addressEn}
                  </span>
                </div>

                {/* Item 2: Phone */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Phone size={14} />
                  </span>
                  <span dir="ltr" className="font-medium text-foreground text-xs text-start">
                    {contactInfo.phonePrimary}
                  </span>
                </div>

                {/* Item 3: WhatsApp */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                    <MessageCircle size={14} />
                  </span>
                  <span dir="ltr" className="font-medium text-foreground text-xs text-start">
                    +{contactInfo.whatsappNumber}
                  </span>
                </div>

                {/* Item 4: Hours */}
                <div className="flex items-center gap-2.5 py-0.5">
                  <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                    <Clock size={14} />
                  </span>
                  <span className="font-normal text-muted-foreground text-xs truncate" title={isAr ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}>
                    {isAr ? contactInfo.workingHoursAr : contactInfo.workingHoursEn}
                  </span>
                </div>
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center justify-center gap-2 text-center text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors pt-3 border-t border-border mt-auto bg-transparent cursor-pointer group"
              >
                <span>{isAr ? 'إدارة بيانات الفرع' : 'Manage Branch Info'}</span>
                <ArrowIcon size={16} className="text-amber-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: Menu & Dishes Management (قائمة الوجبات) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all h-full flex flex-col justify-between min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <UtensilsCrossed size={17} />
                </span>
                <h3 className="text-sm font-black text-foreground leading-tight truncate">
                  {isAr ? 'قائمة الطعام والوجبات' : 'Menu & Dishes'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-3 flex flex-col justify-around gap-3 text-xs">
                {/* Category 1: Shawarma */}
                <div className="flex items-center justify-between py-1 border-b border-border last:border-b-0">
                  <span className="font-medium text-foreground truncate">
                    {isAr ? 'الشاورما الشامية' : 'Authentic Shawarma'}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {dishes.filter((d) => d.categoryId.includes('shawarma')).length} {isAr ? 'وجبة' : 'items'}
                  </span>
                </div>

                {/* Category 2: Broasted */}
                <div className="flex items-center justify-between py-1 border-b border-border last:border-b-0">
                  <span className="font-medium text-foreground truncate">
                    {isAr ? 'الدجاج البروستد' : 'Golden Broasted'}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {dishes.filter((d) => d.categoryId.includes('broasted')).length} {isAr ? 'وجبة' : 'items'}
                  </span>
                </div>

                {/* Category 3: Towers */}
                <div className="flex items-center justify-between py-1 border-b border-border last:border-b-0">
                  <span className="font-medium text-foreground truncate">
                    {isAr ? 'أبراج مايسترو' : 'Shawarma Towers'}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {dishes.filter((d) => d.categoryId.includes('tower')).length} {isAr ? 'صنف' : 'items'}
                  </span>
                </div>

                {/* Category 4: Sides */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-foreground truncate">
                    {isAr ? 'المقبلات والإضافات' : 'Appetizers & Drinks'}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    {dishes.filter((d) => !d.categoryId.includes('shawarma') && !d.categoryId.includes('broasted') && !d.categoryId.includes('tower')).length} {isAr ? 'أصناف' : 'items'}
                  </span>
                </div>
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="w-full flex items-center justify-center gap-2 text-center text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors pt-3 border-t border-border mt-auto bg-transparent cursor-pointer group"
              >
                <span>{isAr ? 'إدارة الوجبات والأسعار' : 'Open Menu & Dish Manager'}</span>
                <ArrowIcon size={16} className="text-amber-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 3: Promotions & Royal Deals (العروض والكيانات) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all h-full flex flex-col justify-between min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                  <Tag size={17} />
                </span>
                <h3 className="text-sm font-black text-foreground leading-tight truncate">
                  {isAr ? 'العروض والباقات الملكية' : 'Promotions & Deals'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-2 flex flex-col justify-around gap-3 text-xs">
                {promos.slice(0, 2).map((deal) => (
                  <div
                    key={deal.id}
                    className="px-3.5 py-3 sm:py-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="font-semibold text-foreground truncate">
                          {isAr ? deal.titleAr : deal.titleEn}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                          -{deal.discountPercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-bold text-xs">
                          {deal.price.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                        </span>
                        <span className="line-through text-muted-foreground text-[10px] opacity-60">
                          {deal.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${deal.isActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground bg-muted'}`}>
                      {deal.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Off')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Action */}
              <button
                type="button"
                onClick={() => setActiveTab('promotions')}
                className="w-full flex items-center justify-center gap-2 text-center text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors pt-3 border-t border-border mt-auto bg-transparent cursor-pointer group"
              >
                <span>{isAr ? 'إدارة وتفعيل العروض' : 'Manage Royal Deals'}</span>
                <ArrowIcon size={16} className="text-amber-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 4: Maestro Signature Dishes (أطباق مايسترو) */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition-all h-full flex flex-col justify-between min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <Sparkles size={17} />
                </span>
                <h3 className="text-sm font-black text-foreground leading-tight truncate">
                  {isAr ? 'أطباق مايسترو الملكية' : 'Maestro Signature Dishes'}
                </h3>
              </div>

              {/* Body */}
              <div className="flex-1 my-2 flex flex-col justify-between gap-2.5 text-xs">
                {signatureDishes.slice(0, 3).map((dish) => (
                  <div
                    key={dish.id}
                    className="px-3.5 py-2.5 sm:py-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={MealAssets[dish.imageKey]?.src || MealAssets['shawarma-tower'].src}
                        alt={isAr ? dish.nameAr : dish.nameEn}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border"
                      />
                      <div className="min-w-0">
                        <span className="font-medium text-foreground truncate block text-xs">
                          {isAr ? dish.nameAr : dish.nameEn}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground block">
                          {dish.price.toLocaleString()} {isAr ? 'ل.س' : 'SYP'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                        dish.isAvailable
                          ? 'text-emerald-500 bg-emerald-500/10'
                          : 'text-rose-500 bg-rose-500/10'
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
                className="w-full flex items-center justify-center gap-2 text-center text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors pt-3 border-t border-border mt-auto bg-transparent cursor-pointer group"
              >
                <span>{isAr ? 'إدارة الأطباق المميزة' : 'Manage Signature Dishes'}</span>
                <ArrowIcon size={16} className="text-amber-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Menu Management */}
      {activeTab === 'menu' && <AdminMenuPage />}

      {/* Tab: Promotions */}
      {activeTab === 'promotions' && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-16 min-w-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'إدارة العروض الترويجية' : 'Promotions & Special Deals'}
            </h2>

            <button
              type="button"
              onClick={() => handleOpenPromoModal()}
              className="flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus size={18} />
              <span>{isAr ? 'إضافة عرض ترويجي' : 'Add Promotion'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPromos.map((deal) => (
              <PromoCard
                key={deal.id}
                deal={deal}
                onEdit={handleOpenPromoModal}
                onDelete={deletePromo}
                onToggleActive={togglePromoActive}
                language={language}
              />
            ))}
          </div>

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
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && <AdminSettingsPage />}

      {/* Tab: Theme Customizer */}
      {activeTab === 'theme' && (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-16 min-w-0">
          <ColorTokenPicker
            tokens={activeDraft}
            onChangeToken={handleTokenChange}
            onApplyPreset={applyPreset}
            onSaveTokens={saveTokens}
            onResetTokens={resetToDefault}
            saveSuccess={saveSuccess}
            language={language}
          />

          <ThemeCardPreview
            tokens={activeDraft}
            language={language}
          />
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
