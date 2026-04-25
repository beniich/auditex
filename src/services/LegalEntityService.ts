import { api } from '../lib/api';

export interface LegalEntity {
  id: string;
  name: string;
  jurisdiction: string;
  taxId: string;
  complianceScore: number;
  status: 'ACTIVE' | 'AUDIT_PENDING' | 'NON_COMPLIANT' | 'VERIFIED' | 'IN_PROGRESS' | 'ACTION_REQ';
  type: 'HEADQUARTERS' | 'SUBSIDIARY' | 'BRANCH';
  parentId?: string;
  ownerPercent?: number;
}

export const LegalEntityService = {
  setToken: api.setToken,
  async getEntities(): Promise<LegalEntity[]> {
    return api.get<LegalEntity[]>('/entities');
  },

  async getEntityById(id: string): Promise<LegalEntity> {
    return api.get<LegalEntity>(`/entities/${id}`);
  },

  async updateEntity(id: string, data: Partial<LegalEntity>): Promise<LegalEntity> {
    return api.patch<LegalEntity>(`/entities/${id}`, data);
  }
};
