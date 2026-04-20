import { AIService } from './AIService';

export interface AgentResult {
  result: string;
  loopCount: number;
  critique?: string;
  selfCorrected: boolean;
}

export class AgentOrchestrator {
  private readonly MAX_LOOPS = 3;

  async executeComplexAudit(question: string, context: string): Promise<AgentResult> {
    // Étape 1 — Worker Draft
    const draft = await AIService.generateDraft(question, context);

    // Étape 2 — Critic Analysis
    const critique = await AIService.criticizeDraft(draft, context);

    if (!critique.hasMajorErrors) {
      return { result: draft, loopCount: 1, selfCorrected: false };
    }

    // Étape 3 — Self-Correction (max 1 refinement)
    const refined = await AIService.refineDraft(draft, critique.feedback);
    return {
      result: refined,
      loopCount: 2,
      critique: critique.feedback,
      selfCorrected: true,
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
