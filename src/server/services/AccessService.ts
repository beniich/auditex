import { prisma } from '../../lib/prisma';

export class AccessService {
  static async getRoles() {
    // In a production app, roles might be a separate table or managed in Clerk.
    // For now, we return the enum values or a list.
    return [
      { id: 'ADMIN', name: 'System Administrator', description: 'Full access to all modules and configurations.' },
      { id: 'AUDITOR', name: 'Lead Auditor', description: 'Can start, run and finalize audits.' },
      { id: 'COMPLIANCE_OFFICER', name: 'Compliance Officer', description: 'Policy management and risk assessment.' },
      { id: 'IT_MANAGER', name: 'IT Infrastructure Manager', description: 'Topology and asset management.' },
      { id: 'VIEWER', name: 'Read-only Stakeholder', description: 'Can view reports and dashboards.' }
    ];
  }

  static async getMemberships(organizationId: string) {
    return await prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        clerkId: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });
  }

  static async updateMemberRole(userId: string, role: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role: role as any }
    });
  }
}
