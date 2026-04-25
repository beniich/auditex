import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  FileDown, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Box, 
  Cpu, 
  Fingerprint, 
  Lock, 
  Brain,
  Terminal,
  Zap,
  Globe
} from 'lucide-react';
import { Audit, AuditTemplate } from '../../types';
import { computeGlobalKPIs } from '../../lib/kpiEngine';
import { RiskHeatmap } from '../risk/RiskHeatmap';
import { exportDashboardToPDF } from '../../lib/pdfExport';
import { InfrastructureService } from '../../services/InfrastructureService';
import { IncidentService } from '../../services/IncidentService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from './PageWrapper';
import { SectionCard } from './SectionCard';
import { Button } from './ActionButtons';
import { StatusBadge } from './StatusBadge';

const StatCardPremium = ({ title, value, detail, icon: Icon, color, trend, velocityLabel, variant }: any) => (
  <SectionCard padding="large" className="hover:scale-[1.02] transition-all">
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-2xl shadow-xl transition-all`}>
         <StatusBadge label="" variant={variant} icon={Icon} className="p-3" />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">{title}</span>
        <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter leading-none italic">{value}</h3>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
         <span className={`text-[10px] font-black ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
            {Math.abs(trend)}% {velocityLabel}
         </span>
         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{detail}</span>
      </div>
      <div className="flex items-end gap-1.5 h-8">
         {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <motion.div 
               key={i} 
               initial={{ height: 0 }} 
               animate={{ height: `${h}%` }} 
               className={`w-1 rounded-full ${trend >= 0 ? 'bg-emerald-500' : 'bg-red-500'} opacity-30`} 
            />
         ))}
      </div>
    </div>
  </SectionCard>
);

