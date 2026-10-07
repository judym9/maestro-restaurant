import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  XCircle,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  Tag,
  SlidersHorizontal,
  Flame,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminToast } from '../context/AdminToastContext';
import { MealCard } from '../components/menu/MealCard';
import { AdminMenuTable } from '../components/menu/AdminMenuTable';
import { MealFormModal } from '../components/menu/MealFormModal';
import { CategoryFormModal } from '../components/menu/CategoryFormModal';
import { CategoryNavTabs } from '../components/menu/CategoryNavTabs';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { MetricCard } from '../components/common/MetricCard';
import { menuRepository } from '../services/menuRepository';
import type {
  AdminMealItem,
  CategoryItem,
  MealFormData,
  CategoryFormData,
} from '../types/menu.types';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'prep-time' | 'name';
type FilterChipOption = 'all' | 'available' | 'unavailable' | 'bestseller' | 'discounted' | 'signature' | 'spicy';
type ViewMode = 'table' | 'grid';

export const AdminMenuPage: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const { showToast } = useAdminToast();

  const {
    categories,
    dishes,
    saveDish,
    deleteDish,
    toggleDishAvailability,
    saveCategory,
    deleteCategory,
  } = useAdminData();

  // Search & Filter State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterChip, setFilterChip] = useState<FilterChipOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Modals State
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<AdminMealItem | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'dish' | 'category';
    id: string;
    titleAr: string;
    titleEn: string;
  } | null>(null);

  // Category map for fast lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => {
      map.set(cat.id, language === 'ar' ? cat.nameAr : cat.nameEn);
    });
    return map;
  }, [categories, language]);

  // Telemetry Counts
  const totalDishesCount = dishes.length;
  const availableDishesCount = dishes.filter((d) => d.isAvailable).length;
  const unavailableDishesCount = totalDishesCount - availableDishesCount;
  const categoriesCount = categories.length;

  // Filtered & Sorted Dishes Pipeline
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // 1. Filter by category
    if (selectedCategoryId !== 'all') {
      result = result.filter((d) => d.categoryId === selectedCategoryId);
    }

    // 2. Filter by search query (Arabic / English name, description, ingredients)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((d) => {
        const nameAr = (d.nameAr || '').toLowerCase();
        const nameEn = (d.nameEn || '').toLowerCase();
        const descAr = (d.descriptionAr || '').toLowerCase();
        const descEn = (d.descriptionEn || '').toLowerCase();
        const ingAr = (d.ingredientsAr || []).join(' ').toLowerCase();
        const ingEn = (d.ingredientsEn || []).join(' ').toLowerCase();
        return (
          nameAr.includes(q) ||
          nameEn.includes(q) ||
          descAr.includes(q) ||
          descEn.includes(q) ||
          ingAr.includes(q) ||
          ingEn.includes(q)
        );
      });
    }

    // 3. Multi-stage Filter Chips
    if (filterChip === 'available') {
      result = result.filter((d) => d.isAvailable);
    } else if (filterChip === 'unavailable') {
      result = result.filter((d) => !d.isAvailable);
    } else if (filterChip === 'bestseller') {
      result = result.filter((d) => d.isBestseller);
    } else if (filterChip === 'discounted') {
      result = result.filter((d) => Boolean(d.originalPrice && d.originalPrice > d.price));
    } else if (filterChip === 'signature') {
      result = result.filter((d) => d.isSignature);
    } else if (filterChip === 'spicy') {
      result = result.filter((d) => d.isSpicy);
    }

    // 4. Sorting Pipeline
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'prep-time') {
      result.sort((a, b) => (a.prepTimeMinutes || 15) - (b.prepTimeMinutes || 15));
    } else if (sortBy === 'name') {
      result.sort((a, b) =>
        language === 'ar' ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn)
      );
    }

    return result;
  }, [dishes, selectedCategoryId, searchQuery, filterChip, sortBy, language]);

  // Meal Handlers
  const handleOpenNewMeal = () => {
    setEditingMeal(null);
    setIsMealModalOpen(true);
  };

  const handleEditMeal = (meal: AdminMealItem) => {
    setEditingMeal(meal);
    setIsMealModalOpen(true);
  };

  const handleDuplicateMeal = async (meal: AdminMealItem) => {
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
      isSignature: meal.isSignature,
      isBestseller: meal.isBestseller,
      isSpicy: meal.isSpicy,
      isNew: true,
      isVegetarian: meal.isVegetarian,
      isGlutenFree: meal.isGlutenFree,
      isAvailable: meal.isAvailable,
      ingredientsArText: meal.ingredientsAr?.join(', ') || '',
      ingredientsEnText: meal.ingredientsEn?.join(', ') || '',
      options: [...meal.options],
    };

    try {
      await saveDish(duplicated);
      showToast(
        'success',
        language === 'ar'
          ? `تم تكرار وجبة "${meal.nameAr}" بنجاح`
          : `Duplicated "${meal.nameEn}" successfully`
      );
    } catch {
      showToast('error', language === 'ar' ? 'تعذر تكرار الوجبة' : 'Failed to duplicate dish');
    }
  };

  const handleSaveMeal = async (formData: MealFormData) => {
    try {
      await saveDish(formData);
      setIsMealModalOpen(false);
      setEditingMeal(null);
      showToast(
        'success',
        editingMeal
          ? language === 'ar'
            ? 'تم حفظ تعديلات الوجبة بنجاح'
            : 'Dish updated successfully'
          : language === 'ar'
          ? 'تمت إضافة الوجبة الجديدة إلى القائمة بنجاح'
          : 'New dish added to catalog successfully'
      );
    } catch {
      showToast('error', language === 'ar' ? 'حدث خطأ أثناء حفظ الوجبة' : 'Failed to save dish');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    const target = dishes.find((d) => d.id === id);
    if (!target) return;
    const newStatus = !target.isAvailable;
    await toggleDishAvailability(id, newStatus);
    showToast(
      'info',
      newStatus
        ? language === 'ar'
          ? `تمت إتاحة وجبة "${target.nameAr}" للطلب الفوري`
          : `Marked "${target.nameEn}" in stock`
        : language === 'ar'
        ? `تم إيقاف وجبة "${target.nameAr}" مؤقتاً`
        : `Marked "${target.nameEn}" out of stock`
    );
  };

  const handlePromptDeleteDish = (id: string) => {
    const dish = dishes.find((d) => d.id === id);
    if (!dish) return;
    setDeleteConfirm({
      type: 'dish',
      id,
      titleAr: dish.nameAr,
      titleEn: dish.nameEn,
    });
  };

  // Category Handlers
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (formData: CategoryFormData) => {
    try {
      await saveCategory(formData);
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      showToast(
        'success',
        editingCategory
          ? language === 'ar'
            ? 'تم تعديل بيانات الفئة بنجاح'
            : 'Category updated successfully'
          : language === 'ar'
          ? 'تمت إضافة الفئة الجديدة بنجاح'
          : 'New category created successfully'
      );
    } catch {
      showToast('error', language === 'ar' ? 'تعذر حفظ الفئة' : 'Failed to save category');
    }
  };

  const handlePromptDeleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setDeleteConfirm({
      type: 'category',
      id,
      titleAr: cat.nameAr,
      titleEn: cat.nameEn,
    });
  };

  const handleReorderCategories = (orderedIds: string[]) => {
    menuRepository.reorderCategories(orderedIds);
    showToast('info', language === 'ar' ? 'تم تحديث ترتيب الفئات' : 'Category order updated');
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === 'dish') {
        await deleteDish(deleteConfirm.id);
        showToast(
          'success',
          language === 'ar' ? 'تم حذف الوجبة من القائمة بنجاح' : 'Dish deleted successfully'
        );
      } else {
        await deleteCategory(deleteConfirm.id);
        showToast(
          'success',
          language === 'ar' ? 'تم حذف الفئة بنجاح' : 'Category deleted successfully'
        );
      }
    } catch {
      showToast('error', language === 'ar' ? 'تعذر إتمام عملية الحذف' : 'Deletion failed');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ========================================================
          1. HEADER & PRIMARY ACTION BUTTONS
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="text-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
            <span className="text-xs font-bold text-[var(--accent-gold)] tracking-wider uppercase">
              {language === 'ar' ? 'كتالوج المأكولات الملكية' : 'Royal Culinary Catalog'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1 font-['Cairo',sans-serif]">
            {language === 'ar' ? 'إدارة قائمة الطعام والوجبات' : 'Menu & Food Catalog Management'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            {language === 'ar'
              ? 'تحكم كامل بالأصناف، الأسعار، التوافر، الفئات، والتخصيصات الإضافية'
              : 'Full autonomous control over dishes, categories, portions, prices & availability'}
          </p>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleOpenNewCategory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 transition-all cursor-pointer min-h-[44px]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>{language === 'ar' ? 'إدارة التصنيفات' : 'Manage Categories'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewMeal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-lg shadow-amber-900/25 transition-all cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'ar' ? 'إضافة وجبة جديدة' : 'Add New Dish'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. TELEMETRY KPI METRICS CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <MetricCard
          title={language === 'ar' ? 'إجمالي الوجبات المسجلة' : 'Total Catalog Meals'}
          value={totalDishesCount}
          subtitle={language === 'ar' ? 'جميع أصناف القائمة' : 'Across all sections'}
          icon={UtensilsCrossed}
          accentColor="gold"
        />

        <MetricCard
          title={language === 'ar' ? 'الوجبات المتاحة حالياً' : 'Dishes In Stock'}
          value={availableDishesCount}
          subtitle={
            language === 'ar'
              ? `${unavailableDishesCount} صنف غير متوفر حالياً`
              : `${unavailableDishesCount} currently out of stock`
          }
          icon={CheckCircle2}
          accentColor="emerald"
        />

        <MetricCard
          title={language === 'ar' ? 'فئات الطعام النشطة' : 'Active Food Categories'}
          value={categoriesCount}
          subtitle={language === 'ar' ? 'تصنيفات للطلب الفوري' : 'Organized food sections'}
          icon={Sparkles}
          accentColor="blue"
        />

        <MetricCard
          title={language === 'ar' ? 'الوجبات المعطلة' : 'Out of Stock Items'}
          value={unavailableDishesCount}
          subtitle={language === 'ar' ? 'أصناف متوقفة مؤقتاً' : 'Temporarily paused items'}
          icon={XCircle}
          accentColor="crimson"
        />
      </div>

      {/* ========================================================
          3. CATEGORY TABS & REORDERING BAR
          ======================================================== */}
      <div className="p-4 sm:p-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] w-full">
        <CategoryNavTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onAddCategory={handleOpenNewCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handlePromptDeleteCategory}
          onReorder={handleReorderCategories}
          totalDishesCount={totalDishesCount}
        />
      </div>

      {/* ========================================================
          4. SEARCH, MULTI-STAGE FILTERS, SORTING & VIEW TOGGLE
          ======================================================== */}
      <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] w-full">
        {/* Row 1: Search Input & Sort Dropdown & View Mode Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
          {/* Instant Search Bar */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'ابحث بالاسم، المكونات، أو الوصف الشامي...'
                  : 'Search by dish name, ingredients, or description...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Right Controls: Sort Dropdown + View Toggle Switch */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-[var(--text-primary)] text-xs outline-none cursor-pointer pe-2 font-medium"
              >
                <option value="default">{language === 'ar' ? 'الترتيب الافتراضي' : 'Default Order'}</option>
                <option value="price-asc">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                <option value="prep-time">{language === 'ar' ? 'وقت التحضير: الأسرع' : 'Prep Time: Fastest'}</option>
                <option value="name">{language === 'ar' ? 'الاسم أبجدياً' : 'Name: Alphabetical'}</option>
              </select>
            </div>

            {/* View Mode Toggle (Table / Grid) */}
            <div className="hidden sm:flex items-center p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] gap-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[var(--accent-gold)] text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={language === 'ar' ? 'عرض الجدول المتقدم' : 'Table view'}
              >
                <LayoutList className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[var(--accent-gold)] text-black font-bold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={language === 'ar' ? 'عرض البطاقات المرئية' : 'Grid cards view'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setFilterChip('all')}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'all'
                ? 'bg-[var(--accent-gold)] text-black font-bold shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {language === 'ar' ? `الكل (${totalDishesCount})` : `All (${totalDishesCount})`}
          </button>

          <button
            type="button"
            onClick={() => setFilterChip('available')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'available'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? `متوفر (${availableDishesCount})` : `In Stock (${availableDishesCount})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterChip('unavailable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'unavailable'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-rose-400'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'ar' ? `غير متوفر (${unavailableDishesCount})` : `Out of Stock (${unavailableDishesCount})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterChip('bestseller')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'bestseller'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-amber-400'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'الأكثر طلباً' : 'Bestsellers'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterChip('discounted')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'discounted'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-rose-400'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'ar' ? 'عروض وتخفيضات' : 'Discounted Offers'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterChip('signature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'signature'
                ? 'bg-amber-500/20 text-[var(--accent-gold)] border border-[var(--accent-gold)] font-bold'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>{language === 'ar' ? 'توقيع الشيف' : "Chef's Special"}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterChip('spicy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
              filterChip === 'spicy'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-orange-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'ar' ? 'حار سبايسي' : 'Spicy'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          5. DISHES DISPLAY: TABLE VIEW OR CARD GRID
          ======================================================== */}
      {filteredDishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] w-full">
          <UtensilsCrossed className="w-12 h-12 text-[var(--text-muted)] mb-3" />
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
            {language === 'ar' ? 'لم يتم العثور على وجبات تطابق البحث أو الفلاتر' : 'No matching dishes found'}
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4">
            {language === 'ar'
              ? 'جرب ضبط معايير البحث، مسح الفلاتر، أو اختيار فئة طعام أخرى.'
              : 'Try adjusting your search query or reset filter chips.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterChip('all');
                setSelectedCategoryId('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-all cursor-pointer"
            >
              {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
            <button
              type="button"
              onClick={handleOpenNewMeal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-black hover:bg-[var(--gold-600)] transition-all cursor-pointer"
            >
              {language === 'ar' ? 'إضافة وجبة جديدة' : 'Add New Dish'}
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Desktop Table View */
        <div className="w-full">
          <AdminMenuTable
            dishes={filteredDishes}
            categoryMap={categoryMap}
            onEdit={handleEditMeal}
            onDuplicate={handleDuplicateMeal}
            onDelete={handlePromptDeleteDish}
            onToggleAvailability={handleToggleAvailability}
          />
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {filteredDishes.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              categoryName={categoryMap.get(meal.categoryId)}
              onEdit={handleEditMeal}
              onDuplicate={handleDuplicateMeal}
              onDelete={handlePromptDeleteDish}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}

      {/* ========================================================
          6. MODALS & DRAWERS (MEAL FORM, CATEGORY FORM, DELETE CONFIRM)
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

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        editingCategory={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
      />

      {/* Action Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        titleAr={deleteConfirm?.type === 'dish' ? 'تأكيد حذف الوجبة' : 'تأكيد حذف الفئة'}
        titleEn={deleteConfirm?.type === 'dish' ? 'Confirm Dish Deletion' : 'Confirm Category Deletion'}
        messageAr={
          deleteConfirm?.type === 'dish'
            ? `هل أنت متأكد من رغبتك في حذف وجبة "${deleteConfirm?.titleAr}" نهائياً من قائمة الطعام؟`
            : `هل أنت متأكد من رغبتك في حذف فئة "${deleteConfirm?.titleAr}" وجميع ارتباطاتها؟`
        }
        messageEn={
          deleteConfirm?.type === 'dish'
            ? `Are you sure you want to permanently delete "${deleteConfirm?.titleEn}" from the catalog?`
            : `Are you sure you want to permanently delete category "${deleteConfirm?.titleEn}"?`
        }
        confirmLabelAr="حذف نهائي"
        confirmLabelEn="Delete Permanently"
        cancelLabelAr="إلغاء"
        cancelLabelEn="Cancel"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm(null)}
        isDestructive
      />
    </div>
  );
};

export default AdminMenuPage;
