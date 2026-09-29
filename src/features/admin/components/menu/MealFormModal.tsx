import React, { useState, useEffect } from 'react';
import { X, Check, UtensilsCrossed } from 'lucide-react';
import { MealAssets } from '../../../../utils/imageRegistry';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import type { AdminDishItem, AdminCategoryItem, DishFormData } from '../../types/menu.types';

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DishFormData, id?: string) => Promise<any>;
  dish?: AdminDishItem | null;
  categories: AdminCategoryItem[];
}

const AVAILABLE_IMAGES = [
  { key: 'shawarma-tower', label: 'برج الشاورما الملكي' },
  { key: 'shawarma-cake', label: 'تورتة الشاورما' },
  { key: 'shawarma-platters', label: 'سرفيس شاورما عربي' },
  { key: 'shawarma-spit', label: 'سيخ شاورما مايسترو' },
  { key: 'crispy-meal', label: 'وجبة كريسبي ستريبس' },
  { key: 'broasted-pieces', label: 'بروستد مايسترو الذهبي' },
  { key: 'broasted-chips', label: 'بطاطا ومقرمشات' },
  { key: 'supreme-meal', label: 'سوبريم دجاج فاخر' },
  { key: 'fajita-sub', label: 'ساندوتش فاهيتا سوبريم' },
  { key: 'crispy-baguettes', label: 'باغيت كريسبي مقرمش' },
  { key: 'princess-meal', label: 'وجبة البرنسيسة' },
];

export const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dish,
  categories,
}) => {
  const { isRTL } = useAdminLanguage();

  const [formData, setFormData] = useState<DishFormData>({
    categoryId: categories[0]?.id || 'cat-shawarma',
    imageKey: 'shawarma-tower',
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: 35000,
    originalPrice: undefined,
    badge: '',
    isAvailable: true,
    preparationTime: '15-20 دقيقة',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (dish) {
      setFormData({
        categoryId: dish.categoryId,
        imageKey: dish.imageKey,
        nameAr: dish.nameAr,
        nameEn: dish.nameEn,
        descriptionAr: dish.descriptionAr,
        descriptionEn: dish.descriptionEn,
        price: dish.price,
        originalPrice: dish.originalPrice,
        badge: dish.badge || '',
        isAvailable: dish.isAvailable,
        preparationTime: dish.preparationTime || '15-20 دقيقة',
      });
    } else {
      setFormData({
        categoryId: categories[0]?.id || 'cat-shawarma',
        imageKey: 'shawarma-tower',
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        price: 35000,
        originalPrice: undefined,
        badge: '',
        isAvailable: true,
        preparationTime: '15-20 دقيقة',
      });
    }
  }, [dish, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData, dish?.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {dish
                  ? isRTL
                    ? 'تعديل بيانات الوجبة'
                    : 'Edit Dish Details'
                  : isRTL
                  ? 'إضافة وجبة جديدة للمنيو'
                  : 'Add New Menu Dish'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL
                  ? 'الأسعار تُعرض بالليرة السورية لفرع النبك'
                  : 'Pricing in Syrian Lira (SYP) for Al-Nabek branch'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Dish Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'اسم الوجبة (بالعربية) *' : 'Dish Name (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: شاورما عربي دبل"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'اسم الوجبة (بالإنجليزية)' : 'Dish Name (English)'}
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="e.g. Double Arabi Shawarma"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pricing & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'السعر بالليرة السورية *' : 'Price in SYP *'}
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'السعر قبل الخصم (اختياري)' : 'Original Price (Optional)'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.originalPrice || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="للخصومات فقط"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'التصنيف *' : 'Category *'}
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isRTL ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Badge & Preparation Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'شارة التميز (Badge)' : 'Badge Ribbon'}
              </label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="">{isRTL ? 'بدون شارة' : 'None'}</option>
                <option value="Signature">{isRTL ? 'توقيع مايسترو (Signature)' : 'Signature'}</option>
                <option value="Best Seller">{isRTL ? 'الأكثر طلباً (Best Seller)' : 'Best Seller'}</option>
                <option value="Spicy">{isRTL ? 'حار (Spicy)' : 'Spicy'}</option>
                <option value="New">{isRTL ? 'جديد (New)' : 'New'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'مدة التحضير المتوقعة' : 'Prep Time'}
              </label>
              <input
                type="text"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                placeholder="مثال: 15-20 دقيقة"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {isRTL ? 'الوصف بالعربية' : 'Description (Arabic)'}
              </label>
              <textarea
                rows={2}
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="وصف تفصيلي لمكونات الوجبة وطريقة تقديمها..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Image Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {isRTL ? 'اختر صورة الوجبة من معرض مايسترو' : 'Select Meal Photo Asset'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 bg-slate-900/60 rounded-2xl border border-white/10">
              {AVAILABLE_IMAGES.map((img) => {
                const asset = MealAssets[img.key];
                const isSelected = formData.imageKey === img.key;
                return (
                  <button
                    key={img.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageKey: img.key })}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 text-start cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/10'
                        : 'border-white/10 hover:border-white/30 bg-slate-800'
                    }`}
                  >
                    {asset && (
                      <img
                        src={asset.src}
                        alt={img.label}
                        className="w-full h-14 object-cover rounded-lg"
                      />
                    )}
                    <span className="block text-[10px] text-slate-300 truncate mt-1 text-center font-medium">
                      {img.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/10">
            <div>
              <div className="text-sm font-bold text-white">
                {isRTL ? 'حالة التوفر للطلب المباشر' : 'Available for Ordering'}
              </div>
              <div className="text-xs text-slate-400">
                {formData.isAvailable
                  ? isRTL
                    ? 'ستظهر الوجبة للزبائن ويمكن إضافتها للسلة'
                    : 'Visible on storefront and can be ordered'
                  : isRTL
                  ? 'معطلة ولن تظهر للزبائن مؤقتاً'
                  : 'Hidden or marked sold out'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                formData.isAvailable ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                  formData.isAvailable ? (isRTL ? 'start-6' : 'start-6') : 'start-0.5'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-colors cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-extrabold shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check size={16} />
              <span>{dish ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : isRTL ? 'إضافة الوجبة' : 'Add Dish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
