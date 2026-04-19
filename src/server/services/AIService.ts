import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY || 'sk-placeholder', // Fallback for build/initialization
});

import { AI_PROMPTS } from '../utils/aiPrompts';

export class AIService {
  /**
   * MODEL 1: The Auditor (Response Validation with RAG Context)
   */
  static async validateAuditResponse(question: string, answer: string, policy: string) {
    const promptConfig = AI_PROMPTS.AUDITOR_VALIDATION;
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: promptConfig.system(policy) }, { role: 'user', content: `Q: ${question}\nA: ${answer}` }],
        response_format: { type: 'json_object' },
      });

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
      throw error;
    }
  }
}

