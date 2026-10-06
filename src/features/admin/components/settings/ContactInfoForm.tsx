import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  MessageSquare,
  Globe,
  Clock,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  Save,
} from 'lucide-react';
import type { BranchContactInfo } from '../../types/settings.types';

interface ContactInfoFormProps {
  contactInfo: BranchContactInfo;
  onSave: (data: Partial<BranchContactInfo>, successMessage: string) => void;
  language: 'ar' | 'en';
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  contactInfo,
  onSave,
  language,
}) => {
  const isAr = language === 'ar';

  const [formData, setFormData] = useState<BranchContactInfo>(contactInfo);
  const [savedBadge, setSavedBadge] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleChange = (key: keyof BranchContactInfo, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopyAddress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(isAr ? formData.addressAr : formData.addressEn);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      formData,
      isAr ? 'تم تحديث بيانات فرع النبك ومعلومات التواصل بنجاح' : 'Al-Nabek branch contact details updated successfully'
    );
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 3000);
  };

  const cleanWhatsapp = formData.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {isAr ? 'معلومات فرع النبك وقنوات الاتصال' : 'Al-Nabek Branch & Contact Channels'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {isAr
                ? 'إدارة أسماء الفرع الرسمية، العناوين الجغرافية، وأرقام التواصل المباشرة مع الزبائن'
                : 'Manage official restaurant names, location addresses, and customer communication lines'}
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

      <form onSubmit={handleSubmit} className="space-y-6 pt-5">
        {/* Section 1: Names & Identity */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={13} className="text-amber-500" />
            <span>{isAr ? 'اسم المطعم والعلامة التجارية' : 'Restaurant Identity'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'اسم المطعم (بالعربية) *' : 'Restaurant Name (Arabic) *'}
              </label>
              <input
                type="text"
                required
                value={formData.restaurantNameAr}
                onChange={(e) => handleChange('restaurantNameAr', e.target.value)}
                placeholder="مايسترو النبك"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'اسم المطعم (بالإنجليزية) *' : 'Restaurant Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={formData.restaurantNameEn}
                onChange={(e) => handleChange('restaurantNameEn', e.target.value)}
                placeholder="Maestro Al-Nabek"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-sans"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Addresses & Maps */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={13} className="text-amber-500" />
            <span>{isAr ? 'العنوان الفعلي ورابط الموقع الجغرافي' : 'Location & Address Details'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'العنوان بالعربية (فرع النبك) *' : 'Address in Arabic *'}
              </label>
              <input
                type="text"
                required
                value={formData.addressAr}
                onChange={(e) => handleChange('addressAr', e.target.value)}
                placeholder="شارع الأمين، النبك، ريف دمشق، سوريا"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'العنوان بالإنجليزية *' : 'Address in English *'}
              </label>
              <input
                type="text"
                required
                value={formData.addressEn}
                onChange={(e) => handleChange('addressEn', e.target.value)}
                placeholder="Amin Street, Al-Nabek, Rural Damascus, Syria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-sans"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  {isAr ? 'رابط خرائط Google لموقع المطعم' : 'Google Maps Location URL'}
                </label>
                {formData.googleMapsUrl && (
                  <a
                    href={formData.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isAr ? 'اختبار الرابط' : 'Open Link'}</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <div className="relative flex items-center">
                <Globe size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-sans"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Contact Channels */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Phone size={13} className="text-amber-500" />
            <span>{isAr ? 'قنوات الاتصال المباشرة وخدمة الطلبات' : 'Direct Contact & Order Channels'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'الهاتف الرئيسي *' : 'Primary Phone *'}
              </label>
              <div className="relative flex items-center">
                <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.phonePrimary}
                  onChange={(e) => handleChange('phonePrimary', e.target.value)}
                  placeholder="0969 697 587"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'واتساب استلام الطلبات *' : 'WhatsApp Orders *'}
              </label>
              <div className="relative flex items-center">
                <MessageSquare size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="963969697587"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'الهاتف الأرضي / الثانوي' : 'Secondary Phone (Landline)'}
              </label>
              <div className="relative flex items-center">
                <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={formData.phoneSecondary}
                  onChange={(e) => handleChange('phoneSecondary', e.target.value)}
                  placeholder="011 722 0000"
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-numeric"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Displayed Hours Text */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-amber-500" />
            <span>{isAr ? 'صيغة أوقات العمل المعروضة للزبائن' : 'Customer Displayed Hours Text'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'صيغة أوقات العمل المعروضة (بالعربية)' : 'Display Hours Text (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.workingHoursAr}
                onChange={(e) => handleChange('workingHoursAr', e.target.value)}
                placeholder="يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                {isAr ? 'صيغة أوقات العمل المعروضة (English)' : 'Display Hours Text (English)'}
              </label>
              <input
                type="text"
                value={formData.workingHoursEn}
                onChange={(e) => handleChange('workingHoursEn', e.target.value)}
                placeholder="Daily: 12:00 PM - 02:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors text-left font-sans"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Live Interactive Testing & Preview Toolbar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
            <ExternalLink size={13} className="text-amber-500" />
            <span>{isAr ? 'تجربة قنوات الاتصال والروابط مباشرة من لوحة التحكم:' : 'Test Direct Links & Channels:'}</span>
          </span>

          <div className="flex flex-wrap items-center gap-2.5">
            {formData.phonePrimary && (
              <a
                href={`tel:${formData.phonePrimary.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-amber-500/50 text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <Phone size={13} className="text-amber-500" />
                <span>{isAr ? 'اتصال تجريبي' : 'Dial Phone'}</span>
              </a>
            )}

            {cleanWhatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-emerald-500/50 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare size={13} className="text-emerald-500" />
                <span>{isAr ? 'فتح محادثة واتساب' : 'Open WhatsApp'}</span>
              </a>
            )}

            {formData.googleMapsUrl && (
              <a
                href={formData.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-blue-500/50 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <MapPin size={13} className="text-blue-500" />
                <span>{isAr ? 'عرض الموقع على الخريطة' : 'View on Maps'}</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyAddress}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-slate-400 text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-slate-400" />
                  <span>{isAr ? 'نسخ العنوان' : 'Copy Address'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Save Action */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 flex items-center gap-2 cursor-pointer text-sm"
          >
            <Save size={16} />
            <span>{isAr ? 'حفظ ونشر بيانات الفرع' : 'Save Branch Information'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
