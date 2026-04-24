import React, { useState } from 'react';
import { Rubric, RubricStatus, AuditQuestion } from '../../types';
import { CheckCircle2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RubricCardProps {
  rubric: Rubric;
  status: RubricStatus;
  questions: AuditQuestion[];
  responses: Record<string, any>;
  onComplete: (rubricId: string, questionIds: string[]) => void;
  onQuestionResponse: (questionId: string, value: any) => void;
}

export const RubricCard: React.FC<RubricCardProps> = ({ 
  rubric, 
  status, 
  questions, 
  responses, 
  onComplete, 
  onQuestionResponse 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLocked = status === 'LOCKED';
  const isCompleted = status === 'COMPLETED' || status === 'AI_VALIDATED';
  const isActive = status === 'ACTIVE';

  const allRequiredAnswered = questions
    .filter(q => q.required)
    .every(q => responses[q.id] !== undefined && responses[q.id] !== '');

  const handleValidate = () => {
    if (allRequiredAnswered) {
      onComplete(rubric.id, rubric.questionIds);
    }
  };

  return (
    <div 
      className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
        isLocked 
          ? 'bg-slate-50 border-slate-100 opacity-60 grayscale' 
          : isActive 
             ? 'bg-white border-blue-200 shadow-xl shadow-blue-900/5' 
             : 'bg-emerald-50/30 border-emerald-100 shadow-sm'
      }`}
    >
      <div 
        className="p-8 pb-6 flex items-center justify-between cursor-default"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col">
           <div className="flex items-center gap-3 mb-2">
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border ${
               isLocked ? 'bg-slate-100 text-slate-400 border-slate-200' :
               isActive ? 'bg-blue-50 text-blue-600 border-blue-100' :
               'bg-emerald-50 text-emerald-600 border-emerald-100'
             }`}>
               {status.replace('_', ' ')}
             </span>
             {rubric.required && <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Requis</span>}
           </div>
           <h3 className={`text-xl font-black uppercase tracking-tight ${isLocked ? 'text-slate-400' : 'text-[#091426]'}`}>
             {rubric.label}
           </h3>
           <p className="text-slate-500 text-sm mt-1">{rubric.description}</p>
        </div>
        
        <div>
          {isCompleted ? (
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
               <Lock size={24} />
            </div>
          ) : isLocked ? (
             <div className="w-14 h-14 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center">
               <Lock size={24} />
             </div>
          ) : (
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${allRequiredAnswered ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                {isHovered ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
             </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-8"
          >
            <div className="space-y-6 pt-4 border-t border-slate-100">
               {questions.map((q) => (
                 <div key={q.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group hover:bg-white transition-colors">
                    <label className="flex items-start justify-between gap-4">
                       <span className="text-sm font-bold text-[#091426] w-2/3 leading-relaxed">{q.text} {q.required && <span className="text-red-500">*</span>}</span>
                       <div className="w-1/3 flex justify-end">
                          {q.type === 'YES_NO' ? (
                             <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button
                                  onClick={() => onQuestionResponse(q.id, true)}
                                  className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${responses[q.id] === true ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >Oui</button>
                                <button
                                  onClick={() => onQuestionResponse(q.id, false)}
                                  className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${responses[q.id] === false ? 'bg-red-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >Non</button>
                             </div>
                          ) : q.type === 'SCORE' ? (
                             <input 
                               type="number" 
                               min="0" max="100" 
                               value={responses[q.id] || ''}
                               onChange={(e) => onQuestionResponse(q.id, parseInt(e.target.value))}
                               className="w-24 text-center py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none"
                               placeholder="0-100"
                             />
                          ) : (
                             <input
                               type="text"
                               value={responses[q.id] || ''}
                               onChange={(e) => onQuestionResponse(q.id, e.target.value)}
                               className="w-full bg-white py-2 px-4 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-100 outline-none"
                               placeholder="Réponse étudiée..."
                             />
                          )}
                       </div>
                    </label>
                 </div>
               ))}
            </div>

            <div className="mt-8 flex justify-end">
               <button
                 onClick={handleValidate}
                 disabled={!allRequiredAnswered}
                 className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                   allRequiredAnswered 
                     ? 'bg-[#091426] text-white hover:bg-slate-800' 
                     : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                 }`}
               >
                 <CheckCircle2 size={16} /> Verrouiller la Rubrique
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
