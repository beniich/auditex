import { prisma } from '../../lib/prisma';

export class OrganizationService {
  static async listOrganizations() {
    return await prisma.organization.findMany({
      include: {
        _count: {
          select: { users: true, audits: true, entities: true }
        }
      }
    });
  }

  static async getOrganizationById(id: string) {
    return await prisma.organization.findUnique({
      where: { id },
      include: {
        entities: {
          where: { parentId: null }, // Start with roots
          include: {
            children: {
              include: {
                children: true // Support recursive structure if needed, or just flatten
              }
            }
          }
        }
      }
    });
  }

  static async getSubsidiaries(organizationId: string) {
    return await prisma.legalEntity.findMany({
      where: { organizationId },
      include: { parent: true }
    });
  }
}
