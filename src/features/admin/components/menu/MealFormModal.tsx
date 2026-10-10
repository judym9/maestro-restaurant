import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import type { AdminMealItem, MealFormData, MealOption, CategoryItem } from '../../types/menu.types';
import { calculateDiscountPercentage } from '../../utils/mathCalculations';
import { MealAssets } from '../../../../utils/imageRegistry';

export interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MealFormData) => void;
  meal?: AdminMealItem | null;
  categories: CategoryItem[];
}

const AVAILABLE_IMAGES = Object.keys(MealAssets) as (keyof typeof MealAssets)[];

export const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  meal,
  categories,
}) => {
  // Form State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(15);
  const [imageKey, setImageKey] = useState<string>('shawarma-tower');

  // Dietary and Marketing Flags
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isSignature, setIsSignature] = useState<boolean>(false);
  const [isBestseller, setIsBestseller] = useState<boolean>(false);
  const [isSpicy, setIsSpicy] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [isGlutenFree, setIsGlutenFree] = useState<boolean>(false);

  // Ingredients and Options
  const [ingredientsArInput, setIngredientsArInput] = useState('');
  const [ingredientsEnInput, setIngredientsEnInput] = useState('');
  const [options, setOptions] = useState<MealOption[]>([]);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or Populate form on open/change
  useEffect(() => {
    if (meal) {
      setNameAr(meal.nameAr || '');
      setNameEn(meal.nameEn || '');
      setCategoryId(meal.categoryId || (categories[0]?.id ?? ''));
      setDescriptionAr(meal.descriptionAr || '');
      setDescriptionEn(meal.descriptionEn || '');
      setPrice(meal.price || 0);
      setOriginalPrice(meal.originalPrice);
      setPrepTimeMinutes(meal.prepTimeMinutes || 15);
      setImageKey(meal.imageKey || 'shawarma-tower');
      setIsAvailable(meal.isAvailable ?? true);
      setIsSignature(meal.isSignature || false);
      setIsBestseller(meal.isBestseller || false);
      setIsSpicy(meal.isSpicy || false);
      setIsNew(meal.isNew || false);
      setIsVegetarian(meal.isVegetarian || false);
      setIsGlutenFree(meal.isGlutenFree || false);
      setIngredientsArInput(meal.ingredientsAr?.join(', ') || '');
      setIngredientsEnInput(meal.ingredientsEn?.join(', ') || '');
      setOptions(meal.options ? [...meal.options] : []);
    } else {
      setNameAr('');
      setNameEn('');
      setCategoryId(categories[0]?.id || '');
      setDescriptionAr('');
      setDescriptionEn('');
      setPrice(0);
      setOriginalPrice(undefined);
      setPrepTimeMinutes(15);
      setImageKey('shawarma-tower');
      setIsAvailable(true);
      setIsSignature(false);
      setIsBestseller(false);
      setIsSpicy(false);
      setIsNew(true);
      setIsVegetarian(false);
      setIsGlutenFree(false);
      setIngredientsArInput('');
      setIngredientsEnInput('');
      setOptions([]);
    }
    setErrors({});
  }, [meal, categories, isOpen]);

  // Options Handlers
  const handleAddOption = () => {
    const newOpt: MealOption = {
      id: `opt-${Date.now()}`,
      nameAr: '',
      nameEn: '',
      priceDiff: 0,
    };
    setOptions((prev) => [...prev, newOpt]);
  };

  const handleUpdateOption = (index: number, field: keyof MealOption, value: any) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler with Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nameAr.trim()) {
      newErrors.nameAr = 'اسم الوجبة بالعربية مطلوب';
    }
    if (!nameEn.trim()) {
      newErrors.nameEn = 'اسم الوجبة بالإنجليزية مطلوب';
    }
    if (!categoryId) {
      newErrors.categoryId = 'يرجى اختيار تصنيف الوجبة';
    }
    if (!price || price <= 0) {
      newErrors.price = 'يرجى إدخال سعر صحيح أكبر من الصفر';
    }
    if (originalPrice && originalPrice < price) {
      newErrors.originalPrice = 'السعر الأصلي يجب أن يكون مساوياً أو أكبر من سعر البيع';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: MealFormData = {
      ...(meal?.id ? { id: meal.id } : {}),
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      categoryId,
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      prepTimeMinutes: Number(prepTimeMinutes) || 15,
      imageKey,
      isAvailable,
      isSignature,
      isBestseller,
      isSpicy,
      isNew,
      isVegetarian,
      isGlutenFree,
      ingredientsArText: ingredientsArInput.trim(),
      ingredientsEnText: ingredientsEnInput.trim(),
      options: options.filter((opt) => opt.nameAr.trim() !== ''),
    };

    onSave(payload);
  };

  const discountPercent = calculateDiscountPercentage(originalPrice, price);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meal ? 'تعديل تفاصيل الوجبة الملكية' : 'إضافة وجبة ملكية جديدة'}
      subtitle="أدخل البيانات بدقة لتحديث قائمة طعام المطعم والمتجر الفوري"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              اسم الوجبة بالعربية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: شاورما عربي دبل مايسترو"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
                errors.nameAr
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
              }`}
            />
            {errors.nameAr && (
              <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.nameAr}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              اسم الوجبة بالإنجليزية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Double Arabi Shawarma"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
                errors.nameEn
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
              }`}
            />
            {errors.nameEn && (
              <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.nameEn}
              </span>
            )}
          </div>
        </div>

        {/* Category & Preparation Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              التصنيف والقسم <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon || '🍽️'} {cat.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              مدة التحضير (بالدقائق)
            </label>
            <div className="relative">
              <Clock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="1"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Pricing: Sale Price & Original Price */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                سعر البيع الحالي (ليرة سورية) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-sm text-white font-mono focus:outline-none focus:ring-1 transition-colors ${
                  errors.price
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700/80 focus:border-amber-500 focus:ring-amber-500'
                }`}
              />
              {errors.price && (
                <span className="text-[11px] text-rose-400 mt-1 block">
                  {errors.price}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                السعر الأصلي المشطوب قبل الخصم (اختياري)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={originalPrice ?? ''}
                onChange={(e) =>
                  setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="اتركه فارغاً إذا لم يوجد خصم"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {errors.originalPrice && (
                <span className="text-[11px] text-rose-400 mt-1 block">
                  {errors.originalPrice}
                </span>
              )}
            </div>
          </div>

          {discountPercent > 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                سيظهر مؤشر خصم جذاب للعميل بنسبة{' '}
                <strong className="font-mono font-bold">{discountPercent}%</strong>
              </span>
            </div>
          )}
        </div>

        {/* Image Selection with Visual Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>صورة الوجبة في المتجر</span>
            </span>
            <span className="text-slate-500 text-[11px]">انقر لاختيار الصورة</span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-40 overflow-y-auto p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            {AVAILABLE_IMAGES.map((key) => {
              const asset = MealAssets[key];
              const isSelected = imageKey === key;

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setImageKey(key)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/40 scale-95 shadow-md'
                      : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={asset.webp || asset.src}
                    alt={asset.altAr}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              وصف الوجبة بالعربية
            </label>
            <textarea
              rows={2}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف تفصيلي للوجبة ومكوناتها المميزة..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              وصف الوجبة بالإنجليزية
            </label>
            <textarea
              rows={2}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="English description..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Dietary & Marketing Checkboxes */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-3.5">
          <span className="block text-xs font-bold text-slate-300">
            شارات التمييز والعلامات الغذائية
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>متاحة للطلب الآن</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isSignature}
                onChange={(e) => setIsSignature(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>توقيع الشيف (Signature)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>الأكثر مبيعاً</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isSpicy}
                onChange={(e) => setIsSpicy(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>حار (Spicy)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>صنف جديد</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>نباتي (Vegetarian)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span>خالي من الغلوتين</span>
            </label>
          </div>
        </div>

        {/* Ingredients Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              المكونات بالعربية (مفصولة بفواصل)
            </label>
            <input
              type="text"
              value={ingredientsArInput}
              onChange={(e) => setIngredientsArInput(e.target.value)}
              placeholder="مثال: صدور دجاج، ثومية، مخلل، خبز صاج"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              المكونات بالإنجليزية (مفصولة بفواصل)
            </label>
            <input
              type="text"
              value={ingredientsEnInput}
              onChange={(e) => setIngredientsEnInput(e.target.value)}
              placeholder="Chicken breast, Garlic dip, Pickles, Saj bread"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Options / Sizes Sub-Editor */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              خيارات الأحجام والإضافات الخاصة بالوجبة (Options)
            </span>
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة خيار</span>
            </button>
          </div>

          {options.length === 0 ? (
            <p className="text-[11px] text-slate-500 text-center py-2">
              لا توجد خيارات مخصصة. الوجبة تباع بالسعر القياسي فقط.
            </p>
          ) : (
            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div
                  key={opt.id || idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <input
                    type="text"
                    value={opt.nameAr}
                    onChange={(e) => handleUpdateOption(idx, 'nameAr', e.target.value)}
                    placeholder="اسم الخيار بالعربية (مثال: حجم كبير)"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={opt.nameEn}
                    onChange={(e) => handleUpdateOption(idx, 'nameEn', e.target.value)}
                    placeholder="English option name"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white"
                  />
                  <div className="w-32 flex items-center gap-1">
                    <input
                      type="number"
                      step="500"
                      value={opt.priceDiff}
                      onChange={(e) =>
                        handleUpdateOption(idx, 'priceDiff', Number(e.target.value))
                      }
                      placeholder="+ فارق السعر"
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-amber-400 font-mono text-center"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="حذف الخيار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 pb-1 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ بيانات الوجبة</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MealFormModal;
