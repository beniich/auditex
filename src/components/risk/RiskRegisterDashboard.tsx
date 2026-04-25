import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, BrainCircuit, Loader2 } from 'lucide-react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { RiskService } from '../../services/RiskService';

export const RiskRegisterDashboard = () => {
  const { data: risks, isLoading } = useApiQuery(['risks/register'], () => RiskService.getRegister());

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4 border-b border-slate-200">
         <h2 className="text-2xl font-black text-[#091426]">Risk Register Dashboard</h2>
      </div>

      <div className="p-6 flex-1 flex flex-col">
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
               <div className="flex gap-4">
                  <div className="relative">
                     <select className="appearance-none bg-white border border-slate-200 text-sm font-medium rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#091426]">
                        <option>All Risk Categories</option>
                        <option>Cybersecurity</option>
                        <option>Compliance</option>
                        <option>Financial</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
               </div>
               
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search Risks" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400" />
               </div>
            </div>

            <div className="flex-1 overflow-auto">
               {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                     <Loader2 className="animate-spin text-blue-600" size={48} />
                  </div>
               ) : (
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 text-[#091426] text-sm font-bold tracking-tight">
                           <th className="p-4 pl-6 border-b border-slate-200 font-bold">Risk Description</th>
                           <th className="p-4 border-b border-slate-200 font-bold text-center">Probability</th>
                           <th className="p-4 border-b border-slate-200 font-bold text-center">Impact Score</th>
                           <th className="p-4 border-b border-slate-200 font-bold">Status</th>
                           <th className="p-4 border-b border-slate-200 font-bold pr-6">AI Insights</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {risks?.map(risk => (
                           <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-5 pl-6">
                                 <span className="text-sm font-bold text-[#091426] block w-64">{risk.description}</span>
                                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {risk.reference || 'RISK-'+risk.id.slice(0,4)}</span>
                              </td>
                              <td className="p-5">
                                 <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-black text-[#091426]">{risk.probability || 0}%</span>
                                    <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                       <div 
                                          className={`h-full rounded-full ${
                                             risk.probability > 70 ? 'bg-rose-500' :
                                             risk.probability > 40 ? 'bg-orange-500' :
                                             'bg-emerald-500'
                                          }`}
                                          style={{ width: `${risk.probability}%` }}
                                       ></div>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-5 text-center">
                                 <span className="text-sm font-black text-[#091426]">{risk.impact || 'N/A'}</span>
                              </td>
                              <td className="p-5">
                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    risk.remediationStatus === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    risk.remediationStatus === 'OPEN' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                                 }`}>
                                    {risk.remediationStatus}
                                 </span>
                              </td>
                              <td className="p-5 pr-6 w-[400px]">
                                 <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-[#091426] rounded-xl flex items-center justify-center flex-shrink-0">
                                       <BrainCircuit className="text-blue-400" size={20} />
                                    </div>
                                    <p className="text-[12px] font-medium text-[#091426] leading-snug">
                                       {risk.aiRecommendation || 'No recommendation available yet.'}
                                    </p>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
            
            <div className="p-4 pl-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 text-[#091426]">
               <span className="text-sm font-medium text-slate-500">Showing {risks?.length || 0} risks</span>
            </div>
         </div>
      </div>
    </div>
  );
};
export default RiskRegisterDashboard;
