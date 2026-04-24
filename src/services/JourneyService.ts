import { AuditService } from './AuditService';
import { JourneyState } from '../types';

export class JourneyService {
  static async saveState(auditId: string, state: JourneyState) {
    try {
      // Serialize Sets into Arrays for JSON storage in the ledger
      const serializedState = {
        ...state,
        lockedResponses: Array.from(state.lockedResponses)
      };

      await AuditService.appendEvent(auditId, 'JOURNEY_STATE_UPDATE', serializedState);
    } catch (e) {
      console.error('Failed to sync Journey State to ledger:', e);
    }
  }

  static async logMilestone(auditId: string, stepIdx: number) {
    try {
      await AuditService.appendEvent(auditId, 'JOURNEY_STEP_COMPLETED', { step: stepIdx });
    } catch (e) {
      console.error('Failed to sync Milestone to ledger:', e);
    }
  }
}
