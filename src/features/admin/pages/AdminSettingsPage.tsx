import React, { useState } from 'react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { BranchHeroStatusCard } from '../components/settings/BranchHeroStatusCard';
import { ContactInfoForm } from '../components/settings/ContactInfoForm';
import { WeeklyScheduleCard } from '../components/settings/WeeklyScheduleCard';
import { DeliverySettingsCard } from '../components/settings/DeliverySettingsCard';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { CheckCircle, Building2, Calendar, Bike, Layers } from 'lucide-react';

type SettingsTab = 'all' | 'contact' | 'schedule' | 'delivery';

export const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const {
    contactInfo,
    operatingSchedule,
    saveBranchInfo,
    saveSchedule,
    notification,
  } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>('all');

  const handleToggleOpen = () => {
    const nextStatus = !operatingSchedule.isOpen;
    saveSchedule(
      { isOpen: nextStatus },
      nextStatus
        ? (isAr ? 'تم فتح المطعم لاستقبال طلبات الزبائن بنجاح' : 'Restaurant is now OPEN for orders')
        : (isAr ? 'تم إغلاق المطعم وتجميد استلام الطلبات مؤقتاً' : 'Restaurant is now CLOSED for orders')
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl pb-16 min-w-0">
      {/* Floating Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle size={18} className="shrink-0 text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Operational Status Hero Card */}
      <BranchHeroStatusCard
        schedule={operatingSchedule}
        contactInfo={contactInfo}
        onToggleOpen={handleToggleOpen}
        language={language}
      />

      {/* 2. Sub-Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700/80'
          }`}
        >
          <Layers size={14} />
          <span>{isAr ? 'جميع الإعدادات' : 'All Sections'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700/80'
          }`}
        >
          <Building2 size={14} />
          <span>{isAr ? 'بيانات الفرع والاتصال' : 'Branch & Contact'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700/80'
          }`}
        >
          <Calendar size={14} />
          <span>{isAr ? 'جدول مواعيد العمل' : 'Weekly Schedule'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'delivery'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200 dark:hover:bg-zinc-700/80'
          }`}
        >
          <Bike size={14} />
          <span>{isAr ? 'التوصيل وشريط الإعلانات' : 'Delivery & Banner'}</span>
        </button>
      </div>

      {/* 3. Settings Sections Container */}
      <div className="space-y-6">
        {/* Section A: Contact Info & Channels */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <ContactInfoForm
            contactInfo={contactInfo}
            onSave={saveBranchInfo}
            language={language}
          />
        )}

        {/* Section B: Weekly Working Hours Schedule */}
        {(activeTab === 'all' || activeTab === 'schedule') && (
          <WeeklyScheduleCard
            schedule={operatingSchedule}
            onUpdateSchedule={saveSchedule}
            language={language}
          />
        )}

        {/* Section C: Delivery Parameters & Top Announcement Alert */}
        {(activeTab === 'all' || activeTab === 'delivery') && (
          <DeliverySettingsCard
            schedule={operatingSchedule}
            onUpdateSchedule={saveSchedule}
            language={language}
          />
        )}
      </div>
    </div>
  );
};
