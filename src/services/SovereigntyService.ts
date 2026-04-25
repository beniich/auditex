import { api } from '../lib/api';

export interface RegionalHealth {
  region: string;
  code: string;
  status: 'LOCAL' | 'RESTRICTED' | 'WARNING';
  complianceScore: number;
  primaryNode: string;
  backupNode: string;
  storedData: string;
  latency: number;
}

export interface SovereigntyLog {
  id: string;
  type: 'MIGRATION' | 'REPLICATION' | 'POLICY' | 'AUDIT';
  description: string;
  timestamp: string;
  metadata: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export const SovereigntyService = {
  async getRegionalHealth(): Promise<RegionalHealth[]> {
    return api.get<RegionalHealth[]>('/sovereignty/regions');
  },

  async getLogs(): Promise<SovereigntyLog[]> {
    return api.get<SovereigntyLog[]>('/sovereignty/logs');
  },

  async getGlobalStats(): Promise<{ healthyPercentage: number; totalStored: string; activeNodeCount: number }> {
    return api.get<{ healthyPercentage: number; totalStored: string; activeNodeCount: number }>('/sovereignty/stats');
  }
};
