import { api } from '../lib/api';
import i18n from '../i18n/config';

export interface AIValidationResult {
  status: 'CONFORM' | 'NON_CONFORM' | 'PARTIAL';
  riskScore: number;
  reasoning: string;
  suggestion: string;
}

export class AiApiService {
  static async validateResponse(question: string, answer: string, policyId?: string): Promise<AIValidationResult> {
    return api.post<AIValidationResult>('/ai/validate', { question, answer, policyId, language: i18n.language });
  }

  static async analyzeEvidence(imageUrl: string, criteria: string) {
    return api.post('/ai/analyze-evidence', { imageUrl, criteria, language: i18n.language });
  }

  static async getForensicAnalysis(entityId: string) {
    return api.get(`/ai/forensics/${entityId}?lang=${i18n.language}`);
  }

  static async generateRemediationPlan(gapDescription: string) {
    const res = await api.post<{ tasks: any[] }>('/ai/remediate', { gapDescription, language: i18n.language });
    return res.tasks;
  }

  static async advancedAudit(question: string, context: string, mode: string, auditId?: string) {
    return api.post('/ai/advanced-audit', { question, context, mode, auditId, language: i18n.language });
  }

  static async analyzeStepTransition(auditId: string, currentStepIdx: number) {
    return api.post('/ai/analyze-transition', { auditId, currentStepIdx, language: i18n.language });
  }

  static async getRagSources() {
    return api.get<any[]>(`/rag/sources?lang=${i18n.language}`);
  }

  static async queryRag(query: string) {
    return api.get<any[]>(`/rag/query?q=${encodeURIComponent(query)}&lang=${i18n.language}`);
  }
}
