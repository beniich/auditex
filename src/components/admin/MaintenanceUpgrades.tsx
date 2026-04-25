import React from 'react';
import { 
  Calendar as Schedule, 
  ShieldCheck as Verified, 
  Gauge as Speed, 
  Hammer as Build, 
  RefreshCw as Update,
  Terminal,
  ArrowRight as ArrowForward
} from 'lucide-react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const MaintenanceUpgrades: React.FC = () => {
  return (
    <PageWrapper>
      {/* Page Header */}
      <PageHeader
        title="System Maintenance & Upgrade"
        subtitle="Manage core kernel versioning, scheduled downtime, and infrastructure integrity."
        badge="System Stable"
        badgeVariant="success"
        icon={Verified}
        breadcrumb={['Admin', 'Infrastructure', 'Maintenance']}
        actions={
          <>
            <Button variant="secondary">Run Diagnostics</Button>
            <Button variant="primary" icon={Schedule}>Schedule Downtime</Button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        
        {/* Kernel Health Card */}
        <SectionCard 
          className="col-span-12 lg:col-span-8"
          title="AuditMaster Kernel Status"
          subtitle="Real-time system health and versioning"
          actions={<span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded">UPTIME: 142d 12h 04m</span>}
        >
          <div className="grid grid-cols-3 gap-8 p-4">
            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Active Version</p>
              <div className="flex flex-col">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">4.22.0</p>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">- Long Term Support</span>
              </div>
              <StatusBadge label="Hash Verified" variant="success" icon={Verified} />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Memory Utilization</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">42.8<span className="text-xl opacity-40">%</span></p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                <div className="bg-blue-600 h-full w-[42.8%] transition-all duration-1000" />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">I/O Performance</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">Optimal</p>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Speed size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">1.2ms Latency</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Next Scheduled Maintenance */}
        <SectionCard 
          className="col-span-12 lg:col-span-4"
          variant="dark"
          title="Upcoming Window"
          subtitle="Next scheduled infrastructure update"
        >
          <div className="space-y-8 p-2">
            <div>
              <p className="text-4xl font-black tracking-tighter mb-2">Oct 24, 2023</p>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">02:00 AM - 04:00 AM EST</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Build size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight text-white mb-1">Security Patch KB-9021</p>
                <p className="text-[10px] font-mono text-slate-500">Kernel Integrity Update</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-[0.03] pointer-events-none">
            <Update size={240} />
          </div>
        </SectionCard>

        {/* Historical Patch Log */}
        <SectionCard 
          className="col-span-12 lg:col-span-7"
          title="Historical Patch Logs"
          padding="none"
          actions={<Button variant="ghost" size="sm">Export Full CSV</Button>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Version</th>
                  <th className="px-8 py-5">Deployment Date</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5 text-right">Integrity Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-xs">
                {[
                  { v: 'v4.21.9', date: '2023-09-12 14:00', type: 'STABILITY', typeVar: 'info' as const, hash: '0x3F2A...' },
                  { v: 'v4.21.8', date: '2023-08-25 01:20', type: 'SECURITY', typeVar: 'danger' as const, hash: '0x9B11...' },
                  { v: 'v4.21.0', date: '2023-07-01 00:00', type: 'MINOR', typeVar: 'info' as const, hash: '0xEE04...' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-8 py-6 font-black text-slate-900 group-hover:text-blue-600">{row.v}</td>
                    <td className="px-8 py-6 text-slate-500">{row.date}</td>
                    <td className="px-8 py-6">
                      <StatusBadge label={row.type} variant={row.typeVar} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
                        <Verified size={12} /> {row.hash}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Audit Trail Sidebar */}
        <SectionCard 
          className="col-span-12 lg:col-span-5"
          title="Recent Admin Actions"
          subtitle="Forensic trace of kernel modifications"
        >
          <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-1.5 before:w-[2px] before:bg-slate-50">
            {[
              { title: 'Downtime Scheduled', admin: 'john.doe@auditmaster.io', time: '14m ago', detail: 'Target: US-EAST-1 Cluster', active: true },
              { title: 'Report Generated', admin: 'Auto-Health Monitor', time: '2h ago', detail: 'System Diagnostic v4.2', active: false },
              { title: 'Config Update', admin: 'sarah.smith@auditmaster.io', time: '5h ago', detail: 'Threshold level recalibrated', active: false },
            ].map((action, i) => (
              <div key={i} className={`relative ${!action.active ? 'opacity-60' : ''}`}>
                <div className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${action.active ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{action.title}</p>
                    <p className="text-[10px] font-mono font-bold text-slate-400">{action.admin}</p>
                  </div>
                  <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{action.time}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-600 leading-relaxed">
                  {action.detail}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Infrastructure Map/Visual */}
        <SectionCard className="col-span-12 p-0 h-[400px]" padding="none">
           <div className="flex flex-col md:flex-row h-full">
            <div className="flex-1 p-10 space-y-8 flex flex-col justify-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Global Distribution</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Infrastructure Mesh</h2>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="border-l-4 border-emerald-500 pl-6">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">24</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Nodes</p>
                </div>
                <div className="border-l-4 border-amber-400 pl-6">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">02</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Migrating</p>
                </div>
              </div>
              <Button variant="ghost" icon={ArrowForward} className="w-fit">View Topology</Button>
            </div>
            <div className="w-full md:w-[55%] relative bg-brand-sidebar">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLrYOH0jbAvnGEzVF-FYBjqfHqTojMDTOZHgIpZEo5i2jzKXI6EqQGL6EmN3qE7vHGEwIGUb4xugJhp4opJikH8Nf_jBYFIID1ppKIolurHZtCDTu_Orgte8Z6Rt2TOVDku1Kdrri49ta7671fdrkxikEAe52MYz48R0j0JK63EpLvYzt-PgjjHcLX5yqYxjmGbGnlTAMuPcx1evheSXNWGdgqNZgXeBmJHO90pshugRfKPuLNYs0usf_CZIKQtTF3j76-VNIgW6M" 
                alt="Infra" 
                className="w-full h-full object-cover grayscale opacity-20 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-sidebar to-transparent" />
              <div className="absolute top-8 right-8 flex gap-3">
                 <StatusBadge label="US-WEST-1: LIVE" variant="brand" className="bg-white/10 border-white/20 backdrop-blur" />
                 <StatusBadge label="EU-CENTRAL-1: LIVE" variant="brand" className="bg-white/10 border-white/20 backdrop-blur" />
              </div>
            </div>
          </div>
        </SectionCard>

      </div>

      {/* Floating Action */}
      <button className="fixed bottom-12 right-12 w-16 h-16 bg-brand-sidebar text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:-rotate-12 transition-all z-50 border-4 border-white">
        <Terminal size={24} />
      </button>
    </PageWrapper>
  );
};

export default MaintenanceUpgrades;
