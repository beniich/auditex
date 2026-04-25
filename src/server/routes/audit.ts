import { Router } from 'express';
import { AuditController } from '../controllers/AuditController';

const router = Router();

// Audit Routes
router.get('/templates', AuditController.getTemplates);
router.get('/audits', AuditController.getAudits);
router.post('/audit/start', AuditController.startAudit);
router.post('/audit/:id/events', AuditController.addEvent);
router.get('/audit/:id/events', AuditController.getEvents);
router.get('/audit/logs', AuditController.getLogs);
router.get('/audit/:id/verify', AuditController.verifyAudit);

export default router;
