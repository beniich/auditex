import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, PieChart, ShieldCheck, ArrowUpRight, CheckCircle2, Calculator } from 'lucide-react';

const kpis = [
  { label: 'Real-Time Financial Exposure', value: '$1.2B', description: 'Actifs monitorés en continu.' },
  { label: 'Compliance ROI', value: '320%', description: 'Retour sur investissement moyen.' },
  { label: 'Audit Readiness Score', value: '94/100', description: 'Prêt pour l\'audit instantanément.' }
];

export const CFOPage = () => {
  return (
    <div className="bg-[#f8fafc] text-[#091426] pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center mb-32">
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <Calculator size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">CFO Financial Strategy</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
            Quantify Your <br />
            Regulatory Risk <br />
            <span className="text-blue-600">in Dollars,</span> <br />
            Not Just Alerts.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
            Transformez la conformité d'un centre de coût en un avantage stratégique. 
            Visibilité en temps réel sur l'exposition financière et ROI prouvé.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <button className="px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                Calculate Your ROI
             </button>
             <button className="px-10 py-5 bg-white text-[#091426] font-black uppercase tracking-widest rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
                Watch Overview
             </button>
          </div>
        </div>

        <div className="lg:col-span-5">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative p-1 bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl"
           >
              <div className="bg-slate-50 rounded-[3.2rem] p-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Risk Exposure</div>
                        <div className="text-5xl font-black text-[#091426] tracking-tighter">$2.4M</div>
                    </div>
                    <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1">
                        <TrendingUp size={12} /> High
                    </div>
                 </div>
                 
                 <div className="h-48 flex items-end gap-3">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: i * 0.1 }}
                              className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg group-hover:bg-blue-700 transition-colors"
                            />
                        </div>
                    ))}
                 </div>
                 
                 <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                    <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Potential Savings</div>
                    <div className="text-emerald-500 font-black text-xl">$850k</div>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* --- KPI GRID --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-32">
         {kpis.map((k, i) => (
            <motion.div 
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4"
            >
               <div className="text-xs font-black uppercase tracking-widest text-slate-400">{k.label}</div>
               <div className="text-5xl font-black text-[#091426] tracking-tighter">{k.value}</div>
               <p className="text-slate-500 font-medium text-sm">{k.description}</p>
            </motion.div>
         ))}
      </section>

      {/* --- STRATEGIC VALUE --- */}
      <section className="bg-[#091426] text-white py-32 rounded-[5rem] mx-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
           <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-black uppercase tracking-tight">Financial Impact & <br />Strategic Value</h2>
              <ul className="space-y-6">
                 {[
                   { title: 'Unify Risk Data', desc: 'Consolidez les systèmes fragmentés en une source unique de vérité financière.' },
                   { title: 'Forecast Penalties', desc: 'Prédisez les amendes réglementaires potentielles et allouez les ressources efficacement.' },
                   { title: 'Automate Board Reporting', desc: 'Générez des rapports exécutifs en un clic, focalisés sur les indicateurs de performance financiers.' }
                 ].map(item => (
                   <li key={item.title} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white">
                         <CheckCircle2 size={20} />
                      </div>
                      <div>
                         <div className="font-extrabold text-lg uppercase tracking-tight">{item.title}</div>
                         <p className="text-slate-400 font-medium">{item.desc}</p>
                      </div>
                   </li>
                 ))}
              </ul>
           </div>
           
           <div className="flex-1 grid grid-cols-2 gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl" />
                 <span className="font-black text-[10px] uppercase tracking-widest">GlobalBank</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl" />
                 <span className="font-black text-[10px] uppercase tracking-widest">PharmaGiant</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl" />
                 <span className="font-black text-[10px] uppercase tracking-widest">TechCorp</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl" />
                 <span className="font-black text-[10px] uppercase tracking-widest">EnergyDyn</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
