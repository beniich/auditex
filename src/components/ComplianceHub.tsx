import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ShieldAlert,
  LayoutGrid,
  List,
  Fingerprint,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Download,
  Activity,
  FileSearch,
  BookOpen,
  Gavel,
  ShieldCheck
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { ComplianceService, Policy, Control } from '../services/ComplianceService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../hooks/useToast';
import { SkeletonKanban, SkeletonTable } from './Skeleton';

export const ComplianceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'LIST' | 'EXCEPTIONS'>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: policies = [], isLoading } = useApiQuery(
    ['policies'], 
    () => ComplianceService.getPolicies(),
    { refetchInterval: 30000 }
  );

  const updateControlStatusMutation = useMutation({
    mutationFn: ({ controlId, status }: { controlId: string; status: string }) => 
      ComplianceService.updateControlStatus(controlId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Control status updated successfully.', 'Compliance Hub');
    },
    onError: () => toast.error('Failed to update control status.', 'Error')
  });

  const allControls = useMemo(() => policies.flatMap(p => p.controls.map(c => ({
    ...c,
    policyTitle: p.title,
    framework: p.framework
  }))), [policies]);

  const filteredControls = allControls.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.policyTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: allControls.length,
    compliant: allControls.filter(c => c.status === 'COMPLIANT').length,
    nonCompliant: allControls.filter(c => c.status === 'NON_COMPLIANT').length,
    notTested: allControls.filter(c => c.status === 'NOT_TESTED').length,
    criticalGaps: allControls.filter(c => c.status === 'NON_COMPLIANT' && c.framework === 'ISO-27001').length
  };

  const getStatusMap = (status: string) => {
    switch(status) {
      case 'COMPLIANT': return 'CLOSED';
      case 'NON_COMPLIANT': return 'OPEN';
      case 'NOT_TESTED': return 'REVIEW';
      case 'IN_PROGRESS': return 'IN_PROGRESS';
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

  const getPriorityColor = (framework: string) => {
    if (framework?.includes('ISO')) return 'text-red-600 bg-red-50 border-red-100';
    if (framework?.includes('SOC')) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-slate-500 bg-slate-50 border-slate-100';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1700px] mx-auto space-y-10">
        
        {/* Hub Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end bg-white border border-slate-200 p-8 lg:p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
             <LayoutGrid size={150} />
          </div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShieldAlert size={12} className="text-blue-400" /> Compliance_Engine v3.8
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-slate-200">
                 {stats.compliant}/{stats.total} CONTROLS VALIDATED
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Compliance & Logic Hub</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Structural oversight of framework alignment, automated control validation, and cross-jurisdictional compliance mapping. Optimized for SOC 2 Type II and ISO 27001 industrial certification.
            </p>
          </div>

          <div className="flex gap-4 mt-8 xl:mt-0 relative z-10">
             <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner">
                <button 
                  onClick={() => setActiveTab('KANBAN')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'KANBAN' ? 'bg-white text-[#091426] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                  <LayoutGrid size={14} /> Kanban
                </button>
                <button 
                  onClick={() => setActiveTab('LIST')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'LIST' ? 'bg-white text-[#091426] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                  <List size={14} /> Database
                </button>
                <button 
                  onClick={() => setActiveTab('EXCEPTIONS')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'EXCEPTIONS' ? 'bg-white text-[#091426] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                  <AlertCircle size={14} /> Exceptions
                </button>
             </div>
          </div>
        </div>

        {/* Strategic Dashboard Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: 'Compliance Index', val: `${Math.round((stats.compliant/stats.total || 0) * 100)}%`, detail: '+2.4% vs 30d', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
             { label: 'Critical Gaps', val: stats.criticalGaps || 0, detail: 'ISO-27001 Scope', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
             { label: 'Evidence Vault', val: (stats.total * 3.2).toFixed(0), detail: 'Objects Anchored', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Audit Velocity', val: '4.2d', detail: 'Validation Latency', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' },
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <stat.icon size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                   <p className="text-3xl font-black text-[#091426] mt-1 tracking-tighter">{stat.val}</p>
                   <p className={`text-[10px] font-bold mt-2 ${stat.color}`}>{stat.detail}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Board Search & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="relative group w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search controls, frameworks or policies..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-[#091426] outline-none shadow-sm focus:ring-4 focus:ring-blue-50 transition-all font-sans"
              />
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-[#091426] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-blue-200 transition-all">
                 <Filter size={16} /> Advanced Filter
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all">
                 <Plus size={16} /> Deploy Custom Control
              </button>
           </div>
        </div>

        {/* Main View Area */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="grid grid-cols-1 md:grid-cols-4 gap-8"
            >
               <SkeletonKanban />
            </motion.div>
          ) : activeTab === 'KANBAN' ? (
            <motion.div 
              key="kanban"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {['OPEN', 'IN_PROGRESS', 'REVIEW', 'CLOSED'].map((columnLabel) => {
                const columnItems = filteredControls.filter(c => getStatusMap(c.status) === columnLabel);
                return (
                  <div key={columnLabel} className="space-y-6">
                     <div className="px-6 py-3 bg-white border border-slate-200 rounded-[1.5rem] flex justify-between items-center shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{columnLabel} <span className="text-blue-500">[{columnItems.length}]</span></span>
                        <MoreHorizontal size={14} className="text-slate-300 cursor-pointer" />
                     </div>
                     
                     <div className="space-y-6 min-h-[600px]">
                        {columnItems.map((item: any) => (
                          <motion.div 
                            layoutId={item.id}
                            key={item.id}
                            className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer group relative overflow-hidden"
                          >
                             <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-colors ${getPriorityColor(item.framework)}`}>
                                   {item.framework || 'SOC2'}
                                </span>
                                <div className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Zap size={14} className="text-blue-400" />
                                </div>
                             </div>
                             
                             <h5 className="text-sm font-black text-[#091426] leading-tight mb-3 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                {item.name}
                             </h5>
                             <p className="text-[10px] font-bold text-slate-400 mb-6 line-clamp-2 italic">
                                Policy: {item.policyTitle?.toUpperCase()}
                             </p>
                             
                             <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="text-[9px] font-mono font-black text-slate-300 tracking-widest leading-none">ID: {item.id.substring(0, 8)}</span>
                                <div className="flex -space-x-2">
                                   <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[7px] font-black text-slate-400">AJ</div>
                                   <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[7px] font-black text-blue-600">RT</div>
                                </div>
                             </div>
                             
                             {/* Floating Quick Action Overlay */}
                             <div className="absolute inset-0 bg-[#091426]/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-8 text-center text-white scale-95 group-hover:scale-100 duration-300">
                                <h6 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Logic_Transition</h6>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                   {['OPEN', 'IN_PROGRESS', 'REVIEW', 'CLOSED'].filter(s => s !== columnLabel).map(s => (
                                     <button 
                                       key={s}
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          updateControlStatusMutation.mutate({ controlId: item.id, status: statusToPrisma(s) });
                                       }}
                                       className="py-2.5 bg-white/10 hover:bg-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:text-[#091426] transition-all border border-white/10"
                                     >
                                        to {s}
                                     </button>
                                   ))}
                                </div>
                                <button className="mt-6 text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-1.5"><FileSearch size={12} /> View Evidence</button>
                             </div>
                          </motion.div>
                        ))}
                        {columnItems.length === 0 && (
                          <div className="h-32 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center bg-slate-50/30">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Cleared_Stage</span>
                          </div>
                        )}
                     </div>
                  </div>
                );
              })}
            </motion.div>
          ) : activeTab === 'LIST' ? (
            <motion.div 
               key="list"
               initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm"
            >
               <table className="w-full text-left">
                  <thead className="bg-[#091426] text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                     <tr>
                        <th className="px-10 py-8">Ledger ID</th>
                        <th className="px-10 py-8">Structural Control</th>
                        <th className="px-10 py-8">Validation State</th>
                        <th className="px-10 py-8">Framework Hub</th>
                        <th className="px-10 py-8">Cycle</th>
                        <th className="px-10 py-8 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredControls.map((item: any) => (
                       <tr key={item.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                          <td className="px-10 py-8 font-mono text-[10px] font-black text-blue-600">0x{item.id.substring(0, 8)}</td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-[#091426] uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Policy: {item.policyTitle}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                   item.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                   item.status === 'NON_COMPLIANT' ? 'bg-red-50 text-red-600 border-red-100' :
                                   'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                 {item.status}
                                </span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getPriorityColor(item.framework)}`}>
                                {item.framework}
                             </span>
                          </td>
                          <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.frequency || 'ANNUAL'}</td>
                          <td className="px-10 py-8 text-right">
                             <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                <ChevronRight size={18} />
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </motion.div>
          ) : (
            <motion.div 
               key="exceptions"
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="grid grid-cols-12 gap-8"
            >
               <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm space-y-8">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3"><Gavel size={18} className="text-blue-600" /> Regulatory Derogations</h3>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2 Active Deviations</span>
                  </div>
                  
                  <div className="space-y-6">
                     {[
                       { id: 'EXC-001', label: 'EPI Variance (High Heat Zone Delta)', status: 'APPROVED', expiry: '2024-08-01', risk: 'LOW' },
                       { id: 'EXC-004', label: 'Legacy Network Bypass Cluster B', status: 'EXPIRING', expiry: '2024-05-10', risk: 'MEDIUM' }
                     ].map(exc => (
                       <div key={exc.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                <FileSearch size={22} />
                             </div>
                             <div>
                                <span className="text-[10px] font-mono font-black text-blue-600 tracking-widest uppercase">#{exc.id}</span>
                                <h5 className="text-sm font-black text-[#091426] uppercase mt-1">{exc.label}</h5>
                             </div>
                          </div>
                          <div className="flex items-center gap-8 mt-6 md:mt-0">
                             <div className="text-right">
                                <span className={`text-[8px] font-black px-4 py-1 rounded-lg uppercase tracking-widest border ${exc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{exc.status}</span>
                                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Expires {exc.expiry}</p>
                             </div>
                             <ChevronRight size={20} className="text-slate-300 group-hover:text-[#091426] transition-colors" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="bg-[#091426] p-10 rounded-[3rem] text-white overflow-hidden relative group">
                     <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                     <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-10">Exception Request Protocol</h4>
                     <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">1</div>
                           <p className="text-[11px] font-bold uppercase tracking-tight text-slate-300">Submit Risk Justification</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">2</div>
                           <p className="text-[11px] font-bold uppercase tracking-tight text-slate-300">DSO Binary Approval</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">3</div>
                           <p className="text-[11px] font-bold uppercase tracking-tight text-slate-300">Anchoring in Ledger</p>
                        </div>
                     </div>
                     <button className="mt-12 w-full py-5 bg-white text-[#091426] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                        Initiate Request <Plus size={14} />
                     </button>
                  </div>

                  <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm group">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><BookOpen size={16} className="text-blue-600" /> Policy Links</h3>
                     <div className="space-y-4">
                        {['Standard_Op_Proc_v4', 'Risk_Threshold_Index', 'Legal_Derogation_Matrix'].map((p, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-black text-[#091426] uppercase hover:text-blue-600 transition-colors cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                             <span>{p}</span>
                             <Download size={14} className="text-slate-300" />
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technical Footer Strip */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
           <p className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-[#091426]" /> 
              Compliance_State: STABLE // Frameworks: SOC2_T2, ISO27001
           </p>
           <p className="text-[#091426] flex items-center gap-2">
              <Globe size={12} className="fill-current text-blue-600" /> Distributed Logic Validation Active
           </p>
           <p>Last Pulse: {new Date().toLocaleTimeString()} UTC</p>
        </div>
      </div>
    </div>
  );
};
