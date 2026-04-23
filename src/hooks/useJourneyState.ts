import { useState, useEffect, useMemo } from 'react';
import { Audit, AuditTemplate, JourneyState, RubricStatus } from '../types';
import { buildJourneyFromTemplate } from '../config/auditJourney';
import { JourneyService } from '../services/JourneyService';
import { AiApiService } from '../services/AiApiService';
import { toast } from './useToast';
import { AuditService } from '../services/AuditService';

interface ExtendedJourneyState extends JourneyState {
  isTransitioning: boolean;
  currentInsight: any | null;
  prefillsApplied: number;
}

/**
 * Central hook for managing the Guided Compliance Journey state.
 * Handles locking, progression, and state persistence.
 */
export const useJourneyState = (audit: Audit | null, template: AuditTemplate, onRefreshAudit: () => Promise<void>) => {
  const journeys = useMemo(() => buildJourneyFromTemplate(template), [template]);
  
  const [state, setState] = useState<ExtendedJourneyState>({
    currentStep: 0,
    rubricStatuses: {},
    stepValidations: {},
    aiTransitionInsights: {},
    lockedResponses: new Set(),
    isTransitioning: false,
    currentInsight: null,
    prefillsApplied: 0
  });

  // Initialize status from audit data if available
  useEffect(() => {
    if (!audit || journeys.length === 0) return;

    const initialStatuses: Record<string, RubricStatus> = {};
    const initialLocked = new Set<string>();

    journeys.forEach((step, sIdx) => {
      step.rubrics.forEach(rubric => {
        // Simple logic: if all questions in rubric have responses, mark as potentially completed
        const isCompleted = rubric.questionIds.every(qId => audit.responses[qId] !== undefined);
        
        // In a real scenario, we'd fetch the LOCKED status from the ledger (events)
        // For now, we derive it or set to ACTIVE for the first one
        if (sIdx === 0 && !isCompleted && !initialStatuses[rubric.id]) {
           initialStatuses[rubric.id] = 'ACTIVE';
        } else if (isCompleted) {
           initialStatuses[rubric.id] = 'COMPLETED';
           rubric.questionIds.forEach(id => initialLocked.add(id));
        } else if (!initialStatuses[rubric.id]) {
           initialStatuses[rubric.id] = 'LOCKED';
        }
      });
    });

    setState(prev => ({
      ...prev,
      rubricStatuses: initialStatuses,
      lockedResponses: initialLocked
    }));
  }, [audit, journeys]);

  const currentStepData = journeys[state.currentStep];

  /**
   * Locks a rubric and potentially unlocks the next one.
   */
  const completeRubric = async (rubricId: string) => {
    if (!audit) return;

    try {
      await JourneyService.lockRubric(audit.id, rubricId, 'MANUAL');
      
      setState(prev => {
        const nextStatuses = { ...prev.rubricStatuses, [rubricId]: 'COMPLETED' as RubricStatus };
        const nextLocked = new Set(prev.lockedResponses);
        
        // Lock all questions in this rubric
        const rubric = journeys.flatMap(s => s.rubrics).find(r => r.id === rubricId);
        rubric?.questionIds.forEach(id => nextLocked.add(id));

        // Unlock next rubric in the same step
        const stepRubrics = journeys[prev.currentStep].rubrics;
        const currentIdx = stepRubrics.findIndex(r => r.id === rubricId);
        if (currentIdx < stepRubrics.length - 1) {
          const nextRubric = stepRubrics[currentIdx + 1];
          nextStatuses[nextRubric.id] = 'ACTIVE';
        }

        return {
          ...prev,
          rubricStatuses: nextStatuses,
          lockedResponses: nextLocked
        };
      });

      toast.success('Rubrique validée et verrouillée au ledger.', 'Compliance Engine');
    } catch (err) {
      toast.error('Erreur lors du verrouillage de la rubrique.');
    }
  };

  /**
   * Advances to the next jalon (step) in the timeline.
   */
  const advanceStep = async () => {
    if (!audit || state.currentStep >= journeys.length - 1) return;

    setState(prev => ({ ...prev, isTransitioning: true, currentInsight: null }));

    try {
      // 1. Analyze transition with AI
      const insight = await AiApiService.analyzeStepTransition(audit.id, state.currentStep);
      
      // 2. Persist insight to ledger
      await JourneyService.saveAiTransitionInsight(audit.id, state.currentStep, insight);
      
      setState(prev => ({ 
        ...prev, 
        currentInsight: insight,
        prefillsApplied: insight.prefills?.length || 0
      }));

      // Note: We don't increment currentStep yet, the overlay does it onContinue
    } catch (err) {
      console.error(err);
      toast.error('Échec de l\'analyse de transition. Passage manuel.');
      completeTransition();
    }
  };

  const completeTransition = () => {
    if (state.currentStep >= journeys.length - 1) return;

    const nextStepIdx = state.currentStep + 1;
    
    setState(prev => {
      const nextStatuses = { ...prev.rubricStatuses };
      const firstRubricOfNextStep = journeys[nextStepIdx].rubrics[0];
      if (firstRubricOfNextStep) {
        nextStatuses[firstRubricOfNextStep.id] = 'ACTIVE';
      }

      return {
        ...prev,
        currentStep: nextStepIdx,
        rubricStatuses: nextStatuses,
        isTransitioning: false
      };
    });

    // Handle AI Prefills if any
    if (state.currentInsight?.prefills?.length > 0) {
      applyPrefills(state.currentInsight.prefills);
    }
  };

  const applyPrefills = async (prefills: any[]) => {
    if (!audit) return;
    
    try {
      for (const prefill of prefills) {
        // Only prefill if no value exists
        if (!audit.responses[prefill.questionId]) {
          await AuditService.appendEvent(audit.id, 'RESPONSE_UPDATED', {
            questionId: prefill.questionId,
            value: prefill.suggestedValue,
            isAiPrefill: true,
            confidence: prefill.confidence,
            timestamp: new Date().toISOString()
          });
        }
      }
      await onRefreshAudit();
      toast.success(`Succès : ${prefills.length} suggestions IA appliquées.`);
    } catch (err) {
      console.error('Prefill failed', err);
    }
  };

  const isStepComplete = (stepIdx: number) => {
    const step = journeys[stepIdx];
    if (!step) return false;
    return step.rubrics.every(r => state.rubricStatuses[r.id] === 'COMPLETED');
  };

  return {
    journeys,
    currentStep: state.currentStep,
    currentStepData,
    rubricStatuses: state.rubricStatuses,
    lockedResponses: state.lockedResponses,
    isTransitioning: state.isTransitioning,
    currentInsight: state.currentInsight,
    prefillsApplied: state.prefillsApplied,
    resetPrefillCount: () => setState(prev => ({ ...prev, prefillsApplied: 0 })),
    completeRubric,
    advanceStep,
    completeTransition,
    isStepComplete
  };
};
