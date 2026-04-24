import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, PenLine, ChevronRight, BookOpen, ShieldCheck, AlertTriangle } from 'lucide-react';
import XRegExp from 'xregexp';

const CONTROLS = [
  { id: 'A.5.1.1', framework: 'ISO 27001:2013', title: 'Policies for security', desc: 'Set of policies for information security shall be defined...', status: 'Implemented', owner: 'InfoSec Team', updated: 'Oct 25, 2023', color: 'emerald' },
  { id: 'AC-2', framework: 'NIST SP 800-53', title: 'Account Management', desc: 'Procedures for account creation, modification...', status: 'Planned', owner: 'IT Ops', updated: 'Nov 1, 2023', color: 'orange' },
  { id: 'A.12.3.1', framework: 'ISO 27001:2013', title: 'Information backup', desc: 'Backup policy and procedures for data recovery...', status: 'Gap', owner: 'System Admin', updated: 'Sep 15, 2023', color: 'rose' }
];

export const ControlLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('All');

  const filteredControls = useMemo(() => {
    return CONTROLS.filter(control => {
      const frameworkMatch = selectedFramework === 'All' || control.framework.includes(selectedFramework);
      if (!frameworkMatch) return false;

      if (!searchQuery) return true;

      try {
        // Advanced XRegExp search: supports patterns like "(?=.*ISO)(?=.*backup)"
        // If it's a simple string, it behaves like normal search but Case Insensitive
        const regex = XRegExp(searchQuery, 'i');
        return (
          XRegExp.test(control.id, regex) ||
          XRegExp.test(control.title, regex) ||
          XRegExp.test(control.owner, regex)
        );
      } catch (e) {
        // Fallback to simple includes if regex is invalid
        const lowQuery = searchQuery.toLowerCase();
        return (
          control.id.toLowerCase().includes(lowQuery) ||
          control.title.toLowerCase().includes(lowQuery) ||
          control.owner.toLowerCase().includes(lowQuery)
        );
      }
    });
  }, [searchQuery, selectedFramework]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[850px] border border-slate-200">
      <div className="bg-white p-10 border-b border-slate-200">
         <div className="flex justify-between items-start">
            <div>
               <h2 className="text-3xl font-black text-[#091426] tracking-tight">Compliance Control Library</h2>
               <p className="text-slate-500 font-medium mt-1">Centralized repository for governance frameworks and control point tracking.</p>
            </div>
            <button className="bg-[#091426] text-white px-8 py-4 rounded-2xl font-black text-[10px] shadow-xl shadow-slate-900/10 uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2">
               <Plus size={16} /> Add New Control
            </button>
         </div>
         
         <div className="flex gap-6 mt-10">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search controls (Regex support ex: (?=.*ISO)(?=.*backup))..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-mono" 
               />
               {searchQuery && (
                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-1 rounded uppercase tracking-[0.2em]">XRegExp Active</span>
                 </div>
               )}
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Framework:</span>
               <div className="flex gap-1.5">
                  {['All', 'ISO 27001', 'NIST 800-53'].map(fw => (
                    <span 
                      key={fw}
                      onClick={() => setSelectedFramework(fw)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all ${
                        selectedFramework === fw ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {fw}
                    </span>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 p-10 overflow-hidden">
         <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                     <th className="p-6 pl-10">Control ID</th>
                     <th className="p-6">Framework</th>
                     <th className="p-6">Control Title</th>
                     <th className="p-6">Status</th>
                     <th className="p-6">Owner</th>
                     <th className="p-6">Updated</th>
                     <th className="p-6 pr-10 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 overflow-y-auto">
                  {filteredControls.map(control => (
                     <tr key={control.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                        <td className="p-6 pl-10 font-black text-blue-600 font-mono text-sm">{control.id}</td>
                        <td className="p-6">
                           <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight">{control.framework}</span>
                        </td>
                        <td className="p-6">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#091426] group-hover:text-blue-600 transition-colors">{control.title}</span>
                              <span className="text-xs font-medium text-slate-400 line-clamp-1 mt-0.5">{control.desc}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 w-fit ${
                               control.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                               control.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                               'bg-rose-50 text-rose-600'
                            }`}>
                               {control.color === 'emerald' ? <ShieldCheck size={12} /> : control.color === 'orange' ? <BookOpen size={12} /> : <AlertTriangle size={12} />}
                               {control.status}
                            </span>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-500">{control.owner}</td>
                        <td className="p-6 text-sm font-medium text-slate-400">{control.updated}</td>
                        <td className="p-6 pr-10">
                           <div className="flex items-center justify-center gap-2">
                              <button className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                 <PenLine size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            
            <div className="mt-auto p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center px-10">
               <span className="text-xs font-bold text-slate-400">Showing {filteredControls.length} of {CONTROLS.length} Controls</span>
               <div className="flex gap-2">
                  <button className="p-2 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 disabled:opacity-50" disabled><ChevronRight size={14} className="rotate-180" /></button>
                  <button className="p-2 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</button>
                  <button className="p-2 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">2</button>
                  <button className="p-2 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400"><ChevronRight size={14} /></button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default ControlLibrary;
