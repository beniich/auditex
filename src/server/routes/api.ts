import { Router } from 'express';
import { AuditController } from '../controllers/AuditController';
import { IncidentController } from '../controllers/IncidentController';
import { InfrastructureController } from '../controllers/InfrastructureController';
import { ComplianceController } from '../controllers/ComplianceController';
import { StorageController } from '../controllers/StorageController';
import { AIController } from '../controllers/AIController';
import { ReportController } from '../controllers/ReportController';
import { AIAnalyticsController } from '../controllers/AIAnalyticsController';
import multer from 'multer';

// Configure Multer for local storage (mimicking S3)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { validate, IncidentSchema, TaskSchema, NodeSchema, NodeStatusSchema, PolicySchema } from '../utils/validation';

export const apiRouter = Router();

// Middleware: Clerk Auth validation
const requireAuth = process.env.VITE_CLERK_PUBLISHABLE_KEY 
  ? ClerkExpressRequireAuth() 
  : async (req: any, res: any, next: any) => {
      // Dev mode: find the first user in DB to act as the current user
      const { prisma } = await import('../../lib/prisma');
      const user = await prisma.user.findFirst({
        include: { organization: true }
      });
      
      if (user) {
        req.auth = { userId: user.clerkId };
        req.user = user;
      } else {
        req.auth = { userId: 'inspector-123' };
        req.user = { organizationId: 'org-1' }; // Fallback
      }
      next();
    };

apiRouter.use(requireAuth);

// Health check
apiRouter.get('/health', (req, res) => res.json({ status: 'ok', environment: 'production-ready' }));

// Audit Routes
apiRouter.get('/templates', AuditController.getTemplates);
apiRouter.get('/audits', AuditController.getAudits);
apiRouter.post('/audit/:id/events', AuditController.addEvent);
apiRouter.get('/audit/:id/events', AuditController.getEvents);
apiRouter.get('/audit/logs', AuditController.getLogs);
apiRouter.get('/audit/:id/verify', AuditController.verifyAudit);

// Incident & CAPA Routes
apiRouter.get('/incidents', IncidentController.list);
apiRouter.post('/incidents', validate(IncidentSchema), IncidentController.create);
apiRouter.post('/incidents/:id/tasks', validate(TaskSchema), IncidentController.addTask);
apiRouter.patch('/incidents/tasks/:taskId', IncidentController.updateTask);
apiRouter.post('/incidents/:id/resolve', IncidentController.resolve);

// Infrastructure & Topology Routes
apiRouter.get('/infrastructure/nodes', InfrastructureController.list);
apiRouter.get('/infrastructure/stats', InfrastructureController.getStats);
apiRouter.post('/infrastructure/nodes', validate(NodeSchema), InfrastructureController.register);
apiRouter.patch('/infrastructure/nodes/:id', validate(NodeStatusSchema), InfrastructureController.updateStatus);

// Compliance & Policy Routes
apiRouter.get('/compliance/policies', ComplianceController.listPolicies);
apiRouter.post('/compliance/policies', validate(PolicySchema), ComplianceController.createPolicy);
apiRouter.post('/compliance/policies/:id/controls', ComplianceController.addControl);
apiRouter.patch('/compliance/controls/:controlId', ComplianceController.updateControlStatus);

// AI Gateway Routes
apiRouter.post('/ai/validate', AIController.validate);
apiRouter.post('/ai/analyze-evidence', AIController.analyzeEvidence);
apiRouter.get('/ai/forensics/:entityId', AIController.forensic);
apiRouter.post('/ai/remediate', AIController.remediate);
apiRouter.get('/ai/analytics', AIAnalyticsController.getDashboardStats);
apiRouter.post('/ai/track', AIAnalyticsController.trackAction);
apiRouter.post('/ai/advanced-audit', AIController.advancedAudit);
apiRouter.get('/ai/quota', AIController.getQuotaBalance);

// Report Routes
apiRouter.get('/reports/download/:auditId', ReportController.downloadReport);

// Storage Routes
apiRouter.post('/storage/upload', upload.single('file'), StorageController.upload);
apiRouter.get('/storage/url/:key', StorageController.getUrl);
