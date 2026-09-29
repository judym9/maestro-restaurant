import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Folder } from 'lucide-react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import type { AdminCategoryItem, CategoryFormData } from '../../types/menu.types';

interface CategoryManagerProps {
  categories: AdminCategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onSaveCategory: (data: CategoryFormData, id?: string) => Promise<any>;
  onDeleteCategory: (id: string) => Promise<any>;
  dishesCountByCategory: Record<string, number>;
  totalDishesCount: number;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onSaveCategory,
  onDeleteCategory,
  dishesCountByCategory,
  totalDishesCount,
}) => {
  const { isRTL } = useAdminLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AdminCategoryItem | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    nameAr: '',
    nameEn: '',
    slug: '',
    sortOrder: categories.length + 1,
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({
      nameAr: '',
      nameEn: '',
      slug: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AdminCategoryItem) => {
    setEditingCat(cat);
    setFormData({
      nameAr: cat.nameAr,
      nameEn: cat.nameEn,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) return;

    await onSaveCategory(formData, editingCat?.id);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="rounded-3xl bg-[#0f172a]/90 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {isRTL ? 'تصنيفات القائمة الرئيسية' : 'Menu Taxonomy'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold border border-white/5">
              {categories.filter((c) => c.isActive).length} {isRTL ? 'تصنيف نشط' : 'active'}
            </span>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <Plus size={14} />
            <span>{isRTL ? 'تصنيف جديد' : 'New Category'}</span>
          </button>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedCategoryId === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/10'
            }`}
          >
            <span>{isRTL ? 'جميع الأصناف' : 'All Dishes'}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                selectedCategoryId === 'all'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {totalDishesCount}
            </span>
          </button>

          {categories.map((cat) => {
            const count = dishesCountByCategory[cat.id] || 0;
            const isSelected = selectedCategoryId === cat.id;

            return (
              <div key={cat.id} className="relative group shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{isRTL ? cat.nameAr : cat.nameEn}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  title={isRTL ? 'تعديل التصنيف' : 'Edit category'}
                  className="ms-1.5 p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Folder size={18} />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingCat
                    ? isRTL
                      ? 'تعديل بيانات التصنيف'
                      : 'Edit Category'
                    : isRTL
                    ? 'إضافة تصنيف جديد'
                    : 'New Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'اسم التصنيف (بالعربية) *' : 'Category Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: بروستد ومقرمش"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'اسم التصنيف (بالإنجليزية)' : 'Category Name (English)'}
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Broasted & Crispy"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {isRTL ? 'المعرّف المختصر (Slug)' : 'URL Slug'}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. broasted"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {editingCat && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(isRTL ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Delete this category?')) {
                        await onDeleteCategory(editingCat.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 size={14} />
                    <span>{isRTL ? 'حذف' : 'Delete'}</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ms-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>{isRTL ? 'حفظ' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
