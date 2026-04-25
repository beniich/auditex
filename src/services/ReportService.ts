import { api } from '../lib/api';

export interface ReportComponent {
  id: string; // The ID from components palette (e.g., 'risk_matrix', 'audit_trail')
}

export interface ComplianceReport {
  id: string;
  title: string;
  createdAt: string;
  status: 'DRAFT' | 'FINAL';
  components: string[]; // List of component IDs
  aiSummary?: string;
}

export const ReportService = {
  getReports: () => api.get<ComplianceReport[]>('/reports'),
  getReport: (id: string) => api.get<ComplianceReport>(`/reports/${id}`),
  saveReport: (data: Partial<ComplianceReport>) => api.post<ComplianceReport>('/reports', data),
  updateReport: (id: string, data: Partial<ComplianceReport>) => api.patch<ComplianceReport>(`/reports/${id}`, data),
};
