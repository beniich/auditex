import React from 'react';
import { motion } from 'motion/react';
import { Gavel, Scale, FileText, Globe, Shield, CheckCircle } from 'lucide-react';

export const CLOPage = () => {
  return (
    <div className="bg-white text-[#091426] pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10 mb-32">
        <div className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          <Gavel size={18} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">CLO Governance & Legal</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
          Gouvernance et <br />
          <span className="text-indigo-600">Juridique</span> Mondial.
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
          Assurez une conformité réglementaire totale à travers toutes les juridictions. 
          Des pistes d'audit immuables pour une protection juridique sans faille.
        </p>
        <div className="flex justify-center gap-4 pt-6">
           <button className="px-10 py-5 bg-[#091426] text-white font-black uppercase tracking-widest rounded-full hover:bg-indigo-600 transition-all shadow-xl">
              Request Legal Briefing
           </button>
           <button className="px-10 py-5 bg-slate-100 text-[#091426] font-black uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all">
              Watch Compliance Tour
           </button>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
         {[
           { icon: Scale, title: 'Compliance Monitoring', desc: 'Surveillance proactive des changements législatifs mondiaux.' },
           { icon: FileText, title: 'Immutable Proof', desc: 'Preuves d\'audit scellées par cryptographie pour les litiges.' },
           { icon: Globe, title: 'Multi-Jurisdictional', desc: 'Gestion centralisée des réglementations HIPAA, GDPR, SOC2.' },
           { icon: Shield, title: 'Risk Sovereignty', desc: 'Maîtrise totale de l\'intégrité des données légales.' }
         ].map((p, i) => (
           <div key={p.title} className="p-10 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 space-y-6">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                 <p.icon size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">{p.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{p.desc}</p>
           </div>
         ))}
      </section>

      {/* --- DETAILED VIEW --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-[#091426] rounded-[4rem] text-white flex flex-col lg:flex-row items-center gap-20">
         <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Engineered for <br />Zero-Compromise Compliance</h2>
            <p className="text-slate-400 text-lg">
               Notre plateforme utilise un processus de vérification en boucle fermée, exploitant le ledger immuable comme source unique de vérité.
            </p>
            <div className="grid gap-4">
               {['Automated Regulatory Mapping', 'Real-time Anomaly Detection', 'Certified Forensic Reporting'].map(txt => (
                 <div key={txt} className="flex items-center gap-3">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">{txt}</span>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="flex-1 relative">
            {/* Visual simulation of a legal document/report */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-3xl space-y-6">
               <div className="flex justify-between items-center pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                     <FileText size={20} className="text-indigo-400" />
                     <span className="font-black text-xs uppercase tracking-[0.2em]">Audit AX Certification Log</span>
                  </div>
                  <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-widest">Verified</div>
               </div>
               <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                  <div className="h-2 w-full bg-white/5 rounded-full" />
                  <div className="h-2 w-1/2 bg-indigo-500/30 rounded-full" />
               </div>
               <div className="pt-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-widest">Crypto-Signature</div>
                     <div className="text-[9px] font-mono text-slate-500 truncate w-48">SHA256: 7f8c9d...eb4a1</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
