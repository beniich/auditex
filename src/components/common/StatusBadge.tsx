import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ElementType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  label, 
  variant = 'info', 
  className = '', 
  icon: Icon 
}) => {
  const variantStyles = {
    brand: 'bg-blue-600 text-white border-blue-500',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-red-50 text-red-700 border-red-100',
    info: 'bg-slate-50 text-slate-600 border-slate-100'
  }[variant];

  return (
    <span className={`badge-premium flex items-center gap-1.5 ${variantStyles} ${className}`}>
      {Icon && <Icon size={12} />}
      {label}
    </span>
  );
};
