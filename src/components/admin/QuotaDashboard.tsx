import React from 'react';
import { motion } from 'motion/react';
import { Wallet, CreditCard, Activity, Clock, Terminal } from 'lucide-react';
import { useQuota } from '../../hooks/useQuota';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

export const QuotaDashboard: React.FC = () => {
  const { balance, limit, logs, isLow } = useQuota();

  const spent = Math.max(0, limit - balance);
  const progressPercent = Math.min(100, Math.max(0, (spent / limit) * 100));

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <SectionCard variant="dark" padding="large">
         <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={16} className={isLow ? 'text-red-500' : 'text-blue-400'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Available AI Budget</span>
              </div>
              <h3 className={`text-5xl font-black tracking-tighter italic ${isLow ? 'text-red-500' : 'text-white'}`}>
                ${balance.toFixed(2)}
              </h3>
            </div>
            <Button variant="secondary" size="sm" icon={CreditCard} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
               Top Up
            </Button>
         </div>

         <div className="relative z-10 w-full bg-white/5 rounded-full h-2 mb-3 border border-white/5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className={`h-full shadow-lg ${isLow ? 'bg-red-500 shadow-red-500/20' : 'bg-blue-600 shadow-blue-500/20'}`} 
            />
         </div>
         <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 relative z-10">
            <span>${spent.toFixed(2)} Depleted</span>
            <span>${limit.toFixed(2)} Threshold</span>
         </div>
         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
            <Wallet size={120} />
         </div>
      </SectionCard>

      <SectionCard 
        title="Usage History" 
        className="flex-1"
        actions={<StatusBadge label={`${logs.length} Operations`} variant="info" className="scale-90" />}
      >
         <div className="overflow-y-auto max-h-[500px] pr-2 space-y-4 custom-scrollbar mt-4">
            {logs.length === 0 ? (
              <div className="text-center text-slate-400 py-20 px-8">
                 <Terminal size={32} className="mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No active forensic streams</p>
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex flex-col p-5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-[1.25rem] transition-all group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:text-blue-600 transition-colors">
                          <Terminal size={12} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{log.action || 'AI_KERNEL_OP'}</span>
                    </div>
                    <span className="text-xs font-black font-mono text-blue-600">-${log.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-3">
                    <span className="flex items-center gap-2"><Clock size={12} /> {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{log.loopCount > 1 ? `${log.loopCount} CYCLES` : '1 CYCLE'}</span>
                  </div>
                </div>
              ))
            )}
         </div>
      </SectionCard>
    </div>
  );
};
