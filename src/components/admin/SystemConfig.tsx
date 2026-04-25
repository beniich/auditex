import React from 'react';
import { 
  Server, 
  Database, 
  Key, 
  ShieldCheck, 
  Cpu,
  RefreshCw,
  Power,
  Activity,
  Globe
} from 'lucide-react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

export const SystemConfig: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="System Configuration"
        subtitle="Manage global compliance nodes, API webhooks, and database synchronization logic."
        badge="System Stable"
        badgeVariant="success"
        icon={Server}
        breadcrumb={['Admin', 'Infrastructure', 'Config']}
        actions={
          <StatusBadge label="All Systems Operational" variant="success" icon={Activity} />
        }
      />

      <div className="grid grid-cols-12 gap-8">
         {/* Integration Health */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            <SectionCard 
               title="Endpoint Health Matrix" 
               subtitle="Real-time status of critical infrastructure hooks"
               padding="none"
               actions={
                 <Button variant="ghost" size="sm" icon={RefreshCw}>Re-Ping All</Button>
               }
            >
               <div className="divide-y divide-slate-50 mt-4">
                  {[
                    { name: 'Primary Database (PostgreSQL)', status: 'Connected', latency: '12ms', url: 'db.cluster-alpha.internal:5432' },
                    { name: 'Forensic Event Store', status: 'Connected', latency: '4ms', url: 'events.auditmaster.local:4222' },
                    { name: 'AI Diagnostics Engine', status: 'Syncing', latency: '185ms', url: 'ai.diagnostics.ext/v1/predict' },
                    { name: 'LDAP / AD Auth Gateway', status: 'Connected', latency: '45ms', url: 'auth.enterprise.net:636' }
                  ].map(endpoint => (
                    <div key={endpoint.name} className="p-6 hover:bg-slate-50 flex items-center justify-between transition-colors group">
                       <div className="flex items-center gap-5">
                          <div className={`p-3 rounded-xl ${
                             endpoint.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          } group-hover:scale-110 transition-transform`}>
                             <Server size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{endpoint.name}</p>
                             <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">{endpoint.url}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <StatusBadge label={endpoint.status} variant={endpoint.status === 'Connected' ? 'success' : 'warning'} className="mb-2 w-fit ml-auto" />
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">{endpoint.latency} latency</p>
                       </div>
                    </div>
                  ))}
               </div>
            </SectionCard>

            <SectionCard title="Security & Hardening Rules" padding="large">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:border-blue-200 transition-colors">
                     <ShieldCheck size={28} className="text-blue-600 mb-4" />
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-2">Data at Rest</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed mb-6">AES-256 encryption mandated for all active forensic volumes.</p>
                     <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Strict Shield</span>
                        <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                           <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-1 top-0.75"></div>
                        </div>
                     </div>
                  </div>
                  <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 hover:border-blue-200 transition-colors">
                     <Key size={28} className="text-blue-600 mb-4" />
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-2">Key Rotation Strategy</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed mb-6">Autonomous rotation of integration keys every 30 days cycle.</p>
                     <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Auto-Rotate</span>
                        <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                           <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-1 top-0.75"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </SectionCard>
         </div>

         {/* Master Controls */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <SectionCard variant="dark">
               <div className="relative z-10">
                  <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8">Master Controls</h3>
                  
                  <div className="space-y-8">
                     <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight mb-2 italic">Infrastructure Lock</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">Disable non-admin access for scheduled kernel patching.</p>
                        <Button variant="secondary" className="w-full py-4 text-slate-300 hover:text-red-500 border-white/10 bg-white/5" icon={Power}>
                           Maintenance Mode
                        </Button>
                     </div>
                     <div className="h-px bg-white/5"></div>
                     <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight mb-2 italic">Telemetry Purge</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">Wipe volatile cache layers across edge nodes.</p>
                        <Button variant="secondary" className="w-full py-4 text-slate-300 border-white/10 bg-white/5" icon={Database}>
                           Clear System Cache
                        </Button>
                     </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-24 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            </SectionCard>

            <SectionCard padding="large">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Build & Architecture</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Platform Core', val: 'v3.4.1-STABLE', color: 'text-blue-600' },
                    { label: 'Client Framework', val: 'React 18.2.0', color: 'text-slate-900' },
                    { label: 'Last Deployed', val: '4 HOURS AGO', color: 'text-slate-500' }
                  ].map((info, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{info.label}</span>
                       <span className={`text-[10px] font-mono font-black ${info.color}`}>{info.val}</span>
                    </div>
                  ))}
               </div>
               <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 animate-pulse">
                     <Cpu size={24} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                     Core Kernel operating at <span className="text-slate-900">4ms internal latency</span>. Node integrity verified.
                  </p>
               </div>
            </SectionCard>
         </div>
      </div>
    </PageWrapper>
  );
};
