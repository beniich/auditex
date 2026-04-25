import React from 'react';
import { Search, ChevronDown, Plus, Pencil, MoreHorizontal, Users, ShieldCheck, Activity } from 'lucide-react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const Toggle = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${active ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
  </button>
);

const USERS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@auditax.com', role: 'Compliance Manager', active: '10 min ago', admin: false, auditor: true, viewer: true },
  { id: 2, name: 'Markin Smith', email: 'markin.s@auditax.com', role: 'Senior Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 3, name: 'David Lee', email: 'david.l@auditax.com', role: 'Security Architect', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 4, name: 'Iliurin Flonin', email: 'iliurin.f@auditax.com', role: 'Node Operator', active: '2 hours ago', admin: true, auditor: true, viewer: true },
  { id: 5, name: 'Lucas Grant', email: 'lucas.g@auditax.com', role: 'IT Manager', active: '8 days ago', admin: false, auditor: false, viewer: true },
  { id: 6, name: 'Emma Wilson', email: 'emma.w@auditax.com', role: 'Senior Auditor', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 7, name: 'Luthana Pachson', email: 'luthana.p@auditax.com', role: 'Risk Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 8, name: 'Marcus Moore', email: 'marcus.m@auditax.com', role: 'Lead Counsel', active: '2 hours ago', admin: false, auditor: false, viewer: true }
];

export const AccessControlManagement: React.FC = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="User Roles & Permissions"
        subtitle="Manage secure access, global enterprise roles, and cryptographic entity permissions."
        badge="Access Control"
        icon={Users}
        breadcrumb={['Admin', 'Identity', 'RBAC']}
        actions={
          <Button variant="primary" icon={Plus}>Add Operator</Button>
        }
      />

      {/* Filters & Tools */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4 flex-1 w-full max-w-3xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                 type="text" 
                 placeholder="Search by name, email or role..." 
                 className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-blue-600/5 transition-all shadow-sm"
              />
           </div>
           <div className="relative group">
              <select className="appearance-none px-8 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] outline-none shadow-sm pr-14 min-w-[200px] cursor-pointer">
                 <option>All Systems Roles</option>
                 <option>Compliance Managers</option>
                 <option>Forensic Analysts</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-600 transition-colors" size={16} />
           </div>
        </div>
        <div className="flex gap-4">
           <StatusBadge label="154 Identities" variant="info" icon={Users} />
           <StatusBadge label="32 Active" variant="success" icon={Activity} />
        </div>
      </div>

      {/* Main Table */}
      <SectionCard 
        padding="none"
        title="Identity Registry"
        subtitle="Live matrix of authenticated organizational nodes"
        actions={<Button variant="ghost" size="sm">Export CSV</Button>}
      >
         <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.22em] border-b border-slate-100 bg-slate-50/50">
                     <th className="px-10 py-5">Operator</th>
                     <th className="px-10 py-5">Role Identity</th>
                     <th className="px-10 py-5">Last Burst</th>
                     <th className="px-10 py-5 text-center">Root</th>
                     <th className="px-10 py-5 text-center">Audit</th>
                     <th className="px-10 py-5 text-center">Read</th>
                     <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {USERS.map(user => (
                     <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden bg-slate-50 group-hover:scale-110 transition-transform">
                                 <img src={`https://i.pravatar.cc/100?u=${user.id}`} alt={user.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-900 tracking-tight">{user.name}</span>
                                 <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{user.email}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <StatusBadge label={user.role} variant="info" className="scale-90" />
                        </td>
                        <td className="px-10 py-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{user.active}</td>
                        <td className="px-10 py-6 text-center"><div className="flex justify-center"><Toggle active={user.admin} onChange={() => {}} /></div></td>
                        <td className="px-10 py-6 text-center"><div className="flex justify-center"><Toggle active={user.auditor} onChange={() => {}} /></div></td>
                        <td className="px-10 py-6 text-center"><div className="flex justify-center"><Toggle active={user.viewer} onChange={() => {}} /></div></td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl shadow-sm transition-all"><Pencil size={18} /></button>
                              <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-xl shadow-sm transition-all"><MoreHorizontal size={18} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">RBAC POLICY VERIFIED</span>
               </div>
               <p className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">
                  Hash: 0x98f2...ae21 // SYNCED: Today, 10:45 AM
               </p>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" size="sm">Prev</Button>
              <div className="flex gap-1">
                 <button className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-[10px]">1</button>
                 <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 font-black text-[10px] hover:bg-slate-50">2</button>
                 <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 font-black text-[10px] px-2">...</button>
                 <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 font-black text-[10px]">12</button>
              </div>
              <Button variant="secondary" size="sm">Next</Button>
            </div>
         </div>
      </SectionCard>
    </PageWrapper>
  );
};

export default AccessControlManagement;
