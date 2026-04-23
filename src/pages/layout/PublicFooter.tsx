import React from 'react';
import { Shield, Mail, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Solutions: ['Audit Automatisé', 'Gestion des Risques', 'Conformité Continue', 'Intelligence RA6'],
  Société: ['À Propos', 'Carrières', 'Contact', 'Presse'],
  Ressources: ['Documentation', 'Blog', 'Webinaires', 'Compliance Academy'],
  Légal: ['Conditions', 'Confidentialité', 'Sécurité', 'Cookies']
};

export const PublicFooter = () => {
  return (
    <footer className="bg-[#091426] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Audit<span className="text-blue-600">AX</span>
              </span>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
              L'intelligence agentique au service de la conformité absolue et de la gestion des risques stratégiques.
            </p>
            
            <div className="space-y-4">
              <div className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">Newsletter pour S'abonner</div>
              <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 max-w-md">
                <input 
                  type="email" 
                  placeholder="votre-email@entreprise.com" 
                  className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-bold placeholder:text-slate-500"
                />
                <button className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 group">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">{title}</h4>
                <ul className="space-y-4">
                  {links.map(link => (
                    <li key={link}>
                      <Link to="#" className="text-slate-400 hover:text-white font-bold transition-colors text-[13px]">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Bottom */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Certification Badges (Maquette v1 Style) */}
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold">ISO</div>
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold">SOC2</div>
               <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">SOC 2 Type II Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">GDPR Compliant</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Link to="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all border border-white/10"><Twitter size={18} /></Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all border border-white/10"><Linkedin size={18} /></Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all border border-white/10"><Github size={18} /></Link>
            </div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              © 2024 AuditAX. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
