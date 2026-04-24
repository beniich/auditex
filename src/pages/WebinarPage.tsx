import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export const WebinarPage = () => {
    const [timeLeft, setTimeLeft] = useState({ d: 14, h: 22, m: 45, s: 12 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                let { d, h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 23; d--; }
                if (d < 0) { clearInterval(interval); return { d:0, h:0, m:0, s:0 }; }
                return { d, h, m, s };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const format = (n: number) => n.toString().padStart(2, '0');

    return (
        <div className="bg-[#050505] text-white min-h-screen pt-20">
            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-full">
                        Live Event • Chaos Engineering
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                        Watch Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Break</span> The System.
                    </h1>
                    <p className="text-xl text-slate-400 font-medium">
                        Rejoignez notre Red Team en direct pour voir comment l'AuditAX Ledger résiste aux injections de prompt et attaques par corruption de données.
                    </p>
                    
                    <div className="flex items-center gap-4 py-6">
                        <div className="flex flex-col"><span className="text-4xl font-black">{format(timeLeft.d)}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Jours</span></div>
                        <span className="text-2xl text-slate-600">:</span>
                        <div className="flex flex-col"><span className="text-4xl font-black">{format(timeLeft.h)}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Heures</span></div>
                        <span className="text-2xl text-slate-600">:</span>
                        <div className="flex flex-col"><span className="text-4xl font-black">{format(timeLeft.m)}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Minutes</span></div>
                        <span className="text-2xl text-slate-600">:</span>
                        <div className="flex flex-col"><span className="text-4xl font-black text-red-500">{format(timeLeft.s)}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Secondes</span></div>
                    </div>

                    <div className="aspect-video bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center group cursor-pointer overflow-hidden relative">
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition"></div>
                        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center group-hover:scale-110 transition">
                            <Play fill="currentColor" className="text-red-500 ml-1" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0e1a] border border-white/10 p-10 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)]">
                    <div className="absolute top-0 w-full left-0 h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
                    <h3 className="text-2xl font-black uppercase mb-2">Join the Live Session</h3>
                    <p className="text-sm text-slate-400 mb-8">Places limitées. Réservé aux CISO et Auditeurs.</p>
                    
                    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Prénom</label>
                                <input type="text" className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Nom</label>
                                <input type="text" className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Email Professionnel</label>
                            <input type="email" required className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Entreprise</label>
                            <input type="text" className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Job Title</label>
                            <select className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition text-white">
                                <option>CISO / RSSI</option>
                                <option>Partner / Auditor</option>
                                <option>CFO / DAF</option>
                                <option>Autre</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm rounded-xl py-4 transition mt-4 shadow-lg shadow-red-600/20">
                            Register Now
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};
