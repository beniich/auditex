import { prisma } from '../../lib/prisma';

export class AssetService {
  static async listAssets(organizationId: string) {
    return await prisma.networkNode.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAssetById(id: string) {
    return await prisma.networkNode.findUnique({
      where: { id }
    });
  }

  static async tagAsset(id: string, tags: any) {
    return await prisma.networkNode.update({
      where: { id },
      data: {
        tags: tags as any
      }
    });
  }

}
