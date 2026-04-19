import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding ---');

  // 1. Organization
  const org = await prisma.organization.upsert({
    where: { domain: 'auditmaster.io' },
    update: {},
    create: {
      id: 'org-1',
      name: 'AuditMaster Global',
      domain: 'auditmaster.io',
    },
  });
  console.log(`Organization created: ${org.name}`);

  // 2. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@auditmaster.io' },
    update: {},
    create: {
      id: 'user-admin',
      clerkId: 'inspector-123', // Match with the fallback in server/routes/api.ts
      email: 'admin@auditmaster.io',
      firstName: 'Chief',
      lastName: 'Inspector',
      organizationId: org.id,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user created: ${admin.firstName}`);

  // 3. Audit Template
  const safetyTemplate = await prisma.auditTemplate.create({
    data: {
      id: 'tpl-safety',
      title: 'Audit de Sécurité Industrielle',
      description: 'Contrôle trimestriel de conformité HSE et protection incendie.',
      version: 1,
      content: [
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
      ],
    },
  });
  console.log(`Template created: ${safetyTemplate.title}`);

  // 4. Infrastructure Nodes
  const nodesData = [
    { id: 'node-1', name: 'Core API Gateway', region: 'eu-west-1', type: 'API_GATEWAY', status: 'HEALTHY', ipAddress: '10.0.1.1' },
    { id: 'node-2', name: 'Main Database Cluster', region: 'eu-west-1', type: 'DATABASE', status: 'HEALTHY', ipAddress: '10.0.1.50' },
    { id: 'node-3', name: 'Legacy Mainframe', region: 'us-east-1', type: 'VIRTUAL_MACHINE', status: 'DEGRADED', ipAddress: '192.168.10.10' },
    { id: 'node-4', name: 'WAF Edge Node', region: 'global', type: 'FIREWALL', status: 'HEALTHY', ipAddress: '45.22.1.200' },
    { id: 'node-5', name: 'Kubernetes Worker Pool', region: 'eu-central-1', type: 'KUBERNETES_CLUSTER', status: 'HEALTHY', ipAddress: '10.2.0.1' },
  ];

  for (const node of nodesData) {
    await prisma.networkNode.create({
      data: {
        ...node,
        organizationId: org.id as string,
      } as any
    });
  }
  console.log(`${nodesData.length} nodes created.`);

  // 5. Compliance Policies & Controls
  const isoPolicy = await prisma.policy.create({
    data: {
      id: 'pol-iso27001',
      organizationId: org.id,
      title: 'ISO-27001 Security Standard',
      framework: 'ISO-27001',
      content: 'Core information security management system requirements.',
      controls: {
        create: [
          { name: 'Access Control Policy', description: 'Formal policy for user access rights.', frequency: 'ANNUAL', status: 'COMPLIANT' },
          { name: 'Password Complexity', description: 'Enforce strong passwords across all systems.', frequency: 'CONTINUOUS', status: 'COMPLIANT' },
          { name: 'Physical Entry Controls', description: 'Secure areas shall be protected by appropriate entry controls.', frequency: 'ANNUAL', status: 'NON_COMPLIANT' },
        ]
      }
    }
  });

  const soc2Policy = await prisma.policy.create({
    data: {
      id: 'pol-soc2',
      organizationId: org.id,
      title: 'SOC 2 Trust Services Criteria',
      framework: 'SOC2',
      content: 'Security, Availability, and Confidentiality focus.',
      controls: {
        create: [
          { name: 'Incident Response Plan', description: 'Tested plan for responding to security incidents.', frequency: 'ANNUAL', status: 'COMPLIANT' },
          { name: 'Data Encryption at Rest', description: 'Encryption for all sensitive data stores.', frequency: 'CONTINUOUS', status: 'NOT_TESTED' },
          { name: 'Vulnerability Scanning', description: 'Quarterly scans of production systems.', frequency: 'QUARTERLY', status: 'COMPLIANT' },
        ]
      }
    }
  });
  console.log('Compliance framework seeded.');

  // 6. Incidents & CAPAs
  const incident = await prisma.incident.create({
    data: {
      id: 'inc-2024-001',
      organizationId: org.id,
      title: 'Unauthorized Access Attempt - Node-X7',
      severity: 'CRITICAL',
      status: 'INVESTIGATING',
      detectedAt: new Date(),
      tasks: {
        create: [
          { title: 'Isolate compromised node', description: 'Remove node from public load balancer.', status: 'DONE', dueDate: new Date() },
          { title: 'Rotate service credentials', description: 'Flush all active sessions and change keys.', status: 'IN_PROGRESS', assigneeId: admin.id },
          { title: 'Review WAF logs', description: 'Identify origin IP and payload of the breach.', status: 'TODO' },
        ]
      }
    }
  });
  console.log(`Incident created: ${incident.title}`);

  // 7. Initial Risk Assessments
  await prisma.riskAssessment.createMany({
    data: [
      { jurisdiction: 'France', riskScore: 12.5, category: 'REGULATORY', details: 'GDPR compliance review pending.' },
      { jurisdiction: 'USA', riskScore: 45.2, category: 'CYBER', details: 'High volume of edge extraction attempts detected.' },
      { jurisdiction: 'Japan', riskScore: 8.4, category: 'OPERATIONAL', details: 'Nominal.' },
    ]
  });
  console.log('Risk assessments seeded.');

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
