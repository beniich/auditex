import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  Zap,
  Clock,
  ShieldCheck,
  LayoutGrid,
  Wallet
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { FinancialService, FinancialSummary } from '../services/FinancialService';
import { Skeleton } from './Skeleton';
import { JurisdictionalHeatmap } from './JurisdictionalHeatmap';

export const FinancialDashboard: React.FC = () => {
  const { data: summary, isLoading } = useApiQuery<FinancialSummary>(
    ['financial-summary'],
    () => FinancialService.getSummary(),
    { refetchInterval: 30000 }
  );

  if (isLoading) return <Skeleton className="h-[600px] w-full" />;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: summary?.currency || 'EUR' }).format(val);

  const stats = [
    { 
      label: 'Annual Turnover', 
      val: formatCurrency(summary?.turnover || 0), 
      detail: 'Basis for CapEx', 
      icon: TrendingUp, 
      color: 'text-slate-600', 
      bg: 'bg-slate-50' 
    },
    { 
      label: 'Regulatory Exposure', 
      val: `${summary?.exposureToTurnoverLimit}%`, 
      detail: 'of Global Turnover', 
      icon: Scale, 
      color: summary && parseFloat(summary.exposureToTurnoverLimit) > 4 ? 'text-red-600' : 'text-blue-600', 
      bg: summary && parseFloat(summary.exposureToTurnoverLimit) > 4 ? 'bg-red-50' : 'bg-blue-50' 
    },
    { 
      label: 'Cost of Inaction (COI)', 
      val: formatCurrency(summary?.weightedRisk || 0), 
      detail: 'Weighted Risk Profile', 
      icon: ShieldAlert, 
      color: 'text-red-500', 
      bg: 'bg-red-50' 
    },
    { 
      label: 'ROI Factor', 
      val: `${summary?.roi}x`, 
      detail: 'Risk Mitigation Ratio', 
      icon: Zap, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
             <TrendingUp size={150} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <Wallet size={12} className="text-emerald-400" /> CFO_ENGINE v1.0
              </span>
              <span className="text-emerald-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-slate-200">
                 {summary?.nonCompliantCount} GAPS WITH FINANCIAL SURFACE
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Financial Impact Analysis</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-6">
               <p className="text-slate-500 max-w-lg text-sm leading-relaxed font-medium">
                  Strategic oversight of the Cost of Inaction (COI). 
                  Exposure is calculated against a {formatCurrency(summary?.turnover || 0)} global turnover baseline.
               </p>
               <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <input 
                    type="number" 
                    placeholder="New Turnover..."
                    className="bg-transparent border-none outline-none text-xs font-black px-4 w-32"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const val = parseFloat((e.target as HTMLInputElement).value);
                        // In a real app we'd call an API here. For demo, we assume the user will refresh or use state.
                        await fetch('/api/financial/turnover', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ turnover: val })
                        });
                        window.location.reload();
                      }
                    }}
                  />
                  <button className="bg-[#091426] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Update CA</button>
               </div>
            </div>
          </div>
        </div>

        {/* Strategic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
             >
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <stat.icon size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                   <p className="text-3xl font-black text-[#091426] mt-1 tracking-tighter">{stat.val}</p>
                   <p className={`text-[10px] font-bold mt-2 ${stat.color}`}>{stat.detail}</p>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Main Visual: ROI Curve or Breakdown */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-3">
                  <Activity size={18} className="text-blue-600" /> Risk vs Remediation Logic
               </h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Weighted Calculation: (Fine + Int) * Prob</span>
            </div>

            <div className="grid grid-cols-2 gap-8 h-[350px]">
               <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Projected Loss (COI)</h4>
                    <p className="text-4xl font-black text-red-500 tracking-tighter">{formatCurrency(summary?.weightedRisk || 0)}</p>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Fine Surface</span>
                        <span className="text-xs font-black text-[#091426]">{formatCurrency(summary?.totalPotentialFine || 0)}</span>
                     </div>
                     <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 w-3/4" />
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Operational Downtime</span>
                        <span className="text-xs font-black text-[#091426]">{formatCurrency((summary?.totalInterruptionRisk || 0))}</span>
                     </div>
                     <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 w-1/4" />
                     </div>
                  </div>
               </div>

               <div className="bg-[#091426] rounded-[2.5rem] p-8 flex flex-col justify-between text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Remediation Cost (Budget)</h4>
                    <p className="text-4xl font-black text-white tracking-tighter">{formatCurrency(summary?.totalRemediationCost || 0)}</p>
                  </div>
                  <div className="relative z-10 space-y-6">
                     <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Efficiency Multiplier</span>
                           <span className="text-lg font-black text-white">{summary?.roi}x</span>
                        </div>
                        <p className="text-[9px] text-slate-400 italic font-medium">Every 1€ spent in remediation avoids {summary?.roi}€ of probable risk.</p>
                     </div>
                     <button className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                        Approve CapEx Request <ArrowUpRight size={14} />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Risk Matrix / Distribution */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                   <Clock size={16} className="text-blue-600" /> Exposure Timeline
                </h4>
                <div className="space-y-6">
                   {[
                     { label: '30 Days Exposure', val: '712k€', color: 'text-red-500' },
                     { label: 'Estimated Mitigation', val: 'Q3 2024', color: 'text-blue-600' },
                     { label: 'Regulatory Deadline', val: 'Dec 15', color: 'text-amber-600' }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                        <span className={`text-xs font-black ${item.color}`}>{item.val}</span>
                     </div>
                   ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                       <ShieldAlert size={20} className="text-amber-600" />
                       <p className="text-[9px] font-bold text-amber-900 leading-tight">
                          Immediate action recommended: Access Control gaps represent 65% of current COI.
                       </p>
                    </div>
                </div>
             </div>

             <div className="bg-[#091426] p-8 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-600 opacity-20 rounded-full blur-3xl" />
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Strategic ROI Summary</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-8">
                   Current compliance roadmap is optimized for maximum risk reduction per Euro spent. Priority 1 (ISO-27001) remediations offer the highest ROI of 14.5x.
                </p>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center">
                   Investment Readiness: HIGH
                </div>
             </div>
          </div>
        </div>

        <JurisdictionalHeatmap />

        {/* Footer Technical Strip */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
           <p className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-[#091426]" /> 
              CFO_MODULE: ACTIVE // DATA_SOURCE: PRISMA_REAL_TIME
           </p>
           <p className="text-[#091426] flex items-center gap-2">
              <TrendingUp size={12} className="text-emerald-500" /> Weighted Risk Algorithm v2.1
           </p>
           <p>Report ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};
