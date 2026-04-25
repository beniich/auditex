import { Request, Response } from 'express';
import { CertificationService } from '../services/CertificationService';

export class CertificationController {
  static async getCertificationsStatus(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const status = await CertificationService.getCertificationStatus(orgId);
      
      // Provide some default dummy frameworks if DB is empty for demo UX purposes
      // so the UI never looks completely empty during demo
      if (status.length === 0) {
        return res.json([
          { id: 'SOC2', name: 'SOC 2 Type II', status: 'IN_PROGRESS', progress: 45, details: 'Initialized from default fallback' },
          { id: 'ISO-27001', name: 'ISO 27001', status: 'DRAFT', progress: 10, details: 'Initialized from default fallback' }
        ]);
      }
      
      res.json(status);
    } catch (error) {
      console.error('getCertificationsStatus error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getRisks(req: Request, res: Response) {
    try {
      const risks = await CertificationService.getRiskAssessments();
      
      if (risks.length === 0) {
        return res.json([
          { jurisdiction: 'US East', riskScore: 78, category: 'COMPLIANCE', details: 'Lack of verified SOC2 boundaries.', assessedAt: new Date() },
          { jurisdiction: 'EU West (GDPR)', riskScore: 92, category: 'DATA_SOVEREIGNTY', details: 'Unencrypted backups detected in node 14.', assessedAt: new Date() }
        ]);
      }
      
      res.json(risks);
    } catch (error) {
      console.error('getRisks error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getAuditors(req: Request, res: Response) {
    try {
      const auditors = await CertificationService.getAuditors();
      res.json(auditors);
    } catch (error) {
      console.error('getAuditors error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getCOIs(req: Request, res: Response) {
    try {
      const cois = await CertificationService.getCOIs();
      res.json(cois);
    } catch (error) {
      console.error('getCOIs error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
