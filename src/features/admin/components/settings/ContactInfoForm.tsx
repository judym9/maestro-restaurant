import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Building2, Globe, CheckCircle, Save, Clock } from 'lucide-react';
import type { BranchContactInfo } from '../../types/settings.types';
import { Card } from '../common/Card';

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

  const handleChange = (key: keyof BranchContactInfo, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
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

  return (
    <Card
      variant="default"
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <Building2 size={20} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'معلومات فرع النبك وقنوات الاتصال' : 'Al-Nabek Branch & Contact Channels'}
              </h3>
            </div>
          </div>

          {savedBadge && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-fade-in">
              <CheckCircle size={14} />
              <span>{isAr ? 'تم الحفظ' : 'Saved'}</span>
            </span>
          )}
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-1">
        {/* Balanced 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Row 1: Restaurant Names */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {isAr ? 'اسم المطعم (بالعربية) *' : 'Restaurant Name (Arabic) *'}
            </label>
            <input
              type="text"
              required
              value={formData.restaurantNameAr}
              onChange={(e) => handleChange('restaurantNameAr', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {isAr ? 'اسم المطعم (بالإنجليزية) *' : 'Restaurant Name (English) *'}
            </label>
            <input
              type="text"
              required
              value={formData.restaurantNameEn}
              onChange={(e) => handleChange('restaurantNameEn', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>

          {/* Row 2: Branch Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin size={15} className="text-amber-500" />
              <span>{isAr ? 'العنوان بالعربية (فرع النبك) *' : 'Arabic Address (Al-Nabek) *'}</span>
            </label>
            <input
              type="text"
              required
              value={formData.addressAr}
              onChange={(e) => handleChange('addressAr', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin size={15} className="text-amber-500" />
              <span>{isAr ? 'العنوان بالإنجليزية *' : 'English Address *'}</span>
            </label>
            <input
              type="text"
              required
              value={formData.addressEn}
              onChange={(e) => handleChange('addressEn', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>

          {/* Row 3: Display Hours Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock size={15} className="text-amber-500" />
              <span>{isAr ? 'صيغة أوقات العمل المعروضة (عربي)' : 'Display Hours Text (Arabic)'}</span>
            </label>
            <input
              type="text"
              value={formData.workingHoursAr}
              onChange={(e) => handleChange('workingHoursAr', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock size={15} className="text-amber-500" />
              <span>{isAr ? 'صيغة أوقات العمل المعروضة (English)' : 'Display Hours Text (English)'}</span>
            </label>
            <input
              type="text"
              value={formData.workingHoursEn}
              onChange={(e) => handleChange('workingHoursEn', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>

          {/* Row 4: Phone & WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone size={15} className="text-amber-500" />
              <span>{isAr ? 'الهاتف الرئيسي *' : 'Primary Phone *'}</span>
            </label>
            <input
              type="text"
              required
              value={formData.phonePrimary}
              onChange={(e) => handleChange('phonePrimary', e.target.value)}
              placeholder="0969 697 587"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare size={15} className="text-emerald-500" />
              <span>{isAr ? 'رقم واتساب استلام الطلبات *' : 'Order WhatsApp (963...)'}</span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="963969697587"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>

          {/* Row 5: Secondary Phone */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone size={15} className="text-slate-400" />
              <span>{isAr ? 'الهاتف الأرضي / الثانوي' : 'Secondary Phone (Landline)'}</span>
            </label>
            <input
              type="text"
              value={formData.phoneSecondary}
              onChange={(e) => handleChange('phoneSecondary', e.target.value)}
              placeholder="011 722 0000"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>

          {/* Row 6: Google Maps URL (Full Width) */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe size={15} className="text-amber-500" />
              <span>{isAr ? 'رابط خرائط Google لموقع المطعم' : 'Google Maps Location Link'}</span>
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-all font-sans text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* Centered Primary Action Button */}
        <div className="w-full flex justify-center pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-6">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 justify-center cursor-pointer active:scale-95"
          >
            <Save size={16} />
            <span>{isAr ? 'حفظ ونشر بيانات الفرع' : 'Save Branch Information'}</span>
          </button>
        </div>
      </form>
    </Card>
  );
};
