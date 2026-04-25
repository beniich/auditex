import { api } from '../lib/api';

export const RiskService = {
  setToken: api.setToken,
  async getRegister(): Promise<any[]> {
    return api.get<any[]>('/risks/register');
  },
  async createRisk(data: any): Promise<any> {
    return api.post<any>('/risks/register', data);
  }
};
