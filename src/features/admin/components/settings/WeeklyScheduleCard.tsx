import React, { useState } from 'react';
import { Calendar, Clock, Copy, RefreshCw, CheckCircle, Save, Moon, Sun } from 'lucide-react';
import type { OperatingSchedule, DaySchedule } from '../../types/settings.types';
import { DEFAULT_WEEKLY_SCHEDULE } from '../../services/settingsRepository';

interface WeeklyScheduleCardProps {
  schedule: OperatingSchedule;
  onUpdateSchedule: (data: Partial<OperatingSchedule>, msg: string) => void;
  language: 'ar' | 'en';
}

const format12Hour = (time24: string, isAr: boolean) => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const isPm = h >= 12;
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  const padH = h < 10 ? `0${h}` : `${h}`;
  const suffix = isAr ? (isPm ? 'م' : 'ص') : (isPm ? 'PM' : 'AM');
  return `${padH}:${m} ${suffix}`;
};

export const WeeklyScheduleCard: React.FC<WeeklyScheduleCardProps> = ({
  schedule,
  onUpdateSchedule,
  language,
}) => {
  const isAr = language === 'ar';

  const [openingTime, setOpeningTime] = useState(schedule.openingTime || '12:00');
  const [closingTime, setClosingTime] = useState(schedule.closingTime || '02:00');
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(() => {
    return schedule.weeklySchedule?.length ? schedule.weeklySchedule : DEFAULT_WEEKLY_SCHEDULE;
  });
  const [savedBadge, setSavedBadge] = useState(false);

  const handleDayToggle = (dayId: string) => {
    setWeeklySchedule((prev) =>
      prev.map((day) => (day.dayId === dayId ? { ...day, isOpen: !day.isOpen } : day))
    );
  };

  const handleDayTimeChange = (dayId: string, field: 'openTime' | 'closeTime', val: string) => {
    setWeeklySchedule((prev) =>
      prev.map((day) => (day.dayId === dayId ? { ...day, [field]: val } : day))
    );
  };

  const handleApplyToAllDays = (sourceOpenTime: string, sourceCloseTime: string) => {
    setWeeklySchedule((prev) =>
      prev.map((day) => ({
        ...day,
        isOpen: true,
        openTime: sourceOpenTime,
        closeTime: sourceCloseTime,
      }))
    );
  };

  const handleToggleFridayOff = () => {
    setWeeklySchedule((prev) =>
      prev.map((day) =>
        day.dayId === 'friday' ? { ...day, isOpen: !day.isOpen } : day
      )
    );
  };

  const handleResetDefaults = () => {
    setOpeningTime('12:00');
    setClosingTime('02:00');
    setWeeklySchedule(DEFAULT_WEEKLY_SCHEDULE);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchedule(
      {
        openingTime,
        closingTime,
        weeklySchedule,
      },
      isAr ? 'تم حفظ جدول مواعيد العمل وساعات الاستقبال بنجاح' : 'Weekly business hours saved successfully'
    );
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 3000);
  };

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'جدول مواعيد العمل الأسبوعية وساعات الاستقبال' : 'Weekly Business Hours & Schedules'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'تحديد أوقات الفتح والإغلاق لكل يوم من أيام الأسبوع من السبت إلى الجمعة وتخصيص العطلات'
                : 'Configure open and close schedules for each day of the week and manage off days'}
            </p>
          </div>
        </div>

        {savedBadge && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold self-start sm:self-auto animate-in fade-in">
            <CheckCircle size={14} />
            <span>{isAr ? 'تم الحفظ بنجاح' : 'Saved'}</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 pt-5">
        {/* Master Daily Schedule Banner & Timepickers */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
                <Clock size={16} />
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                {isAr ? 'التوقيت اليومي الموحد الأساسي' : 'Master Daily Operating Schedule'}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <Sun size={13} />
              <span>{format12Hour(openingTime, isAr)}</span>
              <span>-</span>
              <Moon size={13} />
              <span>{format12Hour(closingTime, isAr)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'ساعة بدء الاستقبال اليومي' : 'Daily Opening Time'}
              </label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors font-numeric"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'ساعة انتهاء العمل اليومي' : 'Daily Closing Time'}
              </label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors font-numeric"
              />
            </div>
          </div>

          {/* Quick Helper Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => handleApplyToAllDays(openingTime, closingTime)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Copy size={13} />
              <span>{isAr ? 'تطبيق هذا التوقيت على جميع الأيام' : 'Apply Times to All Days'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleFridayOff}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Moon size={13} />
              <span>{isAr ? 'تبديل عطلة يوم الجمعة' : 'Toggle Friday Off'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 ms-auto"
            >
              <RefreshCw size={13} />
              <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Table / Row List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 px-1">
            <span>{isAr ? 'يوم الأسبوع والحالة' : 'Day of Week & Status'}</span>
            <span>{isAr ? 'ساعات العمل والمواعيد' : 'Operating Hours'}</span>
          </div>

          <div className="space-y-2">
            {weeklySchedule.map((day) => {
              const dayLabel = isAr ? day.nameAr : day.nameEn;
              const isFriday = day.dayId === 'friday';

              return (
                <div
                  key={day.dayId}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    day.isOpen
                      ? 'bg-slate-50/60 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                      : 'bg-rose-500/5 dark:bg-rose-500/5 border-rose-500/20 opacity-85'
                  }`}
                >
                  {/* Left (RTL: Right): Day Name + Open/Close Switch */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={day.isOpen}
                      onClick={() => handleDayToggle(day.dayId)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        day.isOpen ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                          day.isOpen
                            ? (isAr ? '-translate-x-5' : 'translate-x-5')
                            : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                        {dayLabel}
                      </span>
                      {isFriday && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {isAr ? 'عطلة أسبوعية محتملة' : 'Weekend'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right (RTL: Left): Time Pickers or Off Day Badge */}
                  <div className="flex items-center gap-2.5 sm:self-center">
                    {day.isOpen ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={day.openTime}
                            onChange={(e) => handleDayTimeChange(day.dayId, 'openTime', e.target.value)}
                            dir="ltr"
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 font-numeric focus:outline-none focus:border-amber-500"
                          />
                          <span className="text-xs text-slate-400">→</span>
                          <input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => handleDayTimeChange(day.dayId, 'closeTime', e.target.value)}
                            dir="ltr"
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 font-numeric focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <span className="hidden md:inline-block px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                          {format12Hour(day.openTime, isAr)} - {format12Hour(day.closeTime, isAr)}
                        </span>

                        <button
                          type="button"
                          title={isAr ? 'نسخ هذا التوقيت لباقي الأيام' : 'Copy to all days'}
                          onClick={() => handleApplyToAllDays(day.openTime, day.closeTime)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold">
                        {isAr ? 'عطلة (مغلق طوال اليوم)' : 'Closed / Off Day'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Save Action */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Save size={16} />
            <span>{isAr ? 'حفظ جدول مواعيد العمل' : 'Save Working Hours'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
