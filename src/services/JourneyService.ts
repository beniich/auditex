import { AuditService } from './AuditService';
import { JourneyState, RubricStatus } from '../types';

/**
 * Service to manage Journey-specific persistence within the immutable audit ledger.
 */
export const JourneyService = {
  /**
   * Persists a journey state change as a ledger event.
   */
  async trackStepCompletion(auditId: string, stepIndex: number, insight?: string) {
    return AuditService.appendEvent(auditId, 'JOURNEY_STEP_COMPLETED', {
      stepIndex,
      insight,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Records the transition to a locked state for a rubric.
   */
  async lockRubric(auditId: string, rubricId: string, validationType: 'MANUAL' | 'AI') {
    return AuditService.appendEvent(auditId, 'RUBRIC_LOCKED', {
      rubricId,
      validationType,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * AI Analysis of a step completion to prepare prefills for the next step.
   */
  async saveAiTransitionInsight(auditId: string, stepIndex: number, insight: any) {
    return AuditService.appendEvent(auditId, 'AI_TRANSITION_INSIGHT', {
      stepIndex,
      insight,
      timestamp: new Date().toISOString()
    });
  }
};
