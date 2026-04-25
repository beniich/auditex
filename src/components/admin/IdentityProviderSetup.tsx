import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsInputComponent, Terminal, FlaskConical as Biotech, 
  History as HistoryEdu, Users as Groups, Network as AccountTree, 
  AlertTriangle as Warning, Play as PlayCircle, PlusCircle as AddCircle, 
  MoreVertical as MoreVert, Upload as UploadFile, Copy as ContentCopy, 
  ShieldCheck as VerifiedUser, Settings as SettingsEthernet, 
  Download, Plus as Add 
} from 'lucide-react';
import { IdentityService, SsoConfig, AttributeMapping } from '../../services/IdentityService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                 <span>ADMINISTRATION</span>
                 <span>/</span>
                 <span className="text-blue-600">SSO & IDENTITY PROVIDERS</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Provider Mapping</h1>
              <p className="text-slate-500 max-w-2xl font-medium">Configure enterprise-grade SSO connections using SAML 2.0 or OIDC. Map IDP groups directly to internal AuditMaster roles with cryptographic verification.</p>
           </div>
           <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-slate-50 transition-colors shadow-sm">
                 <Download size={14} /> EXPORT METADATA
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:opacity-90 transition-opacity shadow-sm shadow-blue-600/20">
                 <Add size={14} /> CONNECT NEW IDP
              </button>
           </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
           
           {/* Connection Details */}
           <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                 <div className="flex items-center gap-3">
                    <SettingsEthernet size={20} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900">Connection Details</h3>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                    <VerifiedUser size={12} className="fill-current" /> {config?.status || 'INACTIVE'}
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Provider Name</label>
                       <input className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" defaultValue={config?.name} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Protocol</label>
                       <select className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" defaultValue={config?.protocol}>
                          <option value="SAML_2_0">SAML 2.0</option>
                          <option value="OIDC">OIDC (OpenID Connect)</option>
                       </select>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">SSO ENDPOINT URL (ASSERTION CONSUMER SERVICE)</label>
                    <div className="relative">
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 pr-10 font-mono text-xs text-slate-600" readOnly defaultValue={config?.acsUrl} />
                       <button 
                         onClick={() => navigator.clipboard.writeText(config?.acsUrl || '')}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                       >
                          <ContentCopy size={16} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">IDENTITY PROVIDER ISSUER (ENTITY ID)</label>
                    <input className="w-full border border-slate-200 rounded-lg p-3 font-mono text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" placeholder="http://www.okta.com/exk123456..." defaultValue={config?.entityId} />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">X.509 CERTIFICATE</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all">
                       <UploadFile size={32} className="text-slate-400 mb-3" />
                       <p className="text-sm font-medium text-slate-600">{config?.certificate ? 'Certificate Uploaded' : 'Drop certificate file or browse'}</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 mt-2 uppercase">Supported: .PEM, .CER, .CRT</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Diagnostics & Stats */}
           <div className="col-span-4 space-y-6">
              
              <div className="bg-[#091426] text-white rounded-xl p-8 shadow-xl shadow-slate-200">
                 <div className="flex items-center gap-3 mb-4">
                    <Biotech size={24} className="text-emerald-400" />
                    <h3 className="text-xl font-bold tracking-tight">Diagnostics</h3>
                 </div>
                 <p className="text-slate-300 text-sm mb-6 leading-relaxed">Perform a real-time validation of your SSO configuration without affecting current users.</p>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Endpoint Reachability</span>
                       <span className={`text-[10px] font-mono font-bold uppercase ${testMutation.data?.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {testMutation.isIdle ? 'Ready' : testMutation.isPending ? 'Verifying...' : testMutation.data?.success ? 'Success' : 'Failed'}
                       </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Certificate Validity</span>
                       <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">{config?.certificate ? 'Valid' : 'Missing'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Latency</span>
                       <span className="text-[10px] font-mono font-bold uppercase text-white">{testMutation.data?.latency ? `${testMutation.data.latency}ms` : '—'}</span>
                    </div>
                 </div>

                 <button 
                   onClick={() => testMutation.mutate()}
                   disabled={isTesting}
                   className="w-full bg-blue-600 text-white py-3 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                 >
                    <PlayCircle size={16} className={isTesting ? 'animate-spin' : ''} /> TEST CONNECTION
                 </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">PROVISIONING INSIGHTS</h4>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                       <Groups size={28} />
                    </div>
                    <div>
                       <p className="text-3xl font-black text-slate-900 tracking-tighter">1,248</p>
                       <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Synchronized Users</p>
                    </div>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                 </div>
                 <p className="text-[10px] font-mono font-bold text-slate-400 leading-none">75% of total organization mapped</p>
              </div>

           </div>

           {/* Attribute Mapping */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <AccountTree size={20} className="text-blue-600" />
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 leading-none mb-1">Attribute Mapping</h3>
                       <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">SAML Claims to AuditMaster Properties</p>
                    </div>
                 </div>
              </div>
              
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <th className="px-6 py-4">IDP CLAIM (SOURCE)</th>
                       <th className="px-6 py-4">AUDITMASTER FIELD (TARGET)</th>
                       <th className="px-6 py-4">FALLBACK VALUE</th>
                       <th className="px-6 py-4">STATUS</th>
                       <th className="px-6 py-4 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm">
                    {mappings.map((m: any, i: number) => (
                       <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-[11px] text-slate-900">{m.source}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{m.target}</td>
                          <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{m.fallback || '—'}</td>
                          <td className="px-6 py-4">
                             <span className={`flex items-center gap-2 text-[10px] font-mono font-bold ${m.status === 'ACTIVE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                <span className={`w-2 h-2 rounded-full ${m.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> {m.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-slate-400 hover:text-blue-600"><MoreVert size={16} /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Footer Action Bar */}
           <div className="col-span-12 flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-red-600 text-[10px] font-mono font-bold uppercase tracking-widest bg-red-50 px-4 py-2 rounded border border-red-100">
                 <Warning size={14} />
                 DANGER ZONE: DISABLING SSO WILL FORCE PASSWORD RESET FOR USERS.
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
                    DISCARD CHANGES
                 </button>
                 <button 
                   onClick={() => updateMutation.mutate({})}
                   className="px-8 py-3 bg-[#091426] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all"
                 >
                    COMMIT CONFIGURATION
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default IdentityProviderSetup;
