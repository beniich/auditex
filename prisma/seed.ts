import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding Sprint 40 ---');

  // 1. Organization
  const org = await prisma.organization.upsert({
    where: { domain: 'auditmaster.io' },
    update: { annualTurnover: 250000000.0, legalJurisdiction: 'EU' },
    create: {
      id: 'org-1',
      name: 'AuditMaster Global',
      domain: 'auditmaster.io',
      annualTurnover: 250000000.0,
      legalJurisdiction: 'EU'
    },
  });

  // 2. Legal Entities (Hierarchy)
  console.log('Building Legal Hierarchy...');
  
  // HQ
  const hq = await prisma.legalEntity.upsert({
    where: { id: 'ent-hq' },
    update: {},
    create: {
      id: 'ent-hq',
      name: 'AuditMaster HQ',
      organizationId: org.id,
      jurisdiction: 'USA',
      countryCode: 'US',
      localTurnover: 150000000.0,
      liabilityType: 'FULL',
      status: 'VERIFIED'
    }
  });

  // Europe Subsidiary
  const europe = await prisma.legalEntity.upsert({
    where: { id: 'ent-eu' },
    update: {},
    create: {
      id: 'ent-eu',
      name: 'AuditMaster Europe SAS',
      organizationId: org.id,
      parentId: hq.id,
      jurisdiction: 'France',
      countryCode: 'FR',
      localTurnover: 80000000.0,
      liabilityType: 'FULL',
      status: 'VERIFIED'
    }
  });

  // Asia Subsidiary
  const asia = await prisma.legalEntity.upsert({
    where: { id: 'ent-asia' },
    update: {},
    create: {
      id: 'ent-asia',
      name: 'AuditMaster APAC Pte Ltd',
      organizationId: org.id,
      parentId: hq.id,
      jurisdiction: 'Singapore',
      countryCode: 'SG',
      localTurnover: 20000000.0,
      liabilityType: 'LIMITED',
      status: 'VERIFIED'
    }
  });

  // 3. Controls linked to Entities
  console.log('Mapping Controls to Entities...');
  
  const policy = await prisma.policy.findFirst({ where: { organizationId: org.id } });
  if (policy) {
      // Clean up previous controls to avoid confusion
      await prisma.control.deleteMany({ where: { policyId: policy.id } });
      
      await prisma.control.create({
          data: {
              name: 'Cross-Border Data Transfer',
              description: 'Encryption for APAC data transit.',
              status: 'NON_COMPLIANT',
              frequency: 'CONTINUOUS',
              policyId: policy.id,
              entityId: asia.id,
              impact: {
                  create: {
                      potentialFine: 500000,
                      probability: 0.8,
                      remediationCost: 25000
                  }
              }
          }
      });

      await prisma.control.create({
          data: {
              name: 'GDPR Right to be Forgotten',
              description: 'Automated deletion workflows for EU citizens.',
              status: 'NON_COMPLIANT',
              frequency: 'ANNUAL',
              policyId: policy.id,
              entityId: europe.id,
              impact: {
                  create: {
                      potentialFine: 4000000,
                      probability: 0.15,
                      remediationCost: 150000
                  }
              }
          }
      });
  }

  console.log('--- Seeding Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
