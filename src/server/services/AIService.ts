import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY || 'sk-placeholder', // Fallback for build/initialization
});

import { AI_PROMPTS } from '../utils/aiPrompts';
import { AiTelemetryService } from './AiTelemetryService';
import { performance } from 'perf_hooks';

export class AIService {
  /**
   * MODEL 1: The Auditor (Response Validation with RAG Context)
   */
  static async validateAuditResponse(question: string, answer: string, policy: string) {
    const promptConfig = AI_PROMPTS.AUDITOR_VALIDATION;
    const startTime = performance.now();

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: promptConfig.system(policy) }, { role: 'user', content: `Q: ${question}\nA: ${answer}` }],
        response_format: { type: 'json_object' },
      });

      const latency = performance.now() - startTime;
      const usage = response.usage?.total_tokens || 0;
      AiTelemetryService.trackCall(latency, usage);

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return { ...result, _ai_version: promptConfig.version };
    } catch (error) {
      console.error('AIService.validateAuditResponse error:', error);
      throw error;
    }
  }

  /**
   * MODEL 2: The Inspector (Evidence Vision & OCR)
   */
  static async analyzeEvidence(imageUrl: string, criteria: string) {
    const promptConfig = AI_PROMPTS.INSPECTOR_VISION;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptConfig.user(criteria) },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
      });
      return { analysis: response.choices[0].message.content, _ai_version: promptConfig.version };
    } catch (error) {
      console.error('AIService.analyzeEvidence error:', error);
      throw error;
    }
  }

  /**
   * MODEL 3: The Detective (Forensic Analysis of SHA-256 Chains)
   */
  static async analyzeForensicLogs(logs: any[]) {
    const promptConfig = AI_PROMPTS.DETECTIVE_FORENSICS;
    const logData = logs.map(l => `[${l.timestamp}] EVENT: ${l.type} | HASH: ${l.sha256_hash?.substring(0,8)}... | PAYLOAD: ${JSON.stringify(l.payload)}`).join('\n');

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: promptConfig.system }, 
          { role: 'user', content: promptConfig.user(logData) }
        ],
      });
      return { analysis: response.choices[0].message.content, _ai_version: promptConfig.version };
    } catch (error) {
      console.error('AIService.analyzeForensicLogs error:', error);
      throw error;
    }
  }

  /**
   * MODEL 4: The Architect (Auto-CAPA Remediation Workflow)
   */
  static async generateRemediationPlan(gapDescription: string) {
    const promptConfig = AI_PROMPTS.ARCHITECT_REMEDIATION;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: promptConfig.system }, { role: 'user', content: `GAP: ${gapDescription}` }],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      const tasks = parsed.tasks || [];
      return tasks.map((t: any) => ({ ...t, _ai_version: promptConfig.version }));
    } catch (error) {
      console.error('AIService.generateRemediationPlan error:', error);
      return [];
    }
  }

  /**
   * RAG: Knowledge Base - List Sources
   */
  static async getRagSources() {
    // In a real industrial app, this would query a vector store or document index (e.g. Pinecone, Weaviate)
    // For AuditAX Demo, we return the structural knowledge base metadata
    return [
      { id: 'src-001', name: 'Annual_Risk_Report.pdf', status: 'Processed', reliability: 98, color: 'emerald', time: '2h ago' },
      { id: 'src-002', name: 'Reg_Guidance_Q4.docx', status: 'Processing', reliability: 45, color: 'blue', time: 'Just now' },
      { id: 'src-003', name: 'Policy_Manual_v2.pdf', status: 'Processed', reliability: 94, color: 'emerald', time: '1d ago' },
      { id: 'src-004', name: 'Infrastructure_Baseline_v1.pdf', status: 'Processed', reliability: 100, color: 'emerald', time: '3d ago' }
    ];
  }

  /**
   * RAG: Knowledge Base - Semantic Query
   */
  static async queryRag(query: string) {
    if (query === 'preview') {
      return [
        { text: "Section 3.1.2 defines material risk thresholds as any exposure exceeding $5M...", doc: "Annual_Risk_Report.pdf" },
        { text: "Effective Jan 1, 2024, all entities must adopt the revised framework for data sovereignty...", doc: "Reg_Guidance_Q4.docx " },
        { text: "The cross-border data transfer protocol requires double-blind encryption for all PII data...", doc: "Policy_Manual_v2.pdf" }
      ];
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a Knowledge Base Assistant. Extract 3 high-relevance snippets from the structural knowledge base for the user query.' },
          { role: 'user', content: `Query: ${query}` }
        ],
        response_format: { type: 'json_object' }
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{"snippets": []}');
      return parsed.snippets || [];
    } catch (error) {
      console.error('AIService.queryRag error:', error);
      return [];
    }
  }

  /**
   * MODEL 5: The Synthesizer (Executive Summary for Reports)
   */
  static async generateExecutiveSummary(findingsData: string) {
    const prompt = `You are a Senior Strategic Compliance Consultant.
    Based on these audit findings, write a high-level executive summary (3-4 paragraphs) suitable for C-suite presentation.
    Focus on strategic risk, priority of remediation, and overall security posture.
    Use professional tone. Use Markdown formatting.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }, { role: 'user', content: `FINDINGS:\n${findingsData}` }],
      });
      return response.choices[0].message.content || 'Report generation summary unavailable.';
    } catch (error) {
      console.error('AIService.generateExecutiveSummary error:', error);
      return 'AI synthesis failed during report generation.';
    }
  }

  /**
   * MODEL 6: The Logician (DSL Logic Generation)
   */
  static async generateLogicRule(question: string, context: string) {
    const prompt = `You are a strict compliance auditor. Read the following audit question and context context.
    Return ONLY a JSON object representing a logic rule to evaluate compliance.
    JSON format:
    {
      "fact": "string (the field name to check, e.g., 'password_length')",
      "operator": "lt" | "gt" | "eq" | "gte" | "lte" | "contains" | "not_contains",
      "value": any (the threshold or expected value),
      "severity": "CRITICAL" | "MAJOR" | "MINOR"
    }
    
    Q: ${question}
    Context: ${context}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.1,
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AIService.generateLogicRule error:', error);
      throw error;
    }
  }

  /**
   * Simple Validation (Low cost, probabilistic)
   */
  static async validateSimple(question: string, context: string) {
    const prompt = `You are an auditor. Quickly evaluate this question based on the context. Return a simple JSON with a boolean 'compliant' and string 'reason'.`;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.7,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `Q: ${question}\nContext: ${context}` }
        ],
        response_format: { type: 'json_object' },
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AIService.validateSimple error:', error);
      throw error;
    }
  }

  /**
   * AGENTIC ENGINE - Worker
   */
  static async generateDraft(question: string, context: string) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.6,
        messages: [
          { role: 'system', content: AI_PROMPTS.WORKER_AUDITOR.system },
          { role: 'user', content: `Q: ${question}\nContext: ${context}` }
        ]
      });
      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('AIService.generateDraft error:', error);
      throw error;
    }
  }

  /**
   * AGENTIC ENGINE - Critic
   */
  static async criticizeDraft(draft: string, context: string) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.2,
        messages: [
          { role: 'system', content: AI_PROMPTS.CRITIC_AUDITOR.system },
          { role: 'user', content: `Context: ${context}\nDraft to criticize:\n${draft}` }
        ],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content || '{"hasMajorErrors": false, "feedback": "OK"}');
    } catch (error) {
      console.error('AIService.criticizeDraft error:', error);
      throw error;
    }
  }

  /**
   * AGENTIC ENGINE - Finalizer
   */
  static async refineDraft(draft: string, critique: string) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.4,
        messages: [
          { role: 'system', content: AI_PROMPTS.FINALIZER_AUDITOR.system },
          { role: 'user', content: `Draft:\n${draft}\n\nCritique:\n${critique}` }
        ]
      });
      return response.choices[0].message.content || draft;
    } catch (error) {
      console.error('AIService.refineDraft error:', error);
      throw error;
    }
  }

  /**
   * MODEL 7: The Notary (Digital Certificate Generation)
   */
  static async generateIntegrityCertificate(reportData: any, organizationId: string) {
    const crypto = await import('crypto');
    
    // 1. Create a data payload for the hash
    const payload = JSON.stringify({
      org: organizationId,
      data: reportData,
      ts: new Date().toISOString()
    });

    // 2. Generate SHA-256 Fingerprint
    const fingerprint = crypto.createHash('sha256').update(payload).digest('hex');
    
    // 3. Generate a "Human-readable" certificate summary via IA
    const prompt = `You are a Digital Notary AI. Create a highly professional, 2-line certificate of integrity for a digital audit report.
    Include mentions of the fingerprint [${fingerprint.substring(0, 12)}...] and the immuability of the ledger.
    Keep it extremely formal and institutional.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
      });

      return {
        fingerprint: fingerprint,
        certificateText: response.choices[0].message.content || 'Certification d\'intégrité cryptographique vérifiée.',
        issuer: 'AuditAX Nexus Notary Engine',
        issuedAt: new Date().toISOString(),
        validationCode: `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
      };
    } catch (error) {
      console.error('AIService.generateIntegrityCertificate error:', error);
      return {
        fingerprint: fingerprint,
        certificateText: 'Certification d\'intégrité cryptographique par défaut.',
        issuer: 'AuditAX Nexus Backup Notary',
        issuedAt: new Date().toISOString(),
        validationCode: 'CERT-FAILSAFE'
      };
    }
  }
}
