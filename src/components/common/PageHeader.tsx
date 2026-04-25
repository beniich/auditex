import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'brand';
  icon?: LucideIcon;
  actions?: React.ReactNode;
  variant?: 'light' | 'dark';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  badge,
  badgeVariant = 'brand',
  icon: Icon,
  actions,
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`page-header-card p-10 relative overflow-hidden ${isDark ? 'bg-brand-sidebar text-white border-slate-800' : ''}`}>
      {isDark && (
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <div className="w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] animate-pulse" />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          {breadcrumb && (
            <nav className="flex items-center gap-2">
              {breadcrumb.map((item, i) => (
                <React.Fragment key={i}>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    {item}
                  </span>
                  {i < breadcrumb.length - 1 && (
                    <ChevronRight size={10} className={isDark ? 'text-slate-600' : 'text-slate-300'} />
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-4">
            {badge && (
              <StatusBadge label={badge} variant={badgeVariant} icon={Icon} />
            )}
            {isDark && !badge && Icon && (
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Icon size={12} className="text-white" />
              </div>
            )}
          </div>

          <h1 className={`text-4xl font-black tracking-tighter uppercase leading-[0.8] italic ${isDark ? 'text-white' : 'text-brand-text-main'}`}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={`max-w-2xl text-sm font-medium leading-relaxed opacity-80 uppercase tracking-tight ${isDark ? 'text-slate-400' : 'text-brand-text-muted'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
