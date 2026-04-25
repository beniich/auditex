import { api } from '../lib/api';

export const CertificationService = {
  async getStatus(): Promise<any[]> {
    return api.get<any[]>('/certifications/status');
  },

  async getRisks(): Promise<any[]> {
    return api.get<any[]>('/risks');
  },

  async getAuditors(): Promise<any[]> {
    return api.get<any[]>('/certifications/auditors');
  },

  async getCOIs(): Promise<any[]> {
    return api.get<any[]>('/certifications/coi');
  }
};
