import React from 'react';
import { Lock, Brain, Eye, DollarSign, Compass } from 'lucide-react';

const pillars = [
  { icon: Lock, title: 'Immutabilité', desc: 'Cryptographic Ledger immuable pour tracer chaque événement.' },
  { icon: Brain, title: 'Intelligence', desc: 'IA Agentique RAG avancée sans hallucination.' },
  { icon: Eye, title: 'Visibilité', desc: 'Tableau de bord unifié pour sécuriser l\'ensemble.' },
  { icon: DollarSign, title: 'Finance', desc: 'Évaluation financière en temps réel du risque.' },
  { icon: Compass, title: 'Guidance', desc: 'Remédiation proactive via copilote intelligent.' },
];

export const PillarsSection = () => {
    return (
        <section className="py-32 bg-[#0a0e1a] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Les 5 Piliers</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">La conformité n'est plus une contrainte. C'est votre atout premier.</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {pillars.map((p, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 group cursor-default">
                            <div className="w-16 h-16 bg-[#0a0e1a] rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-emerald-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all">
                                <p.icon size={28} className="text-emerald-400" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{p.title}</h4>
                            <p className="text-slate-400 leading-relaxed font-medium">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
