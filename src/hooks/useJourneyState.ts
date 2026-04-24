import { useState, useCallback } from 'react';
import { AuditTemplate, JourneyState, RubricStatus } from '../types';
import { JourneyService } from '../services/JourneyService';
import { buildJourneyFromTemplate } from '../config/auditJourney';
import { toast } from './useToast';

export const useJourneyState = (auditId: string, template: AuditTemplate) => {
  const journeySteps = buildJourneyFromTemplate(template);
  
  const [journeyState, setJourneyState] = useState<JourneyState>({
    currentStep: 1,
    rubricStatuses: {},
    stepValidations: {},
    aiTransitionInsights: {},
    lockedResponses: new Set<string>()
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionInsight, setTransitionInsight] = useState<any>(null);

  const completeRubric = useCallback((rubricId: string, questionIds: string[]) => {
    setJourneyState(prev => {
      const newLocked = new Set(prev.lockedResponses);
      questionIds.forEach(id => newLocked.add(id));
      
      const newState = {
        ...prev,
        rubricStatuses: {
          ...prev.rubricStatuses,
          [rubricId]: 'COMPLETED' as RubricStatus
        },
        lockedResponses: newLocked
      };

      JourneyService.saveState(auditId, newState);
      return newState;
    });
    toast.success('Rubrique verrouillée dans le ledger', 'Gouvernance Active');
  }, [auditId]);

  const unlockRubric = useCallback((rubricId: string, questionIds: string[]) => {
    setJourneyState(prev => {
      const newLocked = new Set(prev.lockedResponses);
      questionIds.forEach(id => newLocked.delete(id));
      
      const newState = {
        ...prev,
        rubricStatuses: {
          ...prev.rubricStatuses,
          [rubricId]: 'ACTIVE' as RubricStatus
        },
        lockedResponses: newLocked
      };
      
      JourneyService.saveState(auditId, newState);
      return newState;
    });
    toast.info('Verrou levé sur la rubrique. Changements audités.', 'Override Administrateur');
  }, [auditId]);

  const triggerTransition = useCallback(async (currentStepIdx: number, insightData: any) => {
    setIsTransitioning(true);
    setTransitionInsight(insightData);
  }, []);

  const advanceStepAfterTransition = useCallback(() => {
    setJourneyState(prev => {
      const nextStep = prev.currentStep + 1;
      const newState = {
        ...prev,
        stepValidations: {
          ...prev.stepValidations,
          [prev.currentStep]: true
        },
        currentStep: nextStep <= journeySteps.length ? nextStep : prev.currentStep
      };
      
      JourneyService.saveState(auditId, newState);
      JourneyService.logMilestone(auditId, prev.currentStep);
      return newState;
    });
    setIsTransitioning(false);
    // Insight cleanup happens explicitly if needed, but we keep it for now so the next step can use it
  }, [auditId, journeySteps.length]);

  const dismissInsight = useCallback(() => {
    setTransitionInsight(null);
  }, []);

  const isStepComplete = useCallback((stepIdx: number) => {
    return !!journeyState.stepValidations[stepIdx];
  }, [journeyState.stepValidations]);

  const isRubricLocked = useCallback((rubricId: string) => {
    return journeyState.rubricStatuses[rubricId] === 'COMPLETED' || journeyState.rubricStatuses[rubricId] === 'AI_VALIDATED';
  }, [journeyState.rubricStatuses]);

  return { 
    journeySteps,
    journeyState, 
    completeRubric, 
    unlockRubric, 
    triggerTransition,
    advanceStepAfterTransition,
    isTransitioning,
    transitionInsight,
    dismissInsight,
    isStepComplete, 
    isRubricLocked 
  };
};
