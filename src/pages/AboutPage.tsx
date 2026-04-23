import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Zap, Rocket, CheckCircle2, History } from 'lucide-react';

const timeline = [
  { year: '2018', title: 'Foundation & First Ledger', desc: 'Lancement du premier ledger cryptographique pour la conformité automatisée.' },
  { year: '2020', title: 'AI-Driven Risk Engine', desc: 'Intégration de l\'analyse prédictive pour identifier les menaces financières.' },
  { year: '2022', title: 'Global Expansion', desc: 'SHA-256 complet et déploiement dans 15 juridictions mondiales.' },
  { year: '2024', title: 'Agentic AI RA6', desc: 'Lancement de l\'intelligence de niveau militaire pour la conformité absolue.' }
];

export const AboutPage = () => {
  return (
    <div className="bg-white text-[#091426] pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10 mb-32">
        <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <Shield size={18} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">About AuditAX Company</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
          Pioneering the <br />
          <span className="text-blue-600 italic">Future</span> of <br />
          Compliance.
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
          Nous redéfinissons la gestion des risques financiers par la technologie. 
          Une mission : transformer la conformité d'un fardeau en un levier de croissance.
        </p>
      </section>

      {/* --- TIMELINE --- */}
      <section className="max-w-5xl mx-auto px-6 mb-32 relative">
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
         <div className="space-y-24">
            {timeline.map((item, i) => (
               <motion.div 
                 key={item.year}
                 initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
               >
                  <div className="flex-1 text-center md:text-left">
                     <div className="text-4xl font-black text-blue-600 mb-2">{item.year}</div>
                     <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                     <p className="text-slate-500 font-medium">{item.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white shadow-xl relative z-10 hidden md:flex items-center justify-center">
                      <History size={18} className="text-white" />
                  </div>
                  <div className="flex-1" />
               </motion.div>
            ))}
         </div>
      </section>

      {/* --- VALUES --- */}
      <section className="bg-slate-50 py-32">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
               <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Our Core Values</h2>
               <h3 className="text-5xl font-black uppercase tracking-tight text-[#091426]">Engineer for Excellence</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
               <div className="p-12 bg-white rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                     <Target size={32} />
                  </div>
                  <h4 className="text-3xl font-black uppercase tracking-tight">Technical Superiority</h4>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">
                     Nous utilisons exclusivement les standards de sécurité les plus élevés (SHA-256, RSA-4096) pour garantir l'intégrité absolue de vos données d'audit.
                  </p>
               </div>
               
               <div className="p-12 bg-white rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                     <Zap size={32} />
                  </div>
                  <h4 className="text-3xl font-black uppercase tracking-tight">Agentic Agility</h4>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">
                     L'IA n'est pas un gadget, c'est notre moteur de décision. Nos agents RA6 travaillent en continu pour anticiper chaque faille réglementaire.
                  </p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
