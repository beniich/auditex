import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Lock, Shield, Network, Database, Fingerprint, Code, Server } from 'lucide-react';

const technicalFeatures = [
  {
    icon: Cpu,
    title: 'Agentic AI RA6',
    description: 'Système d\'agents autonomes analysant en continu les flux de données pour détecter les anomalies de conformité avant qu\'elles ne deviennent critiques.',
    tags: ['Intelligence', 'Autonome']
  },
  {
    icon: Zap,
    title: 'RAG Validation',
    description: 'Retrieval-Augmented Generation couplé à une vérification stricte par le ledger. Zéro hallucination, 100% précision.',
    tags: ['Précision', 'Vérifié']
  },
  {
    icon: Lock,
    title: 'SHA-256 Immutability',
    description: 'Chaque audit est scellé cryptographiquement. Une preuve mathématique de l\'intégrité des données à chaque instant.',
    tags: ['Cryptographie', 'Immuable']
  },
  {
    icon: Network,
    title: 'Force Graph Analytics',
    description: 'Visualisation des dépendances complexes entre actifs, politiques et risques pour une vision panoramique de l\'entreprise.',
    tags: ['Visualisation', 'Force-Graph']
  }
];

export const FeaturesPage = () => {
  return (
    <div className="bg-[#f8fafc] text-[#091426] pt-32 pb-24">
      {/* --- HERO --- */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-10 mb-32">
        <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Code size={18} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Platform Architecture & Features</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase">
          Technical <br />
          <span className="text-blue-600 italic">Superiority</span> <br />
          by Design.
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
          Plongez au cœur de l'infrastructure AuditAX. Une alliance unique d'IA agentique, de cryptographie avancée et de visualisation de données massivement interconnectées.
        </p>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-32">
         {technicalFeatures.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
               <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                     <f.icon size={32} />
                  </div>
                  <div className="flex gap-2">
                     {f.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{tag}</span>
                     ))}
                  </div>
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tight mb-6">{f.title}</h3>
               <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  {f.description}
               </p>
            </motion.div>
         ))}
      </section>

      {/* --- SECURITY STACK --- */}
      <section className="bg-[#091426] text-white py-32 rounded-[5rem] mx-6">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500">Enterprise-Grade Security</h2>
               <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight">Multi-Layer Protection</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
               {[
                 { icon: Database, title: 'Data Residency', desc: 'Souveraineté totale des données par région.' },
                 { icon: Fingerprint, title: 'Identity Assurance', desc: 'Gestion avancée des rôles et accès via RBAC.' },
                 { icon: Server, title: 'Node Integrity', desc: 'Chaque noeud du système est audité en temps réel.' },
                 { icon: Shield, title: 'Zero-Trust Arc', desc: 'Architecture de sécurité à confiance nulle par défaut.' }
               ].map((item, i) => (
                 <div key={item.title} className="space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-blue-500 border border-white/10">
                       <item.icon size={36} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="font-extrabold text-xl uppercase tracking-tight">{item.title}</h4>
                       <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};
