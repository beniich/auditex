import React from 'react';
import { FileText, Database, Activity, CheckCircle2, Search, Upload, RefreshCw, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

const DOCUMENTS = [
  { name: 'Annual_Risk_Report.pdf', status: 'Processed', reliability: 98, color: 'emerald', time: '2h ago' },
  { name: 'Reg_Guidance_Q4.docx', status: 'Processing', reliability: 45, color: 'blue', time: 'Just now' },
  { name: 'Policy_Manual_v2.pdf', status: 'Processed', reliability: 94, color: 'emerald', time: '1d ago' }
];

const SNIPPETS = [
  { text: "Section 3.1.2 defines material risk thresholds as any exposure exceeding $5M...", doc: "Annual_Risk_Report.pdf" },
  { text: "Effective Jan 1, 2024, all entities must adopt the revised framework for data sovereignty...", doc: "Reg_Guidance_Q4.docx " }
];

export const RAGKnowledgeBase = () => {
  return (
    <div className="flex flex-col gap-8 h-full bg-[#f8fafc] p-10 rounded-[3rem] min-h-[850px]">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-4xl font-black text-[#091426] tracking-tight flex items-center gap-4">
               AuditAX AI Knowledge Base <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black">RAG Core v4</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2 text-lg">Hybrid retrieval-augmented generation for autonomous regulatory intelligence.</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
               <RefreshCw size={16} /> Re-Index All
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:opacity-90 transition-all">
               <Upload size={16} /> Ingest Source
            </button>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1">
         {/* Left: Source Documents */}
         <div className="col-span-3 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6 h-full">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <Database size={16} /> Data Sources
                  </h3>
                  <span className="text-[10px] font-black text-blue-600">3 TOTAL</span>
               </div>
               
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input type="text" placeholder="Filter sources..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" />
               </div>

               <div className="flex flex-col gap-4 overflow-y-auto">
                  {DOCUMENTS.map((doc, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group cursor-pointer hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all">
                        <div className={`w-10 h-10 rounded-xl bg-${doc.color}-50 flex items-center justify-center text-${doc.color}-600 border border-${doc.color}-100`}>
                           <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-black text-[#091426] truncate">{doc.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{doc.time} • {doc.reliability}% Confidence</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Center: Processing & Snippets */}
         <div className="col-span-6 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-8 flex-1 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 bg-blue-600 h-full"></div>
               
               <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <Activity size={16} /> Live Ingestion Pipeline
                  </h3>
                  
                  <div className="mt-6 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col gap-4">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                           <span className="text-sm font-black text-[#091426]">Reg_Guidance_Q4.docx</span>
                        </div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Processing (45%)</span>
                     </div>
                     <div className="h-3 bg-white border border-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '45%' }}
                           transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                           className="h-full bg-blue-600 rounded-full"
                        />
                     </div>
                     <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Status: Chunking Metadata</span>
                        <span>ETA: ~45 seconds</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-6 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                     <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Info size={16} /> Semantic Previews
                     </h3>
                     <span className="text-[10px] font-black text-slate-300">AUTO-GENERATED CHUNKS</span>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     {SNIPPETS.map((s, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl relative italic group hover:bg-white hover:border-blue-200 transition-all">
                           <div className="absolute -left-2 top-6 bg-blue-600 w-1 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                           <p className="text-sm text-slate-600 font-medium leading-relaxed">"{s.text}"</p>
                           <div className="mt-4 flex items-center gap-2">
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono">SOURCE: {s.doc}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Analytics & Scores */}
         <div className="col-span-3 flex flex-col gap-8">
            <div className="bg-[#091426] p-8 rounded-[2.5rem] text-white flex flex-col gap-8 text-center items-center">
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reliability Score</h3>
               <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - 0.96)} className="text-blue-500" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <span className="text-4xl font-black">96%</span>
                  </div>
               </div>
               <p className="text-slate-400 font-bold text-sm">Overall RAG Precision</p>
               <div className="w-full border-t border-slate-800 pt-6 grid grid-cols-2 gap-4">
                  <div className="text-left">
                     <p className="text-[9px] font-black text-slate-500 uppercase">Provenance</p>
                     <p className="text-lg font-black mt-1">98.2%</p>
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-black text-slate-500 uppercase">Currency</p>
                     <p className="text-lg font-black mt-1">94.5%</p>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6">
               <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <TrendingUp size={16} /> Trends
               </h3>
               <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-600">Query Latency</span>
                     <span className="text-xs font-black text-emerald-600">-12%</span>
                  </div>
                  <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-4/5"></div>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-600">Model hallucination</span>
                     <span className="text-xs font-black text-emerald-600">-0.4%</span>
                  </div>
                  <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-1/4"></div>
                  </div>
               </div>
            </div>

            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8 flex flex-col justify-center gap-4">
               <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                  <AlertCircle size={28} />
               </div>
               <div>
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Governance Alert</h4>
                  <p className="text-xs font-medium text-amber-700 mt-1 leading-relaxed">2 source documents require manual re-validation due to conflicting semantic metadata.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default RAGKnowledgeBase;
