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
}
