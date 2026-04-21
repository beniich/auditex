import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { IntegrityWatchdog } from '../services/IntegrityWatchdog';
import { WSManager } from '../lib/ws';

/**
 * ChaosController — Red Team / Chaos Engineering endpoints.
 *
 * WARNING: These endpoints simulate database-level attacks.
 * They MUST be disabled (or guarded by a CHAOS_ENABLED env flag) in production.
 */
export class ChaosController {

  /**
   * GET /api/chaos/status
   * Returns the current Watchdog scan status and live chain health.
   */
  static async getStatus(req: Request, res: Response) {
    try {
      const audits = await prisma.audit.findMany({ select: { id: true } });
      const reports = await Promise.all(audits.map(a => IntegrityWatchdog.verifyAuditChain(a.id)));

      const summary = {
        totalAudits: reports.length,
        healthy: reports.filter(r => r.valid).length,
        compromised: reports.filter(r => !r.valid).length,
        correctionBlocks: await prisma.auditEvent.count({ where: { type: 'SYSTEM_INTEGRITY_CORRECTION' } }),
        lastScanAt: new Date().toISOString(),
        reports
      };

      res.json(summary);
    } catch (error) {
      console.error('[ChaosController] getStatus error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * POST /api/chaos/corrupt
   * Body: { auditId?: string }
   *
   * Simulates a SQL injection / rogue admin attack by corrupting
   * the sha256Hash of a random event in the target audit.
   * This is how you test if the Watchdog catches it.
   */
  static async injectCorruption(req: Request, res: Response) {
    if (process.env.NODE_ENV === 'production' && !process.env.CHAOS_ENABLED) {
      return res.status(403).json({ error: 'Chaos Engineering is disabled in production.' });
    }

    try {
      // Pick a target audit
      let auditId = req.body.auditId;
      if (!auditId) {
        const latest = await prisma.audit.findFirst({ orderBy: { startedAt: 'desc' } });
        if (!latest) return res.status(404).json({ error: 'No audits found. Create an audit first.' });
        auditId = latest.id;
      }

      // Find a non-correction event to corrupt
      const victim = await prisma.auditEvent.findFirst({
        where: { auditId, NOT: { type: 'SYSTEM_INTEGRITY_CORRECTION' } },
        orderBy: { timestamp: 'asc' },
        skip: 1 // Skip the genesis block so there's room for chain mismatch
      });

      if (!victim) {
        return res.status(400).json({ error: 'Not enough events in this audit to simulate corruption. Add more events first.' });
      }

      // Corrupt the hash — simulates a direct DB write attack
      const corruptedHash = 'CORRUPTED_' + victim.sha256Hash.slice(11);
      await prisma.auditEvent.update({
        where: { id: victim.id },
        data: { sha256Hash: corruptedHash }
      });

      // Broadcast a Red Team alert
      WSManager.broadcast('CHAOS_ATTACK_INITIATED', {
        severity: 'CRITICAL',
        attackType: 'HASH_CORRUPTION',
        auditId,
        targetEventId: victim.id,
        message: '[RED TEAM] SHA-256 hash of event corrupted. Watchdog should detect within 60s.',
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        attack: 'HASH_CORRUPTION',
        auditId,
        targetEventId: victim.id,
        corruptedHash: corruptedHash.slice(0, 20) + '...',
        note: 'Integrity Watchdog will detect this within 60 seconds and inject a Correction Block.'
      });
    } catch (error) {
      console.error('[ChaosController] inject error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * POST /api/chaos/scan
   * Triggers an immediate Watchdog scan (instead of waiting 60s).
   */
  static async triggerScan(req: Request, res: Response) {
    try {
      const reports = await IntegrityWatchdog.runScan();
      res.json({
        success: true,
        scannedAt: new Date().toISOString(),
        reports
      });
    } catch (error) {
      console.error('[ChaosController] scan error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * POST /api/chaos/reset
   * Removes all SYSTEM_INTEGRITY_CORRECTION blocks for a clean test reset.
   * NEVER expose this in production.
   */
  static async resetCorrectionBlocks(req: Request, res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Reset is disabled in production.' });
    }
    try {
      const { count } = await prisma.auditEvent.deleteMany({
        where: { type: 'SYSTEM_INTEGRITY_CORRECTION' }
      });
      res.json({ success: true, deletedCorrectionBlocks: count });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
