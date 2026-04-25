import { Request, Response } from 'express';
import { RemediationService } from '../services/RemediationService';

export class RemediationController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const tasks = await RemediationService.listRemediations(orgId);
      res.json(tasks);
    } catch (error) {
      console.error('listRemediations error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const task = await RemediationService.createRemediation(req.body);
      res.status(201).json(task);
    } catch (error) {
      console.error('createRemediation error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await RemediationService.updateRemediation(id, req.body);
      res.json(task);
    } catch (error) {
      console.error('updateRemediation error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
