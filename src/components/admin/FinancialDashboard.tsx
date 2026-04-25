import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Activity, 
  ArrowUpRight,
  Scale,
  Zap,
  Clock,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { FinancialService, FinancialSummary } from '../../services/FinancialService';
import { Skeleton } from '../common/Skeleton';
import { JurisdictionalHeatmap } from '../risk/JurisdictionalHeatmap';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

export const FinancialDashboard: React.FC = () => {
  const { data: summary, isLoading } = useApiQuery<FinancialSummary>(
    ['financial-summary'],
    () => FinancialService.getSummary(),
    { refetchInterval: 30000 }
  );

  if (isLoading) return <div className="p-10"><Skeleton className="h-[600px] w-full rounded-[3rem]" /></div>;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: summary?.currency || 'EUR' }).format(val);

  const stats = [
    { 
      label: 'Annual Turnover', 
      val: formatCurrency(summary?.turnover || 0), 
      detail: 'Basis for CapEx', 
      icon: TrendingUp, 
      variant: 'info' as const
    },
    { 
      label: 'Exposure / Turnover', 
      val: `${summary?.exposureToTurnoverLimit}%`, 
      detail: 'of Global Turnover', 
      icon: Scale, 
      variant: summary && summary.exposureToTurnoverLimit > 4 ? 'danger' as const : 'brand' as const
    },
    { 
      label: 'Cost of Inaction (COI)', 
      val: formatCurrency(summary?.weightedRisk || 0), 
      detail: 'Weighted Risk Profile', 
      icon: ShieldAlert, 
      variant: 'danger' as const
    },
    { 
      label: 'ROI Factor', 
      val: `${summary?.roi}x`, 
      detail: 'Risk Mitigation Ratio', 
      icon: Zap, 
      variant: 'success' as const
    },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Financial Impact Analysis"
        subtitle={`Strategic oversight of the Cost of Inaction (COI). Exposure calculated against ${formatCurrency(summary?.turnover || 0)} turnover.`}
        badge="CFO_ENGINE v1.0"
        icon={Wallet}
        breadcrumb={['Admin', 'Financials', 'Impact']}
        actions={
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur p-2 rounded-2xl border border-slate-200">
            <input 
              type="number" 
              placeholder="Set Turnover..."
              className="bg-transparent border-none outline-none text-[10px] font-black px-4 w-32 uppercase tracking-widest placeholder:text-slate-300"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const val = parseFloat((e.target as HTMLInputElement).value);
                  await fetch('/api/financial/turnover', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ turnover: val })
                  });
                  window.location.reload();
                }
              }}
            />
            <Button size="sm" onClick={() => {}}>Update</Button>
          </div>
        }
      />

      {/* Strategic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <SectionCard key={i} padding="medium" className="group">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-slate-50 rounded-xl text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <stat.icon size={20} />
               </div>
               <StatusBadge label={stat.detail} variant={stat.variant} className="scale-90" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
               <p className="text-3xl font-black text-slate-900 mt-2 tracking-tighter italic">{stat.val}</p>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Risk vs Remediation */}
        <SectionCard 
          className="col-span-12 lg:col-span-8"
          title="Risk vs Remediation Logic"
          actions={<span className="text-[9px] font-mono font-black text-slate-300 uppercase">Engine: Weighted (Fine + Int) * Prob</span>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full md:h-[350px] mt-4">
             <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Projected Loss (COI)</p>
                  <p className="text-4xl font-black text-red-600 tracking-tighter">{formatCurrency(summary?.weightedRisk || 0)}</p>
                </div>
                <div className="space-y-5">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span className="text-slate-400">Potential Fines</span>
                        <span className="text-slate-900">{formatCurrency(summary?.totalPotentialFine || 0)}</span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                        <div className="h-full bg-red-500 w-3/4" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span className="text-slate-400">Op. Interruption</span>
                        <span className="text-slate-900">{formatCurrency((summary?.totalInterruptionRisk || 0))}</span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                        <div className="h-full bg-amber-500 w-1/4" />
                      </div>
                   </div>
                </div>
             </div>

             <SectionCard variant="dark" padding="large" className="flex flex-col justify-between">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Mitigation Budget (Plan)</p>
                  <p className="text-4xl font-black text-white tracking-tighter italic">{formatCurrency(summary?.totalRemediationCost || 0)}</p>
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Efficiency Factor</span>
                         <span className="text-2xl font-black text-white">{summary?.roi}x</span>
                      </div>
                      <p className="text-[9px] text-slate-400 italic">Every 1€ spent avoids {summary?.roi}€ of probable risk surface.</p>
                   </div>
                   <Button variant="primary" className="w-full py-5" icon={ArrowUpRight}>
                      Approve CapEx Request
                   </Button>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-45">
                   <DollarSign size={140} />
                </div>
             </SectionCard>
          </div>
        </SectionCard>

        {/* Right Info Matrix */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <SectionCard title="Exposure Status">
              <div className="space-y-6 mt-4">
                 {[
                   { label: '30 Days Exposure', val: '712k€', variant: 'danger' as const },
                   { label: 'Estimated Mitigation', val: 'Q3 2024', variant: 'brand' as const },
                   { label: 'Regulatory Deadline', val: 'Dec 15', variant: 'warning' as const }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{item.label}</span>
                      <StatusBadge label={item.val} variant={item.variant} className="min-w-[80px] justify-center" />
                   </div>
                 ))}
                 <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-[1.5rem] flex items-center gap-4">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><AlertTriangle size={18} /></div>
                    <p className="text-[10px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                       Critical: Access gaps represent 65% of current COI surface.
                    </p>
                 </div>
              </div>
           </SectionCard>

           <SectionCard variant="dark" className="bg-emerald-600 border-emerald-500 shadow-emerald-500/20">
              <div className="relative z-10">
                <StatusBadge label="Efficiency Optimized" variant="info" className="bg-white/10 border-white/10 text-white mb-6 w-fit" icon={Zap} />
                <p className="text-xs text-emerald-50 font-medium leading-relaxed mb-8">
                   Compliance roadmap is mathematically optimized. Priority 1 remediations offer a peak ROI of 14.5x.
                </p>
                <div className="p-4 bg-white/10 border border-white/20 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest text-center">
                   Investment Readiness: PEAK
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
                 <Activity size={180} />
              </div>
           </SectionCard>
        </div>
      </div>

      <JurisdictionalHeatmap />

      {/* Footer Technical Strip */}
      <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <ShieldCheck size={20} className="text-brand-sidebar" /> 
               <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">CFO_MODULE: ACTIVE</p>
            </div>
            <StatusBadge label="Impact Engine v2.1" variant="info" icon={TrendingUp} />
         </div>
         <div className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.3em] bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
            SIG: {Math.random().toString(36).substring(7).toUpperCase()} // PRISMA_RT_SYNC
         </div>
      </div>
    </PageWrapper>
  );
};
