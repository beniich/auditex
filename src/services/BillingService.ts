import { api } from '../lib/api';

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  plan: string;
  label: string;
}

export const BillingService = {
  async getInvoices(): Promise<Invoice[]> {
    return api.get<Invoice[]>('/billing/invoices');
  },

  async getSubscription(): Promise<any> {
    return api.get<any>('/billing/subscription');
  },

  async updateSubscription(plan: string): Promise<any> {
    return api.patch<any>('/billing/subscription', { plan });
  },

  async createCheckoutSession(lookupKey: string): Promise<{ url: string }> {
    return api.post<{ url: string }>('/billing/checkout', { lookupKey });
  },

  async getCustomerPortalUrl(): Promise<{ url: string }> {
    return api.get<{ url: string }>('/billing/portal');
  },

  async getUsageStats(): Promise<any> {
    return api.get<any>('/billing/usage');
  }
};
