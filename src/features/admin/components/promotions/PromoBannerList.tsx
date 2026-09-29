import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  Percent,
} from 'lucide-react';
import { MealAssets } from '../../../../utils/imageRegistry';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { usePromotions } from '../../hooks/usePromotions';
import { PromoPaginationControl } from './PromoPaginationControl';
import type { PromoDeal } from '../../../promotions/promosData';

export const PromoBannerList: React.FC = () => {
  const { isRTL } = useAdminLanguage();
  const {
    promos,
    paginatedPromos,
    currentPage,
    totalPages,
    setCurrentPage,
    togglePromoActive,
    movePromo,
    deletePromo,
    savePromo,
  } = usePromotions(4);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<PromoDeal>>({
    imageKey: 'shawarma-tower',
    badgeAr: 'عرض خاص',
    badgeEn: 'Special Offer',
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: 95000,
    originalPrice: 120000,
    discountPercent: 20,
    remainingDays: 5,
    isActive: true,
  });

  const currencySymbol = isRTL ? 'ل.س' : 'SYP';
  const formatPrice = (p: number) => new Intl.NumberFormat('en-US').format(p);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.titleAr) return;

    const deal: PromoDeal = {
      id: `promo-${Date.now().toString(36)}`,
      imageKey: newPromo.imageKey || 'shawarma-tower',
      badgeAr: newPromo.badgeAr || 'عرض خاص',
      badgeEn: newPromo.badgeEn || 'Special Deal',
      titleAr: newPromo.titleAr,
      titleEn: newPromo.titleEn || newPromo.titleAr,
      descriptionAr: newPromo.descriptionAr || '',
      descriptionEn: newPromo.descriptionEn || '',
      price: Number(newPromo.price) || 0,
      originalPrice: Number(newPromo.originalPrice) || Number(newPromo.price) || 0,
      discountPercent: Number(newPromo.discountPercent) || 15,
      remainingDays: Number(newPromo.remainingDays) || 3,
      isActive: true,
      featured: true,
      sortOrder: promos.length + 1,
    };

    savePromo(deal);
    setIsAddModalOpen(false);
    setNewPromo({
      imageKey: 'shawarma-tower',
      badgeAr: 'عرض خاص',
      badgeEn: 'Special Offer',
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      price: 95000,
      originalPrice: 120000,
      discountPercent: 20,
      remainingDays: 5,
      isActive: true,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              {isRTL ? 'إدارة العروض والخصومات الترويجية' : 'Promotions & Special Deals'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {isRTL
                ? `إجمالي ${promos.length} عروض ترويجية نشطة يتم عرضها في شريط السلايدر التفاعلي على الواجهة الرئيسية`
                : `Total ${promos.length} promotional slides active on the storefront interactive carousel`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus size={18} />
          <span>{isRTL ? 'إضافة عرض جديد' : 'New Promo Offer'}</span>
        </button>
      </div>

      {/* Promos List */}
      <div className="space-y-4">
        {paginatedPromos.map((promo, index) => {
          const globalIndex = (currentPage - 1) * 4 + index;
          const asset = MealAssets[promo.imageKey];

          return (
            <div
              key={promo.id}
              className={`rounded-3xl bg-[#141b29] border transition-all p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                promo.isActive
                  ? 'border-white/10 hover:border-amber-500/30 shadow-lg'
                  : 'border-white/5 opacity-60 bg-slate-950/40'
              }`}
            >
              {/* Media & Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
                {/* Image */}
                <div className="relative w-full sm:w-32 h-24 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-white/10">
                  {asset && (
                    <img
                      src={asset.src}
                      alt={promo.titleEn}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 start-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
                      {isRTL ? promo.badgeAr : promo.badgeEn}
                    </span>
                  </div>
                </div>

                {/* Text Info */}
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      {isRTL ? promo.titleAr : promo.titleEn}
                    </h4>
                    {promo.discountPercent && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-extrabold border border-rose-500/30 flex items-center gap-1">
                        <Percent size={11} />
                        <span>{promo.discountPercent}% {isRTL ? 'خصم' : 'OFF'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {isRTL ? promo.descriptionAr : promo.descriptionEn}
                  </p>

                  <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-amber-400 text-sm">
                        {formatPrice(promo.price)} {currencySymbol}
                      </span>
                      {promo.originalPrice && promo.originalPrice > promo.price && (
                        <span className="text-slate-500 line-through text-[11px]">
                          {formatPrice(promo.originalPrice)} {currencySymbol}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={13} className="text-amber-400" />
                      <span>{isRTL ? `متبقي ${promo.remainingDays} أيام` : `${promo.remainingDays} days left`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0 pt-4 lg:pt-0 border-t border-white/5 lg:border-t-0 w-full lg:w-auto justify-end">
                {/* Up/Down Reorder */}
                <button
                  type="button"
                  disabled={globalIndex === 0}
                  onClick={() => movePromo(globalIndex, 'up')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
                  title={isRTL ? 'تحريك للأعلى' : 'Move up'}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={globalIndex === promos.length - 1}
                  onClick={() => movePromo(globalIndex, 'down')}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
                  title={isRTL ? 'تحريك للأسفل' : 'Move down'}
                >
                  <ArrowDown size={16} />
                </button>

                {/* Toggle Active */}
                <button
                  type="button"
                  onClick={() => togglePromoActive(promo.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    promo.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {promo.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>{promo.isActive ? (isRTL ? 'نشط' : 'Active') : isRTL ? 'معطل' : 'Paused'}</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(isRTL ? 'هل تريد حذف هذا العرض الترويجي؟' : 'Delete this promotion?')) {
                      deletePromo(promo.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title={isRTL ? 'حذف العرض' : 'Delete promotion'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Control */}
      <PromoPaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={promos.length}
        pageSize={4}
      />

      {/* Add Promo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <span>{isRTL ? 'إضافة شريحة عرض ترويجي' : 'Add Promotional Offer'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  {isRTL ? 'عنوان العرض (عربي) *' : 'Title (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newPromo.titleAr}
                  onChange={(e) => setNewPromo({ ...newPromo, titleAr: e.target.value })}
                  placeholder="مثال: عرض التوفير العائلي الملكي"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  {isRTL ? 'عنوان العرض (إنجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={newPromo.titleEn}
                  onChange={(e) => setNewPromo({ ...newPromo, titleEn: e.target.value })}
                  placeholder="e.g. Royal Family Meal Deal"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    {isRTL ? 'سعر العرض (ل.س) *' : 'Deal Price (SYP) *'}
                  </label>
                  <input
                    type="number"
                    required
                    step="500"
                    value={newPromo.price}
                    onChange={(e) => setNewPromo({ ...newPromo, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    {isRTL ? 'السعر الأصلي (ل.س)' : 'Original Price (SYP)'}
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={newPromo.originalPrice}
                    onChange={(e) => setNewPromo({ ...newPromo, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    {isRTL ? 'نسبة الخصم %' : 'Discount %'}
                  </label>
                  <input
                    type="number"
                    value={newPromo.discountPercent}
                    onChange={(e) => setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    {isRTL ? 'الأيام المتبقية' : 'Days Remaining'}
                  </label>
                  <input
                    type="number"
                    value={newPromo.remainingDays}
                    onChange={(e) => setNewPromo({ ...newPromo, remainingDays: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20"
                >
                  {isRTL ? 'إضافة العرض' : 'Add Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
