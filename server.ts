import "dotenv/config";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { apiRouter } from './src/server/routes/api';
import { prisma } from './src/lib/prisma';
import { WSManager } from './src/server/lib/ws';
import { IntegrityWatchdog } from './src/server/services/IntegrityWatchdog';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Global Middlewares
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://*.clerk.accounts.dev", "https://clerk.auditax.dev"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.clerk.com"],
        connectSrc: ["'self'", "https://*.clerk.accounts.dev", "wss://*"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }));
  app.use(cors());
  app.use(express.json());

  // Mount Structured API Router
  app.use('/api', apiRouter);

  // Initial Seed Logic (Enterprise Context)
  const orgId = 'global-org-placeholder';
  
  // 1. Ensure Organization
  let org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: orgId,
        name: 'AuditMaster Enterprise Demo',
        domain: 'demo.auditmaster.io'
      }
    });
  }

  // 2. Ensure Audit Template
  const seedTemplateId = 'tpl-safety';
  const existingTemplate = await prisma.auditTemplate.findUnique({ where: { id: seedTemplateId } });
  if (!existingTemplate) {
    await prisma.auditTemplate.create({
      data: {
        id: seedTemplateId,
        title: 'Audit de Sécurité Industrielle',
        description: 'Contrôle trimestriel de conformité HSE et protection incendie.',
        version: 1,
        content: [
          {
            id: 'sec-1',
            title: 'Équipements de Protection Individuelle (EPI)',
            questions: [
              { id: 'q1', text: 'Le port du casque est-il respecté en zone A ?', type: 'YES_NO', weight: 10, required: true },
              { 
                id: 'q-followup', 
                text: 'Indiquez la raison du non-port des EPI (Rupture stock, Oubli, Inconfort...) ?', 
                type: 'TEXT', 
                weight: 5, 
                required: true,
                logic: { showIf: { questionId: 'q1', operator: 'equals', value: false } }
              },
              { id: 'q2', text: 'État des stocks de gants anti-coupures', type: 'SCORE', weight: 5, required: true },
              { id: 'q3', text: 'Capturez une photo de la signalétique EPI à l\'entrée', type: 'IMAGE', weight: 2, required: false }
            ]
          }
        ]
      }
    });
  }

  // 3. Seed Infrastructure Nodes
  const nodeCount = await prisma.networkNode.count({ where: { organizationId: orgId } });
  if (nodeCount === 0) {
    await prisma.networkNode.createMany({
      data: [
        { name: 'HUB-ALPHA-01', region: 'Frankfurt', type: 'API_GATEWAY', status: 'HEALTHY', organizationId: orgId },
        { name: 'NODE-FRA-04', region: 'Frankfurt', type: 'DATABASE', status: 'DEGRADED', organizationId: orgId },
        { name: 'NODE-LON-01', region: 'London', type: 'VIRTUAL_MACHINE', status: 'HEALTHY', organizationId: orgId }
      ]
    });
  }

  // 4. Seed Policies
  const policyCount = await prisma.policy.count({ where: { organizationId: orgId } });
  if (policyCount === 0) {
    const policy = await prisma.policy.create({
      data: {
        organizationId: orgId,
        title: 'ISO-27001 Information Security',
        framework: 'ISO-27001',
        content: 'Standard for information security management systems.'
      }
    });
    
    await prisma.control.createMany({
      data: [
        { policyId: policy.id, name: 'Access Control', description: 'Ensure only authorized users have access.', frequency: 'CONTINUOUS', status: 'COMPLIANT' },
        { policyId: policy.id, name: 'Backup Policy', description: 'Daily backups of critical data.', frequency: 'DAILY', status: 'NON_COMPLIANT' }
      ]
    });
  }

  // 5. Seed API Keys
  const keyCount = await prisma.apiKey.count({ where: { organizationId: orgId } });
  if (keyCount === 0) {
    await prisma.apiKey.create({
      data: {
        organizationId: orgId,
        name: 'Enterprise SIEM Connector',
        secret: 'am_live_7v8n2m9k0j1h2g3f4d5s6a7s8d9f0g1h',
        scope: 'WRITE_LOGS',
        status: 'ACTIVE'
      }
    });
  }

  // 6. Seed SSO Config
  const ssoCount = await prisma.ssoConfig.count({ where: { orgId } });
  if (ssoCount === 0) {
    await prisma.ssoConfig.create({
      data: {
        orgId,
        name: 'Okta Enterprise IdP',
        protocol: 'SAML_2_0',
        status: 'ACTIVE'
      }
    });

    await prisma.attributeMapping.createMany({
      data: [
        { orgId, source: 'email', target: 'email', status: 'ACTIVE' },
        { orgId, source: 'groups', target: 'role', status: 'ACTIVE' }
      ]
    });
  }

  // Vite middleware setup for Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Enterprise AuditMaster Backend running on http://localhost:${PORT}`);
  });

  // Initialize WebSockets
  WSManager.initialize(server);

  // Boot Integrity Watchdog — autonomous SHA-256 chain monitor
  IntegrityWatchdog.start();
  console.log('[IntegrityWatchdog] Autonomous ledger monitor active.');

  // Background Simulator: Keeping the "Command Center" alive with real-time anomalies
  if (process.env.NODE_ENV !== 'production') {
    setInterval(async () => {
      try {
        const nodes = await prisma.networkNode.findMany();
        if (nodes.length === 0) return;

        // Pick a random node to "fluctuate"
        const target = nodes[Math.floor(Math.random() * nodes.length)];
        const statuses = ['HEALTHY', 'DEGRADED', 'DOWN'] as const;
        // 80% chance of staying healthy, 20% fluctuation
        const newStatus = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * 3)] : 'HEALTHY';
        
        if (target.status !== newStatus) {
           const updated = await prisma.networkNode.update({
             where: { id: target.id },
             data: { status: newStatus, lastSync: new Date() }
           });
           WSManager.broadcast('NODE_UPDATED', updated);
        }
      } catch (err) {
        // Silent error for background task
      }
    }, 15000); // Pulse every 15s
  }

  // Centralized Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
    });
  });
}

startServer().catch(console.error);
