import React from 'react';

const articles = [
  { title: "L'ère de l'Audit Continu", category: "Méthodologie", author: "H. Dubois" },
  { title: "Zero Trust & Conformité ISO", category: "Sécurité", author: "M. Lefebvre" },
  { title: "ROI d'un Ledger Immuable", category: "Finance", author: "S. Rossi" },
];

export const ComplianceAcademySection = () => {
    return (
        <section className="py-32 bg-[#111827] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Compliance Academy</h2>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Dernières Insights.</h3>
                    </div>
                    <button className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition">
                        Voir tout le blog
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((art, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group cursor-pointer">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 block">{art.category}</span>
                            <h4 className="text-2xl font-bold text-white mb-10 leading-snug group-hover:text-emerald-400 transition-colors">{art.title}</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-white/20 bg-slate-800"></div>
                                <span className="text-sm text-slate-400 font-medium">Par {art.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
