import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { cn } from '../../utils/cn';
import './ThemeSwitcher.css';

export interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={cn('theme-switcher-btn', className)}
      onClick={toggleTheme}
      aria-label={isDark ? t.common.theme.light : t.common.theme.dark}
      title={isDark ? t.common.theme.light : t.common.theme.dark}
    >
      <div className="theme-icon-container">
        {isDark ? (
          <Sun size={19} className="theme-icon sun-icon" />
        ) : (
          <Moon size={19} className="theme-icon moon-icon" />
        )}
      </div>
    </button>
  );
};
