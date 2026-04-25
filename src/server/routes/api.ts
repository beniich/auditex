import { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Modular Route Imports
import auditRoutes from './audit';
import governanceRoutes from './governance';
import infrastructureRoutes from './infrastructure';
import operationsRoutes from './operations';
import adminRoutes from './admin';
import aiRoutes from './ai';
import storageRoutes from './storage';
import ragRoutes from './rag';

export const apiRouter = Router();

// Middleware: Clerk Auth validation
const requireAuth = process.env.VITE_CLERK_PUBLISHABLE_KEY 
  ? ClerkExpressRequireAuth() 
  : async (req: any, res: any, next: any) => {
      // Dev mode: find the first user in DB to act as the current user
      const { prisma } = await import('../../lib/prisma');
      const user = await prisma.user.findFirst({
        include: { organization: true }
      });
      
      if (user) {
        req.auth = { userId: user.clerkId };
        req.user = user;
      } else {
        req.auth = { userId: 'inspector-123' };
        req.user = { organizationId: 'org-1' }; // Fallback
      }
      next();
    };

apiRouter.use(requireAuth);

// Health check
apiRouter.get('/health', (req, res) => res.json({ status: 'ok', environment: 'production-ready' }));

// Mount Modular Routes
apiRouter.use(auditRoutes);
apiRouter.use(governanceRoutes);
apiRouter.use(infrastructureRoutes);
apiRouter.use(operationsRoutes);
apiRouter.use(adminRoutes);
apiRouter.use(aiRoutes);
apiRouter.use(storageRoutes);
apiRouter.use(ragRoutes);

