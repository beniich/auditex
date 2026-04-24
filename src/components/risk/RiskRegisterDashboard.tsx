import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react';

const RISKS_DATA = [
  {
    id: 1,
    description: 'Cybersecurity breach via unpatched API',
    probabilityText: 'High',
    probabilityValue: 90,
    impact: '$1,500,000',
    status: 'In Progress',
    insight: 'Anomaly detected in API traffic patterns. Patch recommended immediately.'
  },
  {
    id: 2,
    description: 'Regulatory non-compliance (GDPR)',
    probabilityText: 'Medium',
    probabilityValue: 50,
    impact: '$450,000',
    status: 'Open',
    insight: 'Recent regulation update may impact current data handling. Review policy.'
  },
  {
    id: 3,
    description: 'Third-party vendor failure (Cloud Provider)',
    probabilityText: 'Low',
    probabilityValue: 20,
    impact: '$100,000',
    status: 'Mitigated',
    insight: 'Vendor reliability score stable. Redundancy plan active.'
  },
  {
    id: 4,
    description: 'Internal fraud risk (Accounting)',
    probabilityText: 'Medium',
    probabilityValue: 40,
    impact: '$75,000',
    status: 'In Progress',
    insight: 'Unusual transaction activity flagged for review.'
  }
];

export const RiskRegisterDashboard = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4 border-b border-slate-200">
         <h2 className="text-2xl font-black text-[#091426]">Risk Register Dashboard</h2>
      </div>

      <div className="p-6">
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
               <div className="flex gap-4">
                  <div className="relative">
                     <select className="appearance-none bg-white border border-slate-200 text-sm font-medium rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#091426]">
                        <option>Risk Type</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                  <div className="relative">
                     <select className="appearance-none bg-white border border-slate-200 text-sm font-medium rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#091426]">
                        <option>Status</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                  <div className="relative">
                     <select className="appearance-none bg-white border border-slate-200 text-sm font-medium rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#091426]">
                        <option>Owner</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
               </div>
               
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search Risks" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400" />
               </div>
            </div>

            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 text-[#091426] text-sm font-bold tracking-tight">
                     <th className="p-4 pl-6 border-b border-slate-200 font-bold">Risk Description</th>
                     <th className="p-4 border-b border-slate-200 font-bold">Probability</th>
                     <th className="p-4 border-b border-slate-200 font-bold">Impact ($)</th>
                     <th className="p-4 border-b border-slate-200 font-bold">Remediation Status</th>
                     <th className="p-4 border-b border-slate-200 font-bold pr-6">AI Insights</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {RISKS_DATA.map(risk => (
                     <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 pl-6">
                           <span className="text-[15px] font-medium text-[#091426] block w-64">{risk.description}</span>
                        </td>
                        <td className="p-5">
                           <div className="flex items-center gap-3 w-40">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                 risk.probabilityText === 'High' ? 'bg-rose-100 text-rose-700' :
                                 risk.probabilityText === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                 'bg-emerald-100 text-emerald-700'
                              }`}>
                                 {risk.probabilityText}
                              </span>
                              <div className="flex-1 flex flex-col gap-1.5">
                                 <span className="text-sm font-bold text-[#091426] text-right">{risk.probabilityValue}%</span>
                                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                       className={`h-full rounded-full ${
                                          risk.probabilityText === 'High' ? 'bg-rose-500' :
                                          risk.probabilityText === 'Medium' ? 'bg-orange-500' :
                                          'bg-emerald-500'
                                       }`}
                                       style={{ width: `${risk.probabilityValue}%` }}
                                    ></div>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="p-5">
                           <span className="text-[15px] font-bold text-[#091426]">{risk.impact}</span>
                        </td>
                        <td className="p-5">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                              risk.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              risk.status === 'Open' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                           }`}>
                              {risk.status === 'In Progress' ? <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 block"></span> :
                               risk.status === 'Open' ? <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block animate-pulse"></span> :
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>}
                              {risk.status}
                           </span>
                        </td>
                        <td className="p-5 pr-6 w-[400px]">
                           <div className="flex gap-3">
                              <div className="w-12 h-12 bg-[#091426] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/10">
                                 <BrainCircuit className="text-blue-400" size={24} />
                              </div>
                              <p className="text-sm font-medium text-[#091426] leading-snug">
                                 <strong className="font-bold">AI Analysis:</strong> {risk.insight} <a href="#" className="text-blue-600 hover:underline">(Click for detail)</a>
                              </p>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            
            <div className="p-4 pl-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 text-[#091426]">
               <span className="text-sm font-medium text-slate-500">Showing 1-4 of 126 risks</span>
               <div className="flex items-center gap-1">
                  <button className="p-1 text-slate-400 hover:text-[#091426]"><ChevronLeft size={16} /></button>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-bold text-blue-600">1</span>
                  <span className="px-3 py-1 hover:bg-slate-100 rounded text-sm font-medium text-slate-600">2</span>
                  <span className="px-3 py-1 hover:bg-slate-100 rounded text-sm font-medium text-slate-600">3</span>
                  <span className="px-3 py-1 text-sm font-medium text-slate-600">...</span>
                  <span className="px-3 py-1 hover:bg-slate-100 rounded text-sm font-medium text-slate-600">10</span>
                  <button className="p-1 text-slate-400 hover:text-[#091426]"><ChevronRight size={16} /></button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default RiskRegisterDashboard;