export const Dashboard = ({ audits, templates, onNavigate }: { audits: Audit[], templates: AuditTemplate[], onNavigate: (tab: string) => void }) => {
  const { t } = useTranslation('dashboard');
  const [isExporting, setIsExporting] = useState(false);

  const { data: nodes = [] } = useQuery({
    queryKey: ['infra-nodes'],
    queryFn: () => InfrastructureService.getNodes(),
  });

  const { data: incidents = [] } = useApiQuery(
    ['incidents-summary'],
    () => IncidentService.getIncidents()
  );

  const complianceKpi = computeGlobalKPIs(audits, templates).find(k => k.title.includes('Conformité'))?.value || '0%';
  const complianceValue = parseInt(complianceKpi.toString()) || 0;
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;

  return (
    <PageWrapper id="dashboard-content">
      {/* Command Center Hero */}
      <div className="grid grid-cols-12 gap-8 mb-12">
         <div className="col-span-12 lg:col-span-8">
            <SectionCard variant="dark" padding="none" className="h-full relative overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
               <div className="p-12 lg:p-16 relative z-10">
                  <div className="flex flex-wrap items-center gap-4 mb-10">
                     <StatusBadge label={t('command_center.status_crypto')} variant="brand" icon={Lock} className="bg-blue-600 border-blue-500 text-white px-5 py-2" />
                     <StatusBadge label="Auditax OS v5.4" variant="info" icon={Activity} className="bg-white/5 border-white/10 text-blue-400 py-2" />
                     <StatusBadge label={t('command_center.status_biometric')} variant="success" icon={Fingerprint} className="bg-white/5 border-white/10 text-emerald-400 py-2 ml-auto" />
                  </div>
                  
                  <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8 italic">{t('command_center.title')}</h2>
                  <p className="text-slate-400 max-w-2xl text-lg font-bold leading-relaxed uppercase tracking-tight opacity-90">
                     {t('command_center.subtitle')}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-12">
                     <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={async () => {
                           setIsExporting(true);
                           await exportDashboardToPDF('dashboard-content');
                           setIsExporting(false);
                        }}
                        icon={FileDown}
                        className="px-12 shadow-blue-500/20"
                     >
                        {isExporting ? t('command_center.generating') : t('command_center.export')}
                     </Button>
                     <Button 
                        variant="secondary" 
                        size="lg" 
                        icon={Plus}
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-12"
                     >
                        {t('command_center.deploy')}
                     </Button>
                  </div>
               </div>
            </SectionCard>
         </div>

         <div className="col-span-12 lg:col-span-4">
            <SectionCard padding="none" className="h-full bg-slate-900 border-white/5 relative overflow-hidden group">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Nexus AI Integration</h3>
                   <StatusBadge label="Engine v5.2" variant="info" className="scale-75" />
                </div>
                <div className="p-8 space-y-8">
                   <div 
                     onClick={() => onNavigate('smart_form')}
                     className="bg-blue-600 border border-blue-500 p-8 rounded-[3rem] group/nexus hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden shadow-2xl"
                   >
                      <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover/nexus:rotate-12 transition-transform">
                         <Brain size={120} className="text-white" />
                      </div>
                      <div className="flex flex-col gap-6 relative z-10">
                         <div className="w-16 h-16 bg-white text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                            <Zap size={32} />
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter italic mb-2">Nexus AI Hub</h4>
                            <p className="text-[10px] text-blue-100 uppercase font-black tracking-widest leading-relaxed opacity-80">
                               Deploy autonomous agentic workflows & immutable report notarization.
                            </p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">{t('nodes.title')}</h4>
                      {nodes?.slice(0, 2).map((node: any, i: number) => (
                         <div key={i} className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/node">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover/node:scale-110 transition-transform">
                               <Globe size={24} />
                            </div>
                            <div className="flex-1">
                               <p className="text-xs font-black text-white uppercase tracking-tight truncate">{node.name}</p>
                               <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">STATUS: {node.status}</p>
                            </div>
                            <StatusBadge label={t('nodes.online')} variant="success" className="scale-75" />
                         </div>
                      ))}
                   </div>
                </div>
                <div className="p-8 pt-0">
                  <Button variant="ghost" className="w-full text-slate-500 hover:text-white border-white/5 bg-white/5 uppercase tracking-[0.2em] text-[9px] py-4">{t('nodes.view_all')}</Button>
                </div>
            </SectionCard>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
         <StatCardPremium 
            title={t('stats.compliance_index')} value={`${complianceValue}%`} detail={t('stats.institutional_alignment')} 
            icon={ShieldCheck} variant="success" trend={2.1} velocityLabel={t('stats.velocity')}
         />
         <StatCardPremium 
            title={t('stats.critical_risk')} value={criticalIncidents} detail={t('stats.unresolved_deviations')} 
            icon={AlertTriangle} variant="danger" trend={-14} velocityLabel={t('stats.velocity')}
         />
         <StatCardPremium 
            title={t('stats.operational_roi')} value="$24.2k" detail={t('stats.projected_savings')} 
            icon={TrendingUp} variant="brand" trend={8.4} velocityLabel={t('stats.velocity')}
         />
         <StatCardPremium 
            title={t('stats.ai_efficiency')} value="99.2%" detail={t('stats.model_consistency')} 
            icon={Cpu} variant="info" trend={0.5} velocityLabel={t('stats.velocity')}
         />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-12 gap-8 mb-12">
         <div className="col-span-12 lg:col-span-8">
            <SectionCard title="Risk Spatial Topology" subtitle="Infrastructural landscape mapped by risk density" padding="none">
               <div className="p-6">
                  <div className="h-[550px] relative rounded-[3rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-50/50">
                     <RiskHeatmap />
                  </div>
               </div>
            </SectionCard>
         </div>

         <div className="col-span-12 lg:col-span-4">
            <SectionCard title={t('stream.title')} subtitle="Live forensic telemetry stream" className="h-full flex flex-col">
               <div className="flex-1 space-y-6 mt-6">
                  {[
                     { id: 1, title: 'Invoice Discrepancy #4502', time: '2m', variant: 'danger' as const },
                     { id: 2, title: 'Access Violation US-EAST', time: '15m', variant: 'warning' as const },
                     { id: 3, title: 'Node Sync DE-2 Complete', time: '22m', variant: 'success' as const },
                     { id: 4, title: 'RAG Context Refresh', time: '41m', variant: 'info' as const },
                   ].map((log, i) => (
                     <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center gap-2">
                           <div className={`w-2.5 h-2.5 rounded-full shadow-lg shadow-current ${
                              log.variant === 'danger' ? 'bg-red-500' : 
                              log.variant === 'warning' ? 'bg-amber-500' : 
                              log.variant === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                           }`} />
                           <div className="w-px h-full bg-slate-100" />
                        </div>
                        <div className="flex-1 pb-8 group-last:pb-0">
                           <div className="flex justify-between items-start mb-2">
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none italic">{log.title}</p>
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{log.time}</span>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest cursor-default">{t('stream.event_logged')}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <Button variant="primary" className="w-full py-4 mt-10 bg-slate-900 shadow-slate-900/20" icon={Terminal}>
                  {t('stream.audit_logs')}
               </Button>
            </SectionCard>
         </div>
      </div>

      {/* Footer Info */}
      <SectionCard padding="medium" className="bg-slate-900 border-white/5 text-slate-500">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/40" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">System_Master: Operational</span>
               </div>
               <div className="h-4 w-px bg-white/10 hidden md:block" />
               <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] flex items-center gap-2"><Cpu size={14}/> Core Latency: 12ms</span>
            </div>
            <div className="flex items-center gap-3">
               <StatusBadge label={`Operator: ${new Date().toLocaleTimeString()}`} variant="info" className="bg-white/5 border-white/10 text-blue-400" />
            </div>
         </div>
      </SectionCard>
    </PageWrapper>
  );
};
