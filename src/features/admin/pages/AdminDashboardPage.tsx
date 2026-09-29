import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, UtensilsCrossed, X } from 'lucide-react';
import { AdminLanguageProvider, useAdminLanguage } from '../context/AdminLanguageContext';
import { AdminThemeProvider } from '../context/AdminThemeContext';
import { AdminMenuProvider, useAdminMenu } from '../context/AdminMenuContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { MealCardAdmin } from '../components/menu/MealCardAdmin';
import { MealFormModal } from '../components/menu/MealFormModal';
import { CategoryManager } from '../components/menu/CategoryManager';
import { PromoBannerList } from '../components/promotions/PromoBannerList';
import { OperatingStatusToggle } from '../components/settings/OperatingStatusToggle';
import { BusinessInfoForm } from '../components/settings/BusinessInfoForm';
import { ThemeTokenPicker } from '../components/theme/ThemeTokenPicker';
import type { AdminTab } from '../types/admin.types';
import type { AdminDishItem } from '../types/menu.types';

const MenuManagementView: React.FC = () => {
  const { isRTL } = useAdminLanguage();
  const {
    dishes,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    availabilityFilter,
    setAvailabilityFilter,
    saveDish,
    deleteDish,
    toggleAvailability,
    saveCategory,
    deleteCategory,
    filteredDishes,
  } = useAdminMenu();

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<AdminDishItem | null>(null);

  // Dishes count by category
  const dishesCountByCategory = React.useMemo(() => {
    const map: Record<string, number> = {};
    dishes.forEach((d) => {
      map[d.categoryId] = (map[d.categoryId] || 0) + 1;
    });
    return map;
  }, [dishes]);

  const handleEditDish = (dish: AdminDishItem) => {
    setEditingDish(dish);
    setIsDishModalOpen(true);
  };

  const handleAddDish = () => {
    setEditingDish(null);
    setIsDishModalOpen(true);
  };

  const handleDeleteDish = async (id: string, name: string) => {
    if (confirm(isRTL ? `هل أنت متأكد من رغبتك في حذف وجبة "${name}"؟` : `Delete dish "${name}"?`)) {
      await deleteDish(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Tier 1: Action Header Card */}
      <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <UtensilsCrossed size={28} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                {isRTL ? 'إدارة قائمة الطعام والوجبات' : 'Menu & Dishes Catalog'}
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {isRTL ? 'الأسعار بالليرة السورية' : 'Syrian Lira (SYP)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              {isRTL
                ? `إجمالي ${dishes.length} وجبة موزعة على ${categories.length} تصنيفات رئيسية مع إمكانية تعديل الأسعار والتوافر فورياً`
                : `Total ${dishes.length} dishes organized into ${categories.length} menu categories with real-time SYP pricing & availability`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleAddDish}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>{isRTL ? 'إضافة وجبة جديدة' : 'Add New Dish'}</span>
          </button>
        </div>
      </div>

      {/* Tier 2: Category Pills Row */}
      <CategoryManager
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onSaveCategory={saveCategory}
        onDeleteCategory={deleteCategory}
        dishesCountByCategory={dishesCountByCategory}
        totalDishesCount={dishes.length}
      />

      {/* Tier 3: Search & Availability Filter (Independent Glass Toolbar) */}
      <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search
              size={19}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRTL
                  ? 'ابحث باسم الوجبة (عربي / إنجليزي) أو الوصف...'
                  : 'Search by dish name (Arabic / English) or description...'
              }
              className="w-full ps-12 pe-11 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title={isRTL ? 'مسح البحث' : 'Clear search'}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Availability Filter Dropdown */}
          <div className="md:col-span-4 relative flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 shadow-inner cursor-pointer"
            >
              <option value="all">{isRTL ? 'جميع الوجبات (المتوفرة وغير المتوفرة)' : 'All Dishes (Available & Unavailable)'}</option>
              <option value="available">{isRTL ? 'الوجبات المتوفرة للطلب فقط' : 'Available Dishes Only'}</option>
              <option value="unavailable">{isRTL ? 'الوجبات غير المتوفرة (المعطلة)' : 'Unavailable Dishes Only'}</option>
            </select>
          </div>
        </div>

        {/* Live Filter Bar & Results Count */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs text-slate-400 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {isRTL
                ? `عرض ${filteredDishes.length} من أصل ${dishes.length} وجبة`
                : `Showing ${filteredDishes.length} of ${dishes.length} dishes`}
            </span>
            {(searchQuery || selectedCategoryId !== 'all' || availabilityFilter !== 'all') && (
              <span className="text-amber-400 font-medium">
                • {isRTL ? 'فلاتر مخصصة مفعلة' : 'Custom filters active'}
              </span>
            )}
          </div>

          {(searchQuery || selectedCategoryId !== 'all' || availabilityFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
                setAvailabilityFilter('all');
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              {isRTL ? 'إلغاء جميع الفلاتر' : 'Reset all filters'}
            </button>
          )}
        </div>
      </div>

      {/* Tier 4: Dishes Cards Grid */}
      {filteredDishes.length === 0 ? (
        <div className="rounded-3xl bg-[#141b29] border border-white/10 p-12 sm:p-16 text-center text-slate-400 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed size={30} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-lg font-bold text-white">
              {isRTL ? 'لم يتم العثور على وجبات' : 'No Dishes Found'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRTL
                ? 'جرّب تعديل معايير البحث أو تصفية التصنيفات أو أضف وجبة جديدة للقائمة.'
                : 'Try adjusting your search query, category filter, or add a new dish.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
                setAvailabilityFilter('all');
              }}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
            >
              {isRTL ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
            <button
              type="button"
              onClick={handleAddDish}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isRTL ? 'إضافة وجبة جديدة' : 'Add New Dish'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredDishes.map((dish) => (
            <MealCardAdmin
              key={dish.id}
              dish={dish}
              categories={categories}
              onEdit={handleEditDish}
              onDelete={handleDeleteDish}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}

      {/* Dish Form Modal */}
      <MealFormModal
        isOpen={isDishModalOpen}
        onClose={() => {
          setIsDishModalOpen(false);
          setEditingDish(null);
        }}
        onSave={saveDish}
        dish={editingDish}
        categories={categories}
      />
    </div>
  );
};

const AdminDashboardContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get('tab') as AdminTab) || 'menu';
  const [activeTab, setActiveTab] = useState<AdminTab>(currentTab);

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {activeTab === 'menu' && <MenuManagementView />}
      {activeTab === 'promotions' && <PromoBannerList />}
      {activeTab === 'operations' && (
        <div className="space-y-8 max-w-5xl">
          <OperatingStatusToggle />
          <BusinessInfoForm />
        </div>
      )}
      {activeTab === 'theme' && <ThemeTokenPicker />}
    </AdminLayout>
  );
};

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLanguageProvider>
      <AdminThemeProvider>
        <AdminMenuProvider>
          <AdminDashboardContent />
        </AdminMenuProvider>
      </AdminThemeProvider>
    </AdminLanguageProvider>
  );
};

export default AdminDashboardPage;
