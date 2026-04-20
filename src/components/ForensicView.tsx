import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  History, 
  Lock, 
  Key, 
  Fingerprint, 
  Download, 
  Filter,
  Eye,
  AlertTriangle,
  Play,
  X,
  RotateCcw,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  FileCode,
  FileText,
  Activity,
  VerifiedIcon,
  Pause,
  RefreshCw,
  Terminal,
  Cpu,
  Zap,
  HardDrive,
  Table,
  BarChart3,
  Globe,
  ChevronRight,
  ChevronLeft,
  Wrench
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { AuditService } from '../services/AuditService';

import { AiApiService } from '../services/AiApiService';

const ForensicView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(35); // 0-100
  const [activeSpeed, setActiveSpeed] = useState('1.0x');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: logs = [], isLoading } = useApiQuery(
    ['audit-logs-forensic'],
    () => AuditService.getLogs(),
    { refetchInterval: 5000 }
  );

  const runForensicAI = async () => {
    setIsAnalyzing(true);
    try {
      const targetEntity = logs.length > 0 ? logs[0].auditId : 'ledger-root-01';
      const res = await AiApiService.getForensicAnalysis(targetEntity);
      setAiAnalysis(res.analysis);
    } catch (err) {
      console.error(err);
    }
    setIsAnalyzing(false);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayhead(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const forensicTimeline = React.useMemo(() => {
    if (!logs || logs.length === 0) {
      return [
        { ts: new Date().toISOString().substring(11, 23), type: 'AWAITING_EVENTS', desc: 'Ledger Empty', detail: 'Waiting for blockchain sync...', color: 'text-slate-500', bg: 'bg-slate-50' }
      ];
    }
    return logs.slice(0, 20).map((log: any) => {
      let color = 'text-slate-500';
      let bg = 'bg-slate-50';
      if (log.type.includes('CRITICAL') || log.type.includes('DENIED') || log.type.includes('COMPROMISED')) {
        color = 'text-red-500'; bg = 'bg-red-50';
      } else if (log.type.includes('SUCCESS') || log.type.includes('COMPLIANT') || log.type.includes('VERIFIED')) {
        color = 'text-emerald-500'; bg = 'bg-emerald-50';
      } else if (log.type.includes('UPDATE') || log.type.includes('ANCHOR')) {
        color = 'text-blue-500'; bg = 'bg-blue-50';
      }
      return {
        ts: new Date(log.timestamp).toISOString().substring(11, 23),
        type: log.type,
        desc: `Action by ${log.userId || 'system'}`,
        detail: `Hash: ${log.sha256Hash?.substring(0, 16) || 'N/A...'}`,
        color,
        bg,
        log
      };
    });
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1700px] mx-auto space-y-10">
        
        {/* Forensic Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end bg-[#091426] p-8 lg:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
             <History size={150} className="text-blue-400" />
          </div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <Terminal size={12} /> Forensic_Replay v2.4
              </span>
              <span className="text-white/40 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-white/10">
                 BIT-PERFECT RECONSTRUCTION ACTIVE
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Forensic Replay & Recovery</h1>
            <p className="text-slate-400 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Structural restoration of system state via transaction ledger re-execution. 
               Investigators can navigate chronological delta-states to identify structural decay or unauthorized logical shifts.
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-8 xl:mt-0 relative z-10 items-end">
             <button 
               onClick={runForensicAI}
               disabled={isAnalyzing}
               className="bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-900/40 hover:bg-blue-700 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
             >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />} 
                {isAnalyzing ? 'Analyzing Hash Chains...' : 'Run Agentic Forensic Diagnostic'}
             </button>

             <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2.5rem] flex items-center gap-6">
                <Database className="text-blue-400" size={32} />
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none mb-2">Event Store Index</p>
                   <p className="font-mono text-xl font-black text-white tracking-tighter">4.2 PB ARCHIVED</p>
                </div>
             </div>
          </div>
        </div>

        {/* AI Narrative Overlay (Sprint 19) */}
        <AnimatePresence>
          {aiAnalysis && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-b-4 border-blue-600 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={100} className="text-blue-600" /></div>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                     <Fingerprint size={24} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-[#091426] uppercase tracking-tighter">Agentic Root Cause Analysis</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advanced Forensic Narrative Generation</p>
                  </div>
                  <button onClick={() => setAiAnalysis(null)} className="ml-auto p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20} /></button>
               </div>
               
               <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-4">
                     <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-6">
                        "{aiAnalysis}"
                     </p>
                  </div>
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Integrity Confidence</p>
                        <div className="text-3xl font-black text-blue-600 tracking-tighter">94.8%</div>
                     </div>
                     <button className="w-full mt-6 py-4 bg-[#091426] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                        Attach to Official Incident
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Workspace Bento */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Replay Controller (8 Cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col gap-10 group relative overflow-hidden">
             <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Activity size={24} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Transaction Timeline Replay</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Node Ledger Synchronization</p>
                   </div>
                </div>
                <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1 shadow-inner">
                   {['1.0x', '10x', 'Step'].map(speed => (
                     <button 
                       key={speed}
                       onClick={() => setActiveSpeed(speed)}
                       className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSpeed === speed ? 'bg-[#091426] text-white shadow-lg' : 'text-slate-400 hover:text-[#091426]'}`}
                     >
                       {speed}
                     </button>
                   ))}
                </div>
             </div>

             {/* Visual Analyzer (Graphic Area) */}
             <div className="h-64 bg-[#091426] rounded-[2.5rem] relative border border-slate-900 overflow-hidden group/analyzer shadow-2xl">
                <svg className="absolute inset-0 w-full h-full opacity-10">
                   <pattern id="grid-forensic" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5" />
                   </pattern>
                   <rect width="100%" height="100%" fill="url(#grid-forensic)" />
                </svg>

                {/* Animated Signal */}
                <svg className="absolute inset-0 w-full h-full opacity-60">
                   <motion.path 
                     d={`M 0 128 Q 100 128 200 ${128 + Math.sin(playhead/10)*20} T 400 128 T 600 ${128 + Math.cos(playhead/5)*30} T 800 128 T 1000 128`}
                     stroke="rgba(59,130,246,0.5)"
                     strokeWidth="2"
                     fill="none"
                   />
                </svg>

                {/* Event Clusters */}
                <div className="absolute inset-0 flex items-end justify-between px-10 pb-8 gap-2">
                   {[60, 40, 80, 50, 90, 30, 70, 45, 85, 40, 65, 30, 20, 55, 75, 40, 95, 30, 20, 40].map((h, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-t-lg transition-all duration-500 relative group/bar cursor-pointer ${h > 80 ? 'bg-red-500/40 border-t-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-blue-600/30 border-t-4 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'}`}
                        style={{ height: `${h}%` }}
                      >
                         <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-[8px] font-black text-white bg-blue-600 px-2 py-0.5 rounded whitespace-nowrap">
                            SIG:{h*12}
                         </div>
                      </div>
                   ))}
                </div>

                {/* Playhead */}
                <motion.div 
                   className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_white] z-10"
                   style={{ left: `${playhead}%` }}
                >
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white text-[#091426] px-3 py-1.5 rounded-full text-[10px] font-black font-mono shadow-xl -translate-y-1/2">
                      T-{Math.round(14400 - playhead*100)}m
                   </div>
                </motion.div>
             </div>

             {/* Playback Controls */}
             <div className="flex justify-between items-center py-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-6">
                   <button className="text-slate-400 hover:text-blue-600 transition-all"><Rewind size={24} /></button>
                   <button 
                     onClick={() => setIsPlaying(!isPlaying)}
                     className="w-16 h-16 rounded-full bg-[#091426] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                   >
                     {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                   </button>
                   <button className="text-slate-400 hover:text-blue-600 transition-all"><FastForward size={24} /></button>
                </div>
                <div className="flex gap-10">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected Checkpoint</p>
                      <p className="text-sm font-black text-[#091426] font-mono mt-1">SHA256: 0x8F2D...3A1E</p>
                   </div>
                   <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                      Restore State
                   </button>
                </div>
             </div>
          </div>

          {/* Forensic Journal Sidebar (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[3rem] shadow-sm flex flex-col overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                <div className="w-10 h-10 bg-[#091426] text-white rounded-xl flex items-center justify-center">
                   <History size={20} />
                </div>
                <h3 className="text-[11px] font-black text-[#091426] uppercase tracking-[0.2em]">Audit Forensic Ledger</h3>
             </div>
             <div className="flex-1 overflow-y-auto max-h-[640px] p-8 space-y-8 scrollbar-hide">
                {forensicTimeline.map((item, i) => (
                  <div key={i} className="flex gap-6 relative pl-6 border-l-2 border-slate-100 group">
                     <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-current shadow-sm ${item.color}`}>
                        <div className="w-1 h-1 bg-current rounded-full" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black text-slate-400 font-mono tracking-widest">{item.ts}</span>
                           <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${item.bg} ${item.color}`}>{item.type}</span>
                        </div>
                        <h4 className="text-sm font-black text-[#091426] uppercase tracking-tight group-hover:text-blue-600 transition-colors cursor-pointer">{item.desc}</h4>
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-medium text-slate-500 font-mono leading-relaxed">
                           {item.detail}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-6 border-t border-slate-50 bg-slate-50/20 text-center">
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto">
                   <Download size={14} /> Full Investigation Report (.IDX)
                </button>
             </div>
          </div>
        </div>

        {/* Investigative Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sticky bottom-10 z-20">
           
           {/* Bit-Perfect Preview (8 Cols) */}
           <div className="md:col-span-8 bg-[#091426] border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5"><FileCode size={120} className="text-blue-500" /></div>
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5 relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                    <Zap size={16} /> Hex_Stream_Reconstruction
                 </h3>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase">F-MODE</span>
                    <span className="px-3 py-1 bg-white/5 text-slate-500 rounded-lg text-[8px] font-black uppercase border border-white/5">ASCII</span>
                 </div>
              </div>
              
              <div className="font-mono text-[11px] text-emerald-300/80 space-y-1 relative z-10 p-6 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                 {[
                   '00000000: 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f  Lorem ipsum dolo',
                   '00000010: 72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73  r sit amet, cons',
                   '00000020: 65 63 74 65 74 75 72 20 61 64 69 70 69 73 63 69  ectetur adipisci',
                   '00000030: 6e 67 20 65 6c 69 74 2e 20 53 65 64 20 64 6f 20  ng elit. Sed do ',
                   '00000040: 65 69 75 73 6d 6f 64 20 74 65 6d 70 6f 72 20 69  eiusmod tempor i'
                 ].map((line, i) => (
                   <div key={i} className="hover:bg-blue-600/10 cursor-default transition-colors rounded px-2 -mx-2">{line}</div>
                 ))}
                 <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-4 pt-4 border-t border-white/5 text-red-500 text-[10px] font-black uppercase flex items-center gap-2"
                 >
                    <AlertTriangle size={14} /> Structural Mutation Detected // Offset: 0x00A1 // Re-indexing event stream...
                 </motion.div>
              </div>
           </div>

           {/* Metrics Card (4 Cols) */}
           <div className="md:col-span-4 bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex justify-between items-center">
                    Recovery Parameters <Wrench size={16} className="text-blue-600" />
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between text-[10px] font-black text-[#091426] uppercase tracking-widest mb-2">
                          <span>Replay Stability</span>
                          <span className="text-blue-600">98.2%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]"></motion.div>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[10px] font-black text-[#091426] uppercase tracking-widest mb-2">
                          <span>Bit-Density Coverage</span>
                          <span className="text-emerald-500">100% Verified</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></motion.div>
                       </div>
                    </div>
                 </div>
              </div>
              <button className="w-full py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                 Validate Cluster <ShieldCheck size={16} />
              </button>
           </div>
        </div>

        {/* Cluster Table Strip */}
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
           <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                 <h3 className="text-sm font-black text-[#091426] uppercase tracking-tighter flex items-center gap-3">
                    <Table size={18} className="text-blue-600" /> Segmented Recovery Clusters
                 </h3>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Multi-Node Distribution mapping</p>
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-3 border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Bulk Export</button>
                 <button className="px-6 py-3 bg-[#091426] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">Restore All</button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                       <th className="px-10 py-6">Cluster_ID</th>
                       <th className="px-10 py-6">Epoch (UTC)</th>
                       <th className="px-10 py-6">Type Hub</th>
                       <th className="px-10 py-6 text-center">Confidence Index</th>
                       <th className="px-10 py-6 text-right">Registry Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { id: 'C-9902-A', time: '2023-11-24 14:02:11', type: 'BLOCK_WRITE', conf: 98, status: 'INTACT', color: 'text-emerald-500' },
                      { id: 'C-9902-B', time: '2023-11-24 14:02:45', type: 'METADATA_TX', conf: 85, status: 'INTACT', color: 'text-blue-500' },
                      { id: 'C-9902-C', time: '2023-11-24 14:03:04', type: 'ACL_MOD', conf: 42, status: 'SUSPECT', color: 'text-red-500' },
                      { id: 'C-9904-X', time: '2023-11-24 14:12:00', type: 'DELTA_RECOVERY', conf: 100, status: 'INTACT', color: 'text-emerald-500' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 group transition-colors cursor-default">
                         <td className="px-10 py-8 font-mono text-[11px] text-blue-600 font-black">0x{row.id}</td>
                         <td className="px-10 py-8 text-xs font-bold text-slate-600">{row.time}</td>
                         <td className="px-10 py-8">
                            <span className="px-3 py-1 bg-slate-100 text-[#091426] rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">{row.type}</span>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-4 justify-center">
                               <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${row.conf}%` }} className={`h-full ${row.conf > 80 ? 'bg-emerald-500' : 'bg-red-500'}`}></motion.div>
                               </div>
                               <span className="text-[10px] font-black text-slate-900">{row.conf}%</span>
                            </div>
                         </td>
                         <td className="px-10 py-8 text-right">
                             <button className="px-4 py-2 border border-slate-100 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 justify-end ml-auto">
                                <Eye size={14} /> Inspect
                             </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Global Forensic Footer */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
           <p className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-[#091426]" /> 
              Forensic_Stability: OPTIMAL // Nodes: 42/42 Verified
           </p>
           <p className="text-blue-600">Protocol: ZERO_LOSS_STREAM // Replay Session ID: 0xFD89A2BC</p>
           <p>Pulse: {new Date().toLocaleTimeString()} UTC</p>
        </div>
      </div>
    </div>
  );
};

export default ForensicView;
