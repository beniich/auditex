import { AuditTemplate, AuditQuestion, JourneyStep, Rubric } from '../types';

/**
 * Maps standard Lucide icons to journey steps based on index or title keywords.
 */
const SECTION_ICONS: Record<number, string> = {
  0: 'Shield',
  1: 'Users',
  2: 'Database',
  3: 'Lock',
  4: 'BarChart2',
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  'phys_sec': 'Validation de l\'intégrité des accès physiques et de la surveillance.',
  'net_config': 'Audit de la segmentation réseau et des pare-feu.',
};

/**
 * Heuristics to group questions into logical rubrics if not explicitly defined.
 * If questions have a prefix (e.g., PH_Q1, NW_Q1), we group by prefix.
 * Otherwise, we group them in chunks of 5.
 */
const groupQuestionsIntoRubrics = (questions: AuditQuestion[]): Rubric[] => {
  if (questions.length === 0) return [];

  // Simple heuristic: chunk of 5 for now, unless template metadata suggests otherwise.
  const rubrics: Rubric[] = [];
  const chunkSize = 5;

  for (let i = 0; i < questions.length; i += chunkSize) {
    const chunk = questions.slice(i, i + chunkSize);
    const id = `rubric_${i / chunkSize}`;
    rubrics.push({
      id,
      label: `Rubrique ${Math.floor(i / chunkSize) + 1}`,
      questionIds: chunk.map(q => q.id),
      required: chunk.some(q => q.required),
      status: 'LOCKED' // Initial state
    });
  }

  return rubrics;
};

/**
 * Main engine to transform a flat AuditTemplate into a structured Guided Journey.
 */
export const buildJourneyFromTemplate = (template: AuditTemplate): JourneyStep[] => {
  if (!template || !template.sections) return [];

  return template.sections.map((section, idx) => ({
    step: idx + 1,
    title: section.title,
    icon: SECTION_ICONS[idx] || 'FileCheck',
    description: section.title || 'Validation des protocoles de sécurité standard.',
    rubrics: groupQuestionsIntoRubrics(section.questions),
  }));
};
