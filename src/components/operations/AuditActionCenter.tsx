import React from 'react';
import { AlertCircle, TriangleAlert, Clock, ChevronRight, Filter, ShieldCheck, Zap, ArrowRight, Share2, MoreVertical } from 'lucide-react';

const ALERTS = [
  { 
    id: 1, 
    level: 'Critical', 
    type: 'Compliance Drift', 
    title: 'APAC Regulation 2024-B', 
    time: '2 mins ago', 
    desc: 'Policy adherence for APAC region has dropped below 85% in the last 24 hours. Immediate review and remedial action required to prevent regulatory fines.',
    actions: ['Review Policy', 'Mitigate Risk'],
    color: 'rose'
  },
  { 
    id: 2, 
    level: 'High Risk', 
    type: 'New Financial Risk', 
    title: 'Currency Fluctuation Exposure', 
    time: '15 mins ago', 
    desc: 'Significant exposure detected in EUR/USD pair due to unusual market volatility. Current hedging parameters are insufficient for protected operations.',
    actions: ['View Exposure', 'Approve Strategy'],
    color: 'orange'
  },
  { 
    id: 3, 
    level: 'Pending', 
    type: 'Approval Required', 
    title: 'Q3 Audit Report Final Draft', 
    time: '42 mins ago', 
    desc: 'The final draft of the Q3 Consolidated Audit report is ready for final verification by the Chief Compliance Officer. Deadline: Today, 5:00 PM.',
    actions: ['Review Draft', 'Approve'],
    color: 'blue'
  }
];

const ActionCard = ({ alert }: { alert: any }) => (
  <div className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group relative transition-all hover:shadow-xl hover:shadow-slate-200/50 ${alert.color === 'rose' ? 'border-l-[6px] border-l-rose-500' : alert.color === 'orange' ? 'border-l-[6px] border-l-orange-400' : 'border-l-[6px] border-l-blue-500'}`}>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
         <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
               alert.color === 'rose' ? 'bg-rose-50 text-rose-600' :
               alert.color === 'orange' ? 'bg-orange-50 text-orange-600' :
               'bg-blue-50 text-blue-600'
            }`}>
               {alert.color === 'rose' ? <AlertCircle size={12} /> : alert.color === 'orange' ? <TriangleAlert size={12} /> : <Clock size={12} />}
               {alert.level}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">— {alert.type}</span>
         </div>
         <span className="text-[10px] font-bold text-slate-400 uppercase">{alert.time}</span>
      </div>

      <h4 className="text-xl font-black text-[#091426] mb-3 group-hover:text-blue-600 transition-colors">{alert.title}</h4>
      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-3xl">{alert.desc}</p>

      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-50">
         <button className="px-6 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            {alert.actions[0]} <ChevronRight size={14} />
         </button>
         <button className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
            alert.color === 'rose' ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600' :
            alert.color === 'orange' ? 'bg-orange-400 shadow-orange-400/20 hover:bg-orange-500' :
            'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'
         }`}>
            {alert.actions[1]}
         </button>
      </div>
    </div>
  </div>
);

export const AuditActionCenter = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[850px] border border-slate-200">
      <div className="bg-white p-10 border-b border-slate-200">
         <div className="flex justify-between items-start">
            <div>
               <h2 className="text-3xl font-black text-[#091426] tracking-tight">Audit Action Center</h2>
               <p className="text-slate-500 font-medium mt-1">Real-time risk mitigation and compliance enforcement stream.</p>
            </div>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">
                  <Filter size={16} /> All Regions <ChevronDown size={14} />
               </button>
               <button className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50"><Share2 size={18} /></button>
            </div>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 p-10 overflow-hidden">
         {/* Alert Stream */}
         <div className="overflow-y-auto custom-scrollbar flex flex-col gap-6 pr-4">
            {ALERTS.map(alert => <ActionCard key={alert.id} alert={alert} />)}
            <div className="flex justify-center pt-4">
               <button className="px-10 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-white hover:border-slate-200 transition-all text-sm">
                  Load Archived Actions
               </button>
            </div>
         </div>

         {/* Sidebar Stats & Links */}
         <div className="flex flex-col gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col items-center">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 w-full">Priority Overview</h3>
               
               <div className="grid grid-cols-3 gap-8 w-full">
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-4xl font-black text-rose-500 tracking-tighter">3</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-4xl font-black text-orange-400 tracking-tighter">5</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <span className="text-4xl font-black text-blue-500 tracking-tighter">12</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
                  </div>
               </div>

               <div className="mt-12 w-full space-y-4">
                  <button className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-100 transition-colors">
                     <ShieldCheck size={16} /> 24 Resolved this week
                  </button>
               </div>
            </div>

            <div className="bg-[#091426] rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/10 flex flex-col gap-6">
               <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Quick Risk Actions</h3>
               <div className="space-y-2">
                  {[
                     { label: 'Generate Compliance Report', icon: Zap },
                     { label: 'View Risk Heatmap', icon: ArrowRight },
                     { label: 'Manage User Permissions', icon: MoreVertical }
                  ].map((link, i) => (
                     <button key={i} className="w-full group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all">
                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.label}</span>
                        <link.icon size={16} className="text-slate-600 group-hover:text-blue-400 transition-all" />
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ChevronDown = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default AuditActionCenter;
