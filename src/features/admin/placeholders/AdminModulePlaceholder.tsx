import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { getActiveNavItem } from '../shared/config/navigation';

export interface AdminModulePlaceholderProps {
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

export const AdminModulePlaceholder: React.FC<AdminModulePlaceholderProps> = ({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
}) => {
  const location = useLocation();
  const { language } = useLanguage();
  const activeNav = getActiveNavItem(location.pathname);

  const heading =
    language === 'ar'
      ? titleAr || activeNav?.labelAr || 'وحدة الإدارة'
      : titleEn || activeNav?.labelEn || 'Management Module';

  const desc =
    language === 'ar'
      ? descriptionAr || activeNav?.descriptionAr || 'تم تحضير الهيكل بنجاح بناءً على وثيقة المواصفات ADMIN_SPEC.md.'
      : descriptionEn || activeNav?.descriptionEn || 'Layout structure prepared based on ADMIN_SPEC.md.';

  const Icon = activeNav?.icon || Sparkles;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 sm:p-10 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--card-shadow)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-[var(--accent-gold)] opacity-5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Module Icon Emblem */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 mb-5 shadow-sm">
        <Icon className="w-8 h-8 stroke-[1.8]" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-2 font-['Cairo',sans-serif]">
        {heading}
      </h2>

      <p className="text-sm text-[var(--text-muted)] max-w-lg mb-6 leading-relaxed">
        {desc}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-[var(--text-secondary)] px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{language === 'ar' ? 'المسار النشط:' : 'Active Route:'}</span>
        <code className="text-[var(--accent-gold)] font-mono">{location.pathname}</code>
      </div>
    </div>
  );
};

export default AdminModulePlaceholder;
