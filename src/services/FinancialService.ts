import { api } from '../lib/api';

export interface FinancialSummary {
  totalPotentialFine: number;
  totalInterruptionRisk: number;
  totalRemediationCost: number;
  weightedRisk: number;
  nonCompliantCount: number;
  roi: string;
  currency: string;
  turnover: number;
  exposureToTurnoverLimit: number;
}

export const FinancialService = {
  setToken: api.setToken,
  getSummary: () => api.get<FinancialSummary>('/financial/summary'),
  getHeatmap: () => api.get<any[]>('/financial/heatmap'),
  updateImpact: (controlId: string, data: any) =>
    api.post<any>(`/financial/controls/${controlId}`, data)
};
