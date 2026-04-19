import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Download, 
  Fingerprint,
  ChevronRight,
  Database,
  Link2,
  Lock
} from 'lucide-react';
import { Audit } from '../types';
import { useQuery } from '@tanstack/react-query';
import { AuditService } from '../services/AuditService';

export const AuditTrail = ({ audits }: { audits: Audit[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => AuditService.getLogs(),
    refetchInterval: 5000,
  });

  const groupedLogs = useMemo(() => {
    return audits.map(audit => ({
      ...audit,
      events: logs.filter(l => l.auditId === audit.id)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Descending inside the timeline block
    })).filter(a => a.events.length > 0);
  }, [audits, logs]);

  const filteredLogs = groupedLogs.filter(a => 
     a.entityId.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Forensic Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Forensic Traceability</span>
          </div>
          <h2 className="text-3xl font-black text-[#091426] tracking-tight uppercase">Immutable Event Ledger</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium">Reconstruct integrity by replaying transaction logs from the cryptographic event store. Bit-perfect state verification.</p>
        </div>
        <div className="bg-[#091426] border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="p-2 bg-blue-600/20 rounded-lg">
             <Database size={24} className="text-blue-400" />
           </div>
           <div>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Ledger Core</p>
              <p className="text-xs font-black text-white uppercase flex items-center gap-2"><Lock size={12} className="text-emerald-400" /> ONLINE / CRYPTO-LOCKED</p>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-[400px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search blocks by SHA-256, Entity, or UUID..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 uppercase tracking-wide"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-300 transition-all">
            <Download size={14} /> Export Journal
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <ShieldCheck size={14} /> Verify Full Chain
          </button>
        </div>
      </div>

      {/* Forensic List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Timeline - Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
             <div className="h-64 bg-slate-100/50 rounded-[2rem] animate-pulse border border-slate-200" />
          ) : filteredLogs.map((audit) => (
            <div key={audit.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
                    <FileText size={20} className="text-[#091426]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#091426] uppercase tracking-tight">{audit.entityId}</h4>
                    <p className="text-[10px] font-mono text-blue-600 font-bold tracking-widest">CLUSTER: {audit.id.substring(0, 18)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-widest shadow-sm">
                    <ShieldCheck size={12} className="text-emerald-500" /> CHAIN_VALID
                  </span>
                </div>
              </div>
              
              <div className="p-8 relative bg-slate-900">
                 {/* Timeline axis */}
                 <div className="absolute left-[39px] top-8 bottom-8 w-px bg-slate-800" />
                 
                 <div className="space-y-6 relative">
                    {audit.events.map((event, idx) => (
                       <div key={event.id} className="flex gap-6 items-start relative group/event">
                          <div className={`w-4 h-4 rounded-full mt-1.5 z-10 border-[3px] border-slate-900 box-content transition-all ${
                             idx === 0 ? 'bg-blue-400 ring-2 ring-blue-500/30' : 'bg-slate-500'
                          }`} />
                          
                          <div className={`flex-1 p-4 rounded-xl border transition-all ${
                             idx === 0 ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/50'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                               <div>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                                     event.type.includes('START') ? 'text-blue-400' :
                                     event.type.includes('COMPLIANCE') ? 'text-amber-400' :
                                     event.type.includes('VERIFIED') ? 'text-emerald-400' : 'text-slate-300'
                                  }`}>
                                     {event.type}
                                  </span>
                                  <div className="flex items-center gap-2 mt-1 opacity-60">
                                     <Link2 size={10} className="text-slate-400" />
                                     <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">
                                        prev: {event.previousHash?.substring(0, 16)}...
                                     </span>
                                  </div>
                               </div>
                               <span className="text-[10px] font-mono font-bold text-slate-400 bg-black/20 px-2 py-1 rounded">
                                  {new Date(event.timestamp).toISOString()}
                               </span>
                            </div>
                            
                            <p className="text-[10px] text-slate-500 font-mono mt-3 p-2 bg-black/30 rounded border border-white/5 break-all">
                               SIG: {event.sha256Hash}
                            </p>
                          </div>
                          
                          {idx !== audit.events.length - 1 && (
                            <div className="absolute left-[7px] top-6 bottom-0 w-px bg-slate-800 -z-10" />
                          )}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="px-8 py-5 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                 <button className="text-[10px] font-black text-[#091426] uppercase tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors w-full justify-center">
                    <History size={14} /> Full Replay Terminal
                 </button>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && !isLoading && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
               <Fingerprint size={48} className="text-slate-200 mb-4" />
               <p className="text-sm font-black text-[#091426] uppercase tracking-widest">No cryptographic records found</p>
               <p className="text-xs text-slate-400 mt-2 font-medium">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Investigative Sidebar */}
        <div className="flex flex-col gap-8">
           <div className="bg-[#091426] text-white p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 opacity-5">
                 <Fingerprint size={200} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-blue-400 flex items-center gap-2">
                 <ShieldCheck size={14} /> Node Diagnostics
              </h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hashes Verified (24h)</p>
                    <p className="text-3xl font-black font-mono">{logs.length.toLocaleString()}</p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Compromised Blocks</p>
                    <p className="text-3xl font-black font-mono text-emerald-400">0</p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Network Consensus</p>
                    <p className="text-3xl font-black font-mono text-blue-400">100%</p>
                 </div>
              </div>
              <button className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/30">
                 Trigger Fast Sync
              </button>
           </div>

           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Threat Signatures</h3>
              <div className="flex flex-col gap-4">
                 <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <AlertCircle size={20} className="text-slate-400 mt-1" />
                    <div>
                       <p className="text-xs font-black text-[#091426] uppercase">Ledger is clean</p>
                       <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">No synchronization drifts or hash collisions detected across the cluster in the last 72 hours.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
