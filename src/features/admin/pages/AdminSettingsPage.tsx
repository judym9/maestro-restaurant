import React, { useState } from 'react';
import {
  Store,
  Clock,
  Phone,
  Truck,
  Save,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { useAdminToast } from '../context/AdminToastContext';
import type { BranchContactInfo, DaySchedule, OperatingSchedule } from '../types/settings.types';

type SettingsTab = 'identity' | 'contact' | 'schedule' | 'delivery';

export const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useAdminToast();

  const {
    contactInfo,
    operatingSchedule,
    saveBranchInfo,
    saveSchedule,
    toggleOpenStatus,
  } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // Local draft states
  const [contactDraft, setContactDraft] = useState<BranchContactInfo>(contactInfo);
  const [scheduleDraft, setScheduleDraft] = useState<OperatingSchedule>(operatingSchedule);

  const handleContactChange = (field: keyof BranchContactInfo, value: string) => {
    setContactDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (field: keyof OperatingSchedule, value: any) => {
    setScheduleDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleDayChange = (dayId: string, field: keyof DaySchedule, value: any) => {
    setScheduleDraft((prev) => {
      const scheduleList = prev.weeklySchedule ? [...prev.weeklySchedule] : [];
      const index = scheduleList.findIndex((d) => d.dayId === dayId);
      if (index >= 0) {
        scheduleList[index] = { ...scheduleList[index], [field]: value };
      }
      return { ...prev, weeklySchedule: scheduleList };
    });
  };

  const replicateScheduleToAllDays = (sourceDayId: string) => {
    const sourceDay = scheduleDraft.weeklySchedule?.find((d) => d.dayId === sourceDayId);
    if (!sourceDay) return;

    setScheduleDraft((prev) => {
      const scheduleList = prev.weeklySchedule?.map((d) => ({
        ...d,
        isOpen: sourceDay.isOpen,
        openTime: sourceDay.openTime,
        closeTime: sourceDay.closeTime,
      }));
      return { ...prev, weeklySchedule: scheduleList };
    });

    showToast(
      'info',
      language === 'ar'
        ? `تم نسخ أوقات (${sourceDay.nameAr}) إلى كامل أيام الأسبوع`
        : `Replicated ${sourceDay.nameEn} times across all days`
    );
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    saveBranchInfo(
      contactDraft,
      language === 'ar' ? 'تم حفظ بيانات وهوية المطعم بنجاح' : 'Restaurant profile saved successfully'
    );
    showToast('success', language === 'ar' ? 'تم تحديث معلومات المطعم بنجاح' : 'Restaurant details updated successfully');
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchedule(
      scheduleDraft,
      language === 'ar' ? 'تم حفظ جدول ساعات العمل وقواعد التوصيل' : 'Operating schedule saved successfully'
    );
    showToast('success', language === 'ar' ? 'تم تحديث ساعات العمل وشروط التوصيل' : 'Schedule and delivery settings saved');
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight font-['Cairo',sans-serif]">
            {language === 'ar' ? 'إعدادات الفرع وملف المطعم' : 'Restaurant Profile & Branch Settings'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {language === 'ar'
              ? 'التحكم بالهوية، أرقام التواصل، الدوام الأسبوعي، ومناطق التوصيل'
              : 'Configure brand identity, contact channels, weekly working schedule & delivery rules'}
          </p>
        </div>

        {/* Master Kitchen Quick Toggle */}
        <div className="flex items-center gap-3 p-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <span className="text-xs font-bold text-[var(--text-primary)] ps-2">
            {language === 'ar' ? 'حالة المطبخ الحالية:' : 'Kitchen Live State:'}
          </span>
          <button
            type="button"
            onClick={toggleOpenStatus}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              operatingSchedule.isOpen
                ? 'bg-emerald-600 text-white shadow-emerald-900/20 shadow-md'
                : 'bg-rose-600 text-white shadow-rose-900/20 shadow-md'
            }`}
          >
            {operatingSchedule.isOpen
              ? language === 'ar'
                ? 'المطبخ يعمل (مفتوح)'
                : 'Kitchen Open'
              : language === 'ar'
              ? 'المطبخ متوقف (مغلق)'
              : 'Kitchen Closed'}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'identity'
              ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>{language === 'ar' ? 'الهوية والقصة' : 'Identity & Brand'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'contact'
              ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>{language === 'ar' ? 'الاتصال والموقع' : 'Contacts & Location'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'schedule'
              ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Schedule'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'delivery'
              ? 'bg-[var(--accent-gold)] text-[var(--btn-primary-text)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{language === 'ar' ? 'شروط التوصيل' : 'Delivery Rules'}</span>
        </button>
      </div>

      {/* Tab 1: Identity & Story */}
      {activeTab === 'identity' && (
        <form onSubmit={handleSaveContact} className="flex flex-col gap-6 p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Store className="w-5 h-5 text-[var(--accent-gold)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {language === 'ar' ? 'الهوية العامة وتفاصيل العلامة التجارية' : 'Brand Identity & About Story'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'اسم المطعم (بالعربية)' : 'Restaurant Name (Arabic)'}
              </label>
              <input
                type="text"
                value={contactDraft.restaurantNameAr}
                onChange={(e) => handleContactChange('restaurantNameAr', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'اسم المطعم (بالإنجليزية)' : 'Restaurant Name (English)'}
              </label>
              <input
                type="text"
                value={contactDraft.restaurantNameEn}
                onChange={(e) => handleContactChange('restaurantNameEn', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الشعار الترويجي (بالعربية)' : 'Tagline (Arabic)'}
              </label>
              <input
                type="text"
                value={contactDraft.taglineAr || ''}
                onChange={(e) => handleContactChange('taglineAr', e.target.value)}
                placeholder="سيمفونية المذاق الأصيل..."
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الشعار الترويجي (بالإنجليزية)' : 'Tagline (English)'}
              </label>
              <input
                type="text"
                value={contactDraft.taglineEn || ''}
                onChange={(e) => handleContactChange('taglineEn', e.target.value)}
                placeholder="The Symphony of Levantine Flavors..."
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'قصة المطعم ومن نحن (بالعربية)' : 'About Story (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={contactDraft.aboutStoryAr || ''}
                onChange={(e) => handleContactChange('aboutStoryAr', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] resize-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'قصة المطعم ومن نحن (بالإنجليزية)' : 'About Story (English)'}
              </label>
              <textarea
                rows={3}
                value={contactDraft.aboutStoryEn || ''}
                onChange={(e) => handleContactChange('aboutStoryEn', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-gold)] resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Social Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">Instagram URL</label>
              <input
                type="url"
                value={contactDraft.instagramUrl || ''}
                onChange={(e) => handleContactChange('instagramUrl', e.target.value)}
                className="px-3 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">Facebook URL</label>
              <input
                type="url"
                value={contactDraft.facebookUrl || ''}
                onChange={(e) => handleContactChange('facebookUrl', e.target.value)}
                className="px-3 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">TikTok URL</label>
              <input
                type="url"
                value={contactDraft.tiktokUrl || ''}
                onChange={(e) => handleContactChange('tiktokUrl', e.target.value)}
                className="px-3 py-2 rounded-xl text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-md transition-all min-h-[42px]"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ الهوية' : 'Save Identity'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Contact & Location */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="flex flex-col gap-6 p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Phone className="w-5 h-5 text-[var(--accent-gold)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {language === 'ar' ? 'أرقام الاتصال وقنوات الطلب المباشر والموقع' : 'Contacts, Orders & Geographic Location'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'هاتف الطلبات الرئيسي' : 'Primary Phone'}
              </label>
              <input
                type="tel"
                value={contactDraft.phonePrimary}
                onChange={(e) => handleContactChange('phonePrimary', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'هاتف الاستفسارات البديل' : 'Secondary Phone'}
              </label>
              <input
                type="tel"
                value={contactDraft.phoneSecondary}
                onChange={(e) => handleContactChange('phoneSecondary', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'رقم واتساب الطلبات' : 'WhatsApp Orders'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactDraft.whatsappNumber}
                  onChange={(e) => handleContactChange('whatsappNumber', e.target.value)}
                  className="w-full ps-3.5 pe-10 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
                />
                <a
                  href={`https://wa.me/${contactDraft.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-emerald-400 hover:text-emerald-300"
                  title="Test WhatsApp Link"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'العنوان الفعلي (بالعربية)' : 'Physical Address (Arabic)'}
              </label>
              <input
                type="text"
                value={contactDraft.addressAr}
                onChange={(e) => handleContactChange('addressAr', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'العنوان الفعلي (بالإنجليزية)' : 'Physical Address (English)'}
              </label>
              <input
                type="text"
                value={contactDraft.addressEn}
                onChange={(e) => handleContactChange('addressEn', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center justify-between">
              <span>{language === 'ar' ? 'رابط خرائط غوغل (Google Maps URL)' : 'Google Maps Location URL'}</span>
              {contactDraft.googleMapsUrl && (
                <a
                  href={contactDraft.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[var(--accent-gold)] flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{language === 'ar' ? 'معاينة الموقع' : 'Preview Map'}</span>
                </a>
              )}
            </label>
            <input
              type="url"
              value={contactDraft.googleMapsUrl}
              onChange={(e) => handleContactChange('googleMapsUrl', e.target.value)}
              className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-md transition-all min-h-[42px]"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ معلومات الاتصال' : 'Save Contacts'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Weekly Schedule & Emergency Banner */}
      {activeTab === 'schedule' && (
        <form onSubmit={handleSaveSchedule} className="flex flex-col gap-6 p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--accent-gold)]" />
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {language === 'ar' ? 'جدول ساعات الدوام الأسبوعية بالتفصيل' : 'Detailed Weekly Operating Schedule'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleDraft.is24HourFormat || false}
                  onChange={(e) => handleScheduleChange('is24HourFormat', e.target.checked)}
                  className="rounded text-[var(--accent-gold)]"
                />
                <span>{language === 'ar' ? 'نظام 24 ساعة' : '24h Time Format'}</span>
              </label>
            </div>
          </div>

          {/* Days Table */}
          <div className="flex flex-col gap-3">
            {scheduleDraft.weeklySchedule?.map((day) => (
              <div
                key={day.dayId}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 ${
                  day.isOpen
                    ? 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]'
                    : 'border-rose-500/20 bg-rose-500/5 opacity-60'
                }`}
              >
                {/* Day Name & Toggle */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.isOpen}
                      onChange={(e) => handleDayChange(day.dayId, 'isOpen', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {language === 'ar' ? day.nameAr : day.nameEn}
                    </span>
                  </label>
                </div>

                {/* Times Pickers */}
                {day.isOpen ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                    <span>{language === 'ar' ? 'من:' : 'From:'}</span>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => handleDayChange(day.dayId, 'openTime', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono outline-none"
                    />
                    <span>{language === 'ar' ? 'إلى:' : 'To:'}</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => handleDayChange(day.dayId, 'closeTime', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-rose-400">
                    {language === 'ar' ? 'عطلة أسبوعية (مغلق)' : 'Day Off (Closed)'}
                  </span>
                )}

                {/* Replicate Button */}
                {day.isOpen && (
                  <button
                    type="button"
                    onClick={() => replicateScheduleToAllDays(day.dayId)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-gold)] hover:underline self-end sm:self-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{language === 'ar' ? 'نسخ لكافة الأيام' : 'Copy to all days'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Emergency Announcement Banner Toggle */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 mt-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleDraft.showEmergencyBanner}
                  onChange={(e) => handleScheduleChange('showEmergencyBanner', e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {language === 'ar' ? 'تفعيل شريط التنبيهات الإدارية العاجلة في أعلى الموقع' : 'Enable Emergency Header Banner'}
                </span>
              </label>
            </div>

            {scheduleDraft.showEmergencyBanner && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <input
                  type="text"
                  value={scheduleDraft.emergencyNoticeAr}
                  onChange={(e) => handleScheduleChange('emergencyNoticeAr', e.target.value)}
                  placeholder="نص التنبيه بالعربية (مثال: نعتذر عن استقبال الطلبات مؤقتاً بسبب أعمال الصيانة)..."
                  className="px-3.5 py-2 rounded-xl text-xs border border-amber-500/30 bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
                  dir="rtl"
                />
                <input
                  type="text"
                  value={scheduleDraft.emergencyNoticeEn}
                  onChange={(e) => handleScheduleChange('emergencyNoticeEn', e.target.value)}
                  placeholder="Emergency notice in English..."
                  className="px-3.5 py-2 rounded-xl text-xs border border-amber-500/30 bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none"
                  dir="ltr"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-md transition-all min-h-[42px]"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ جدول الدوام' : 'Save Weekly Schedule'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Delivery Rules */}
      {activeTab === 'delivery' && (
        <form onSubmit={handleSaveSchedule} className="flex flex-col gap-6 p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Truck className="w-5 h-5 text-[var(--accent-gold)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {language === 'ar' ? 'معايير التوصيل السريع والحد الأدنى للطلبات' : 'Delivery Parameters & Minimum Order Values'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'أجور التوصيل الافتراضية (ل.س)' : 'Delivery Fee (SP)'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={scheduleDraft.deliveryFee || 0}
                onChange={(e) => handleScheduleChange('deliveryFee', Number(e.target.value) || 0)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الحد الأدنى لقيمة الطلب (ل.س)' : 'Minimum Order Amount (SP)'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={scheduleDraft.minOrderAmount || 0}
                onChange={(e) => handleScheduleChange('minOrderAmount', Number(e.target.value) || 0)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'نسبة الضريبة / القيمة المضافة (%)' : 'VAT / Tax Rate (%)'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={scheduleDraft.taxRatePercent || 0}
                onChange={(e) => handleScheduleChange('taxRatePercent', Number(e.target.value) || 0)}
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الوقت المتوقع للتوصيل (بالعربية)' : 'Estimated Delivery Time (Arabic)'}
              </label>
              <input
                type="text"
                value={scheduleDraft.estimatedDeliveryTimeAr || ''}
                onChange={(e) => handleScheduleChange('estimatedDeliveryTimeAr', e.target.value)}
                placeholder="30 - 45 دقيقة"
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                {language === 'ar' ? 'الوقت المتوقع للتوصيل (بالإنجليزية)' : 'Estimated Delivery Time (English)'}
              </label>
              <input
                type="text"
                value={scheduleDraft.estimatedDeliveryTimeEn || ''}
                onChange={(e) => handleScheduleChange('estimatedDeliveryTimeEn', e.target.value)}
                placeholder="30 - 45 mins"
                className="px-3.5 py-2.5 rounded-xl text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--accent-gold)] text-[var(--btn-primary-text)] hover:bg-[var(--gold-600)] shadow-md transition-all min-h-[42px]"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ شروط التوصيل' : 'Save Delivery Rules'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettingsPage;
