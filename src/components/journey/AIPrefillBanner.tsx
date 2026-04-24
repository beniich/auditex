import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIPrefillBannerProps {
  prefills: Array<{ questionId: string; suggestedValue: string; confidence: number; label: string }>;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  visible: boolean;
}

export const AIPrefillBanner: React.FC<AIPrefillBannerProps> = ({ prefills, onAcceptAll, onRejectAll, visible }) => {
  if (!visible || prefills.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full bg-indigo-600 text-white p-6 rounded-[2.5rem] shadow-xl shadow-indigo-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 p-8 opacity-10">
           <Sparkles size={100} />
         </div>
         <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
             <Sparkles size={24} className="text-indigo-200" />
           </div>
           <div>
             <h4 className="font-black uppercase tracking-widest text-[11px] text-indigo-200 mb-1">Assistance IA Détectée</h4>
             <p className="text-sm font-medium leading-tight">J'ai pré-rempli {prefills.length} questions basées sur vos politiques précédentes.</p>
           </div>
         </div>
         <div className="flex items-center gap-3 relative z-10 w-full md:w-auto shrink-0">
           <button onClick={onRejectAll} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2">
             <X size={14} /> Ignorer
           </button>
           <button onClick={onAcceptAll} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 transition-all text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2">
             <Check size={14} /> Tout Accepter
           </button>
         </div>
      </motion.div>
    </AnimatePresence>
  );
};
