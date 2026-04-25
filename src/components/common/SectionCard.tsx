import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface SectionCardProps extends HTMLMotionProps<"div"> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  variant = 'light',
  padding = 'medium',
  className = '',
  ...props
}) => {
  const variantStyles = {
    light: 'section-card text-brand-text-main',
    dark: 'dark-card text-white',
    glass: 'glass-card text-brand-text-main'
  }[variant];

  const paddingStyles = {
    none: 'p-0',
    small: 'p-6',
    medium: 'p-8',
    large: 'p-10'
  }[padding];

  return (
    <motion.div 
      className={`${variantStyles} ${className} relative overflow-hidden`}
      {...props}
    >
      {(title || actions) && (
        <div className={`flex justify-between items-center mb-8 border-b ${variant === 'dark' ? 'border-white/10' : 'border-slate-50'} ${paddingStyles} !pb-6`}>
          <div>
            {title && <h3 className="card-title text-sm font-black uppercase tracking-[0.2em]">{title}</h3>}
            {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={title || actions ? `${paddingStyles} !pt-0` : paddingStyles}>
        {children}
      </div>
    </motion.div>
  );
};
