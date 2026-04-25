import { Request, Response } from 'express';
import { RiskService } from '../services/RiskService';

export class RiskController {
  static async list(req: Request, res: Response) {
    try {
      const risks = await RiskService.listRiskRegister();
      res.json(risks);
    } catch (error) {
      console.error('listRiskRegister error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const risk = await RiskService.createRisk(req.body);
      res.status(201).json(risk);
    } catch (error) {
      console.error('createRisk error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const risk = await RiskService.updateRisk(id, req.body);
      res.json(risk);
    } catch (error) {
      console.error('updateRisk error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RiskService.deleteRisk(id);
      res.status(204).send();
    } catch (error) {
      console.error('deleteRisk error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
