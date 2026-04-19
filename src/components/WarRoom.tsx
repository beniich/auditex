import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  MessageSquare, 
  Lock, 
  Terminal,
  Zap,
  ArrowUpRight,
  Eye,
  Radio,
  TrendingUp,
  Unlock
} from 'lucide-react';
import { GlassCard } from './common/GlassCard';

export const WarRoom = () => {
  return (
    <div className="flex flex-col gap-10 max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* War Room Header: Live Status */}
      <GlassCard className="p-10 border-white/5 bg-[#091426]/95 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
           <Radio size={200} className="text-red-600 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
           <div>
              <div className="flex items-center gap-4 mb-6">
                 <span className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 shadow-2xl shadow-red-500/20">
                    <Radio size={14} className="animate-pulse" /> LIVE_WAR_ROOM
                 </span>
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10 px-4 py-1.5 rounded-xl backdrop-blur-md">
                    <Users size={12} /> 4 Active Operators
                 </span>
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Command Triage</h2>
              <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed opacity-80 uppercase tracking-tight">
                 High-priority incident response and cross-functional synchronization hub. 
                 Real-time SHA-256 anchored chain of command.
              </p>
           </div>
           <div className="flex gap-4">
              <button className="px-10 py-5 bg-white text-red-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                 <ShieldAlert size={18} /> Initiate Lockdown
              </button>
           </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-12 gap-8">
         {/* Live Operator Presence */}
         <div className="col-span-12 lg:col-span-3">
            <GlassCard className="p-8 border-white/5 h-full">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Active Operators</h3>
               <div className="space-y-6">
                  {[
                    { name: 'Admin One', role: 'Security Architect', status: 'In Registry' },
                    { name: 'Agent Smith', role: 'Forensic Lead', status: 'Analyzing DE-7' },
                    { name: 'System Root', role: 'Automated Sentinel', status: 'Monitoring' },
                    { name: 'M. Johnson', role: 'Compliance Officer', status: 'Idle' },
                  ].map((op, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                       <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-[#091426] dark:text-white">
                             {op.name[0]}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-[#091426]" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-[#091426] dark:text-white uppercase tracking-tight leading-none">{op.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{op.role}</p>
                          <p className="text-[8px] font-mono text-blue-500 mt-1">{op.status}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>

         {/* Central Incident Triage Feed */}
         <div className="col-span-12 lg:col-span-6">
            <GlassCard className="p-10 border-white/5 min-h-[600px] flex flex-col">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-3">
                     <Terminal size={18} /> Incident Triage Stream
                  </h3>
                  <div className="flex gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase border border-slate-100 px-3 py-1 rounded-lg">Filter: Critical Only</span>
                  </div>
               </div>

               <div className="flex-1 space-y-6">
                  {[
                    { id: 'INC-702', title: 'Unauthorized Biometric Bypass Attempt', loc: 'Frankfurt DE-7', impact: 'CRITICAL', time: '2m ago' },
                    { id: 'INC-698', title: 'SHA-256 Chain Divergence Detected', loc: 'Global Ledger', impact: 'HIGH', time: '14m ago' },
                    { id: 'INC-695', title: 'RAG Context Invalidation - ISO 27001', loc: 'Gov-Engine', impact: 'MEDIUM', time: '38m ago' },
                  ].map((inc, i) => (
                    <motion.div 
                      key={inc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/10 hover:border-red-500/30 transition-all group"
                    >
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{inc.id} // {inc.loc}</span>
                             <h4 className="text-lg font-black text-[#091426] dark:text-white mt-1 uppercase tracking-tighter leading-none">{inc.title}</h4>
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${inc.impact === 'CRITICAL' ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' : 'bg-amber-100 text-amber-600'}`}>
                             {inc.impact}
                          </span>
                       </div>
                       <div className="flex gap-3 justify-end">
                          <button className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-blue-600 transition-all"><MessageSquare size={16} /></button>
                          <button className="px-6 py-3 bg-[#091426] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                             Triage Protocol <ArrowUpRight size={14} />
                          </button>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </GlassCard>
         </div>

         {/* Command Analytics & Metrics */}
         <div className="col-span-12 lg:col-span-3 space-y-8">
            <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-8">Mean Time to Resolve</h3>
                  <p className="text-6xl font-black tracking-tighter leading-none mb-2">14.2m</p>
                  <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp size={12} /> -2.4m Improvement
                  </p>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Activity size={180} />
               </div>
            </GlassCard>

            <GlassCard className="p-8 border-white/5 h-[300px] flex flex-col justify-between">
               <div className="flex flex-col">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Collaboration Velocity</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-2xl font-black text-[#091426] dark:text-white uppercase tracking-tighter">Optimized</span>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase">
                       <span>Channel {i+1}</span>
                       <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${h}%` }} className="h-full bg-blue-600" />
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>
      </div>

      {/* Global Status Footer Strip */}
      <div className="flex justify-between items-center bg-[#091426] p-6 rounded-[2rem] border border-white/10 text-white/40 text-[9px] font-mono font-black uppercase tracking-[0.4em]">
         <div className="flex gap-10">
            <span className="flex items-center gap-2"><Lock size={12} className="text-emerald-500" /> SHA-256_INTEGRITY: LOCKED</span>
            <span className="flex items-center gap-2 text-blue-400"><Unlock size={12} /> SESSION_ID: AF7X-902-K</span>
         </div>
         <div className="flex gap-10">
            <span>OPERATOR_SIG: 0x4f7...92a</span>
            <span className="animate-pulse text-red-500">TRIAGE_IN_PROGRESS</span>
         </div>
      </div>
    </div>
  );
};
