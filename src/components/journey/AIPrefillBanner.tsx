import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check } from 'lucide-react';

interface AIPrefillBannerProps {
  count: number;
  onDismiss: () => void;
}

export const AIPrefillBanner = ({ count, onDismiss }: AIPrefillBannerProps) => {
  if (count <= 0) return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-3xl text-white shadow-xl shadow-blue-500/10 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4 px-4">
          <div className="bg-white/20 p-2 rounded-xl">
             <Sparkles size={18} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest">Optimisation Intelligence Artificielle</span>
             <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">
                {count} questions ont été pré-remplies par l'IA basées sur vos réponses précédentes.
             </span>
          </div>
        </div>
        <button 
          onClick={onDismiss}
          className="p-3 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};
