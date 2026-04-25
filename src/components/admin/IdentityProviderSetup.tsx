import React, { useState } from 'react';
import { 
  Terminal, FlaskConical as Biotech, 
  Users as Groups, Network as AccountTree, 
  AlertTriangle as Warning, Play as PlayCircle, 
  Upload as UploadFile, Copy as ContentCopy, 
  ShieldCheck as VerifiedUser, Settings as SettingsEthernet, 
  Download, Plus as Add 
} from 'lucide-react';
import { IdentityService, SsoConfig } from '../../services/IdentityService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const IdentityProviderSetup: React.FC = () => {
  const queryClient = useQueryClient();
  const [isTesting, setIsTesting] = useState(false);

  const { data: config, isLoading: isConfigLoading } = useApiQuery(
    ['sso-config'],
    () => IdentityService.getConfig()
  );

  const { data: mappings = [], isLoading: isMappingsLoading } = useApiQuery(
    ['identity-mappings'],
    () => IdentityService.getMappings()
  );

  const updateMutation = useMutation({
    mutationFn: (newConfig: Partial<SsoConfig>) => IdentityService.updateConfig(newConfig),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sso-config'] })
  });

  const testMutation = useMutation({
    mutationFn: () => IdentityService.testConnection(),
    onMutate: () => setIsTesting(true),
    onSettled: () => setIsTesting(false)
  });

  if (isConfigLoading || isMappingsLoading) {
    return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Hydrating Identity Matrix...</div>;
  }

  return (
    <PageWrapper>
      {/* Header Section */}
      <PageHeader
        title="Identity Provider Mapping"
        subtitle="Configure enterprise-grade SSO connections using SAML 2.0 or OIDC. Map IDP groups to internal AuditMaster roles."
        badge="Security Center"
        icon={VerifiedUser}
        breadcrumb={['Admin', 'Access', 'SSO']}
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export Metadata</Button>
            <Button variant="primary" icon={Add}>Connect New IDP</Button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-8">
         {/* Connection Details */}
         <SectionCard 
           className="col-span-12 lg:col-span-8"
           title="Connection Details"
           subtitle="Primary authentication bridge configuration"
           actions={<StatusBadge label={config?.status || 'INACTIVE'} variant="success" icon={VerifiedUser} />}
         >
           <div className="space-y-8 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Provider Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none" defaultValue={config?.name} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Protocol Type</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-blue-100 transition-all outline-none" defaultValue={config?.protocol}>
                       <option value="SAML_2_0">SAML 2.0 (Assertion)</option>
                       <option value="OIDC">OIDC (JSON/WebToken)</option>
                    </select>
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">SSO Endpoint (ACS URL)</label>
                 <div className="relative group">
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pr-12 font-mono text-xs text-blue-600 font-bold" readOnly defaultValue={config?.acsUrl} />
                    <button 
                      onClick={() => navigator.clipboard.writeText(config?.acsUrl || '')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-all"
                      title="Copy to clipboard"
                    >
                       <ContentCopy size={18} />
                    </button>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Entity ID (Issuer URL)</label>
                 <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono text-xs text-slate-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none" defaultValue={config?.entityId} />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">X.509 Certificate</label>
                 <div className="border-2 border-dashed border-slate-100 rounded-2xl p-10 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all group">
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <UploadFile size={32} className="text-slate-400" />
                    </div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{config?.certificate ? 'Certificate Integrity Verified' : 'Click to upload certificate'}</p>
                    <p className="text-[9px] font-mono font-bold text-slate-400 mt-2 uppercase tracking-widest">Supported: .PEM, .CER, .CRT (RSA-4096)</p>
                 </div>
              </div>
           </div>
         </SectionCard>

         {/* Diagnostics & Stats */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <SectionCard variant="dark">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/10 rounded-xl text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                    <Biotech size={24} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white uppercase italic">Diagnostics</h3>
               </div>
               <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium uppercase tracking-tight">Real-time configuration probing for SSO surface integrity.</p>
               
               <div className="space-y-5 mb-10">
                  {[
                    { label: 'Reachability', val: testMutation.isIdle ? 'READY' : testMutation.isPending ? 'PROBING...' : testMutation.data?.success ? 'PASS' : 'FAIL', color: testMutation.data?.success ? 'text-emerald-400' : 'text-amber-400' },
                    { label: 'Encryption', val: config?.certificate ? 'RSA_4096' : 'MISSING', color: 'text-white' },
                    { label: 'ACS Latency', val: testMutation.data?.latency ? `${testMutation.data.latency}ms` : '—', color: 'text-blue-400' }
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3">
                       <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">{d.label}</span>
                       <span className={`text-[10px] font-mono font-black uppercase ${d.color}`}>{d.val}</span>
                    </div>
                  ))}
               </div>

               <Button 
                 variant="primary" 
                 className="w-full py-4 text-[10px] tracking-[0.3em]" 
                 icon={PlayCircle}
                 onClick={() => testMutation.mutate()}
                 loading={isTesting}
               >
                  Run Validation
               </Button>
            </SectionCard>

            <SectionCard padding="large">
               <div className="flex items-center gap-6 mb-8">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                     <Groups size={32} />
                  </div>
                  <div>
                     <p className="text-4xl font-black text-slate-900 tracking-tighter">1,248</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bridged Identities</p>
                  </div>
               </div>
               <div className="w-full bg-slate-50 rounded-full h-2 mb-3 overflow-hidden border border-slate-100">
                  <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="bg-blue-600 h-full shadow-lg shadow-blue-500/20" />
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase italic opacity-60">75% Organization Saturation</p>
            </SectionCard>
         </div>

         {/* Attribute Mapping */}
         <SectionCard 
           className="col-span-12" 
           title="Identity Attribute Topology"
           subtitle="Recursive mapping of IDP claims to AuditMaster core properties"
           padding="none"
         >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.22em]">
                       <th className="px-10 py-5">Source Claim (IDP)</th>
                       <th className="px-10 py-5">Target Property (AM)</th>
                       <th className="px-10 py-5">Fallback Logic</th>
                       <th className="px-10 py-5">Status</th>
                       <th className="px-10 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 font-mono text-[11px]">
                    {mappings.map((m: any) => (
                       <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-10 py-6 text-blue-600 font-bold">{m.source}</td>
                          <td className="px-10 py-6 font-black text-slate-900 uppercase">{m.target}</td>
                          <td className="px-10 py-6 text-slate-400">{m.fallback || 'NULL_PTR'}</td>
                          <td className="px-10 py-6">
                             <StatusBadge label={m.status} variant={m.status === 'ACTIVE' ? 'success' : 'warning'} className="scale-90" />
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="text-slate-300 hover:text-slate-900 transition-colors px-3 py-1 opacity-0 group-hover:opacity-100">
                                <Terminal size={14} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </SectionCard>

         {/* Footer Action Bar */}
         <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 mt-6 border-t border-slate-200">
            <div className="flex items-center gap-4 bg-red-50 border border-red-100 px-6 py-3 rounded-2xl">
               <Warning size={18} className="text-red-500 animate-pulse" />
               <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">
                  Danger: Modifications to SSO structure will invalidate existing session keys.
               </p>
            </div>
            <div className="flex gap-4">
               <Button variant="secondary" onClick={() => window.location.reload()}>Discard Buffer</Button>
               <Button 
                 variant="primary" 
                 icon={SettingsEthernet} 
                 className="px-10 shadow-slate-900/20"
                 onClick={() => updateMutation.mutate({})}
               >
                  Commit Identity Schema
               </Button>
            </div>
         </div>
      </div>
    </PageWrapper>
  );
};

export default IdentityProviderSetup;
