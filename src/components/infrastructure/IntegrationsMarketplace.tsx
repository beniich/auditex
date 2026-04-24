import React from 'react';
import { Search, Settings, Cloud, Database, ExternalLink, ChevronLeft, ChevronRight, Activity, AlertCircle, RefreshCw } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    desc: 'Securely ingest log data and manage cloud resources.',
    status: 'Real-time',
    statusType: 'success',
    color: 'bg-orange-500',
    actionLabel: 'Active',
    actionType: 'active'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    desc: 'Integrate with Azure services for comprehensive monitoring.',
    status: 'Connecting...',
    statusType: 'warning',
    color: 'bg-blue-500',
    actionLabel: 'Connect',
    actionType: 'primary'
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    desc: 'Centralize compliance data across Google platforms.',
    status: 'Daily Sync',
    statusType: 'success',
    color: 'bg-red-500',
    actionLabel: 'Connect',
    actionType: 'primary'
  },
  {
    id: 'sap',
    name: 'SAP ERP',
    desc: 'Streamline financial data for real-time risk analysis.',
    status: 'Error',
    statusType: 'danger',
    color: 'bg-blue-800',
    actionLabel: 'Troubleshoot',
    actionType: 'danger'
  }
];

const IntegrationCard = ({ item }: { item: any }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <button className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
      <Settings size={18} />
    </button>
    
    <div className="flex items-center gap-4 mb-6">
       <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
          {item.id === 'sap' ? <Database size={28} /> : <Cloud size={28} />}
       </div>
    </div>

    <h4 className="text-lg font-black text-[#091426] mb-2">{item.name}</h4>
    <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">{item.desc}</p>

    <div className="mt-auto flex items-center justify-between">
       <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex flex-col">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Data Stream Status</span>
          <div className="flex items-center gap-2">
             {item.statusType === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
             {item.statusType === 'warning' && <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>}
             {item.statusType === 'danger' && <div className="w-2 h-2 rounded-full bg-rose-500"></div>}
             <span className="text-xs font-bold text-[#091426]">{item.status}</span>
          </div>
       </div>

       <button className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
          item.actionType === 'active' ? 'bg-blue-600/10 text-blue-600 shadow-blue-500/5' :
          item.actionType === 'danger' ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600' :
          'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'
       }`}>
          {item.actionLabel}
       </button>
    </div>
  </div>
);

export const IntegrationsMarketplace = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white px-12 py-10 border-b border-slate-200">
         <h2 className="text-3xl font-black text-[#091426] tracking-tight">Integrations Marketplace</h2>
         <p className="text-slate-500 font-medium mt-1">Connect your systems for unified compliance and risk data.</p>
         
         <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
               type="text" 
               placeholder="Search integrations..." 
               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all shadow-inner"
            />
         </div>
      </div>

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12 max-w-6xl">
            {INTEGRATIONS.map(item => <IntegrationCard key={item.id} item={item} />)}
         </div>

         <div className="flex items-center justify-between border-t border-slate-200 pt-8 mt-12 max-w-6xl">
            <span className="text-sm font-bold text-slate-400">Showing 1-4 of 12 integrations</span>
            <div className="flex items-center gap-2">
               <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-blue-600 transition-all"><ChevronLeft size={20} /></button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-blue-600 bg-white text-blue-600 font-bold text-sm shadow-lg shadow-blue-500/5">1</button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-blue-600 font-bold text-sm transition-all">2</button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-blue-600 font-bold text-sm transition-all">3</button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-blue-600 transition-all"><ChevronRight size={20} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};
export default IntegrationsMarketplace;
