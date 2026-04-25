import React, { useState } from 'react';
import { 
  Shield, Key, Terminal, Eye, EyeOff, Trash2, RotateCw, Activity, 
  CheckCircle2, Lock, Plus, History, Network, Zap, Fingerprint, Cpu 
} from 'lucide-react';
import { ApiService } from '../../services/ApiService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const APISecurity: React.FC = () => {
  const queryClient = useQueryClient();
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const { data: keys = [], isLoading } = useApiQuery(
    ['api-keys'],
    () => ApiService.getKeys()
  );

  const createMutation = useMutation({
    mutationFn: ({ name, scope }: { name: string; scope: string }) => ApiService.createKey(name, scope),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] })
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => ApiService.revokeKey(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] })
  });

  const rotateMutation = useMutation({
    mutationFn: (id: string) => ApiService.rotateKey(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] })
  });

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateKey = () => {
    const name = prompt('Enter key name:');
    if (name) {
      createMutation.mutate({ name, scope: 'READ_ONLY' });
    }
  };

  return (
    <PageWrapper>
      {/* Header Section */}
      <PageHeader
        title="API & Access Management"
        subtitle="Manage programmatic access to the AuditMaster Global infrastructure. API keys provide scoped access to forensic data and logs."
        badge="Secure Edge v3.0"
        badgeVariant="brand"
        icon={Shield}
        breadcrumb={['Admin', 'Security', 'API Keys']}
        actions={
          <>
            <Button variant="secondary" icon={Terminal}>Documentation</Button>
            <Button variant="primary" icon={Plus} onClick={handleGenerateKey}>Generate New Key</Button>
          </>
        }
      />

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        <SectionCard className="col-span-12 md:col-span-4" padding="large">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Integrations</p>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                 <Network size={20} />
               </div>
           </div>
           <div className="mt-10">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{keys.length}</h3>
              <StatusBadge label="Keys deployed" variant="success" icon={Zap} className="mt-4 w-fit" />
           </div>
        </SectionCard>

        <SectionCard className="col-span-12 md:col-span-4" padding="large">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">API Calls (24h)</p>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                 <Activity size={20} />
              </div>
           </div>
           <div className="mt-10">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Live</h3>
              <StatusBadge label="99.9% Success Rate" variant="brand" icon={CheckCircle2} className="mt-4 w-fit" />
           </div>
        </SectionCard>

        <SectionCard className="col-span-12 md:col-span-4" variant="dark" padding="large">
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Security Posture</p>
                <h3 className="text-4xl font-black text-blue-400 tracking-tighter uppercase italic">Hardened</h3>
              </div>
              <div className="flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-widest gap-2 mt-8">
                 <Lock size={14} /> Cryptographic isolation active
              </div>
           </div>
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Fingerprint size={120} />
           </div>
        </SectionCard>
      </div>

      {/* API Key Table */}
      <SectionCard 
        title="Active Access Tokens" 
        padding="none"
        actions={
          <div className="relative group">
             <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
             <input className="pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-100 outline-none w-64 transition-all" placeholder="Search tokens..." />
          </div>
        }
      >
         <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Key Name / ID</th>
                  <th className="px-10 py-5">Token Secret</th>
                  <th className="px-10 py-5">Scope</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-xs">
                 {isLoading ? (
                   <tr><td colSpan={5} className="px-10 py-10 text-center text-slate-400">Loading components...</td></tr>
                 ) : keys.map((key: any) => (
                   <tr key={key.id} className={`group hover:bg-slate-50 transition-colors ${key.status === 'REVOKED' ? 'opacity-40 grayscale' : ''}`}>
                     <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-900 mb-1">{key.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {key.id}</p>
                     </td>
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                           <code className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-bold">
                             {visibleKeys[key.id] ? key.secret : 'am_' + '•'.repeat(16)}
                           </code>
                           {key.status !== 'REVOKED' && (
                             <button 
                               onClick={() => toggleVisibility(key.id)}
                               className="text-blue-600 hover:text-blue-800 transition-colors"
                             >
                               {visibleKeys[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                             </button>
                           )}
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <StatusBadge 
                          label={key.scope} 
                          variant={key.scope.includes('WRITE') ? 'brand' : 'info'} 
                        />
                     </td>
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${key.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                           <span className={`text-[10px] font-black uppercase ${key.status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-400'}`}>{key.status}</span>
                        </div>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button 
                             onClick={() => rotateMutation.mutate(key.id)}
                             className="p-2 border border-slate-100 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-white transition-all"
                             title="Rotate Secret"
                           >
                              <RotateCw size={14} className={rotateMutation.isPending ? 'animate-spin' : ''} />
                           </button>
                           <button 
                             onClick={() => confirm('Revoke this key?') && revokeMutation.mutate(key.id)}
                             className="p-2 border border-slate-100 text-slate-400 rounded-xl hover:text-red-600 hover:bg-white transition-all"
                             title="Revoke Key"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </SectionCard>

      {/* Activity & Restrictions */}
      <div className="grid grid-cols-12 gap-8">
         <SectionCard 
           className="col-span-12 lg:col-span-8"
           title="Recent Key Activity"
           subtitle="Cryptographic audit trail of access events"
           actions={<span className="text-[10px] font-mono font-black text-slate-300 uppercase">Avg Latency: 14ms</span>}
         >
            <div className="space-y-8 relative pl-8 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
               {[
                 { user: 'admin@auditmaster.global', activity: 'New API Key Created: "Automation Script v2"', time: '10:02 AM', variant: 'brand' as const },
                 { user: 'System (Auto-Expiration)', activity: 'Key Revoked: "External Auditor Access"', time: 'Yesterday, 11:45 PM', variant: 'danger' as const },
                 { user: 'admin@auditmaster.global', activity: 'Key Secret Rotated: "SIEM Integration"', time: 'Oct 22, 16:30', variant: 'info' as const },
               ].map((log, i) => (
                 <div key={i} className="relative">
                    <div className={`absolute -left-[32px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 z-10 transition-all`} />
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{log.activity}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authorized by: {log.user}</p>
                       </div>
                       <span className="text-[10px] font-mono font-black text-slate-300">{log.time}</span>
                    </div>
                 </div>
               ))}
            </div>
         </SectionCard>

         <div className="col-span-12 lg:col-span-4 space-y-8">
            <SectionCard variant="dark" className="bg-blue-600 border-blue-500 shadow-blue-500/20">
               <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <CheckCircle2 size={16} /> Compliance Checklist
                  </h4>
                  <ul className="space-y-5">
                     {[
                       'Use scoped tokens instead of full access.',
                       'Rotate production keys every 90 days.',
                       'Monitor IP logs for suspicious activity.'
                     ].map((step, i) => (
                       <li key={i} className="flex gap-4 text-[11px] font-bold uppercase tracking-tight leading-relaxed text-blue-100">
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-[10px]">√</div>
                          {step}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none rotate-12">
                  <Shield size={180} />
               </div>
            </SectionCard>

            <SectionCard title="Network Restrictions" padding="large">
               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black text-slate-600 uppercase tracking-tight">IP Whitelisting</span>
                     <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
                     </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Nodes</p>
                     <div className="flex flex-wrap gap-2">
                        {['192.168.1.104', '10.0.0.45'].map(ip => (
                          <code key={ip} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-500">{ip}</code>
                        ))}
                        <button className="p-1 px-3 border-2 border-dashed border-slate-100 text-slate-300 rounded-lg hover:border-blue-200 hover:text-blue-500 transition-all">+</button>
                     </div>
                  </div>
               </div>
            </SectionCard>
         </div>
      </div>

      {/* Diagnostics Footer */}
      <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-slate-100 rounded-lg"><Cpu size={20} className="text-slate-900" /></div>
               <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-1">Compute Core</p>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Load: 12% // Latency: 4ms</p>
               </div>
            </div>
            <StatusBadge label="Integrity Validated" variant="success" icon={Shield} />
         </div>
         <div className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            Build v4.2.1-STABLE • RSA_4096_PKCS#1V15
         </div>
      </div>
    </PageWrapper>
  );
};

export default APISecurity;
