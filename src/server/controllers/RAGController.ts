import { Request, Response } from 'express';
import { AIService } from '../services/AIService';

export class RAGController {
  static async getSources(req: Request, res: Response) {
    try {
      const sources = await AIService.getRagSources();
      res.json(sources);
    } catch (error: any) {
      console.error('RAGController.getSources error:', error);
      res.status(500).json({ error: 'Failed to fetch knowledge base sources' });
    }
  }

  static async query(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const queryStr = typeof q === 'string' ? q : 'preview';
      
      const snippets = await AIService.queryRag(queryStr);
      res.json(snippets);
    } catch (error: any) {
      console.error('RAGController.query error:', error);
      res.status(500).json({ error: 'Semantic query failed' });
    }
  }
}
