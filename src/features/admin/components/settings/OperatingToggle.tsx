import React from 'react';
import type { OperatingSchedule } from '../../types/settings.types';
import { WeeklyScheduleCard } from './WeeklyScheduleCard';
import { DeliverySettingsCard } from './DeliverySettingsCard';

interface OperatingToggleProps {
  schedule: OperatingSchedule;
  onUpdateSchedule: (data: Partial<OperatingSchedule>, msg: string) => void;
  language: 'ar' | 'en';
}

export const OperatingToggle: React.FC<OperatingToggleProps> = ({
  schedule,
  onUpdateSchedule,
  language,
}) => {
  return (
    <div className="space-y-6">
      <WeeklyScheduleCard
        schedule={schedule}
        onUpdateSchedule={onUpdateSchedule}
        language={language}
      />

      <DeliverySettingsCard
        schedule={schedule}
        onUpdateSchedule={onUpdateSchedule}
        language={language}
      />
    </div>
  );
};
