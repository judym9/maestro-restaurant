import { useState, useCallback } from 'react';
import { useAdminSettingsContext } from '../context/AdminSettingsContext';
import type { BranchContactInfo, OperatingSchedule } from '../types/settings.types';

export const useAdminSettings = () => {
  const context = useAdminSettingsContext();
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  }, []);

  const saveBranchInfo = useCallback((data: Partial<BranchContactInfo>, successMessage: string) => {
    context.updateContactInfo(data);
    showNotification(successMessage);
  }, [context, showNotification]);

  const saveSchedule = useCallback((data: Partial<OperatingSchedule>, successMessage: string) => {
    context.updateOperatingSchedule(data);
    showNotification(successMessage);
  }, [context, showNotification]);

  const toggleEmergencyBanner = useCallback((enabled: boolean, successMessage: string) => {
    context.updateOperatingSchedule({ showEmergencyBanner: enabled });
    showNotification(successMessage);
  }, [context, showNotification]);

  return {
    ...context,
    notification,
    saveBranchInfo,
    saveSchedule,
    toggleEmergencyBanner,
  };
};
