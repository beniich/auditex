import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuditMasterLayout } from '../components/AuditMasterLayout';
import { Skeleton } from '../components/common/Skeleton';

// Services
import { AuditService } from '../services/AuditService';
import { OrganizationService } from '../services/OrganizationService';
import { RiskService } from '../services/RiskService';
import { RemediationService } from '../services/RemediationService';
import { AssetService } from '../services/AssetService';
import { ComplianceService } from '../services/ComplianceService';
import { ChaosService } from '../services/ChaosService';
import { IncidentService } from '../services/IncidentService';
import { LegalEntityService } from '../services/LegalEntityService';
import { VaultService } from '../services/VaultService';
import { FinancialService } from '../services/FinancialService';
import { AiApiService } from '../services/AiApiService';
import { BillingService } from '../services/BillingService';
import { CertificationService } from '../services/CertificationService';
import { api } from '../lib/api';

import { Audit, AuditTemplate } from '../types';
import { ClipboardCheck, List, Plus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useLiveUpdates } from '../hooks/useLiveUpdates';

// Lazy Load Modules (Normalised)
const Dashboard = lazy(() => import('../components/common/Dashboard').then(m => ({ default: m.Dashboard })));
const AuditRunner = lazy(() => import('../components/audit/AuditRunner').then(m => ({ default: m.AuditRunner })));
const AuditTrail = lazy(() => import('../components/audit/AuditTrail').then(m => ({ default: m.AuditTrail })));
const ComplianceHub = lazy(() => import('../components/governance/ComplianceHub').then(m => ({ default: m.ComplianceHub })));
const SystemVault = lazy(() => import('../components/admin/SystemVault').then(m => ({ default: m.SystemVault })));
const PredictiveAnalytics = lazy(() => import('../components/ai/PredictiveAnalytics').then(m => ({ default: m.PredictiveAnalytics })));
const GovernancePortal = lazy(() => import('../components/governance/GovernancePortal').then(m => ({ default: m.GovernancePortal })));
const CertificationsHub = lazy(() => import('../components/governance/CertificationsHub').then(m => ({ default: m.CertificationsHub })));
const ForensicView = lazy(() => import('../components/forensics/ForensicView').then(m => ({ default: m.ForensicView })));
const PolicyLibrary = lazy(() => import('../components/governance/PolicyLibrary').then(m => ({ default: m.PolicyLibrary })));
const IntegrityDiagnostics = lazy(() => import('../components/forensics/IntegrityDiagnostics').then(m => ({ default: m.IntegrityDiagnostics })));
const NetworkNodeTopology = lazy(() => import('../components/infrastructure/NetworkNodeTopology').then(m => ({ default: m.NetworkNodeTopology })));
const StakeholderReporting = lazy(() => import('../components/governance/StakeholderReporting').then(m => ({ default: m.StakeholderReporting })));
const OrganizationHierarchy = lazy(() => import('../components/infrastructure/OrganizationHierarchy').then(m => ({ default: m.OrganizationHierarchy })));
const DiscoveryCenter = lazy(() => import('../components/infrastructure/DiscoveryCenter').then(m => ({ default: m.DiscoveryCenter })));
const RiskRegisterDashboard = lazy(() => import('../components/risk/RiskRegisterDashboard').then(m => ({ default: m.RiskRegisterDashboard })));
const RemediationTaskBoard = lazy(() => import('../components/operations/RemediationTaskBoard').then(m => ({ default: m.RemediationTaskBoard })));
const AIAgentConfiguration = lazy(() => import('../components/ai/AIAgentConfiguration').then(m => ({ default: m.AIAgentConfiguration })));
const ImmutableLedgerBrowser = lazy(() => import('../components/governance/ImmutableLedgerBrowser').then(m => ({ default: m.ImmutableLedgerBrowser })));
const IntegrationsMarketplace = lazy(() => import('../components/infrastructure/IntegrationsMarketplace').then(m => ({ default: m.IntegrationsMarketplace })));
const CertificationScorecard = lazy(() => import('../components/governance/CertificationScorecard').then(m => ({ default: m.CertificationScorecard })));
const AccessControlManagement = lazy(() => import('../components/admin/AccessControlManagement').then(m => ({ default: m.AccessControlManagement })));
const PolicyManagementCenter = lazy(() => import('../components/governance/PolicyManagementCenter').then(m => ({ default: m.PolicyManagementCenter })));
const AssetClassification = lazy(() => import('../components/infrastructure/AssetClassification').then(m => ({ default: m.AssetClassification })));
const UsageBillingDashboard = lazy(() => import('../components/admin/UsageBillingDashboard').then(m => ({ default: m.UsageBillingDashboard })));
const TeamCollaboration = lazy(() => import('../components/operations/TeamCollaboration').then(m => ({ default: m.TeamCollaboration })));
const AuditActionCenter = lazy(() => import('../components/operations/AuditActionCenter').then(m => ({ default: m.AuditActionCenter })));
const VerifiedBadgeCenter = lazy(() => import('../components/governance/VerifiedBadgeCenter').then(m => ({ default: m.VerifiedBadgeCenter })));
const ControlLibrary = lazy(() => import('../components/governance/ControlLibrary').then(m => ({ default: m.ControlLibrary })));
const RAGKnowledgeBase = lazy(() => import('../components/governance/RAGKnowledgeBase').then(m => ({ default: m.RAGKnowledgeBase })));
const ReportBuilder = lazy(() => import('../components/governance/ReportBuilder').then(m => ({ default: m.ReportBuilder })));
const DataMappingExplorer = lazy(() => import('../components/infrastructure/DataMappingExplorer').then(m => ({ default: m.DataMappingExplorer })));
const SubsidiaryDetail = lazy(() => import('../components/infrastructure/SubsidiaryDetail').then(m => ({ default: m.SubsidiaryDetail })));
const NewAuditModal = lazy(() => import('../components/audit/NewAuditModal').then(m => ({ default: m.NewAuditModal })));
const WarRoom = lazy(() => import('../components/operations/WarRoom').then(m => ({ default: m.WarRoom })));
const ChaosLab = lazy(() => import('../components/operations/ChaosLab').then(m => ({ default: m.ChaosLab })));
const FinancialDashboard = lazy(() => import('../components/admin/FinancialDashboard').then(m => ({ default: m.FinancialDashboard })));
const CapabilityCenter = lazy(() => import('../components/operations/CapabilityCenter').then(m => ({ default: m.CapabilityCenter })));
const GuidedAuditRunner = lazy(() => import('../components/audit/GuidedAuditRunner').then(m => ({ default: m.GuidedAuditRunner })));
const AIAnalyticsHub = lazy(() => import('../components/ai/AIAnalyticsHub').then(m => ({ default: m.AiAnalyticsHub })));
const APISecurity = lazy(() => import('../components/admin/APISecurity').then(m => ({ default: m.APISecurity })));
const BatchCenter = lazy(() => import('../components/audit/BatchCenter').then(m => ({ default: m.BatchCenter })));
const IdentityProviderSetup = lazy(() => import('../components/admin/IdentityProviderSetup').then(m => ({ default: m.IdentityProviderSetup })));
const InnovationLab = lazy(() => import('../components/ai/InnovationLab').then(m => ({ default: m.InnovationLab })));
const IncidentWorkspace = lazy(() => import('../components/operations/IncidentWorkspace').then(m => ({ default: m.IncidentWorkspace })));
const RegulatorPortal = lazy(() => import('../components/governance/RegulatorPortal').then(m => ({ default: m.RegulatorPortal })));
const SecurityAuditLog = lazy(() => import('../components/forensics/SecurityAuditLog').then(m => ({ default: m.SecurityAuditLog })));
const SovereigntyMonitor = lazy(() => import('../components/forensics/SovereigntyMonitor').then(m => ({ default: m.SovereigntyMonitor })));
const MaintenanceUpgrades = lazy(() => import('../components/admin/MaintenanceUpgrades').then(m => ({ default: m.MaintenanceUpgrades })));
const SystemHelp = lazy(() => import('../components/admin/SystemHelp').then(m => ({ default: m.SystemHelp })));
const QuotaDashboard = lazy(() => import('../components/admin/QuotaDashboard').then(m => ({ default: m.QuotaDashboard })));
const SmartFormLab = lazy(() => import('../components/ai/SmartFormLab').then(m => ({ default: m.SmartFormLab })));



