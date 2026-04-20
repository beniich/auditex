import { prisma } from '../../lib/prisma';

export enum AIActionType {
  SIMPLE_VALIDATION = 'SIMPLE',
  LOGIC_GENERATION  = 'DSL',
  AGENTIC_LOOP      = 'AGENTIC',
}

const PRICES: Record<AIActionType, number> = {
  [AIActionType.SIMPLE_VALIDATION]: 0.01,
  [AIActionType.LOGIC_GENERATION]:  0.05,
  [AIActionType.AGENTIC_LOOP]:      0.15,
};

export class QuotaService {
  async chargeAction(userId: string, action: AIActionType, iterations = 1, auditId?: string) {
    const cost = PRICES[action] * iterations;

    // Verify or create fallback account (for first login/sync issues if they don't have one)
    let account = await prisma.userAccount.findUnique({ where: { userId } });
    
    if (!account) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      const internalUserId = user ? user.id : userId;

      // Ensure the user actually exists before account creation if using foreign key
      const dbUser = await prisma.user.findUnique({ where: { id: internalUserId } });
      if (!dbUser) {
        throw new Error('USER_NOT_FOUND');
      }

      account = await prisma.userAccount.create({ 
        data: { userId: dbUser.id, balance: 10.0 } 
      });
    }

    if (account.balance < cost) {
      throw new Error('INSUFFICIENT_QUOTA');
    }

    await prisma.$transaction([
      prisma.userAccount.update({
        where: { id: account.id },
        data: { balance: { decrement: cost }, totalSpent: { increment: cost } },
      }),
      prisma.aIUsageLog.create({
        data: {
          userAccountId: account.id,
          action,
          cost,
          loopCount: iterations,
          auditId,
          promptVersion: 'v1.0.0',
        },
      }),
    ]);

    return cost;
  }

  async getBalance(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    const uId = user ? user.id : userId;
    const acc = await prisma.userAccount.findUnique({ where: { userId: uId } });
    return acc?.balance ?? 0;
  }

  async getUsageLogs(userId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    const uId = user ? user.id : userId;
    const acc = await prisma.userAccount.findUnique({ where: { userId: uId } });
    if (!acc) return [];
    return prisma.aIUsageLog.findMany({
      where: { userAccountId: acc.id },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }
}

export const quotaService = new QuotaService();
