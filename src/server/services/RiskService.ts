import { prisma } from '../../lib/prisma';

export class RiskService {
  static async listRiskRegister() {
    return await prisma.riskAssessment.findMany({
      orderBy: { assessedAt: 'desc' }
    });
  }

  static async getRiskById(id: string) {
    return await prisma.riskAssessment.findUnique({
      where: { id }
    });
  }

  static async createRisk(data: {
    jurisdiction: string;
    riskScore: number;
    category: string;
    details: string;
  }) {
    return await prisma.riskAssessment.create({
      data
    });
  }

  static async updateRisk(id: string, data: any) {
    return await prisma.riskAssessment.update({
      where: { id },
      data
    });
  }

  static async deleteRisk(id: string) {
    return await prisma.riskAssessment.delete({
      where: { id }
    });
  }
}
