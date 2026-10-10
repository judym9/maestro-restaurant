import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Layers,
  Sparkles,
  Clock,
  Plus,
  SlidersHorizontal,
  Palette,
  Store,
  Phone,
  MapPin,
  Flame,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminMenu } from '../hooks/useAdminMenu';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { useAdminToast } from '../context/AdminToastContext';
import { MetricCard } from '../components/common/MetricCard';
import { MealCard } from '../components/menu/MealCard';
import { MealFormModal } from '../components/menu/MealFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import type { AdminMealItem, MealFormData } from '../types/menu.types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAdminToast();
  const {
    dishes,
    categories,
    promotions,
    restaurantSettings,
    toggleKitchenStatus,
    toggleDishAvailability,
  } = useAdminData();

  const {
    saveDish,
    deleteDish,
  } = useAdminMenu();

  const { contactInfo } = useAdminSettings();

  // Modals state
  const [editingMeal, setEditingMeal] = useState<AdminMealItem | null>(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Compute metrics
  const availableDishesCount = dishes.filter((d) => d.isAvailable !== false).length;
  const activePromosCount = promotions.filter((p) => p.isActive).length;
  const signatureDishes = dishes
    .filter((d) => d.isSignature || d.isBestseller)
    .slice(0, 4);
  const displayDishes = signatureDishes.length > 0 ? signatureDishes : dishes.slice(0, 4);

  // Master Kitchen Switch Handler
  const handleToggleKitchen = () => {
    const nextState = !restaurantSettings.isKitchenOpen;
    toggleKitchenStatus(nextState);
    showToast(
      nextState ? 'success' : 'info',
      nextState
        ? 'تم فتح المطبخ وبدء استقبال طلبات الزبائن بنجاح'
        : 'تم إيقاف استقبال الطلبات مؤقتاً'
    );
  };

  // Meal Modal Handlers
  const handleOpenAddMeal = () => {
    setEditingMeal(null);
    setIsMealModalOpen(true);
  };

  const handleEditMeal = (meal: AdminMealItem) => {
    setEditingMeal(meal);
    setIsMealModalOpen(true);
  };

  const handleDuplicateMeal = (meal: AdminMealItem) => {
    const duplicated: MealFormData = {
      nameAr: `${meal.nameAr} (نسخة)`,
      nameEn: `${meal.nameEn} (Copy)`,
      categoryId: meal.categoryId,
      descriptionAr: meal.descriptionAr,
      descriptionEn: meal.descriptionEn,
      price: meal.price,
      originalPrice: meal.originalPrice,
      prepTimeMinutes: meal.prepTimeMinutes,
      imageKey: meal.imageKey,
      isAvailable: true,
      isSignature: meal.isSignature,
      isBestseller: meal.isBestseller,
      isSpicy: meal.isSpicy,
      isNew: true,
      isVegetarian: meal.isVegetarian,
      isGlutenFree: meal.isGlutenFree,
      ingredientsArText: meal.ingredientsAr?.join(', ') || '',
      ingredientsEnText: meal.ingredientsEn?.join(', ') || '',
      options: meal.options ? [...meal.options] : [],
    };
    saveDish(duplicated);
    showToast('success', 'تم نسخ الوجبة بنجاح وإضافتها للقائمة');
  };

  const handleSaveMeal = (data: MealFormData) => {
    saveDish(data);
    setIsMealModalOpen(false);
    showToast(
      'success',
      data.id ? 'تم تحديث بيانات الوجبة بنجاح' : 'تمت إضافة الوجبة الملكية بنجاح'
    );
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteDish(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('info', 'تم حذف الوجبة من القائمة بنجاح');
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive Command Header */}
      <div className="relative p-6 sm:p-8 px-6 sm:px-8 py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-[#0c121f] via-[#090d16] to-[#06090e] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Flame className="w-3.5 h-3.5" />
                <span>الفرع الرئيسي — النبك، ريف دمشق</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">لوحة القيادة والمؤشرات</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              إدارة مطعم مايسترو الملكي
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              الإشراف الشامل على كتالوج الطعام، حزم التوفير الملكية، وسرعة تلبية الطلبات لفرع النبك لحظياً.
            </p>
          </div>

          {/* Master Kitchen Switch Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div
              className={`flex items-center justify-between gap-4.5 p-5 sm:p-5.5 rounded-2xl border transition-all ${
                restaurantSettings.isKitchenOpen
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-500/5'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-lg shadow-rose-500/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    restaurantSettings.isKitchenOpen
                      ? 'bg-emerald-400 animate-ping'
                      : 'bg-rose-400'
                  }`}
                />
                <div>
                  <span className="text-xs font-medium text-slate-400 block">
                    حالة استقبال الطلبات
                  </span>
                  <span className="text-sm font-extrabold block">
                    {restaurantSettings.isKitchenOpen
                      ? 'المطبخ يستقبل الطلبات'
                      : 'المطبخ متوقف مؤقتاً'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleKitchen}
                className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
                  restaurantSettings.isKitchenOpen
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {restaurantSettings.isKitchenOpen ? 'إيقاف الطلبات' : 'فتح المطبخ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          title="أصناف القائمة الملكية"
          value={dishes.length}
          subtitle={`${availableDishesCount} وجبة متاحة للطلب الفوري`}
          icon={UtensilsCrossed}
          badge={{ text: 'نشط', variant: 'gold' }}
          onClick={() => navigate('/admin/menu')}
        />

        <MetricCard
          title="أقسام وتصنيفات الطعام"
          value={categories.length}
          subtitle="مفهرسة في قائمة المتجر"
          icon={Layers}
          badge={{ text: 'محدثة', variant: 'info' }}
          onClick={() => navigate('/admin/menu')}
        />

        <MetricCard
          title="العروض الملكية النشطة"
          value={activePromosCount}
          subtitle={`${promotions.length} حزمة مسجلة بالنظام`}
          icon={Sparkles}
          badge={{ text: 'توفير', variant: 'warning' }}
          onClick={() => navigate('/admin/promotions')}
        />

        <MetricCard
          title="وقت التوصيل التقديري"
          value={restaurantSettings.deliveryTimeAr || '30 - 45 دقيقة'}
          subtitle="تغطية كامل مدينة النبك"
          icon={Clock}
          badge={{ text: 'سريع', variant: 'success' }}
          onClick={() => navigate('/admin/settings')}
        />
      </div>

      {/* Quick Command Bar */}
      <div className="p-4.5 sm:p-5 rounded-2xl bg-[#0b101b] border border-slate-800/80 flex flex-wrap items-center justify-between gap-3.5">
        <span className="text-xs font-bold text-slate-300">
          إجراءات سريعة:
        </span>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAddMeal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة وجبة ملكية</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/promotions')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>إدارة العروض الترويجية</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>ساعات الدوام والتواصل</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/theme')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>تخصيص الهوية والمظهر</span>
          </button>
        </div>
      </div>

      {/* Signature & Bestsellers Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>أبرز وجبات القائمة التوقيعية والأكثر طلباً</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              تبديل سريع للتوفر وتعديل الوجبات الأكثر مبيعاً
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/menu')}
            className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>عرض كافة الأصناف ({dishes.length})</span>
            <span>←</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayDishes.map((dish) => {
            const cat = categories.find((c) => c.id === dish.categoryId);

            return (
              <MealCard
                key={dish.id}
                meal={dish}
                category={cat}
                onEdit={handleEditMeal}
                onDuplicate={handleDuplicateMeal}
                onDelete={(id) => setDeleteConfirmId(id)}
                onToggleAvailability={(id) => {
                  toggleDishAvailability(id);
                  showToast('info', 'تم تحديث حالة توفر الوجبة');
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Operational Branch Profile Card */}
      <div className="p-6 sm:p-8 px-6 sm:px-8 py-6 sm:py-8 rounded-2xl bg-[#0b101b] border border-slate-800 space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {contactInfo.restaurantNameAr || 'مطعم مايسترو الملكي'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {contactInfo.restaurantNameEn || 'El Maestro Royal Restaurant'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/settings')}
            className="text-xs font-semibold text-amber-400 hover:underline"
          >
            تعديل بيانات الفرع
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-xs">
          <div className="flex items-start gap-3 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block text-slate-400">العنوان:</span>
              <span className="leading-relaxed block">{contactInfo.addressAr || restaurantSettings.addressAr || 'سوريا، النبك، شارع أمين'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-slate-300">
            <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block text-slate-400">هواتف الطلبات:</span>
              <span className="font-mono block">{contactInfo.phonePrimary || restaurantSettings.phone}</span>
              <span className="font-mono text-slate-400 block">واتساب: {contactInfo.whatsappNumber || restaurantSettings.whatsapp}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block text-slate-400">أوقات العمل:</span>
              <span className="leading-relaxed block">{contactInfo.workingHoursAr || 'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Form Modal */}
      <MealFormModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        onSave={handleSaveMeal}
        meal={editingMeal}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="حذف الوجبة من القائمة"
        message="هل أنت متأكد من حذف هذه الوجبة نهائياً؟ لن تظهر في قائمة الطعام بعد الحذف."
        confirmText="تأكيد الحذف"
        variant="danger"
      />
    </div>
  );
};

export default AdminDashboardPage;
