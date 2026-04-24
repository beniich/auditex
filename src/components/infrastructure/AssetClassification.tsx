import React from 'react';
import { Search, ChevronDown, CheckCircle2, XCircle, MoreVertical, Filter, Tag } from 'lucide-react';

const ASSETS = [
  { id: 1, name: 'AWS-S3-Prod-Data', type: 'Cloud Storage', source: 'AWS', status: 'Discovered', suggestion: 'High Risk, PII Data', color: 'rose' },
  { id: 2, name: 'SharePoint-Finance-Docs', type: 'Document Library', source: 'Microsoft 365', status: 'Discovered', suggestion: 'Medium Risk, Financial', color: 'orange' },
  { id: 3, name: 'Jira-Project-Alpha', type: 'Project Management', source: 'Atlassian', status: 'Discovered', suggestion: 'Low Risk, Internal', color: 'emerald' },
  { id: 4, name: 'GitHub-Audit-Service', type: 'Source Code', source: 'GitHub', status: 'Discovered', suggestion: 'Medium Risk, Intellectual Property', color: 'blue' }
];

export const AssetClassification = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-8 border-b border-slate-200">
         <h2 className="text-2xl font-black text-[#091426] tracking-tight">Smart Asset Classification</h2>
         <p className="text-slate-500 text-sm font-medium mt-1">Categorize and tag discovered assets using AI suggestions.</p>
      </div>

      <div className="flex-1 p-8 overflow-hidden flex gap-8">
         {/* Table Area */}
         <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
               </div>
               <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm">
                  <Filter size={16} /> Filter
               </button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                     <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <th className="p-4 pl-6 w-10"><input type="checkbox" className="rounded" /></th>
                        <th className="p-4">Asset Name</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">AI Suggestions</th>
                        <th className="p-4 pr-6 text-center">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {ASSETS.map(asset => (
                        <tr key={asset.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="p-4 pl-6"><input type="checkbox" className="rounded" /></td>
                           <td className="p-4 text-sm font-bold text-[#091426]">{asset.name}</td>
                           <td className="p-4 text-sm font-semibold text-slate-500">{asset.type}</td>
                           <td className="p-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">{asset.source}</td>
                           <td className="p-4">
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-tight">{asset.status}</span>
                           </td>
                           <td className="p-4 text-center">
                              <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold ${
                                 asset.color === 'rose' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                 asset.color === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                 asset.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                 'bg-blue-50 text-blue-600 border border-blue-100'
                              }`}>
                                 {asset.suggestion}
                              </span>
                           </td>
                           <td className="p-4 pr-6 text-center">
                              <div className="flex items-center justify-center gap-3">
                                 <button className="text-emerald-500 hover:scale-110 transition-transform"><CheckCircle2 size={18} /></button>
                                 <button className="text-rose-500 hover:scale-110 transition-transform"><XCircle size={18} /></button>
                                 <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Batch Actions Sidebar */}
         <div className="w-80 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-black text-[#091426] text-lg">Batch Actions</h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
               <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black">12</div>
               <span>Assets Selected</span>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Apply Risk Level</label>
                  <div className="relative">
                     <select className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#091426] outline-none">
                        <option>Critical Risk</option>
                        <option>High Risk</option>
                        <option>Medium Risk</option>
                        <option>Low Risk</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Owner</label>
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input type="text" placeholder="Search users..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                  </div>
               </div>
            </div>

            <div className="mt-auto space-y-3">
               <button className="w-full py-3 bg-[#091426] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Tag size={14} /> Apply Batch Tags
               </button>
               <button className="w-full py-3 border border-slate-200 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Clear Selection
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
export default AssetClassification;
