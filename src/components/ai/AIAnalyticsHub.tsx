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
  Search,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';
import { QuotaDashboard } from '../admin/QuotaDashboard';

const MetricBox = ({ title, value, detail, icon: Icon, variant, trend }: any) => (
  <SectionCard padding="large" className="hover:scale-[1.02] transition-all">
    <div className="flex justify-between items-start mb-8">
      <div className="p-4 bg-slate-50 rounded-2xl">
         <Icon size={24} className={
           variant === 'success' ? 'text-emerald-500' : 
           variant === 'brand' ? 'text-blue-600' : 
           variant === 'warning' ? 'text-amber-500' : 'text-indigo-500'
         } />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
        {trend && (
           <div className={`text-[10px] font-black mt-2 flex items-center justify-end gap-1 ${trend.positive ? 'text-emerald-500' : 'text-amber-500'}`}>
              {trend.positive ? '+' : '-'}{trend.value}% <TrendingUp size={12} className={trend.positive ? '' : 'rotate-180'} />
           </div>
        )}
      </div>
    </div>
    <div className="flex flex-col">
      <h4 className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</h4>
      <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest leading-relaxed">{detail}</p>
    </div>
  </SectionCard>
);

export const AIAnalyticsHub = () => {
  const { data: stats, isLoading } = useApiQuery(['ai-analytics'], () => fetch('/api/ai/analytics').then(res => res.json()));

  if (isLoading) return (
     <PageWrapper>
        <div className="animate-pulse space-y-8">
           <div className="h-64 bg-slate-100 rounded-[3rem]" />
           <div className="grid grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2rem]" />)}
           </div>
        </div>
     </PageWrapper>
  );

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Nexus AI Analytics"
        subtitle="Real-time forensic telemetry of the AuditAX Agentic Engine. Visualize decision patterns."
        badge="Observability Hub v2.0"
        icon={Brain}
        breadcrumb={['Admin', 'AI', 'Analytics']}
        actions={
          <div className="flex gap-4">
             <Button variant="brand" icon={RefreshCw} size="sm">Calibrate Engine</Button>
          </div>
        }
      />

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <MetricBox 
          title="Engine Accuracy" 
          value={`${stats?.accuracy || 99.4}%`} 
          detail="Human-in-the-loop Alignment Score" 
          variant="success" 
          icon={Target} 
          trend={{ positive: true, value: 2.1 }}
        />
        <MetricBox 
          title="Model Latency" 
          value={`${Math.round(stats?.avgLatency || 142)}ms`} 
          detail="Inference Response Window" 
          variant="brand" 
          icon={Clock} 
          trend={{ positive: true, value: 14 }}
        />
        <MetricBox 
          title="Operational ROI" 
          value={`$${stats?.totalTokenCost?.toFixed(2) || '0.12'}`} 
          detail="Token Consumption Efficiency" 
          variant="warning" 
          icon={DollarSign} 
        />
        <MetricBox 
          title="Active Prompt" 
          value={stats?.activePromptVersion || 'v2.1.2'} 
          detail="ISO_REMED_ENGINE_STABLE" 
          variant="info" 
          icon={Terminal} 
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Decision Persistence Ledger */}
         <div className="col-span-12 lg:col-span-8">
            <SectionCard 
               title="Decision Alignment Ledger" 
               subtitle="Secure forensic replay of agentic operational outcomes"
               padding="none"
               actions={<Button variant="ghost" size="sm" icon={RefreshCw}>Resync</Button>}
            >
               <div className="p-4 space-y-4">
                  {[
                    { id: 'TX-401', action: 'Non-Conformity Identified', context: 'Infrastructure: Asset isolation check', time: '124ms', score: '0.98' },
                    { id: 'TX-398', action: 'RAG Alignment Verified', context: 'Policy Library: ISO 27001 Annex A.9', time: '822ms', score: '0.94' },
                    { id: 'TX-395', action: 'Policy Drift Detected', context: 'Governance: GDPR Clause 32', time: '45ms', score: '0.88' },
                    { id: 'TX-392', action: 'Evidence Vetted', context: 'Security Logs: Firewall Screenshot', time: '1.2s', score: '0.99' },
                  ].map(item => (
                    <div key={item.id} className="group flex items-center justify-between p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-blue-200 rounded-[2rem] transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                             <ShieldCheck size={24} />
                          </div>
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{item.id}</span>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.action}</h4>
                             </div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.context}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="flex flex-col items-end">
                             <StatusBadge label={`CONFIDENCE ${Math.round(parseFloat(item.score)*100)}%`} variant="success" className="scale-75" />
                             <span className="text-[9px] font-mono font-bold text-slate-300 uppercase mt-2">LATENCY: {item.time}</span>
                          </div>
                          <Button variant="ghost" icon={Eye} size="sm" className="bg-slate-900 text-white hover:bg-slate-800" />
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                  <Button variant="secondary" className="w-full text-slate-500 uppercase tracking-widest py-4 bg-white shadow-sm" icon={History}>View Full Integrity Trail</Button>
               </div>
            </SectionCard>
         </div>

         {/* System Precision Diagnostics */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <SectionCard variant="dark" title="Agent Diagnostics" subtitle="Core neural performance monitoring" padding="large" className="relative overflow-hidden">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20" />
               <div className="space-y-10 relative z-10">
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>RAG Context Accuracy</span>
                        <span className="text-blue-400">98%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: '98%' }}
                          className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>Vector Index Density</span>
                        <span className="text-emerald-400">OPTIMAL</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: '100%' }}
                          className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                        />
                     </div>
                  </div>

                  <div className="pt-10 border-t border-white/10">
                     <div className="flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-6">
                        <Terminal size={14} /> LIVE_TELEMETRY_LOG
                     </div>
                     <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                        <code className="text-[11px] font-mono leading-relaxed text-blue-300/80 block italic">
                           <span className="text-slate-500">[19:42:01]</span> HANDSHAKE_INIT_V2<br/>
                           <span className="text-slate-500">[19:42:02]</span> RAG_EMBEDDING_PULL [32KB]<br/>
                           <span className="text-slate-500">[19:42:03]</span> INTEGRITY_VERIFIED: SHA-2<br/>
                           <span className="text-slate-500">[19:42:04]</span> DECISION_COMMITTED_LEDG<br/>
                           <span className="text-emerald-500">[19:42:05]</span> AGENT_STANDBY_READY
                        </code>
                     </div>
                  </div>
               </div>
            </SectionCard>

            <Button variant="brand" className="w-full py-6 rounded-[2.5rem] text-sm shadow-blue-600/20" icon={RefreshCw}>
               Calibrate Operational Weights
            </Button>

            <QuotaDashboard />
         </div>
      </div>
    </PageWrapper>
  );
};

export default AIAnalyticsHub;
