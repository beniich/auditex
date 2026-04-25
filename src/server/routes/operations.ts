import { IncidentController } from '../controllers/IncidentController';
import { ChaosController } from '../controllers/ChaosController';
import { RemediationController } from '../controllers/RemediationController';
import { validate, IncidentSchema, TaskSchema } from '../utils/validation';

const router = Router();

// Incident & CAPA Routes
router.get('/incidents', IncidentController.list);
router.post('/incidents', validate(IncidentSchema), IncidentController.create);
router.post('/incidents/:id/tasks', validate(TaskSchema), IncidentController.addTask);
router.patch('/incidents/tasks/:taskId', IncidentController.updateTask);
router.post('/incidents/:id/resolve', IncidentController.resolve);

// Remediation Routes
router.get('/remediations', RemediationController.list);
router.post('/remediations', RemediationController.create);
router.patch('/remediations/:id', RemediationController.update);


// Chaos Engineering / Red Team Routes
router.get('/chaos/status', ChaosController.getStatus);
router.post('/chaos/corrupt', ChaosController.injectCorruption);
router.post('/chaos/scan', ChaosController.triggerScan);
router.post('/chaos/reset', ChaosController.resetCorrectionBlocks);

export default router;
