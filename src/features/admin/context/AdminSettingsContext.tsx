import React, { createContext, useContext, useState, useEffect } from 'react';
import type { BranchContactInfo, OperatingSchedule } from '../types/settings.types';
import { settingsRepository, SETTINGS_UPDATED_EVENT } from '../services/settingsRepository';
import { settingsService } from '../services/settingsService';

interface AdminSettingsContextType {
  contactInfo: BranchContactInfo;
  operatingSchedule: OperatingSchedule;
  updateContactInfo: (data: Partial<BranchContactInfo>) => void;
  updateOperatingSchedule: (data: Partial<OperatingSchedule>) => void;
  toggleOpenStatus: () => void;
  isSaving: boolean;
  lastSavedAt: Date | null;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<BranchContactInfo>(() => settingsRepository.getContactInfo());
  const [operatingSchedule, setOperatingSchedule] = useState<OperatingSchedule>(() => settingsRepository.getOperatingSchedule());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setContactInfo(settingsRepository.getContactInfo());
      setOperatingSchedule(settingsRepository.getOperatingSchedule());
    };
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
  }, []);

  const updateContactInfo = (data: Partial<BranchContactInfo>) => {
    setIsSaving(true);
    const updated = settingsRepository.saveContactInfo(data);
    setContactInfo(updated);
    settingsService.updateSettings({
      phone: data.phonePrimary,
      whatsapp: data.whatsappNumber,
      addressAr: data.addressAr,
      addressEn: data.addressEn,
    }).catch(console.warn);
    setLastSavedAt(new Date());
    setTimeout(() => setIsSaving(false), 300);
  };

  const updateOperatingSchedule = (data: Partial<OperatingSchedule>) => {
    setIsSaving(true);
    const updated = settingsRepository.saveOperatingSchedule(data);
    setOperatingSchedule(updated);
    if (data.isOpen !== undefined) {
      settingsService.toggleKitchenStatus(data.isOpen).catch(console.warn);
    }
    setLastSavedAt(new Date());
    setTimeout(() => setIsSaving(false), 300);
  };

  const toggleOpenStatus = () => {
    updateOperatingSchedule({ isOpen: !operatingSchedule.isOpen });
  };

  return (
    <AdminSettingsContext.Provider
      value={{
        contactInfo,
        operatingSchedule,
        updateContactInfo,
        updateOperatingSchedule,
        toggleOpenStatus,
        isSaving,
        lastSavedAt,
      }}
    >
      {children}
    </AdminSettingsContext.Provider>
  );
};

export const useAdminSettingsContext = (): AdminSettingsContextType => {
  const context = useContext(AdminSettingsContext);
  if (!context) {
    throw new Error('useAdminSettingsContext must be used within an AdminSettingsProvider');
  }
  return context;
};
