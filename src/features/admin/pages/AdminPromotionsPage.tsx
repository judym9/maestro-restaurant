import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Tag,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { usePromotions } from '../hooks/usePromotions';
import { useAdminToast } from '../context/AdminToastContext';
import { MetricCard } from '../components/common/MetricCard';
import { EmptyState } from '../components/common/EmptyState';
import { PromoCard } from '../components/promotions/PromoCard';
import { PromoFormModal } from '../components/promotions/PromoFormModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import type { AdminPromoDeal, PromoFormData } from '../types/promotions.types';

export const AdminPromotionsPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const {
    promos,
    savePromo,
    deletePromo,
    togglePromoActive,
  } = usePromotions();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<AdminPromoDeal | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Compute Metrics
  const totalPromos = promos.length;
  const activeCount = promos.filter((p) => p.isActive).length;
  const avgDiscount =
    totalPromos > 0
      ? Math.round(
          promos.reduce((acc, p) => acc + (p.discountPercent || 0), 0) /
            totalPromos
        )
      : 0;

  // Handlers
  const handleOpenNewPromo = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  const handleEditPromo = (promo: AdminPromoDeal) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleSavePromo = (data: PromoFormData) => {
    savePromo(data);
    setIsModalOpen(false);
    showToast(
      'success',
      data.id ? 'تم تعديل بيانات العرض الملكي بنجاح' : 'تم إطلاق العرض الملكي بنجاح'
    );
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deletePromo(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('info', 'تم حذف العرض الترويجي بنجاح');
    }
  };

  const handleToggleActive = (id: string) => {
    togglePromoActive(id);
    showToast('info', 'تم تحديث حالة نشر العرض الترويجي');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>إدارة العروض الترويجية الملكية</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            إطلاق باقات التوفير العائلية، الخصومات الحصرية، والوجبات الترويجية المركبة
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewPromo}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء عرض ملكي جديد</span>
        </button>
      </div>

      {/* 3 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <MetricCard
          title="إجمالي العروض الترويجية"
          value={totalPromos}
          subtitle="باقات وحزم مسجلة"
          icon={Tag}
          badge={{ text: 'شامل', variant: 'gold' }}
        />

        <MetricCard
          title="العروض النشطة الحالية"
          value={activeCount}
          subtitle="معروضة للعملاء في واجهة المتجر"
          icon={CheckCircle2}
          badge={{ text: 'معروضة', variant: 'success' }}
        />

        <MetricCard
          title="متوسط نسبة التخفيض"
          value={`${avgDiscount}%`}
          subtitle="نسب التوفير التنافسية"
          icon={Percent}
          badge={{ text: 'توفير', variant: 'warning' }}
        />
      </div>

      {/* Main Promotions Grid Canvas */}
      {promos.length === 0 ? (
        <EmptyState
          title="لا توجد عروض ترويجية نشطة حالياً"
          description="يمكنك إنشاء أول باقة توفير ملكية أو وجبة ترويجية لجذب الزبائن وزيادة المبيعات."
          actionText="إنشاء عرض ترويجي جديد"
          onAction={handleOpenNewPromo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onEdit={handleEditPromo}
              onDelete={(id) => setDeleteConfirmId(id)}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      {/* Promo Form Modal */}
      <PromoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePromo}
        promo={editingPromo}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="حذف العرض الترويجي"
        message="هل أنت متأكد من حذف هذا العرض الترويجي؟ ستتم إزالته نهائياً من شريط العروض بالمتجر."
        confirmText="تأكيد حذف العرض"
        variant="danger"
      />
    </div>
  );
};

export default AdminPromotionsPage;
