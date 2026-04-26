import { Router } from 'express';
import { VaultController } from '../controllers/VaultController';
import { FinancialController } from '../controllers/FinancialController';
import { NotificationController } from '../controllers/NotificationController';
import { AccessController } from '../controllers/AccessController';
import { ApiKeyController } from '../controllers/ApiKeyController';
import { IdentityController } from '../controllers/IdentityController';
import { BillingController } from '../controllers/BillingController';

const router = Router();

// ── Vault Routes ─────────────────────────────────────────────────────────────
router.get('/vault/keys', VaultController.listKeys);
router.post('/vault/keys', VaultController.createKey);
router.post('/vault/keys/:id/rotate', VaultController.rotateKey);
router.get('/vault/keys/:id/access', VaultController.accessKey);

// ── Access Control & RBAC ────────────────────────────────────────────────────
router.get('/access/roles', AccessController.listRoles);
router.get('/access/members', AccessController.listMembers);
router.patch('/access/members/:userId/role', AccessController.updateRole);

// ── Notifications ────────────────────────────────────────────────────────────
router.get('/notifications', NotificationController.list);
router.post('/notifications/:id/read', NotificationController.markRead);
router.post('/notifications/read-all', NotificationController.markAllRead);

// ── Financial Impact / CFO ───────────────────────────────────────────────────
router.get('/financial/summary', FinancialController.getSummary);
router.get('/financial/heatmap', FinancialController.getJurisdictionalHeatmap);
router.patch('/financial/controls/:controlId', FinancialController.update); // fixed: was PUT
router.put('/financial/controls/:controlId', FinancialController.update);   // backward compat
router.post('/financial/turnover', FinancialController.updateTurnover);

// ── API Key Management ────────────────────────────────────────────────────────
router.get('/api-keys', ApiKeyController.list);
router.post('/api-keys', ApiKeyController.create);
router.delete('/api-keys/:id', ApiKeyController.revoke);
router.post('/api-keys/:id/rotate', ApiKeyController.rotate);

// ── Identity Provider (SSO) & Profile ────────────────────────────────────────
router.get('/identity/config', IdentityController.getConfig);
router.patch('/identity/config', IdentityController.updateConfig);
router.get('/identity/mappings', IdentityController.getMappings);
router.post('/identity/test', IdentityController.testConnection);
router.get('/auth/profile', IdentityController.getProfile);
router.patch('/auth/profile', IdentityController.updateProfile);

// ── Billing & Subscription ────────────────────────────────────────────────────
router.get('/billing/invoices', BillingController.getInvoices);
router.get('/billing/subscription', BillingController.getSubscription);
router.patch('/billing/subscription', BillingController.updateSubscription);
router.post('/billing/checkout', BillingController.createCheckout);
router.get('/billing/portal', BillingController.getPortalUrl);
router.get('/billing/usage', BillingController.getUsageStats);

export default router;
