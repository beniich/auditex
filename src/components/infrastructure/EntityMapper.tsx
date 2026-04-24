import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Search, 
  CheckCircle2, 
  Activity, 
  Lock, 
  RefreshCw, 
  AlertTriangle, 
  Download, 
  Bell, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Compass,
  Building2,
  MoreVertical,
  ShieldCheck as Verified,
  Globe,
  MapPin,
  Fingerprint,
  Zap,
  BarChart3,
  Layers,
  Link as LinkIcon,
  Filter,
  Users
} from 'lucide-react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { LegalEntityService } from '../../services/LegalEntityService';
import { Skeleton } from '../common/Skeleton';

export const EntityMapper: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const { data: entities = [], isLoading } = useApiQuery(
    ['legal-entities'],
    () => LegalEntityService.getEntities(),
    { refetchInterval: 60000 }
  );

  React.useEffect(() => {
    if (entities.length > 0 && !selectedEntityId) {
      setSelectedEntityId(entities[0].id);
    }
  }, [entities, selectedEntityId]);

  const root = entities.find((e: any) => !e.parentId);
  const children = entities.filter((e: any) => e.parentId === root?.id);
  const selectedEntity = entities.find((e: any) => e.id === selectedEntityId);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1700px] mx-auto space-y-10">
        
        {/* Entity Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end bg-white border border-slate-200 p-8 lg:p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
             <Network size={150} />
          </div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <Globe size={12} className="text-blue-400" /> Structure_Mapper v5.2
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-slate-200">
                 GEMS SYNC: OPTIMAL // {entities.length} ENTITIES
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Organizational Entity Mapper</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Structural visualization of global subsidiary hierarchies, ownership verification, and jurisdictional compliance anchoring. 
               Cross-referenced with GEMS (Global Entity Management System) and sovereign tax registries.
            </p>
          </div>

          <div className="flex gap-4 mt-8 xl:mt-0 relative z-10">
             <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-[2rem] flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Health</p>
                   <p className="text-lg font-black text-[#091426] tracking-tighter uppercase">STABLE</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500">
                   <Activity size={24} />
                </div>
             </div>
          </div>
        </div>

        {/* Main Mapping Canvas & Sidebar Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Visualizer Canvas (8 Cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm relative min-h-[720px] overflow-hidden group">
             {/* Header Interior */}
             <div className="absolute top-8 left-10 z-20 flex justify-between items-center w-[calc(100%-80px)]">
                <div className="bg-white/80 backdrop-blur border border-slate-100 p-1.5 rounded-2xl flex gap-2 shadow-xl">
                   <button className="p-3 bg-white text-[#091426] rounded-xl shadow-sm border border-slate-100 hover:text-blue-600 transition-all"><Maximize2 size={18} /></button>
                   <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-blue-600 transition-all"><Compass size={18} /></button>
                   <button className="p-3 bg-white text-slate-400 rounded-xl hover:text-blue-600 transition-all"><Layers size={18} /></button>
                </div>
                <div className="bg-white/80 backdrop-blur border border-slate-100 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Verified Hub</span>
                   </div>
                   <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Live Reorg</span>
                   </div>
                </div>
             </div>

             {/* Schematic Grid Background */}
             <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000">
                <div className="w-full h-full bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] [background-size:60px_60px]" />
                <svg className="absolute inset-0 w-full h-full">
                   <motion.path 
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: 1 }}
                     transition={{ duration: 2, ease: "easeInOut" }}
                     d="M400,100 L200,300 M400,100 L400,300 M400,100 L600,300" 
                     stroke="rgba(59,130,246,0.6)" 
                     strokeWidth="1.5" 
                     strokeDasharray="8 8" 
                     fill="none" 
                     className="translate-x-[50%]"
                   />
                </svg>
             </div>

             {/* Hierarchical Nodes */}
             <div className="absolute inset-0 p-20 flex flex-col items-center">
                
                {isLoading ? (
                  <div className="h-full flex items-center justify-center"><Skeleton className="w-80 h-40 rounded-[2.5rem]" /></div>
                ) : (
                  <>
                    {/* ROOT NODE */}
                    {root && (
                      <motion.div 
                        layoutId={root.id}
                        onClick={() => setSelectedEntityId(root.id)}
                        className={`w-80 p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer relative z-10 ${selectedEntityId === root.id ? 'bg-[#091426] border-blue-600 shadow-2xl scale-105' : 'bg-white border-blue-100 shadow-xl'}`}
                      >
                        <div className="flex justify-between items-center mb-6">
                           <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${selectedEntityId === root.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>Ultimate Parent</span>
                           <Verified className={selectedEntityId === root.id ? 'text-blue-400' : 'text-blue-600'} size={24} />
                        </div>
                        <h3 className={`text-lg font-black uppercase tracking-tight ${selectedEntityId === root.id ? 'text-white' : 'text-[#091426]'}`}>{root.name}</h3>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                           <div className="flex items-center gap-2">
                              <Globe size={12} className="text-slate-400" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HQ: {root.jurisdiction}</span>
                           </div>
                           <LinkIcon size={14} className="text-blue-500" />
                        </div>
                      </motion.div>
                    )}

                    {/* CHILDREN LAYER */}
                    <div className="flex justify-around w-full mt-40">
                       {children.map((child: any, i: number) => (
                         <motion.div 
                            key={child.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            onClick={() => setSelectedEntityId(child.id)}
                            className={`w-64 p-6 rounded-[2rem] border transition-all cursor-pointer group/node ${selectedEntityId === child.id ? 'bg-[#091426] border-blue-600 shadow-2xl' : 'bg-white border-slate-100 shadow-lg hover:border-blue-200'}`}
                         >
                            <div className="flex justify-between items-center mb-6">
                               <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                 child.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 child.status === 'ACTION_REQ' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                               }`}>{child.ownerPercent}% Owned</span>
                               <Building2 size={16} className={selectedEntityId === child.id ? 'text-blue-400' : 'text-slate-300 group-hover/node:text-blue-600 transition-colors'} />
                            </div>
                            <h4 className={`text-xs font-black uppercase tracking-tight leading-tight mb-4 ${selectedEntityId === child.id ? 'text-white' : 'text-[#091426]'}`}>{child.name}</h4>
                            <div className="h-1 w-full bg-slate-100/10 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `85%` }} className={`h-full ${child.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            </div>
                         </motion.div>
                       ))}
                    </div>
                  </>
                )}
             </div>

             {/* Legend Strip */}
             <div className="absolute bottom-10 left-10 flex gap-10 bg-white/80 backdrop-blur px-8 py-3 rounded-2xl border border-slate-100 shadow-xl opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Majority Share</div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Clean Audit</div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Compliance Gap</div>
             </div>
          </div>

          {/* Right Entity Insight Sidebar (4 Cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             
             {/* Dynamic Detail Card */}
             <AnimatePresence mode="wait">
                <motion.div 
                   key={selectedEntityId}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col gap-10 group"
                >
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                         <Building2 size={32} />
                      </div>
                      <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-[#091426] transition-colors"><MoreVertical size={18} /></button>
                   </div>
                   
                   <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Unit Context Detail</h3>
                      <h2 className="text-2xl font-black text-[#091426] uppercase tracking-tighter leading-none italic decoration-blue-200 underline underline-offset-8">
                         {selectedEntity?.name || 'Select Hub'}
                      </h2>
                      <div className="flex gap-4 mt-8">
                         <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Local Juris.</span>
                            <span className="text-xs font-black text-[#091426] uppercase">{selectedEntity?.jurisdiction}</span>
                         </div>
                         <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tax ID Mapping</span>
                            <span className="text-[10px] font-mono font-black text-blue-600">{selectedEntity?.taxId || 'GLOBAL_ROOT'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#091426]">
                         <span>Audit Validation Pulse</span>
                         <span className="text-blue-600">{selectedEntity?.status === 'VERIFIED' ? '100%' : '85%'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: selectedEntity?.status === 'VERIFIED' ? '100%' : '85%' }} 
                            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                         />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Fingerprint size={14} className="text-blue-600" /> Sovereign Attestations</h4>
                      <div className="flex flex-col gap-2">
                         {['PwC Regional Branch 42', 'E&Y Global Assurance', 'Internal Audit Control'].map((agent, i) => (
                           <div key={i} className="px-4 py-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center hover:border-blue-200 transition-colors cursor-pointer group/row">
                              <span className="text-[11px] font-bold text-slate-700">{agent}</span>
                              <ChevronRight size={14} className="text-slate-300 group-hover/row:translate-x-1 group-hover/row:text-blue-600 transition-all" />
                           </div>
                         ))}
                      </div>
                   </div>

                   <button className="w-full py-5 bg-[#091426] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                      Initiate Regional Audit <Zap size={16} />
                   </button>
                </motion.div>
             </AnimatePresence>

             {/* Network Stats Card */}
             <div className="bg-[#091426] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-600 opacity-20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-10 flex justify-between items-center">
                   Structural Intelligence <BarChart3 size={18} />
                </h3>
                <div className="space-y-8 relative z-10">
                   <div>
                      <div className="flex justify-between items-end mb-4">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Subsidiary Coverage</span>
                         <span className="text-2xl font-black tracking-tighter italic">{entities.length} / {entities.length + 3}</span>
                      </div>
                      <div className="flex gap-1.5 items-end h-8">
                         {[60, 40, 90, 30, 70, 45, 85, 40, 65, 30].map((h, i) => (
                           <motion.div 
                              key={i} 
                              initial={{ height: 0 }} animate={{ height: `${h}%` }} 
                              className="flex-1 bg-blue-600 rounded-full opacity-60 hover:opacity-100 transition-opacity"
                           />
                         ))}
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Nodes</p>
                         <p className="text-lg font-black tracking-tight">{children.length} Units</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Affiliated</p>
                         <p className="text-lg font-black tracking-tight">{entities.length - 1} Units</p>
                      </div>
                   </div>
                </div>
                <button className="mt-10 w-full py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-white/10 transition-all">Export Global Index</button>
             </div>
          </div>
        </div>

        {/* Technical Footer Strip */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em] ">
           <p className="flex items-center gap-3">
              <Verified size={16} className="text-[#091426]" /> 
              Mapping_Source: GEMS_INTERNAL // Sync_Lat: 114ms
           </p>
           <p className="text-[#091426] flex items-center gap-2">
              <Globe size={14} className="text-blue-600" /> Sovereign Compliance Anchoring Enabled
           </p>
           <p>Last Ledger Sync: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default EntityMapper;
