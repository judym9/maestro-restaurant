import React, { useState, useEffect } from 'react';
import type { AdminMealItem, MealFormData, CategoryItem, MealOption } from '../../types/menu.types';
import { MealAssets } from '../../../../utils/imageRegistry';
import { Plus, Trash2, X, UtensilsCrossed } from 'lucide-react';

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MealFormData) => void;
  initialData?: AdminMealItem | null;
  categories: CategoryItem[];
  language: 'ar' | 'en';
}

export const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  language,
}) => {
  const isAr = language === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>('');
  const [imageKey, setImageKey] = useState<string>('shawarma-tower');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isSignature, setIsSignature] = useState<boolean>(false);
  const [isSpicy, setIsSpicy] = useState<boolean>(false);
  const [isBestseller, setIsBestseller] = useState<boolean>(false);
  const [ingredientsArText, setIngredientsArText] = useState('');
  const [ingredientsEnText, setIngredientsEnText] = useState('');
  const [options, setOptions] = useState<MealOption[]>([]);

  // Option temporary input
  const [newOptNameAr, setNewOptNameAr] = useState('');
  const [newOptNameEn, setNewOptNameEn] = useState('');
  const [newOptPriceDiff, setNewOptPriceDiff] = useState<number>(0);

  const modalCardRef = React.useRef<HTMLDivElement>(null);

  // Smooth scroll to center and handle body overflow and Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Smooth scroll to center of screen
    const scrollTimer = setTimeout(() => {
      const editSection = modalCardRef.current || document.getElementById('quick-edit-section');
      if (editSection) {
        editSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);

    // Lock body scroll after smooth scroll initiates
    const lockTimer = setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 450);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(lockTimer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (initialData) {
      setNameAr(initialData.nameAr);
      setNameEn(initialData.nameEn);
      setDescriptionAr(initialData.descriptionAr);
      setDescriptionEn(initialData.descriptionEn);
      setPrice(initialData.price);
      setOriginalPrice(initialData.originalPrice);
      setCategoryId(initialData.categoryId);
      setImageKey(initialData.imageKey);
      setIsAvailable(initialData.isAvailable);
      setIsSignature(initialData.isSignature);
      setIsSpicy(initialData.isSpicy);
      setIsBestseller(initialData.isBestseller);
      setIngredientsArText(initialData.ingredientsAr?.join(', ') || '');
      setIngredientsEnText(initialData.ingredientsEn?.join(', ') || '');
      setOptions(initialData.options || []);
    } else {
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setPrice(150000);
      setOriginalPrice(undefined);
      setCategoryId(categories[0]?.id || 'cat-shawarma');
      setImageKey('shawarma-tower');
      setIsAvailable(true);
      setIsSignature(false);
      setIsSpicy(false);
      setIsBestseller(false);
      setIngredientsArText('شاورما دجاج متبلة, ثومية أصلية, مخلل');
      setIngredientsEnText('Marinated Chicken, Toum Garlic Dip, Damascus Pickles');
      setOptions([]);
    }
  }, [initialData, categories, isOpen]);

  const handleAddOption = () => {
    if (!newOptNameAr.trim() || !newOptNameEn.trim()) return;
    setOptions((prev) => [
      ...prev,
      {
        id: `opt-${Date.now()}`,
        nameAr: newOptNameAr.trim(),
        nameEn: newOptNameEn.trim(),
        priceDiff: Number(newOptPriceDiff) || 0,
      },
    ]);
    setNewOptNameAr('');
    setNewOptNameEn('');
    setNewOptPriceDiff(0);
  };

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;

    onSave({
      id: initialData?.id,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      categoryId,
      imageKey,
      isAvailable,
      isSignature,
      isSpicy,
      isBestseller,
      isNew: false,
      ingredientsArText,
      ingredientsEnText,
      options,
    });
  };

  if (!isOpen) return null;

  const availableImageKeys = Object.keys(MealAssets);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card / Quick Edit Section */}
      <div
        id="quick-edit-section"
        ref={modalCardRef}
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden z-10 text-white animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-slate-800 shrink-0 flex items-center justify-between bg-slate-900">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
              <UtensilsCrossed size={18} />
            </span>
            <span>
              {initialData ? (isAr ? 'تعديل بيانات الوجبة' : 'Edit Dish Details') : (isAr ? 'إضافة وجبة فاخرة جديدة' : 'Add New Luxury Dish')}
            </span>
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form wrapping scrollable content and fixed footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Form Fields Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-admin-scrollbar">
            {/* Dish Names (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'اسم الوجبة بالعربية *' : 'Dish Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: برج شاورما مايسترو الملكي"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'اسم الوجبة بالإنجليزية *' : 'Dish Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Royal Shawarma Tower"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Category & Image Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'التصنيف *' : 'Category *'}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {isAr ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'الصورة المعتمدة *' : 'Associated Photo Asset *'}
                </label>
                <select
                  value={imageKey}
                  onChange={(e) => setImageKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors cursor-pointer"
                >
                  {availableImageKeys.map((k) => (
                    <option key={k} value={k} className="bg-slate-900 text-white">
                      {MealAssets[k]?.altAr || k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing (Current & Original) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'السعر الحالي *' : 'Current Price *'}
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-amber-400 font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'السعر قبل الخصم' : 'Price Before Discount'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={originalPrice || ''}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="مثال: 180000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Descriptions (Arabic & English) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'الوصف بالعربية' : 'Arabic Description'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف تفصيلي لمكونات الطبق والخلطة الملكية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm leading-relaxed transition-colors"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {isAr ? 'الوصف بالإنجليزية' : 'English Description'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Detailed description of flavors and serving..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm leading-relaxed transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Badges & Features Checkboxes / Toggles */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {isAr ? 'حالة الوجبة والشارات' : 'Dish Status & Badges'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* متوفر */}
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isAvailable
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs font-bold">
                    {isAr ? 'متوفر' : 'Available'}
                  </span>
                </label>

                {/* ملكي فاخر */}
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isSignature
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSignature}
                    onChange={(e) => setIsSignature(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer accent-amber-500"
                  />
                  <span className="text-xs font-bold">
                    {isAr ? 'ملكي فاخر' : 'Signature'}
                  </span>
                </label>

                {/* سبايسي حار */}
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isSpicy
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSpicy}
                    onChange={(e) => setIsSpicy(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-0 cursor-pointer accent-rose-500"
                  />
                  <span className="text-xs font-bold">
                    {isAr ? 'سبايسي حار' : 'Spicy'}
                  </span>
                </label>

                {/* الأكثر طلباً */}
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isBestseller
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-400'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-0 cursor-pointer accent-teal-500"
                  />
                  <span className="text-xs font-bold">
                    {isAr ? 'الأكثر طلباً' : 'Bestseller'}
                  </span>
                </label>
              </div>
            </div>

            {/* Options / Customizations Section */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="block text-sm font-medium text-slate-300">
                {isAr ? 'خيارات وأحجام الوجبة الإضافية' : 'Portion Sizes & Custom Options'}
              </label>

              {/* Existing Options List */}
              {options.length > 0 && (
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-xs shadow-xs"
                    >
                      <span className="font-bold text-white text-sm">
                        {isAr ? opt.nameAr : (opt.nameEn || opt.nameAr)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400 font-bold font-mono">
                          {opt.priceDiff > 0 ? `+${opt.priceDiff.toLocaleString()} ل.س` : (isAr ? 'السعر الأساسي' : 'Included')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(opt.id)}
                          className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title={isAr ? 'حذف هذا الخيار' : 'Delete option'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Option Inputs Card */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      {isAr ? 'الاسم بالعربية' : 'Arabic Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'الاسم بالعربي' : 'Name in Arabic'}
                      value={newOptNameAr}
                      onChange={(e) => setNewOptNameAr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      {isAr ? 'الاسم بالإنجليزية' : 'English Name'}
                    </label>
                    <input
                      type="text"
                      placeholder="Name EN"
                      value={newOptNameEn}
                      onChange={(e) => setNewOptNameEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      {isAr ? 'فارق السعر' : 'Price Difference'}
                    </label>
                    <input
                      type="number"
                      placeholder={isAr ? 'فارق السعر' : 'Price diff'}
                      value={newOptPriceDiff || ''}
                      onChange={(e) => setNewOptPriceDiff(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-400 font-bold placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} className="text-amber-400" />
                    <span>{isAr ? 'إضافة الخيار' : 'Add Option'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-center gap-4 shrink-0 bg-slate-900">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-sm cursor-pointer"
            >
              {isAr ? 'حفظ التعديلات' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
