export const APP_CAPABILITIES = [
  {
    id: 'dashboard',
    name: 'Global Board',
    description: 'Tableau de bord exécutif résumant l\'état de la conformité, les anomalies réseau et les métriques clés.',
    category: 'Command Center',
    persona: ['CFO', 'CEO', 'CISO'],
    powerTag: 'Executive View',
    tabId: 'dashboard',
    engine: 'Aggregator API'
  },
  {
    id: 'war-room',
    name: 'Live War Room',
    description: 'Centre de commandement de crise en temps réel pour analyser les incidents critiques (Cyber/HSE).',
    category: 'Command Center',
    persona: ['CISO', 'Security Analyst', 'IT Manager'],
    powerTag: 'Real-Time WebSockets',
    tabId: 'war_room',
    engine: 'Apollo/WS Stream'
  },
  {
    id: 'audit-runner',
    name: 'Audit Runner',
    description: 'Moteur d\'exécution des missions d\'audit avec validation en direct des preuves via l\'Intelligence Artificielle.',
    category: 'Command Center',
    persona: ['Auditor', 'Compliance Officer'],
    powerTag: 'AI-Driven',
    tabId: 'audits',
    engine: 'Agentic GenAI'
  },
  {
    id: 'compliance-hub',
    name: 'Compliance Hub',
    description: 'Suivi global du respect des cadres de conformité (ISO 27001, SOC2, RGPD, DORA).',
    category: 'Command Center',
    persona: ['Compliance Officer', 'CISO'],
    powerTag: 'Framework Align',
    tabId: 'compliance',
    engine: 'Rule Engine'
  },
  {
    id: 'remediation',
    name: 'Remediation Workflow',
    description: 'Plan d\'Action Corrective et Préventive (CAPA) pour la réparation des non-conformités.',
    category: 'Forensics & Ops',
    persona: ['IT Manager', 'Compliance Officer'],
    powerTag: 'Workflow Engine',
    tabId: 'remediation_workflow',
    engine: 'State Machine'
  },
  {
    id: 'integrity-diag',
    name: 'Integrity Diagnostics',
    description: 'Surveillance autonome de la santé de la base de données et validation des signatures Sovereign ID.',
    category: 'Forensics & Ops',
    persona: ['DevSecOps', 'Security Analyst'],
    powerTag: 'Self-Healing',
    tabId: 'integrity_diagnostics',
    engine: 'Watchdog Daemon'
  },
  {
    id: 'forensic-ledger',
    name: 'Forensic View',
    description: 'Investigation profonde du registre d\'audit (Ledger) avec traçabilité absolue des événements.',
    category: 'Forensics & Ops',
    persona: ['Security Analyst', 'Auditor'],
    powerTag: 'Immutable Trace',
    tabId: 'forensics',
    engine: 'SHA-256 Ledger'
  },
  {
    id: 'trail',
    name: 'Audit Trail',
    description: 'Flux chronologique des événements vérifiés mathématiquement. Historique infalsifiable.',
    category: 'Forensics & Ops',
    persona: ['Auditor', 'Compliance Officer'],
    powerTag: 'Forensic Chain',
    tabId: 'trail',
    engine: 'Blockchain DB'
  },
  {
    id: 'policy-vault',
    name: 'Policy Vault',
    description: 'Bibliothèque souveraine centralisant l\'ensemble des politiques d\'entreprise connectées aux contrôles.',
    category: 'Governance',
    persona: ['Compliance Officer', 'DPO'],
    powerTag: 'Master Data',
    tabId: 'policy_library',
    engine: 'Prisma DB'
  },
  {
    id: 'network-topology',
    name: 'Network Topology',
    description: 'Cartographie en temps réel des infrastructures, passerelles API et clusters virtuels.',
    category: 'Network & Infra',
    persona: ['IT Manager', 'DevSecOps'],
    powerTag: 'Live Monitoring',
    tabId: 'network_topology',
    engine: 'Telemetry Stream'
  },
  {
    id: 'system-vault',
    name: 'System Vault',
    description: 'Gestionnaire ultra-sécurisé de secrets cryptographiques (RSA, AES), avec évaluation d\'entropie.',
    category: 'Network & Infra',
    persona: ['CISO', 'Security Analyst'],
    powerTag: 'KMS',
    tabId: 'vault',
    engine: 'AES-GCM-256'
  },
  {
    id: 'cfo-dashboard',
    name: 'CFO Dashboard',
    description: 'Calcul automatique de l\'exposition financière et de la responsabilité réglementaire en cascade (Liability Flow).',
    category: 'Analytics',
    persona: ['CFO', 'CEO'],
    powerTag: 'Financial Intelligence',
    tabId: 'financial_dashboard',
    engine: 'Liability Engine'
  },
  {
    id: 'chaos-lab',
    name: 'Chaos Lab',
    description: 'Environnement offensif "Red Team" pour injecter des corruptions (XSS, DB Hack) et vérifier la résilience en temps réel.',
    category: 'Red Team',
    persona: ['DevSecOps', 'CISO'],
    powerTag: 'Chaos Engineering',
    tabId: 'chaos_lab',
    engine: 'Simulated Attacks'
  }
];
