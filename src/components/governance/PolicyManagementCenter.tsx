import React from 'react';
import { Search, ChevronDown, Plus, LayoutDashboard, FileText, Workflow, MessageSquare, History, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const POLICIES = [
  { name: 'Code of Conduct', version: '4.2', status: 'Active', updated: '10/25/2023', ack: 98, actions: ['View', 'Edit', 'History'] },
  { name: 'Anti-Bribery & Corruption', version: '3.0', status: 'Under Review', updated: '11/01/2023', ack: 75, actions: ['View', 'Edit', 'Workflow'] },
  { name: 'Data Privacy Policy', version: '2.1', status: 'Draft', updated: '11/10/2023', ack: 0, actions: ['Edit', 'Submit for Approval'] },
  { name: 'Travel & Expense Policy', version: '5.0', status: 'Active', updated: '09/15/2023', ack: 100, actions: ['View', 'Edit', 'History'] },
  { name: 'IT Security Policy', version: '6.3', status: 'Archived', updated: '06/20/2023', ack: 0, actions: ['View', 'History'] }
];

export const PolicyManagementCenter = () => {
  return (
    <div className="flex h-full bg-white rounded-3xl overflow-hidden min-h-[800px] border border-slate-200 shadow-sm">
      {/* Internal Sidebar */}
      <div className="w-64 border-r border-slate-100 p-6 flex flex-col gap-2">
         <div className="flex items-center gap-3 mb-8 px-2">
            <h1 className="text-xl font-black text-[#091426] italic tracking-tighter uppercase">AuditAX</h1>
         </div>
         
         {[
           { icon: LayoutDashboard, label: 'Dashboard' },
           { icon: FileText, label: 'Policies', active: true },
           { icon: Workflow, label: 'Workflows' },
           { icon: MessageSquare, label: 'Acknowledgements' },
           { icon: History, label: 'Audit Logs' },
           { icon: Settings, label: 'Settings' }
         ].map(item => (
           <button 
             key={item.label}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
               item.active ? 'bg-blue-600/5 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-[#091426]'
             }`}
           >
             <item.icon size={18} />
             {item.label}
           </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
         <div className="bg-white px-10 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-[#091426]">Policy Management Center</h2>
            <div className="flex items-center gap-6">
               <div className="relative">
                  <span className="absolute right-0 top-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                  <Workflow size={20} className="text-slate-400" />
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">US</div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-[#091426] leading-none uppercase">John Smith</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Admin</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-10 flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-[#091426]">Policies</h3>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search policies, tags, or authors..." 
                        className="w-80 pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                     />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-[#091426] text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:opacity-90 transition-all">
                     <Plus size={18} /> New Policy
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
               <div className="p-6 border-b border-slate-100 flex gap-4">
                  <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#091426] outline-none shadow-sm min-w-[120px]"><option>Status</option></select>
                  <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#091426] outline-none shadow-sm min-w-[140px]"><option>Department</option></select>
                  <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#091426] outline-none shadow-sm min-w-[140px]"><option>Effective Date</option></select>
                  
                  <div className="ml-auto flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">View Mode</span>
                     <div className="w-12 h-6 bg-slate-100 rounded-full border border-slate-200 relative p-1 cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-blue-600 rounded-full shadow-sm"></div>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-[#fafbfc] border-b border-slate-100">
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                           <th className="p-4 pl-8">Policy</th>
                           <th className="p-4">Version</th>
                           <th className="p-4">Status</th>
                           <th className="p-4">Last Updated</th>
                           <th className="p-4">Acknowledgement</th>
                           <th className="p-4 pr-8">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {POLICIES.map((p, i) => (
                           <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="p-5 pl-8 text-sm font-bold text-[#091426]">{p.name}</td>
                              <td className="p-5 text-sm font-semibold text-slate-500">{p.version}</td>
                              <td className="p-5">
                                 <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                                    p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                    p.status === 'Under Review' ? 'bg-orange-100 text-orange-700' :
                                    p.status === 'Draft' ? 'bg-slate-200 text-slate-600' :
                                    'bg-rose-100 text-rose-700'
                                 }`}>
                                    {p.status}
                                 </span>
                              </td>
                              <td className="p-5 text-sm font-semibold text-slate-500">{p.updated}</td>
                              <td className="p-5">
                                 {p.ack > 0 ? (
                                    <div className="flex flex-col gap-1.5 w-40">
                                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                          <span className="text-[#091426]">{p.ack}% Compliant</span>
                                       </div>
                                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${p.ack === 100 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${p.ack}%` }}></div>
                                       </div>
                                    </div>
                                 ) : (
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">N/A</span>
                                 )}
                              </td>
                              <td className="p-5 pr-8">
                                 <div className="flex items-center gap-4">
                                    {p.actions.map(action => (
                                       <button key={action} className="text-xs font-bold text-blue-600 hover:underline">{action}</button>
                                    ))}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="p-4 px-8 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/30">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white"><ChevronLeft size={16} /></button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-600 bg-blue-600 text-white font-bold text-xs">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white"><ChevronRight size={16} /></button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default PolicyManagementCenter;
