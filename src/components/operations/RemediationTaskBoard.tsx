import React from 'react';
import { Search, ChevronDown, GitPullRequest, Trello, MoreHorizontal, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { RemediationService } from '../../services/RemediationService';

const TaskCard = ({ task }: { task: any }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-[#091426] leading-tight text-sm">{task.title}</h4>
      <MoreHorizontal size={14} className="text-slate-400" />
    </div>
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
      task.priority === 'CRITICAL' ? 'bg-rose-50 text-rose-600' :
      task.priority === 'HIGH' ? 'bg-orange-50 text-orange-600' :
      'bg-blue-50 text-blue-600'
    }`}>
      {task.priority || 'NORMAL'}
    </span>
    {task.description && (
       <p className="text-[11px] font-semibold text-slate-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
    )}
    
    <div className="space-y-1.5 mb-4">
       <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <Trello className="text-blue-500 w-3.5 h-3.5" />
          <span>Jira:</span> <span className="text-[#091426]">{task.jiraId || 'PENDING'}</span>
       </div>
       <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <GitPullRequest className="text-slate-500 w-3.5 h-3.5" />
          <span>Git:</span> <span className="text-[#091426]">{task.githubPr || 'N/A'}</span>
       </div>
    </div>

    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
       <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-200 shadow-sm">
             {task.assigneeId?.slice(0, 2).toUpperCase() || '??'}
          </div>
          <span className="text-[10px] font-black text-[#091426] uppercase">Assigned</span>
       </div>
       <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Calendar size={12} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'NO DUE DATE'}
       </div>
    </div>
  </div>
);

export const RemediationTaskBoard = () => {
  const { data: tasks, isLoading } = useApiQuery(['remediations'], () => RemediationService.list());

  const columns = {
    TODO: tasks?.filter(t => t.status === 'TODO') || [],
    IN_PROGRESS: tasks?.filter(t => t.status === 'IN_PROGRESS') || [],
    RESOLVED: tasks?.filter(t => t.status === 'RESOLVED') || []
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4 border-b border-slate-200 flex justify-between items-center">
         <h2 className="text-2xl font-black text-[#091426]">Remediation Task Board</h2>
         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="Search tasks, CVEs, or teams..." className="w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400" />
            </div>
            <button className="bg-[#091426] text-white px-5 py-2 rounded-xl font-black text-[10px] shadow-xl shadow-slate-900/10 uppercase tracking-widest hover:opacity-90 transition-all">
               Create Task
            </button>
         </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
         {isLoading ? (
           <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-blue-600" size={48} />
           </div>
         ) : (
            <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
               {/* To Do Column */}
               <div className="w-[350px] min-w-[350px] flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm">
                     <h3 className="font-black text-[#091426] uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> To Do
                     </h3>
                     <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{columns.TODO.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                     {columns.TODO.map(task => <TaskCard key={task.id} task={task} />)}
                  </div>
               </div>

               {/* In Progress Column */}
               <div className="w-[350px] min-w-[350px] flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-4 bg-amber-50/50 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 shadow-sm">
                     <h3 className="font-black text-amber-900 uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> In Progress
                     </h3>
                     <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{columns.IN_PROGRESS.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                     {columns.IN_PROGRESS.map(task => <TaskCard key={task.id} task={task} />)}
                  </div>
               </div>

               {/* Verified Column */}
               <div className="w-[350px] min-w-[350px] flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-4 bg-emerald-50/50 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/50 shadow-sm">
                     <h3 className="font-black text-emerald-900 uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified
                     </h3>
                     <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{columns.RESOLVED.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                     {columns.RESOLVED.map(task => <TaskCard key={task.id} task={task} />)}
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
export default RemediationTaskBoard;

export default RemediationTaskBoard;
