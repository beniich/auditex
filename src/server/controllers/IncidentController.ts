import { Request, Response } from 'express';
import { IncidentService } from '../services/IncidentService';
import { WSManager } from '../lib/ws';

export class IncidentController {
  static async list(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const incidents = await IncidentService.getIncidents(orgId);
      res.json(incidents);
    } catch (error) {
      console.error('IncidentController.list error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || 'global-org-placeholder';
      const incident = await IncidentService.createIncident({
        organizationId: orgId,
        ...req.body
      });
      WSManager.broadcast('NEW_INCIDENT', incident);
      res.status(201).json(incident);
    } catch (error) {
      console.error('IncidentController.create error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addTask(req: Request, res: Response) {
    try {
      const task = await IncidentService.addTask(req.params.id, req.body);
      WSManager.broadcast('INCIDENT_UPDATED', { incidentId: req.params.id });
      res.status(201).json(task);
    } catch (error) {
       console.error('IncidentController.addTask error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateTask(req: Request, res: Response) {
     try {
       const task = await IncidentService.updateTaskStatus(req.params.taskId, req.body.status);
       WSManager.broadcast('INCIDENT_UPDATED', { taskId: req.params.taskId });
       res.json(task);
     } catch (error) {
       console.error('IncidentController.updateTask error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
  }

  static async resolve(req: Request, res: Response) {
     try {
       const incident = await IncidentService.resolveIncident(req.params.id);
       WSManager.broadcast('INCIDENT_UPDATED', incident);
       res.json(incident);
     } catch (error) {
       console.error('IncidentController.resolve error:', error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
  }
}
