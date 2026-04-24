import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const personas = [
  { role: 'CISO / RSSI', path: '/ciso', desc: 'Protection de l\'infrastructure, gestion du risque cyber et zero-trust.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80&fit=crop' },
  { role: 'CFO / DAF', path: '/cfo', desc: 'ROI sécurité, optimisation des coûts et KPI financiers du risque.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80&fit=crop' },
  { role: 'CLO / Dpo', path: '/clo', desc: 'Conformité légale, audits réglementaires et gouvernance RPMP.', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&q=80&fit=crop' }
];

export const PersonasSection = () => {
    const navigate = useNavigate();
    return (
        <section className="py-32 bg-gradient-to-b from-[#0a0e1a] to-[#111827]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Adopté par le Comex</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {personas.map((p, i) => (
                        <div key={i} onClick={() => navigate(p.path)} className="relative h-[450px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-all"></div>
                            <img src={p.img} alt={p.role} className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                            
                            <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col items-start bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{p.role}</h3>
                                <p className="text-slate-300 text-sm mb-6 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden">{p.desc}</p>
                                <button className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest">
                                    Découvrir le portail <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
