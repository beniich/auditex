import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Play, 
  RotateCcw, 
  FastForward, 
  Rewind, 
  ShieldCheck, 
  Database, 
  Search, 
  FileText, 
  AlertCircle, 
  Download, 
  MoreHorizontal,
  StepForward,
  StepBack,
  Fingerprint,
  Zap,
  Activity,
  User,
  Clock,
  Terminal,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { AuditService } from '../services/AuditService';
import { Skeleton } from './Skeleton';

const ForensicReplay: React.FC = () => {
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const { data: audits = [], isLoading: loadingAudits } = useApiQuery(['audits'], () => AuditService.getAudits());
  
  const { data: events = [], isLoading: loadingEvents } = useApiQuery(
    ['audit-events', selectedAuditId], 
    () => selectedAuditId ? AuditService.getEvents(selectedAuditId) : Promise.resolve([]),
    { enabled: !!selectedAuditId }
  );

  useEffect(() => {
    if (isPlaying && replayIndex < events.length - 1) {
      const timer = setTimeout(() => {
        setReplayIndex(prev => prev + 1);
      }, 1000 / speed);
      return () => clearTimeout(timer);
    } else if (replayIndex >= events.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, replayIndex, events.length, speed]);

  const currentEvent = events[replayIndex];

  const resetReplay = () => {
    setReplayIndex(0);
    setIsPlaying(false);
  };
  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Forensic Node v5.1
              </span>
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 <ShieldCheck size={10} className="fill-current" /> CRYPTO_VERIFIED: NOMINAL
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] dark:text-white tracking-tighter uppercase leading-none">Forensic Event Replay</h1>
            
            <div className="mt-6 flex items-center gap-4">
               <div className="relative group">
                 <select 
                   value={selectedAuditId || ''} 
                   onChange={(e) => {
                     setSelectedAuditId(e.target.value);
                     setReplayIndex(0);
                     setIsPlaying(false);
                   }}
                   className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-6 pr-12 py-3 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
                 >
                   <option value="">Select Audit Cluster</option>
                   {audits.map(a => (
                     <option key={a.id} value={a.id}>Cluster / {a.id.substring(0, 12)}</option>
                   ))}
                 </select>
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>
               
               {selectedAuditId && (
                 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">Events: {events.length}</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Integrity: OK</span>
                 </motion.div>
               )}
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm group hover:border-blue-200 transition-all">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                   <Database size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Store Status</p>
                   <p className="text-xs font-black text-[#091426] dark:text-white uppercase uppercase">ONLINE / {events.length * 4}KB Segment</p>
                </div>
             </div>
          </div>
        </div>

        {/* Main Replay Interface */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Replay Timeline Controller */}
          <div className="col-span-8 space-y-8">
             <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm space-y-10 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                   <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                      <Clock size={18} className="text-blue-600" /> Transaction Replay Timeline
                   </h3>
                   <div className="flex gap-2">
                      <span className="bg-emerald-50 text-emerald-700 font-black text-[9px] px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> IMMUTABLE
                      </span>
                   </div>
                </div>

                {/* Visual Audio-like Timeline */}
                <div className="h-56 bg-slate-900 rounded-[2rem] border border-slate-800 relative overflow-hidden group">
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 39px, #94a3b8 40px)' }} />
                   
                   <div className="absolute inset-x-10 bottom-10 h-32 flex items-end gap-1.5">
                      {(events.length > 0 ? events : Array(17).fill(null)).map((ev, i) => {
                        const h = (i * 20 + 30) % 100; // Simulated height if no data
                        const active = i <= replayIndex;
                        return (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: h + '%' }}
                            className={`flex-1 rounded-t-sm transition-all duration-300 ${
                              i === replayIndex ? 'bg-blue-400 shadow-lg shadow-blue-500/50 scale-x-125 z-10' : 
                              active ? 'bg-blue-600 opacity-60' : 'bg-slate-800 opacity-40'
                            }`}
                          />
                        );
                      })}
                   </div>

                   {/* Playhead */}
                   <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-20 flex flex-col items-center transition-all duration-300" style={{ left: `${(replayIndex / Math.max(events.length - 1, 1)) * 100}%` }}>
                      <div className="bg-blue-400 text-[#091426] font-mono text-[9px] font-black px-3 py-1 mt-6 rounded whitespace-nowrap uppercase tracking-widest shadow-xl">
                         {currentEvent ? new Date(currentEvent.timestamp).toLocaleTimeString() : '00:00:00'}
                      </div>
                      <div className="w-4 h-4 bg-blue-400 rotate-45 -mt-2 shadow-lg" />
                   </div>
                </div>

                {/* Replay Controls */}
                <div className="grid grid-cols-4 gap-10 py-4 items-center relative z-10">
                   <div className="col-span-1 border-r border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Recovery Anchor</p>
                      <p className="text-xs font-mono font-black text-[#091426] dark:text-blue-400 tracking-tighter">
                        {currentEvent?.sha256Hash?.substring(0, 8) || '0x00000000'}
                      </p>
                   </div>
                   <div className="col-span-2 flex items-center justify-center gap-10">
                      <button onClick={resetReplay} className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><RotateCcw size={20} /></button>
                      <button onClick={() => setReplayIndex(prev => Math.max(0, prev - 1))} className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><StepBack size={24} /></button>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-16 h-16 rounded-full ${isPlaying ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'} flex items-center justify-center transition-all active:scale-95 group`}
                      >
                         {isPlaying ? <RotateCcw size={28} className="animate-spin-slow" /> : <Play size={28} className="fill-current ml-1" />}
                      </button>
                      <button onClick={() => setReplayIndex(prev => Math.min(events.length - 1, prev + 1))} className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><StepForward size={24} /></button>
                      <button onClick={() => setIsPlaying(true)} className="text-slate-300 hover:text-blue-600 transition-all active:scale-90"><FastForward size={24} /></button>
                   </div>
                   <div className="col-span-1 flex flex-col items-end border-l border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic text-right">Replay Velocity</p>
                      <select 
                        value={speed} 
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="bg-transparent border-none font-black text-xs text-[#091426] dark:text-white p-0 focus:ring-0 cursor-pointer uppercase tracking-widest text-right"
                      >
                         <option value={1}>1.0x Real-time</option>
                         <option value={5}>5x Forensic</option>
                         <option value={10}>10x High-speed</option>
                      </select>
                   </div>
                </div>
             </div>

             {/* Investigation Tools Bento */}
             <div className="grid grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-6 group hover:shadow-xl transition-all h-full">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                         <FileText size={20} />
                      </div>
                      <div>
                         <h4 className="text-xs font-black text-[#091426] dark:text-white uppercase">Last Event ID</h4>
                         <p className="text-[10px] font-mono text-blue-600 uppercase">#{currentEvent?.id.substring(0, 12)}</p>
                      </div>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800 font-mono text-[10px] font-bold uppercase tracking-tight text-slate-500">
                      <div className="flex justify-between"><span>User</span><span className="text-[#091426] dark:text-slate-300">{currentEvent?.user?.email || 'System'}</span></div>
                      <div className="flex justify-between"><span>Status</span><span className="text-emerald-600 underline">VERIFIED</span></div>
                   </div>
                </div>

                <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload Inspection (SHA-256 Segment)</h4>
                      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                         <button className="px-3 py-1 bg-white dark:bg-slate-700 dark:text-white text-[9px] font-black text-[#091426] rounded-md shadow-sm uppercase tracking-widest">JSON</button>
                         <button className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">CRYPTO</button>
                      </div>
                   </div>
                   <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[11px] text-blue-300/80 leading-relaxed overflow-x-auto shadow-inner h-32 scrollbar-hide">
                      {currentEvent ? (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(currentEvent.payload, null, 2)}
                        </pre>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-30 italic">No segment selected</div>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Forensic Sidebar Journal */}
          <div className="col-span-4 space-y-8">
             <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col h-[740px] overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Terminal size={14} className="text-blue-600" /> Audit Trail Log
                   </h3>
                   <span className="text-[9px] font-black text-slate-300 uppercase">Live Journal</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 space-y-10 relative pl-12 before:absolute before:left-6 before:top-10 before:bottom-10 before:w-px before:bg-slate-100 dark:before:bg-slate-800 scrollbar-hide">
                   {(events.length > 0 ? events : []).map((log, i) => (
                     <div key={i} className={`relative group transition-opacity duration-300 ${i > replayIndex ? 'opacity-20 translate-x-1' : 'opacity-100'}`}>
                        <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm z-10 transition-all ${
                          i === replayIndex ? 'scale-150 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                          i < replayIndex ? 'bg-blue-600' : 'bg-slate-300'
                        }`} />
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-300 dark:text-slate-600 uppercase">
                              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                              <span className="text-blue-600">{log.type}</span>
                           </div>
                           <p className="text-xs font-black text-[#091426] dark:text-white uppercase tracking-tight">{log.type}</p>
                           <p className="text-[10px] text-slate-400 font-bold leading-relaxed truncate">{log.sha256Hash?.substring(0, 32)}...</p>
                        </div>
                     </div>
                   ))}
                   {events.length === 0 && !loadingEvents && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                         <ShieldAlert size={48} />
                         <p className="text-[10px] font-black uppercase tracking-widest">No Events to Replay</p>
                      </div>
                   )}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100">
                   <button className="w-full py-4 bg-white border border-slate-200 text-[#091426] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group shadow-sm">
                      <Download size={14} className="group-hover:-translate-y-1 transition-transform" /> Export Full Stream
                   </button>
                </div>
             </div>

             <div className="bg-[#091426] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Fingerprint size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                      <Zap size={16} /> Forensic Agent
                   </h4>
                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Agent is currently hashing recovery clusters. Probability of full restoration: <span className="text-emerald-400">92.4%</span></p>
                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all">
                      <Activity size={16} className="text-blue-400" />
                      <div className="flex-1 space-y-2">
                         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="pt-10 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.2em] relative overflow-hidden">
           <div className="flex gap-10 items-center">
              <div className="flex items-center gap-3">
                 <Terminal size={16} className="text-slate-900" />
                 <span>Process Core: PR7-G88</span>
              </div>
              <p>System_Epoch: 1698163200 // Stream_ID: 0xFF21Z</p>
           </div>
           <p className="flex items-center gap-2 text-blue-600 font-black">
              <Zap size={10} className="fill-current" /> ALL SYSTEMS GO
           </p>
        </div>
      </div>
    </div>
  );
};

export default ForensicReplay;