export const DashboardContainer = () => {
  useLiveUpdates();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [audits, setAudits] = useState<Audit[]>([]);
  const [templates, setTemplates] = useState<AuditTemplate[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuidedMode, setIsGuidedMode] = useState(true);

  useEffect(() => {
    getToken().then(t => {
      if (t) {
        api.setToken(t);
        // Also sync individuals that have internal state
        AuditService.setToken(t);
        OrganizationService.setToken(t);
        RiskService.setToken(t);
        RemediationService.setToken(t);
        AssetService.setToken(t);
        ComplianceService.setToken(t);
        ChaosService.setToken(t);
        IncidentService.setToken(t);
        LegalEntityService.setToken(t);
        VaultService.setToken(t);
        FinancialService.setToken(t);
        AiApiService.setToken(t);
        CertificationService.setToken?.(t);

        refreshAudits();
        loadTemplates();
      }
    });
  }, [getToken]);


  const loadTemplates = async () => {
    try {
      const data = await AuditService.getTemplates();
      setTemplates(data);
    } catch (e) {
      console.error('Failed to load templates', e);
    }
  };

  const refreshAudits = async () => {
    try {
      const data = await AuditService.getAudits();
      setAudits(data);
    } catch (e) {
      console.error('Failed to load audits', e);
    }
  };

  const handleStartNewAudit = async (templateId: string, entityId: string) => {
    const id = await AuditService.startAudit(templateId, entityId);
    setIsModalOpen(false);
    setSelectedAuditId(id);
    setActiveTab('audits');
    refreshAudits();
  };

  return (
    <AuditMasterLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        {activeTab === 'dashboard' && (
          <Dashboard audits={audits} templates={templates} />
        )}

        {activeTab === 'war_room' && (
          <WarRoom />
        )}

        {activeTab === 'audits' && (
          <div className="flex flex-col gap-6">
            {!selectedAuditId ? (
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#091426] uppercase tracking-tight">Mission Control Registry</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase mt-1">Real-time audit pipeline and field execution</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#091426] text-white px-8 py-4 rounded-2xl font-black text-[10px] shadow-xl shadow-slate-900/10 uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Deploy New Mission
                  </button>
                </div>
                
                {isModalOpen && (
                  <NewAuditModal 
                    templates={templates} 
                    onClose={() => setIsModalOpen(false)} 
                    onStart={handleStartNewAudit} 
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {audits.map(audit => (
                    <div key={audit.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6 group hover:shadow-xl hover:border-blue-200 transition-all cursor-default">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <ClipboardCheck size={28} />
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg text-[8px] uppercase font-black tracking-widest border ${
                          audit.status === 'DRAFT' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                          audit.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {audit.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono">#{audit.id.substring(0, 12)}</p>
                        <h4 className="text-lg font-black text-[#091426] truncate mt-1 uppercase tracking-tight">
                          {templates.find(t => t.id === audit.templateId)?.title || audit.entityId}
                        </h4>
                      </div>
                      <div className="pt-6 border-t border-slate-50 flex gap-3">
                        <button 
                          onClick={() => setSelectedAuditId(audit.id)}
                          className="flex-1 py-3.5 bg-[#091426] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                        >
                          {audit.status === 'SUBMITTED' ? 'View Report' : 'Resume Capture'}
                        </button>
                        <button 
                          onClick={() => { setActiveTab('trail'); }}
                          className="px-5 py-3.5 border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all"
                        >
                          <List size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex justify-between items-center mb-10">
                    <button 
                      onClick={() => setSelectedAuditId(null)}
                      className="text-slate-400 hover:text-[#091426] flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm"
                    >
                      ← Exit to Registry
                    </button>
                    <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                      <button 
                        onClick={() => setIsGuidedMode(false)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isGuidedMode ? 'bg-[#091426] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                      >
                        Classic
                      </button>
                      <button 
                        onClick={() => setIsGuidedMode(true)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isGuidedMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-100'}`}
                      >
                        Guided
                      </button>
                    </div>
                  </div>
                  {selectedAuditId && (
                    isGuidedMode ? (
                      <GuidedAuditRunner 
                        auditId={selectedAuditId} 
                        template={templates.find(t => t.id === audits.find(a => a.id === selectedAuditId)?.templateId) || templates[0]} 
                        onComplete={() => {
                          setSelectedAuditId(null);
                          refreshAudits();
                        }} 
                      />
                    ) : (
                      <AuditRunner 
                        auditId={selectedAuditId} 
                        template={templates.find(t => t.id === audits.find(a => a.id === selectedAuditId)?.templateId) || templates[0]} 
                        onComplete={() => {
                          setSelectedAuditId(null);
                          refreshAudits();
                        }} 
                      />
                    )
                  )}
                </div>
            )}
          </div>
        )}

        {activeTab === 'trail' && <AuditTrail audits={audits} />}
        {activeTab === 'compliance' && <ComplianceHub />}
        {activeTab === 'vault' && <SystemVault />}
        {activeTab === 'analytics' && <PredictiveAnalytics />}
        {activeTab === 'governance' && <GovernancePortal />}
        {activeTab === 'users' && <CertificationsHub />}
        {activeTab === 'remediation_workflow' && <RemediationTaskBoard />}
        {activeTab === 'forensics' && <ForensicView />}
        {activeTab === 'entities' && <OrganizationHierarchy />}
        {activeTab === 'policy_library' && <PolicyLibrary />}
        {activeTab === 'integrity_diagnostics' && <IntegrityDiagnostics />}
        {activeTab === 'network_topology' && <NetworkNodeTopology />}
        {activeTab === 'regional_risk' && <RiskRegisterDashboard />}
        {activeTab === 'discovery_center' && <DiscoveryCenter />}
        {activeTab === 'ai_agents' && <AIAgentConfiguration />}
        {activeTab === 'ledger_browser' && <ImmutableLedgerBrowser />}
        {activeTab === 'integrations' && <IntegrationsMarketplace />}
        {activeTab === 'certification_scorecard' && <CertificationScorecard />}
        {activeTab === 'access_control' && <AccessControlManagement />}
        {activeTab === 'stakeholder_reporting' && <StakeholderReporting />}
        {activeTab === 'chaos_lab' && <ChaosLab />}
        {activeTab === 'financial_dashboard' && <FinancialDashboard />}
        {activeTab === 'capability_center' && <CapabilityCenter onNavigate={setActiveTab} />}
        {activeTab === 'billing' && <UsageBillingDashboard />}
        {activeTab === 'quota' && <QuotaDashboard />}
        {activeTab === 'smart_form' && <SmartFormLab />}
        {activeTab === 'policy_center' && <PolicyManagementCenter />}
        {activeTab === 'asset_tagging' && <AssetClassification />}
        {activeTab === 'collaboration' && <TeamCollaboration />}
        {activeTab === 'action_center' && <AuditActionCenter />}
        {activeTab === 'badge_center' && <VerifiedBadgeCenter />}
        {activeTab === 'control_library' && <ControlLibrary />}
        {activeTab === 'rag_knowledge' && <RAGKnowledgeBase />}
        {activeTab === 'report_builder' && <ReportBuilder />}
        {activeTab === 'data_mapping' && <DataMappingExplorer />}
                {activeTab === 'subsidiary_detail' && <SubsidiaryDetail />}
        {activeTab === 'ai_analytics' && <AIAnalyticsHub />}
        {activeTab === 'api_security' && <APISecurity />}
        {activeTab === 'batch_center' && <BatchCenter />}
        {activeTab === 'identity_setup' && <IdentityProviderSetup />}
        {activeTab === 'innovation_lab' && <InnovationLab />}
        {activeTab === 'incidents' && <IncidentWorkspace />}
        {activeTab === 'regulator' && <RegulatorPortal />}
        {activeTab === 'security_log' && <SecurityAuditLog />}
        {activeTab === 'sovereignty' && <SovereigntyMonitor />}
        {activeTab === 'maintenance' && <MaintenanceUpgrades />}
        {activeTab === 'help' && <SystemHelp />}
      </Suspense>
    </AuditMasterLayout>
  );
};
