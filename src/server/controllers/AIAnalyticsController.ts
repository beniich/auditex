import { Request, Response } from 'express';
import { AiTelemetryService } from '../services/AiTelemetryService';

export const AIAnalyticsController = {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await AiTelemetryService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI telemetry" });
    }
  },

  async trackAction(req: Request, res: Response) {
    try {
      const { action } = req.body; // 'ACCEPT' or 'REJECT'
      AiTelemetryService.trackDecision(action === 'ACCEPT');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track AI action" });
    }
  }
};
