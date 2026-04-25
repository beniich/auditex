import { api } from '../lib/api';

export interface ApiKey {
  id: string;
  name: string;
  secret: string;
  scope: 'READ_ONLY' | 'WRITE_LOGS' | 'FULL_ACCESS';
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  lastUsedAt?: string;
  visible?: boolean;
}

export const ApiService = {
  async getKeys(): Promise<ApiKey[]> {
    return api.get<ApiKey[]>('/api-keys');
  },

  async createKey(name: string, scope: string): Promise<ApiKey> {
    return api.post<ApiKey>('/api-keys', { name, scope });
  },

  async revokeKey(id: string): Promise<void> {
    return api.delete<void>(`/api-keys/${id}`);
  },

  async rotateKey(id: string): Promise<ApiKey> {
    return api.post<ApiKey>(`/api-keys/${id}/rotate`, {});
  }
};
