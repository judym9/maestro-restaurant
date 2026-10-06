import React from 'react';
import { Power, Clock, Bike, MessageSquare, Bell, Sparkles } from 'lucide-react';
import type { BranchContactInfo, OperatingSchedule } from '../../types/settings.types';

interface BranchHeroStatusCardProps {
  schedule: OperatingSchedule;
  contactInfo: BranchContactInfo;
  onToggleOpen: () => void;
  language: 'ar' | 'en';
}

export const BranchHeroStatusCard: React.FC<BranchHeroStatusCardProps> = ({
  schedule,
  contactInfo,
  onToggleOpen,
  language,
}) => {
  const isAr = language === 'ar';
  const isOpen = schedule.isOpen;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-6 sm:p-7 shadow-sm transition-all duration-300">
      {/* Top subtle ambient status glow bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 transition-colors duration-500 ${
          isOpen
            ? 'bg-gradient-to-r from-emerald-500/30 via-emerald-500 to-emerald-500/30'
            : 'bg-gradient-to-r from-rose-500/30 via-rose-500 to-rose-500/30'
        }`}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left / Leading (RTL: Right): Status Beacon & Titles */}
        <div className="flex items-start gap-4">
          {/* Animated Pulsating Beacon */}
          <div className="relative mt-1 shrink-0">
            <span
              className={`block w-4 h-4 rounded-full transition-colors duration-300 ${
                isOpen ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            {isOpen && (
              <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                {isOpen
                  ? (isAr ? 'المطعم مفتوح لاستقبال الطلبات' : 'Restaurant Open for Orders')
                  : (isAr ? 'المطعم مغلق حالياً' : 'Restaurant Currently Closed')}
              </h2>

              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                  isOpen
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}
              >
                {isOpen ? (isAr ? 'حالة نشطة' : 'Active') : (isAr ? 'متوقف مؤقتاً' : 'Paused')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {isOpen
                ? (isAr
                    ? 'يتم استقبال طلبات الزبائن ومعالجتها بشكل فوري عبر الموقع الإلكتروني وقناة الواتساب المعتمدة.'
                    : 'Customer orders are actively received and processed via the website and official WhatsApp channel.')
                : (isAr
                    ? 'تم تجميد استلام الطلبات من الموقع والواتساب مؤقتاً (خارج أوقات العمل أو أثناء فترات الذروة في المطبخ).'
                    : 'Order reception is temporarily paused across web and WhatsApp (outside hours or during peak kitchen load).')}
            </p>
          </div>
        </div>

        {/* Right / Trailing (RTL: Left): Master Quick-Toggle Switch */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            role="switch"
            aria-checked={isOpen}
            onClick={onToggleOpen}
            className={`relative inline-flex h-11 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
              isOpen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600'
            }`}
          >
            <span className="sr-only">Toggle store operational status</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-flex items-center justify-center h-10 w-10 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isOpen
                  ? (isAr ? '-translate-x-9' : 'translate-x-9')
                  : 'translate-x-0'
              }`}
            >
              <Power
                size={16}
                className={isOpen ? 'text-emerald-600 font-bold' : 'text-slate-400'}
              />
            </span>
          </button>

          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
            {isOpen
              ? (isAr ? 'انقر للتعطيل السريع' : 'Click to close')
              : (isAr ? 'انقر للفتح الفوري' : 'Click to open')}
          </span>
        </div>
      </div>

      {/* Bottom Micro-Metrics Strip */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Operating Hours */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
          <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
            <Clock size={16} />
          </span>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
              {isAr ? 'ساعات الاستقبال اليومية' : 'Daily Hours'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate block font-numeric" dir="ltr">
              {schedule.openingTime} - {schedule.closingTime}
            </span>
          </div>
        </div>

        {/* Metric 2: Estimated Delivery */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
          <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
            <Bike size={16} />
          </span>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
              {isAr ? 'سرعة التوصيل والتحضير' : 'Delivery Speed'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate block">
              {isAr ? (schedule.estimatedDeliveryTimeAr || '30 - 45 دقيقة') : (schedule.estimatedDeliveryTimeEn || '30 - 45 mins')}
            </span>
          </div>
        </div>

        {/* Metric 3: WhatsApp Channel */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
          <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
            <MessageSquare size={16} />
          </span>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
              {isAr ? 'واتساب الطلبات المباشر' : 'Orders WhatsApp'}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate block font-numeric" dir="ltr">
              {contactInfo.whatsappNumber}
            </span>
          </div>
        </div>

        {/* Metric 4: Announcement Status */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
          <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
            {schedule.showEmergencyBanner ? <Bell size={16} /> : <Sparkles size={16} />}
          </span>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
              {isAr ? 'شريط التنبيهات الإعلاني' : 'Top Banner'}
            </span>
            <span
              className={`text-xs font-bold truncate block ${
                schedule.showEmergencyBanner
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-slate-500 dark:text-zinc-500'
              }`}
            >
              {schedule.showEmergencyBanner
                ? (isAr ? 'ظاهر للزبائن' : 'Active')
                : (isAr ? 'مخفي حالياً' : 'Hidden')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
