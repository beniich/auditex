import React from 'react';
import { Shield, Fingerprint, Lock, Server, Cpu, Command, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const CISOPage = () => {
  return (
    <div className="bg-[#0a0e1a] text-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6">
          <Shield className="text-blue-400" size={32} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 relative">
          Military-Grade <span className="text-blue-500">Infrastructure</span>.<br /> Agentic AI Defense.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-10">
          Laissez vos équipes de sécurité se concentrer sur l'investigation, notre IA s'occupe de la corrélation et des logs d'audit 24/7 sans la moindre faille.
        </p>
        <div className="flex gap-4">
           <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-bold uppercase tracking-widest text-xs transition">
             Explore Architecture
           </button>
           <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-xs transition">
             Parler à un confrère
           </button>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-[#111827] border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500 transition">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition"><Fingerprint size={120} /></div>
            <Lock className="text-blue-400 mb-6" size={32} />
            <h3 className="text-2xl font-black mb-3">SHA-256 Ledger</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Immutabilité totale. Chaque événement système est haché en SHA-256 formant une chaîne forensique incorruptible pour l'audit.</p>
         </div>
         <div className="bg-[#111827] border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500 transition">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition"><Cpu size={120} /></div>
            <Brain className="text-blue-400 mb-6" size={32} />
            <h3 className="text-2xl font-black mb-3">AI Agentic 0 Hallucination</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Notre moteur RAG analyse les frameworks (ISO 27001, SOC2) et valide vos contrôles uniquement avec des preuves factuelles d'infrastructure.</p>
         </div>
         <div className="bg-[#111827] border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500 transition">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition"><Server size={120} /></div>
            <Command className="text-blue-400 mb-6" size={32} />
            <h3 className="text-2xl font-black mb-3">API-First Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Connecteurs directs natifs vers AWS, GCP, et Azure pour lire vos configurations cloud de manière continue sans friction (Read-only).</p>
         </div>
      </section>

      {/* Trust & Pipeline */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center border-t border-white/10">
         <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-12">Zero Hallucination Defense Pipeline</h2>
         <div className="bg-[#111827] border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="flex-1 border border-white/5 bg-[#0a0e1a] rounded-2xl p-6 text-center">
               <span className="text-xs font-mono text-emerald-400 uppercase">Input Node</span>
               <div className="text-xl font-bold mt-2">Cloud Connectors</div>
            </div>
            <ArrowRight className="text-slate-500 hidden md:block" />
            <div className="flex-1 border border-blue-500/30 bg-blue-900/10 rounded-2xl p-6 text-center relative shadow-[0_0_30px_rgba(59,130,246,0.1)]">
               <span className="text-xs font-mono text-blue-400 uppercase">Vérification</span>
               <div className="text-xl font-bold mt-2">Agentic RAG Engine</div>
            </div>
            <ArrowRight className="text-slate-500 hidden md:block" />
            <div className="flex-1 border border-white/5 bg-[#0a0e1a] rounded-2xl p-6 text-center">
               <span className="text-xs font-mono text-white uppercase">Output Node</span>
               <div className="text-xl font-bold mt-2">Ledger Inscription</div>
            </div>
         </div>
      </section>
    </div>
  );
};
