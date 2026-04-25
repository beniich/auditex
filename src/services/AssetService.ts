const API_BASE = '/api';

let currentToken: string | null = null;
export function setAssetToken(token: string | null) {
  currentToken = token;
}

async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: any = { ...options.headers };
  if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

export const AssetService = {
  setToken: setAssetToken,
  async list(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/assets`);
  },
  async tagAsset(id: string, tags: any): Promise<any> {
    return safeFetch<any>(`${API_BASE}/assets/${id}/tag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags })
    });
  }
};
