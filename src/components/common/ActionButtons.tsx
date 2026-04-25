import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  const base = 'font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:translate-y-0 hover:-translate-y-0.5',
    secondary: 'bg-white border border-slate-200 text-brand-text-main hover:bg-slate-50 shadow-sm active:translate-y-0 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-50 active:scale-95',
    danger: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white shadow-sm active:translate-y-0 hover:-translate-y-0.5'
  }[variant];

  const sizes = {
    sm: 'px-4 py-2 rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'px-10 py-5 rounded-[2rem]'
  }[size];

  return (
    <button className={`${base} ${variants} ${sizes} ${className}`} {...props}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};
