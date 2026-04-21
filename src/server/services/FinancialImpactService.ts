import { prisma } from '../../lib/prisma';

export interface JurisdictionalReport {
  entityId: string;
  name: string;
  country: string;
  localRisk: number;
  cascadedRisk: number;
  totalRisk: number;
  turnover: number;
  exposureLevel: number;
}

export class FinancialImpactService {
  private static readonly REGIONAL_MULTIPLIERS: Record<string, number> = {
    'EU': 1.25,
    'US': 1.15,
    'APAC': 1.05,
    'LATAM': 0.85,
    'AFRICA': 0.75
  };

  static async getGlobalImpact(organizationId: string) {
    const policies = await prisma.policy.findMany({
      where: { organizationId },
      include: {
        controls: {
          include: {
            impact: true
          }
        }
      }
    });

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    const turnover = organization?.annualTurnover || 0;
    const jurisdiction = organization?.legalJurisdiction || 'EU';

    const allControls = policies.flatMap(p => p.controls.map(c => ({ ...c, framework: p.framework })));
    const nonCompliant = allControls.filter(c => c.status === 'NON_COMPLIANT');

    let totalPotentialFine = 0;
    let totalInterruptionRisk = 0;
    let totalRemediationCost = 0;
    let weightedRisk = 0;

    for (const control of nonCompliant) {
      const impact = control.impact;
      let fineSurface = impact?.potentialFine || 0;
      if (fineSurface === 0 && turnover > 0) {
        if (control.framework === 'GDPR') fineSurface = turnover * 0.04;
        else if (['DORA', 'NIS2', 'ISO-27001'].includes(control.framework)) fineSurface = turnover * 0.02;
        else fineSurface = turnover * 0.005;
      }

      totalPotentialFine += fineSurface;
      totalInterruptionRisk += (impact?.interruptionCost || 0) * 24;
      totalRemediationCost += (impact?.remediationCost || 0);
      
      const prob = impact?.probability || 0.05;
      weightedRisk += (fineSurface + ((impact?.interruptionCost || 0) * 24)) * prob;
    }

    return {
      totalPotentialFine,
      totalInterruptionRisk,
      totalRemediationCost,
      weightedRisk,
      nonCompliantCount: nonCompliant.length,
      roi: totalRemediationCost > 0 ? (weightedRisk / totalRemediationCost).toFixed(2) : '0',
      turnover,
      exposureToTurnoverLimit: turnover > 0 ? ((totalPotentialFine / turnover) * 100).toFixed(2) : '0',
      currency: 'EUR'
    };
  }

  /**
   * Sprint 40: Liability Cascading Engine
   * Calculates how risk at a subsidiary level propagates to the parent entity.
   */
  static async calculateJurisdictionalRisk(entityId: string): Promise<JurisdictionalReport | null> {
    const entity = await prisma.legalEntity.findUnique({
      where: { id: entityId },
      include: { 
        controls: { include: { impact: true, policy: true } },
        children: true
      }
    });

    if (!entity) return null;

    // 1. Compute Direct Local Risk
    let localFineRisk = 0;
    for (const ctrl of entity.controls.filter(c => c.status === 'NON_COMPLIANT')) {
      const framework = ctrl.policy.framework;
      const rate = framework === 'GDPR' ? 0.04 : (['DORA', 'NIS2'].includes(framework) ? 0.02 : 0.005);
      localFineRisk += (entity.localTurnover * rate) * (ctrl.impact?.probability || 0.1);
    }

    // Apply regional severity multiplier
    const region = this.getRegionByCountry(entity.countryCode);
    const multiplier = this.REGIONAL_MULTIPLIERS[region] || 1.0;
    localFineRisk *= multiplier;

    // 2. Cascade Upward Risk from subsidiaries
    let cascadedRisk = 0;
    for (const child of entity.children) {
        const childReport: any = await this.calculateJurisdictionalRisk(child.id);
        if (childReport) {
            // "FULL" liability propagate 100% of risk, "LIMITED" propagates 40%
            const factor = child.liabilityType === 'FULL' ? 1.0 : 0.4;
            cascadedRisk += childReport.totalRisk * factor;
        }
    }

    const totalRisk = localFineRisk + cascadedRisk;

    return {
      entityId: entity.id,
      name: entity.name,
      country: entity.countryCode,
      localRisk: localFineRisk,
      cascadedRisk,
      totalRisk,
      turnover: entity.localTurnover,
      exposureLevel: entity.localTurnover > 0 ? (totalRisk / entity.localTurnover) * 100 : 0
    };
  }

  private static getRegionByCountry(countryCode: string): string {
    const eu = ['FR', 'DE', 'IT', 'ES', 'BE', 'NL'];
    const apac = ['SG', 'JP', 'CN', 'AU'];
    const latam = ['BR', 'MX', 'AR'];
    
    if (eu.includes(countryCode)) return 'EU';
    if (countryCode === 'US') return 'US';
    if (apac.includes(countryCode)) return 'APAC';
    if (latam.includes(countryCode)) return 'LATAM';
    return 'OTHER';
  }

  static async updateImpact(controlId: string, data: any) {
    return prisma.complianceGapImpact.upsert({
      where: { controlId },
      update: data,
      create: {
        controlId,
        ...data
      }
    });
  }

  static async seedDemoImpacts(organizationId: string) {
    const controls = await prisma.control.findMany({
      where: { policy: { organizationId }, status: 'NON_COMPLIANT' }
    });

    for (const ctrl of controls) {
      const isIso = ctrl.name.toLowerCase().includes('iso') || ctrl.name.toLowerCase().includes('access');
      await this.updateImpact(ctrl.id, {
        potentialFine: isIso ? 250000 : 50000,
        interruptionCost: isIso ? 1500 : 400,
        remediationCost: isIso ? 12000 : 3500,
        probability: 0.15,
        currency: 'EUR'
      });
    }
  }
}
