import { AuditService } from './AuditService';

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
      body: JSON.stringify({ question, answer, policyId }),
    });
  }

  static async analyzeEvidence(imageUrl: string, criteria: string) {
    return this.fetchWithAuth(`${this.BASE_URL}/analyze-evidence`, {
      method: 'POST',
      body: JSON.stringify({ imageUrl, criteria }),
    });
  }

  static async getForensicAnalysis(entityId: string) {
    return this.fetchWithAuth(`${this.BASE_URL}/forensics/${entityId}`);
  }

  static async generateRemediationPlan(gapDescription: string) {
    return this.fetchWithAuth(`${this.BASE_URL}/remediate`, {
      method: 'POST',
      body: JSON.stringify({ gapDescription }),
    });
  }
}
