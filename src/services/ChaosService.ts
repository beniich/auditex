import { api } from '../lib/api';

export const ChaosService = {
  setToken: api.setToken,
  getStatus: () => api.get<any>('/chaos/status'),
  injectCorruption: (auditId?: string) =>
    api.post<any>('/chaos/corrupt', { auditId }),
  triggerScan: () =>
    api.post<any>('/chaos/scan', {}),
  resetCorrectionBlocks: () =>
    api.post<any>('/chaos/reset', {})
};
