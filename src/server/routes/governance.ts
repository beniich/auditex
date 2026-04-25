import { Router } from 'express';
import { ComplianceController } from '../controllers/ComplianceController';
import { CertificationController } from '../controllers/CertificationController';
import { RiskController } from '../controllers/RiskController';
import { ReportController } from '../controllers/ReportController';
import { validate, PolicySchema } from '../utils/validation';

const router = Router();

// Compliance & Policy Routes
router.get('/compliance/policies', ComplianceController.listPolicies);
router.post('/compliance/policies', validate(PolicySchema), ComplianceController.createPolicy);
router.post('/compliance/policies/:id/controls', ComplianceController.addControl);
router.patch('/compliance/controls/:controlId', ComplianceController.updateControlStatus);

// Certifications & Risks Routes
router.get('/certifications/status', CertificationController.getCertificationsStatus);
router.get('/certifications/auditors', CertificationController.getAuditors);
router.get('/certifications/coi', CertificationController.getCOIs);
router.get('/risks', CertificationController.getRisks);

// Risk Register CRUD
router.get('/risks/register', RiskController.list);
router.post('/risks/register', RiskController.create);
router.patch('/risks/register/:id', RiskController.update);
router.delete('/risks/register/:id', RiskController.delete);


// Report Routes
router.get('/reports/download/:auditId', ReportController.downloadReport);

export default router;
