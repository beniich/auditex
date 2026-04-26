import { Router } from 'express';
import { InfrastructureController } from '../controllers/InfrastructureController';
import { LegalEntityController } from '../controllers/LegalEntityController';
import { OrganizationController } from '../controllers/OrganizationController';
import { AssetController } from '../controllers/AssetController';
import { validate, NodeSchema, NodeStatusSchema } from '../utils/validation';


const router = Router();

// Infrastructure & Topology Routes
router.get('/infrastructure/nodes', InfrastructureController.list);
router.get('/infrastructure/stats', InfrastructureController.getStats);
router.post('/infrastructure/discover', InfrastructureController.discover);
router.post('/infrastructure/nodes', validate(NodeSchema), InfrastructureController.register);

router.patch('/infrastructure/nodes/:id', validate(NodeStatusSchema), InfrastructureController.updateStatus);
router.get('/infrastructure/nodes/:id/health', InfrastructureController.getHealth);

// Organization & Entity Routes
router.get('/organizations', OrganizationController.list);
router.get('/organizations/:id', OrganizationController.get);
router.get('/organizations/:id/subsidiaries', OrganizationController.getSubsidiaries);
router.get('/entities', LegalEntityController.list);


// Asset Routes
router.get('/assets', AssetController.list);
router.post('/assets/:id/tag', AssetController.tag);


export default router;
