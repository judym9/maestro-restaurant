export type AdminTab = 'menu' | 'promotions' | 'operations' | 'theme';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'manager' | 'editor';
  avatarUrl?: string;
}

export interface NavItemConfig {
  id: AdminTab;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badge?: string;
}
