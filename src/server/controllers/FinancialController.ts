import { Request, Response } from 'express';
import { FinancialImpactService } from '../services/FinancialImpactService';
import { prisma } from '../../lib/prisma';

export class FinancialController {
  static async getSummary(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      
      // Auto-seed if needed for the demo
      await FinancialImpactService.seedDemoImpacts(orgId);
      
      const summary = await FinancialImpactService.getGlobalImpact(orgId);
      res.json(summary);
    } catch (error) {
       console.error('FinancialController.getSummary error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const impact = await FinancialImpactService.updateImpact(req.params.controlId, req.body);
      res.json(impact);
    } catch (error) {
       console.error('FinancialController.update error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getJurisdictionalHeatmap(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const entities = await prisma.legalEntity.findMany({
        where: { organizationId: orgId }
      });

      const heatmap = [];
      for (const entity of entities) {
        const risk = await FinancialImpactService.calculateJurisdictionalRisk(entity.id);
        if (risk) heatmap.push(risk);
      }

      res.json(heatmap);
    } catch (error) {
       console.error('FinancialController.getJurisdictionalHeatmap error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateTurnover(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const { turnover } = req.body;

      const org = await prisma.organization.findFirst({ where: { id: orgId } }) 
               || await prisma.organization.findFirst();
      
      if (org) {
        await prisma.organization.update({
          where: { id: org.id },
          data: { annualTurnover: turnover }
        });
      }
      
      res.json({ success: true, turnover });
    } catch (error) {
       console.error('FinancialController.updateTurnover error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
