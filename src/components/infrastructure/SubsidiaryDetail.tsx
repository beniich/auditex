import React from 'react';
import { ShieldCheck, AlertCircle, Building2, MapPin, Globe, CreditCard, ChevronRight, Activity, Cpu, Loader2 } from 'lucide-react';
import { JurisdictionalHeatmap } from '../risk/JurisdictionalHeatmap';
import { useApiQuery } from '../../hooks/useApiQuery';
import { OrganizationService } from '../../services/OrganizationService';

interface SubsidiaryDetailProps {
  id?: string;
}

export const SubsidiaryDetail = ({ id }: SubsidiaryDetailProps) => {
  const { data: orgs } = useApiQuery(['organizations'], () => OrganizationService.list());
  const targetId = id || orgs?.[0]?.id; // Default to first org if no ID
  
  const { data: entity, isLoading } = useApiQuery(
    ['organization', targetId], 
    () => OrganizationService.getById(targetId!),
    { enabled: !!targetId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[900px]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex items-center justify-center h-full min-h-[900px] text-slate-400 font-medium">
        No entity selected.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-[3rem] overflow-hidden min-h-[900px] gap-8 p-10">
      {/* Header Card */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex justify-between items-center">
         <div className="flex gap-6 items-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center border border-blue-100 shadow-inner">
               <Building2 size={40} />
            </div>
            <div>
               <h1 className="text-4xl font-black text-[#091426] tracking-tight">{entity.name}</h1>
               <div className="flex gap-6 mt-2">
                  <span className="flex items-center gap-2 text-slate-400 text-sm font-bold"><MapPin size={16} /> Jurisdiction: <strong className="text-slate-600 font-black">{entity.legalJurisdiction || 'EU'}</strong></span>
                  <span className="flex items-center gap-2 text-slate-400 text-sm font-bold"><ShieldCheck size={16} className="text-emerald-500" /> Status: <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Active & Compliant</span></span>
                  <span className="flex items-center gap-2 text-slate-400 text-sm font-bold"><AlertCircle size={16} className="text-rose-500" /> Risk Rating: <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Managed</span></span>
               </div>
            </div>
         </div>
         <button className="bg-[#091426] text-white px-8 py-4 rounded-2xl font-black text-[10px] shadow-xl shadow-slate-900/10 uppercase tracking-widest hover:opacity-90 transition-all">
            Consolidate Entity
         </button>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1">
         {/* Left: Heatmap Reuse */}
         <div className="col-span-8">
            <JurisdictionalHeatmap />
         </div>

         {/* Right: Requirements & Assets */}
         <div className="col-span-4 flex flex-col gap-8">
            {/* Compliance Table Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6">
               <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Activity size={16} /> Regulatory Obligations
               </h3>
               <div className="flex flex-col gap-2">
                  {[
                     { name: 'GDPR Compliance', status: 'Compliant', color: 'emerald' },
                     { name: 'Local Tax Code', status: 'Review Required', color: 'orange' },
                     { name: 'Labor Law', status: 'Compliant', color: 'emerald' }
                  ].map((req, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-sm font-bold text-slate-600">{req.name}</span>
                        <div className="flex items-center gap-3">
                           <span className={`text-[9px] font-black uppercase tracking-tight text-${req.color}-600`}>{req.status}</span>
                           <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                              <ChevronRight size={14} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Asset Inventory Card */}
            <div className="bg-[#091426] p-8 rounded-[2.5rem] text-white flex flex-col gap-8 flex-1 shadow-2xl">
               <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                     <CreditCard size={16} /> Asset Inventory Summary
                  </h3>
                  <div className="mt-6 flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                     <span className="text-[10px] font-black text-slate-500 uppercase">Annual Turnover</span>
                     <span className="text-2xl font-black text-emerald-500">€{entity.annualTurnover?.toLocaleString() || '0'}</span>
                  </div>
               </div>

               <div className="flex flex-col gap-4 overflow-y-auto">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-all">
                     <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center">
                        <Globe size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-black">Regional Node Network</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Nodes: {entity.entities?.length || 0} | Status: Secure</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default SubsidiaryDetail;

export default SubsidiaryDetail;
