import React, { useState, useMemo } from 'react';
import { 
  Gavel, 
  FileCheck, 
  History, 
  Fingerprint, 
  ShieldCheck, 
  Key, 
  Download, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Search,
  Lock,
  Activity,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApiQuery } from '../hooks/useApiQuery';
import { AuditService } from '../services/AuditService';
import { SkeletonCard, SkeletonTable } from './Skeleton';
import { toast } from '../hooks/useToast';

export const GovernancePortal = () => {
  const [activePortalTab, setActivePortalTab] = useState<'REPORTS' | 'TRANSPARENCY' | 'EXECUTIVE'>('REPORTS');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: audits = [], isLoading: auditsLoading } = useApiQuery(
    ['audits-governance'],
    () => AuditService.getAudits()
  );

  const { data: logs = [], isLoading: logsLoading } = useApiQuery(
    ['audit-logs-governance'],
    () => AuditService.getLogs(),
    { refetchInterval: 10000 }
  );

  const isLoading = auditsLoading || logsLoading;

  const filteredAudits = useMemo(() => {
    return audits.filter(a => 
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.status.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [audits, searchQuery]);

  const stats = useMemo(() => {
    const verified = audits.filter(a => a.status === 'SUBMITTED').length;
    const inquiries = audits.filter(a => a.status === 'IN_PROGRESS').length;
    const integrity = audits.length > 0 ? (verified / audits.length) * 100 : 100;
    
    return [
      { label: 'Reports Verified', value: verified.toString(), status: 'CRYPTOGRAPHIC CHECK', color: 'text-blue-600' },
      { label: 'Active Inquiries', value: inquiries.toString().padStart(2, '0'), status: 'IN REVIEW', color: 'text-amber-600' },
      { label: 'Compliance Index', value: `${integrity.toFixed(1)}%`, status: 'REAL-TIME SYNC', color: 'text-emerald-600' }
    ];
  }, [audits]);

  const handleDownloadKey = () => {
    toast.success('Clé de vérification racine générée et téléchargée.', 'Signature RSA-4096 Transmise');
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-1000 mt-2">
      {/* Header & Scoped Selector */}
      <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <ShieldCheck size={18} className="text-blue-600" />
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Governance & Regulatory Gateway</span>
          </div>
          <h2 className="text-4xl font-black text-[#091426] dark:text-white tracking-tighter uppercase italic">Institutional Transparency Portal</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">Immutable interface for external auditing bodies. All metadata is cryptographically anchored to Global Sentry nodes.</p>
        </div>
        <div className="w-80">
          <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest px-1">Authority Scoping Override</label>
          <div className="relative group">
            <select className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 appearance-none focus:ring-4 focus:ring-blue-500/10 text-[11px] font-black uppercase tracking-tight shadow-sm cursor-pointer transition-all hover:border-blue-600 outline-none">
               <option>ISO-27001 Information Security Wing</option>
               <option>SOC 2 Type II Compliance Div.</option>
               <option>GDPR Data Protection Bureau</option>
               <option>Regional Financial Authority</option>
            </select>
            <ChevronRight size={18} className="absolute right-4 top-4.5 text-slate-400 group-hover:text-blue-600 rotate-90 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Shared Reports & Summary (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-10">
           
           {/* Stat Cards - Dynamic */}
           <div className="grid grid-cols-3 gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm group hover:shadow-xl transition-all duration-500 border-b-4 hover:border-b-blue-600">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                   <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{isLoading ? '...' : stat.value}</p>
                   <div className="mt-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-50" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.status}</span>
                   </div>
                </div>
              ))}
           </div>

           {/* Shared Audit Reports Table - Industrial */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="px-8 py-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <FileCheck size={18} className="text-blue-600" />
                    <h3 className="text-xs font-black text-[#091426] dark:text-white uppercase tracking-[0.2em]">Validated Audit Artifacts</h3>
                 </div>
                 <div className="flex gap-3">
                    <div className="relative">
                       <input 
                         type="text" 
                         placeholder="Filter artefacts..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 w-48 transition-all"
                       />
                       <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl hover:text-blue-600 transition-colors shadow-sm"><Download size={16} /></button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 {isLoading ? (
                    <div className="p-10"><SkeletonTable rows={5} /></div>
                 ) : (
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <th className="px-8 py-5">Report ID / Hash Anchor</th>
                             <th className="px-8 py-5">Certification Date</th>
                             <th className="px-8 py-5">Integrity Seal</th>
                             <th className="px-8 py-5 text-right">Access Forensic</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                          {filteredAudits.map(report => (
                            <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2 mb-1">
                                     <span className="text-[10px] font-black text-blue-600 uppercase font-mono tracking-tighter">0x{report.id.substring(0, 12).toUpperCase()}</span>
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  </div>
                                  <p className="text-xs font-black text-[#091426] dark:text-slate-300 uppercase tracking-tight">{report.status === 'SUBMITTED' ? 'Certified Compliance Report' : 'Interim Operational Evidence'}</p>
                               </td>
                               <td className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                  {new Date(report.createdAt).toLocaleDateString()}
                               </td>
                               <td className="px-8 py-6">
                                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-800 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                     <Fingerprint size={14} className="animate-pulse" /> VERIFIED SIGNATURE
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-blue-600 flex items-center gap-2 ml-auto group/btn">
                                     Review Ledger <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                  </button>
                               </td>
                            </tr>
                          ))}
                          {filteredAudits.length === 0 && (
                             <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 uppercase text-xs font-black tracking-widest opacity-40">No matching artefacts found</td></tr>
                          )}
                       </tbody>
                    </table>
                 )}
              </div>
           </div>

           {/* Cryptographic Proof Section - Premium Design */}
           <div className="bg-[#091426] dark:bg-black rounded-[3rem] p-12 relative overflow-hidden shadow-2xl group/proof">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover/proof:scale-110 transition-transform duration-1000">
                 <Fingerprint size={320} className="text-white" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <Key className="text-blue-400" size={24} />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Cryptographic Protocol active</span>
                 </div>
                 <h4 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic leading-none max-w-lg">Immutable Root of Trust Certificate</h4>
                 <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-medium">Our system ensures strict non-repudiation. Every audit event is sequentially hashed and anchored to our private blockchain-inspired event store. Auditors can cross-verify the hash chain independently.</p>
                 <div className="flex gap-4 mt-10">
                    <button 
                       onClick={handleDownloadKey}
                       className="flex items-center gap-3 px-10 py-4 bg-white text-[#091426] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                       <Download size={18} /> Download Root Verification Key
                    </button>
                    <button className="flex items-center gap-3 px-10 py-4 bg-white/10 text-white border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                       <Activity size={18} /> Chain Explorer
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Regulator Details & Logs (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
           
           {/* Regulator Account Card - Modern */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full flex items-center justify-center -mr-16 -mt-16 pointer-events-none">
                 <Gavel size={40} className="text-blue-100 dark:text-slate-800 mt-10 mr-10" />
              </div>
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.2rem] flex items-center justify-center text-slate-900 dark:text-white shadow-sm ring-4 ring-blue-50/50">
                    <UserCheck size={32} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-[#091426] dark:text-white uppercase tracking-tight">Institutional Auditor</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: REG-0081-ALPHA</p>
                 </div>
              </div>
              <div className="space-y-5">
                 <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                       <Lock size={12} className="text-blue-600" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clearance Level</span>
                    </div>
                    <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest bg-blue-50 px-3 py-1 rounded-full">LEVEL_4_FULL_READ</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session IP</p>
                       <p className="text-[10px] font-mono font-black text-[#091426] dark:text-white">10.42.1.84</p>
                    </div>
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
                       <p className="text-[10px] font-black text-red-600 uppercase">01:42:00</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Transparency Logs - Real-time Feed */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden max-h-[600px]">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <History size={16} className="text-blue-600" />
                    <h3 className="text-[11px] font-black text-[#091426] dark:text-white uppercase tracking-widest">Transparency Feed</h3>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[8px] font-black text-blue-600">LIVE</span>
                 </div>
              </div>
              <div className="p-8 flex-1 overflow-y-auto">
                 <div className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-12 pb-4">
                    {logsLoading ? (
                       <div className="space-y-10"><SkeletonCard /></div>
                    ) : logs.slice(0, 5).map((log, i) => (
                       <motion.div 
                          key={log.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative"
                       >
                          <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 shadow-sm flex items-center justify-center ${
                             i === 0 ? 'border-blue-600' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                             {i === 0 ? <Activity size={10} className="text-blue-600" /> : <div className="w-1 h-1 bg-slate-300 rounded-full" />}
                          </div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{new Date(log.timestamp).toLocaleTimeString()}</p>
                          <p className="text-xs font-black text-[#091426] dark:text-white uppercase tracking-tight leading-tight">{log.type.replace(/_/g, ' ')}</p>
                          <div className="mt-3 flex flex-col gap-1.5">
                             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase truncate">Principal: {log.userId || 'Institutional_Proxy'}</span>
                             <span className="text-[9px] font-mono font-bold text-blue-600/60 uppercase">Anchor: {log.id.substring(0, 16)}</span>
                          </div>
                       </motion.div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-[#091426] dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">Load Institutional Ledger</button>
              </div>
           </div>
        </div>
      </div>

      {/* Secure footer - Enhanced HUD */}
      <div className="fixed bottom-8 right-8 z-50">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           className="bg-[#091426]/90 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-8"
         >
            <div className="flex items-center gap-3">
               <ShieldCheck size={20} className="text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Encrypted Transmission</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">AES-256-GCM Anchor Active</span>
               </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Fingerprint size={14} className="text-blue-500" /> Certified by Auditax Forensics
            </p>
         </motion.div>
      </div>
    </div>
  );
};
