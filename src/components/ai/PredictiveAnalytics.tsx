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
  Zap,
  Terminal
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

export const PredictiveAnalytics = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Risk Forecast Engine"
        subtitle="Anticipate regulatory drift and infrastructural vulnerabilities with 90-day predictive precision."
        badge="Global Intelligence"
        icon={TrendingUp}
        breadcrumb={['Admin', 'AI', 'Predictive']}
        actions={
          <div className="flex gap-4 p-2 bg-white/50 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
             <Button variant="secondary" className="px-8 bg-slate-900 text-white rounded-xl text-[10px]" size="sm">Spatial Topology</Button>
             <Button variant="ghost" className="px-8 text-slate-500 rounded-xl text-[10px]" size="sm">Quant Analytics</Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        {/* Interactive Map Drilldown */}
        <div className="col-span-12 lg:col-span-8">
           <SectionCard padding="none" className="min-h-[650px] relative group overflow-hidden shadow-2xl">
              <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
                 <div className="bg-slate-900 border border-white/10 p-2.5 rounded-2xl shadow-2xl flex flex-col gap-2">
                    <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 transition-all"><TrendingUp size={20}/></button>
                    <div className="h-px bg-white/10 mx-2"></div>
                    <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Search size={20}/></button>
                    <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Fingerprint size={20}/></button>
                 </div>
              </div>

              <div className="absolute top-8 right-8 z-20">
                 <StatusBadge label="PREDICTIVE MODEL: LOCKED" variant="success" icon={Activity} className="px-6 py-4 animate-pulse shadow-2xl shadow-emerald-500/20 border-emerald-400/50" />
              </div>

              <div className="absolute inset-0 bg-[#091426] flex items-center justify-center overflow-hidden">
                 {/* Simulated Premium Map */}
                 <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3VF3TfSwSvg5clsfM_ZPAzvsTfbgYNoX_qngzaX7LAY4eo0IEO8sXxjxfqIE6iiKbg8DjRIEfgUPrIafRyX6xnLF-cammUbr2ivu8I5H6oh7p_RX1F1Xj-fQae8Qn0LdHJ4XIDdFTZxwGK1pOuJKm8xgTyfVWj-lXg5pK9W5fT12QQR7zFJ-EIGKGFmnj1oQ_rk8x6Lg1KhlfU13oQ6kF22VkNIqV7nFyQte58cZOvV7qx4M-LJruwtVEVWHXdaty7HRhJOiONrQ"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen grayscale contrast-150 transition-transform duration-[20s] group-hover:scale-110"
                    alt="Risk Map"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#091426] via-transparent to-[#091426]/50" />
                 
                 {/* Interactive Pulse Hotspots */}
                 <div className="absolute top-[35%] left-[48%] group/pin cursor-pointer">
                    <div className="relative flex items-center justify-center">
                       <div className="absolute w-24 h-24 bg-red-500/20 rounded-full animate-ping"></div>
                       <div className="absolute w-12 h-12 bg-red-500/40 rounded-full animate-pulse"></div>
                       <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-2xl z-10"></div>
                       <div className="absolute bottom-10 bg-white p-4 rounded-[2rem] shadow-2xl min-w-[180px] opacity-0 group-hover/pin:opacity-100 transition-all translate-y-4 group-hover/pin:translate-y-0 text-slate-900 border border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Frankfurt DE-7</p>
                          <p className="text-sm font-black text-red-600 uppercase italic">Critical Deviation</p>
                          <div className="mt-3 text-[8px] font-bold text-slate-500 uppercase">Detection ID: PRD-942</div>
                       </div>
                    </div>
                 </div>

                 <div className="absolute top-[55%] left-[42%]">
                    <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-2xl animate-pulse"></div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end pointer-events-none">
                 <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Risk Velocity Breakdown</p>
                    <div className="flex gap-8">
                       {[
                         { label: 'Cloud', val: 78, color: 'bg-blue-500' },
                         { label: 'Edge', val: 42, color: 'bg-emerald-500' },
                         { label: 'Auth', val: 94, color: 'bg-red-500' }
                       ].map(s => (
                         <div key={s.label} className="flex flex-col items-center gap-3">
                            <div className="w-2 h-20 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
                               <motion.div initial={{ height: 0 }} animate={{ height: `${s.val}%` }} className={`w-full ${s.color} shadow-lg shadow-current`} />
                            </div>
                            <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">{s.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-2xl flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Health Index</p>
                       <p className="text-4xl font-black text-white italic tracking-tighter leading-none">88.2%</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 border border-blue-400/50">
                       <Zap size={28} className="text-white fill-current" />
                    </div>
                 </div>
              </div>
           </SectionCard>
        </div>

        {/* Sidebar Intelligence */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <SectionCard title="90-Day Forecast" subtitle="Predictive threat mapping & aggregate probability" padding="large">
              <div className="space-y-8 mt-6">
                 <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Aggregate Probability</p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter mt-2 leading-none italic">12.4%</p>
                    </div>
                    <StatusBadge label="-4.2% LOW" variant="success" className="px-4" />
                 </div>
                 <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Model Confidence</span>
                      <span className="text-blue-600">STABLE</span>
                   </div>
                   <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-blue-600 shadow-lg shadow-blue-500/40" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col items-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Stability</p>
                       <p className="text-xl font-black text-emerald-600 italic">HIGH</p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col items-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Inference</p>
                       <p className="text-xl font-black text-blue-600 italic">STABLE</p>
                    </div>
                 </div>
              </div>
           </SectionCard>

           <SectionCard title="Regulatory Drift" subtitle="Regional threat assessment breaking" padding="none">
              <div className="p-4 space-y-3">
                 {[
                   { zone: 'EMEA-West', threat: '2.1 LOW', variant: 'success' as const },
                   { zone: 'APAC-South', threat: '8.4 CRIT', variant: 'danger' as const },
                   { zone: 'Americas-C', threat: '5.2 MED', variant: 'warning' as const },
                   { zone: 'Nordic-R1', threat: '0.8 MIN', variant: 'brand' as const },
                 ].map(row => (
                   <div key={row.zone} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-white transition-all cursor-pointer group">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors italic">{row.zone}</span>
                      <StatusBadge label={row.threat} variant={row.variant} className="scale-90" />
                   </div>
                 ))}
              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                 <Button variant="primary" className="w-full bg-slate-900 shadow-slate-900/10 py-4 text-[10px]" icon={Download}>Export Analysis Protocol</Button>
              </div>
           </SectionCard>
        </div>

        {/* Live Intelligence Feed (Full Width) */}
        <div className="col-span-12">
           <SectionCard title="Risk Event Sentinel" subtitle="Live forensic telemetry and intelligence stream" padding="large">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                 <div className="flex items-center gap-4 text-red-600">
                    <ShieldAlert size={28} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">Critical Feed Active</span>
                 </div>
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2 italic">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       Ledger Synchronization: 100%
                    </span>
                    <Button variant="secondary" size="sm" className="text-[10px]" icon={Terminal}>Protocol Override</Button>
                 </div>
              </div>

              <div className="relative pl-12 border-l-2 border-slate-100 space-y-16 mt-12 pb-10">
                 {[
                   { title: 'Critical Breach Sequence - DE-7', time: '14:22 UTC', desc: 'Predictive model identified biometric pattern deviation. Access revoked. Incident forwarded to remediation Kanban.', variant: 'danger' as const },
                   { title: 'Regulatory Update Detected - EU-PARIS', time: '13:10 UTC', desc: 'New NIST/ISO directive added to RAG context. Policy library updated automatically via Nexus Agent.', variant: 'brand' as const },
                   { title: 'Auth-Loop Stabilized - US-EAST', time: '10:05 UTC', desc: 'Latency optimized by 24ms using edge inference calibration. No further drift detected.', variant: 'success' as const }
                 ].map((event, i) => (
                   <div key={i} className="relative group">
                      <div className={`absolute -left-[64px] top-1 w-6 h-6 rounded-xl shadow-2xl z-20 group-hover:scale-125 transition-transform flex items-center justify-center border-4 border-white ${
                        event.variant === 'danger' ? 'bg-red-500' : event.variant === 'brand' ? 'bg-blue-600' : 'bg-emerald-500'
                      }`}>
                         {event.variant === 'danger' ? <AlertCircle size={10} className="text-white" /> : <Activity size={10} className="text-white" />}
                      </div>
                      <div className="flex justify-between items-center mb-3">
                         <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">{event.title}</h4>
                         <span className="text-[10px] font-mono font-black text-slate-400 italic tabular-nums bg-slate-50 px-4 py-2 rounded-full border border-slate-100">{event.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-4xl uppercase tracking-tight opacity-70">
                        "{event.desc}"
                      </p>
                      <div className="mt-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                         <Button variant="ghost" size="sm" className="text-[9px] uppercase tracking-widest text-blue-600">Inspect Node</Button>
                         <Button variant="ghost" size="sm" className="text-[9px] uppercase tracking-widest text-slate-400">Archive Trace</Button>
                      </div>
                   </div>
                 ))}
              </div>
           </SectionCard>
        </div>
      </div>
    </PageWrapper>
  );
};
