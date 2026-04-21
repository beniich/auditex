const API_BASE = '/api/financial';

let currentToken: string | null = null;
export function setFinancialToken(token: string | null) { currentToken = token; }

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: any = { ...options.headers };
  if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`FinancialAPI ${res.status}: ${res.statusText}`);
  return res.json();
}

export interface FinancialSummary {
  totalPotentialFine: number;
  totalInterruptionRisk: number;
  totalRemediationCost: number;
  weightedRisk: number;
  nonCompliantCount: number;
  roi: string;
  currency: string;
}

export const FinancialService = {
  getSummary: () => safeFetch<FinancialSummary>(`${API_BASE}/summary`),
  getHeatmap: () => safeFetch<any[]>(`${API_BASE}/heatmap`),
  updateImpact: (controlId: string, data: any) =>
    safeFetch<any>(`${API_BASE}/controls/${controlId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
};
