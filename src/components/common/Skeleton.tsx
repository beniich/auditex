import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-white/5 rounded-3xl ${className}`} />
);

export const SkeletonCard = () => (
  <div className="animate-pulse bg-slate-100 dark:bg-white/5 rounded-[2.5rem] h-64 w-full" />
);

export const SkeletonTable = () => (
  <div className="space-y-4 w-full">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-12 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
    ))}
  </div>
);

export const SkeletonTopology = () => (
  <div className="h-[500px] bg-slate-100 dark:bg-white/5 rounded-[3rem] animate-pulse flex items-center justify-center">
    <div className="w-32 h-32 rounded-full border-4 border-white/10" />
  </div>
);

export const SkeletonKanban = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full h-full">
    {[1, 2, 3].map((col) => (
      <div key={col} className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-6 space-y-6">
        <div className="h-6 w-24 bg-slate-200 dark:bg-white/10 rounded-lg animate-pulse" />
        {[1, 2, 3].map((card) => (
          <div key={card} className="h-40 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);
