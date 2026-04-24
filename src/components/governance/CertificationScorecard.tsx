import React from 'react';
import { Share2, Download, ChevronRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const SemiCircleChart = ({ percentage, label, subLabel, color }: any) => {
  const radius = 60;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-24 overflow-hidden">
        <svg viewBox="0 0 140 80" className="w-full h-full">
          <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 left-0 w-full text-center">
          <span className="text-3xl font-black text-[#091426] tracking-tighter">{percentage}%</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</h4>
        <p className="text-[10px] font-black text-[#091426] mt-1">{subLabel}</p>
      </div>
    </div>
  );
};

const FrameworkCard = ({ title, percentage, categories }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
    <div className="flex justify-between items-center mb-6">
       <h4 className="text-lg font-black text-[#091426] tracking-tight">{title}</h4>
       <span className="text-sm font-bold text-slate-500">{percentage}% Complete</span>
    </div>
    
    <div className="h-2 w-full bg-slate-50 rounded-full mb-8 overflow-hidden border border-slate-100">
       <div className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.2)]" style={{ width: `${percentage}%` }}></div>
    </div>

    <div className="space-y-6">
       {categories.map((cat: any) => (
          <div key={cat.label} className="space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">{cat.id} {cat.label}</span>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline cursor-pointer">View Details</button>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                   <div 
                     className={`h-full rounded-lg ${
                       cat.status === 'Green' ? 'bg-emerald-500' :
                       cat.status === 'Critical' ? 'bg-rose-500' :
                       cat.status === 'Warning' ? 'bg-orange-400' :
                       'bg-blue-400'
                     }`} 
                     style={{ width: `${cat.value}%` }}
                   ></div>
                </div>
                <div className="w-16 flex flex-col items-end">
                   <span className="text-[10px] font-black text-[#091426] leading-none">{cat.value}%</span>
                   <span className={`text-[8px] font-black uppercase tracking-tighter ${
                     cat.status === 'Green' ? 'text-emerald-600' :
                     cat.status === 'Critical' ? 'text-rose-600' :
                     cat.status === 'Warning' ? 'text-orange-500' :
                     'text-blue-600'
                   }`}>{cat.statusLabel || cat.status}</span>
                </div>
             </div>
          </div>
       ))}
    </div>
  </div>
);

export const CertificationScorecard = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-8 border-b border-slate-200 flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-black text-[#091426] tracking-tight">Certification Readiness Scorecard</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">A high-level visual report showing gaps between current status and ISO 27001/SOC2 requirements.</p>
         </div>
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all">
               <Download size={14} /> Export Report
            </button>
         </div>
      </div>

      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
         {/* Top Controls */}
         <div className="flex gap-4">
            <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#091426] outline-none shadow-sm"><option>Audit Period: Q3 2024</option></select>
            <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#091426] outline-none shadow-sm"><option>Frameworks: All Selected</option></select>
            <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-400 flex items-center gap-2 shadow-sm"><Clock size={14} /> Jan, 2024 - May, 2024</div>
         </div>

         {/* Overall Readiness */}
         <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-black text-[#091426] mb-10 border-b border-slate-50 pb-4">Overall Readiness Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
               <SemiCircleChart percentage={68} label="ISO 27001 Status" subLabel="32% Gap" color="#10b981" />
               <div className="bg-blue-50/30 rounded-3xl p-6 border border-blue-100/50 flex flex-col items-center justify-center scale-110">
                  <SemiCircleChart percentage={72} label="Total Readiness Score" subLabel="28% Gaps Remaining" color="#2563eb" />
               </div>
               <SemiCircleChart percentage={76} label="SOC2 Status" subLabel="24% Gap" color="#3b82f6" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Gaps Resolved</span>
                  <span className="text-xs font-bold text-[#091426]">45 / 120 Gaps Resolved</span>
               </div>
               <div className="h-4 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-end px-3" style={{ width: '37%' }}>
                     <span className="text-[9px] font-black text-white">37%</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Detailed Framework Breakdown */}
         <div className="space-y-6">
            <h3 className="text-lg font-black text-[#091426]">Detailed Framework Breakdown & Gap Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <FrameworkCard 
                 title="ISO 27001 Readiness" 
                 percentage={68} 
                 categories={[
                   { id: 'A.5', label: 'Information Security Policies', value: 85, status: 'Green' },
                   { id: 'A.9', label: 'Access Control', value: 60, status: 'Warning', statusLabel: 'Action Required' },
                   { id: 'A.12', label: 'Operations Security', value: 75, status: 'Green' },
                   { id: 'A.14', label: 'System Acquisition', value: 30, status: 'Critical', statusLabel: 'Critical Gaps' }
                 ]}
               />
               <FrameworkCard 
                 title="SOC2 Readiness" 
                 percentage={76} 
                 categories={[
                   { id: 'CC1.0', label: 'Control Environment', value: 90, status: 'Green' },
                   { id: 'CC2.0', label: 'Communication & Info', value: 70, status: 'Warning', statusLabel: 'Review Pending' },
                   { id: 'CC5.0', label: 'Monitoring Activities', value: 80, status: 'Green' },
                   { id: 'CC6.0', label: 'Logical and Physical Access', value: 65, status: 'blue', statusLabel: 'Attention Needed' }
                 ]}
               />
            </div>
         </div>

         {/* Bottom Grids */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <h3 className="text-base font-black text-[#091426] mb-6">Top Priority Gaps</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl">
                     <AlertCircle size={18} className="text-rose-500" />
                     <p className="text-sm font-bold text-rose-900 flex-1">Implement Multi-Factor Authentication (SOC2 CC6.1) <span className="uppercase text-[9px] font-black opacity-60 ml-2">- High Priority</span></p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-100 rounded-2xl">
                     <AlertCircle size={18} className="text-orange-500" />
                     <p className="text-sm font-bold text-orange-900 flex-1">Update Incident Response Plan (ISO 27001 A.16.1) <span className="uppercase text-[9px] font-black opacity-60 ml-2">- Medium Priority</span></p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
               <h3 className="text-base font-black text-[#091426] mb-6">Next Steps</h3>
               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 border-2 border-slate-100 rounded-2xl text-xs font-bold text-[#091426] hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">Schedule Audit Review</button>
                  <button className="py-4 border-2 border-slate-100 rounded-2xl text-xs font-bold text-[#091426] hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">Assign Gap Tasks</button>
                  <button className="py-4 border-2 border-slate-100 rounded-2xl text-xs font-bold text-[#091426] hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">Export Detailed Log</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default CertificationScorecard;
