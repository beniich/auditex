import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Network, 
  Zap,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  Terminal,
  Cpu,
  ShieldAlert,
  HardDrive,
  Copy,
  ChevronRight,
  Shield,
  FileLock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApiQuery } from '../hooks/useApiQuery';
import { InfrastructureService } from '../services/InfrastructureService';

export const SystemVault: React.FC = () => {
  const [showSecret, setShowSecret] = useState<string | null>(null);
  
  // Mock vault data for now, would be connected to a secure backend like HashiCorp Vault or similar
  const secrets = [
    { id: 'SK-7721-XA', name: 'Global_Audit_Ledger_Key', type: 'ED25519', status: 'ACTIVE', lastUsed: '3m ago', entropy: '98%' },
    { id: 'SK-9902-QB', name: 'Identity_Oracle_Bypass_Token', type: 'JWT_RSA', status: 'ROTATING', lastUsed: '1h ago', entropy: '94%' },
    { id: 'SK-4410-LM', name: 'Regional_Backup_Encryption_Salt', type: 'AES-256-GCM', status: 'ACTIVE', lastUsed: '12h ago', entropy: '100%' },
    { id: 'SK-8812-PV', name: 'Stakeholder_Report_Signature_Root', type: 'ECDSA_P256', status: 'DEPRECATED', lastUsed: '23d ago', entropy: '91%' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-[#091426] p-8 lg:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
            <Lock size={150} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShieldCheck size={12} /> Vault_Protocol v7.0
              </span>
              <span className="text-white/40 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-white/10">
                 FIPS 140-2 LEVEL 3 COMPLIANT
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">System Vault</h1>
            <p className="text-slate-400 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Structural hardware-backed key management system (HSM). Secure anchoring of cryptographic material, 
               automated rotation policies, and biometric access logging.
            </p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0 relative z-10">
             <button className="px-8 py-4 bg-white text-[#091426] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">Deploy New Key</button>
          </div>
        </div>

        {/* Strategic Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Main Key Registry */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
             <div className="p-8 lg:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                      <Key size={18} className="text-blue-600" /> Active Hardware Keys
                   </h3>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Controlled by Decentralized Root Authority</p>
                </div>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                   <input className="bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold text-[#091426] outline-none focus:ring-4 focus:ring-blue-50 w-48" placeholder="Filter keys..." />
                </div>
             </div>

             <div className="p-6">
                <div className="space-y-4">
                   {secrets.map((secret) => (
                     <div key={secret.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:shadow-xl hover:border-blue-100 transition-all cursor-default">
                        <div className="flex items-center gap-8">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                             secret.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                             secret.status === 'ROTATING' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                           }`}>
                              <Fingerprint size={28} />
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-mono font-black text-slate-400">ID: {secret.id}</span>
                                 <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                   secret.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                 }`}>{secret.status}</span>
                              </div>
                              <h4 className="text-lg font-black text-[#091426] uppercase mt-1 tracking-tight">{secret.name}</h4>
                              <div className="flex gap-4 mt-2">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Cpu size={12} /> {secret.type}</span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><RefreshCw size={12} /> Used {secret.lastUsed}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button onClick={() => setShowSecret(secret.id)} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
                              <Eye size={18} />
                           </button>
                           <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-white transition-all shadow-sm">
                              <RefreshCw size={18} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Metrics Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             {/* HSM Status */}
             <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm relative overflow-hidden group">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Hardware Health Index</h4>
                <div className="flex flex-col items-center">
                   <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-50" />
                         <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 * (1 - 0.98)} className="text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                         <span className="text-4xl font-black text-[#091426] tracking-tighter">98.4%</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase">Average Entropy</span>
                      </div>
                   </div>
                   <div className="w-full space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-slate-50 pb-2 text-slate-500">
                         <span>HSM Latency</span>
                         <span className="text-[#091426]">12ms</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-slate-50 pb-2 text-slate-500">
                         <span>Active Sessions</span>
                         <span className="text-[#091426]">4/1000</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Live Access Log (Mini) */}
             <div className="bg-[#091426] p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5"><Activity size={80} className="text-blue-500 text-6xl" /></div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                   Live Access Stream <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </h4>
                <div className="space-y-4 relative z-10">
                   {[
                     { user: 'sys_admin_7', action: 'DECRYPT', target: 'Ledger_Main', ts: 'Just now', ok: true },
                     { user: 'stakeholder_4', action: 'SIGN', target: 'Q3_Report', ts: '2m ago', ok: true },
                     { user: 'unauth_0', action: 'ACCESS', target: 'Root_Secret', ts: '1h ago', ok: false },
                   ].map((log, i) => (
                     <div key={i} className={`p-4 rounded-2xl border ${log.ok ? 'bg-white/5 border-white/5' : 'bg-red-500/10 border-red-500/20'} flex items-start gap-4 hover:bg-white/10 transition-colors`}>
                        <div className={log.ok ? 'text-blue-400' : 'text-red-500'}>
                           {log.ok ? <Shield size={16} /> : <ShieldAlert size={16} />}
                        </div>
                        <div>
                           <div className="flex justify-between items-center mb-1">
                              <p className="text-[10px] font-black text-white uppercase tracking-tight">{log.user}</p>
                              <p className="text-[8px] font-bold text-slate-500">{log.ts}</p>
                           </div>
                           <p className="text-[10px] text-slate-400 font-medium leading-none uppercase tracking-widest">{log.action} → {log.target}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="mt-8 w-full py-4 border border-white/10 hover:bg-white/10 rounded-2xl text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-all">Review Forensic Trail</button>
             </div>

             {/* Compliance Banner */}
             <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[3rem] flex items-center justify-center text-center group hover:bg-emerald-100 transition-all cursor-default">
                <div>
                  <ShieldCheck size={32} className="text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.2em]">Zero-Trust Validated</h4>
                  <p className="text-[9px] font-bold text-emerald-700 uppercase mt-1 tracking-widest">Structural Cryptography Active</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Audit Strip */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
           <p className="flex items-center gap-3">
              <FileLock size={16} className="text-[#091426]" /> 
              HSM_STATE: AIR_GAPPED // COLD_STORAGE: 90%
           </p>
           <p className="text-[#091426]">Protocol: ECC_BRAINPOOL_P512 // ROTATION: 89d REMAINING</p>
           <p>EPOCH: {Date.now()}</p>
        </div>
      </div>

      {/* Secret Detail Modal (Overlay) */}
      <AnimatePresence>
        {showSecret && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-3xl bg-[#091426]/60 font-sans"
            onClick={() => setShowSecret(null)}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
               className="bg-white rounded-[4rem] p-12 lg:p-20 max-w-4xl w-full shadow-2xl relative overflow-hidden"
               onClick={e => e.stopPropagation()}
            >
               <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                  <Fingerprint size={400} />
               </div>
               
               <div className="text-center space-y-10 relative z-10">
                  <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                     <Lock size={40} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Cryptographic_Material_Access</h3>
                    <h2 className="text-3xl font-black text-[#091426] uppercase tracking-tighter italic underline decoration-blue-200 underline-offset-8">
                       {secrets.find(s => s.id === showSecret)?.name}
                    </h2>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] group">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Master_Key_Ciphertext</p>
                     <p className="font-mono text-lg font-black text-[#091426] break-all group-hover:text-blue-600 transition-colors">
                        7f8e9a2b4c1d0f5e6a3b8d9c2e1f0a5b8c9d2e1f0a5b8c9d2e1f0a5b8c9d2e1f0a5b...
                     </p>
                     <button className="mt-10 px-8 py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-3 mx-auto shadow-xl shadow-slate-900/20 transition-all">
                        <Copy size={16} /> Copy Secret Material
                     </button>
                  </div>

                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">
                     ⚠️ Access recorded in immutable forensic ledger.
                  </p>

                  <button onClick={() => setShowSecret(null)} className="text-slate-400 hover:text-[#091426] text-[10px] font-black uppercase tracking-widest transition-colors pt-4">
                     Terminate Session
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
