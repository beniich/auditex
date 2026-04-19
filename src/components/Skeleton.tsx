import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-2 w-20" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full rounded-xl" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center py-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
);

export const SkeletonKanban: React.FC = () => (
  <div className="grid grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, col) => (
      <div key={col} className="space-y-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        {Array.from({ length: col === 0 ? 3 : col === 1 ? 2 : 1 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonTopology: React.FC = () => (
  <div className="relative h-[600px] bg-slate-50 rounded-2xl overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse mx-auto" />
        <Skeleton className="h-3 w-40 mx-auto" />
        <Skeleton className="h-2 w-28 mx-auto" />
      </div>
    </div>
    {[
      { left: '20%', top: '30%' },
      { left: '75%', top: '25%' },
      { left: '80%', top: '70%' },
      { left: '30%', top: '75%' },
    ].map((pos, i) => (
      <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos}>
        <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
      </div>
    ))}
  </div>
);
