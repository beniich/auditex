import { Request, Response } from 'express';
import { LegalEntityService } from '../services/LegalEntityService';

export class LegalEntityController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      let entities = await LegalEntityService.getEntities(orgId);
      
      if (entities.length === 0) {
        // Seed initial structure
        const root = await LegalEntityService.createEntity({
          name: 'AuditMaster Global Holdings',
          organizationId: orgId,
          jurisdiction: 'Delaware, US',
          status: 'VERIFIED',
          ownerPercent: 100
        });

        await LegalEntityService.createEntity({
          name: 'AMG EMEA Ltd',
          organizationId: orgId,
          jurisdiction: 'United Kingdom',
          parentId: root.id,
          status: 'VERIFIED',
          ownerPercent: 100,
          taxId: 'GB-987654321'
        });

        await LegalEntityService.createEntity({
          name: 'AMG Asia-Pac Pte',
          organizationId: orgId,
          jurisdiction: 'Singapore',
          parentId: root.id,
          status: 'IN_PROGRESS',
          ownerPercent: 75,
          taxId: 'SGP-20123456'
        });

        await LegalEntityService.createEntity({
          name: 'AMG Brasil Servicos',
          organizationId: orgId,
          jurisdiction: 'Brazil',
          parentId: root.id,
          status: 'ACTION_REQ',
          ownerPercent: 51,
          taxId: 'BR-123.456.78'
        });

        entities = await LegalEntityService.getEntities(orgId);
      }

      res.json(entities);
    } catch (error) {
      console.error('LegalEntity list error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
