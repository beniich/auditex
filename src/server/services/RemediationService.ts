import { prisma } from '../../lib/prisma';

export class RemediationService {
  static async listRemediations(organizationId: string) {
    return await prisma.cAPATask.findMany({
      where: {
        incident: { organizationId }
      },
      include: {
        incident: true,
        assignee: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createRemediation(data: {
    incidentId: string;
    title: string;
    description: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    return await prisma.cAPATask.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    });
  }

  static async updateRemediation(id: string, data: any) {
    return await prisma.cAPATask.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate
      }
    });
  }
}
