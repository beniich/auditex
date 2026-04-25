const API_BASE = '/api';

let currentToken: string | null = null;
export function setRemediationToken(token: string | null) {
  currentToken = token;
}

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: any = { ...options.headers };
  if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

export const RemediationService = {
  setToken: setRemediationToken,
  async list(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/remediations`);
  },
  async updateTask(id: string, data: any): Promise<any> {
    return safeFetch<any>(`${API_BASE}/remediations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
