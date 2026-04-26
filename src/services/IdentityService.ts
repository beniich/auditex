import { api } from '../lib/api';

export interface SsoConfig {
  name: string;
  protocol: 'SAML_2_0' | 'OIDC';
  acsUrl: string;
  entityId: string;
  certificate?: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export interface AttributeMapping {
  id: string;
  source: string;
  target: string;
  fallback?: string;
  status: 'ACTIVE' | 'PENDING';
}

export const IdentityService = {
  async getConfig(): Promise<SsoConfig> {
    return api.get<SsoConfig>('/identity/config');
  },

  async updateConfig(config: Partial<SsoConfig>): Promise<SsoConfig> {
    return api.patch<SsoConfig>('/identity/config', config);
  },

  async getMappings(): Promise<AttributeMapping[]> {
    return api.get<AttributeMapping[]>('/identity/mappings');
  },

  async testConnection(): Promise<{ success: boolean; latency: number; details: string }> {
    return api.post<{ success: boolean; latency: number; details: string }>('/identity/test', {});
  },

  async getProfile(): Promise<any> {
    return api.get<any>('/auth/profile');
  },

  async updateProfile(data: any): Promise<any> {
    return api.patch<any>('/auth/profile', data);
  }
};
