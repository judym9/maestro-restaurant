import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Sparkles,
  Tag,
  ChefHat,
  Plus,
  Clock,
  Phone,
  Store,
  ChevronRight,
  ChevronLeft,
  Flame,
  SlidersHorizontal,
  Palette,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminToast } from '../context/AdminToastContext';
import { MetricCard } from '../components/common/MetricCard';
import { MealFormModal } from '../components/menu/MealFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { getMealImage } from '../../../utils/imageRegistry';
import type { AdminMealItem, MealFormData } from '../types/menu.types';

export const AdminDashboardPage: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useAdminToast();

  const {
    categories,
    dishes,
    promotions,
    restaurantSettings,
    toggleKitchenStatus,
    toggleDishAvailability,
    saveDish,
    deleteDish,
  } = useAdminData();

  // Modal states for direct meal CRUD operations from Dashboard
  const [editingMeal, setEditingMeal] = useState<AdminMealItem | null>(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [deletingMeal, setDeletingMeal] = useState<AdminMealItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Telemetry KPIs
  const totalDishes = dishes.length;
  const availableDishes = dishes.filter((d) => d.isAvailable).length;
  const activePromos = promotions.filter((p) => p.isActive).length;
  const isKitchenOpen = restaurantSettings.isKitchenOpen;

  // Master Kitchen Toggle Handler
  const handleToggleKitchen = async () => {
    const updated = await toggleKitchenStatus(!isKitchenOpen);
    showToast(
      'info',
      updated.isKitchenOpen
        ? language === 'ar'
          ? 'المطبخ يستقبل طلبات الزبائن الآن (نشط)'
          : 'Kitchen opened for orders (Active)'
        : language === 'ar'
        ? 'تم إيقاف استقبال الطلبات في المطبخ مؤقتاً (مغلق)'
        : 'Kitchen paused temporarily (Closed)'
    );
  };

  // Safe meal save handler
  const handleSaveMeal = async (formData: MealFormData) => {
    try {
      await saveDish(formData);
      showToast(
        'success',
        formData.id
          ? language === 'ar'
            ? 'تم تحديث بيانات الوجبة بنجاح'
            : 'Dish updated successfully'
          : language === 'ar'
          ? 'تمت إضافة الوجبة الجديدة إلى القائمة'
          : 'New dish added to catalog'
      );
      setIsMealModalOpen(false);
      setEditingMeal(null);
    } catch {
      showToast(
        'error',
        language === 'ar' ? 'فشل حفظ الوجبة، يرجى المحاولة ثانية' : 'Failed to save dish'
      );
    }
  };

  // Safe meal delete handler
  const handleConfirmDeleteMeal = async () => {
    if (!deletingMeal) return;
    try {
      await deleteDish(deletingMeal.id);
      showToast(
        'success',
        language === 'ar' ? 'تم حذف الوجبة من القائمة' : 'Dish removed successfully'
      );
      setIsDeleteModalOpen(false);
      setDeletingMeal(null);
    } catch {
      showToast(
        'error',
        language === 'ar' ? 'تعذر حذف الوجبة حالياً' : 'Failed to delete dish'
      );
    }
  };

  // Guaranteed non-empty signature & bestseller dishes list
  const signatureDishes = useMemo(() => {
    const filtered = dishes.filter((d) => d.isSignature || d.isBestseller);
    if (filtered.length > 0) return filtered.slice(0, 8);
    return dishes.slice(0, 8);
  }, [dishes]);

  // Helper to resolve dish image src
  const resolveImage = (key: string) => {
    if (key.startsWith('http') || key.startsWith('data:')) return key;
    return getMealImage(key).src;
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ========================================================
          1. HEADER & LIVE OPERATIONAL STATUS ROW
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="text-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[var(--accent-gold)] tracking-wider uppercase">
              {language === 'ar' ? 'مركز القيادة المباشر' : 'Live Command Center'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1 font-['Cairo',sans-serif]">
            {language === 'ar' ? 'لوحة القيادة التنفيذية — مطعم مايسترو' : 'Executive Dashboard — El Maestro'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            {language === 'ar'
              ? 'متابعة حية للعمليات، الأصناف، العروض الملكية وحالة المطبخ'
              : 'Real-time telemetry across food catalog, promotions & kitchen operations'}
          </p>
        </div>

        {/* Master Kitchen Switch & Clickable Badge */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 self-start sm:self-auto">
          <div className="flex flex-col text-start ps-2">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {language === 'ar' ? 'حالة المطبخ' : 'Kitchen Status'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {isKitchenOpen
                ? language === 'ar'
                  ? 'يستقبل الطلبات'
                  : 'Taking Orders'
                : language === 'ar'
                ? 'متوقف مؤقتاً'
                : 'Paused'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleKitchen}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer ${
              isKitchenOpen
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
            }`}
            title={language === 'ar' ? 'انقر لتغيير حالة المطبخ' : 'Click to toggle kitchen status'}
          >
            <ChefHat className="w-4 h-4 shrink-0" />
            <span>
              {isKitchenOpen
                ? language === 'ar'
                  ? 'مفتوح (تشغيل)'
                : 'Open (Active)'
                : language === 'ar'
                ? 'مغلق (إيقاف)'
                : 'Closed (Paused)'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. EXECUTIVE KPI TELEMETRY CARDS (Responsive CSS Grid)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <MetricCard
          title={language === 'ar' ? 'أصناف القائمة الملكية' : 'Catalog Meals'}
          value={totalDishes}
          subtitle={language === 'ar' ? `${availableDishes} صنف متاح حالياً للطلب` : `${availableDishes} available in stock`}
          icon={UtensilsCrossed}
          accentColor="gold"
          onClick={() => navigate('/admin/menu')}
        />

        <MetricCard
          title={language === 'ar' ? 'فئات الطعام النشطة' : 'Active Categories'}
          value={categories.length}
          subtitle={language === 'ar' ? 'تصنيفات منظمة للطلب' : 'Organized food sections'}
          icon={Sparkles}
          accentColor="blue"
          onClick={() => navigate('/admin/menu')}
        />

        <MetricCard
          title={language === 'ar' ? 'العروض الملكية النشطة' : 'Active Promotions'}
          value={activePromos}
          subtitle={language === 'ar' ? `${promotions.length} باقة مسجلة بالكامل` : `${promotions.length} total packages`}
          icon={Tag}
          accentColor="emerald"
          onClick={() => navigate('/admin/promotions')}
        />

        <MetricCard
          title={language === 'ar' ? 'سرعة التوصيل المتوقعة' : 'Delivery Speed'}
          value={restaurantSettings.deliveryTimeAr || '30 - 45 دقيقة'}
          subtitle={language === 'ar' ? 'النبك ومحيطها' : 'Al-Nabek & surrounds'}
          icon={Clock}
          accentColor="crimson"
          onClick={() => navigate('/admin/settings')}
        />
      </div>

      {/* ========================================================
          3. QUICK ACTIONS & DIRECT NAVIGATIONAL COMMAND BAR
          ======================================================== */}
      <div className="p-4 sm:p-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)] text-start">
          <Sparkles className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
          <h2 className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
            {language === 'ar' ? 'إجراءات سريعة واختصارات فورية' : 'Quick Operational Actions'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
          {/* Quick Action 1: Menu Management */}
          <Link
            to="/admin/menu"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 text-[var(--text-primary)] transition-all group text-start no-underline min-w-0 overflow-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">
                {language === 'ar' ? 'إدارة الوجبات' : 'Manage Dishes'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate">
                {language === 'ar' ? 'إضافة وتعديل الأصناف' : 'Add & edit meals'}
              </span>
            </div>
          </Link>

          {/* Quick Action 2: Royal Promotions */}
          <Link
            to="/admin/promotions"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-emerald-500 hover:bg-emerald-500/10 text-[var(--text-primary)] transition-all group text-start no-underline min-w-0 overflow-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Tag className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">
                {language === 'ar' ? 'العروض الملكية' : 'Promotions'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate">
                {language === 'ar' ? 'إطلاق حزم توفير' : 'Launch deals'}
              </span>
            </div>
          </Link>

          {/* Quick Action 3: Working Hours & Branch Settings */}
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-sky-500 hover:bg-sky-500/10 text-[var(--text-primary)] transition-all group text-start no-underline min-w-0 overflow-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
              <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">
                {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate">
                {language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly schedule'}
              </span>
            </div>
          </Link>

          {/* Quick Action 4: Visual Theme Customizer */}
          <Link
            to="/admin/theme"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-purple-500 hover:bg-purple-500/10 text-[var(--text-primary)] transition-all group text-start no-underline min-w-0 overflow-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">
                {language === 'ar' ? 'تخصيص الهوية' : 'Theme Colors'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate">
                {language === 'ar' ? 'محرر الألوان المباشر' : 'Visual customizer'}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ========================================================
          4. TWO-COLUMN OPERATIONAL LAYOUT:
             - LEFT (Col 7): Signature Dishes Roster with Quick CRUD
             - RIGHT (Col 5): Branch Profile & Settings Overview
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
        {/* Left Column: Signature & Bestseller Roster with Instant Actions */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-start">
              <Flame className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {language === 'ar' ? 'الوجبات التوقيعية والأكثر طلباً' : 'Signature & Bestseller Roster'}
              </h2>
            </div>

            <Link
              to="/admin/menu"
              className="text-xs font-bold text-[var(--accent-gold)] hover:underline flex items-center gap-1 no-underline"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View all'}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {signatureDishes.map((dish) => {
              const imageSrc = resolveImage(dish.imageKey);
              const matchedCategory = categories.find((c) => c.id === dish.categoryId);

              return (
                <div
                  key={dish.id}
                  className={`
                    flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl
                    border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)]
                    transition-all gap-3 w-full
                    ${!dish.isAvailable ? 'opacity-70 grayscale-[30%]' : ''}
                  `}
                >
                  {/* Dish Info & Thumbnail */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 text-start">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--border-subtle)]">
                      <img
                        src={imageSrc}
                        alt={language === 'ar' ? dish.nameAr : dish.nameEn}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[var(--text-primary)] truncate font-['Cairo',sans-serif]">
                          {language === 'ar' ? dish.nameAr : dish.nameEn}
                        </span>
                        {dish.isSignature && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
                            {language === 'ar' ? 'توقيع الشيف' : "Chef's"}
                          </span>
                        )}
                        {dish.isBestseller && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400">
                            {language === 'ar' ? 'الأكثر طلباً' : 'Bestseller'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--accent-gold)] font-mono font-bold">
                          {dish.price.toLocaleString('ar-SY')} {language === 'ar' ? 'ل.س' : 'SP'}
                        </span>
                        {matchedCategory && (
                          <span className="text-[11px] text-[var(--text-muted)] truncate">
                            • {language === 'ar' ? matchedCategory.nameAr : matchedCategory.nameEn}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Availability Switch + Edit + Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {/* Instant Availability Toggle */}
                    <button
                      type="button"
                      onClick={async () => {
                        await toggleDishAvailability(dish.id, !dish.isAvailable);
                        showToast(
                          'info',
                          !dish.isAvailable
                            ? language === 'ar'
                              ? `تم إتاحة وجبة "${dish.nameAr}" للطلب`
                              : `Marked "${dish.nameEn}" as available`
                            : language === 'ar'
                            ? `تم إيقاف وجبة "${dish.nameAr}" مؤقتاً`
                            : `Marked "${dish.nameEn}" as out of stock`
                        );
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                        dish.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/25 hover:bg-rose-500/25'
                      }`}
                      title={language === 'ar' ? 'تغيير حالة التوفر' : 'Toggle availability'}
                    >
                      {dish.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'متاح' : 'In Stock'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'معطل' : 'Out of Stock'}</span>
                        </>
                      )}
                    </button>

                    {/* Quick Edit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMeal(dish);
                        setIsMealModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 transition-colors cursor-pointer"
                      title={language === 'ar' ? 'تعديل بيانات الوجبة' : 'Edit meal'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Quick Delete Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingMeal(dish);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title={language === 'ar' ? 'حذف الوجبة من القائمة' : 'Delete meal'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Branch Operational Profile & Quick Settings */}
        <div className="lg:col-span-5 flex flex-col gap-5 p-5 sm:p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] w-full text-start">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Store className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {language === 'ar' ? 'معلومات وبيانات الفرع' : 'Branch Operational Profile'}
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs w-full">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] flex items-center gap-2">
                <Store className="w-4 h-4 text-[var(--accent-gold)]" />
                {language === 'ar' ? 'اسم المطعم:' : 'Restaurant:'}
              </span>
              <span className="font-bold text-[var(--text-primary)]">
                {language === 'ar' ? 'مطعم مايسترو الملكي' : 'El Maestro Royal Restaurant'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                {language === 'ar' ? 'هاتف الطلبات:' : 'Direct Phone:'}
              </span>
              <span className="font-bold text-[var(--text-primary)] font-mono" dir="ltr">
                {restaurantSettings.phone || '0969 697 587'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                {language === 'ar' ? 'أوقات الدوام:' : 'Operating Hours:'}
              </span>
              <span className="font-bold text-[var(--text-primary)]">
                12:00 PM - 02:00 AM
              </span>
            </div>

            <div className="flex items-start justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] flex items-center gap-2 shrink-0">
                <Store className="w-4 h-4 text-purple-400" />
                {language === 'ar' ? 'العنوان:' : 'Address:'}
              </span>
              <span className="font-medium text-[var(--text-primary)] text-end ms-4">
                {language === 'ar'
                  ? restaurantSettings.addressAr || 'شارع الأمين، ساحة الميدان، النبك'
                  : restaurantSettings.addressEn || 'Amin Street, Al-Midan Square, Al-Nabek'}
              </span>
            </div>
          </div>

          <Link
            to="/admin/settings"
            className="w-full py-2.5 rounded-xl text-xs font-bold border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors text-center no-underline"
          >
            {language === 'ar' ? 'تعديل الإعدادات والملف' : 'Configure Profile & Settings'}
          </Link>
        </div>
      </div>

      {/* ========================================================
          5. MODALS MOUNTED FOR DIRECT DASHBOARD ACTIONS
          ======================================================== */}
      {/* Meal Form Modal */}
      <MealFormModal
        isOpen={isMealModalOpen}
        categories={categories}
        editingMeal={editingMeal}
        onClose={() => {
          setIsMealModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveMeal}
      />

      {/* Meal Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        titleAr="تأكيد حذف الوجبة"
        titleEn="Confirm Meal Deletion"
        messageAr={`هل أنت متأكد من رغبتك في حذف "${deletingMeal?.nameAr || ''}" نهائياً من قائمة الطعام؟`}
        messageEn={`Are you sure you want to permanently delete "${deletingMeal?.nameEn || ''}"?`}
        confirmLabelAr="حذف الوجبة"
        confirmLabelEn="Delete Meal"
        cancelLabelAr="إلغاء"
        cancelLabelEn="Cancel"
        onConfirm={handleConfirmDeleteMeal}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingMeal(null);
        }}
        isDestructive
      />
    </div>
  );
};

export default AdminDashboardPage;
