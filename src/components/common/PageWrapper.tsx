import React from 'react';

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  className = '', 
  animate = true,
  ...rest
}) => {
  return (
    <div
      className={`flex flex-col gap-8 max-w-[1700px] mx-auto p-10 font-sans audit-grid min-h-screen ${animate ? 'animate-page-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
