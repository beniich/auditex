const API_BASE = '/api';

let currentToken: string | null = null;

export function setGlobalAuthToken(token: string | null) {
  currentToken = token;
}

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const headers: any = {
      ...options.headers,
    };
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`[VaultService] Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const VaultService = {
  setToken: setGlobalAuthToken,

  async getKeys(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/vault/keys`);
  },

  async rotateKey(id: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/vault/keys/${id}/rotate`, { method: 'POST' });
  },

  async accessKey(id: string): Promise<{ id: string; value: string }> {
    return safeFetch<{ id: string; value: string }>(`${API_BASE}/vault/keys/${id}/access`);
  },

  async createKey(name: string, type: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/vault/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    });
  }
};
