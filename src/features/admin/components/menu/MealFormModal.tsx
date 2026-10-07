import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import type { AdminMealItem, CategoryItem, MealFormData, MealOption } from '../../types/menu.types';
import { getMealImage } from '../../../../utils/imageRegistry';

export interface MealFormModalProps {
  isOpen: boolean;
  categories: CategoryItem[];
  editingMeal: AdminMealItem | null;
  onClose: () => void;
  onSave: (data: MealFormData) => void;
}

const PRESET_IMAGE_KEYS = [
  'shawarma-tower',
  'shawarma-cake',
  'shawarma-platters',
  'shawarma-spit',
  'broasted-pieces',
  'broasted-chips',
  'supreme-meal',
  'crispy-meal',
  'fajita-sub',
  'crispy-baguettes',
];

export const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  categories,
  editingMeal,
  onClose,
  onSave,
}) => {
  const { language } = useLanguage();

  // Form State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>(15);
  const [imageKey, setImageKey] = useState('shawarma-tower');

  // Dietary tags
  const [isSignature, setIsSignature] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Ingredients text
  const [ingredientsArText, setIngredientsArText] = useState('');
  const [ingredientsEnText, setIngredientsEnText] = useState('');

  // Options & Add-ons
  const [options, setOptions] = useState<MealOption[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or fill data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (editingMeal) {
      setNameAr(editingMeal.nameAr);
      setNameEn(editingMeal.nameEn);
      setCategoryId(editingMeal.categoryId);
      setDescriptionAr(editingMeal.descriptionAr);
      setDescriptionEn(editingMeal.descriptionEn);
      setPrice(editingMeal.price);
      setOriginalPrice(editingMeal.originalPrice || '');
      setPrepTimeMinutes(editingMeal.prepTimeMinutes || 15);
      setImageKey(editingMeal.imageKey);
      setIsSignature(editingMeal.isSignature);
      setIsBestseller(editingMeal.isBestseller);
      setIsSpicy(editingMeal.isSpicy);
      setIsNew(editingMeal.isNew);
      setIsVegetarian(Boolean(editingMeal.isVegetarian));
      setIsGlutenFree(Boolean(editingMeal.isGlutenFree));
      setIsAvailable(editingMeal.isAvailable);
      setIngredientsArText(editingMeal.ingredientsAr ? editingMeal.ingredientsAr.join(', ') : '');
      setIngredientsEnText(editingMeal.ingredientsEn ? editingMeal.ingredientsEn.join(', ') : '');
      setOptions(editingMeal.options ? [...editingMeal.options] : []);
    } else {
      setNameAr('');
      setNameEn('');
      setCategoryId(categories[0]?.id || 'cat-shawarma');
      setDescriptionAr('');
      setDescriptionEn('');
      setPrice('');
      setOriginalPrice('');
      setPrepTimeMinutes(15);
      setImageKey('shawarma-tower');
      setIsSignature(false);
      setIsBestseller(false);
      setIsSpicy(false);
      setIsNew(true);
      setIsVegetarian(false);
      setIsGlutenFree(false);
      setIsAvailable(true);
      setIngredientsArText('');
      setIngredientsEnText('');
      setOptions([]);
    }
    setErrors({});
  }, [isOpen, editingMeal, categories]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Options management
  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: `opt-${Date.now()}`,
        nameAr: '',
        nameEn: '',
        priceDiff: 0,
      },
    ]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: keyof MealOption, val: any) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nameAr.trim()) {
      newErrors.nameAr = language === 'ar' ? 'اسم الوجبة بالعربية مطلوب' : 'Arabic name is required';
    }
    if (!nameEn.trim()) {
      newErrors.nameEn = language === 'ar' ? 'اسم الوجبة بالإنجليزية مطلوب' : 'English name is required';
    }
    if (!categoryId) {
      newErrors.categoryId = language === 'ar' ? 'يرجى اختيار تصنيف الوجبة' : 'Category is required';
    }
    if (price === '' || Number(price) <= 0) {
      newErrors.price = language === 'ar' ? 'يرجى إدخال سعر صحيح أكبر من الصفر' : 'Valid price is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: MealFormData = {
      id: editingMeal ? editingMeal.id : undefined,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      categoryId,
      descriptionAr: descriptionAr.trim(),
      descriptionEn: descriptionEn.trim(),
      price: Number(price),
      originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
      prepTimeMinutes: prepTimeMinutes !== '' ? Number(prepTimeMinutes) : 15,
      imageKey,
      isSignature,
      isBestseller,
      isSpicy,
      isNew,
      isVegetarian,
      isGlutenFree,
      isAvailable,
      ingredientsArText,
      ingredientsEnText,
      options: options.filter((o) => o.nameAr.trim() || o.nameEn.trim()),
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] shadow-2xl z-10 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-['Cairo',sans-serif]">
                {editingMeal
                  ? language === 'ar'
                    ? 'تعديل بيانات الوجبة'
                    : 'Edit Dish Details'
                  : language === 'ar'
                  ? 'إضافة وجبة ملكية جديدة'
                  : 'Add New Royal Dish'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {language === 'ar' ? 'تحكم بالأسعار، الوصف، الخيارات والصور' : 'Manage pricing, descriptions, options & imagery'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Section 1: Names & Category */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name AR */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)]">
                  {language === 'ar' ? 'اسم الوجبة (بالعربية) *' : 'Dish Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: شاورما عربي سوبر"
                  className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all ${
                    errors.nameAr ? 'border-rose-500' : 'border-[var(--border-subtle)]'
                  }`}
                  dir="rtl"
                />
                {errors.nameAr && (
                  <span className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.nameAr}
                  </span>
                )}
              </div>

              {/* Name EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)]">
                  {language === 'ar' ? 'اسم الوجبة (بالإنجليزية) *' : 'Dish Name (English) *'}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Super Arabic Shawarma"
                  className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] transition-all ${
                    errors.nameEn ? 'border-rose-500' : 'border-[var(--border-subtle)]'
                  }`}
                  dir="ltr"
                />
                {errors.nameEn && (
                  <span className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.nameEn}
                  </span>
                )}
              </div>
            </div>

            {/* Category Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'التصنيف / الفئة *' : 'Category *'}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameAr} — ({cat.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Pricing & Prep Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'السعر الحالي (ل.س) *' : 'Selling Price (SP) *'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="45000"
                className={`px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none focus:ring-2 focus:ring-[var(--accent-gold)] ${
                  errors.price ? 'border-rose-500' : 'border-[var(--border-subtle)]'
                }`}
              />
              {errors.price && (
                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.price}
                </span>
              )}
            </div>

            {/* Original / Sale Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'السعر قبل الخصم (اختياري)' : 'Original Price (Optional)'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="50000"
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
            </div>

            {/* Prep Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'وقت التحضير (بالدقائق)' : 'Prep Time (Mins)'}
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(e.target.value ? Number(e.target.value) : '')}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
            </div>
          </div>

          {/* Section 3: Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الوصف الترويجي (بالعربية)' : 'Arabic Description'}
              </label>
              <textarea
                rows={3}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="وصف شهي للمكونات وطريقة التقديم..."
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] resize-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الوصف الترويجي (بالإنجليزية)' : 'English Description'}
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Mouth-watering dish description..."
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Section 4: Dietary & Marketing Tags */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-primary)] mb-1">
              {language === 'ar' ? 'الشارات الترويجية والغذائية' : 'Promotional & Dietary Badges'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSignature}
                  onChange={(e) => setIsSignature(e.target.checked)}
                  className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'توقيع الشيف (مميز)' : 'Chef Signature'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'الأكثر طلباً (Bestseller)' : 'Bestseller'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSpicy}
                  onChange={(e) => setIsSpicy(e.target.checked)}
                  className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'حار سبايسي' : 'Hot & Spicy'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'نباتي (Vegetarian)' : 'Vegetarian'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGlutenFree}
                  onChange={(e) => setIsGlutenFree(e.target.checked)}
                  className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'خالٍ من الغلوتين' : 'Gluten-Free'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'صنف جديد (New)' : 'New Addition'}</span>
              </label>
            </div>
          </div>

          {/* Section 5: Image Key Selection with Preview */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[var(--accent-gold)]" />
              {language === 'ar' ? 'صورة الوجبة الفاخرة' : 'Dish Presentation Image'}
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--border-subtle)] shadow-inner">
                <img
                  src={imageKey.startsWith('http') || imageKey.startsWith('data:') ? imageKey : getMealImage(imageKey).src}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--text-muted)]">
                    {language === 'ar' ? 'رابط الصورة (URL مباشر أو Unsplash):' : 'Image URL (Direct link or Unsplash):'}
                  </label>
                  <input
                    type="url"
                    value={imageKey.startsWith('http') ? imageKey : ''}
                    onChange={(e) => setImageKey(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="px-3 py-1.5 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                    dir="ltr"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--text-muted)]">
                    {language === 'ar' ? 'أو اختر من مكتبة صور مايسترو المدمجة:' : 'Or pick from Maestro preset library:'}
                  </label>
                  <select
                    value={imageKey.startsWith('http') ? '' : imageKey}
                    onChange={(e) => {
                      if (e.target.value) setImageKey(e.target.value);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                  >
                    <option value="">{language === 'ar' ? '-- اختر صورة من المكتبة --' : '-- Choose preset asset --'}</option>
                    {PRESET_IMAGE_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Options & Sizes Customization */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {language === 'ar' ? 'خيارات الأحجام والإضافات (Add-ons)' : 'Customization & Portions'}
              </span>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/25 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                {language === 'ar' ? 'إضافة خيار' : 'Add Option'}
              </button>
            </div>

            {options.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic py-1">
                {language === 'ar' ? 'لا توجد خيارات مخصصة لهذه الوجبة حالياً.' : 'No customization options added yet.'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                    <input
                      type="text"
                      value={opt.nameAr}
                      onChange={(e) => updateOption(idx, 'nameAr', e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم بالعربية (مثال: حجم كبير)' : 'Name (AR)'}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
                    />
                    <input
                      type="text"
                      value={opt.nameEn}
                      onChange={(e) => updateOption(idx, 'nameEn', e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم بالإنجليزية (Large)' : 'Name (EN)'}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
                    />
                    <input
                      type="number"
                      step="500"
                      value={opt.priceDiff}
                      onChange={(e) => updateOption(idx, 'priceDiff', Number(e.target.value) || 0)}
                      placeholder="فرق السعر"
                      className="w-24 px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 transition-colors"
                      aria-label="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Ingredients tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'المكونات بالعربية (مفصولة بفاصلة)' : 'Ingredients (Arabic - comma separated)'}
              </label>
              <input
                type="text"
                value={ingredientsArText}
                onChange={(e) => setIngredientsArText(e.target.value)}
                placeholder="دجاج طازج، بهارات شامية، ثومية، مخلل..."
                className="px-3.5 py-2.5 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'المكونات بالإنجليزية (مفصولة بفاصلة)' : 'Ingredients (English - comma separated)'}
              </label>
              <input
                type="text"
                value={ingredientsEnText}
                onChange={(e) => setIngredientsEnText(e.target.value)}
                placeholder="Fresh chicken, Toum dip, Pickles..."
                className="px-3.5 py-2.5 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                dir="ltr"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)] sticky bottom-0 bg-[var(--bg-surface-elevated)] pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors min-h-[42px]"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-lg shadow-amber-900/20 transition-all min-h-[42px]"
            >
              {editingMeal
                ? language === 'ar'
                  ? 'حفظ التعديلات'
                  : 'Save Changes'
                : language === 'ar'
                ? 'إضافة الوجبة'
                : 'Create Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealFormModal;
