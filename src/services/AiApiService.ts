import { AuditService } from './AuditService';
import i18n from '../i18n/config';

export interface AIValidationResult {
  status: 'CONFORM' | 'NON_CONFORM' | 'PARTIAL';
  riskScore: number;
  reasoning: string;
  suggestion: string;
}

export class AiApiService {
  private static BASE_URL = '/api/ai';

  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = (AuditService as any).token; // Reuse token from AuditService
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`AI API Error: ${response.statusText}`);
    }
    return response.json();
  }

  static async validateResponse(question: string, answer: string, policyId?: string): Promise<AIValidationResult> {
    return this.fetchWithAuth(`${this.BASE_URL}/validate`, {
      method: 'POST',
      body: JSON.stringify({ question, answer, policyId, language: i18n.language }),
    });
  }

  static async analyzeEvidence(imageUrl: string, criteria: string) {
    return this.fetchWithAuth(`${this.BASE_URL}/analyze-evidence`, {
      method: 'POST',
      body: JSON.stringify({ imageUrl, criteria, language: i18n.language }),
    });
  }

  static async getForensicAnalysis(entityId: string) {
    // Usually GET requests don't take body, but we could add a query param if needed
    return this.fetchWithAuth(`${this.BASE_URL}/forensics/${entityId}?lang=${i18n.language}`);
  }

  static async generateRemediationPlan(gapDescription: string) {
    return this.fetchWithAuth(`${this.BASE_URL}/remediate`, {
      method: 'POST',
      body: JSON.stringify({ gapDescription, language: i18n.language }),
    });
  }

  static async advancedAudit(question: string, context: string, mode: string, auditId?: string) {
    return this.fetchWithAuth(`${this.BASE_URL}/advanced-audit`, {
      method: 'POST',
      body: JSON.stringify({ question, context, mode, auditId, language: i18n.language }),
    });
  }

  static async analyzeStepTransition(auditId: string, currentStepIdx: number) {
    return this.fetchWithAuth(`${this.BASE_URL}/analyze-transition`, {
      method: 'POST',
      body: JSON.stringify({ auditId, currentStepIdx, language: i18n.language }),
    });
  }
}
