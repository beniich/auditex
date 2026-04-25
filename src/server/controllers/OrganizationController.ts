import { Request, Response } from 'express';
import { OrganizationService } from '../services/OrganizationService';

export class OrganizationController {
  static async list(req: Request, res: Response) {
    try {
      const orgs = await OrganizationService.listOrganizations();
      res.json(orgs);
    } catch (error) {
      console.error('listOrganizations error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const org = await OrganizationService.getOrganizationById(id);
      if (!org) return res.status(404).json({ error: 'Not Found' });
      res.json(org);
    } catch (error) {
      console.error('getOrganization error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getSubsidiaries(req: Request, res: Response) {

    try {
      const { id } = req.params;
      const subsidiaries = await OrganizationService.getSubsidiaries(id);
      res.json(subsidiaries);
    } catch (error) {
      console.error('getSubsidiaries error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
