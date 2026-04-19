import { Request, Response } from 'express';
import { reportService } from '../services/ReportService';

export const ReportController = {
  async downloadReport(req: Request, res: Response) {
    try {
      const { auditId } = req.params;
      if (!auditId) return res.status(400).json({ error: "AuditId required" });

      const markdown = await reportService.generateAuditMarkdown(auditId);
      
      const fileName = `Audit_Report_${auditId.substring(0, 8)}.md`;
      
      // On définit les headers pour forcer le téléchargement du fichier
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'text/markdown');
      res.send(markdown);
      
    } catch (error: any) {
      console.error('ReportController.downloadReport error:', error);
      res.status(500).json({ error: "Failed to generate report", message: error.message });
    }
  }
};
