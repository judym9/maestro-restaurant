import React, { useState } from 'react';
import { Clock, Power, Bell, Save } from 'lucide-react';
import type { OperatingSchedule } from '../../types/settings.types';
import { Card } from '../common/Card';

interface OperatingToggleProps {
  schedule: OperatingSchedule;
  onUpdateSchedule: (data: Partial<OperatingSchedule>, msg: string) => void;
  language: 'ar' | 'en';
}

export const OperatingToggle: React.FC<OperatingToggleProps> = ({
  schedule,
  onUpdateSchedule,
  language,
}) => {
  const isAr = language === 'ar';

  const [openingTime, setOpeningTime] = useState(schedule.openingTime);
  const [closingTime, setClosingTime] = useState(schedule.closingTime);
  const [emergencyAr, setEmergencyAr] = useState(schedule.emergencyNoticeAr);
  const [emergencyEn, setEmergencyEn] = useState(schedule.emergencyNoticeEn);
  const [showBanner, setShowBanner] = useState(schedule.showEmergencyBanner);

  const handleToggleOpen = () => {
    const nextStatus = !schedule.isOpen;
    onUpdateSchedule(
      { isOpen: nextStatus },
      nextStatus
        ? (isAr ? 'تم فتح المطعم لاستقبال طلبات الزبائن' : 'Restaurant is now OPEN for orders')
        : (isAr ? 'تم إغلاق المطعم وتجميد استلام الطلبات' : 'Restaurant is now CLOSED for orders')
    );
  };

  const handleSaveTimes = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchedule(
      {
        openingTime,
        closingTime,
        emergencyNoticeAr: emergencyAr,
        emergencyNoticeEn: emergencyEn,
        showEmergencyBanner: showBanner,
      },
      isAr ? 'تم حفظ أوقات العمل ورسالة التنبيه بنجاح' : 'Operating hours & alerts saved successfully'
    );
  };

  return (
    <Card
      variant="default"
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Clock size={20} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'حالة التشغيل وساعات الاستقبال' : 'Live Operations & Operating Hours'}
              </h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold ${
              schedule.isOpen
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
            }`}
          >
            {schedule.isOpen ? (isAr ? 'مستعد للطلبات' : 'Accepting Orders') : (isAr ? 'مغلق' : 'Closed')}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Master Instant Toggle Switch Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                schedule.isOpen
                  ? 'bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse'
                  : 'bg-rose-500 shadow-md shadow-rose-500/50'
              }`}
            />
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'مفتاح التشغيل الفوري للمتجر' : 'Master Ordering Switch'}
              </h4>
              <span
                className={`text-sm font-semibold px-2.5 py-0.5 rounded-lg ${
                  schedule.isOpen
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                {schedule.isOpen
                  ? (isAr ? 'المطعم مفتوح حالياً' : 'Restaurant is currently open')
                  : (isAr ? 'المطعم مغلق حالياً' : 'Restaurant is currently closed')}
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={schedule.isOpen}
            onClick={handleToggleOpen}
            className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 self-start sm:self-center ${
              schedule.isOpen ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span className="sr-only">Toggle store status</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-flex items-center justify-center h-8 w-8 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                schedule.isOpen
                  ? (isAr ? '-translate-x-7' : 'translate-x-7')
                  : 'translate-x-0'
              }`}
            >
              <Power size={13} className={schedule.isOpen ? 'text-emerald-600' : 'text-slate-400'} />
            </span>
          </button>
        </div>

        {/* Operating Hours & Announcement Form */}
        <form onSubmit={handleSaveTimes} className="space-y-6 pt-2">
          {/* Defined Time Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Opening Time Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                  <Clock size={18} />
                </span>
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  {isAr ? 'ساعة بدء الاستقبال اليومي' : 'Daily Opening Time'}
                </label>
              </div>

              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-sans text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>

            {/* Closing Time Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                  <Clock size={18} />
                </span>
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  {isAr ? 'ساعة انتهاء العمل اليومي' : 'Daily Closing Time'}
                </label>
              </div>

              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-sans text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Emergency / Special Announcement Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                  <Bell size={16} />
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {isAr ? 'شريط التنبيهات الإعلانية أعلى الموقع' : 'Top Announcement Banner'}
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBanner}
                  onChange={(e) => setShowBanner(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-600"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {isAr ? 'إظهار للزبائن' : 'Show to customers'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'نص الإعلان (بالعربية)' : 'Announcement Text (Arabic)'}
                </label>
                <input
                  type="text"
                  value={emergencyAr}
                  onChange={(e) => setEmergencyAr(e.target.value)}
                  placeholder={isAr ? 'مثال: نرحب بزبائننا الكرام، متاح التوصيل لجميع مناطق النبك...' : 'Announcement text in Arabic...'}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? 'نص الإعلان (بالإنجليزية)' : 'Announcement Text (English)'}
                </label>
                <input
                  type="text"
                  value={emergencyEn}
                  onChange={(e) => setEmergencyEn(e.target.value)}
                  placeholder="Welcome! Home delivery is active across Al-Nabek..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-sans"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Centered Primary Action Button */}
          <div className="w-full flex justify-center pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-6">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 justify-center cursor-pointer active:scale-95"
            >
              <Save size={16} />
              <span>{isAr ? 'حفظ إعدادات التشغيل' : 'Save Operating Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};
