import { AuditTemplate, AuditQuestion, JourneyStep, Rubric } from '../types';

const SECTION_ICONS: Record<number, string> = {
  0: 'Shield',
  1: 'Users',
  2: 'BarChart2',
  3: 'Network',
  4: 'Lock',
  5: 'FileCheck'
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  'sec-1': 'Validation des équipements et protection',
  'sec-2': 'Sécurité incendie et normes d\'urgence',
  'infra': 'Validation des contrôles de sécurité de l\'infrastructure',
  'iam': 'Contrôles d\'accès et gestion des identités',
  'network': 'Analyse des pare-feux et flux réseaux',
  'data': 'Sécurité des données et cryptographie',
  'compliance': 'Évaluation des standards de conformité'
};

const groupQuestionsIntoRubrics = (questions: AuditQuestion[]): Rubric[] => {
  // Simple grouping: creating logic to chunk questions into logical rubrics
  const rubrics: Rubric[] = [];
  const chunkSize = 3;
  for (let i = 0; i < questions.length; i += chunkSize) {
    const chunk = questions.slice(i, i + chunkSize);
    rubrics.push({
      id: `rubric-${chunk[0].id.split('_')[0] || i}`,
      label: `Bloc de contrôle ${Math.floor(i/chunkSize) + 1}`,
      description: 'Validation de ce sous-ensemble de règles de conformité',
      questionIds: chunk.map(q => q.id),
      required: chunk.some(q => q.required)
    });
  }
  return rubrics;
};

export const buildJourneyFromTemplate = (template: AuditTemplate): JourneyStep[] => {
  return template.sections.map((section, idx) => ({
    step: idx + 1,
    title: section.title,
    icon: SECTION_ICONS[idx] ?? 'FileCheck',
    description: SECTION_DESCRIPTIONS[section.id.toLowerCase()] ?? 'Validation des contrôles de conformité',
    rubrics: groupQuestionsIntoRubrics(section.questions),
  }));
};
