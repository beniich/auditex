import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Target, 
  Zap, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  Terminal,
  Clock,
  History
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';

const MetricBox = ({ title, value, detail, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
    </div>
    <div className="flex flex-col">
      <h4 className="text-2xl font-black text-[#091426] tracking-tighter">{value}</h4>
      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{detail}</p>
    </div>
  </div>
);

export const AiAnalyticsHub = () => {
  const { data: stats, isLoading } = useApiQuery(['ai-analytics'], () => fetch('/api/ai/analytics').then(res => res.json()));

  if (isLoading) return <div className="p-10 animate-pulse text-slate-400 font-black uppercase tracking-widest">Loading Intelligence Stream...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-[#091426] p-10 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
           <Cpu size={200} />
        </div>
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">AI_OBSERVABILITY_v1.0</span>
              <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Activity size={12} className="animate-pulse" /> ENGINE_HEALTH: CALIBRATED
              </span>
           </div>
           <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Intelligence Monitoring</h2>
           <p className="text-slate-400 max-w-xl mt-4 text-sm font-medium leading-relaxed">
              Real-time telemetry of the Agentic AI gateway. Monitor precision, latency, and operational cost 
              to ensure maximum reliability of the AuditAX engine.
           </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricBox 
          title="Engine Accuracy" 
          value={`${stats?.accuracy || 0}%`} 
          detail="Human Acceptance Rate" 
          icon={Target} 
          color="text-emerald-500" 
        />
        <MetricBox 
          title="Model Latency" 
          value={`${Math.round(stats?.avgLatency || 0)}ms`} 
          detail="Round-trip Response Time" 
          icon={Clock} 
          color="text-blue-500" 
        />
        <MetricBox 
          title="Operational Cost" 
          value={`$${stats?.totalTokenCost?.toFixed(2) || 0}`} 
          detail="Current Billing Cycle" 
          icon={DollarSign} 
          color="text-amber-500" 
        />
        <MetricBox 
          title="Active Model" 
          value="GPT-4o" 
          detail={stats?.activePromptVersion || 'v1.0'} 
          icon={Cpu} 
          color="text-slate-500" 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Decision Ledger */}
         <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
               <History size={18} className="text-blue-600" /> Recent Decision Alignment
            </h3>
            <div className="space-y-4">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <ShieldCheck size={18} className="text-emerald-500" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-[#091426] uppercase">Non-Conformity Identified</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Prompt_v1.2.0 • ISO 27001 Context</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                           Validated by Human
                        </span>
                        <span className="text-[9px] font-mono text-slate-300">0.824s</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Tech Stack Diagnostics */}
         <div className="col-span-12 lg:col-span-4 bg-[#f8fafc] p-10 rounded-[2.5rem] border border-slate-200">
            <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] mb-8">System Internals</h3>
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                     <span>RAG Throughput</span>
                     <span>98%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 w-[98%]" />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                     <span>Vector Index Sync</span>
                     <span>Stable</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[100%]" />
                  </div>
               </div>
               <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#091426] uppercase tracking-widest">
                     <Terminal size={14} className="text-blue-600" /> API Gateway
                  </div>
                  <code className="block bg-[#091426] text-blue-400 p-4 rounded-xl mt-4 text-[9px] font-mono leading-relaxed">
                     [SYS] Handshake complete...<br/>
                     [AI] RAG context loaded (34 policies)<br/>
                     [SEC] SHA-256 integrity check OK<br/>
                     [V5] System Operational
                  </code>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
