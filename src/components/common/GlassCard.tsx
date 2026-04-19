import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'morphism';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  variant = 'light',
  ...props 
}) => {
  const variantClass = {
    light: 'glass-card',
    dark: 'bg-[#091426]/40 backdrop-blur-2xl border border-white/10 shadow-2xl',
    morphism: 'glass-morphism'
  }[variant];

  return (
    <motion.div 
      className={`rounded-[2.5rem] overflow-hidden ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
