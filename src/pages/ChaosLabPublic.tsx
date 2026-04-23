import React from 'react';
import { motion } from 'motion/react';
import { Beaker, AlertTriangle, ShieldCheck, Zap, ArrowRight, Bug, Ghost } from 'lucide-react';

export const ChaosLabPublic = () => {
  return (
    <div className="bg-black text-white pt-32 pb-24 overflow-hidden relative">
      {/* Simulation of "Digital Decay" or "Chaos" colors */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px]" />
      </div>

      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10 mb-32 relative z-10">
        <div className="inline-flex items-center gap-2 text-purple-400 bg-purple-400/10 px-4 py-2 rounded-full border border-purple-400/20">
          <Beaker size={18} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">AuditAX Chaos Lab (Public Teaser)</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
          Break the <br />
          <span className="text-purple-600 italic">Unbreakable.</span>
        </h1>
        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
          Bienvenue dans le laboratoire d'expérimentation de sécurité offensive d'AuditAX. 
          Nous simulons le chaos pour garantir votre résilience absolue.
        </p>
      </section>

      {/* --- EXPERIMENTS GRID --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 mb-32">
         {[
           { 
             icon: Ghost, 
             title: 'Red Team Simulations', 
             desc: 'Attaques par injection de prompt et tentatives de contournement IA neutralisées en temps réel.',
             color: 'text-purple-500',
             border: 'border-purple-500/20'
           },
           { 
             icon: Bug, 
             title: 'Zero-Day Stress Test', 
             desc: 'Simulation de vulnérabilités critiques non répertoriées pour tester l\'auto-remédiation de notre OS.',
             color: 'text-red-500',
             border: 'border-red-500/20'
           }
         ].map((exp, i) => (
            <motion.div 
               key={exp.title}
               initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className={`p-12 rounded-[3.5rem] bg-white/5 border ${exp.border} space-y-8 backdrop-blur-3xl group`}
            >
               <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center ${exp.color} group-hover:scale-110 transition-transform`}>
                  <exp.icon size={32} />
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tight">{exp.title}</h3>
               <p className="text-slate-400 text-lg font-medium leading-relaxed">{exp.desc}</p>
               <div className="pt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                     <AlertTriangle size={14} className="text-amber-500" /> Advanced Simulation Active
                  </span>
               </div>
            </motion.div>
         ))}
      </section>

      {/* --- TECH SPECS --- */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5 text-center">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="space-y-2">
               <div className="text-2xl font-black">4k+</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Threat Models</div>
            </div>
            <div className="space-y-2">
               <div className="text-2xl font-black">99.9%</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Neutralization</div>
            </div>
            <div className="space-y-2">
               <div className="text-2xl font-black">&lt; 1s</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Response Time</div>
            </div>
            <div className="space-y-2">
               <div className="text-2xl font-black">∞</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Immutability</div>
            </div>
         </div>
      </section>
    </div>
  );
};
