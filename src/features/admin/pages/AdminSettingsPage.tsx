import React from 'react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { OperatingToggle } from '../components/settings/OperatingToggle';
import { ContactInfoForm } from '../components/settings/ContactInfoForm';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { CheckCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const {
    contactInfo,
    operatingSchedule,
    saveBranchInfo,
    saveSchedule,
    notification,
  } = useAdminSettings();

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm font-bold shadow-md animate-fade-in">
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Card 1: Live Operations & Shifts */}
      <div className="w-full">
        <OperatingToggle
          schedule={operatingSchedule}
          onUpdateSchedule={saveSchedule}
          language={language}
        />
      </div>

      {/* Card 2: Al-Nabek Branch & Contact Channels */}
      <div className="w-full">
        <ContactInfoForm
          contactInfo={contactInfo}
          onSave={saveBranchInfo}
          language={language}
        />
      </div>
    </div>
  );
};
