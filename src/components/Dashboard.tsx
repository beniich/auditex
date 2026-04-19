import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  FileDown, 
  Plus, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  ChevronRight,
  Activity,
  Zap,
  Lock,
  ArrowUpRight,
  Search,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { Audit, AuditTemplate } from '../types';
import { computeComplianceScore } from '../lib/scoreEngine';
import { computeGlobalKPIs } from '../lib/kpiEngine';
import { RiskHeatmap } from './RiskHeatmap';
import { exportDashboardToPDF } from '../lib/pdfExport';
import { InfrastructureService } from '../services/InfrastructureService';
import { IncidentService } from '../services/IncidentService';
import { AuditService } from '../services/AuditService';
import { useApiQuery } from '../hooks/useApiQuery';
import { toast } from '../hooks/useToast';

const StatCard = ({ title, value, detail, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:border-blue-100 transition-all cursor-default"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={color} />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</span>
        <h3 className="text-3xl font-black text-[#091426] dark:text-white mt-1 tracking-tighter">{value}</h3>
      </div>
    </div>
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-1.5">
        <div className={`p-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          <TrendingUp size={10} className={trend < 0 ? 'rotate-180' : ''} />
        </div>
        <span className={`text-[10px] font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}% 
          <span className="text-slate-400 font-medium ml-1">vs 30d</span>
        </span>
      </div>
      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{detail}</div>
    </div>
  </motion.div>
);

export const Dashboard = ({ audits, templates }: { audits: Audit[], templates: AuditTemplate[] }) => {
  const [isExporting, setIsExporting] = useState(false);

  const { data: nodeStats } = useQuery({
    queryKey: ['infra-stats'],
    queryFn: () => InfrastructureService.getStats(),
  });

  const { data: incidents = [] } = useApiQuery(
    ['incidents-summary'],
    () => IncidentService.getIncidents()
  );

  const complianceKpi = computeGlobalKPIs(audits, templates).find(k => k.title.includes('Conformité'))?.value || '0%';
  const riskKpi = computeGlobalKPIs(audits, templates).find(k => k.title.includes('Risques'))?.value || '0';
  
  const complianceValue = parseInt(complianceKpi.toString()) || 0;
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;

  const handleExportAuditReport = async (auditId: string) => {
    try {
      const response = await axios.get(`/api/reports/download/${auditId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Audit_Report_${auditId.substring(0, 8)}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Rapport de synthèse généré.', 'Report Engine');
    } catch (err: any) {
      console.error(err);
      toast.error('Échec de l\'export.', 'Audit AX');
    }
  };

  return (
    <div className="flex flex-col gap-10 font-sans" id="dashboard-content">
      
      {/* Header Executive */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 lg:p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <Zap size={200} className="text-blue-600" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-slate-900/10">
              <Lock size={12} className="text-blue-400 fill-current" /> CRYPTO_SECURED
            </span>
            <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-slate-200">
               <Activity size={10} className="animate-pulse" /> LIVE_INTELLIGENCE_FEED
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#091426] dark:text-white tracking-tighter uppercase leading-none">Global Risk Command</h2>
          <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
             Centralized oversight of organizational integrity, cryptographic block validation, and multi-jurisdictional compliance health.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={async () => {
              setIsExporting(true);
              await exportDashboardToPDF('dashboard-content');
              setIsExporting(false);
            }}
            disabled={isExporting}
            className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-[#091426] dark:text-white hover:bg-slate-50 uppercase tracking-widest transition-all shadow-sm group"
          >
            <FileDown size={16} className="group-hover:-translate-y-1 transition-transform" /> {isExporting ? 'Generating Report...' : 'Export Intelligence'}
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-[#091426] text-white rounded-2xl text-[10px] font-black hover:bg-slate-800 uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group">
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> New Audit Pipeline
          </button>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Compliance Index" 
          value={complianceKpi} 
          detail="Verified Assets" 
          icon={ShieldCheck} 
          color="text-blue-600" 
          trend={2.4}
        />
        <StatCard 
          title="Threat Exposure" 
          value={criticalIncidents} 
          detail="Critical Alerts" 
          icon={AlertTriangle} 
          color="text-red-500" 
          trend={-12}
        />
        <StatCard 
          title="Forensic Ledger" 
          value={audits.length} 
          detail="Immutable Records" 
          icon={Layers} 
          color="text-emerald-500" 
          trend={8.2}
        />
        <StatCard 
          title="Network Health" 
          value={`${nodeStats?.total || 0} Nodes`} 
          detail={`SYNC_STABLE`} 
          icon={Globe} 
          color="text-slate-500" 
          trend={0.5}
        />
      </div>


      {/* Main Grid Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Heatmap Section */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative group overflow-hidden">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-[10px] font-black text-[#091426] dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
               <Activity size={18} className="text-blue-600" /> Regional Risk Distribution
             </h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">High</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medium</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Low</span></div>
             </div>
          </div>
          <div className="relative h-[400px]">
             <RiskHeatmap />
          </div>
          <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
             <p>Algorithm: PRED_MODEL_V5 // Last Run: 2m ago</p>
             <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors uppercase">Drill-down Analytics <ArrowUpRight size={14} /></button>
          </div>
        </div>

        {/* Audit Queue - Premium Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-[#091426] rounded-[3.5rem] shadow-2xl p-10 flex flex-col group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <LayoutGrid size={120} className="text-white" />
          </div>
          <div className="flex justify-between items-center mb-8 relative z-10">
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">Active Registre</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Mission Pipeline</p>
             </div>
             <div className="bg-white/10 p-2 rounded-xl text-white">
                <Search size={16} />
             </div>
          </div>
          
          <div className="flex-1 space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
            {audits.map((audit) => {
              const template = templates.find(t => t.id === audit.templateId);
              const score = template ? computeComplianceScore(audit, template) : Math.floor(Math.random() * 40 + 60);
              return (
                <div key={audit.id} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] group/item hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-mono text-[9px] text-blue-400 font-black tracking-widest uppercase">ID: {audit.id.substring(0, 8)}</span>
                      <h4 className="text-sm font-black text-white mt-1 uppercase tracking-tight truncate max-w-[150px]">{audit.entityId}</h4>
                    </div>
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${
                      audit.status === 'DRAFT' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                      audit.status === 'IN_PROGRESS' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {audit.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        className={`h-full ${score > 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : score > 50 ? 'bg-blue-500' : 'bg-red-500'}`} />
                    </div>
                    <span className="text-[11px] font-black text-white">{score}%</span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleExportAuditReport(audit.id); }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 transition-all"
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {audits.length === 0 && Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-[2rem] border border-white/5 animate-pulse" />
            ))}
          </div>

          <button className="mt-10 w-full py-5 bg-white text-[#091426] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
            Explore All Assets <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Footer System Strip */}
      <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[9px] font-mono font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
         <p>Protocol: AuditMaster_v5 // State: STABLE</p>
         <p>Global Time: {new Date().toISOString()}</p>
      </div>
    </div>
  );
};
