import { api } from '../lib/api';
import i18n from '../i18n/config';

export interface AIValidationResult {
  status: 'CONFORM' | 'NON_CONFORM' | 'PARTIAL';
  riskScore: number;
  reasoning: string;
  suggestion: string;
}

export interface AIAdvancedAuditResult {
  result?: string;
  reasoning?: string;
  rule?: any;
  selfCorrected?: boolean;
}

export interface AIEvidenceAnalysis {
  analysis: string;
}

export class AiApiService {
  static async validateResponse(question: string, answer: string, policyId?: string): Promise<AIValidationResult> {
    return api.post<AIValidationResult>('/ai/validate', { question, answer, policyId, language: i18n.language });
  }

  static async analyzeEvidence(imageUrl: string, criteria: string): Promise<AIEvidenceAnalysis> {
    return api.post<AIEvidenceAnalysis>('/ai/analyze-evidence', { imageUrl, criteria, language: i18n.language });
  }

  static async getForensicAnalysis(entityId: string): Promise<{ analysis: string }> {
    return api.get<{ analysis: string }>(`/ai/forensics/${entityId}?lang=${i18n.language}`);
  }

  static async generateRemediationPlan(gapDescription: string): Promise<any[]> {
    const res = await api.post<{ tasks: any[] }>('/ai/remediate', { gapDescription, language: i18n.language });
    return res.tasks;
  }

  static async advancedAudit(question: string, context: string, mode: string, auditId?: string): Promise<AIAdvancedAuditResult> {
    return api.post<AIAdvancedAuditResult>('/ai/advanced-audit', { question, context, mode, auditId, language: i18n.language });
  }

  static async analyzeStepTransition(auditId: string, currentStepIdx: number): Promise<any> {
    return api.post<any>('/ai/analyze-transition', { auditId, currentStepIdx, language: i18n.language });
  }

  static async getRagSources(): Promise<any[]> {
    return api.get<any[]>(`/rag/sources?lang=${i18n.language}`);
  }

  static async queryRag(query: string): Promise<any[]> {
    return api.get<any[]>(`/rag/query?q=${encodeURIComponent(query)}&lang=${i18n.language}`);
  }
}
