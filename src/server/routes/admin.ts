import { Router } from 'express';
import { VaultController } from '../controllers/VaultController';
import { FinancialController } from '../controllers/FinancialController';
import { NotificationController } from '../controllers/NotificationController';
import { AccessController } from '../controllers/AccessController';

const router = Router();

// Vault Routes
router.get('/vault/keys', VaultController.listKeys);
router.post('/vault/keys', VaultController.createKey);
router.post('/vault/keys/:id/rotate', VaultController.rotateKey);
router.get('/vault/keys/:id/access', VaultController.accessKey);

// Access Control & RBAC
router.get('/access/roles', AccessController.listRoles);
router.get('/access/members', AccessController.listMembers);
router.patch('/access/members/:userId/role', AccessController.updateRole);


// Notification Routes
router.get('/notifications', NotificationController.list);
router.post('/notifications/:id/read', NotificationController.markRead);
router.post('/notifications/read-all', NotificationController.markAllRead);

// Financial Impact / CFO Routes
router.get('/financial/summary', FinancialController.getSummary);
router.get('/financial/heatmap', FinancialController.getJurisdictionalHeatmap);
router.put('/financial/controls/:controlId', FinancialController.update);
router.post('/financial/turnover', FinancialController.updateTurnover);

export default router;
