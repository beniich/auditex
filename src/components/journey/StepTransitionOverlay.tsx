import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Check, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { JourneyStep } from '../../types';

interface StepTransitionOverlayProps {
  fromStep: JourneyStep;
  toStep: JourneyStep;
  insight: any;
  onContinue: () => void;
}

export const StepTransitionOverlay: React.FC<StepTransitionOverlayProps> = ({ 
  fromStep, 
  toStep, 
  insight, 
  onContinue 
}) => {
  const [phase, setPhase] = useState<'analyzing' | 'results'>('analyzing');

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('results');
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-[#091426]/90"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl overflow-hidden relative"
        >
          {phase === 'analyzing' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                 <div className="w-24 h-24 bg-blue-600 rounded-full relative z-10 flex items-center justify-center text-white">
                   <BrainCircuit size={48} className="animate-spin-slow" />
                 </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#091426] uppercase tracking-tighter">
                  Analyse de l'Étape {fromStep.step} en cours...
                </h3>
                <p className="text-slate-500 mt-2 font-medium">L'IA consolide les réponses et pré-calcule l'étape suivante.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                   <Check size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-[#091426] uppercase tracking-tighter">Étape {fromStep.step} Validée</h3>
                    <p className="text-sm font-medium text-slate-500">Bilan de sécurité : <span className="text-emerald-500 font-bold">Cohérent</span></p>
                 </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                 <div className="flex items-start gap-3">
                   <ShieldAlert className="text-blue-600 mt-1" size={20} />
                   <div>
                     <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-2">Recommandations IA</h4>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed">{insight?.summary || "Les contrôles structurels semblent robustes. Prêt pour l'étape suivante."}</p>
                   </div>
                 </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] flex items-center justify-between">
                 <div>
                   <h4 className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
                     <Sparkles size={16} /> Auto-remplissage prêt
                   </h4>
                   <p className="text-xs text-indigo-500 font-medium mt-1">J'ai pré-rempli {insight?.prefills?.length || 2} questions pour l'étape {toStep.step} !</p>
                 </div>
                 <button onClick={onContinue} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                   Voir les suggestions <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
