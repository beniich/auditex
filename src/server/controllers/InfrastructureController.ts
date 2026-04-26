import { Request, Response } from 'express';
import { InfrastructureService } from '../services/InfrastructureService';
import { WSManager } from '../lib/ws';

export class InfrastructureController {
  static async discover(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      // Simulate discovery scan
      await new Promise(r => setTimeout(r, 2000));
      
      const discoveredNodes = [
        { name: 'Discovered-VM-' + Math.floor(Math.random() * 1000), type: 'VIRTUAL_MACHINE' as "VIRTUAL_MACHINE", region: 'EU-West' },
        { name: 'New-DB-' + Math.floor(Math.random() * 1000), type: 'DATABASE' as "DATABASE", region: 'US-East' }
      ];

      for (const node of discoveredNodes) {
        await InfrastructureService.registerNode({ ...node, organizationId: orgId });
      }

      res.json({ message: 'Discovery complete', count: discoveredNodes.length });
    } catch (error) {
      console.error('discovery error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async list(req: Request, res: Response) {

    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const nodes = await InfrastructureService.getNodes(orgId);
      res.json(nodes);
    } catch (error) {
      console.error('InfrastructureController.list error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const node = await InfrastructureService.registerNode({
        organizationId: orgId,
        ...req.body
      });
      res.status(201).json(node);
    } catch (error) {
      console.error('InfrastructureController.register error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const node = await InfrastructureService.updateNodeStatus(req.params.id, req.body.status);
      WSManager.broadcast('NODE_UPDATED', node);
      res.json(node);
    } catch (error) {
       console.error('InfrastructureController.updateStatus error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const stats = await InfrastructureService.getStats(orgId);
      res.json(stats);
    } catch (error) {
       console.error('InfrastructureController.getStats error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getHealth(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Simulate real-time metrics fetch
      const metrics = {
        cpuUsage: (Math.random() * 40 + 10).toFixed(1) + '%',
        memoryUsage: (Math.random() * 30 + 50).toFixed(1) + '%',
        activeConnections: Math.floor(Math.random() * 500) + 50,
        uptime: '45d 12h 4m',
        lastHealthCheck: new Date().toISOString()
      };
      
      res.json({
        nodeId: id,
        status: 'HEALTHY',
        metrics
      });
    } catch (error) {
       console.error('InfrastructureController.getHealth error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
