import { api } from '../lib/api';

export const AssetService = {
  setToken: api.setToken,
  async list(): Promise<any[]> {
    return api.get<any[]>('/assets');
  },
  async tagAsset(id: string, tags: any): Promise<any> {
    return api.post<any>(`/assets/${id}/tag`, { tags });
  }
};
