import React from 'react';
import { Search, ChevronDown, ChevronUp, Link as LinkIcon, FileText, Calendar, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const LedgerBlock = ({ block, isFirst, isLast }: { block: any, isFirst: boolean, isLast: boolean }) => (
  <div className="relative flex gap-8 pl-12">
    {/* Connection Line */}
    {!isLast && (
      <div className="absolute left-[23px] top-[40px] bottom-0 w-1 bg-slate-200"></div>
    )}
    
    {/* Block Icon / Node */}
    <div className={`absolute left-0 top-0 w-12 h-12 rounded-xl flex items-center justify-center border-2 z-10 ${
      block.expanded ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-400'
    }`}>
      <LinkIcon size={20} />
    </div>

    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8 shadow-sm ${block.expanded ? 'ring-2 ring-blue-500/10' : ''}`}
    >
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#091426]">Block #{block.id} - {block.timestamp} UTC</span>
          {block.summary && <span className="text-xs font-semibold text-slate-400 tracking-tight">- {block.summary}</span>}
        </div>
        {block.expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </div>
      
      {block.expanded && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hash:</span>
            <span className="text-sm font-mono font-bold text-[#091426] select-all">{block.hash}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Previous Hash:</span>
            <span className="text-sm font-mono font-bold text-slate-400 truncate">{block.prevHash}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Event Type:</span>
            <span className="text-sm font-bold text-[#091426]">{block.type}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Entity:</span>
            <span className="text-sm font-bold text-[#091426]">{block.entity}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Action:</span>
            <span className="text-sm font-bold text-[#091426]">{block.action}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Linked Evidence:</span>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline cursor-pointer">
              <FileText size={14} />
              <span>{block.evidence}</span>
              {block.verified && <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tight">(SHA-256 verified)</span>}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  </div>
);

export const ImmutableLedgerBrowser = () => {
  const blocks = [
    {
      id: "124859",
      timestamp: "2024-05-24 10:32:15",
      hash: "0x4d5e6f...a1b2c3",
      prevHash: "0x7a8b9c...d4e5f6",
      type: "Transaction Approval",
      entity: "User: J. Smith",
      action: "Approved Invoice #4521",
      evidence: "Invoice_4521_Signed.pdf",
      verified: true,
      expanded: true
    },
    {
      id: "124858",
      timestamp: "2024-05-24 10:15:48",
      hash: "0x3c2a1b...f9e8d7",
      prevHash: "0x4d5e6f...a1b2c3",
      type: "System Alert - Data Access",
      entity: "Server: FIN-DB-01",
      action: "High Volume Read",
      evidence: "ServerLog_240524.txt",
      verified: false,
      expanded: true
    },
    {
      id: "124857",
      timestamp: "2024-05-24 09:55:22",
      summary: "User Login: M. Chen",
      expanded: false
    },
    {
      id: "124856",
      timestamp: "2024-05-24 09:48:11",
      summary: "Configuration Change",
      expanded: false
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4 border-b border-slate-200">
         <h2 className="text-2xl font-black text-[#091426]">Immutable Ledger Browser</h2>
         <p className="text-slate-500 text-sm font-medium mt-1">Review crytpographically secured transaction history and audit trails.</p>
      </div>

      <div className="flex flex-1 p-6 gap-6 h-[calc(100%-100px)]">
         {/* Filter Sidebar */}
         <div className="w-64 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-[#091426]">Filter Events</h3>

            <div className="mb-6">
               <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.1em] mb-3">Date Range</h4>
               <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value="05/24/2024" className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" readOnly />
                  </div>
                  <span className="text-slate-400 font-bold">-</span>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" value="05/24/2024" className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" readOnly />
                  </div>
               </div>
            </div>

            <div className="mb-6">
               <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.1em] mb-3">Event Type</h4>
               <div className="space-y-2.5">
                  {['Access Log', 'Transaction', 'Approval', 'System Alert'].map(type => (
                     <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center bg-white group-hover:border-blue-400 transition-colors">
                           <div className="w-2 h-2 rounded-sm bg-blue-500 opacity-0 group-hover:opacity-20"></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-[#091426] transition-colors">{type}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="mb-6">
               <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.1em] mb-3">Entity</h4>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
               </div>
            </div>

            <div className="mt-auto">
               <button className="w-full py-2.5 bg-[#091426] text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                 <Filter size={14} /> Apply Filters
               </button>
            </div>
         </div>

         {/* Chain area */}
         <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 p-8 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-[#091426] mb-8">Immutable Ledger Chain</h3>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              {blocks.map((block, index) => (
                <LedgerBlock 
                  key={block.id} 
                  block={block} 
                  isFirst={index === 0} 
                  isLast={index === blocks.length - 1} 
                />
              ))}
              <div className="flex justify-center pt-4">
                <button className="px-10 py-3 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all text-sm">
                  Load More
                </button>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default ImmutableLedgerBrowser;
