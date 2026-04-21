import { prisma } from '../../lib/prisma';

export class NotificationService {
  static async getNotifications(organizationId: string) {
    return await prisma.notification.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  static async createNotification(organizationId: string, title: string, message: string, type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' = 'INFO') {
    return await prisma.notification.create({
      data: {
        organizationId,
        title,
        message,
        type
      }
    });
  }

  static async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
  }

  static async markAllAsRead(organizationId: string) {
    return await prisma.notification.updateMany({
      where: { organizationId, read: false },
      data: { read: true }
    });
  }
}
