import React, { useState } from 'react';
import { Bike, Bell, Sparkles, CheckCircle, Save, Clock } from 'lucide-react';
import type { OperatingSchedule } from '../../types/settings.types';

interface DeliverySettingsCardProps {
  schedule: OperatingSchedule;
  onUpdateSchedule: (data: Partial<OperatingSchedule>, msg: string) => void;
  language: 'ar' | 'en';
}

export const DeliverySettingsCard: React.FC<DeliverySettingsCardProps> = ({
  schedule,
  onUpdateSchedule,
  language,
}) => {
  const isAr = language === 'ar';

  const [deliveryTimeAr, setDeliveryTimeAr] = useState(schedule.estimatedDeliveryTimeAr || '30 - 45 دقيقة');
  const [deliveryTimeEn, setDeliveryTimeEn] = useState(schedule.estimatedDeliveryTimeEn || '30 - 45 mins');
  const [minOrder, setMinOrder] = useState<number>(schedule.minOrderAmount || 50000);
  const [deliveryFee, setDeliveryFee] = useState<number>(schedule.deliveryFee || 15000);
  const [showBanner, setShowBanner] = useState<boolean>(schedule.showEmergencyBanner);
  const [noticeAr, setNoticeAr] = useState(schedule.emergencyNoticeAr || '');
  const [noticeEn, setNoticeEn] = useState(schedule.emergencyNoticeEn || '');
  const [savedBadge, setSavedBadge] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchedule(
      {
        estimatedDeliveryTimeAr: deliveryTimeAr,
        estimatedDeliveryTimeEn: deliveryTimeEn,
        minOrderAmount: Number(minOrder),
        deliveryFee: Number(deliveryFee),
        showEmergencyBanner: showBanner,
        emergencyNoticeAr: noticeAr,
        emergencyNoticeEn: noticeEn,
      },
      isAr ? 'تم حفظ إعدادات التوصيل وشريط التنبيهات بنجاح' : 'Delivery & announcement settings saved successfully'
    );
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 3000);
  };

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Bike size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'إعدادات الطلب والتوصيل وشريط الإعلانات' : 'Delivery Settings & Top Announcement'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'إدارة سرعة التوصيل المقدرة، الحد الأدنى للطلب، والشريط الإعلاني المنبثق أعلى المتجر'
                : 'Configure delivery speed, minimum order thresholds, and top alert banners'}
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
        {/* Section 1: Delivery Parameters */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-emerald-500" />
            <span>{isAr ? 'مؤشرات التوصيل والحدود المالية' : 'Delivery Metrics & Order Thresholds'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'وقت التوصيل التقديري (بالعربية) *' : 'Estimated Delivery Time (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={deliveryTimeAr}
                onChange={(e) => setDeliveryTimeAr(e.target.value)}
                placeholder="30 - 45 دقيقة"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'وقت التوصيل بالإنجليزية *' : 'Estimated Delivery Time (English) *'}
              </label>
              <input
                type="text"
                required
                value={deliveryTimeEn}
                onChange={(e) => setDeliveryTimeEn(e.target.value)}
                placeholder="30 - 45 mins"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-sans"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'الحد الأدنى لقيمة الطلب (ل.س)' : 'Minimum Order Amount (SYP)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  placeholder="50000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors font-numeric text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'رسوم التوصيل المقدرة داخل النبك (ل.س)' : 'Delivery Fee within Al-Nabek (SYP)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  placeholder="15000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors font-numeric text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Top Announcement Alert Banner */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                <Bell size={16} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {isAr ? 'شريط التنبيهات الإعلانية أعلى الموقع' : 'Top Website Announcement Banner'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {isAr
                    ? 'يظهر كشريط مميز أعلى جميع صفحات المتجر للإعلان عن فترات الأعياد أو العروض الخاصة'
                    : 'Displays as a prominent bar at the top of all pages for events or updates'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 hidden sm:inline">
                {showBanner ? (isAr ? 'مفعل للزبائن' : 'Visible') : (isAr ? 'معطل' : 'Disabled')}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showBanner}
                onClick={() => setShowBanner(!showBanner)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  showBanner ? 'bg-amber-500' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    showBanner
                      ? (isAr ? '-translate-x-5' : 'translate-x-5')
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'نص الإعلان (بالعربية)' : 'Announcement Text (Arabic)'}
              </label>
              <input
                type="text"
                value={noticeAr}
                onChange={(e) => setNoticeAr(e.target.value)}
                placeholder={isAr ? 'مثال: نرحب بزبائننا الكرام، متاح التوصيل لجميع مناطق النبك...' : 'Announcement text in Arabic...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'نص الإعلان (بالإنجليزية)' : 'Announcement Text (English)'}
              </label>
              <input
                type="text"
                value={noticeEn}
                onChange={(e) => setNoticeEn(e.target.value)}
                placeholder="Welcome! Home delivery is active across Al-Nabek..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-sans"
                dir="ltr"
              />
            </div>
          </div>

          {/* Live Mockup Preview Strip */}
          <div className="pt-2">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              <span>{isAr ? 'معاينة حية لشكل الشريط كما يظهر للزبون أعلى الموقع:' : 'Live Banner Preview (Customer View):'}</span>
            </span>

            <div
              className={`p-3 rounded-lg border transition-all text-xs font-medium flex items-center justify-center text-center gap-2 ${
                showBanner
                  ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 shadow-sm'
                  : 'bg-slate-100 dark:bg-zinc-800/60 text-slate-400 dark:text-zinc-500 border-dashed border-slate-200 dark:border-zinc-700'
              }`}
            >
              <Bell size={14} className={showBanner ? 'text-amber-500 shrink-0' : 'text-slate-400 shrink-0'} />
              <span>
                {showBanner
                  ? (isAr ? (noticeAr || 'نص الإعلان فارغ حالياً') : (noticeEn || 'Announcement text is empty'))
                  : (isAr ? 'الشريط الإعلاني معطل حالياً ولن يظهر للزبائن' : 'Banner is currently disabled')}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Save Action */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Save size={16} />
            <span>{isAr ? 'حفظ إعدادات التوصيل والإعلانات' : 'Save Delivery & Alerts'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
