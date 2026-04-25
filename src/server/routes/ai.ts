import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { AIAnalyticsController } from '../controllers/AIAnalyticsController';

const router = Router();

// AI Gateway Routes
router.post('/ai/validate', AIController.validate);
router.post('/ai/analyze-evidence', AIController.analyzeEvidence);
router.get('/ai/forensics/:entityId', AIController.forensic);
router.post('/ai/remediate', AIController.remediate);
router.get('/ai/analytics', AIAnalyticsController.getDashboardStats);
router.post('/ai/track', AIAnalyticsController.trackAction);
router.post('/ai/advanced-audit', AIController.advancedAudit);
router.get('/ai/quota', AIController.getQuotaBalance);
router.post('/ai/export-email', AIController.sendReportEmail);
router.post('/ai/sign-report', AIController.signReport);

export default router;
