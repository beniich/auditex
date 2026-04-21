import { Request, Response } from 'express';
import { VaultService } from '../services/VaultService';

export class VaultController {
  static async listKeys(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const keys = await VaultService.getKeys(orgId);
      
      // Seed initial data if empty for the first run
      if (keys.length === 0) {
        await VaultService.createKey(orgId, 'Global_Audit_Ledger_Key', 'ED25519');
        await VaultService.createKey(orgId, 'Identity_Oracle_Bypass_Token', 'JWT_RSA');
        const updatedKeys = await VaultService.getKeys(orgId);
        return res.json(updatedKeys);
      }

      res.json(keys);
    } catch (error) {
      console.error('Vault listKeys error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createKey(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const { name, type } = req.body;
      const key = await VaultService.createKey(orgId, name, type);
      res.status(201).json(key);
    } catch (error) {
      console.error('Vault createKey error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async rotateKey(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const key = await VaultService.rotateKey(id);
      res.json(key);
    } catch (error) {
      console.error('Vault rotateKey error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async accessKey(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const key = await VaultService.logAccess(id);
      res.json({ id: key.id, value: key.encryptedValue });
    } catch (error) {
      console.error('Vault accessKey error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
