import React from 'react';
import { motion } from 'motion/react';
import { Wallet, CreditCard, Activity, Clock, Terminal } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useQuota } from '../../hooks/useQuota';

export const QuotaDashboard = () => {
  const { balance, logs, isLow } = useQuota();

  const maxBudget = 50.00; // Hardcoded max budget for now
  const spent = maxBudget - balance;
  const progressPercent = Math.min(100, Math.max(0, (spent / maxBudget) * 100));

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <GlassCard className="p-8 border-white/5 bg-[#091426] relative overflow-hidden">
         <div className="flex justify-between items-start mb-8 relative z-10">
           <div className="flex flex-col">
             <div className="flex items-center gap-2 mb-2">
               <Wallet size={16} className={isLow ? 'text-red-500' : 'text-blue-400'} />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available AI Budget</span>
             </div>
             <h3 className={`text-4xl font-black tracking-tighter ${isLow ? 'text-red-500' : 'text-white'}`}>
               ${balance.toFixed(2)}
             </h3>
           </div>
           <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 rounded-xl flex items-center gap-2 transition-all">
             <CreditCard size={14} className="text-blue-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Add Quota</span>
           </button>
         </div>

         <div className="relative z-10 w-full bg-white/10 rounded-full h-2 mb-2">
           <div 
             className={`h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-blue-500'}`} 
             style={{ width: `${progressPercent}%` }}
           />
         </div>
         <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 relative z-10">
           <span>${spent.toFixed(2)} Used</span>
           <span>${maxBudget.toFixed(2)} Total</span>
         </div>
      </GlassCard>

      <GlassCard className="p-8 border-white/5 flex-1 flex flex-col">
         <div className="flex items-center gap-2 mb-6">
           <Activity size={16} className="text-blue-400" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usage History</span>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
           {logs.length === 0 ? (
             <div className="text-center text-slate-500 text-xs py-10 uppercase tracking-widest font-black">No recent AI operations</div>
           ) : (
             logs.map(log => (
               <div key={log.id} className="flex flex-col p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all">
                 <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                     <Terminal size={12} className="text-indigo-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white">{log.action || 'AI OPERATION'}</span>
                   </div>
                   <span className="text-[12px] font-black font-mono text-amber-400">-${log.cost.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                   <span className="flex items-center gap-1"><Clock size={10} /> {new Date(log.timestamp).toLocaleTimeString()}</span>
                   <span>{log.loopCount > 1 ? `${log.loopCount} CYCLES` : '1 CYCLE'}</span>
                 </div>
               </div>
             ))
           )}
         </div>
      </GlassCard>
    </div>
  );
};
