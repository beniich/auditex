import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Send, HelpCircle, Sparkles, RefreshCw } from 'lucide-react';
import { Audit, AuditTemplate } from '../types';
import { AuditService } from '../services/AuditService';
import { useJourneyState } from '../hooks/useJourneyState';
import { ComplianceStepper } from './journey/ComplianceStepper';
import { RubricCard } from './journey/RubricCard';
import { StepTransitionOverlay } from './journey/StepTransitionOverlay';
import { AIPrefillBanner } from './journey/AIPrefillBanner';
import { ProgressRing } from './journey/ProgressRing';
import { GlassCard } from './common/GlassCard';
import { toast } from '../hooks/useToast';

interface GuidedAuditRunnerProps {
  auditId: string;
  template: AuditTemplate;
  onComplete: () => void;
}

export const GuidedAuditRunner = ({ auditId, template, onComplete }: GuidedAuditRunnerProps) => {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    journeys,
    currentStep,
    currentStepData,
    rubricStatuses,
    isTransitioning,
    currentInsight,
    prefillsApplied,
    resetPrefillCount,
    completeRubric,
    advanceStep,
    completeTransition,
    isStepComplete
  } = useJourneyState(audit, template, loadAudit);

  const loadAudit = async () => {
    const data = await AuditService.getAudit(auditId);
    setAudit(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, [auditId]);

  const handleResponse = async (questionId: string, value: any) => {
    if (!audit) return;
    setSaving(true);
    try {
      await AuditService.appendEvent(auditId, 'RESPONSE_UPDATED', {
        questionId,
        value,
        timestamp: new Date().toISOString()
      });
      await loadAudit();
    } catch (err) {
      toast.error('Échec de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (confirm('Voulez-vous soumettre cet audit pour revue ? Cette action est irréversible.')) {
      setSaving(true);
      await AuditService.appendEvent(auditId, 'STATUS_CHANGED', { status: 'SUBMITTED' });
      onComplete();
    }
  };

  if (loading || !audit) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* 1. The Global Stepper */}
      <div className="bg-white/50 backdrop-blur-xl border border-slate-200 rounded-[3rem] p-4 shadow-sm sticky top-4 z-40">
        <ComplianceStepper steps={journeys} currentStep={currentStep} />
      </div>

      <StepTransitionOverlay 
        isOpen={isTransitioning}
        insight={currentInsight}
        onContinue={completeTransition}
        nextStepTitle={journeys[currentStep + 1]?.title || ''}
      />

      {/* AI Prefill Banner */}
      <AIPrefillBanner 
        count={prefillsApplied} 
        onDismiss={resetPrefillCount} 
      />

      {/* 2. Step Context & Local Progress */}
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Decorator */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-0" />

        <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600">
             <Sparkles size={18} className="animate-float-ai" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module de Conformité Guidé</span>
          </div>
          <h1 className="text-5xl font-black text-[#091426] uppercase tracking-tighter leading-none">
            {currentStepData.title}
          </h1>
          <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 px-8 py-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
          <ProgressRing 
            progress={(currentStepData.rubrics.filter(r => rubricStatuses[r.id] === 'COMPLETED').length / currentStepData.rubrics.length) * 100} 
            size={140}
            label="Step Progress"
          />
        </div>
      </div>

      {/* 3. The Rubrics funnel */}
      <div className="space-y-6">
        {currentStepData.rubrics.map((rubric) => {
          const status = rubricStatuses[rubric.id] || 'LOCKED';
          const rubricQuestions = template.sections[currentStep].questions.filter(q => rubric.questionIds.includes(q.id));
          
          return (
            <RubricCard
              key={rubric.id}
              rubric={rubric}
              status={status}
              questions={rubricQuestions}
              responses={audit.responses}
              onQuestionResponse={handleResponse}
              onComplete={() => completeRubric(rubric.id)}
              isSaving={saving}
            />
          );
        })}
      </div>

      {/* 4. Bottom Navigation */}
      <div className="flex justify-between items-center pt-12 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group hover:border-blue-200 transition-all cursor-help">
            <HelpCircle size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assistance IA</span>
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Disponible 24/7</span>
          </div>
        </div>

        <div className="flex gap-4">
          {currentStep === journeys.length - 1 && isStepComplete(currentStep) ? (
            <button 
              onClick={handleSubmit}
              className="px-12 py-5 bg-[#091426] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-4"
            >
              Finaliser le protocole <Send size={16} />
            </button>
          ) : (
            <button
              onClick={advanceStep}
              disabled={!isStepComplete(currentStep)}
              className={`px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-4 ${
                isStepComplete(currentStep)
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 hover:scale-105'
                  : 'bg-slate-100 text-slate-400 grayscale opacity-50 cursor-not-allowed'
              }`}
            >
              Étape Suivante <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
