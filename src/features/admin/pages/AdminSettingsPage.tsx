import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Store,
  Phone,
  Clock,
  Truck,
  Save,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { useAdminToast } from '../context/AdminToastContext';
import { ScheduleEditor } from '../components/settings/ScheduleEditor';
import type { BranchContactInfo, DaySchedule, OperatingSchedule } from '../types/settings.types';
import { sanitizePhoneNumber } from '../utils/mathCalculations';

type SettingsTab = 'identity' | 'contact' | 'schedule' | 'delivery';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useAdminToast();
  const {
    contactInfo,
    operatingSchedule,
    saveBranchInfo,
    saveSchedule,
  } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // Local draft state for contact info
  const [draftContact, setDraftContact] = useState<BranchContactInfo>(() => ({
    ...contactInfo,
  }));

  // Local draft state for schedule
  const [draftSchedule, setDraftSchedule] = useState<OperatingSchedule>(() => ({
    ...operatingSchedule,
    weeklySchedule: operatingSchedule.weeklySchedule || [],
  }));

  // Handle Input Changes for Contact Info
  const handleContactChange = (field: keyof BranchContactInfo, value: any) => {
    setDraftContact((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Input Changes for Operating Schedule
  const handleScheduleChange = (field: keyof OperatingSchedule, value: any) => {
    setDraftSchedule((prev) => ({ ...prev, [field]: value }));
  };

  // Save All Handler
  const handleSaveAll = () => {
    saveBranchInfo(draftContact, 'تم حفظ بيانات الفرع بنجاح');
    saveSchedule(draftSchedule, 'تم حفظ جدول الدوام الأسبوعي بنجاح');
    showToast('success', 'تم حفظ كافة إعدادات المطعم والفرع بنجاح');
  };

  // Reset to Loaded State
  const handleReset = () => {
    setDraftContact({ ...contactInfo });
    setDraftSchedule({
      ...operatingSchedule,
      weeklySchedule: operatingSchedule.weeklySchedule || [],
    });
    showToast('info', 'تمت استعادة الإعدادات الأصلية');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 pb-3.5 sm:pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 sm:gap-2.5">
            <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            <span>إعدادات المطعم والفرع</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
            إدارة الهوية الرسمية، بيانات التواصل، الجدول الأسبوعي، وشروط التوصيل لفرع النبك
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation: frictionless horizontal scrolling */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: 'identity', label: 'هوية المطعم والقصة', icon: Store },
          { id: 'contact', label: 'الاتصال والموقع الجغرافي', icon: Phone },
          { id: 'schedule', label: 'ساعات العمل الأسبوعية', icon: Clock },
          { id: 'delivery', label: 'شروط التوصيل والطلب', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Restaurant Identity & Story */}
      {activeTab === 'identity' && (
        <div className="p-4.5 sm:p-7 rounded-2xl bg-slate-900/50 sm:bg-[#0b101b] border border-slate-800/80 space-y-5 sm:space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اسم المطعم بالعربية
              </label>
              <input
                type="text"
                value={draftContact.restaurantNameAr}
                onChange={(e) => handleContactChange('restaurantNameAr', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                اسم المطعم بالإنجليزية
              </label>
              <input
                type="text"
                value={draftContact.restaurantNameEn}
                onChange={(e) => handleContactChange('restaurantNameEn', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                الشعار اللفظي الترويجي بالعربية (Tagline)
              </label>
              <input
                type="text"
                value={draftContact.taglineAr || ''}
                onChange={(e) => handleContactChange('taglineAr', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                الشعار اللفظي بالإنجليزية
              </label>
              <input
                type="text"
                value={draftContact.taglineEn || ''}
                onChange={(e) => handleContactChange('taglineEn', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* About Stories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                قصة المطعم ونبذة "من نحن" بالعربية
              </label>
              <textarea
                rows={4}
                value={draftContact.aboutStoryAr || ''}
                onChange={(e) => handleContactChange('aboutStoryAr', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                قصة المطعم بالإنجليزية
              </label>
              <textarea
                rows={4}
                value={draftContact.aboutStoryEn || ''}
                onChange={(e) => handleContactChange('aboutStoryEn', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-2 border-t border-slate-800 space-y-3.5">
            <span className="block text-xs font-bold text-slate-300">
              روابط منصات التواصل الاجتماعي الرسمية
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">
                  حساب Instagram
                </label>
                <input
                  type="text"
                  value={draftContact.instagramUrl || ''}
                  onChange={(e) => handleContactChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">
                  صفحة Facebook
                </label>
                <input
                  type="text"
                  value={draftContact.facebookUrl || ''}
                  onChange={(e) => handleContactChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1.5">
                  حساب TikTok
                </label>
                <input
                  type="text"
                  value={draftContact.tiktokUrl || ''}
                  onChange={(e) => handleContactChange('tiktokUrl', e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Contact Info & Location */}
      {activeTab === 'contact' && (
        <div className="p-4.5 sm:p-7 rounded-2xl bg-slate-900/50 sm:bg-[#0b101b] border border-slate-800/80 space-y-5 sm:space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                رقم هاتف الطلبات الأساسي
              </label>
              <input
                type="text"
                value={draftContact.phonePrimary}
                onChange={(e) => handleContactChange('phonePrimary', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                رقم الهاتف الاحتياطي أو الأرضي
              </label>
              <input
                type="text"
                value={draftContact.phoneSecondary}
                onChange={(e) => handleContactChange('phoneSecondary', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                رقم الواتساب لاستقبال الطلبات
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={draftContact.whatsappNumber}
                  onChange={(e) => handleContactChange('whatsappNumber', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <a
                  href={`https://wa.me/${sanitizePhoneNumber(draftContact.whatsappNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 shrink-0 shadow-sm"
                  title="اختبار فتح الواتساب"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Detailed Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                العنوان التفصيلي للفرع بالعربية
              </label>
              <input
                type="text"
                value={draftContact.addressAr}
                onChange={(e) => handleContactChange('addressAr', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                العنوان التفصيلي بالإنجليزية
              </label>
              <input
                type="text"
                value={draftContact.addressEn}
                onChange={(e) => handleContactChange('addressEn', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Google Maps URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>رابط خرائط Google لموقع المطعم</span>
              {draftContact.googleMapsUrl && (
                <a
                  href={draftContact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>معاينة الرابط</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <input
              type="text"
              value={draftContact.googleMapsUrl}
              onChange={(e) => handleContactChange('googleMapsUrl', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Weekly Schedule & Emergency Notice */}
      {activeTab === 'schedule' && (
        <div className="p-4.5 sm:p-7 rounded-2xl bg-slate-900/50 sm:bg-[#0b101b] border border-slate-800/80 space-y-5 sm:space-y-7">
          {/* Emergency Announcement Banner */}
          <div className="p-5 sm:p-5.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>شريط التنبيهات الإدارية العاجلة في المتجر</span>
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={draftSchedule.showEmergencyBanner}
                  onChange={(e) =>
                    handleScheduleChange('showEmergencyBanner', e.target.checked)
                  }
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>تفعيل الشريط في أعلى الموقع</span>
              </label>
            </div>

            {draftSchedule.showEmergencyBanner && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">
                    نص التنبيه بالعربية
                  </label>
                  <input
                    type="text"
                    value={draftSchedule.emergencyNoticeAr || ''}
                    onChange={(e) =>
                      handleScheduleChange('emergencyNoticeAr', e.target.value)
                    }
                    placeholder="مثال: يرجى العلم بوجود عطلة استثنائية يوم الجمعة القادم..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1.5">
                    نص التنبيه بالإنجليزية
                  </label>
                  <input
                    type="text"
                    value={draftSchedule.emergencyNoticeEn || ''}
                    onChange={(e) =>
                      handleScheduleChange('emergencyNoticeEn', e.target.value)
                    }
                    placeholder="English announcement..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 7-Day Operating Schedule Editor */}
          <ScheduleEditor
            schedule={draftSchedule.weeklySchedule || []}
            onChange={(updatedDays: DaySchedule[]) =>
              handleScheduleChange('weeklySchedule', updatedDays)
            }
          />
        </div>
      )}

      {/* Tab 4: Delivery Terms & Min Order */}
      {activeTab === 'delivery' && (
        <div className="p-4.5 sm:p-7 rounded-2xl bg-slate-900/50 sm:bg-[#0b101b] border border-slate-800/80 space-y-5 sm:space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                أجور التوصيل الثابتة (ليرة سورية)
              </label>
              <input
                type="number"
                step="1000"
                value={draftSchedule.minOrderAmount ? 15000 : 15000}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-amber-400 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                القيمة الافتراضية الثابتة لكافة أحياء النبك: 15,000 ل.س
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                الحد الأدنى لقيمة الطلب (ليرة سورية)
              </label>
              <input
                type="number"
                step="5000"
                value={draftSchedule.minOrderAmount || 50000}
                onChange={(e) =>
                  handleScheduleChange('minOrderAmount', Number(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                أقل مبلغ مسموح به لإتمام طلب التوصيل
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                نسبة الضريبة / القيمة المضافة
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={0}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-400 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                مضبوطة حالياً بنسبة 0%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                مدة التوصيل التقديرية بالعربية
              </label>
              <input
                type="text"
                value={draftContact.workingHoursAr ? '30 - 45 دقيقة' : '30 - 45 دقيقة'}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                مدة التوصيل التقديرية بالإنجليزية
              </label>
              <input
                type="text"
                value="30 - 45 mins"
                readOnly
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
