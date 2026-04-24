import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, size = 80, label }) => {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-600 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center inset-0">
        <span className="text-sm font-black text-[#091426]">{Math.round(progress)}%</span>
      </div>
      {label && <div className="absolute -bottom-6 text-center w-full min-w-max"><span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</span></div>}
    </div>
  );
};
