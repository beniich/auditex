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
    console.error(`[NotificationService] Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const NotificationService = {
  setToken: setGlobalAuthToken,

  async getNotifications(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/notifications`);
  },

  async markAsRead(id: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
  },

  async markAllAsRead(): Promise<any> {
    return safeFetch<any>(`${API_BASE}/notifications/read-all`, { method: 'POST' });
  }
};
