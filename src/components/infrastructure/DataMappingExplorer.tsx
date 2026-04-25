import React, { useState } from 'react';
import { 
  Cloud, Database, CreditCard, TriangleAlert, Info, 
  Map as MapIcon, Share2, Shield, Filter 
} from 'lucide-react';
import { motion } from 'motion/react';
import { DataFlowService, DataNode, DataConnector } from '../../services/DataFlowService';
import { useApiQuery } from '../../hooks/useApiQuery';

const iconMap: Record<string, any> = {
  source: Cloud,
  storage: Database,
  external: CreditCard,
  sink: Database
};

export const DataMappingExplorer = () => {
  const [selectedFlow, setSelectedFlow] = useState<DataConnector | null>(null);

  const { data: nodes = [], isLoading: nodesLoading } = useApiQuery(
    ['data-flow-nodes'],
    () => DataFlowService.getNodes()
  );

  const { data: connectors = [], isLoading: connectorsLoading } = useApiQuery(
    ['data-flow-connectors'],
    () => DataFlowService.getConnectors()
  );

  const { data: stats } = useApiQuery(
    ['data-flow-stats'],
    () => DataFlowService.getFlowStats()
  );

  const isLoading = nodesLoading || connectorsLoading;

  if (isLoading) {
    return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Mapping Data Sovereignty Flows...</div>;
  }

  return (
    <div className="flex flex-col gap-8 h-full bg-[#f8fafc] p-10 rounded-[3rem] min-h-[900px] border border-slate-200 overflow-hidden">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-black text-[#091426] tracking-tight">Data Mapping Explorer</h2>
            <p className="text-slate-500 font-medium mt-1">Visualization of sensitive data residency and cross-border flow compliance.</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
               <Share2 size={16} /> Export Flow
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 transition-all">
               <MapIcon size={16} /> New Mapping
            </button>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
         {/* Left: Filters */}
         <div className="col-span-3">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-8 h-full">
               <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Filter size={16} /> Analysis Filters
               </h3>
               
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Compliance Framework</label>
                     <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none appearance-none">
                        <option>GDPR, CCPA, ISO 27001</option>
                        <option>SOC2 Type II</option>
                        <option>HIPAA Physical</option>
                     </select>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sensitivity Tier</label>
                     <div className="grid grid-cols-2 gap-2">
                        <button className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[9px] font-black text-rose-600 uppercase">PII / Critical</button>
                        <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase opacity-50">Public Data</button>
                     </div>
                  </div>
               </div>

               <div className="mt-auto p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-2 text-rose-600 mb-3">
                     <Shield size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Risk Summary</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed">
                    Detected <span className="text-rose-600 underline">{stats?.highRiskCount || 0} high-risk flows</span> across {stats?.totalFlows || 0} active connections.
                  </p>
               </div>
            </div>
         </div>

         {/* Center: SVG Canvas */}
         <div className="col-span-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-inner h-full p-10 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#091426 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
               
               <div className="relative w-full h-[600px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                     <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orientation="auto">
                           <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                        </marker>
                        <marker id="arrowhead-danger" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orientation="auto">
                           <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
                        </marker>
                     </defs>
                     {connectors.map((conn, idx) => {
                        const fromNode = nodes.find(n => n.id === conn.from);
                        const toNode = nodes.find(n => n.id === conn.to);
                        if (!fromNode || !toNode) return null;
                        
                        return (
                           <motion.line 
                              key={`${conn.from}-${conn.to}`}
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              x1={fromNode.x + 100} y1={fromNode.y + 30} x2={toNode.x} y2={toNode.y + 30} 
                              stroke={conn.color === 'rose' ? '#f43f5e' : '#cbd5e1'} 
                              strokeWidth={conn.color === 'rose' ? 3 : 2}
                              strokeDasharray={conn.color === 'rose' ? '8 4' : 'none'}
                              markerEnd={`url(#${conn.color === 'rose' ? 'arrowhead-danger' : 'arrowhead'})`}
                              className="cursor-pointer pointer-events-auto"
                              onClick={() => setSelectedFlow(conn)}
                           />
                        );
                     })}
                  </svg>

                  {/* Nodes Layer */}
                  {nodes.map(node => {
                    const Icon = iconMap[node.type] || Cloud;
                    return (
                      <motion.div 
                         key={node.id}
                         initial={{ opacity: 0, scale: 0.8 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className={`absolute p-4 px-6 rounded-2xl bg-white border-2 shadow-xl flex items-center gap-4 min-w-[200px] cursor-pointer hover:border-blue-500 transition-all ${
                            node.risk ? 'border-rose-400 bg-rose-50 shadow-rose-500/10' : 'border-slate-100 shadow-slate-200/50'
                         }`}
                         style={{ left: node.x, top: node.y }}
                      >
                         <div className={`p-2 rounded-xl ${node.risk ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                            <Icon size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-[#091426] whitespace-nowrap">{node.label}</p>
                            {node.risk && <p className="text-[8px] font-black text-rose-600 uppercase mt-0.5 flex items-center gap-1 group"><TriangleAlert size={10} className="animate-pulse" /> HIGH RISK</p>}
                         </div>
                      </motion.div>
                    );
                  })}
               </div>
            </div>
         </div>

         {/* Right: Selection Details */}
         <div className="col-span-3">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6 h-full">
               <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Info size={16} /> Selected Flow Details
               </h3>
               
               {selectedFlow ? (
                 <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex flex-col gap-6">
                    <div>
                       <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Source Interface</p>
                       <p className="text-sm font-bold text-rose-900">{nodes.find(n => n.id === selectedFlow.from)?.label}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Destination</p>
                       <p className="text-sm font-bold text-rose-900">{nodes.find(n => n.id === selectedFlow.to)?.label}</p>
                    </div>
                    {selectedFlow.violations && (
                      <div className="border-t border-rose-200 pt-6">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Detected Violations</p>
                        <ul className="flex flex-col gap-2">
                           {selectedFlow.violations.map((v, i) => (
                             <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-rose-700 leading-tight">
                                <span className="mt-1 w-1 h-1 bg-rose-600 rounded-full shrink-0"></span> {v}
                             </li>
                           ))}
                        </ul>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="flex-1 flex items-center justify-center text-center p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select a connector to view compliance details</p>
                 </div>
               )}

               <div className="mt-auto">
                  <button 
                    disabled={!selectedFlow}
                    className="w-full py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                     View Mitigation Actions
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default DataMappingExplorer;
