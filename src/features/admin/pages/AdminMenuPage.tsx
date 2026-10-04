import React, { useState } from 'react';
import { Search, Plus, UtensilsCrossed, AlertCircle, FolderPlus } from 'lucide-react';
import { useAdminMenu } from '../hooks/useAdminMenu';
import { CategoryTabs } from '../components/menu/CategoryTabs';
import { AdminMealCard } from '../components/menu/AdminMealCard';
import { MealFormModal } from '../components/menu/MealFormModal';
import { Modal } from '../components/common/Modal';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import type { MenuStatusFilter, MenuTagFilter } from '../types/menu.types';

export const AdminMenuPage: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const handleAddCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddCategoryOpen(true);

    setTimeout(() => {
      const categorySection = document.getElementById("add-category-section");
      if (categorySection) {
        categorySection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 50);
  };

  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    filteredDishes,
    editingMeal,
    isMealModalOpen,
    deleteConfirmId,
    openNewMealModal,
    handleQuickEdit,
    closeMealModal,
    handleSaveMeal,
    handleSaveCategory,
    deleteCategory,
    confirmDeleteDish,
    executeDeleteDish,
    cancelDeleteDish,
    toggleDishAvailability,
  } = useAdminMenu();

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? (isAr ? cat.nameAr : cat.nameEn) : undefined;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-16 min-w-0">
      {/* Unified Toolbar Card: Upper Category Row & Lower Search/Filter/Actions Row */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 rounded-3xl bg-card border border-border shadow-xl flex flex-col gap-y-4">
        {/* Upper Row: Horizontal Scrollable Category Tabs */}
        <div className="w-full min-w-0 overflow-x-auto custom-admin-scrollbar py-0.5">
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={deleteCategory}
            language={language}
            isAddModalOpen={isAddCategoryOpen}
            onCloseAddModal={() => setIsAddCategoryOpen(false)}
            hideAddButton={true}
          />
        </div>

        {/* Comfortable Vertical Divider & Spacing between Category row and Search/Filter row */}
        <div className="w-full h-px bg-border" />

        {/* Lower Row: Search Input, Standalone Status Filters, and Action Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 py-1">
          {/* Start / Right Side (in RTL): Search Bar + Filter Groups */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
            {/* Search Bar: Independent width with guaranteed comfortable RTL padding */}
            <div className="relative flex items-center w-full sm:w-72 md:w-80 shrink-0">
              <Search
                size={16}
                className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                style={{ [isRtl ? 'right' : 'left']: '0.875rem' }}
              />
              <input
                type="text"
                dir={isRtl ? 'rtl' : 'ltr'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'البحث عن وجبة باسمها أو مواصفاتها...' : 'Search dish by name or description...'}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl pr-10 pl-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-xs"
                style={{
                  paddingRight: isRtl ? '2.75rem' : '1rem',
                  paddingLeft: isRtl ? '1rem' : '2.75rem',
                }}
              />
            </div>

            {/* Standalone Status Filter Pills (الكل، المتوفر، غير المتوفر) with gap-2.5 */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {(['all', 'available', 'unavailable'] as MenuStatusFilter[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 font-semibold'
                  }`}
                >
                  {st === 'all'
                    ? (isAr ? 'الكل' : 'All')
                    : st === 'available'
                    ? (isAr ? 'المتوفر' : 'Available')
                    : (isAr ? 'غير المتوفر' : 'Unavailable')}
                </button>
              ))}
            </div>

            {/* Tag Badges without the empty white button */}
            <div className="hidden xl:flex items-center gap-2 shrink-0 flex-wrap">
              {(['signature', 'spicy', 'bestseller'] as MenuTagFilter[]).map((tg) => (
                <button
                  key={tg}
                  type="button"
                  onClick={() => setTagFilter(tagFilter === tg ? 'all' : tg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    tagFilter === tg
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 font-medium'
                  }`}
                >
                  {tg === 'signature'
                    ? (isAr ? 'ملكي' : 'Signature')
                    : tg === 'spicy'
                    ? (isAr ? 'حار' : 'Spicy')
                    : (isAr ? 'الأكثر طلباً' : 'Bestseller')}
                </button>
              ))}
            </div>
          </div>

          {/* End / Left Side (in RTL): Action Buttons with independent space and no clipping */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            {/* + إضافة تصنيف */}
            <button
              type="button"
              onClick={handleAddCategoryClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <FolderPlus size={16} className="text-amber-500" />
              <span>{isAr ? 'إضافة تصنيف' : 'Add Category'}</span>
            </button>

            {/* + وجبة جديدة */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openNewMealModal();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={18} />
              <span>{isAr ? 'وجبة جديدة' : 'New Dish'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Dishes Responsive Grid */}
      {filteredDishes.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-card border border-border shadow-xl space-y-4">
          <UtensilsCrossed size={48} className="mx-auto text-muted-foreground stroke-[1.5]" />
          <h4 className="text-lg font-bold text-foreground">
            {isAr ? 'لا توجد وجبات تطابق معايير البحث' : 'No dishes matching search criteria'}
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {isAr
              ? 'جرّب تغيير التصنيف المحدد أو إزالة مرشح البحث لإظهار وجبات أخرى.'
              : 'Try clearing your search query or selecting a different category tab.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((meal) => (
            <AdminMealCard
              key={meal.id}
              meal={meal}
              categoryName={getCategoryName(meal.categoryId)}
              onEdit={handleQuickEdit}
              onDelete={confirmDeleteDish}
              onToggleAvailability={toggleDishAvailability}
              language={language}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Meal Modal */}
      <MealFormModal
        isOpen={isMealModalOpen}
        onClose={closeMealModal}
        onSave={handleSaveMeal}
        initialData={editingMeal}
        categories={categories}
        language={language}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={cancelDeleteDish}
        size="sm"
        title={isAr ? 'تأكيد حذف الوجبة' : 'Confirm Dish Deletion'}
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {isAr
              ? 'هل أنت متأكد من رغبتك في حذف هذا الطبق نهائياً من قائمة الطعام؟'
              : 'Are you sure you want to permanently delete this dish from the menu?'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={cancelDeleteDish}
              className="px-5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={executeDeleteDish}
              className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/20"
            >
              {isAr ? 'نعم، احذف الوجبة' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
