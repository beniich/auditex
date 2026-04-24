import React, { useState, useEffect, useRef } from 'react';
import { AuditTemplate } from '../../types';
import { useJourneyState } from '../../hooks/useJourneyState';
import { ComplianceStepper } from '../journey/ComplianceStepper';
import { RubricCard } from '../journey/RubricCard';
import { StepTransitionOverlay } from '../journey/StepTransitionOverlay';
import { AIPrefillBanner } from '../journey/AIPrefillBanner';
import { ProgressRing } from '../journey/ProgressRing';
import { MilestoneToast } from '../journey/MilestoneToast';
import { ShieldAlert, ArrowRight, Brain } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface GuidedAuditRunnerProps {
  auditId: string;
  template: AuditTemplate;
  onComplete: () => void;
}

export const GuidedAuditRunner: React.FC<GuidedAuditRunnerProps> = ({ auditId, template, onComplete }) => {
  const { 
    journeySteps, 
    journeyState, 
    completeRubric, 
    triggerTransition,
    advanceStepAfterTransition,
    isTransitioning,
    transitionInsight,
    dismissInsight
  } = useJourneyState(auditId, template);

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [activePrefills, setActivePrefills] = useState<any[]>([]);
  const [toastData, setToastData] = useState({ visible: false, stepName: '', stepNumber: 0 });
  
  const currentJourneyStep = journeySteps.find(s => s.step === journeyState.currentStep);
  const completedSteps = Object.keys(journeyState.stepValidations).filter(k => journeyState.stepValidations[Number(k)]).map(Number);

  // Trigger celebration toast on step increment
  const prevStepRef = useRef(journeyState.currentStep);
  useEffect(() => {
    if (journeyState.currentStep > prevStepRef.current) {
       const completedStepData = journeySteps[prevStepRef.current - 1];
       if (completedStepData) {
         setToastData({ visible: true, stepName: completedStepData.title, stepNumber: completedStepData.step });
       }
       prevStepRef.current = journeyState.currentStep;
    }
  }, [journeyState.currentStep, journeySteps]);

  useEffect(() => {
    if (transitionInsight && transitionInsight.prefills && !isTransitioning) {
       setActivePrefills(transitionInsight.prefills);
    }
  }, [transitionInsight, isTransitioning]);

  const handleQuestionResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = async () => {
    if (currentJourneyStep) {
      if (currentJourneyStep.step < journeySteps.length) {
         const mockInsight = {
            summary: "Les réponses structurelles sont excellentes. Votre posture HSE est validée.",
            prefillCount: 2,
            prefills: [
              { questionId: 'q4', suggestedValue: true, confidence: 98, label: 'Historique des logs' },
              { questionId: 'q5', suggestedValue: 'Check Validé par IA', confidence: 85, label: 'Analyse documentaire' }
            ]
         };
         await triggerTransition(currentJourneyStep.step, mockInsight);
      } else {
         advanceStepAfterTransition();
      }
    }
  };

  const handleAcceptPrefills = () => {
    const newR = { ...responses };
    activePrefills.forEach(p => {
       newR[p.questionId] = p.suggestedValue;
    });
    setResponses(newR);
    setActivePrefills([]);
    dismissInsight();
  };

  const canAdvance = currentJourneyStep?.rubrics.every(
    r => !r.required || journeyState.rubricStatuses[r.id] === 'COMPLETED' || journeyState.rubricStatuses[r.id] === 'AI_VALIDATED'
  );

  const totalRequiredRubrics = currentJourneyStep?.rubrics.filter(r => r.required).length || 0;
  const completedRequiredRubrics = currentJourneyStep?.rubrics.filter(
    r => r.required && (journeyState.rubricStatuses[r.id] === 'COMPLETED' || journeyState.rubricStatuses[r.id] === 'AI_VALIDATED')
  ).length || 0;
  const stepProgress = totalRequiredRubrics === 0 ? 100 : (completedRequiredRubrics / totalRequiredRubrics) * 100;

  if (isTransitioning && currentJourneyStep) {
    const nextStep = journeySteps[currentJourneyStep.step] || currentJourneyStep;
    return (
      <StepTransitionOverlay 
        fromStep={currentJourneyStep} 
        toStep={nextStep} 
        insight={transitionInsight} 
        onContinue={advanceStepAfterTransition} 
      />
    );
  }

  if (!currentJourneyStep) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white rounded-[3rem] border border-slate-200">
        <MilestoneToast visible={toastData.visible} stepName={toastData.stepName} stepNumber={toastData.stepNumber} onClose={() => setToastData(p => ({...p, visible: false}))} />
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
          <ShieldAlert size={48} />
        </div>
        <div>
           <h2 className="text-4xl font-black uppercase text-[#091426] tracking-tight">Audit Terminé</h2>
           <p className="text-slate-500 font-medium text-sm mt-2">Le parcours guidé de conformité est validé et ancré au ledger.</p>
        </div>
        <button onClick={onComplete} className="px-8 py-4 bg-[#091426] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10">
          Retour au Registre
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <MilestoneToast visible={toastData.visible} stepName={toastData.stepName} stepNumber={toastData.stepNumber} onClose={() => setToastData(p => ({...p, visible: false}))} />
      
      <ComplianceStepper 
        steps={journeySteps} 
        currentStep={journeyState.currentStep} 
        completedSteps={completedSteps} 
      />

      <AIPrefillBanner 
        visible={activePrefills.length > 0} 
        prefills={activePrefills} 
        onAcceptAll={handleAcceptPrefills} 
        onRejectAll={() => { setActivePrefills([]); dismissInsight(); }} 
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform"><ShieldAlert size={150}/></div>
             <div className="relative z-10 flex-1">
               <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">
                 Étape {currentJourneyStep.step} / {journeySteps.length}
               </h3>
               <h2 className="text-3xl font-black text-[#091426] uppercase tracking-tighter">
                 {currentJourneyStep.title}
               </h2>
               <p className="text-slate-500 font-medium text-sm mt-3 leading-relaxed max-w-xl">
                 {currentJourneyStep.description}
               </p>
             </div>
             <div className="relative z-10 pl-6 border-l border-slate-100 pb-4">
                <ProgressRing progress={stepProgress} size={70} label="Complété" />
             </div>
          </div>

          <div className="space-y-6">
            {currentJourneyStep.rubrics.map((rubric, idx) => {
              let computedStatus = journeyState.rubricStatuses[rubric.id];
              if (!computedStatus) {
                 const prevRubric = idx > 0 ? currentJourneyStep.rubrics[idx - 1] : null;
                 const prevCompleted = prevRubric ? (journeyState.rubricStatuses[prevRubric.id] === 'COMPLETED' || journeyState.rubricStatuses[prevRubric.id] === 'AI_VALIDATED') : true;
                 computedStatus = prevCompleted ? 'ACTIVE' : 'LOCKED';
              }

              const templateSection = template.sections.find(s => s.title === currentJourneyStep.title);
              const rubricQuestions = templateSection?.questions.filter(q => rubric.questionIds.includes(q.id)) || [];

              return (
                <RubricCard
                  key={rubric.id}
                  rubric={rubric}
                  status={computedStatus}
                  questions={rubricQuestions}
                  responses={responses}
                  onComplete={completeRubric}
                  onQuestionResponse={handleQuestionResponse}
                />
              );
            })}
          </div>

          <div className="pt-6 flex justify-end">
             <button
               onClick={handleNextStep}
               disabled={!canAdvance}
               className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                 canAdvance ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
               }`}
             >
               Continuer vers l'Étape {currentJourneyStep.step + 1} <ArrowRight size={18} />
             </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
           <div className="sticky top-28 space-y-6">
              <GlassCard className="p-8 border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/20 shadow-xl shadow-blue-900/5">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-float-ai">
                   <Brain size={24} />
                 </div>
                 <h4 className="text-sm font-black text-[#091426] uppercase tracking-widest mb-2">Copilote IA</h4>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                   Le copilote observe vos réponses en temps réel pour pré-remplir les étapes suivantes et réduire le temps d'audit.
                 </p>
                 <div className="bg-white p-5 rounded-2xl border border-slate-100 text-[10px] font-mono leading-relaxed uppercase shadow-sm">
                    <p className="text-slate-400 mb-2">Status: <span className="text-emerald-500 font-black animate-pulse">Observing</span></p>
                    <p className="text-slate-400 mb-2">Confiance Moyenne: <span className="text-[#091426] font-black">94%</span></p>
                    <p className="text-slate-400">Gains de temps: <span className="text-blue-600 font-black">14 min</span></p>
                 </div>
              </GlassCard>
           </div>
        </div>
        
      </div>
    </div>
  );
};
