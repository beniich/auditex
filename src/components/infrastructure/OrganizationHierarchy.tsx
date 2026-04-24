import React, { useState } from 'react';
import { Search, ChevronDown, Filter, ChevronUp, Link, GitMerge, Building2, Building, Group } from 'lucide-react';
import { motion } from 'motion/react';

const OrgNode = ({ node, level = 0 }: { node: any, level?: number }) => {
  const isHealthy = node.score >= 90;
  const isWarning = node.score >= 70 && node.score < 90;
  const isCritical = node.score < 70;

  const colorClass = isHealthy ? 'text-green-500' : isWarning ? 'text-yellow-500' : 'text-red-500';
  const circleClass = isHealthy ? 'stroke-emerald-500' : isWarning ? 'stroke-yellow-400' : 'stroke-rose-500';

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border text-[#091426] border-slate-200 shadow-sm rounded-xl overflow-hidden w-64 z-10"
      >
        <div className={`px-4 py-2 flex justify-between items-center ${
           level === 0 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-900 border-b border-blue-100'
        }`}>
          <div className="flex items-center gap-2">
            {node.icon}
            <div>
               <h3 className="text-sm font-bold truncate leading-tight">{node.name}</h3>
               {node.role && <p className="text-[10px] opacity-80 uppercase tracking-widest">{node.role}</p>}
            </div>
          </div>
          {node.children && node.children.length > 0 && (
             <ChevronUp size={16} className={level === 0 ? 'text-blue-300' : 'text-blue-400'} />
          )}
        </div>
        <div className="p-4 flex items-center gap-4 bg-white">
          <div className="relative w-12 h-12 flex-shrink-0">
             <svg viewBox="0 0 36 36" className="w-12 h-12 rotate-[-90deg]">
                <path
                  className="stroke-slate-100"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${circleClass}`}
                  strokeWidth="4"
                  strokeDasharray={`${node.score}, 100`}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-[11px] font-black ${colorClass}`}>{node.score}%</span>
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#091426] leading-none">{node.score}%</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Compliance Health</span>
          </div>
        </div>
      </motion.div>

      {node.children && node.children.length > 0 && (
        <div className="relative flex flex-col items-center mt-4">
          {/* Vertical line down from parent */}
          <div className="w-px h-6 bg-slate-300 absolute -top-4"></div>
          
          <div className="flex gap-8 relative mt-2 pt-4">
             {/* Horizontal connector line */}
             <div className="absolute top-0 left-[calc(50%/var(--children)+1.5rem)] right-[calc(50%/var(--children)+1.5rem)] h-px bg-slate-300"></div>
            {node.children.map((child: any, i: number) => (
              <div key={Math.random()} className="relative" style={{ '--children': node.children.length } as any}>
                 <div className="w-px h-4 bg-slate-300 absolute -top-4 left-1/2 -translate-x-1/2"></div>
                <OrgNode node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const OrganizationHierarchy = () => {
  const hierarchyData = {
    name: "AuditAX Global Inc.",
    score: 92,
    children: [
      {
        name: "Americas",
        role: "Subsidiary",
        icon: <Link size={14} />,
        score: 89,
        children: [
          {
            name: "AuditAX US",
            role: "Subsidiary",
            icon: <Building2 size={14} />,
            score: 94,
            children: [
               { name: "Finance Dept.", role: "Department", icon: <Building size={12} />, score: 94 },
               { name: "Legal & Compliance", role: "Department", icon: <Building size={12} />, score: 81 },
               { name: "Operations", role: "Department", icon: <Building size={12} />, score: 98 },
               { name: "HR & Talent", role: "Department", icon: <Building size={12} />, score: 88 }
            ]
          },
          {
            name: "AuditAX Canada",
            role: "Subsidiary",
            icon: <Building2 size={14} />,
            score: 83
          }
        ]
      },
      {
        name: "EMEA",
        role: "Subsidiary",
        icon: <GitMerge size={14} />,
        score: 75
      },
      {
        name: "APAC",
        role: "Subsidiary",
        icon: <Group size={14} />,
        score: 95
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between z-20">
        <h2 className="text-2xl font-black text-[#091426]">Organization Hierarchy</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Entity" 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-sm font-semibold rounded-lg hover:bg-slate-50">
             Filter by Region <ChevronDown size={16} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-sm font-semibold rounded-lg hover:bg-slate-50">
             Filter by Compliance Score <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-12 custom-scrollbar relative">
        <div className="min-w-max flex justify-center pb-20">
            <OrgNode node={hierarchyData} />
        </div>

        <div className="absolute bottom-8 right-8 bg-white border border-slate-200 p-4 rounded-xl shadow-lg w-64">
           <h4 className="text-xs font-bold mb-3 uppercase tracking-wider text-[#091426]">Legend</h4>
           <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Green &gt;90% (Good)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Yellow 70-80% (Warning)</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Red &lt;70% (Critical)</div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default OrganizationHierarchy;
