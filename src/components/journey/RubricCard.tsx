import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Lock, ChevronDown, ChevronRight, AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { Rubric, RubricStatus, Audit, AuditQuestion } from '../../types';

interface RubricCardProps {
  rubric: Rubric;
  status: RubricStatus;
  questions: AuditQuestion[];
  responses: any;
  onQuestionResponse: (questionId: string, value: any) => void | Promise<void>;
  onComplete: () => void | Promise<void>;
  isSaving?: boolean;
}

export const RubricCard = ({ 
  rubric, 
  status, 
  questions, 
  responses, 
  onQuestionResponse, 
  onComplete,
  isSaving 
}: RubricCardProps) => {
  const isLocked = status === 'LOCKED';
  const isCompleted = status === 'COMPLETED' || status === 'AI_VALIDATED';
  const isActive = status === 'ACTIVE';

  const allRequiredAnswered = questions
    .filter(q => q.required)
    .every(q => responses[q.id]?.value !== undefined);

  return (
    <div className={`overflow-hidden transition-all duration-500 border rounded-[2.5rem] ${
      isActive 
        ? 'bg-white border-blue-200 shadow-xl shadow-blue-900/5' 
        : isCompleted
        ? 'bg-slate-50/50 border-slate-100 opacity-80'
        : 'bg-slate-50/30 border-slate-100 opacity-50 grayscale'
    }`}>
      {/* Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isCompleted ? 'bg-emerald-500 text-white animate-lock-seal' : isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            {isCompleted ? <Check size={24} /> : isLocked ? <Lock size={20} /> : <ChevronRight size={20} />}
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase tracking-tight ${isActive ? 'text-[#091426]' : 'text-slate-500'}`}>
              {rubric.label}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {questions.length} Points de Contrôle • {isCompleted ? 'Validé' : isActive ? 'En cours' : 'Verrouillé'}
            </p>
          </div>
        </div>

        {isActive && allRequiredAnswered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            disabled={isSaving}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            Sceller l'analyse
          </motion.button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-50 p-8 space-y-10"
          >
            {questions.map((q) => (
              <div key={q.id} className="space-y-6">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-[#091426] leading-tight uppercase tracking-tight">
                      {q.text}
                      {q.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                  </div>
                </div>

                <div className="space-y-4">
                  {q.type === 'YES_NO' && (
                    <div className="grid grid-cols-2 gap-4">
                      {[true, false].map((val) => (
                        <button
                          key={String(val)}
                          onClick={() => onQuestionResponse(q.id, val)}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                            responses[q.id]?.value === val
                              ? val 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                                : 'bg-red-50 border-red-500 text-red-700'
                              : 'bg-slate-50/50 border-transparent text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            responses[q.id]?.value === val 
                              ? val ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                              : 'bg-white text-slate-300'
                          }`}>
                            {val ? <Check size={18} /> : <AlertCircle size={18} />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {val ? 'Conforme' : 'Écart'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'TEXT' && (
                    <textarea
                      rows={3}
                      defaultValue={responses[q.id]?.value || ''}
                      onBlur={(e) => onQuestionResponse(q.id, e.target.value)}
                      placeholder="Commentaires techniques..."
                      className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
