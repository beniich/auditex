import React from 'react';
import { motion } from 'motion/react';
import { Play, Calendar, Users, ArrowRight, Shield, Video, Bell } from 'lucide-react';

const webinars = [
  {
    title: 'Audit Industriel 2024 : Le rôle de l\'IA Agentique',
    date: '15 Mai 2024',
    time: '14:00 (Paris)',
    speakers: ['Alex Rivers (CISO)', 'Dr. Sarah Chen (AI Lead)'],
    badge: 'LIVE',
    image: 'https://images.unsplash.com/photo-1591115765373-520b7a21769b?auto=format&fit=crop&q=80&w=400'
  },
  {
    title: 'Conformer à ISO 27001 avec un Ledger Immuable',
    date: '22 Mai 2024',
    time: '10:00 (Paris)',
    speakers: ['Marc Laurent (Auditeur Certifié)', 'Sophie Valmont (Legal)'],
    badge: 'EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1540575861501-7c001173a271?auto=format&fit=crop&q=80&w=400'
  }
];

export const WebinarPage = () => {
  return (
    <div className="bg-white text-[#091426] pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10 mb-32">
        <div className="inline-flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
          <Video size={18} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Corporate Compliance Webinars</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
          Mastering <br />
          <span className="text-rose-600 italic">Compliance</span> <br />
          at Scale.
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
          Accédez aux insights exclusifs des leaders de l'industrie. 
          Découvrez comment l'IA et la cryptographie transforment l'audit d'entreprise.
        </p>
      </section>

      {/* --- FEATURED WEBINAR --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
         <div className="relative rounded-[4rem] overflow-hidden bg-[#091426] text-white flex flex-col lg:flex-row items-stretch border border-[#1e293b]">
            <div className="flex-1 p-12 lg:p-20 space-y-8 flex flex-col justify-center">
               <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-rose-600 rounded text-[9px] font-black uppercase tracking-widest animate-pulse">Live Tomorrow</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Executive Series</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">ROI de la Conformité : Stratégies CFO 2024</h2>
               <div className="flex gap-8">
                  <div className="flex items-center gap-3">
                     <Calendar className="text-rose-600" size={20} />
                     <span className="text-sm font-bold uppercase tracking-widest">12 AVRIL</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Users className="text-rose-600" size={20} />
                     <span className="text-sm font-bold uppercase tracking-widest">1,2k INSCRITS</span>
                  </div>
               </div>
               <div className="pt-4">
                  <button className="px-10 py-5 bg-white text-[#091426] font-black uppercase tracking-widest rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-2xl flex items-center gap-4">
                     Réserver ma place <ArrowRight size={20} />
                  </button>
               </div>
            </div>
            
            <div className="flex-1 relative min-h-[400px]">
               <img 
                 src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800" 
                 alt="Webinar Hero" 
                 className="absolute inset-0 w-full h-full object-cover opacity-60"
               />
               <div className="absolute inset-0 bg-gradient-to-l lg:bg-gradient-to-r from-[#091426] via-[#091426]/20 to-transparent" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform">
                     <Play size={32} fill="white" className="ml-1" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- UPCOMING LIST --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 mb-32">
         {webinars.map((w, i) => (
            <motion.div 
               key={w.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="group cursor-default"
            >
               <div className="aspect-video relative rounded-[2.5rem] overflow-hidden mb-8 border border-slate-200 shadow-lg">
                  <img src={w.image} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-white rounded-full text-[#091426] text-[10px] font-black uppercase tracking-widest shadow-lg">
                     {w.badge}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="px-6 py-3 bg-white text-[#091426] rounded-full text-xs font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform">Inscrivez-vous</span>
                  </div>
               </div>
               
               <div className="space-y-4 px-2">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                     <span>{w.date}</span>
                     <span className="w-1 h-1 rounded-full bg-slate-200" />
                     <span>{w.time}</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight leading-none group-hover:text-rose-600 transition-colors">{w.title}</h3>
                  <div className="flex gap-4 pt-2">
                     {w.speakers.map(s => (
                        <div key={s} className="px-3 py-1 bg-slate-100 rounded text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">{s}</div>
                     ))}
                  </div>
               </div>
            </motion.div>
         ))}
      </section>
    </div>
  );
};
