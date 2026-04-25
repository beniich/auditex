import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Plane, 
  Calendar, 
  Search, 
  Bell, 
  History, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  Globe,
  Briefcase,
  ExternalLink,
  DollarSign,
  Info,
  Terminal
} from 'lucide-react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const ResourceAllocator: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header Section */}
      <PageHeader
        title="Audit Resource Allocator"
        subtitle="Optimize workload balancing across jurisdictions. Track travel compliance and budget integrity for global deployment."
        badge="Resource Allocation"
        icon={Users}
        breadcrumb={['Admin', 'Operations', 'Resources']}
        actions={
          <>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Q3 2024 Cycle</span>
            </div>
            <Button variant="secondary" icon={Filter}>Filter Topology</Button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Global Utilization', value: '84.2%', sub: 'Optimal Range', icon: Users, variant: 'success' as const, labelBadge: 'OPTIMAL' },
          { label: 'Available Buffer', value: '12', sub: 'Auditors off-project', icon: Briefcase, variant: 'brand' as const, labelBadge: 'READY' },
          { label: 'Travel Burn Rate', value: '$42.8k', sub: '+12% vs Forecast', icon: DollarSign, variant: 'danger' as const, labelBadge: 'OVER_FC' },
          { label: 'Visa Risk Level', value: 'High', sub: '4 Expired/Pending', icon: AlertTriangle, variant: 'warning' as const, labelBadge: 'ACTION_REQ' },
        ].map((stat, i) => (
          <SectionCard key={i} padding="medium">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="p-2.5 bg-slate-50 rounded-xl text-slate-900"><stat.icon size={18} /></div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{stat.sub}</p>
              </div>
              <StatusBadge label={stat.labelBadge} variant={stat.variant} className="scale-90" />
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Scheduler Section */}
      <SectionCard 
        title="Auditor Deployment Roadmap" 
        subtitle="Forensic time-series of jurisdictional assignments"
        padding="none"
        actions={<Button variant="ghost" size="sm">Audit Metadata</Button>}
      >
        <div className="overflow-x-auto mt-4">
          <div className="min-w-[1200px]">
             {/* Timeline Header */}
             <div className="flex border-b border-slate-100 bg-slate-50/50">
               <div className="w-80 border-r border-slate-100 p-6 flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Auditor Entity Registry</span>
                 <MoreHorizontal size={14} className="text-slate-400" />
               </div>
               <div className="flex-1 flex font-mono text-[9px] font-black text-slate-400 divide-x divide-slate-100 uppercase tracking-[0.2em]">
                 {['Jul 01', 'Jul 08', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 05', 'Aug 12', 'Aug 19'].map((date, i) => (
                   <div key={i} className="flex-1 text-center py-6">{date}</div>
                 ))}
               </div>
             </div>

             {/* Timeline Rows */}
             <div className="divide-y divide-slate-50">
               {[
                 { name: 'Dr. Alisa Cheng', region: 'APAC / Senior', util: '80%', variant: 'success' as const, project: 'Hong Kong Compliance Audit', duration: '25%', left: '5%' },
                 { name: 'Marcus Thorne', region: 'EMEA / Lead', util: '110%', variant: 'danger' as const, project: 'London - ESG Framework Phase 3', duration: '45%', left: '0%', alert: true },
                 { name: 'Elara Vance', region: 'AMER / Associate', util: '20%', variant: 'info' as const, project: 'NY - Banking Logs Migration', duration: '15%', left: '60%', visa: 'EXPIRED' },
                 { name: 'Samir Khan', region: 'APAC / Staff', util: '95%', variant: 'brand' as const, project: 'Singapore - Crypto Asset Audit', duration: '55%', left: '15%' },
               ].map((auditor, i) => (
                 <div key={i} className="flex group hover:bg-slate-50/30 transition-colors">
                   <div className="w-80 border-r border-slate-50 p-6 flex items-center gap-5 bg-white group-hover:bg-slate-50/30">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-inner">
                       <Users size={24} />
                     </div>
                     <div className="flex-1">
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{auditor.name}</p>
                       <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                         <Globe size={11} /> {auditor.region}
                       </div>
                     </div>
                     <StatusBadge label={auditor.util} variant={auditor.util === '110%' ? 'danger' : 'success'} className="scale-75" />
                   </div>
                   <div className="flex-1 relative h-24 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]">
                     <motion.div 
                       initial={{ opacity: 0, scaleX: 0 }}
                       animate={{ opacity: 1, scaleX: 1 }}
                       style={{ left: auditor.left, width: auditor.duration, originX: 0 }}
                       className={`absolute top-8 h-10 rounded-xl shadow-xl px-5 flex items-center text-[9px] font-black uppercase tracking-widest text-white cursor-pointer hover:brightness-110 transition-all ${
                         auditor.variant === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                         auditor.variant === 'danger' ? 'bg-slate-900 shadow-slate-900/20' : 
                         auditor.variant === 'info' ? 'bg-blue-400 shadow-blue-400/20' : 
                         'bg-blue-600 shadow-blue-600/20'
                       }`}
                     >
                       <span className="truncate">{auditor.project}</span>
                       {(auditor.alert || auditor.visa) && <div className="ml-auto w-2 h-2 rounded-full bg-red-400 shadow-lg animate-pulse" />}
                     </motion.div>
                     {auditor.visa && (
                       <div className="absolute top-1 right-10 flex items-center gap-2 text-red-600 font-black text-[8px] uppercase tracking-widest bg-red-50 px-2 py-1 rounded">
                         <AlertTriangle size={10} /> Visa Alert: Brazil
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
        
        {/* Scheduler Footer */}
        <div className="px-10 py-5 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono font-black uppercase tracking-[0.2em] border-t border-white/5">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" /> Active Assignment</div>
              <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Risk Conflict</div>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-3 text-slate-500"><Terminal size={14}/> Forensic Hub: Sync Ready</div>
           </div>
           <div className="flex items-center gap-8">
              <span className="text-slate-500">Last Sync Index: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              <span className="text-blue-400">System v2.4.1-Stable</span>
           </div>
        </div>
      </SectionCard>

      {/* Lower Details Grid */}
      <div className="grid grid-cols-12 gap-8">
         {/* Budget Section */}
         <SectionCard 
           className="col-span-12 lg:col-span-8"
           title="Regional Travel Expenditure"
           subtitle="Forensic tracking of jurisdictional logistics budget"
           actions={<Button variant="ghost" size="sm">Open Ledger</Button>}
         >
            <div className="space-y-10 mt-6">
              {[
                { region: 'APAC Sector', value: '$128,400', progress: 72, variant: 'brand' as const },
                { region: 'EMEA Division', value: '$82,150', progress: 45, variant: 'info' as const },
                { region: 'AMER Cluster', value: '$164,000', progress: 94, variant: 'danger' as const, alert: true },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.region}</span>
                    <span className={`font-mono text-sm font-black ${item.alert ? 'text-red-600' : 'text-slate-900'}`}>{item.value}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`h-full ${
                        item.variant === 'brand' ? 'bg-blue-600' : 
                        item.variant === 'info' ? 'bg-blue-400' : 'bg-red-500'
                      } shadow-lg shadow-current/20`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-6">
               <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600">
                  <Info size={24} />
               </div>
               <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">AMER Budget Threshold Protocol</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">
                     Audit density in NYC and São Paulo has triggered secondary reserve funding protocols. Manual supervisor approval required for all trans-atlantic flight bookings.
                  </p>
               </div>
            </div>
         </SectionCard>

         {/* Compliance Triggers */}
         <SectionCard title="Intelligence Triggers" className="col-span-12 lg:col-span-4">
            <div className="space-y-6 mt-4">
               {[
                 { type: 'Visa Expiry', time: '48H', desc: "Auditor Work Visa (Brazil) expires in 48h. Protocol trigger: Node Isolation.", variant: 'danger' as const },
                 { type: 'Policy Threshold', time: 'WARN', desc: "Field saturation peak reached for EMEA analysts. Secondary rest cycle required.", variant: 'warning' as const },
                 { type: 'Sync Verification', time: 'PASS', desc: "All APAC auditors verified via cryptographic travel clearance protocols.", variant: 'success' as const },
               ].map((trigger, i) => (
                 <div key={i} className="p-5 border border-slate-50 bg-slate-50/50 rounded-2xl relative overflow-hidden group">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      trigger.variant === 'danger' ? 'bg-red-500' : 
                      trigger.variant === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{trigger.type}</span>
                       <StatusBadge label={trigger.time} variant={trigger.variant} className="scale-75" />
                    </div>
                    <p className="text-[10px] text-slate-900 font-bold leading-relaxed uppercase tracking-tight italic">
                       {trigger.desc}
                    </p>
                 </div>
               ))}
            </div>
            <Button variant="primary" className="w-full py-4 mt-10 bg-slate-900 shadow-slate-900/20" icon={AlertTriangle}>
               Trigger Contingency
            </Button>
         </SectionCard>
      </div>
    </PageWrapper>
  );
};

export default ResourceAllocator;
