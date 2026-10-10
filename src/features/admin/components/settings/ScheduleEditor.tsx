import React from 'react';
import { Copy, CheckCircle2, XCircle } from 'lucide-react';
import type { DaySchedule } from '../../types/settings.types';

export interface ScheduleEditorProps {
  schedule: DaySchedule[];
  onChange: (schedule: DaySchedule[]) => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  schedule,
  onChange,
}) => {
  const handleToggleDay = (dayId: string) => {
    const updated = schedule.map((d) =>
      d.dayId === dayId ? { ...d, isOpen: !d.isOpen } : d
    );
    onChange(updated);
  };

  const handleTimeChange = (
    dayId: string,
    field: 'openTime' | 'closeTime',
    val: string
  ) => {
    const updated = schedule.map((d) =>
      d.dayId === dayId ? { ...d, [field]: val } : d
    );
    onChange(updated);
  };

  const handleApplyToAllDays = (sourceDay: DaySchedule) => {
    const updated = schedule.map((d) => ({
      ...d,
      isOpen: sourceDay.isOpen,
      openTime: sourceDay.openTime,
      closeTime: sourceDay.closeTime,
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-300">
          جدول الدوام الأسبوعي لفرع النبك (7 أيام)
        </span>
        <span className="text-[11px] text-slate-500">
          نظام 24 ساعة (مثال: 12:00 إلى 02:00)
        </span>
      </div>

      <div className="space-y-2.5">
        {schedule.map((day) => (
          <div
            key={day.dayId}
            className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-3.5 p-3.5 px-4 sm:px-5 rounded-xl border transition-all ${
              day.isOpen
                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-sm'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            {/* Day name & status switch */}
            <div className="flex items-center gap-3 w-40 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleDay(day.dayId)}
                title={day.isOpen ? 'تعطيل اليوم (عطلة)' : 'تفعيل استقبال الطلبات'}
                className={`p-2 rounded-xl border transition-colors shrink-0 ${
                  day.isOpen
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                }`}
              >
                {day.isOpen ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </button>
              <div>
                <span className="text-sm font-bold text-white block">
                  {day.nameAr}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {day.nameEn}
                </span>
              </div>
            </div>

            {/* Time inputs */}
            {day.isOpen ? (
              <div className="flex items-center gap-4 flex-1 justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">من:</span>
                  <input
                    type="time"
                    value={day.openTime}
                    onChange={(e) =>
                      handleTimeChange(day.dayId, 'openTime', e.target.value)
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">إلى:</span>
                  <input
                    type="time"
                    value={day.closeTime}
                    onChange={(e) =>
                      handleTimeChange(day.dayId, 'closeTime', e.target.value)
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 text-xs text-rose-400/80 italic text-center sm:text-start py-1">
                عطلة رسمية — المطبخ مغلق
              </div>
            )}

            {/* Copy to all days button */}
            <button
              type="button"
              onClick={() => handleApplyToAllDays(day)}
              title="تطبيق هذا التوقيت على كافة أيام الأسبوع"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ للكل</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleEditor;
