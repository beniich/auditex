import { api } from '../lib/api';

export interface ApiKey {
  id: string;
  name: string;
  secret: string;
  scope: 'READ_ONLY' | 'WRITE_LOGS' | 'FULL_ACCESS';
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  lastUsedAt?: string;
}

export const ApiKeyService = {
  /**
   * Récupère la liste de toutes les clés API de l'organisation
   */
  async getApiKeys(): Promise<ApiKey[]> {
    return api.get<ApiKey[]>('/api-keys');
  },

  /**
   * Crée une nouvelle clé API
   */
  async createApiKey(name: string, scope: string = 'READ_ONLY'): Promise<ApiKey> {
    return api.post<ApiKey>('/api-keys', { name, scope });
  },

  /**
   * Révoque une clé API existante
   */
  async revokeApiKey(id: string): Promise<void> {
    return api.delete<void>(`/api-keys/${id}`);
  },

  /**
   * Régénère le secret d'une clé (rotation)
   */
  async rotateKey(id: string): Promise<ApiKey> {
    return api.post<ApiKey>(`/api-keys/${id}/rotate`, {});
  }
};
