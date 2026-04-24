import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            Audit<span className="text-emerald-400">AX</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition group">
            Solutions <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition group">
            Platform <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
          </div>
          <div className="cursor-pointer hover:text-white transition" onClick={() => navigate('/ciso')}>Personas</div>
          <div className="cursor-pointer hover:text-white transition" onClick={() => navigate('/about')}>À Propos</div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 text-white/90 hover:text-white font-bold text-sm transition">
            Log In
          </button>
          <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-widest rounded-full transition shadow-lg shadow-emerald-500/20">
            Demander une Démo
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0a0e1a] border-b border-white/10"
          >
            <div className="flex flex-col px-6 py-6 space-y-4 text-center">
              <span className="text-slate-300 font-semibold" onClick={() => { setIsOpen(false); navigate('/ciso'); }}>Personas</span>
              <span className="text-slate-300 font-semibold" onClick={() => { setIsOpen(false); navigate('/about'); }}>À Propos</span>
              <hr className="border-white/10" />
              <button onClick={() => navigate('/dashboard')} className="py-3 text-white font-bold w-full rounded-xl bg-white/5">
                Log In
              </button>
              <button className="py-3 bg-emerald-500 text-white font-black uppercase text-xs tracking-widest w-full rounded-xl">
                Demander une Démo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
