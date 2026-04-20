import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface QuotaData {
  balance: number;
  logs: {
    id: string;
    action: 'SIMPLE' | 'DSL' | 'AGENTIC';
    cost: number;
    auditId?: string;
    timestamp: string;
    loopCount: number;
  }[];
}

export function useQuota() {
  const { data: quota, isLoading, isError, refetch } = useQuery<QuotaData>({
    queryKey: ['ai-quota'],
    queryFn: () => api.get<QuotaData>('/ai/quota'),
    refetchInterval: 60000, // Refresh every minute
  });

  return {
    balance: quota?.balance ?? 0,
    logs: quota?.logs ?? [],
    isLow: (quota?.balance ?? 0) < 0.5,
    isLoading,
    isError,
    refreshQuota: refetch
  };
}
