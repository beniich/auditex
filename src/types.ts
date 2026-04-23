/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AuditStatus = 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED' | 'CLOSED';

export interface AuditEvent {
  id: string;
  auditId: string;
  type: string;
  timestamp: string;
  userId: string;
  payload: any;
  sha256_hash?: string;
}

export interface AuditTemplate {
  id: string;
  title: string;
  description: string;
  sections: AuditSection[];
  version: number;
}

export interface AuditSection {
  id: string;
  title: string;
  questions: AuditQuestion[];
}

export interface AuditQuestionLogic {
  showIf?: {
    questionId: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
    value: any;
  };
}

export interface AuditQuestion {
  id: string;
  text: string;
  type: 'YES_NO' | 'SCORE' | 'TEXT' | 'IMAGE';
  weight: number;
  required: boolean;
  logic?: AuditQuestionLogic;
}

export interface Audit {
  id: string;
  templateId: string;
  status: AuditStatus;
  auditorId: string;
  entityId: string;
  startedAt: string;
  submittedAt?: string;
  responses: Record<string, AuditResponse>;
  gpsLocation?: { lat: number; lng: number };
}

export interface AuditResponse {
  questionId: string;
  value: any;
  evidenceUrl?: string[];
  findingText?: string;
  score?: number;
  timestamp: string;
}

export interface KPI {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export type RubricStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED' | 'AI_VALIDATED';

export interface Rubric {
  id: string;
  label: string;
  description?: string;
  questionIds: string[];   // Mapping to AuditQuestion IDs
  required: boolean;
  status?: RubricStatus;
}

export interface JourneyStep {
  step: number;
  title: string;
  icon: string;            // Lucide icon name
  description: string;
  rubrics: Rubric[];
}

export interface JourneyState {
  currentStep: number;
  rubricStatuses: Record<string, RubricStatus>;  // rubricId -> status
  stepValidations: Record<number, boolean>;        // stepIdx -> isComplete
  aiTransitionInsights: Record<number, string>;    // stepIdx -> AI message
  lockedResponses: Set<string>;                    // questionIds that are locked
}
