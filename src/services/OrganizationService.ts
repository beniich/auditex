import { api } from '../lib/api';

export const OrganizationService = {
  setToken: api.setToken,
  async list(): Promise<any[]> {
    return api.get<any[]>('/organizations');
  },
  async getById(id: string): Promise<any> {
    return api.get<any>(`/organizations/${id}`);
  },
  async getSubsidiaries(orgId: string): Promise<any[]> {
    return api.get<any[]>(`/organizations/${orgId}/subsidiaries`);
  }
};

