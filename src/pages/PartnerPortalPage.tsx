import React from 'react';
import { motion } from 'motion/react';
import { Users, Briefcase, Award, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const PartnerPortalPage = () => {
  return (
    <div className="bg-[#091426] text-white pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center mb-32">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
            <Users size={18} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Partner Ecosystem</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
            Devenez Partenaire <br />
            <span className="text-blue-500 italic">AuditAX</span> &<br />
            Certifiez l'Élite.
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
            Rejoignez le réseau mondial d'auditeurs et d'experts certifiés AuditAX. Accédez à des outils de pointe pour décupler votre productivité et votre visibilité.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <button className="px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3">
                Rejoindre le Réseau <ArrowRight size={20} />
             </button>
             <button className="px-10 py-5 bg-white/5 text-white font-black uppercase tracking-widest rounded-full border border-white/10 hover:bg-white/10 transition-all">
                Voir les Avantages
             </button>
          </div>
        </div>

        <div className="relative">
           {/* Visual simulation of the Partner Dashboard */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             className="p-8 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-3xl shadow-2xl relative z-10"
           >
              <div className="bg-[#0f172a] rounded-[2.8rem] p-8 space-y-8 overflow-hidden">
                 <div className="flex justify-between items-center">
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditor Status</div>
                       <div className="text-2xl font-black">Expert Platinum</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-500">
                       <Award size={24} />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Client Audit: TechCorp</span>
                       </div>
                       <span className="text-[10px] font-black text-emerald-500">92%</span>
                    </div>
                    <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Risk Review: PharmaX</span>
                       </div>
                       <span className="text-[10px] font-black text-blue-500 font-mono">EN COURS</span>
                    </div>
                 </div>
                 
                 <div className="pt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Missions</div>
                       <div className="text-xl font-black">24</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Impact CRM</div>
                       <div className="text-xl font-black text-emerald-500">+18%</div>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-12 text-center">
         {[
           { icon: Briefcase, title: 'Accès Exclusif', desc: 'Accédez à des appels d\'offres haut niveau auprès de grands comptes.' },
           { icon: TrendingUp, title: 'Outils Auditeur', desc: 'Utilisez nos outils de diagnostic et de ledger pour certifier avec une confiance absolue.' },
           { icon: Award, title: 'Certification AuditAX', desc: 'Valorisez votre expertise avec les badges officiels reconnus par l\'industrie.' }
         ].map(b => (
            <div key={b.title} className="space-y-6 flex flex-col items-center">
               <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4">
                  <b.icon size={32} />
               </div>
               <h4 className="text-2xl font-black uppercase tracking-tight">{b.title}</h4>
               <p className="text-slate-400 font-medium leading-relaxed">{b.desc}</p>
            </div>
         ))}
      </section>

      {/* --- REASONS --- */}
      <section className="bg-white text-[#091426] py-32 rounded-[5rem] mx-6">
         <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4">
               <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Why Partner?</h2>
               <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">The Future of Expert-Led Audit.</h3>
            </div>
            
            <div className="grid gap-6">
               {[
                 'Validation immuable des conclusions d\'audit.',
                 'Collaboration en temps réel avec les équipes de conformité.',
                 'Génération automatisée de rapports forensiques.',
                 'Visibilité accrue sur le Hub Partenaires mondial.'
               ].map(txt => (
                  <div key={txt} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                     <ShieldCheck className="text-blue-600 flex-shrink-0" size={24} />
                     <span className="font-extrabold text-[#091426] uppercase tracking-tight text-sm">{txt}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};
