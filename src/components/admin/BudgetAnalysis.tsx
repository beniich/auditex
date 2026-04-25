import React from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  Search as SearchIcon, 
  History, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Download,
  PieChart,
  BarChart,
  Calendar
} from 'lucide-react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const BudgetAnalysis: React.FC = () => {
  return (
    <PageWrapper>
      {/* Page Header */}
      <PageHeader
        title="Cost & Budget Management"
        subtitle="Global fiscal oversight and real-time expense reconciliation. Integrated with AuditMaster Ledger."
        badge="Financial Control"
        icon={DollarSign}
        breadcrumb={['Admin', 'Financials', 'Budget']}
        actions={
          <div className="flex bg-white/50 backdrop-blur p-1 rounded-xl border border-slate-200 shadow-sm">
            {['Overview', 'Expenses', 'Allocation'].map((tab, i) => (
              <button key={i} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'
              }`}>
                {tab}
              </button>
            ))}
          </div>
        }
      />

      {/* Financial Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Allocated Budget', value: '$2,450,000.00', trend: '+4.2%', sub: 'vs last FY', variant: 'info' as const },
          { label: 'Actual Spend', value: '$1,892,443.12', progress: 77, variant: 'brand' as const },
          { label: 'Vendor Fees', value: '$412,000.00', sub: '18 Active Contracts', variant: 'info' as const },
          { label: 'Travel Expenses', value: '$128,550.45', alert: 'Threshold Reach', variant: 'danger' as const },
        ].map((stat, i) => (
          <SectionCard key={i} padding="small">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">{stat.label}</span>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            
            {stat.trend && (
              <div className="flex items-center gap-3 mt-5">
                <StatusBadge label={stat.trend} variant="success" icon={TrendingUp} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</span>
              </div>
            )}
            
            {stat.progress && (
              <div className="mt-8">
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stat.progress}%` }} className="bg-blue-600 h-full shadow-lg shadow-blue-500/20" />
                </div>
                <p className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-widest">{stat.progress}% UTILIZED</p>
              </div>
            )}
            
            {stat.alert && (
              <div className="mt-6">
                <StatusBadge label={stat.alert} variant="danger" className="w-full justify-center" />
              </div>
            )}
            
            {!stat.trend && !stat.progress && !stat.alert && stat.sub && (
              <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest border-t border-slate-50 pt-4">{stat.sub}</p>
            )}
          </SectionCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Variance Chart */}
        <SectionCard 
          className="col-span-12 lg:col-span-8"
          title="Budget vs. Actual Variance"
          actions={
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                 <button key={q} className={`px-4 py-1.5 text-[9px] font-black rounded-lg ${
                   q === 'Q3' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                 }`}>{q}</button>
              ))}
            </div>
          }
        >
          <div className="h-[340px] flex items-end justify-between gap-6 relative px-4 mt-8">
             <div className="absolute inset-x-0 top-0 bottom-10 flex flex-col justify-between opacity-5 pointer-events-none">
                {[1, 2, 3, 4, 5].map(j => <div key={j} className="border-t border-slate-900 w-full" />)}
             </div>
             
             {[
               { month: 'JUL', target: 60, actual: 55 },
               { month: 'AUG', target: 75, actual: 70 },
               { month: 'SEP', target: 85, actual: 90 },
               { month: 'OCT', target: 70, actual: 68 },
               { month: 'NOV', target: 80, actual: 75 },
               { month: 'DEC', target: 95, actual: 80 },
             ].map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 relative z-10">
                  <div className="flex items-end gap-2 w-full h-64 px-2">
                     <motion.div initial={{ height: 0 }} animate={{ height: `${m.target}%` }} className="flex-1 bg-slate-100 rounded-t-xl" />
                     <motion.div initial={{ height: 0 }} animate={{ height: `${m.actual}%` }} className="flex-1 bg-blue-600 rounded-t-xl shadow-lg shadow-blue-500/20" />
                  </div>
                  <span className="text-[10px] font-mono font-black text-slate-400">{m.month}</span>
                </div>
             ))}
             
             <div className="absolute top-0 left-4 flex gap-8">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 bg-slate-100 rounded-full" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Allocated</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Actual</span>
               </div>
             </div>
          </div>
        </SectionCard>

        {/* Breakdown & Efficiency */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <SectionCard title="Cost Allocation" className="flex-1">
            <div className="space-y-6 mt-4">
               {[
                 { label: 'Staff', value: '$845,000', progress: 45, color: 'bg-slate-900' },
                 { label: 'Travel', value: '$128,550', progress: 12, color: 'bg-blue-600' },
                 { label: 'Software', value: '$506,893', progress: 28, color: 'bg-blue-400' },
                 { label: 'Consultants', value: '$412,000', progress: 15, color: 'bg-slate-200' },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900 font-mono">{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress * 2}%` }} className={`${item.color} h-full`} />
                    </div>
                 </div>
               ))}
            </div>
          </SectionCard>
          
          <SectionCard variant="dark">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Efficiency Rating</p>
                <p className="text-4xl font-black tracking-tighter uppercase italic">92.4%</p>
                <StatusBadge label="Hardenened Sync" variant="info" className="mt-4 bg-white/5 border-white/10 text-white" />
              </div>
              <div className="w-16 h-16 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center animate-pulse">
                <ShieldCheck size={32} className="text-blue-500" />
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none" />
          </SectionCard>
        </div>
      </div>

      {/* Audit Ledger */}
      <SectionCard 
        title="Active Audit Ledger" 
        padding="none"
        actions={
          <div className="flex gap-4">
            <div className="relative group">
              <SearchIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input className="pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-100 outline-none w-64 transition-all" placeholder="Filter ledger..." />
            </div>
            <Button variant="secondary" size="sm" icon={Download}>Export</Button>
          </div>
        }
      >
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <th className="px-10 py-5">Audit ID</th>
                 <th className="px-10 py-5">Entity / Region</th>
                 <th className="px-10 py-5">Allocated</th>
                 <th className="px-10 py-5">Actual</th>
                 <th className="px-10 py-5">Variance</th>
                 <th className="px-10 py-5">Status</th>
                 <th className="px-10 py-5 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 font-mono text-xs">
               {[
                 { id: 'AU-2024-001', entity: 'Global HQ - London, UK', target: '$450k', actual: '$422k', var: '-6.2%', status: 'VERIFIED', varColor: 'text-emerald-600' },
                 { id: 'AU-2024-002', entity: 'APAC Data Center - SG', target: '$215k', actual: '$232k', var: '+7.9%', status: 'PROCESS', varColor: 'text-red-600' },
                 { id: 'AU-2024-003', entity: 'South America - BR', target: '$180k', actual: '$178k', var: '-0.8%', status: 'DRAFT', varColor: 'text-slate-400' },
               ].map((row, i) => (
                 <tr key={i} className="hover:bg-slate-50 transition-colors group">
                   <td className="px-10 py-6 font-black text-slate-400 uppercase tracking-tight">{row.id}</td>
                   <td className="px-10 py-6 font-black text-slate-900 group-hover:text-blue-600 transition-colors">{row.entity}</td>
                   <td className="px-10 py-6 text-slate-500">{row.target}</td>
                   <td className="px-10 py-6 font-black text-slate-900">{row.actual}</td>
                   <td className={`px-10 py-6 font-black ${row.varColor}`}>{row.var}</td>
                   <td className="px-10 py-6">
                     <StatusBadge label={row.status} variant={row.status === 'VERIFIED' ? 'success' : row.status === 'PROCESS' ? 'brand' : 'info'} />
                   </td>
                   <td className="px-10 py-6 text-right">
                     <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">Review</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         <div className="p-8 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page 1 of 6 :: Industrial Ledger</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="px-3" disabled><ChevronLeft size={14}/></Button>
              <button className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-[10px]">1</button>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 font-black text-[10px] hover:bg-slate-50">2</button>
              <Button variant="secondary" size="sm" className="px-3"><ChevronRight size={14}/></Button>
            </div>
         </div>
      </SectionCard>

      {/* Chronic Ledger History */}
      <SectionCard 
        title="Audit Spend Chronology" 
        subtitle="Forensic time-series of financial modifications"
      >
         <div className="relative pl-8 space-y-12 mt-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
           {[
             { time: '14:22 UTC', date: 'OCT 24', tag: 'BUDGET_OVERRIDE', user: 'Admin_User_01', desc: 'EMEA region allocation adjusted for specialized forensic node audit.', color: 'blue' },
             { time: '09:15 UTC', date: 'OCT 23', tag: 'INVOICE_CLEAR', user: 'KPMG_Consult', desc: 'Third-party compliance validation fee cleared via secure vault sync.', color: 'slate' },
             { time: '18:02 UTC', date: 'OCT 22', tag: 'AUTO_RECON', user: 'Ledger_Engine', desc: 'Automatic travel multi-currency reconciliation completed for APAC team.', color: 'slate' },
           ].map((log, i) => (
             <div key={i} className="relative group">
               <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-white border-4 ${log.color === 'blue' ? 'border-blue-600' : 'border-slate-200'} z-10 transition-all group-hover:scale-125`} />
               <div className="flex items-center gap-4 mb-3">
                 <div className="flex flex-col">
                    <span className="font-mono text-[10px] font-black text-slate-900">{log.time}</span>
                    <span className="font-mono text-[8px] font-bold text-slate-400">{log.date}</span>
                 </div>
                 <StatusBadge label={log.tag} variant="info" className="scale-90" />
               </div>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-relaxed max-w-3xl">
                 <span className="text-blue-600 italic">[{log.user}]</span> — {log.desc}
               </p>
               <div className="mt-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 font-mono text-[9px] text-slate-400 uppercase tracking-widest flex items-center justify-between">
                 <span>Sign: 0x4f22...ea81</span>
                 <span className="text-blue-400 font-black">Verified Secure</span>
               </div>
             </div>
           ))}
         </div>
      </SectionCard>
    </PageWrapper>
  );
};

export default BudgetAnalysis;
