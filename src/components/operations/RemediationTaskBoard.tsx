import React from 'react';
import { Search, ChevronDown, GitPullRequest, Trello, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const KANBAN_DATA = {
  todo: [
    {
      id: 't1',
      title: 'Patch CVE-2024-1234 on Server A',
      risk: 'High Risk',
      riskColor: 'bg-rose-100 text-rose-700',
      description: 'Critical vulnerability in web server software. Requires immediate patching.',
      jira: 'AUD-123',
      github: 'PR #456 (Pending)',
      assignee: 'JD',
      due: 'Due in 3 days'
    },
    {
      id: 't2',
      title: 'Update Privacy Policy for GDPR',
      risk: 'Medium Risk',
      riskColor: 'bg-orange-100 text-orange-700',
      description: 'Revise policy to align with latest EU regulations.',
      jira: 'AUD-125',
      github: 'Issue #789',
      assignee: 'MK',
      due: 'Due next week'
    },
    {
      id: 't3',
      title: 'Review Vendor Security Questionnaires',
      risk: 'Low Risk',
      riskColor: 'bg-emerald-100 text-emerald-700',
      description: '',
      jira: 'AUD-126',
      github: 'N/A',
      assignee: 'AL',
      due: 'Due 2 weeks'
    }
  ],
  inProgress: [
    {
      id: 'p1',
      title: 'Implement MFA on Access Points',
      risk: 'High Risk',
      riskColor: 'bg-rose-100 text-rose-700',
      description: 'Enforce multi-factor authentication for all external access.',
      jira: 'AUD-124',
      github: "Commit #abc123 (Merged to Develop)",
      assignee: 'JD',
      due: 'Due tomorrow'
    },
    {
      id: 'p2',
      title: 'Encrypt Sensitive Data in Transit',
      risk: 'Medium Risk',
      riskColor: 'bg-orange-100 text-orange-700',
      description: '',
      jira: 'AUD-127',
      github: "Branch 'encryption-fix'",
      assignee: 'SR',
      due: 'Due 5 days'
    }
  ],
  verified: [
    {
      id: 'v1',
      title: 'Perform Annual Penetration Test',
      risk: 'Completed',
      riskColor: 'bg-emerald-100 text-emerald-700',
      description: 'External test conducted and report received.',
      jira: 'AUD-120',
      github: 'N/A',
      assignee: 'JD',
      due: 'Completed on: Oct 25'
    },
    {
      id: 'v2',
      title: 'Conduct Phishing Simulation Training',
      risk: 'Completed',
      riskColor: 'bg-emerald-100 text-emerald-700',
      description: '',
      jira: 'AUD-121',
      github: 'Release v2.1 (Docs)',
      assignee: 'HR',
      due: 'Completed on: Oct 20'
    }
  ]
};

const TaskCard = ({ task }: { task: any }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab">
    <h4 className="font-bold text-[#091426] mb-2">{task.title}</h4>
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${task.riskColor} mb-3`}>
      {task.risk}
    </span>
    {task.description && (
       <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">{task.description}</p>
    )}
    
    <div className="space-y-1.5 mb-4">
       <div className="flex items-center gap-2 text-sm font-semibold text-[#091426]">
          <Trello className="text-blue-500 w-4 h-4" />
          <span>Jira:</span> <a href="#" className="hover:underline">{task.jira}</a>
       </div>
       <div className="flex items-center gap-2 text-sm font-semibold text-[#091426]">
          <GitPullRequest className="text-slate-700 w-4 h-4" />
          <span>GitHub:</span> <a href="#" className="hover:underline">{task.github}</a>
       </div>
    </div>

    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
       <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
          {task.assignee}
       </div>
       <span className="text-xs font-semibold text-slate-500">{task.due}</span>
    </div>
  </div>
);

export const RemediationTaskBoard = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-6 pb-4 border-b border-slate-200 flex justify-between items-center">
         <h2 className="text-2xl font-black text-[#091426]">Remediation Task Board</h2>
         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input type="text" placeholder="Search tasks, CVEs, or teams..." className="w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400" />
            </div>
            <button className="px-4 py-2 bg-slate-100 border border-slate-200 text-[#091426] text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">Create Task</button>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
               Filter by: 
               <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white text-[#091426] rounded-md hover:bg-slate-50">
                  Status, Assignee, Priority <ChevronDown size={14} />
               </button>
            </div>
         </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
         <div className="flex gap-6 h-full overflow-x-auto pb-4">
            {/* To Do Column */}
            <div className="w-[400px] min-w-[400px] flex flex-col pt-2">
               <div className="flex items-center gap-2 mb-4 bg-slate-200/50 p-3 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-[#091426] uppercase tracking-wider text-sm">To Do</h3>
                  <span className="text-sm font-semibold text-slate-500">(5)</span>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {KANBAN_DATA.todo.map(task => <TaskCard key={task.id} task={task} />)}
               </div>
            </div>

            {/* In Progress Column */}
            <div className="w-[400px] min-w-[400px] flex flex-col pt-2">
               <div className="flex items-center gap-2 mb-4 bg-slate-200/50 p-3 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-[#091426] uppercase tracking-wider text-sm">In Progress</h3>
                  <span className="text-sm font-semibold text-slate-500">(3)</span>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {KANBAN_DATA.inProgress.map(task => <TaskCard key={task.id} task={task} />)}
               </div>
            </div>

            {/* Verified Column */}
            <div className="w-[400px] min-w-[400px] flex flex-col pt-2">
               <div className="flex items-center gap-2 mb-4 bg-slate-200/50 p-3 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-[#091426] uppercase tracking-wider text-sm">Verified</h3>
                  <span className="text-sm font-semibold text-slate-500">(12)</span>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {KANBAN_DATA.verified.map(task => <TaskCard key={task.id} task={task} />)}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default RemediationTaskBoard;
