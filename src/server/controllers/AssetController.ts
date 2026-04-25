import { Request, Response } from 'express';
import { AssetService } from '../services/AssetService';

export class AssetController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const assets = await AssetService.listAssets(orgId);
      res.json(assets);
    } catch (error) {
      console.error('listAssets error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async tag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tags } = req.body;
      const asset = await AssetService.tagAsset(id, tags);
      res.json(asset);
    } catch (error) {
      console.error('tagAsset error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
