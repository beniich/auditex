import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BrainCircuit, RefreshCw } from 'lucide-react';

interface StepTransitionOverlayProps {
  isOpen: boolean;
  onContinue: () => void;
  insight: {
    summary: string;
    prefillCount: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  } | null;
  nextStepTitle: string;
}

export const StepTransitionOverlay = ({ isOpen, onContinue, insight, nextStepTitle }: StepTransitionOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#091426]/95 backdrop-blur-2xl"
        >
          <div className="max-w-2xl w-full">
            {!insight ? (
              <div className="flex flex-col items-center gap-8 text-center">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-32 h-32 rounded-full border-b-4 border-blue-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <BrainCircuit size={40} className="text-blue-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">Analyse IA en cours...</h2>
                  <p className="text-slate-400 font-medium">L'Assistant de Conformité synchronise vos réponses avec le ledger réglementaire.</p>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
              >
                {/* Background Sparkles */}
                <div className="absolute top-0 right-0 p-8">
                  <Sparkles size={120} className="text-blue-50 opacity-[0.05]" />
                </div>

                <div className="relative z-10 space-y-10">
                  <header className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <ShieldCheck size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Validation d'étape réussie</span>
                      </div>
                      <h2 className="text-4xl font-black text-[#091426] uppercase tracking-tighter">Bilan de l'étape</h2>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      insight.riskLevel === 'LOW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      Risque : {insight.riskLevel}
                    </div>
                  </header>

                  <div className="grid gap-8">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                      <p className="text-sm font-semibold text-slate-600 italic leading-relaxed">
                        "{insight.summary}"
                      </p>
                    </div>

                    {insight.prefillCount > 0 && (
                      <div className="flex items-center gap-6 p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                           <Zap size={28} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Boost de productivité</p>
                          <p className="text-xs font-bold text-blue-600/80 uppercase tracking-tighter mt-1">
                            L'IA a pré-rempli {insight.prefillCount} questions pour la suite.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommandations stratégiques</p>
                      <ul className="grid gap-3">
                        {insight.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={onContinue}
                    className="w-full py-6 bg-[#091426] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group"
                  >
                    Passer à l'Étape : {nextStepTitle} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
