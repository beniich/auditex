import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

export class NotificationController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const items = await NotificationService.getNotifications(orgId);
      
      if (items.length === 0) {
        // Seed some demo notifications
        await NotificationService.createNotification(orgId, 'System Integrity Check', 'All cryptographic chains verified valid.', 'SUCCESS');
        await NotificationService.createNotification(orgId, 'New Compliance Drift', 'Detected 2 gaps in ISO-27001 Annex A.12.', 'WARNING');
        const updated = await NotificationService.getNotifications(orgId);
        return res.json(updated);
      }
      
      res.json(items);
    } catch (error) {
      console.error('Notification list error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Notification markRead error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async markAllRead(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      await NotificationService.markAllAsRead(orgId);
      res.json({ success: true });
    } catch (error) {
      console.error('Notification markAllRead error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
