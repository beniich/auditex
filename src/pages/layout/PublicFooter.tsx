import React from 'react';
import { Shield, Mail, Lock, CheckCircle } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-[#0a0e1a] border-t border-white/5 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={18} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">
              Audit<span className="text-emerald-400">AX</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            L'Intelligence Agentique au service de la Conformité Absolue. Développé pour les auditeurs et CISO exigeants.
          </p>
          <div className="flex gap-2">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition cursor-pointer">In</div>
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500 transition cursor-pointer">Tw</div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Plateforme</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="hover:text-emerald-400 cursor-pointer transition">Intelligence Agentique</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Immutabilité Ledger</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Risk Calculator</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Chaos Lab</li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-6">Ressources</h4>
           <ul className="space-y-4 text-sm text-slate-400">
             <li className="hover:text-emerald-400 cursor-pointer transition">CISO Persona</li>
             <li className="hover:text-emerald-400 cursor-pointer transition">CFO Persona</li>
             <li className="hover:text-emerald-400 cursor-pointer transition">Portail Partenaire</li>
             <li className="hover:text-emerald-400 cursor-pointer transition">Compliance Academy</li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-6">Newsletter technique</h4>
           <p className="text-slate-400 text-sm mb-4">Alerte conformité & security briefs hebdomadaires.</p>
           <form className="flex" onSubmit={e => e.preventDefault()}>
             <input type="email" placeholder="CISO@company.com" className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full text-white text-sm outline-none focus:border-emerald-500 focus:bg-white/10 transition" />
             <button aria-label="Subscribe" className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-400 transition">
               <Mail size={18} />
             </button>
           </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-slate-500 text-xs">© 2026 AuditAX Defense Systems. All rights reserved.</p>
         <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
               <CheckCircle size={14} className="text-emerald-400" /><span className="text-slate-300 text-xs font-bold font-mono">SOC2 Type II</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
               <CheckCircle size={14} className="text-emerald-400" /><span className="text-slate-300 text-xs font-bold font-mono">ISO 27001</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
               <Lock size={14} className="text-emerald-400" /><span className="text-slate-300 text-xs font-bold font-mono">AES-256 Ledger</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
               <Shield size={14} className="text-emerald-400" /><span className="text-slate-300 text-xs font-bold font-mono">GDPR Compliant</span>
            </div>
         </div>
      </div>
    </footer>
  );
};
