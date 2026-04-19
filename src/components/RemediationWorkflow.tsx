import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Workflow, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  History, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  LayoutGrid,
  ScrollText,
  AlertCircle
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { IncidentService, Incident, CAPATask } from '../services/IncidentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../hooks/useToast';
import { SkeletonCard } from './Skeleton';

const RemediationWorkflow: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'KANBAN' | 'CAPEX'>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: incidents = [], isLoading } = useApiQuery(
    ['incidents'],
    () => IncidentService.getIncidents(),
    { refetchInterval: 15000 }
  );

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) => 
      IncidentService.updateTask(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast.success('Task status updated.', { title: 'Remediation' });
    },
    onError: () => toast.error('Failed to update task.', { title: 'Error' })
  });

  const allTasks = incidents.flatMap(i => i.tasks.map(t => ({ ...t, incidentTitle: i.title, severity: i.severity })));
  
  const filteredTasks = allTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.incidentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByStatus = {
    TODO: filteredTasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
    REVIEW: filteredTasks.filter(t => t.status === 'REVIEW' || t.status === 'INVESTIGATING' as any),
    DONE: filteredTasks.filter(t => t.status === 'DONE' || t.status === 'RESOLVED' as any),
  };

  const stats = {
    total: allTasks.length,
    todo: tasksByStatus.TODO.length,
    inProgress: tasksByStatus.IN_PROGRESS.length,
    review: tasksByStatus.REVIEW.length,
    done: tasksByStatus.DONE.length,
    criticalIncidents: incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length
  };

  const handleStatusChange = (taskId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      'TODO': 'IN_PROGRESS',
      'IN_PROGRESS': 'REVIEW',
      'REVIEW': 'DONE',
      'DONE': 'TODO'
    };
    updateTaskMutation.mutate({ taskId, status: nextStatusMap[currentStatus] || 'TODO' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white border border-slate-200 p-8 lg:p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                 <Workflow size={12} className="text-blue-400" /> CAPA_Lifecycle v2.5
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                 {incidents.length} ACTIVE INCIDENTS
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Remediation Engine</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Structural resolution hub for multi-quarter initiatives and Corrective Actions (CAPA). Bridging finding resolution with real-time incident telemetry.
            </p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0 relative z-10 font-mono text-[9px] font-black uppercase tracking-widest">
             <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                <button 
                  onClick={() => setActiveView('OVERVIEW')}
                  className={`px-5 py-2.5 rounded-lg transition-all ${activeView === 'OVERVIEW' ? 'bg-white text-[#091426] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  Overview
                </button>
                <button 
                  onClick={() => setActiveView('KANBAN')}
                  className={`px-5 py-2.5 rounded-lg transition-all ${activeView === 'KANBAN' ? 'bg-white text-[#091426] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  Kanban
                </button>
                <button 
                  onClick={() => setActiveView('CAPEX')}
                  className={`px-5 py-2.5 rounded-lg transition-all ${activeView === 'CAPEX' ? 'bg-white text-[#091426] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  CapEx Projection
                </button>
             </div>
          </div>
        </div>

        {activeView === 'OVERVIEW' && (
          <div className="grid grid-cols-12 gap-8">
             <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm space-y-10">
                <div className="p-10 -m-10 bg-slate-50/50 rounded-t-[3rem] border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.25em] flex items-center gap-3">
                    <TrendingUp size={16} className="text-blue-600" /> Resolution Velocity
                  </h3>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{stats.done}/{stats.total || 0} TASKS COMPLETED</span>
                </div>
                
                <div className="space-y-8 pt-10">
                  {incidents.slice(0, 4).map((incident) => {
                    const prog = incident.tasks.length > 0 
                      ? Math.round((incident.tasks.filter(t => t.status === 'DONE' || t.status === 'RESOLVED' as any).length / incident.tasks.length) * 100) 
                      : 0;
                    return (
                      <div key={incident.id} className="group">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <h4 className="text-sm font-black text-[#091426] uppercase tracking-tight group-hover:text-blue-600 transition-colors">{incident.title}</h4>
                            <p className="text-[10px] font-mono text-slate-400 font-bold uppercase mt-0.5">ID: {incident.id.substring(0, 8)} // Sev: {incident.severity}</p>
                          </div>
                          <span className="text-[10px] font-bold text-slate-900">{prog}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${prog}%` }} className={`h-full ${incident.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-600'}`} />
                        </div>
                      </div>
                    );
                  })}
                  {incidents.length === 0 && <p className="text-center text-slate-300 py-10 font-black uppercase tracking-widest">No Active Incidents Found</p>}
                </div>
             </div>

             <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-[#091426] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Efficiency Indices</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Aging Ratio</span>
                        <span className="text-lg font-black tracking-tighter">4.2d</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-2/3" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">CapEx Drift</span>
                        <span className="text-lg font-black tracking-tighter">-2.4%</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Remediation Mix</h3>
                   <div className="flex flex-col gap-4">
                      {[
                        { label: 'Critical Ops', count: stats.criticalIncidents, color: 'bg-red-500' },
                        { label: 'Network Integrity', count: Math.ceil(stats.total * 0.4), color: 'bg-blue-500' },
                        { label: 'Legal Mapping', count: Math.floor(stats.total * 0.1), color: 'bg-amber-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-[11px] font-black text-[#091426] uppercase flex-1">{item.label}</span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">{item.count}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeView === 'KANBAN' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="relative group flex-1 max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                 <input 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Search remediation tasks..."
                   className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-[#091426] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans"
                 />
               </div>
               <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-[#091426] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-blue-200 transition-all">
                     <Filter size={14} /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                     <Plus size={14} /> New CAPA Plan
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as const).map((status) => (
                 <div key={status} className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status.replace('_', ' ')}</span>
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          {tasksByStatus[status].length}
                        </span>
                      </div>
                      <MoreHorizontal size={14} className="text-slate-300 cursor-pointer hover:text-slate-600" />
                   </div>

                   <div className="space-y-4 min-h-[500px]">
                     {isLoading ? (
                       <SkeletonCard />
                     ) : tasksByStatus[status].length === 0 ? (
                        <div className="h-32 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex items-center justify-center">
                           <p className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Empty State</p>
                        </div>
                     ) : (
                       tasksByStatus[status].map((task) => (
                         <motion.div 
                           layoutId={task.id}
                           key={task.id} 
                           onClick={() => handleStatusChange(task.id, task.status)}
                           className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group cursor-pointer relative overflow-hidden"
                         >
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex gap-1.5 overflow-hidden">
                                  <span className={`text-[7px] font-black px-2 py-0.5 rounded-sm tracking-widest border uppercase ${
                                    task.severity === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' :
                                    task.severity === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-blue-50 text-blue-600 border-blue-100'
                                  }`}>
                                    {task.severity || 'LOW'}
                                  </span>
                               </div>
                               <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronRight size={14} className="text-blue-500" />
                                </div>
                            </div>
                            <h5 className="text-[11px] font-black text-[#091426] uppercase tracking-tight mb-2 leading-tight uppercase line-clamp-2">{task.title}</h5>
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed line-clamp-2 italic mb-4 uppercase">
                              Relates to: {task.incidentTitle}
                            </p>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                               <div className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[7px] font-black text-slate-400">
                                    {task.assignee?.firstName?.[0] || '?'}{task.assignee?.lastName?.[0] || 'U'}
                                  </div>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    {task.assignee?.firstName || 'SYSTEM'}
                                  </span>
                               </div>
                               {task.dueDate && (
                                 <span className="text-[8px] font-mono font-black text-slate-300">
                                   DUE: {new Date(task.dueDate).toLocaleDateString()}
                                 </span>
                               )}
                            </div>
                         </motion.div>
                       ))
                     )}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeView === 'CAPEX' && (
           <div className="col-span-12 font-sans space-y-8 animate-in fade-in duration-500">
              <div className="bg-[#091426] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 group">
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="flex-1 space-y-6 relative z-10">
                   <h3 className="text-sm font-black uppercase tracking-[0.25em] text-blue-400">Financial Impact Forecasting</h3>
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Committed CapEx</p>
                        <p className="text-4xl font-black tracking-tighter">$1.2M</p>
                        <p className="text-[10px] font-mono text-emerald-400 mt-2 font-black uppercase">Optimized via AI Engine</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Projected Recovery</p>
                        <p className="text-4xl font-black tracking-tighter">$840k</p>
                        <p className="text-[10px] font-mono text-blue-400 mt-2 font-black uppercase">Next Audit Cycle</p>
                      </div>
                   </div>
                </div>
                <div className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Risk Avoidance Value</p>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-emerald-500 w-[85%]" />
                   </div>
                   <p className="text-[9px] text-slate-400 leading-relaxed">Calculated based on prospective fines avoided through structural firewall upgrades.</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] mb-8">Structural Fix Matrix</h3>
                 <div className="grid grid-cols-3 gap-8 text-center pt-10">
                    {[
                      { icon: ShieldCheck, label: 'Technical Controls', val: '82%', sub: 'Configured' },
                      { icon: Gavel, label: 'Legal Safeguards', val: '14/15', sub: 'Indexed' },
                      { icon: Activity, label: 'Uptime Continuity', val: '99.99%', sub: 'Target' },
                    ].map((m, i) => (
                      <div key={i} className="space-y-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 border border-slate-100">
                          <m.icon size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-[#091426] tracking-tighter">{m.val}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                          <p className="text-[8px] font-mono text-emerald-600 font-bold uppercase mt-1">{m.sub}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Technical Validation Strip */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.3em]">
           <p className="flex items-center gap-3">
              <ScrollText size={16} className="text-[#091426]" /> 
              Engine_State: {isLoading ? 'SYNCING...' : 'LIVE_ANCHORED'} // CRC: 0x821F...
           </p>
           <p className="text-[#091426] flex items-center gap-2">
              <ShieldCheck size={12} className="fill-current text-blue-600" /> {stats.done} Remediation Nodes Active
           </p>
           <p>Last Pulse: {new Date().toLocaleTimeString()} UTC</p>
        </div>
      </div>
    </div>
  );
};

export default RemediationWorkflow;
