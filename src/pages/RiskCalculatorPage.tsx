import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ShieldAlert, DollarSign, TrendingUp, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export const RiskCalculatorPage = () => {
  const [revenue, setRevenue] = useState(100);
  const [industry, setIndustry] = useState('Fintech');
  
  const estimatedFine = Math.round(revenue * 0.04 * 10) / 10; // Simple simulation 4% of revenue

  return (
    <div className="bg-[#091426] text-white pt-32 pb-24 min-h-screen">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10 mb-32">
        <div className="inline-flex items-center gap-2 text-amber-400 bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/20">
          <Calculator size={18} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Corporate Risk Assessment</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
          Evaluate Your <br />
          <span className="text-amber-500 italic">Exposure</span> <br />
          Instantily.
        </h1>
        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
          Calculez l'impact financier potentiel d'un incident de conformité majeur. 
          Un outil stratégique pour les CFO et les Risk Managers.
        </p>
      </section>

      {/* --- CALCULATOR --- */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
         <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Inputs */}
            <div className="p-12 bg-white/5 border border-white/10 rounded-[3.5rem] backdrop-blur-3xl space-y-12 flex flex-col justify-center">
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Annual Revenue (M€)</label>
                     <span className="text-xl font-black text-amber-500">{revenue} M€</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="1000" 
                    value={revenue} 
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
               </div>

               <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry Sector</label>
                  <div className="grid grid-cols-2 gap-4">
                     {['Fintech', 'Healthcare', 'Industry', 'Public'].map(sector => (
                        <button 
                          key={sector}
                          onClick={() => setIndustry(sector)}
                          className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            industry === sector 
                              ? 'bg-amber-500 border-amber-500 text-[#091426] shadow-xl shadow-amber-500/20' 
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                           {sector}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex gap-4">
                  <Info className="text-amber-500 flex-shrink-0" size={20} />
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                     Les amendes RGPD peuvent s'élever jusqu'à 4% du chiffre d'affaires mondial annuel. Ce calcul simule une exposition critique.
                  </p>
               </div>
            </div>

            {/* Result */}
            <motion.div 
               key={estimatedFine}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-12 lg:p-20 bg-amber-500 text-[#091426] rounded-[4rem] shadow-[0_0_80px_rgba(245,158,11,0.2)] space-y-12 flex flex-col justify-center"
            >
               <div className="text-center space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-amber-900 border-b border-amber-900/10 pb-4">Estimated Exposure Fine</h3>
                  <div className="text-7xl md:text-9xl font-black tracking-tighter leading-none">
                     {estimatedFine}M€
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-amber-900 font-extrabold text-lg uppercase tracking-tight">
                     <ShieldAlert size={28} />
                     High Risk Probability
                  </div>
                  <p className="text-[#091426]/70 text-lg font-bold leading-relaxed">
                     Votre structure financière présente une vulnérabilité critique selon les standards actuels. AuditAX peut réduire cette exposition de 85% via une conformité automatisée.
                  </p>
               </div>
               
               <button className="w-full py-6 bg-[#091426] text-white font-black uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 group">
                  Book a Mitigation Audit <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </motion.div>
         </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8 bg-white/5 rounded-[4rem] border border-white/10">
         <h2 className="text-4xl font-black uppercase tracking-tight">Ne laissez pas le risque <br />dicter votre futur.</h2>
         <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
               <CheckCircle2 size={24} className="text-emerald-500" />
               <span className="font-bold text-sm uppercase tracking-widest">ISO 27001 Ready</span>
            </div>
            <div className="flex items-center gap-3">
               <CheckCircle2 size={24} className="text-emerald-500" />
               <span className="font-bold text-sm uppercase tracking-widest">Real-time Mitigation</span>
            </div>
         </div>
      </section>
    </div>
  );
};
