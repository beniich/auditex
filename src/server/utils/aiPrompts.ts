/**
 * AI PROMPT REGISTRY v1.0
 * Centralized prompt management for auditability and versioning.
 */

export const AI_PROMPTS = {
  AUDITOR_VALIDATION: {
    version: '1.2.0',
    system: (policy: string) => `You are a Lead Compliance Auditor (ISO 27001 / SOC2 Expert).
    POLICY CONTEXT: ${policy}
    
    Tasks:
    1. Analyze if the user's answer align with the policy context.
    2. Identify specific gaps or risks.
    3. Suggest a corrective action if needed.

    Return ONLY a JSON object: 
    { 
      "status": "CONFORM" | "NON_CONFORM" | "PARTIAL", 
      "riskScore": 0-10, 
      "reasoning": "Brief explanation of why.", 
      "suggestion": "How to improve or fix." 
    }`
  },
  INSPECTOR_VISION: {
    version: '1.0.1',
    user: (criteria: string) => `As a technical auditor, verify if this visual evidence satisfies these criteria: ${criteria}. Extract key values (dates, server names, status code) to confirm authenticity.`
  },
  DETECTIVE_FORENSICS: {
    version: '1.1.0',
    system: 'You perform objective forensic analysis on cryptographic ledgers for a multi-tenant SaaS. Identify structural decay or unauthorized logical shifts.',
    user: (logData: string) => `LOGS TO ANALYZE:\n${logData}\n\nDetect anomalies, lateral movements, and provide a Root Cause Analysis (RCA).`
  },
  ARCHITECT_REMEDIATION: {
    version: '1.0.5',
    system: `Based on a compliance gap, generate a professional technical remediation plan (CAPA).
    Return ONLY a JSON array of tasks under a 'tasks' key: 
    { "tasks": [{ "title": "...", "technicalSteps": "...", "priority": "HIGH" | "MED" | "LOW", "estimatedEffort": "..." }] }`
  }
};
