import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { randomBytes } from 'crypto';

const ORG_ID = 'global-org-placeholder';

export class ApiKeyController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      let keys = await prisma.apiKey.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
      });

      // Seed demo key on first call
      if (keys.length === 0) {
        await prisma.apiKey.create({
          data: {
            organizationId: orgId,
            name: 'SIEM Integration',
            secret: `am_${randomBytes(16).toString('hex')}`,
            scope: 'READ_ONLY',
            status: 'ACTIVE',
          },
        });
        keys = await prisma.apiKey.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } });
      }

      res.json(keys);
    } catch (err) {
      console.error('[ApiKeyController.list]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      const { name, scope = 'READ_ONLY' } = req.body;

      if (!name) return res.status(400).json({ error: 'name is required' });

      const key = await prisma.apiKey.create({
        data: {
          organizationId: orgId,
          name,
          secret: `am_${randomBytes(24).toString('hex')}`,
          scope,
          status: 'ACTIVE',
        },
      });

      res.status(201).json(key);
    } catch (err) {
      console.error('[ApiKeyController.create]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async revoke(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.apiKey.update({
        where: { id },
        data: { status: 'REVOKED' },
      });
      res.status(204).send();
    } catch (err) {
      console.error('[ApiKeyController.revoke]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async rotate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const key = await prisma.apiKey.update({
        where: { id },
        data: {
          secret: `am_${randomBytes(24).toString('hex')}`,
          lastUsedAt: new Date(),
        },
      });
      res.json(key);
    } catch (err) {
      console.error('[ApiKeyController.rotate]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
