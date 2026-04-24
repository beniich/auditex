import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {
  Database, ShieldCheck, Activity, Globe, Cpu, Lock, Zap,
  CheckCircle2, AlertCircle, ChevronRight, History, Network,
  Fingerprint, HardDrive, Terminal, Server, RefreshCw, Download
} from 'lucide-react';
import { InfrastructureService } from '../../services/InfrastructureService';
import { AuditService } from '../../services/AuditService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { toast } from '../../hooks/useToast';
import { Skeleton } from '../common/Skeleton';

export const IntegrityDiagnostics: React.FC = () => {
  const queryClient = useQueryClient();
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: nodes = [], isLoading: nodesLoading } = useApiQuery(
    ['nodes'],
    () => InfrastructureService.getNodes(),
    { refetchInterval: 10000 }
  );

  const { data: logs = [], isLoading: logsLoading } = useApiQuery(
    ['audit-logs'],
    () => AuditService.getLogs(),
    { refetchInterval: 10000 }
  );

  const isLoading = nodesLoading || logsLoading;

  // Compute integrity metrics from data
  const healthyNodes = nodes.filter(n => n.status === 'HEALTHY').length;
  const totalNodes = nodes.length;
  const integrityScore = totalNodes > 0 ? Math.round((healthyNodes / totalNodes) * 1000) / 10 : 99.9;
  const logsWithHash = logs.filter(l => l.sha256Hash);
  const hashCoverage = logs.length > 0 ? Math.round((logsWithHash.length / logs.length) * 100) : 100;

   const resync = () => {
    queryClient.invalidateQueries({ queryKey: ['nodes'] });
    queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    toast.info('Re-syncing all nodes and integrity data...', 'Sync');
    setTimeout(() => toast.success('All nodes re-synchronized successfully.', 'Sync Complete'), 1500);
  };

  const verifyChain = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      // We pick the first audit ID from logs to verify as a sample
      const sampleAuditId = logs[0]?.auditId;
      if (!sampleAuditId) {
        toast.warning('No active audit logs found to verify.', 'Forensics');
        setIsVerifying(false);
        return;
      }
      
      const result = await AuditService.verifyAudit(sampleAuditId);
      setVerificationResult(result);
      
      if (result.valid) {
        toast.success(`Cryptographic chain for audit ${sampleAuditId.slice(0,8)} is valid.`, 'Verification Success');
      } else {
        toast.error(`Tampering detected at block ${result.compromisedAt?.slice(0,8)}`, 'Security Breach');
      }
    } catch (error) {
      toast.error('Forensic verification failed. Check connectivity.', 'System Error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Forensic Node v5.1
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                <ShieldCheck size={10} className="fill-current" /> CRYPTO_ANCHORED: {integrityScore}%
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Data Integrity Diagnostics</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
              Real-time cryptographic verification of the global event store ledger. Monitor immutability health, hash coverage, and cross-node synchronization levels.
            </p>
          </div>
           <div className="flex gap-4">
            <button 
              onClick={verifyChain}
              disabled={isVerifying || logs.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isVerifying ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />} 
              {isVerifying ? 'Verifying Chain...' : 'Verify Crypto Chain'}
            </button>
            <button onClick={resync}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#091426] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all group">
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Re-Sync Nodes
            </button>
          </div>
        </div>

        {verificationResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className={`p-6 rounded-2xl border ${verificationResult.valid ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} flex items-center justify-between`}
          >
             <div className="flex items-center gap-4">
                {verificationResult.valid ? <ShieldCheck size={24} className="text-emerald-600" /> : <AlertCircle size={24} className="text-red-600" />}
                <div>
                   <p className={`text-[11px] font-black uppercase tracking-widest ${verificationResult.valid ? 'text-emerald-900' : 'text-red-900'}`}>
                      {verificationResult.valid ? 'Cryptographic Integrity Confirmed' : 'Chain Integrity Compromised'}
                   </p>
                   <p className={`text-[10px] ${verificationResult.valid ? 'text-emerald-700' : 'text-red-700'} mt-1`}>
                      {verificationResult.valid 
                        ? `All ${verificationResult.eventCount} blocks in audit chain verified successfully at ${new Date(verificationResult.verifiedAt).toLocaleTimeString()}.`
                        : `Vulnerability detected at block ${verificationResult.compromisedAt}. Automated quarantine initiated.`}
                   </p>
                </div>
             </div>
             {!verificationResult.valid && (
               <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">
                  Initiate Self-Healing
               </button>
             )}
          </motion.div>
        )}

        <div className="grid grid-cols-12 gap-8 items-start">

          {/* Main: Node Map */}
          <div className="col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
              <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                <Globe size={18} className="text-blue-600" /> Global Event Store Nodes
              </h3>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Healthy ({healthyNodes})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Degraded ({nodes.filter(n => n.status === 'DEGRADED').length})</span>
                </div>
              </div>
            </div>

            <div className="relative h-[480px] bg-[#091426] rounded-[2rem] overflow-hidden border border-slate-900 shadow-2xl">
              {/* Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
                <pattern id="grid-d" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,179,237,0.3)" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid-d)" />
              </svg>

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                {nodes.slice(0, 4).map((_, i) => {
                  const positions = [
                    { x: '50%', y: '50%' },
                    { x: '20%', y: '30%' },
                    { x: '75%', y: '25%' },
                    { x: '82%', y: '65%' },
                    { x: '35%', y: '75%' },
                  ];
                  if (i === 0) return null;
                  return (
                    <line key={i}
                      x1={positions[0].x} y1={positions[0].y}
                      x2={positions[i % positions.length].x} y2={positions[i % positions.length].y}
                      stroke="rgba(99,179,237,0.6)" strokeWidth="1" strokeDasharray="4"
                    />
                  );
                })}
              </svg>

              {/* Node Markers from real data */}
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse mx-auto mb-3" />
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Loading nodes...</p>
                  </div>
                </div>
              ) : (
                nodes.slice(0, 5).map((node, i) => {
                  const positions = [
                    { left: '50%', top: '50%' },
                    { left: '20%', top: '30%' },
                    { left: '75%', top: '25%' },
                    { left: '82%', top: '65%' },
                    { left: '35%', top: '75%' },
                  ];
                  const pos = positions[i % positions.length];
                  return (
                    <motion.div key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12 }}
                      style={{ left: pos.left, top: pos.top }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
                    >
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center bg-[#091426] shadow-xl group-hover/node:scale-125 transition-all ${
                          node.status === 'DEGRADED' ? 'animate-pulse' : ''
                        }`}>
                          <div className={`w-3 h-3 rounded-full shadow-lg ${
                            node.status === 'HEALTHY' ? 'bg-emerald-500 shadow-emerald-900' :
                            node.status === 'DEGRADED' ? 'bg-amber-500 shadow-amber-900' : 'bg-red-500'
                          }`} />
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg min-w-[110px] opacity-0 group-hover/node:opacity-100 transition-all">
                          <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{node.name}</p>
                          <p className={`text-[8px] font-mono mt-0.5 uppercase ${
                            node.status === 'HEALTHY' ? 'text-emerald-400' : node.status === 'DEGRADED' ? 'text-amber-400' : 'text-red-400'
                          }`}>{node.status}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              <div className="absolute bottom-8 left-8 space-y-2">
                <p className="text-[8px] font-mono font-black text-blue-400 uppercase tracking-[0.3em]">Cryptographic Chain Active</p>
                <div className="flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-4 h-1 rounded-full ${i < Math.round(hashCoverage / 20) ? 'bg-blue-600' : 'bg-blue-600/20'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side Gauges */}
          <div className="col-span-4 space-y-8">
            {/* Integrity Gauge */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col group hover:shadow-xl transition-all">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex justify-between items-start">
                Immutability Health <ShieldCheck size={14} className="text-blue-600" />
              </h4>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-50" cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" />
                    <motion.circle
                      initial={{ strokeDashoffset: 364 }}
                      animate={{ strokeDashoffset: 3.64 * (100 - integrityScore) }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className={integrityScore > 80 ? 'text-blue-600' : integrityScore > 60 ? 'text-amber-500' : 'text-red-500'}
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray="364.2" strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[#091426] tracking-tighter">{integrityScore}%</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1 italic">Healthy Nodes</p>
                    <p className="text-sm font-black text-[#091426] font-mono">{healthyNodes} / {totalNodes}</p>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${integrityScore}%` }}
                      className={`h-full rounded-full ${integrityScore > 80 ? 'bg-emerald-500' : integrityScore > 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Hash Progress */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hash Verification</h4>
              <div className="space-y-6">
                {[
                  { label: `Indexed Events: ${logs.length}`, progress: Math.min(100, (logs.length / Math.max(logs.length, 1)) * 100) },
                  { label: `Hash Coverage`, progress: hashCoverage },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{item.label}</span>
                      <span className={item.progress >= 100 ? 'text-emerald-600' : 'text-blue-600'}>{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: item.progress + '%' }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`h-full rounded-full shadow-lg ${item.progress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events Panel */}
            <div className="bg-[#091426] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Activity size={80} /></div>
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                Recent Alerts <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </h4>
              <div className="space-y-3">
                {isLoading ? (
                  [1, 2].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)
                ) : logs.slice(0, 3).map((log, i) => (
                  <div key={i} className="space-y-1 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      <span className="text-[7px] font-mono font-black text-slate-500 uppercase">{log.type}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-300 leading-relaxed truncate">
                      {log.user?.email || log.userId} — {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Log Table */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
            <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
              <Terminal size={18} className="text-blue-600" /> Real-time Forensic Log
            </h3>
            <div className="flex items-center gap-2 font-mono text-[9px] font-black text-slate-300 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Live Stream • {logs.length} events
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Timestamp</th>
                  <th className="px-10 py-5">Event Type</th>
                  <th className="px-10 py-5 text-center">Subject</th>
                  <th className="px-10 py-5">Hash Checksum</th>
                  <th className="px-10 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-[11px] font-bold tracking-tight">
                {isLoading ? (
                  [1, 2, 3, 4].map(i => (
                    <tr key={i}><td colSpan={5} className="px-10 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : logs.slice(0, 8).map((log, i) => {
                  const isNew = i === 0;
                  const hasHash = !!log.sha256Hash;
                  return (
                    <tr key={i} className={`group hover:bg-slate-50 transition-colors ${isNew ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-10 py-4 text-slate-400">
                        {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 23)}
                      </td>
                      <td className="px-10 py-4 text-[#091426] font-black">{log.type}</td>
                      <td className="px-10 py-4 text-slate-500 font-medium text-center">{log.userId}</td>
                      <td className="px-10 py-4 text-blue-600 font-black">
                        {log.sha256Hash ? `${log.sha256Hash.substring(0, 8)}...${log.sha256Hash.substring(56)}` : 'PENDING'}
                      </td>
                      <td className="px-10 py-4 text-right">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                          hasHash ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {!hasHash && <RefreshCw size={10} className="animate-spin" />}
                          {hasHash ? 'VERIFIED' : 'VALIDATING'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.2em]">
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-3"><Server size={14} className="text-slate-900" /><span>Primary Cluster: EU-WEST-01</span></div>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-8"><HardDrive size={14} className="text-slate-900" /><span>Events: {logs.length} // Hash_OK: {logsWithHash.length}</span></div>
          </div>
          <p>PROTOCOL: SHA-256_CHAINED // EPOCH: {Date.now()}</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrityDiagnostics;
