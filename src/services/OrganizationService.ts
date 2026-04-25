const API_BASE = '/api';

let currentToken: string | null = null;
export function setOrganizationToken(token: string | null) {
  currentToken = token;
}

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: any = { ...options.headers };
  if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

export const OrganizationService = {
  setToken: setOrganizationToken,
  async list(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/organizations`);
  },
  async getById(id: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/organizations/${id}`);
  },
  async getSubsidiaries(orgId: string): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/organizations/${orgId}/subsidiaries`);
  }
};

