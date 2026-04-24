import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
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
  MousePointer2 
} from 'lucide-react';
import { Audit, AuditTemplate } from '../../types';
import { computeGlobalKPIs } from '../../lib/kpiEngine';
import { RiskHeatmap } from '../risk/RiskHeatmap';
import { exportDashboardToPDF } from '../../lib/pdfExport';
import { InfrastructureService } from '../../services/InfrastructureService';
import { IncidentService } from '../../services/IncidentService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { GlassCard } from './GlassCard';
import { useTranslation } from 'react-i18next';

const StatCardPremium = ({ title, value, detail, icon: Icon, color, trend, velocityLabel }: any) => (
  <GlassCard 
    className="p-8 border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl relative overflow-hidden group hover:scale-[1.02] transition-all"
  >
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={80} className={color} />
    </div>
    <div className="flex justify-between items-start mb-8">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center border border-white/10 shadow-xl`}>
        <Icon size={28} className={color} />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-mono">{title}</span>
        <h3 className="text-4xl font-black text-[#091426] dark:text-white mt-2 tracking-tighter leading-none italic">{value}</h3>
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
      <div className="flex items-end gap-1 h-8">
         {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <motion.div 
               key={i} 
               initial={{ height: 0 }} animate={{ height: `${h}%` }} 
               className={`w-1 rounded-full ${trend >= 0 ? 'bg-emerald-500' : 'bg-red-500/50'} opacity-40`} 
            />
         ))}
      </div>
    </div>
  </GlassCard>
);

export const Dashboard = ({ audits, templates }: { audits: Audit[], templates: AuditTemplate[] }) => {
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
    <div className="flex flex-col gap-10 max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000" id="dashboard-content">
      
      {/* Command Center Header */}
      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-12 lg:col-span-8">
            <GlassCard className="p-12 border-white/5 bg-[#091426]/90 relative overflow-hidden h-full flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                  <div className="w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] animate-pulse" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                     <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 shadow-2xl shadow-blue-500/20">
                        <Lock size={12} className="text-white" /> {t('command_center.status_crypto')}
                     </span>
                     <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-400/20 px-4 py-1.5 rounded-xl backdrop-blur-md">
                        <Activity size={12} className="animate-pulse" /> AUDITAX_OS_v5.4
                     </span>
                     <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-400/20 px-4 py-1.5 rounded-xl backdrop-blur-md ml-auto">
                        <Fingerprint size={12} /> {t('command_center.status_biometric')}
                     </span>
                  </div>
                  <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-6 italic">{t('command_center.title')}</h2>
                  <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed opacity-80 uppercase tracking-tight">
                     {t('command_center.subtitle')}
                  </p>
                  
                  <div className="flex gap-4 mt-12">
                     <button 
                        onClick={async () => {
                           setIsExporting(true);
                           await exportDashboardToPDF('dashboard-content');
                           setIsExporting(false);
                        }}
                        className="px-10 py-5 bg-white text-[#091426] rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                     >
                        <FileDown size={18} /> {isExporting ? t('command_center.generating') : t('command_center.export')}
                     </button>
                     <button className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" /> {t('command_center.deploy')}
                     </button>
                  </div>
               </div>
            </GlassCard>
         </div>

         <div className="col-span-12 lg:col-span-4">
            <GlassCard className="p-0 border-white/5 bg-slate-900 overflow-hidden h-full relative group">
               <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.25em]">{t('nodes.title')}</h3>
                  <div className="p-2 bg-red-500 rounded-lg animate-pulse" />
               </div>
               <div className="p-8 space-y-6">
                  {nodes?.slice(0, 3).map((node, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                           <Box size={24} />
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-black text-white uppercase truncate">{node.name}</p>
                           <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">STATUS: {node.status}</p>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase">{t('nodes.online')}</span>
                     </div>
                  ))}
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                  <button className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">{t('nodes.view_all')}</button>
               </div>
            </GlassCard>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCardPremium 
            title={t('stats.compliance_index')} value={`${complianceValue}%`} detail={t('stats.institutional_alignment')} 
            icon={ShieldCheck} color="text-emerald-500" trend={2.1} velocityLabel={t('stats.velocity')}
         />
         <StatCardPremium 
            title={t('stats.critical_risk')} value={criticalIncidents} detail={t('stats.unresolved_deviations')} 
            icon={AlertTriangle} color="text-red-500" trend={-14} velocityLabel={t('stats.velocity')}
         />
         <StatCardPremium 
            title={t('stats.operational_roi')} value="$24.2k" detail={t('stats.projected_savings')} 
            icon={TrendingUp} color="text-blue-500" trend={8.4} velocityLabel={t('stats.velocity')}
         />
         <StatCardPremium 
            title={t('stats.ai_efficiency')} value="99.2%" detail={t('stats.model_consistency')} 
            icon={Cpu} color="text-indigo-500" trend={0.5} velocityLabel={t('stats.velocity')}
         />
      </div>

      {/* Stream */}
      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-12 lg:col-span-8">
            <GlassCard className="p-10 border-white/5 h-full">
               <div className="flex justify-between items-center mb-10">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Infrastructural Landscape</span>
                     <h3 className="text-2xl font-black text-[#091426] dark:text-white uppercase tracking-tighter italic">Risk Spatial Topology</h3>
                  </div>
               </div>
               <div className="h-[550px] relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                  <RiskHeatmap />
               </div>
            </GlassCard>
         </div>

         <div className="col-span-12 lg:col-span-4">
            <GlassCard className="p-8 border-white/5 h-full flex flex-col bg-slate-50/50">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.25em] flex items-center gap-3">
                     <Activity size={18} className="text-blue-600" /> {t('stream.title')}
                  </h3>
                  <button className="p-2 hover:rotate-180 transition-transform duration-700"><RefreshCw size={14} className="text-slate-400" /></button>
               </div>
               <div className="flex-1 space-y-6">
                  {[
                     { id: 1, title: 'Invoice Discrepancy #4502', time: '2m', color: 'bg-red-500' },
                     { id: 2, title: 'Access Violation US-EAST', time: '15m', color: 'bg-amber-500' },
                     { id: 3, title: 'Node Sync Complete DE-2', time: '22m', color: 'bg-emerald-500' },
                     { id: 4, title: 'RAG Context Refresh', time: '41m', color: 'bg-blue-500' },
                   ].map((log, i) => (
                     <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${log.color} shadow-lg shadow-current`} />
                           <div className="w-px h-full bg-slate-200" />
                        </div>
                        <div className="flex-1 pb-6 group-last:pb-0">
                           <div className="flex justify-between items-start mb-1">
                              <p className="text-xs font-black text-[#091426] uppercase tracking-tight leading-none">{log.title}</p>
                              <span className="text-[9px] font-bold text-slate-300 uppercase">{log.time}</span>
                           </div>
                           <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">{t('stream.event_logged')}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all">{t('stream.audit_logs')}</button>
            </GlassCard>
         </div>
      </div>

      <GlassCard className="p-6 border-white/5 bg-[#091426] text-white/40 flex justify-between items-center overflow-hidden">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-mono uppercase tracking-[0.4em]">SYSTEM_MASTER: STABLE</span>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.4em]">LATENCY: 12ms</span>
         </div>
         <div className="flex items-center gap-2">
            <MousePointer2 size={12} />
            <span className="text-[9px] font-mono uppercase tracking-[0.4em]">OPERATOR: {new Date().toLocaleTimeString()}</span>
         </div>
      </GlassCard>
    </div>
  );
};
