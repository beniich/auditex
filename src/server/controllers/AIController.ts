import { Request, Response } from 'express';
import { AIService } from '../services/AIService';
import { prisma } from '../../lib/prisma';
import { quotaService, AIActionType } from '../services/QuotaService';
import { agentOrchestrator } from '../services/AgentOrchestrator';
import { LogicExecutor } from '../services/LogicExecutor';

export class AIController {
  /**
   * Validates an audit response using RAG (Retrieval-Augmented Generation)
   */
  static async validate(req: Request, res: Response) {
    try {
      const { question, answer, policyId } = req.body;
      
      // Attempt to retrieve the policy context for RAG
      const policy = policyId 
        ? await prisma.policy.findUnique({ where: { id: policyId } })
        : null;
        
      const policyContent = policy?.content || "General security best practices for ISO 27001 and SOC2.";

      const result = await AIService.validateAuditResponse(question, answer, policyContent);
      res.json(result);
    } catch (error: any) {
      console.error('AIController.validate error:', error);
      res.status(500).json({ error: 'AI Validation processing failed', message: error.message });
    }
  }

  /**
   * Analyzes an uploaded evidence image
   */
  static async analyzeEvidence(req: Request, res: Response) {
    try {
      const { imageUrl, criteria } = req.body;
      if (!imageUrl) return res.status(400).json({ error: 'No image URL provided' });

      const analysis = await AIService.analyzeEvidence(imageUrl, criteria || "General document authenticity check.");
      res.json({ analysis });
    } catch (error: any) {
      console.error('AIController.analyzeEvidence error:', error);
      res.status(500).json({ error: 'AI Vision analysis failed', message: error.message });
    }
  }

  /**
   * Forensic analysis of a node or entity event chain
   */
  static async forensic(req: Request, res: Response) {
    try {
      const { entityId } = req.params;
      
      // Fetch the last 50 events for context
      const logs = await prisma.auditEvent.findMany({
        where: { auditId: entityId }, // or search by entity metadata
        orderBy: { timestamp: 'desc' },
        take: 50
      });

      const analysis = await AIService.analyzeForensicLogs(logs);
      res.json({ analysis });
    } catch (error: any) {
      console.error('AIController.forensic error:', error);
      res.status(500).json({ error: 'Forensic AI analysis failed', message: error.message });
    }
  }

  /**
   * Generates a remediation plan (Auto-CAPA)
   */
  static async remediate(req: Request, res: Response) {
    try {
      const { gapDescription } = req.body;
      if (!gapDescription) return res.status(400).json({ error: 'Gap description required' });

      const tasks = await AIService.generateRemediationPlan(gapDescription);
      res.json({ tasks });
    } catch (error: any) {
      console.error('AIController.remediate error:', error);
      res.status(500).json({ error: 'Remediation generation failed', message: error.message });
    }
  }

  /**
   * Advanced Audit Engine with Quota and Strategies
   */
  static async advancedAudit(req: Request, res: Response) {
    const { question, context, mode, auditId } = req.body;
    const userId = (req as any).auth?.userId || (req as any).user?.id || 'inspector-123';

    try {
      // 1. Quota management before execution
      await quotaService.chargeAction(userId, mode as AIActionType, 1, auditId);

      if (mode === 'DSL') {
        const rule = await AIService.generateLogicRule(question, context);
        const result = LogicExecutor.evaluate(rule, req.body.userData || {});
        return res.json({ rule, result });
      } 
      
      if (mode === 'AGENTIC') {
        const agenticResult = await agentOrchestrator.executeComplexAudit(question, context);
        
        // If it looped more than once, we charge for additional agentic loops
        if (agenticResult.loopCount > 1) {
          await quotaService.chargeAction(userId, AIActionType.AGENTIC_LOOP, agenticResult.loopCount - 1, auditId);
        }
        return res.json(agenticResult);
      }

      // SIMPLE mode
      const simple = await AIService.validateSimple(question, context);
      return res.json(simple);

    } catch (error: any) {
      if (error.message === 'INSUFFICIENT_QUOTA') return res.status(402).json({ error: 'Payment Required: Insufficient AI Quota' });
      if (error.message === 'USER_NOT_FOUND') return res.status(404).json({ error: 'User mapping failed for quota creation' });
      console.error('AIController.advancedAudit error:', error);
      return res.status(500).json({ error: 'Advanced AI execution failed', message: error.message });
    }
  }

  static async getQuotaBalance(req: Request, res: Response) {
    try {
      const userId = (req as any).auth?.userId || (req as any).user?.id || 'inspector-123';
      const balance = await quotaService.getBalance(userId);
      const logs = await quotaService.getUsageLogs(userId);
      return res.json({ balance, logs });
    } catch (error: any) {
      console.error('AIController.getQuotaBalance error:', error);
      return res.status(500).json({ error: 'Failed to fetch quota info' });
    }
  }
}
