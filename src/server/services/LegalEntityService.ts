import { prisma } from '../../lib/prisma';

export class LegalEntityService {
  static async getEntities(organizationId: string) {
    return await prisma.legalEntity.findMany({
      where: { organizationId },
      include: { children: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async createEntity(data: {
    name: string;
    organizationId: string;
    jurisdiction: string;
    parentId?: string;
    ownerPercent?: number;
    status?: string;
    taxId?: string;
  }) {
    return await prisma.legalEntity.create({
      data
    });
  }
}
