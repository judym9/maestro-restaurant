import React, { useState } from 'react';
import { Sparkles, Plus, Tag, Flame, Clock } from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { usePromotions } from '../hooks/usePromotions';
import { useAdminToast } from '../context/AdminToastContext';
import { PromoCard } from '../components/promotions/PromoCard';
import { PromoFormModal } from '../components/promotions/PromoFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { MetricCard } from '../components/common/MetricCard';
import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';

export const AdminPromotionsPage: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useAdminToast();

  const {
    promos,
    savePromo,
    deletePromo,
    togglePromoActive,
  } = usePromotions(50); // Show all promos

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<AdminPromoDeal | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const activeCount = promos.filter((p) => p.isActive).length;
  const avgDiscount =
    promos.length > 0
      ? Math.round(promos.reduce((sum, p) => sum + p.discountPercent, 0) / promos.length)
      : 0;

  const handleOpenNew = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (promo: AdminPromoDeal) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleSave = (formData: PromoFormData) => {
    savePromo(formData);
    setIsModalOpen(false);
    showToast(
      'success',
      editingPromo
        ? language === 'ar'
          ? 'تم تحديث بيانات العرض بنجاح'
          : 'Promotion updated successfully'
        : language === 'ar'
        ? 'تم إنشاء العرض الملكي بنجاح'
        : 'Royal promotion published successfully'
    );
  };

  const handleToggle = (id: string) => {
    const res = togglePromoActive(id);
    if (res) {
      showToast(
        'info',
        res.isActive
          ? language === 'ar'
            ? 'تم تفعيل العرض'
            : 'Promotion activated'
          : language === 'ar'
          ? 'تم إيقاف العرض مؤقتاً'
          : 'Promotion paused'
      );
    }
  };

  const executeDelete = () => {
    if (!deleteConfirmId) return;
    deletePromo(deleteConfirmId);
    setDeleteConfirmId(null);
    showToast('success', language === 'ar' ? 'تم حذف العرض بنجاح' : 'Promotion deleted successfully');
  };

  const targetPromo = promos.find((p) => p.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight font-['Cairo',sans-serif]">
            {language === 'ar' ? 'العروض الملكية وحزم التوفير' : 'Royal Promotions & Deals'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {language === 'ar'
              ? 'إدارة باقات التوفير الخاصة، نسب الخصومات، والعدادات الزمنية'
              : 'Manage celebration bundles, discount calculations & promotional countdowns'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-lg shadow-amber-900/20 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{language === 'ar' ? 'إنشاء عرض ملكي' : 'Create Royal Deal'}</span>
        </button>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <MetricCard
          title={language === 'ar' ? 'إجمالي العروض المسجلة' : 'Total Promotions'}
          value={promos.length}
          subtitle={language === 'ar' ? 'العروض النشطة والمؤقتة' : 'Active and archived deals'}
          icon={Tag}
          accentColor="gold"
        />

        <MetricCard
          title={language === 'ar' ? 'العروض النشطة حالياً' : 'Active Live Deals'}
          value={activeCount}
          subtitle={language === 'ar' ? 'متاحة للطلب الفوري في واجهة الزبائن' : 'Visible in customer storefront'}
          icon={Flame}
          accentColor="emerald"
        />

        <MetricCard
          title={language === 'ar' ? 'متوسط نسبة الخصم' : 'Avg Discount Rate'}
          value={`${avgDiscount}%`}
          subtitle={language === 'ar' ? 'توفير حقيقي للزبائن' : 'Average customer savings'}
          icon={Sparkles}
          accentColor="crimson"
        />
      </div>

      {/* Deals Grid */}
      {promos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <Clock className="w-12 h-12 text-[var(--text-muted)] mb-3" />
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
            {language === 'ar' ? 'لا توجد عروض ترويجية مسجلة حالياً' : 'No promotions found'}
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4">
            {language === 'ar'
              ? 'أطلق أول باقة توفير ملكية لزبائن المايسترو بخصومات استثنائية.'
              : 'Launch your first royal promotion to delight your customers.'}
          </p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] transition-all"
          >
            {language === 'ar' ? 'إنشاء أول عرض الآن' : 'Create First Deal Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onEdit={handleEdit}
              onDelete={setDeleteConfirmId}
              onToggleActive={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <PromoFormModal
        isOpen={isModalOpen}
        editingPromo={editingPromo}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        titleAr="تأكيد حذف العرض الترويجي"
        titleEn="Confirm Promotion Deletion"
        messageAr={`هل أنت متأكد من رغبتك في حذف العرض "${targetPromo?.titleAr}" نهائياً؟`}
        messageEn={`Are you sure you want to permanently delete "${targetPromo?.titleEn}"?`}
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

export default AdminPromotionsPage;
