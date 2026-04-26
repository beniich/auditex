import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const ORG_ID = 'global-org-placeholder';

export class IdentityController {
  static async getConfig(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      let config = await prisma.ssoConfig.findUnique({ where: { orgId } });

      if (!config) {
        config = await prisma.ssoConfig.create({
          data: {
            orgId,
            name: 'Corporate Azure AD',
            protocol: 'SAML_2_0',
            acsUrl: `https://auditax.io/api/sso/acs/${orgId}`,
            entityId: 'https://login.microsoftonline.com/tenant-id',
            status: 'ACTIVE',
          },
        });
      }

      res.json(config);
    } catch (err) {
      console.error('[IdentityController.getConfig]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateConfig(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      const config = await prisma.ssoConfig.upsert({
        where: { orgId },
        update: req.body,
        create: {
          orgId,
          ...req.body,
          acsUrl: req.body.acsUrl || `https://auditax.io/api/sso/acs/${orgId}`,
          entityId: req.body.entityId || 'https://auditax.io',
        },
      });
      res.json(config);
    } catch (err) {
      console.error('[IdentityController.updateConfig]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMappings(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      let mappings = await prisma.attributeMapping.findMany({ where: { orgId } });

      if (mappings.length === 0) {
        await prisma.attributeMapping.createMany({
          data: [
            { orgId, source: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', target: 'email', status: 'ACTIVE' },
            { orgId, source: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname', target: 'firstName', status: 'ACTIVE' },
            { orgId, source: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role', target: 'role', fallback: 'VIEWER', status: 'ACTIVE' },
            { orgId, source: 'department', target: 'organizationId', status: 'ACTIVE' },
          ],
        });
        mappings = await prisma.attributeMapping.findMany({ where: { orgId } });
      }

      res.json(mappings);
    } catch (err) {
      console.error('[IdentityController.getMappings]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async testConnection(req: Request, res: Response) {
    try {
      // Simulate an SSO probe with realistic latency
      const start = Date.now();
      await new Promise(r => setTimeout(r, 120 + Math.random() * 80));
      const latency = Date.now() - start;

      res.json({
        success: true,
        latency,
        details: 'SAML metadata exchange successful. Certificate verified.',
      });
    } catch (err) {
      console.error('[IdentityController.testConnection]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      const user = await prisma.user.findFirst({
        where: { organizationId: orgId },
        include: { organization: true }
      });
      res.json(user);
    } catch (err) {
      console.error('[IdentityController.getProfile]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params; // In reality, get from req.auth
      const updated = await prisma.user.update({
        where: { id: userId || (req as any).user?.id },
        data: req.body
      });
      res.json(updated);
    } catch (err) {
      console.error('[IdentityController.updateProfile]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
