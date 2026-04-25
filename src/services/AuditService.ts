import { api } from '../lib/api';
import { Audit, AuditEvent, AuditTemplate } from '../types';

export const AuditService = {
  setToken: api.setToken,
  async getTemplates(): Promise<AuditTemplate[]> {
    return api.get<AuditTemplate[]>('/templates');
  },

  async getAudits(): Promise<Audit[]> {
    return api.get<Audit[]>('/audits');
  },

  async getAudit(id: string): Promise<Audit> {
    return api.get<Audit>(`/audit/${id}`);
  },

  async getEvents(id: string): Promise<AuditEvent[]> {
    return api.get<AuditEvent[]>(`/audit/${id}/events`);
  },

  async appendEvent(auditId: string, type: string, payload: any, userId: string = 'current-user') {
    return api.post<any>(`/audit/${auditId}/events`, { type, payload, userId });
  },

  async startAudit(templateId: string, entityId: string): Promise<string> {
    const auditId = `audit-${Date.now()}`;
    await this.appendEvent(auditId, 'AUDIT_STARTED', { templateId, entityId });
    return auditId;
  },
  
  async getLogs(): Promise<any[]> {
    return api.get<any[]>('/audit/logs');
  },

  async verifyAudit(auditId: string): Promise<any> {
    return api.get<any>(`/audit/${auditId}/verify`);
  }
};

// Mock Template
export const SAFETY_TEMPLATE: AuditTemplate = {
  id: 'tpl-safety',
  title: 'Audit de Sécurité Industrielle',
  description: 'Contrôle trimestriel de conformité HSE et protection incendie.',
  version: 1,
  sections: [
    {
      id: 'sec-1',
      title: 'Équipements de Protection Individuelle (EPI)',
      questions: [
        { id: 'q1', text: 'Le port du casque est-il respecté en zone A ?', type: 'YES_NO', weight: 10, required: true },
        { id: 'q2', text: 'État des stocks de gants anti-coupures', type: 'SCORE', weight: 5, required: true },
        { id: 'q3', text: 'Capturez une photo de la signalétique EPI à l\'entrée', type: 'IMAGE', weight: 2, required: false }
      ]
    },
    {
      id: 'sec-2',
      title: 'Sécurité Incendie',
      questions: [
        { id: 'q4', text: 'Les extincteurs ont-ils été vérifiés il y a moins de 6 mois ?', type: 'YES_NO', weight: 15, required: true },
        { id: 'q5', text: 'Observations sur les issues de secours', type: 'TEXT', weight: 5, required: false }
      ]
    }
  ]
};
