import { api } from '../lib/api';

export const RemediationService = {
  setToken: api.setToken,
  async list(): Promise<any[]> {
    return api.get<any[]>('/remediations');
  },
  async updateTask(id: string, data: any): Promise<any> {
    return api.post<any>(`/remediations/${id}`, data);
  }
};
