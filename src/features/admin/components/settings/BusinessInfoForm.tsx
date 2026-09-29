import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Banknote, Save, Check } from 'lucide-react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { settingsService } from '../../services/settingsService';
import type { BusinessInfo } from '../../types/settings.types';

export const BusinessInfoForm: React.FC = () => {
  const { isRTL } = useAdminLanguage();
  const [info, setInfo] = useState<BusinessInfo>(() => settingsService.getBusinessInfo());
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    settingsService.saveBusinessInfo(info);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-[#0f172a] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <MapPin size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {isRTL ? 'معلومات التواصل وموقع فرع النبك' : 'Branch Contact & Location Information'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL
              ? 'تحديث أرقام الهاتف، الواتساب المعتمد، وعنوان فرع النبك بشارع أمين'
              : 'Official phone, WhatsApp ordering, and Amin Street address in Al-Nabek'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Phone size={14} className="text-amber-400" />
              <span>{isRTL ? 'هاتف فرع النبك الأرضي' : 'Al-Nabek Landline Phone'}</span>
            </label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageSquare size={14} className="text-emerald-400" />
              <span>{isRTL ? 'رقم الواتساب الرسمي المعتمد للطلبات' : 'Official WhatsApp Ordering Number'}</span>
            </label>
            <input
              type="text"
              value={info.whatsapp}
              onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {isRTL ? 'العنوان التفصيلي (بالعربية)' : 'Full Address (Arabic)'}
            </label>
            <input
              type="text"
              value={info.addressAr}
              onChange={(e) => setInfo({ ...info, addressAr: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {isRTL ? 'العنوان التفصيلي (بالإنجليزية)' : 'Full Address (English)'}
            </label>
            <input
              type="text"
              value={info.addressEn}
              onChange={(e) => setInfo({ ...info, addressEn: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Delivery Estimates & Fees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock size={14} className="text-amber-400" />
              <span>{isRTL ? 'تقدير وقت التوصيل' : 'Delivery Estimate'}</span>
            </label>
            <input
              type="text"
              value={info.deliveryTimeEstimateAr}
              onChange={(e) => setInfo({ ...info, deliveryTimeEstimateAr: e.target.value })}
              placeholder="مثال: 20 - 35 دقيقة"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Banknote size={14} className="text-amber-400" />
              <span>{isRTL ? 'أجرة التوصيل (ل.س)' : 'Delivery Fee (SYP)'}</span>
            </label>
            <input
              type="number"
              step="500"
              value={info.deliveryFee}
              onChange={(e) => setInfo({ ...info, deliveryFee: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Banknote size={14} className="text-amber-400" />
              <span>{isRTL ? 'الحد الأدنى للطلب (ل.س)' : 'Minimum Order (SYP)'}</span>
            </label>
            <input
              type="number"
              step="1000"
              value={info.minimumOrder}
              onChange={(e) => setInfo({ ...info, minimumOrder: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? (isRTL ? 'تم حفظ البيانات!' : 'Saved Successfully!') : isRTL ? 'حفظ معلومات الفرع' : 'Save Branch Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
