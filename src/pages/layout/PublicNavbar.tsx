import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, Shield, Globe, Cpu, BarChart3, Users, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { 
    label: 'Solutions', 
    items: [
      { label: 'Audit Automatisé', icon: FileCheck, description: 'Certifications ISO & SOC2 en un clic.' },
      { label: 'Gestion des Risques', icon: BarChart3, description: 'Analyse prédictive de l\'exposition.' },
      { label: 'Conformité Continue', icon: Shield, description: 'Monitoring 24/7 du ledger immuable.' }
    ] 
  },
  { 
    label: 'Plateforme', 
    items: [
      { label: 'Infrastructure RA6', icon: Cpu, description: 'Intelligence agentique de niveau militaire.' },
      { label: 'Global Coverage', icon: Globe, description: 'Conformité multi-juridictionnelle.' }
    ] 
  },
  { label: 'Personas', href: '/personas' },
  { label: 'Ressources', href: '/resources' },
  { label: 'À Propos', href: '/about' }
];

export const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-[#091426]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#171c1f] dark:text-white uppercase italic">
            Audit<span className="text-blue-600">AX</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">
                {item.label}
                {item.items && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
              </button>

              <AnimatePresence>
                {item.items && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-80 pt-4"
                  >
                    <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 overflow-hidden">
                      <div className="grid gap-2">
                        {item.items.map((subItem) => (
                          <Link 
                            key={subItem.label} 
                            to="#" 
                            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                              <subItem.icon size={20} />
                            </div>
                            <div>
                              <div className="text-[13px] font-bold text-slate-900 dark:text-white">{subItem.label}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/auth/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
            Connexion
          </Link>
          <button className="px-6 py-3 bg-blue-600 text-white text-sm font-black uppercase tracking-widest rounded-full hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95">
            Demander une Démo
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#091426] border-b border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-4">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</div>
                  {item.items ? (
                    <div className="grid grid-cols-1 gap-2 pl-4">
                      {item.items.map(sub => (
                        <Link key={sub.label} to="#" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold py-2">
                           <sub.icon size={18} className="text-blue-600" />
                           {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link to="#" className="block text-lg font-bold text-slate-900 dark:text-white pl-4">
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-6 grid gap-4">
                <button className="w-full py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-black uppercase tracking-widest">Connexion</button>
                <button className="w-full py-4 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Demander une Démo</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
