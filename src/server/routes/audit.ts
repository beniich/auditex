import { Router } from 'express';
import { AuditController } from '../controllers/AuditController';

const router = Router();

// ── Audit Routes ── (static routes MUST come before dynamic :id routes)
router.get('/templates', AuditController.getTemplates);
router.get('/audits', AuditController.getAudits);
router.get('/audit/logs', AuditController.getLogs);       // ← MUST be before /audit/:id/*
router.get('/audit/:id/events', AuditController.getEvents);
router.get('/audit/:id/verify', AuditController.verifyAudit);
router.post('/audit/start', AuditController.startAudit);
router.post('/audit/:id/events', AuditController.addEvent);

export default router;
