import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MilestoneToastProps {
  stepName: string;
  stepNumber: number;
  visible: boolean;
  onClose: () => void;
}

export const MilestoneToast: React.FC<MilestoneToastProps> = ({ stepName, stepNumber, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0058be', '#00a472', '#ffffff']
      });
      const t = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100]"
        >
          <div className="bg-[#091426] text-white p-6 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex items-center gap-6 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-inner relative z-10">
               <Trophy size={32} className="text-white" />
            </div>
            <div className="relative z-10 pr-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">
                 Étape {stepNumber} Validée
               </h4>
               <p className="text-xl font-black uppercase tracking-tight">{stepName}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
