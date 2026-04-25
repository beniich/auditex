import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface QuotaData {
  balance: number;
  limit: number;
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
    limit: quota?.limit ?? 50.00, // Default to 50 if not provided by API
    logs: quota?.logs ?? [],
    isLow: (quota?.balance ?? 0) < 5.0, // Low if less than $5
    isLoading,
    isError,
    refreshQuota: refetch
  };
}
