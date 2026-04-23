import React from 'react';
import { motion } from 'motion/react';
import { Shield, Brain, Eye, DollarSign, Compass, ArrowRight, Sparkles, Play, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    icon: Lock,
    title: 'Immutabilité',
    description: 'Cryptographic Ledger immuable. Chaque transaction est scellée et vérifiable pour toujours.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Brain,
    title: 'Intelligence',
    description: 'IA RAG avancée. Analyse contextuelle et prédictive des risques en temps réel.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: Eye,
    title: 'Visibilité',
    description: 'Tableau de bord CFO unifié. Vue globale et granulaire sur tous les actifs et flux financiers.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    icon: DollarSign,
    title: 'Finance',
    description: 'Optimisation des coûts et conformité fiscale. Automatisation des processus financiers complexes.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    icon: Compass,
    title: 'Guidance',
    description: 'Conseil proactif et alertes réglementaires. Restez en avance sur les changements normatifs.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  }
];

const personas = [
  {
    title: 'CISO',
    subtitle: 'Chief Information Security Officer',
    focus: 'Sécurité et Réséilience',
    description: 'Protection des données critiques et réponse aux incidents.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    link: '/ciso'
  },
  {
    title: 'CFO',
    subtitle: 'Chief Financial Officer',
    focus: 'Performance et Conformité',
    description: 'Maîtrise des risques financiers et reporting auditable.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    link: '/cfo'
  },
  {
    title: 'CLO',
    subtitle: 'Chief Legal Officer',
    focus: 'Gouvernance et Juridique',
    description: 'Assurance de la conformité réglementaire mondiale.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    link: '/clo'
  }
];

export const LandingPage = () => {
  return (
    <div className="bg-[#091426] text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Force Graph Background Simulation */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none translate-x-20">
            <svg viewBox="0 0 800 800" className="w-full h-full">
                <defs>
                   <radialGradient id="hero-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                   </radialGradient>
                </defs>
                <circle cx="400" cy="400" r="300" fill="url(#hero-grad)" />
                {/* Random nodes/lines */}
                {[...Array(30)].map((_, i) => (
                    <g key={i}>
                        <circle cx={150 + Math.random() * 500} cy={150 + Math.random() * 500} r="2" fill="#60a5fa" />
                        <line x1="400" y1="400" x2={150 + Math.random() * 500} y2={150 + Math.random() * 500} stroke="#1e3a8a" strokeWidth="0.5" />
                    </g>
                ))}
            </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400"
            >
              <Sparkles size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">IA Agentique Certifiée RA6</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase"
            >
              L'Intelligence <br />
              <span className="text-blue-600 italic">Agentique</span> <br />
              pour la <br />
              <span className="text-emerald-500">Conformité</span> <br />
              <span className="text-white">Absolue</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl"
            >
              Pilotez votre entreprise avec un OS de conformité immuable. 
              Sécurité de niveau militaire via ledger cryptographique SHA-256.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 pt-6"
            >
              <button className="px-10 py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-700 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all flex items-center gap-4 group">
                Demander une Démo Privée
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-10 py-6 bg-white/5 text-white font-black uppercase tracking-widest rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center gap-4 group">
                <Play size={18} fill="currentColor" />
                Regarder la vidéo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PILLARS SECTION --- */}
      <section className="py-32 bg-[#0d1629]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-blue-500">Value Proposition</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Les 5 Piliers de la Valeur AuditAX</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {pillars.map((p, i) => (
              <motion.div 
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <p.icon size={28} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-4">{p.title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PERSONAS SECTION --- */}
      <section className="py-32 bg-[#091426]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-emerald-500">Enterprise Elite</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight uppercase">Conçu pour l'Élite de l'Entreprise</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {personas.map((p, i) => (
              <motion.div 
                key={p.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-[3rem] overflow-hidden bg-white/5 border border-white/10"
              >
                <div className="aspect-[4/5] relative">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091426] via-[#091426]/20 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
                   <div>
                     <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{p.subtitle}</div>
                     <h4 className="text-4xl font-black uppercase tracking-tighter">{p.title}</h4>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                        <CheckCircle2 size={16} />
                        {p.focus}
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        {p.description}
                      </p>
                      <Link to={p.link} className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] hover:text-blue-500 transition-colors">
                        En savoir plus <ArrowRight size={14} />
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
             Prêt pour la Conformité <br />
             <span className="text-blue-600">Industrielle ?</span>
           </h2>
           <p className="text-xl text-slate-400 font-medium">Rejoignez les leaders qui font confiance à AuditAX pour sécuriser leur avenir réglementaire.</p>
           <button className="px-12 py-6 bg-white text-[#091426] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-2xl">
             Démarrer maintenant
           </button>
        </div>
      </section>
    </div>
  );
};
