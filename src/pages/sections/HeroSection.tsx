import React from 'react';
import { motion } from 'motion/react';
import { Network, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <section className="relative bg-[#0a0e1a] text-white overflow-hidden py-32 lg:py-48 min-h-[90vh] flex items-center">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0a0e1a] to-[#0a0e1a]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
                        <ShieldCheck size={16} /> Conformité Absolue
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white">
                        L'Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Agentique</span> au service de l'Audit.
                    </h1>
                    
                    <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-lg">
                        Surveillez, analysez et rectifiez vos écarts de conformité en temps réel avec une infrastructure de qualité militaire à 0 hallucination.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button onClick={() => navigate('/demo')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-widest rounded-full transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                            Demander une Démo <Network size={18} />
                        </button>
                        <button onClick={() => navigate('/about')} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm uppercase tracking-widest rounded-full transition flex items-center justify-center">
                            Découvrir l'Architecture
                        </button>
                    </div>
                </motion.div>

                {/* Simulated Force Graph Visualization */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block h-[500px]"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[400px] h-[400px] rounded-full border border-blue-500/30 absolute animate-[spin_20s_linear_infinite]"></div>
                        <div className="w-[300px] h-[300px] rounded-full border border-emerald-500/30 absolute animate-[spin_15s_reverse_linear_infinite]"></div>
                        <div className="w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 to-blue-600/20 rounded-full blur-[100px] absolute"></div>
                        
                        {/* Center Node */}
                        <div className="w-24 h-24 bg-[#0a0e1a] border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] z-20">
                            <ShieldCheck size={40} className="text-emerald-400" />
                        </div>
                        
                        {/* Orbiting Nodes Mockup */}
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`absolute w-12 h-12 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center z-10`} style={{ animationDelay: `${i * 0.5}s`, transform: `rotate(${i * 60}deg) translateY(-150px) rotate(-${i * 60}deg)` }}>
                                <Network size={20} className="text-blue-400" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
