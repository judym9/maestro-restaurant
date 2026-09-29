import React, { useState } from 'react';
import { Store, Save, Check } from 'lucide-react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { settingsService } from '../../services/settingsService';
import type { OperatingStatus } from '../../types/settings.types';

export const OperatingStatusToggle: React.FC = () => {
  const { isRTL } = useAdminLanguage();
  const [status, setStatus] = useState<OperatingStatus>(() => settingsService.getOperatingStatus());
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = () => {
    const updated = settingsService.saveOperatingStatus({ isOpen: !status.isOpen });
    setStatus(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.saveOperatingStatus(status);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Store size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {isRTL ? 'حالة المطعم والتشغيل المباشر' : 'Live Operating & Kitchen Status'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL
              ? 'التحكم الفوري في إمكانية استقبال الطلبات وإشعار الزبائن في الشريط العلوي'
              : 'Instantly toggle online ordering availability and storefront announcement'}
          </p>
        </div>
      </div>

      {/* Main Switch Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/80 border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-lg font-extrabold text-white">
              {status.isOpen
                ? isRTL
                  ? 'المطعم يستقبل الطلبات حالياً (مفتوح)'
                  : 'Kitchen is OPEN for Orders'
                : isRTL
                ? 'المطعم مغلق حالياً ولا يستقبل طلبات'
                : 'Kitchen is CLOSED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed ps-6.5">
            {status.isOpen
              ? isRTL
                ? 'سيرى الزبائن حالة المطعم مفتوح وسيتمكنون من إضافة الوجبات إلى السلة والطلب عبر الواتساب'
                : 'Customers can add meals to cart and checkout via WhatsApp'
              : isRTL
              ? 'سيتم تنبيه الزبائن بأن المطعم مغلق حالياً وسيتعذر إرسال الطلبات مؤقتاً'
              : 'Orders are paused and storefront banner indicates kitchen is closed'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            status.isOpen ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              status.isOpen ? (isRTL ? '-translate-x-8' : 'translate-x-8') : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Banner Notice & Working Hours Form */}
      <form onSubmit={handleSave} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {isRTL ? 'نص شريط الإعلان العلوي (بالعربية)' : 'Storefront Announcement Banner (Arabic)'}
          </label>
          <input
            type="text"
            value={status.bannerNoticeAr}
            onChange={(e) => setStatus({ ...status, bannerNoticeAr: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {isRTL ? 'ساعات العمل الرسمية (بالعربية)' : 'Working Hours (Arabic)'}
            </label>
            <input
              type="text"
              value={status.workingHoursAr}
              onChange={(e) => setStatus({ ...status, workingHoursAr: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {isRTL ? 'ساعات العمل الرسمية (بالإنجليزية)' : 'Working Hours (English)'}
            </label>
            <input
              type="text"
              value={status.workingHoursEn}
              onChange={(e) => setStatus({ ...status, workingHoursEn: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? (isRTL ? 'تم الحفظ بنجاح!' : 'Saved Successfully!') : isRTL ? 'حفظ إعدادات التشغيل' : 'Save Status'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
