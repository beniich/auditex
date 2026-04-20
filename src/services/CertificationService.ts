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
    console.error(`[CertificationService] Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const CertificationService = {
  setToken: setGlobalAuthToken,

  async getStatus(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/certifications/status`);
  },

  async getRisks(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/risks`);
  }
};
