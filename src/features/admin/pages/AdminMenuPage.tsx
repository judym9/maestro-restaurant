import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Layers,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useAdminMenu } from '../hooks/useAdminMenu';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminToast } from '../context/AdminToastContext';
import { MetricCard } from '../components/common/MetricCard';
import { SearchInput } from '../components/common/SearchInput';
import { EmptyState } from '../components/common/EmptyState';
import { CategoryNavTabs } from '../components/menu/CategoryNavTabs';
import { MealCard } from '../components/menu/MealCard';
import { AdminMenuTable } from '../components/menu/AdminMenuTable';
import { MealFormModal } from '../components/menu/MealFormModal';
import { CategoryFormModal } from '../components/menu/CategoryFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import type { AdminMealItem, MealFormData, CategoryItem, CategoryFormData } from '../types/menu.types';

type ViewMode = 'grid' | 'table';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'prep-asc';
type FilterChip = 'all' | 'available' | 'unavailable' | 'signature' | 'bestseller' | 'spicy' | 'vegetarian' | 'new';

export const AdminMenuPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const { toggleDishAvailability } = useAdminData();
  const {
    categories,
    dishes,
    saveDish,
    deleteDish,
    saveCategory,
    deleteCategory,
  } = useAdminMenu();

  // Filters and View State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [activeFilterChip, setActiveFilterChip] = useState<FilterChip>('all');

  // Modals State
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<AdminMealItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Confirm delete state
  const [deleteMealId, setDeleteMealId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // Compute Telemetry Metrics
  const totalDishes = dishes.length;
  const availableCount = dishes.filter((d) => d.isAvailable !== false).length;
  const unavailableCount = totalDishes - availableCount;
  const activeCategoriesCount = categories.filter((c) => c.isActive !== false).length;

  // Filter and Sort Pipeline
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // 1. Filter by category
    if (selectedCategoryId) {
      result = result.filter((d) => d.categoryId === selectedCategoryId);
    }

    // 2. Filter by search query (Arabic, English, description, ingredients)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.nameAr.toLowerCase().includes(q) ||
          d.nameEn.toLowerCase().includes(q) ||
          (d.descriptionAr && d.descriptionAr.toLowerCase().includes(q)) ||
          (d.ingredientsAr && d.ingredientsAr.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // 3. Filter by dietary & status chip
    if (activeFilterChip === 'available') {
      result = result.filter((d) => d.isAvailable !== false);
    } else if (activeFilterChip === 'unavailable') {
      result = result.filter((d) => d.isAvailable === false);
    } else if (activeFilterChip === 'signature') {
      result = result.filter((d) => d.isSignature);
    } else if (activeFilterChip === 'bestseller') {
      result = result.filter((d) => d.isBestseller);
    } else if (activeFilterChip === 'spicy') {
      result = result.filter((d) => d.isSpicy);
    } else if (activeFilterChip === 'vegetarian') {
      result = result.filter((d) => d.isVegetarian);
    } else if (activeFilterChip === 'new') {
      result = result.filter((d) => d.isNew);
    }

    // 4. Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
    } else if (sortBy === 'prep-asc') {
      result.sort((a, b) => (a.prepTimeMinutes || 15) - (b.prepTimeMinutes || 15));
    }

    return result;
  }, [dishes, selectedCategoryId, searchQuery, activeFilterChip, sortBy]);

  // Handlers for Meals
  const handleOpenNewMeal = () => {
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
      data.id ? 'تم حفظ تعديلات الوجبة بنجاح' : 'تمت إضافة الوجبة الجديدة بنجاح'
    );
  };

  const handleConfirmDeleteMeal = () => {
    if (deleteMealId) {
      deleteDish(deleteMealId);
      setDeleteMealId(null);
      showToast('info', 'تم حذف الوجبة بنجاح');
    }
  };

  // Handlers for Categories
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (data: CategoryFormData) => {
    saveCategory(data);
    setIsCategoryModalOpen(false);
    showToast(
      'success',
      data.id ? 'تم تعديل التصنيف بنجاح' : 'تمت إضافة التصنيف الجديد بنجاح'
    );
  };

  const handleConfirmDeleteCategory = () => {
    if (deleteCategoryId) {
      deleteCategory(deleteCategoryId);
      if (selectedCategoryId === deleteCategoryId) {
        setSelectedCategoryId(null);
      }
      setDeleteCategoryId(null);
      showToast('info', 'تم حذف التصنيف بنجاح');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-amber-500" />
            <span>إدارة قائمة المأكولات والتصنيفات</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            إضافة وتعديل الوجبات الملكية، تصنيف الأطباق، ومتابعة توفرها لحظياً
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenNewCategory}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>إدارة التصنيفات</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewMeal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة وجبة جديدة</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          title="إجمالي الوجبات"
          value={totalDishes}
          subtitle="مسجلة في قاعدة البيانات"
          icon={UtensilsCrossed}
          badge={{ text: 'شامل', variant: 'gold' }}
        />

        <MetricCard
          title="الوجبات المتوفرة"
          value={availableCount}
          subtitle="متاحة للطلب الفوري في المتجر"
          icon={CheckCircle2}
          badge={{ text: 'متاحة', variant: 'success' }}
        />

        <MetricCard
          title="أقسام وتصنيفات الطعام"
          value={activeCategoriesCount}
          subtitle="أقسام مفهرسة بالقائمة"
          icon={Layers}
          badge={{ text: 'نشطة', variant: 'info' }}
        />

        <MetricCard
          title="أصناف معطلة مؤقتاً"
          value={unavailableCount}
          subtitle="غير متوفرة حالياً للزبائن"
          icon={XCircle}
          badge={{ text: 'معطلة', variant: 'danger' }}
        />
      </div>

      {/* Category Tabs */}
      <div className="pt-2">
        <CategoryNavTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onAddCategory={handleOpenNewCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={(id) => setDeleteCategoryId(id)}
          totalDishesCount={totalDishes}
        />
      </div>

      {/* Search, Filter Chips, Sort & View Controls */}
      <div className="px-5 sm:px-6 py-5 sm:py-5.5 rounded-2xl bg-[#0b101b] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Live Search */}
          <div className="w-full md:w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="ابحث بالاسم، الوصف، أو المكونات..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="name-asc">الاسم أبجدياً (أ - ي)</option>
                <option value="prep-asc">مدة التحضير الأسرع</option>
              </select>
            </div>

            {/* View Mode Switcher (Grid vs Table) */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="عرض بطاقات شبكية"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="عرض جدول تفصيلي"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 me-1" />
          {[
            { id: 'all', label: 'الكل' },
            { id: 'available', label: 'المتوفرة للطلب' },
            { id: 'unavailable', label: 'غير المتوفرة' },
            { id: 'signature', label: 'توقيع الشيف' },
            { id: 'bestseller', label: 'الأكثر طلباً' },
            { id: 'spicy', label: 'أصناف حارة' },
            { id: 'vegetarian', label: 'نباتي' },
            { id: 'new', label: 'أصناف جديدة' },
          ].map((chip) => {
            const isActive = activeFilterChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilterChip(chip.id as FilterChip)}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dishes View Canvas */}
      {filteredDishes.length === 0 ? (
        <EmptyState
          title="لم يتم العثور على وجبات مطابقة"
          description={
            searchQuery
              ? `لا توجد نتائج تطابق كلمة البحث "${searchQuery}". جرب البحث بكلمات أخرى أو أزل الفلاتر.`
              : 'لا توجد وجبات مسجلة في هذا التصنيف حالياً. يمكنك البدء بإضافة أول وجبة.'
          }
          actionText="إضافة وجبة جديدة"
          onAction={handleOpenNewMeal}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredDishes.map((dish) => {
            const cat = categories.find((c) => c.id === dish.categoryId);

            return (
              <MealCard
                key={dish.id}
                meal={dish}
                category={cat}
                onEdit={handleEditMeal}
                onDuplicate={handleDuplicateMeal}
                onDelete={(id) => setDeleteMealId(id)}
                onToggleAvailability={(id) => {
                  toggleDishAvailability(id);
                  showToast('info', 'تم تحديث حالة توفر الوجبة');
                }}
              />
            );
          })}
        </div>
      ) : (
        <AdminMenuTable
          dishes={filteredDishes}
          categories={categories}
          onEdit={handleEditMeal}
          onDuplicate={handleDuplicateMeal}
          onDelete={(id) => setDeleteMealId(id)}
          onToggleAvailability={(id) => {
            toggleDishAvailability(id);
            showToast('info', 'تم تحديث حالة توفر الوجبة');
          }}
        />
      )}

      {/* Meal Form Modal */}
      <MealFormModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        onSave={handleSaveMeal}
        meal={editingMeal}
        categories={categories}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      {/* Delete Meal Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteMealId)}
        onClose={() => setDeleteMealId(null)}
        onConfirm={handleConfirmDeleteMeal}
        title="حذف الوجبة من القائمة"
        message="هل أنت متأكد من حذف هذه الوجبة نهائياً؟ سيتم إزالتها من قاعدة البيانات وقائمة المتجر."
        confirmText="تأكيد الحذف"
        variant="danger"
      />

      {/* Delete Category Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCategoryId)}
        onClose={() => setDeleteCategoryId(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="حذف التصنيف"
        message="هل أنت متأكد من حذف هذا التصنيف؟ الوجبات التابعة له ستبقى محفوظة وستتحول إلى غير مصنفة."
        confirmText="تأكيد حذف التصنيف"
        variant="danger"
      />
    </div>
  );
};

export default AdminMenuPage;
