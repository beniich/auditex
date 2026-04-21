import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  Scale,
  Map as MapIcon,
  Activity,
  ChevronDown,
  Info
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { FinancialService } from '../services/FinancialService';
import { Skeleton } from './Skeleton';

export const JurisdictionalHeatmap: React.FC = () => {
  const { data: heatmap = [], isLoading } = useApiQuery(
    ['financial-heatmap'],
    () => FinancialService.getHeatmap(),
    { refetchInterval: 30000 }
  );

  if (isLoading) return <Skeleton className="h-[600px] w-full" />;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-10 group">
      <div className="flex justify-between items-start">
        <div>
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 mb-4">
              <Globe size={18} className="text-blue-600" /> Jurisdictional Risk Surface
           </h3>
           <h2 className="text-3xl font-black text-[#091426] tracking-tighter uppercase leading-none">Global Liability Heatmap</h2>
           <p className="text-slate-500 max-w-xl mt-4 text-sm font-medium">
              Visualization of risk propagation from subsidiaries to the parent holding. 
              Colored by exposure level vs local turnover.
           </p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
           <button className="px-6 py-2.5 bg-white shadow-sm border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#091426]">Legal Entities</button>
           <button className="px-6 py-2.5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Geo Heatmap</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Heatmap Grid (Simulated high-fidelity map) */}
        <div className="md:col-span-8 bg-[#0a1120] rounded-[2.5rem] p-12 min-h-[500px] relative overflow-hidden group/map">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)]" />
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div className="relative z-10 grid grid-cols-4 md:grid-cols-6 gap-6">
              {heatmap.map((item, i) => (
                <motion.div 
                  key={item.entityId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative cursor-pointer aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all hover:scale-110 active:scale-95 ${
                    item.exposureLevel > 5 ? 'bg-red-500/20 border-red-500/50 shadow-xl shadow-red-500/10' :
                    item.exposureLevel > 2 ? 'bg-amber-500/20 border-amber-500/50 shadow-xl shadow-amber-500/10' :
                    'bg-emerald-500/10 border-emerald-500/30'
                  }`}
                >
                   <span className="text-[10px] font-black text-white/40 mb-1">{item.country}</span>
                   <span className="text-xl font-black text-white tracking-tighter">{item.exposureLevel.toFixed(1)}%</span>
                   <div className="absolute -top-3 -right-3 whitespace-nowrap bg-white text-[#091426] px-3 py-1 rounded-lg text-[8px] font-black uppercase shadow-2xl opacity-0 group-hover/map:opacity-100 transition-opacity">
                      {item.name}
                   </div>
                </motion.div>
              ))}
           </div>

           <div className="absolute bottom-10 left-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-xs space-y-4">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={12} /> Liability Intelligence
              </p>
              <p className="text-[10px] text-slate-300 leading-relaxed italic">
                 Red zones indicate entities where cascaded risk exceeds 5% of local turnover, requiring immediate capital allocation.
              </p>
           </div>
        </div>

        {/* Legend & Details */}
        <div className="md:col-span-4 space-y-6">
           <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center">
                 Exposure Breakdown <ChevronDown size={14} />
              </h4>
              <div className="space-y-6">
                 {heatmap.sort((a,b) => b.totalRisk - a.totalRisk).slice(0, 4).map((item, i) => (
                   <div key={i} className="group/item">
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-[11px] font-black text-[#091426] uppercase">{item.name}</span>
                         <span className="text-[10px] font-black text-red-500">{formatCurrency(item.totalRisk)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${Math.min(100, (item.localRisk/item.totalRisk)*100)}%` }}
                          className="h-full bg-blue-500 relative"
                        >
                           <div className="absolute right-0 top-0 bottom-0 w-full translate-x-full bg-amber-500 opacity-60" style={{ width: `${Math.min(100, (item.cascadedRisk/item.totalRisk)*100)}%` }} />
                        </motion.div>
                      </div>
                      <div className="flex justify-between mt-1 opacity-60">
                         <span className="text-[8px] font-bold text-slate-400 uppercase">Local: {formatCurrency(item.localRisk)}</span>
                         <span className="text-[8px] font-bold text-amber-600 uppercase">Remontée: {formatCurrency(item.cascadedRisk)}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-[#091426] rounded-[2.5rem] text-white space-y-6 shadow-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Scale size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Liability Rule</p>
                    <p className="text-sm font-black uppercase">Consolidation ACTIVE</p>
                 </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                 Parent holding liability is currently computed under the **"Full Liability Cascade"** protocol for EU subsidiaries and **"Limited Resource Protection"** for APAC.
              </p>
              <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                 View Legal Hierarchy Proof
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
