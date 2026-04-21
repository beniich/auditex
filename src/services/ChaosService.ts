const API_BASE = '/api/chaos';

let currentToken: string | null = null;
export function setChaosToken(token: string | null) { currentToken = token; }

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: any = { ...options.headers };
  if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`ChaosAPI ${res.status}: ${res.statusText}`);
  return res.json();
}

export const ChaosService = {
  getStatus: () => safeFetch<any>(`${API_BASE}/status`),
  injectCorruption: (auditId?: string) =>
    safeFetch<any>(`${API_BASE}/corrupt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditId })
    }),
  triggerScan: () =>
    safeFetch<any>(`${API_BASE}/scan`, { method: 'POST' }),
  resetCorrectionBlocks: () =>
    safeFetch<any>(`${API_BASE}/reset`, { method: 'POST' })
};
