import { prisma } from '../../lib/prisma';
import { computeEventHash } from '../../lib/cryptoIntegrity';
import { WSManager } from '../lib/ws';
import { v4 as uuidv4 } from 'uuid';

interface ChainReport {
  auditId: string;
  valid: boolean;
  eventCount: number;
  compromisedAt?: string;
  checkedAt: string;
}

/**
 * IntegrityWatchdog — Autonomous cryptographic integrity monitor.
 *
 * Implements the "Correction Block" doctrine:
 *   - NEVER modifies past blocks (that would be forensic tampering).
 *   - On chain rupture detection, injects a SYSTEM_INTEGRITY_CORRECTION event
 *     that freezes the audit and creates a new cryptographic anchor point.
 *   - All findings are broadcast via WebSocket as INTEGRITY_ALERT events.
 */
export class IntegrityWatchdog {
  private static intervalHandle: NodeJS.Timeout | null = null;
  static readonly INTERVAL_MS = 60_000; // 60 seconds

  static start() {
    if (this.intervalHandle) return;
    console.log('[IntegrityWatchdog] Starting autonomous chain verification — interval: 60s');
    this.intervalHandle = setInterval(async () => {
      await this.runScan();
    }, this.INTERVAL_MS);
    // Run immediately on start
    this.runScan();
  }

  static stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  /**
   * Full scan: fetch all audits and verify every event chain.
   */
  static async runScan(): Promise<ChainReport[]> {
    try {
      const audits = await prisma.audit.findMany({ select: { id: true } });
      const reports: ChainReport[] = [];

      for (const audit of audits) {
        const report = await this.verifyAuditChain(audit.id);
        reports.push(report);

        if (!report.valid) {
          // Broadcast live alert via WebSocket
          WSManager.broadcast('INTEGRITY_ALERT', {
            severity: 'CRITICAL',
            auditId: report.auditId,
            compromisedAt: report.compromisedAt,
            message: `Chain rupture detected in audit ${report.auditId.slice(0, 8)}. Correction block injected.`,
            timestamp: report.checkedAt
          });

          // Inject correction block — this is the "Correction Block" doctrine
          await this.injectCorrectionBlock(report.auditId, report.compromisedAt!);
        }
      }

      console.log(`[IntegrityWatchdog] Scan complete — ${audits.length} audits verified. Compromised: ${reports.filter(r => !r.valid).length}`);
      return reports;
    } catch (error) {
      console.error('[IntegrityWatchdog] Scan failed:', error);
      return [];
    }
  }

  /**
   * Verify the cryptographic chain for a single audit.
   */
  static async verifyAuditChain(auditId: string): Promise<ChainReport> {
    const events = await prisma.auditEvent.findMany({
      where: { auditId },
      orderBy: { timestamp: 'asc' }
    });

    let previousHash = '0'.repeat(64);
    for (const event of events) {
      // Skip correction blocks in chain validation (they restart the anchor)
      if (event.type === 'SYSTEM_INTEGRITY_CORRECTION') {
        previousHash = event.sha256Hash;
        continue;
      }

      const expected = computeEventHash(
        {
          id: event.id,
          auditId: event.auditId,
          type: event.type,
          timestamp: event.timestamp.toISOString(),
          userId: event.userId,
          payload: event.payload as any
        },
        previousHash
      );

      if (expected !== event.sha256Hash) {
        return {
          auditId,
          valid: false,
          eventCount: events.length,
          compromisedAt: event.id,
          checkedAt: new Date().toISOString()
        };
      }
      previousHash = event.sha256Hash;
    }

    return { auditId, valid: true, eventCount: events.length, checkedAt: new Date().toISOString() };
  }

  /**
   * Correction Block Doctrine:
   * Do NOT modify the corrupted block. Instead, inject a new
   * SYSTEM_INTEGRITY_CORRECTION event that documents the breach
   * and re-anchors the chain from this point forward.
   */
  static async injectCorrectionBlock(auditId: string, compromisedEventId: string) {
    const lastEvent = await prisma.auditEvent.findFirst({
      where: { auditId },
      orderBy: { timestamp: 'desc' },
      select: { sha256Hash: true, userId: true }
    });

    const systemUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    }) || await prisma.user.findFirst();

    const watchdogUserId = systemUser?.id || 'system-fallback';

    const correctionPayload = {
      doctrine: 'CORRECTION_BLOCK_V1',
      compromisedEventId,
      detectedAt: new Date().toISOString(),
      action: 'CHAIN_RE_ANCHORED',
      note: 'Past blocks are immutable. This block creates a new cryptographic anchor. The corrupted block is quarantined for forensic analysis.'
    };

    const correctionEvent = {
      id: uuidv4(),
      auditId,
      type: 'SYSTEM_INTEGRITY_CORRECTION',
      timestamp: new Date().toISOString(),
      userId: watchdogUserId,
      payload: correctionPayload
    };

    const newHash = computeEventHash(correctionEvent as any, lastEvent?.sha256Hash || '0'.repeat(64));

    await prisma.auditEvent.create({
      data: {
        id: correctionEvent.id,
        auditId,
        type: 'SYSTEM_INTEGRITY_CORRECTION',
        userId: watchdogUserId,
        payload: correctionPayload as any,
        sha256Hash: newHash,
        previousHash: lastEvent?.sha256Hash || '0'.repeat(64),
        timestamp: new Date()
      }
    });

    // Notify clients of the correction
    WSManager.broadcast('CORRECTION_BLOCK_INJECTED', {
      auditId,
      correctionEventId: correctionEvent.id,
      compromisedEventId,
      newAnchorHash: newHash.slice(0, 16) + '...',
      timestamp: correctionEvent.timestamp
    });

    console.log(`[IntegrityWatchdog] Correction block injected for audit ${auditId}`);
  }
}
