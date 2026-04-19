import React from 'react';
import { 
  TrendingUp, 
  Map as MapIcon, 
  Search, 
  AlertCircle, 
  ChevronRight, 
  Activity,
  Globe,
  PieChart,
  BarChart3,
  Download,
  Fingerprint,
  FileCheck,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './common/GlassCard';

export const PredictiveAnalytics = () => {
  return (
    <div className="flex flex-col gap-8 max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Premium Dynamic Header */}
      <div className="flex justify-between items-end bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 shadow-2xl shadow-blue-500/5">
        <div>
          <nav className="flex items-center gap-3 mb-3">
             <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Globe size={12} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Intelligence</span>
             </div>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predictive Threat Modeling</span>
          </nav>
          <h2 className="text-4xl font-black text-[#091426] dark:text-white tracking-tighter uppercase leading-none italic">Risk Forecast Engine</h2>
          <p className="text-slate-500 text-sm mt-3 font-medium uppercase tracking-tight opacity-70">Anticipate regulatory drift and infrastructural vulnerabilities with 90-day predictive precision.</p>
        </div>
        <div className="flex gap-2 p-2 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
           <button className="px-8 py-3 bg-[#091426] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Spatial Topology</button>
           <button className="px-8 py-3 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/50 transition-all font-sans">Quant Analytics</button>
        </div>
      </div>

      {/* Main Predictive Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Interactive Glass Map Drilldown */}
        <div className="col-span-12 lg:col-span-8">
           <GlassCard className="p-0 border-white/5 overflow-hidden h-[650px] relative group flex flex-col shadow-2xl shadow-blue-900/10">
              <div className="absolute top-8 left-8 z-20 space-y-4">
                 <div className="bg-[#091426]/90 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-2xl flex flex-col gap-2">
                    <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 transition-all"><TrendingUp size={20}/></button>
                    <div className="h-px bg-white/10 mx-2"></div>
                    <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Search size={20}/></button>
                    <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Fingerprint size={20}/></button>
                 </div>
              </div>

              <div className="absolute top-8 right-8 z-20 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 flex items-center gap-3 border border-emerald-400/50">
                 <Activity size={16} className="animate-pulse" />
                 Predictive Model: Locked
              </div>

              <div className="flex-1 bg-[#091426] flex items-center justify-center relative overflow-hidden">
                 {/* Simulated Premium Map */}
                 <div className="absolute inset-0 bg-[#091426]">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3VF3TfSwSvg5clsfM_ZPAzvsTfbgYNoX_qngzaX7LAY4eo0IEO8sXxjxfqIE6iiKbg8DjRIEfgUPrIafRyX6xnLF-cammUbr2ivu8I5H6oh7p_RX1F1Xj-fQae8Qn0LdHJ4XIDdFTZxwGK1pOuJKm8xgTyfVWj-lXg5pK9W5fT12QQR7zFJ-EIGKGFmnj1oQ_rk8x6Lg1KhlfU13oQ6kF22VkNIqV7nFyQte58cZOvV7qx4M-LJruwtVEVWHXdaty7HRhJOiONrQ"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen grayscale contrast-150 transition-transform duration-[20s] group-hover:scale-110"
                      alt="Risk Map"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091426] via-transparent to-[#091426]/50" />
                 </div>
                 
                 {/* Interactive Pulse Hotspots */}
                 <div className="absolute top-[35%] left-[48%] group/pin">
                    <div className="relative flex items-center justify-center">
                       <div className="absolute w-24 h-24 bg-red-500/20 rounded-full animate-ping"></div>
                       <div className="absolute w-12 h-12 bg-red-500/40 rounded-full animate-pulse"></div>
                       <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-2xl z-10"></div>
                       {/* Label */}
                       <div className="absolute bottom-8 bg-white p-3 rounded-xl shadow-2xl min-w-[150px] opacity-0 group-hover/pin:opacity-100 transition-all translate-y-2 group-hover/pin:translate-y-0 text-[#091426]">
                          <p className="text-[10px] font-black uppercase tracking-tighter">Frankfurt DE-7</p>
                          <p className="text-[9px] font-bold text-red-600 mt-1 uppercase">Critical Deviation</p>
                       </div>
                    </div>
                 </div>

                 <div className="absolute top-[55%] left-[42%]">
                    <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-2xl"></div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end pointer-events-none">
                 <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Risk Velocity</p>
                    <div className="flex gap-6">
                       {[
                         { label: 'Cloud', val: 78, color: 'bg-blue-500' },
                         { label: 'Edge', val: 42, color: 'bg-emerald-500' },
                         { label: 'Auth', val: 94, color: 'bg-red-500' }
                       ].map(s => (
                         <div key={s.label} className="flex flex-col items-center gap-2">
                            <div className="w-1.5 h-16 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
                               <motion.div initial={{ height: 0 }} animate={{ height: `${s.val}%` }} className={`w-full ${s.color}`} />
                            </div>
                            <span className="text-[8px] font-black text-white/60 uppercase">{s.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex items-center gap-6">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Health</p>
                       <p className="text-3xl font-black text-white leading-none">88.2%</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                       <Zap size={20} className="text-amber-500" />
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* Sidebar Intelligence (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           
           {/* Predictive Scoring */}
           <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-8">90-Day Forecast</h3>
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Aggregate Threat Prob.</p>
                        <p className="text-5xl font-black text-[#091426] dark:text-white tracking-tighter mt-2 leading-none">12.4%</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">-4.2% LOW</span>
                    </div>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '12.4%' }} className="h-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Stability</p>
                       <p className="text-2xl font-black text-emerald-600 text-center leading-none">HIGH</p>
                    </div>
                    <div className="p-5 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Inference</p>
                       <p className="text-2xl font-black text-blue-600 text-center leading-none">STABLE</p>
                    </div>
                 </div>
              </div>
           </GlassCard>

           {/* Sector Drift Breakdown */}
           <GlassCard className="p-0 border-white/5 flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sector Analysis</span>
                    <h4 className="text-sm font-black text-[#091426] dark:text-white uppercase tracking-tighter">Regulatory Drift</h4>
                 </div>
                 <BarChart3 size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[300px] p-4 space-y-3">
                 {[
                   { zone: 'EMEA-West', threat: '2.1 LOW', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' },
                   { zone: 'APAC-South', threat: '8.4 CRIT', color: 'text-red-500 border-red-500/20 bg-red-500/5' },
                   { zone: 'Americas-C', threat: '5.2 MED', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5' },
                   { zone: 'Nordic-R1', threat: '0.8 MIN', color: 'text-blue-500 border-blue-500/20 bg-blue-500/5' },
                 ].map(row => (
                   <div key={row.zone} className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group">
                      <span className="text-xs font-black text-[#091426] dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{row.zone}</span>
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full border ${row.color} tracking-widest`}>{row.threat}</span>
                   </div>
                 ))}
              </div>
              <div className="p-6 mt-auto bg-slate-50/50 dark:bg-white/5 border-t border-white/5">
                 <button className="w-full py-4 bg-[#091426] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-slate-800 transition-all">Export Analysis Protocol</button>
              </div>
           </GlassCard>
        </div>

        {/* Global Evidence Sentinel (Full Width) */}
        <div className="col-span-12">
           <GlassCard className="p-10 border-white/5">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.25em] mb-1">Live Intelligence Feed</span>
                    <h3 className="text-2xl font-black text-[#091426] dark:text-white uppercase tracking-tighter leading-none flex items-center gap-3">
                       <ShieldAlert size={24} className="text-red-600" />
                       Risk Event Sentinel
                    </h3>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       Ledger Synchronization: 100%
                    </span>
                    <button className="px-6 py-2 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest">Protocol Override</button>
                 </div>
              </div>

              <div className="relative pl-10 border-l border-slate-100 dark:border-white/10 space-y-12">
                 {[
                   { title: 'Critical Breach Sequence - DE-7', time: '14:22 UTC', desc: 'Predictive model identified biometric pattern deviation. Access revoked. Incident forwarded to remediation Kanban.', color: 'bg-red-500' },
                   { title: 'Regulatory Update Detected - EU-PARIS', time: '13:10 UTC', desc: 'New HIPAA-level directive added to RAG context. Policy library updated automatically.', color: 'bg-blue-500' },
                   { title: 'Auth-Loop Stabilized - US-EAST', time: '10:05 UTC', desc: 'Latency optimized by 24ms using edge inference calibration.', color: 'bg-emerald-500' }
                 ].map((event, i) => (
                   <div key={i} className="relative group">
                      <div className={`absolute -left-[50px] top-1 w-5 h-5 rounded-full ${event.color} ring-8 ring-white dark:ring-[#091426] shadow-xl z-20 group-hover:scale-125 transition-transform`} />
                      <div className="flex justify-between items-start mb-3">
                         <h4 className="text-[15px] font-black text-[#091426] dark:text-white uppercase tracking-tight">{event.title}</h4>
                         <span className="text-[10px] font-mono font-bold text-slate-400">{event.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl italic">"{event.desc}"</p>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};
