import { Request, Response } from 'express';
import { AccessService } from '../services/AccessService';

export class AccessController {
  static async listRoles(req: Request, res: Response) {
    try {
      const roles = await AccessService.getRoles();
      res.json(roles);
    } catch (error) {
      console.error('listRoles error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async listMembers(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const members = await AccessService.getMemberships(orgId);
      res.json(members);
    } catch (error) {
      console.error('listMembers error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const user = await AccessService.updateMemberRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error('updateRole error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
