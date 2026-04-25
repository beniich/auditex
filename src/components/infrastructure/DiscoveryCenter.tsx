import React, { useState } from 'react';
import { Search, MoreHorizontal, Filter, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { InfrastructureService, NetworkNode } from '../../services/InfrastructureService';
import { toast } from '../../hooks/useToast';

export const DiscoveryCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const { data: nodes, isLoading, refetch } = useApiQuery(['infrastructure/nodes'], () => InfrastructureService.getNodes());

  const handleDiscover = async () => {
    setIsDiscovering(true);
    try {
      const result = await InfrastructureService.discover();
      toast.success(`${result.count} new assets discovered and registered.`, 'Discovery Complete');
      refetch();
    } catch (e) {
      toast.error('Automated discovery failed. Check network connectivity.', 'Scan Error');
    } finally {
      setIsDiscovering(false);
    }
  };

  const filteredNodes = nodes?.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4">
         <h2 className="text-2xl font-black text-[#091426]">Asset Discovery Center</h2>
         <div className="flex justify-between items-center mt-1">
            <p className="text-sm font-medium text-slate-500">Automatically discovered IT and financial assets across your organization.</p>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"><MoreHorizontal size={18} /></button>
               <button 
                  onClick={handleDiscover}
                  disabled={isDiscovering}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
               >
                  {isDiscovering ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {isDiscovering ? 'Scanning...' : 'Discover Assets'}
               </button>
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
                  {['VIRTUAL_MACHINE', 'DATABASE', 'KUBERNETES_CLUSTER', 'API_GATEWAY', 'FIREWALL'].map(type => (
                     <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#091426] uppercase tracking-wider">{type.replace('_', ' ')}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="mb-6">
               <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Region</h4>
               <select className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm font-medium text-[#091426] outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>All Regions</option>
                  <option>EU-West</option>
                  <option>US-East</option>
                  <option>APAC-South</option>
               </select>
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
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  />
               </div>
               <button 
                  onClick={handleDiscover}
                  disabled={isDiscovering}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors whitespace-nowrap"
               >
                  {isDiscovering ? 'Scanning Network...' : 'Quick Scan'}
               </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 flex-1 flex flex-col shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-[#091426]">Discovered Assets ({filteredNodes.length} Total)</h3>
               </div>
               <div className="flex-1 overflow-auto">
                  {isLoading ? (
                     <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                     </div>
                  ) : (
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                              <th className="p-4 pl-6 border-b border-slate-200">Asset Name</th>
                              <th className="p-4 border-b border-slate-200">Type</th>
                              <th className="p-4 border-b border-slate-200">Region</th>
                              <th className="p-4 border-b border-slate-200">IP Address</th>
                              <th className="p-4 border-b border-slate-200">Status</th>
                              <th className="p-4 border-b border-slate-200 pr-6 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {filteredNodes.map((node: NetworkNode) => (
                              <tr key={node.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="p-4 pl-6 font-bold text-sm text-[#091426]">{node.name}</td>
                                 <td className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{node.type}</td>
                                 <td className="p-4 text-sm font-medium text-slate-600">{node.region}</td>
                                 <td className="p-4 text-sm font-mono text-slate-400">{node.ipAddress || 'Scanning...'}</td>
                                 <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                       node.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600' :
                                       node.status === 'DEGRADED' ? 'bg-yellow-50 text-yellow-600' :
                                       'bg-rose-50 text-rose-600'
                                    }`}>
                                       {node.status}
                                    </span>
                                 </td>
                                 <td className="p-4 pr-6 text-right">
                                    <button className="p-2 text-slate-400 hover:text-[#091426] transition-colors"><MoreHorizontal size={16} /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default DiscoveryCenter;

export default DiscoveryCenter;
