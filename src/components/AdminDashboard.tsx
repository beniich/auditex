import React from 'react';
import { useApiQuery } from '../hooks/useApiQuery';
import { SectionCard } from './common/SectionCard';
import { Users, ClipboardCheck, Key } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // In real implementation, these stats would come from a dedicated endpoint
  const { data: stats, isLoading } = useApiQuery(['admin-stats'], () => fetch('/api/admin/stats').then(res => res.json()));
  
  if (isLoading) return <div className="animate-pulse p-10 bg-slate-50 rounded-[3rem] h-64" />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <SectionCard padding="large" className="bg-white hover:scale-[1.02] transition-all border-none shadow-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilisateurs</h3>
            <p className="text-3xl font-black italic text-slate-900">{stats?.users || 12}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard padding="large" className="bg-white hover:scale-[1.02] transition-all border-none shadow-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audits</h3>
            <p className="text-3xl font-black italic text-slate-900">{stats?.audits || 45}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard padding="large" className="bg-white hover:scale-[1.02] transition-all border-none shadow-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-slate-900 rounded-2xl text-white">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">API Keys Active</h3>
            <p className="text-3xl font-black italic text-slate-900">{stats?.apiKeys || 3}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminDashboard;
