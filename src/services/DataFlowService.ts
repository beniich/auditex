import { api } from '../lib/api';

export interface DataNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'external' | 'sink';
  x: number;
  y: number;
  risk?: boolean;
}

export interface DataConnector {
  from: string;
  to: string;
  color: 'rose' | 'slate';
  risk: number;
  violations?: string[];
}

export const DataFlowService = {
  async getNodes(): Promise<DataNode[]> {
    return api.get<DataNode[]>('/data-flows/nodes');
  },

  async getConnectors(): Promise<DataConnector[]> {
    return api.get<DataConnector[]>('/data-flows/connectors');
  },

  async getFlowStats(): Promise<{ highRiskCount: number; totalFlows: number }> {
    return api.get<{ highRiskCount: number; totalFlows: number }>('/data-flows/stats');
  }
};
