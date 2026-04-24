import React, { useState } from 'react';
import { Search, MoreHorizontal, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const ASSETS_DATA = [
  { id: 1, name: 'Server-Rack-A1', type: 'Hardware', risk: 'Critical', lastSeen: '10 mins ago', owner: 'IT Dept', status: 'Active' },
  { id: 2, name: 'AWS S3 Bucket: finance-logs', type: 'Cloud Resource', risk: 'High Risk', lastSeen: '1 hour ago', owner: 'Finance', status: '' },
  { id: 3, name: 'Adobe Creative Cloud License', type: 'Software', risk: 'Low Risk', lastSeen: 'Yesterday', owner: 'Marketing', status: 'Active' },
  { id: 4, name: 'Corporate Bank Account (Chase)', type: 'Financial Account', risk: 'Medium Risk', lastSeen: '2 days ago', owner: 'Finance', status: '' },
  { id: 5, name: 'Laptop-Surface-Pro-7', type: 'Hardware', risk: 'None', lastSeen: '3 days ago', owner: 'John Doe', status: 'Active' },
  { id: 6, name: 'Firewall-FortiGate', type: 'Hardware', risk: 'Critical', lastSeen: '5 mins ago', owner: 'IT Dept', status: '' },
  { id: 7, name: 'Zendesk Instance', type: 'Cloud Resource', risk: 'Low Risk', lastSeen: '4 hours ago', owner: 'Operations', status: 'Active' },
  { id: 8, name: 'Stripe Account', type: 'Financial Account', risk: 'High Risk', lastSeen: 'Today', owner: 'Finance', status: '' },
  { id: 9, name: 'Google Workspace Subscription', type: 'Software', risk: 'None', lastSeen: 'Yesterday', owner: 'IT Dept', status: 'Active' },
  { id: 10, name: 'Router-Cisco-4331', type: 'Hardware', risk: 'Medium Risk', lastSeen: '2 hours ago', owner: 'IT Dept', status: '' }
];

export const DiscoveryCenter = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4">
         <h2 className="text-2xl font-black text-[#091426]">Asset Discovery Center</h2>
         <div className="flex justify-between items-center mt-1">
            <p className="text-sm font-medium text-slate-500">Automatically discovered IT and financial assets across your organization.</p>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"><MoreHorizontal size={18} /></button>
               <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors">Discover Assets</button>
            </div>
         </div>
      </div>

      <div className="flex flex-1 p-6 gap-6 h-[calc(100%-100px)]">
         {/* Filters Sidebar */}
         <div className="w-64 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-[#091426]">Filters</h3>

            <div className="mb-6">
               <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Asset Type</h4>
               <div className="space-y-2">
                  {['Hardware', 'Software', 'Cloud Resource', 'Financial Account', 'License'].map(type => (
                     <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-[#091426]">{type}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="mb-6">
               <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Risk Level</h4>
               <select className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm font-medium text-[#091426] outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                  <option>None</option>
               </select>
            </div>

            <div className="mb-6">
               <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Owner</h4>
               <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" placeholder="Find owner" className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20" />
               </div>
               <div className="space-y-2">
                  {['IT Dept', 'Finance', 'Marketing', 'Operations'].map(owner => (
                     <label key={owner} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-[#091426]">{owner}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="mb-6">
               <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Discovery Source</h4>
               <div className="space-y-2">
                  {['Network Scan', 'API Integration', 'Manual Input'].map(src => (
                     <label key={src} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-[#091426]">{src}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="mt-auto">
               <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg transition-colors text-sm">Clear All Filters</button>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 flex flex-col">
            <div className="flex gap-4 mb-4 items-center">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                     type="text" 
                     placeholder="Search assets, owners, or types" 
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  />
               </div>
               <button className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors whitespace-nowrap">Discover Assets</button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 flex-1 flex flex-col shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-[#091426]">Discovered Assets (1,245 Total)</h3>
               </div>
               <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                           <th className="p-4 pl-6 border-b border-slate-200 w-12"><input type="checkbox" className="rounded" /></th>
                           <th className="p-4 border-b border-slate-200">Asset Name</th>
                           <th className="p-4 border-b border-slate-200">Type</th>
                           <th className="p-4 border-b border-slate-200">Risk Level</th>
                           <th className="p-4 border-b border-slate-200">Last Seen</th>
                           <th className="p-4 border-b border-slate-200">Owner</th>
                           <th className="p-4 border-b border-slate-200">Status</th>
                           <th className="p-4 border-b border-slate-200 pr-6 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {ASSETS_DATA.map(asset => (
                           <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 pl-6"><input type="checkbox" className="rounded border-slate-300" /></td>
                              <td className="p-4 font-bold text-sm text-[#091426]">{asset.name}</td>
                              <td className="p-4 text-sm font-medium text-slate-600">{asset.type}</td>
                              <td className="p-4">
                                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                    asset.risk === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                    asset.risk === 'High Risk' ? 'bg-orange-100 text-orange-700' :
                                    asset.risk === 'Medium Risk' ? 'bg-yellow-100 text-yellow-700' :
                                    asset.risk === 'Low Risk' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-slate-100 text-slate-600'
                                 }`}>
                                    {asset.risk}
                                 </span>
                              </td>
                              <td className="p-4 text-sm font-medium text-slate-500">{asset.lastSeen}</td>
                              <td className="p-4 text-sm font-medium text-[#091426]">{asset.owner}</td>
                              <td className="p-4">
                                 {asset.status && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                       {asset.status}
                                    </span>
                                 )}
                              </td>
                              <td className="p-4 pr-6 text-right">
                                 <button className="p-2 text-slate-400 hover:text-[#091426] transition-colors"><MoreHorizontal size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-500">Showing 1-10 of 1245</span>
                  <div className="flex items-center gap-1">
                     <button className="p-1 text-slate-400 hover:text-[#091426]"><ChevronLeft size={16} /></button>
                     <span className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-bold text-blue-600">1</span>
                     <span className="px-3 py-1 hover:bg-slate-100 rounded text-sm font-medium text-slate-600">2</span>
                     <span className="px-3 py-1 hover:bg-slate-100 rounded text-sm font-medium text-slate-600">3</span>
                     <span className="px-3 py-1 text-sm font-medium text-slate-600">...</span>
                     <span className="px-3 py-1 hover:bg-slate-100 rounded text-sm font-medium text-slate-600">50</span>
                     <button className="p-1 text-slate-400 hover:text-[#091426]"><ChevronRight size={16} /></button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default DiscoveryCenter;
