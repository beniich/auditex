import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const ORG_ID = 'global-org-placeholder';

// Realistic demo invoice data seeded on first call
const DEMO_INVOICES = [
  { id: 'inv_001', date: '2026-04-01', amount: '€ 990.00', status: 'PAID', plan: 'Enterprise', label: 'AuditAX Enterprise — April 2026' },
  { id: 'inv_002', date: '2026-03-01', amount: '€ 990.00', status: 'PAID', plan: 'Enterprise', label: 'AuditAX Enterprise — March 2026' },
  { id: 'inv_003', date: '2026-02-01', amount: '€ 490.00', status: 'PAID', plan: 'Pro',        label: 'AuditAX Pro — February 2026' },
];

export class BillingController {
  static async getInvoices(req: Request, res: Response) {
    try {
      // If Stripe is configured, call the real Stripe API here.
      // For now: return deterministic demo invoices.
      res.json(DEMO_INVOICES);
    } catch (err) {
      console.error('[BillingController.getInvoices]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createCheckout(req: Request, res: Response) {
    try {
      const { lookupKey } = req.body;
      const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

      if (STRIPE_KEY) {
        // Real Stripe integration placeholder
        // const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-06-20' });
        // const session = await stripe.checkout.sessions.create({ ... });
        // return res.json({ url: session.url });
      }

      // Dev fallback: return a mock checkout URL
      res.json({ url: `http://localhost:3000/?plan=${lookupKey}&checkout=demo` });
    } catch (err) {
      console.error('[BillingController.createCheckout]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getPortalUrl(req: Request, res: Response) {
    try {
      const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
      if (STRIPE_KEY) {
        // Real portal: return stripe.billingPortal.sessions.create(...)
      }
      res.json({ url: 'http://localhost:3000/?portal=demo' });
    } catch (err) {
      console.error('[BillingController.getPortalUrl]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getUsageStats(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;

      // Aggregate AI usage from DB
      const logs = await prisma.aIUsageLog.groupBy({
        by: ['action'],
        _sum: { cost: true },
        _count: { id: true },
      });

      const total = await prisma.aIUsageLog.aggregate({ _sum: { cost: true } });

      res.json({
        byAction: logs.map(l => ({
          action: l.action,
          count: l._count.id,
          totalCost: l._sum.cost ?? 0,
        })),
        totalSpent: total._sum.cost ?? 0,
        period: 'current_month',
      });
    } catch (err) {
      console.error('[BillingController.getUsageStats]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getSubscription(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      const org = await prisma.organization.findUnique({ where: { id: orgId } });
      res.json({
        plan: org?.annualTurnover && org.annualTurnover > 1000000 ? 'ENTERPRISE' : 'PRO',
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        nextInvoice: '2026-05-01',
        features: ['AI_UNLIMITED', 'SSO_ENABLED', 'AUDIT_FORENSICS']
      });
    } catch (err) {
      console.error('[BillingController.getSubscription]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateSubscription(req: Request, res: Response) {
    try {
      const orgId = (req as any).user?.organizationId || ORG_ID;
      const { plan } = req.body;
      // In reality, update Stripe subscription then update DB
      res.json({ success: true, plan });
    } catch (err) {
      console.error('[BillingController.updateSubscription]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
