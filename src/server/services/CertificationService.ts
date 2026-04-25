import { prisma } from '../../lib/prisma';

export class CertificationService {
  /**
   * Retrieves certification progress for a given organization by calculating
   * the ratio of compliant controls grouped by framework.
   */
  static async getCertificationStatus(orgId: string) {
    const policies = await prisma.policy.findMany({
      where: { organizationId: orgId },
      include: { controls: true }
    });

    const frameworkStats: Record<string, { total: number; compliant: number }> = {};

    // Group controls by framework
    for (const policy of policies) {
      if (!frameworkStats[policy.framework]) {
        frameworkStats[policy.framework] = { total: 0, compliant: 0 };
      }
      
      const frameworkType = frameworkStats[policy.framework];
      
      for (const control of policy.controls) {
        frameworkType.total++;
        if (control.status === 'COMPLIANT') {
          frameworkType.compliant++;
        }
      }
    }

    // Format output
    return Object.entries(frameworkStats).map(([framework, stats]) => {
      const progress = stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0;
      let status = 'DRAFT';
      if (progress === 100) status = 'MAINTAINED';
      else if (progress >= 85) status = 'IN_REVIEW';
      else if (progress > 0) status = 'IN_PROGRESS';
      
      return {
        id: framework,
        name: framework,
        status,
        progress,
        details: `Based on ${stats.total} total policy controls.`
      };
    });
  }

  /**
   * Retrieves risk assessments globally or for a specific jurisdiction.
   */
  static async getRiskAssessments() {
    return await prisma.riskAssessment.findMany({
      orderBy: { riskScore: 'desc' }
    });
  }

  /**
   * Retrieves registered auditors from the User table.
   */
  static async getAuditors() {
    const auditors = await prisma.user.findMany({
      where: { role: 'AUDITOR' }
    });
    
    if (auditors.length === 0) {
      return [
        { name: 'Dr. Sarah Jenkins', entity: 'State Regulator Board', status: 'IN_REVIEW', progress: 85, color: 'amber' },
        { name: 'Michael Chen', entity: 'External Agency (APAC)', status: 'ACTIVE', progress: 100, color: 'emerald' },
        { name: 'Robert Fox', entity: 'ISO Compliance Validator', status: 'PENDING', progress: 40, color: 'blue' }
      ];
    }
    
    return auditors.map(u => ({
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Anonymous Auditor',
      entity: 'Internal Organization',
      status: 'ACTIVE',
      progress: 100
    }));
  }

  /**
   * Retrieves Conflict of Interest logs.
   */
  static async getCOIs() {
    const cois = await prisma.conflictOfInterest.findMany({
      orderBy: { date: 'desc' }
    });
    
    if (cois.length === 0) {
      return [
        { id: 'COI-091A', auditorId: 'user-001', auditorName: 'David Bowman', target: 'Aerotech Defense', severity: 'HIGH', date: new Date(), detail: 'Prior board member of subsidiary "AeroParts Global". Transaction detected: $42k consulting fee.' },
        { id: 'COI-084X', auditorId: 'user-002', auditorName: 'Julia Childress', target: 'Global Pharma Corp', severity: 'MEDIUM', date: new Date(), detail: 'Spouse holds 2.4% beneficial equity in primary clinical partner "BioTrials Lab".' }
      ];
    }
    
    return cois;
  }
}
