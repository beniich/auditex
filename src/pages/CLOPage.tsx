import React from 'react';
import { Scale, BookOpen, AlertOctagon } from 'lucide-react';
import { motion } from 'motion/react';

export const CLOPage = () => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="w-16 h-16 bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
          <Scale size={32} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-[#091426]">
          Gouvernance Légale <span className="text-slate-500 italic">Automatisée</span>.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-10">
          Supervisez la conformité RPMP et les politiques internes de votre organisation de manière centralisée, avec une piste d'audit qui tient devant la justice.
        </p>
        <button className="px-8 py-4 bg-[#091426] hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition shadow-xl">
           Télécharger le livre blanc juridique
        </button>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 relative overflow-hidden">
           <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8"><BookOpen className="text-indigo-500" size={28}/></div>
           <h3 className="text-3xl font-black mb-4">Cartographie des Engagements</h3>
           <p className="text-slate-500 leading-relaxed font-medium">
             Analysez automatiquement des milliers de clauses et connectez-les aux politiques de sécurité appliquées sur vos serveurs. AuditAX génère la cartographie de conformité à la demande.
           </p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 relative overflow-hidden">
           <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8"><AlertOctagon className="text-rose-500" size={28}/></div>
           <h3 className="text-3xl font-black mb-4">Alerte de Non-Conformité Règle</h3>
           <p className="text-slate-500 leading-relaxed font-medium">
             Recevez des rapports détaillés lorsqu'une régulation locale (DORA, NIS2, RGPD) est menacée par un changement d'infrastructure technique. Ne laissez aucune place à l'interprétation.
           </p>
        </div>
      </section>
    </div>
  );
};
