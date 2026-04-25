import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Map as MapIcon, ShieldCheck, Activity, Lock, 
  AlertTriangle, Download, RefreshCw, Server, Cloud 
} from 'lucide-react';
import { SovereigntyService, RegionalHealth, SovereigntyLog } from '../../services/SovereigntyService';
import { useApiQuery } from '../../hooks/useApiQuery';

const SovereigntyMonitor: React.FC = () => {
  const { data: regions = [], isLoading: regionsLoading } = useApiQuery(
    ['sovereignty-regions'],
    () => SovereigntyService.getRegionalHealth()
  );

  const { data: logs = [], isLoading: logsLoading } = useApiQuery(
    ['sovereignty-logs'],
    () => SovereigntyService.getLogs()
  );

  const { data: stats, isLoading: statsLoading } = useApiQuery(
    ['sovereignty-stats'],
    () => SovereigntyService.getGlobalStats()
  );

  const isLoading = regionsLoading || logsLoading || statsLoading;

  if (isLoading) {
    return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Attesting Sovereign Boundaries...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f6fafe] p-10 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] border ${
              (stats?.healthyPercentage || 0) > 95 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              { (stats?.healthyPercentage || 0) > 95 ? 'System Nominal' : 'Degraded Performance' }
            </span>
            <span className="text-slate-400 text-[10px] font-mono font-bold tracking-widest uppercase">
              Last Verified: {new Date().toISOString()}
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase">Data Sovereignty & Residency</h1>
          <p className="font-medium text-slate-500 max-w-2xl mt-2 text-sm leading-relaxed">
            Real-time visualization of global data distribution and compliance status across {regions.length} regional data centers. All replication paths are cryptographically attested.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Global Map Visualization */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden relative min-h-[550px] shadow-sm">
            <div className="absolute top-8 left-8 z-10">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-2xl space-y-1">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Health Index</div>
                <div className="text-3xl font-black text-[#091426] tracking-tighter">{stats?.healthyPercentage || 0}%</div>
                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} fill="currentColor" fillOpacity={0.1} />
                  Attested
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />
               
               {/* Map Nodes from Data */}
               {regions.slice(0, 5).map((region, i) => {
                 const positions = [
                   { top: '33%', left: '25%' },
                   { top: '45%', left: '50%' },
                   { top: '60%', left: '75%' },
                   { top: '25%', left: '80%' },
                   { top: '70%', left: '30%' },
                 ];
                 const pos = positions[i % positions.length];
                 return (
                   <div key={region.code} className="absolute group cursor-help transition-all" style={pos}>
                     <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute" />
                     <div className="w-4 h-4 bg-blue-500 rounded-full relative border-2 border-white shadow-lg" />
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       whileHover={{ opacity: 1, y: 0 }}
                       className="absolute top-full mt-3 bg-[#091426] text-white p-3 rounded-xl text-[9px] font-mono font-bold whitespace-nowrap z-20 border border-slate-700 shadow-2xl"
                     >
                       <p className="text-blue-400 mb-1">NODE: {region.primaryNode}</p>
                       <p>CAPACITY: {region.storedData}</p>
                       <p>LATENCY: {region.latency}MS</p>
                     </motion.div>
                   </div>
                 );
               })}
            </div>

            <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl space-y-3">
              {[
                { label: 'Primary Storage', color: 'bg-blue-600' },
                { label: 'Disaster Recovery', color: 'bg-slate-300' },
                { label: 'Compliance Alert', color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Breakdown Cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {regions.map((region, i) => (
              <div key={region.code} className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${region.status === 'RESTRICTED' ? 'border-l-4 border-l-amber-500' : 'border-slate-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#091426] uppercase tracking-tight">{region.region}</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mt-1">{region.code}</p>
                  </div>
                  <div className="text-blue-600 opacity-20"><Cloud size={20} /></div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Data Residency</span>
                    <span className={region.status === 'LOCAL' ? 'text-blue-600' : 'text-amber-600'}>100% {region.status}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden shadow-inner border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${region.complianceScore}%` }}
                      className={`${region.complianceScore > 90 ? 'bg-blue-600' : 'bg-amber-500'} h-full`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1 leading-none">Primary Hub</div>
                      <div className="text-xs font-bold text-slate-700">{region.primaryNode}</div>
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1 leading-none">DR Backup</div>
                      <div className="text-xs font-bold text-slate-700">{region.backupNode}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Residency Logs */}
          <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
              <div>
                <h2 className="text-xl font-black text-[#091426] uppercase tracking-tight">Cryptographic Residency Logs</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Immutable record of data movement across sovereign boundaries.</p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-blue-100">
                <Download size={14} /> Export Manifest
              </button>
            </div>

            <div className="relative border-l-2 border-slate-50 ml-3 space-y-12">
              {logs.map((log, i) => (
                <div key={log.id} className="relative pl-10">
                  <div className={`absolute left-[-13px] top-1 w-6 h-6 rounded-full bg-white border-2 border-current flex items-center justify-center z-10 ${
                    log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARNING' ? 'text-amber-500' : 'text-blue-600'
                  }`}>
                    {log.type === 'MIGRATION' ? <Lock size={12} /> : <RefreshCw size={12} />}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                        log.severity === 'CRITICAL' ? 'text-red-500' : 'text-blue-600'
                      }`}>{log.type}_VERIFIED</div>
                      <div className="text-sm font-medium text-slate-600 leading-relaxed">
                        {log.description}
                      </div>
                    </div>
                    <div className="text-left md:text-right space-y-1">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      <div className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-3 py-1 text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest leading-none mt-1">
                        {log.metadata}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-blue-700 transition-colors shadow-blue-200"
      >
        <MapIcon size={24} />
      </motion.button>
    </div>
  );
};

export default SovereigntyMonitor;
