import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  ArrowRight,
  FileBadge,
  AlertCircle,
  Database,
  History,
  ShieldAlert
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { ComplianceService, Policy, Control } from '../services/ComplianceService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../hooks/useToast';
import { SkeletonKanban, SkeletonTable } from './Skeleton';

export const ComplianceHub = () => {
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'LIST' | 'EXCEPTIONS'>('KANBAN');
  const queryClient = useQueryClient();

  const { data: policies = [], isLoading } = useApiQuery(['policies'], () => ComplianceService.getPolicies());

  const updateControlStatusMutation = useMutation({
    mutationFn: ({ controlId, status }: { controlId: string; status: string }) => 
      ComplianceService.updateControlStatus(controlId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Statut du contrôle mis à jour avec succès');
    },
    onError: () => toast.error('Erreur lors de la mise à jour du statut')
  });

  // Aggregate all controls into a flat list for the Kanban/List view
  const allControls = useMemo(() => policies.flatMap(p => p.controls.map(c => ({
    ...c,
    policyTitle: p.title,
    framework: p.framework
  }))), [policies]);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'HIGH': return 'bg-red-50 text-red-600 border-red-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'LOW': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getStatusMap = (status: string) => {
    switch(status) {
      case 'COMPLIANT': return 'CLOSED';
      case 'NON_COMPLIANT': return 'OPEN';
      case 'NOT_TESTED': return 'REVIEW';
      default: return status;
    }
  };

  const statusToPrisma = (displayStatus: string) => {
    switch(displayStatus) {
      case 'CLOSED': return 'COMPLIANT';
      case 'OPEN': return 'NON_COMPLIANT';
      case 'REVIEW': return 'NOT_TESTED';
      case 'IN_PROGRESS': return 'IN_PROGRESS';
      default: return 'NOT_TESTED';
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Header Hub */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance & Remediation Center</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Audit Remediation Workflow</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">Manage structural fixes, corrective actions (CAPA), and multi-quarter initiatives.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('KANBAN')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === 'KANBAN' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Kanban Board
            </button>
            <button 
              onClick={() => setActiveTab('LIST')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === 'LIST' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Database View
            </button>
            <button 
              onClick={() => setActiveTab('EXCEPTIONS')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${activeTab === 'EXCEPTIONS' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Exceptions
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Summary Bento */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Multi-Quarter Initiatives</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                 <FileBadge size={12} /> Verified Recovery Logs
              </div>
           </div>
           
           <div className="space-y-8">
              {[
                { title: 'Tier-1 Data Center Migration', capEx: '$4.2M', progress: 68, label: 'ADT-2023-902' },
                { title: 'Legacy Mainframe Encryption', capEx: '$1.8M', progress: 24, label: 'ADT-2024-011' }
              ].map((init, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{init.title}</h4>
                      <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">Finding ID: {init.label} (CapEx: {init.capEx})</p>
                    </div>
                    <span className="text-[10px] font-black text-blue-600">{init.progress}% COMPLETE</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${init.progress}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#091426] p-6 rounded-xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <FileBadge size={200} className="text-blue-200" />
           </div>
           <div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">CapEx Utilization</h3>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-8">Structural Fix Budgeting</p>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                   <span className="text-[10px] font-black text-slate-400 uppercase">Allocated</span>
                   <span className="text-lg font-black text-white">$12.5M</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                   <span className="text-[10px] font-black text-slate-400 uppercase">Committed</span>
                   <span className="text-lg font-black text-white">$8.9M</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase">Variance</span>
                   <span className="text-lg font-black text-emerald-400">+1.2%</span>
                </div>
              </div>
           </div>
           <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-extrabold text-white uppercase tracking-widest transition-all">
              Analysis Dashboard
           </button>
        </div>
      </div>

      {/* Kanban / List Board */}
      <div className="flex flex-col gap        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Remediation Task Board</h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{allControls.length} Active Controls</span>
           </div>
           <div className="flex gap-2">
              <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><Filter size={16}/></button>
              <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><Search size={16}/></button>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#091426] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-lg shadow-slate-200">
                <Plus size={14} /> New Manual Control
              </button>
           </div>
        </div>

        {isLoading ? (
          activeTab === 'KANBAN' ? <SkeletonKanban /> : <SkeletonTable />
        ) : activeTab === 'KANBAN' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['OPEN', 'IN_PROGRESS', 'REVIEW', 'CLOSED'].map((status) => {
              const items = allControls.filter(c => getStatusMap(c.status) === status);

              return (
              <div key={status} className="flex flex-col gap-4">
                 <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{status} ({items.length})</span>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors"><Plus size={14}/></button>
                 </div>
                 
                 <div className="space-y-4 min-h-[200px]">
                    {items.map((item: any) => (
                      <motion.div 
                        layout
                        key={item.id} 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
                      >
                         <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-tighter ${getPriorityColor(item.framework === 'ISO-27001' ? 'HIGH' : 'MEDIUM')}`}>
                               {item.framework || 'SOC2'}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {['OPEN', 'IN_PROGRESS', 'REVIEW', 'CLOSED'].filter(s => s !== status).map(s => (
                                <button 
                                  key={s} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateControlStatusMutation.mutate({ controlId: item.id, status: statusToPrisma(s) });
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-[8px] font-bold text-slate-400"
                                  title={`Move to ${s}`}
                                >
                                  {s.charAt(0)}
                                </button>
                              ))}
                            </div>
                         </div>
                         <h5 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {item.name}
                         </h5>
                         <p className="text-[10px] text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                         <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                            <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-tighter">{item.id.substring(0, 8)}</span>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                               <Clock size={12} className="text-slate-400" /> {item.frequency || 'ANNUAL'}
                            </div>
                         </div>
                      </motion.div>
                    ))}
                    {items.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center opacity-40">
                         <span className="text-[10px] font-bold text-slate-300 uppercase">Clear Stage</span>
                      </div>
                    )}
                 </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <th className="px-10 py-5">Control ID</th>
                     <th className="px-10 py-5">Control Name</th>
                     <th className="px-10 py-5">Status</th>
                     <th className="px-10 py-5">Framework</th>
                     <th className="px-10 py-5">Frequency</th>
                     <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allControls.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                       <td className="px-10 py-6 font-mono text-[10px] font-bold text-blue-600">0x{item.id.substring(0, 8)}</td>
                       <td className="px-10 py-6">
                         <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</span>
                           <span className="text-[9px] text-slate-400 uppercase font-bold">{item.policyTitle}</span>
                         </div>
                       </td>
                       <td className="px-10 py-6">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            item.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            item.status === 'NON_COMPLIANT' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {item.status}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase">{item.framework}</td>
                       <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.frequency}</td>
                       <td className="px-10 py-6 text-right">
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-all inline-block" />
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        ) : (
    )}

        {activeTab === 'EXCEPTIONS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 italic">Regulatory Derogations</h3>
                <p className="text-sm text-slate-500 mb-8">Management of approved temporary deviations from standard compliance protocols due to operational constraints.</p>
                
                <div className="space-y-4">
                   {[
                     { id: 'EXC-001', label: 'EPI Variance (High Heat)', status: 'APPROVED', expiry: '2024-08-01' },
                     { id: 'EXC-004', label: 'Network Isolation Bypass (Legacy Migration)', status: 'EXPIRING', expiry: '2024-05-10' }
                   ].map(exc => (
                     <div key={exc.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg flex justify-between items-center group hover:bg-slate-50 transition-all">
                        <div>
                           <span className="text-[9px] font-mono font-bold text-blue-600">{exc.id}</span>
                           <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{exc.label}</h5>
                        </div>
                        <div className="text-right">
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded ${exc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{exc.status}</span>
                           <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Expires {exc.expiry}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <Plus size={24} className="text-blue-600" />
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">New Exception Request</h4>
                <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Requires Digital Signature from Regional Safety Officer.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
