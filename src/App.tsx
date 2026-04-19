/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuditMasterLayout } from './components/AuditMasterLayout';
import { Dashboard } from './components/Dashboard';
import { AuditRunner } from './components/AuditRunner';
import { AuditTrail } from './components/AuditTrail';
import { ComplianceHub } from './components/ComplianceHub';
import { SystemVault } from './components/SystemVault';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { GovernancePortal } from './components/GovernancePortal';
import { CertificationsHub } from './components/CertificationsHub';
import RemediationWorkflow from './components/RemediationWorkflow';
import ForensicView from './components/ForensicView';
import EntityMapper from './components/EntityMapper';
import PolicyLibrary from './components/PolicyLibrary';
import IntegrityDiagnostics from './components/IntegrityDiagnostics';
import NetworkNodeTopology from './components/NetworkNodeTopology';
import RegionalRiskDrilldown from './components/RegionalRiskDrilldown';
import StakeholderReporting from './components/StakeholderReporting';
import { NewAuditModal } from './components/NewAuditModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuditService } from './services/AuditService';
import { Audit, AuditTemplate } from './types';
import { ClipboardCheck, List, Plus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export default function App() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [audits, setAudits] = useState<Audit[]>([]);
  const [templates, setTemplates] = useState<AuditTemplate[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getToken().then(t => {
      if (t) {
        AuditService.setToken(t);
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
    <ProtectedRoute>
      <AuditMasterLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      >
        {activeTab === 'dashboard' && (
          <Dashboard audits={audits} templates={templates} />
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
                  {audits.length === 0 && Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-64 bg-slate-100/50 border border-slate-100 rounded-[2.5rem] animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-[1200px] mx-auto">
                <button 
                   onClick={() => setSelectedAuditId(null)}
                   className="mb-10 text-slate-400 hover:text-[#091426] flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm"
                >
                   ← Exit to Registry
                </button>
                {selectedAuditId && (
                  <AuditRunner 
                    auditId={selectedAuditId} 
                    template={templates.find(t => t.id === audits.find(a => a.id === selectedAuditId)?.templateId) || templates[0]} 
                    onComplete={() => {
                      setSelectedAuditId(null);
                      refreshAudits();
                    }} 
                  />
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
        {activeTab === 'remediation_workflow' && <RemediationWorkflow />}
        {activeTab === 'forensics' && <ForensicView />}
        {activeTab === 'entities' && <EntityMapper />}
        {activeTab === 'policy_library' && <PolicyLibrary />}
        {activeTab === 'integrity_diagnostics' && <IntegrityDiagnostics />}
        {activeTab === 'network_topology' && <NetworkNodeTopology />}
        {activeTab === 'regional_risk' && <RegionalRiskDrilldown />}
        {activeTab === 'stakeholder_reporting' && <StakeholderReporting />}

      </AuditMasterLayout>
    </ProtectedRoute>
  );
}
