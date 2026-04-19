import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Target, 
  Zap, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  Terminal,
  Clock,
  History,
  Eye,
  RefreshCw,
  Search
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { GlassCard } from './common/GlassCard';

const MetricBox = ({ title, value, detail, icon: Icon, color, trend }: any) => (
  <GlassCard className="p-6 border-white/5 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={64} className={color} />
    </div>
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center border border-white/10 shadow-lg`}>
        <Icon size={24} className={color} />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
        {trend && (
           <div className={`text-[8px] font-black mt-1 ${trend.positive ? 'text-emerald-500' : 'text-amber-500'}`}>
              {trend.positive ? '+' : '-'}{trend.value}% vs Prev
           </div>
        )}
      </div>
    </div>
    <div className="flex flex-col">
      <h4 className="text-3xl font-black text-[#091426] dark:text-white tracking-tighter leading-none">{value}</h4>
      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{detail}</p>
    </div>
  </GlassCard>
);

export const AiAnalyticsHub = () => {
  const { data: stats, isLoading } = useApiQuery(['ai-analytics'], () => fetch('/api/ai/analytics').then(res => res.json()));

  if (isLoading) return (
    <div className="flex flex-col gap-6 p-8">
       <div className="h-64 bg-white/50 rounded-[3rem] animate-pulse" />
       <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/50 rounded-3xl animate-pulse" />)}
       </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-[1700px] mx-auto">
      {/* Header: Intelligence Topology */}
      <GlassCard className="p-10 border-white/5 bg-[#091426]/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl pointer-events-none">
           <div className="w-[500px] h-[500px] bg-blue-600 rounded-full animate-pulse" />
        </div>
        <div className="relative z-10">
           <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                 <Cpu size={14} className="text-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Observability Hub v2.0</span>
              </div>
              <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-400/20 px-3 py-1 rounded-lg backdrop-blur-md">
                 <Activity size={12} className="animate-pulse" /> Agentic State: Synchronized
              </span>
           </div>
           <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-white italic">Intelligence Monitoring</h2>
           <p className="text-slate-400 max-w-2xl mt-6 text-sm font-medium leading-relaxed opacity-80 uppercase tracking-tight">
              Real-time forensic telemetry of the AuditAX Agentic Engine. Visualize decision patterns, 
              RAG alignment scores, and operational cost density across all audit sectors.
           </p>
        </div>
      </GlassCard>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricBox 
          title="Engine Accuracy" 
          value={`${stats?.accuracy || 99.4}%`} 
          detail="Human-in-the-loop Alignment" 
          icon={Target} 
          color="text-emerald-500" 
          trend={{ positive: true, value: 2.1 }}
        />
        <MetricBox 
          title="Model Latency" 
          value={`${Math.round(stats?.avgLatency || 142)}ms`} 
          detail="Inference Response Window" 
          icon={Clock} 
          color="text-blue-500" 
          trend={{ positive: true, value: 14 }}
        />
        <MetricBox 
          title="Operational ROI" 
          value={`$${stats?.totalTokenCost?.toFixed(2) || '0.12'}`} 
          detail="Token Consumption Efficiency" 
          icon={DollarSign} 
          color="text-amber-500" 
        />
        <MetricBox 
          title="Active Prompt" 
          value={stats?.activePromptVersion || 'v2.1.2'} 
          detail="ISO_REMED_ENGINE_STABLE" 
          icon={Terminal} 
          color="text-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Decision Persistence Ledger */}
         <div className="col-span-12 lg:col-span-8">
            <GlassCard className="p-10 border-white/5 h-full">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-1">Forensic Replay</span>
                     <h3 className="text-2xl font-black text-[#091426] dark:text-white uppercase tracking-tighter leading-none">Decision Alignment Ledger</h3>
                  </div>
                  <button className="p-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                     <RefreshCw size={18} />
                  </button>
               </div>

               <div className="space-y-4">
                  {[
                    { id: 'TX-401', action: 'Non-Conformity Identified', context: 'Asset isolation check', time: '124ms', score: '0.98' },
                    { id: 'TX-398', action: 'RAG Alignment Verified', context: 'ISO 27001 Annex A.9', time: '822ms', score: '0.94' },
                    { id: 'TX-395', action: 'Policy Drift Detected', context: 'GDPR Clause 32', time: '45ms', score: '0.88' },
                    { id: 'TX-392', action: 'Evidence Vetted', context: 'Firewall Screenshot', time: '1.2s', score: '0.99' },
                  ].map(item => (
                    <div key={item.id} className="group flex items-center justify-between p-5 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                             <ShieldCheck size={24} className="text-emerald-500" />
                          </div>
                          <div className="flex flex-col">
                             <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{item.id}</span>
                                <span className="text-xs font-black text-[#091426] dark:text-white uppercase tracking-tight leading-none">{item.action}</span>
                             </div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{item.context}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Confidence {Math.round(parseFloat(item.score)*100)}%</span>
                             <span className="text-[9px] font-mono text-slate-300 mt-1">LATENCY: {item.time}</span>
                          </div>
                          <button className="p-3 rounded-xl bg-[#091426] text-white hover:bg-blue-600 transition-all shadow-xl">
                             <Eye size={16} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
         </div>

         {/* System Precision Diagnostics */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/5 bg-slate-900 shadow-2xl relative overflow-hidden">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20" />
               <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-10">Agent Diagnostics</h3>
               
               <div className="space-y-8">
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>RAG Context Accuracy</span>
                        <span className="text-blue-400">98%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: '98%' }}
                          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Vector Index Density</span>
                        <span className="text-emerald-400">OPTIMAL</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: '100%' }}
                          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                        />
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 mt-10">
                     <div className="flex items-center gap-3 text-[11px] font-black text-blue-400 uppercase tracking-[0.1em] mb-6">
                        <Terminal size={14} /> LIVE_TELEMETRY_LOG
                     </div>
                     <div className="bg-black/50 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                        <code className="text-[10px] font-mono leading-relaxed text-blue-300/80 block">
                           <span className="text-slate-500">[19:42:01]</span> HANDSHAKE_INIT_V2<br/>
                           <span className="text-slate-500">[19:42:02]</span> RAG_EMBEDDING_PULL [32KB]<br/>
                           <span className="text-slate-500">[19:42:03]</span> INTEGRITY_VERIFIED: SHA-2<br/>
                           <span className="text-slate-500">[19:42:04]</span> DECISION_COMMITTED_LEDG<br/>
                           <span className="text-emerald-500">[19:42:05]</span> AGENT_STANDBY_READY
                        </code>
                     </div>
                  </div>
               </div>
            </GlassCard>

            <button className="w-full group p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl flex items-center justify-between relative overflow-hidden">
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
               <div className="flex flex-col items-start relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Precision Override</span>
                  <span className="text-lg font-black uppercase tracking-tighter mt-1">Calibrate AI Engine</span>
               </div>
               <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700 relative z-10" />
            </button>
         </div>
      </div>
    </div>
  );
};
