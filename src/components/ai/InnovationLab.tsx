import React from 'react';
import { motion } from 'motion/react';
import { 
  FlaskConical, 
  Beaker, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Database, 
  Dna, 
  CloudLightning, 
  Cpu as Microchip, 
  Settings, 
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  History,
  CheckCircle2,
  Lock,
  Globe,
  RotateCcw
} from 'lucide-react';

import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const InnovationLab: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Innovation Lab & Beta Features"
        subtitle="Modify advanced configurations and early-access modules. Changes here affect platform behavior at the core layer."
        badge="Experimental_Core v0.8.2"
        icon={FlaskConical}
        breadcrumb={['Admin', 'AI', 'Innovation']}
        actions={
          <div className="flex gap-4">
             <Button variant="secondary" icon={History} size="sm">Audit Flags</Button>
             <Button variant="primary" className="bg-slate-900 shadow-slate-900/10" icon={RotateCcw} size="sm">Reset Session</Button>
          </div>
        }
      />

      {/* Top Research Row */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Experiment Card */}
        <div className="col-span-12 lg:col-span-8">
           <SectionCard 
              title="Forensic Pattern Analysis" 
              subtitle="Autonomous agent processing for massive unstructured datasets"
              padding="none"
              actions={<StatusBadge label="VERIFIED STABILITY" variant="success" className="scale-75" />}
           >
              <div className="flex flex-col lg:flex-row">
                 <div className="flex-1 p-10 space-y-8 border-r border-slate-50">
                    <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-tight italic">
                      Reduces time-to-detection by ~40% via LLM-based verification logs and neural pattern anchoring.
                    </p>
                    <div className="space-y-4">
                       {[
                         'Real-time anomaly anchoring', 
                         'Natural language audit querying', 
                         'Auto-tagging of compliance violations'
                       ].map((feat, i) => (
                         <div key={i} className="flex gap-4 text-[10px] font-black text-slate-900 uppercase tracking-widest items-center">
                            <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                               <CheckCircle2 size={14} />
                            </div>
                            {feat}
                         </div>
                       ))}
                    </div>
                    <Button variant="brand" className="w-full mt-6 py-4 shadow-blue-600/20" icon={Activity}>Configure Neural Weights</Button>
                 </div>
                 <div className="w-full lg:w-[400px] bg-slate-50/50 p-10 flex flex-col gap-8 justify-center">
                    <div className="aspect-video w-full bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl group">
                       <div className="absolute top-0 right-0 p-10 opacity-5 grayscale group-hover:grayscale-0 group-hover:scale-125 transition-all duration-1000">
                          <Globe size={120} className="text-blue-400" />
                       </div>
                       <div className="flex justify-between items-start relative z-10">
                          <span className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest">VISUAL_ENGINE::ACTIVE</span>
                          <Microchip size={18} className="text-slate-600" />
                       </div>
                       <div className="flex justify-center items-center py-6 relative z-10">
                          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                             <Activity size={48} className="text-blue-500" />
                          </motion.div>
                       </div>
                       <div className="flex justify-between items-end font-mono text-[8px] text-slate-500 uppercase tracking-widest relative z-10">
                          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CPU: 12.4%</span>
                          <span>THREADS: 256</span>
                       </div>
                    </div>
                    <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feature Flag</span>
                       <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                       </div>
                    </div>
                 </div>
              </div>
           </SectionCard>
        </div>

        {/* Quick Laboratory Stats */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <SectionCard variant="dark" padding="large" className="relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-12 opacity-10 blur-xl">
                 <Beaker size={140} className="text-blue-400" />
              </div>
              <div className="relative z-10 space-y-3">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic mb-6">Laboratory_Health</p>
                 <h4 className="text-7xl font-black tracking-tighter italic leading-none">14</h4>
                 <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest mt-4">Active Experiments Protocol</p>
              </div>
              <div className="relative z-10 space-y-4 mt-12">
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '67%' }} className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)]" />
                 </div>
                 <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest flex justify-between italic">
                    <span>SYSTEM_CAPACITY</span>
                    <span className="text-white">67% UTILIZED</span>
                 </p>
              </div>
           </SectionCard>

           <SectionCard title="Recent Deployments" subtitle="Immutable session telemetry logs" padding="none">
              <div className="p-4 space-y-4">
                 {[
                   { time: '14:02', user: 'ADMIN_RT', act: 'MOD: DEBUG_OVERLAY', res: 'success' as const },
                   { time: '13:45', user: 'SYSTEM', act: 'OFF: HYPER_GRAPH', res: 'info' as const },
                   { time: '09:12', user: 'ADMIN_SC', act: 'SYNC: MASTER_NODE', res: 'brand' as const },
                 ].map((log, i) => (
                   <div key={i} className="flex justify-between items-center p-5 bg-slate-50/50 hover:bg-white border border-slate-50 hover:border-blue-100 rounded-[1.5rem] transition-all group">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">{log.act}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.user}</p>
                      </div>
                      <StatusBadge label={log.time} variant={log.res} className="scale-75 font-mono" />
                   </div>
                 ))}
              </div>
           </SectionCard>
        </div>
      </div>

      {/* Beta Feature Grid */}
      <SectionCard 
        title="Feature Repository" 
        subtitle="Toggle experimental platform components and protocols"
        padding="none"
        actions={
          <div className="flex gap-2">
             {['ALL', 'SECURITY', 'UI/UX'].map((cat, i) => (
               <button key={i} className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                 i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'
               }`}>{cat}</button>
             ))}
          </div>
        }
      >
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-slate-100">
            {[
              { title: 'Raw JSON Auditor', id: 'RAW_JSON_X_44', icon: <Database size={24} />, active: false, desc: 'Expose raw response bodies in audit trail for backend debugging.' },
              { title: 'Turbo Engine V3', id: 'SCAN_TURBO_MOD', icon: <Zap size={24} />, active: true, desc: 'Enables multi-threaded scanning across all global compliance clusters.' },
              { title: 'Stealth Mode Logs', id: 'SEC_STEALTH_V8', icon: <Lock size={24} />, active: false, desc: 'Prevents internal logging of high-priority forensic sessions.' },
              { title: 'Blockchain Notarization', id: 'CHAIN_NOTARY_PRO', icon: <Globe size={24} />, active: false, desc: 'Anchor audit log entries to public immutable ledgers.' },
              { title: 'Modern Glass UI', id: 'UI_GLASS_MODERN', icon: <Layers size={24} />, active: true, desc: 'Enables frosted glass effects and high-depth shadows.' },
              { title: 'Verbose Debugging', id: 'DEV_VERBOSE_LOGS', icon: <Terminal size={24} />, active: false, desc: 'Display internal system stack traces in the frontend console.' },
            ].map((feat, i) => (
              <div key={i} className="p-10 group hover:bg-slate-50 transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      feat.active ? 'bg-blue-600 text-white shadow-blue-500/20 rotate-6 group-hover:rotate-0' : 'bg-slate-100 text-slate-400 grayscale scale-90'
                    }`}>
                       {feat.icon}
                    </div>
                    <div className={`w-12 h-6 rounded-full relative p-1 transition-all ${feat.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${feat.active ? 'right-1' : 'left-1'}`} />
                    </div>
                 </div>
                 <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-3 group-hover:text-blue-600 transition-all italic">{feat.title}</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-10 leading-relaxed opacity-70">{feat.desc}</p>
                 <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                    <span className="text-[9px] font-mono font-black text-slate-300 uppercase leading-none italic">ID: {feat.id}</span>
                    <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                 </div>
              </div>
            ))}
         </div>
      </SectionCard>

      {/* Change History Footer */}
      <SectionCard title="Critical Override History" subtitle="Central cryptographic notarization of session flags" padding="none">
         <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
               <thead className="bg-slate-50/50">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-10 py-6">Timestamp_UTC</th>
                     <th className="px-10 py-6">Admin Principal</th>
                     <th className="px-10 py-6">Feature Target</th>
                     <th className="px-10 py-6">Protocol Result</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 font-mono text-[10px] font-black uppercase tracking-tight text-slate-600">
                  {[
                    { time: '2026-04-24 10:22:45', user: 'ADMIN_01::ROOT', target: 'UI_GLASS_MODERN', res: 'SUCCESS' },
                    { time: '2026-04-24 09:14:12', user: 'SYSTEM::DAEMON', target: 'SCAN_TURBO_MOD', res: 'AUTO_SYNC' },
                    { time: '2026-04-23 18:05:33', user: 'SARAH_C::SEC', target: 'SEC_STEALTH_V8', res: 'REJECTED' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                       <td className="px-10 py-6 text-slate-400">{row.time}</td>
                       <td className="px-10 py-6 text-slate-900">{row.user}</td>
                       <td className="px-10 py-6 text-blue-600 italic">{row.target}</td>
                       <td className="px-10 py-6">
                          <StatusBadge 
                            label={row.res} 
                            variant={row.res === 'SUCCESS' ? 'success' : row.res === 'REJECTED' ? 'danger' : 'info'} 
                            className="scale-90" 
                          />
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </SectionCard>

    </PageWrapper>
  );
};

export default InnovationLab;
