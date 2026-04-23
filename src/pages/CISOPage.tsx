import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Cpu, Network, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Immutable SHA-256 Ledger',
    description: 'Chaque transaction, mise à jour de politique ou changement de configuration est ancré dans un ledger protégé contre toute altération.'
  },
  {
    icon: Zap,
    title: 'Agentic AI Zero-Hallucination',
    description: 'Nos modèles IA sont entraînés sur des données vérifiées, fournissant une détection des menaces et une analyse de conformité sans erreur.'
  },
  {
    icon: Network,
    title: 'Dynamic Force Graph',
    description: 'Visualisation interactive et en temps réel des interdépendances à travers tout votre écosystème d\'entreprise.'
  }
];

export const CISOPage = () => {
  return (
    <div className="bg-white text-[#091426] pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center mb-32">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <Shield size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">CISO Strategy & Resilience</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
            Military-Grade <br />
            Infrastructure, <br />
            <span className="text-blue-600">Agentic AI Defense.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
            Sécurisez votre entreprise avec l'OS de conformité AuditAX, doté d'un ledger SHA-256 immuable pour une gestion des risques inégalée.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <button className="px-8 py-4 bg-[#091426] text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-xl">
                Explore Security Architecture
             </button>
             <button className="px-8 py-4 bg-slate-100 text-[#091426] font-black uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all">
                Speak to a Peer
             </button>
          </div>
        </div>

        <div className="relative">
           {/* Graphical element representing the "Defense Pipeline" */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10 space-y-8">
                 <div className="flex justify-center mb-12">
                   <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600">
                     <Cpu size={48} className="animate-pulse" />
                   </div>
                 </div>
                 
                 {/* Logic Engine diagram simulation */}
                 <div className="flex items-center gap-4">
                    <div className="flex-1 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">Ingest</div>
                    <ArrowRight size={16} className="text-slate-300" />
                    <div className="flex-1 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest">Logic Engine</div>
                    <ArrowRight size={16} className="text-slate-300" />
                    <div className="flex-1 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">Output</div>
                 </div>
                 
                 <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Zero Hallucination AI Defense Pipeline</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
             {securityFeatures.map((f, i) => (
                <div key={f.title} className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                   <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                      <f.icon size={32} />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">{f.title}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">{f.description}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- CERTIFICATIONS --- */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center space-y-16">
         <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Global Security Standards</h2>
         <div className="flex flex-wrap justify-between gap-12 opacity-40 grayscale items-center">
            <span className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">ISO 27001</span>
            <span className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">SOC 2 Type II</span>
            <span className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">GDPR</span>
            <span className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">PCI DSS</span>
            <span className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">AES-256</span>
         </div>
      </section>
    </div>
  );
};
