import React, { useState } from 'react';
import { Search, Plus, UtensilsCrossed, AlertCircle, FolderPlus, X } from 'lucide-react';
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
    totalDishesCount,
    availableDishesCount,
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

  const unavailableDishesCount = Math.max(0, totalDishesCount - availableDishesCount);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? (isAr ? cat.nameAr : cat.nameEn) : undefined;
  };

  const isFiltered = Boolean(searchQuery || selectedCategoryId !== 'all' || statusFilter !== 'all' || tagFilter !== 'all');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    setStatusFilter('all');
    setTagFilter('all');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-16 min-w-0">
      {/* 1. Unified Modern Toolbar Card */}
      <div className="relative bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Accent Strip */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent rounded-t-xl pointer-events-none" />

        {/* Row 1: Category Tabs + Quick Add Category Button */}
        <div className="w-full min-w-0 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0 overflow-x-auto custom-admin-scrollbar py-0.5">
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

          <div className="shrink-0 hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCategoryClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <FolderPlus size={14} className="text-amber-500" />
              <span>{isAr ? 'إضافة تصنيف' : 'Add Category'}</span>
            </button>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-slate-100 dark:border-zinc-800/80" />

        {/* Row 2: Search Input, Status Filters, Tag Badges, and Primary Add Action */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 py-0.5">
          {/* Start / Left Side (RTL Right): Search Bar + Filters */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            {/* Search Bar with Clear Button */}
            <div className="relative flex items-center w-full sm:w-72 md:w-80 shrink-0">
              <Search
                size={15}
                className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                style={{ [isRtl ? 'right' : 'left']: '0.875rem' }}
              />
              <input
                type="text"
                dir={isRtl ? 'rtl' : 'ltr'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'البحث عن وجبة باسمها أو مواصفاتها...' : 'Search dish by name or description...'}
                className="w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors shadow-xs"
                style={{
                  paddingRight: isRtl ? '2.5rem' : '2.25rem',
                  paddingLeft: isRtl ? '2.25rem' : '2.5rem',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  style={{ [isRtl ? 'left' : 'right']: '0.625rem' }}
                  title={isAr ? 'مسح البحث' : 'Clear search'}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Segmented Buttons with Live Counters */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shrink-0 flex-wrap">
              {(['all', 'available', 'unavailable'] as MenuStatusFilter[]).map((st) => {
                const count =
                  st === 'all'
                    ? totalDishesCount
                    : st === 'available'
                    ? availableDishesCount
                    : unavailableDishesCount;
                const isSelected = statusFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-900 text-slate-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>
                      {st === 'all'
                        ? (isAr ? 'الكل' : 'All')
                        : st === 'available'
                        ? (isAr ? 'المتوفر' : 'Available')
                        : (isAr ? 'غير المتوفر' : 'Unavailable')}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-numeric ${
                        isSelected
                          ? st === 'available'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : st === 'unavailable'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Special Tag Badges (Desktop) */}
            <div className="hidden xl:flex items-center gap-1.5 shrink-0 flex-wrap">
              {(['signature', 'spicy', 'bestseller'] as MenuTagFilter[]).map((tg) => {
                const isSelected = tagFilter === tg;
                return (
                  <button
                    key={tg}
                    type="button"
                    onClick={() => setTagFilter(isSelected ? 'all' : tg)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 border-slate-200 dark:border-zinc-800'
                    }`}
                  >
                    {tg === 'signature'
                      ? (isAr ? 'ملكي' : 'Signature')
                      : tg === 'spicy'
                      ? (isAr ? 'حار' : 'Spicy')
                      : (isAr ? 'الأكثر طلباً' : 'Bestseller')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* End / Right Side (RTL Left): Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
            {/* Mobile / Tablet Add Category Button */}
            <button
              type="button"
              onClick={handleAddCategoryClick}
              className="flex md:hidden items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <FolderPlus size={15} className="text-amber-500" />
              <span>{isAr ? 'تصنيف' : 'Category'}</span>
            </button>

            {/* Primary Add New Meal Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openNewMealModal();
              }}
              className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} className="stroke-[3]" />
              <span>{isAr ? 'إضافة وجبة جديدة' : 'Add New Meal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Micro Info Bar: Results count & Reset filters */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400 px-1 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-zinc-300 font-numeric">
            {isAr
              ? `عرض ${filteredDishes.length} من أصل ${totalDishesCount} وجبة`
              : `Showing ${filteredDishes.length} of ${totalDishesCount} dishes`}
          </span>
          {isFiltered && (
            <span className="text-amber-500 font-medium">
              • {isAr ? 'الفلاتر النشطة مفعلة' : 'Filters active'}
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
          >
            {isAr ? 'إعادة ضبط جميع الفلاتر' : 'Reset all filters'}
          </button>
        )}
      </div>

      {/* 3. Dishes Responsive Bento / Cards Grid */}
      {filteredDishes.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
            <UtensilsCrossed size={28} className="stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'لا توجد وجبات تطابق معايير البحث' : 'No dishes matching search criteria'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? 'جرّب تغيير التصنيف المحدد أو مسح نص البحث لإظهار بقية وجبات القائمة.'
                : 'Try clearing your search query or selecting a different category tab.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                {isAr ? 'إلغاء الفلاتر' : 'Reset Filters'}
              </button>
            )}
            <button
              type="button"
              onClick={openNewMealModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm cursor-pointer"
            >
              {isAr ? 'إضافة وجبة جديدة' : 'Add New Meal'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
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

      {/* 4. Add / Edit Meal Modal */}
      <MealFormModal
        isOpen={isMealModalOpen}
        onClose={closeMealModal}
        onSave={handleSaveMeal}
        initialData={editingMeal}
        categories={categories}
        language={language}
      />

      {/* 5. Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={cancelDeleteDish}
        size="sm"
        title={isAr ? 'تأكيد حذف الوجبة' : 'Confirm Dish Deletion'}
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mx-auto flex items-center justify-center">
            <AlertCircle size={26} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'هل أنت متأكد من حذف هذه الوجبة؟' : 'Are you sure you want to delete this dish?'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {isAr
                ? 'سيتم حذف هذا الطبق نهائياً من قائمة الطعام ولن يتمكن الزبائن من طلبه.'
                : 'This dish will be permanently deleted and customers won’t be able to order it.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={cancelDeleteDish}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={executeDeleteDish}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm shadow-rose-600/20 active:scale-95 cursor-pointer"
            >
              {isAr ? 'نعم، احذف الوجبة' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
