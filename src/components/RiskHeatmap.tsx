import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, AlertTriangle, TrendingUp, ShieldCheck, Shield, Activity, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { InfrastructureService } from '../services/InfrastructureService';
import { IncidentService } from '../services/IncidentService';
import { Skeleton } from './Skeleton';

// Map jurisdictions to approximate map positions (% left, % top)
const jurisdictionPositions: Record<string, { left: string; top: string }> = {
  'France': { left: '47%', top: '32%' },
  'USA': { left: '22%', top: '40%' },
  'Japan': { left: '82%', top: '38%' },
  'Germany': { left: '50%', top: '30%' },
  'UK': { left: '44%', top: '28%' },
  'Brazil': { left: '32%', top: '65%' },
  'China': { left: '76%', top: '36%' },
  'Australia': { left: '80%', top: '70%' },
};

const riskToSize = (score: number) => {
  if (score >= 60) return 'w-6 h-6';
  if (score >= 30) return 'w-4 h-4';
  return 'w-3 h-3';
};

const riskToColor = (score: number) => {
  if (score >= 60) return 'bg-red-500';
  if (score >= 30) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const riskLabel = (score: number) => {
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
};

export const RiskHeatmap: React.FC = () => {
  const { data: nodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => InfrastructureService.getNodes(),
    refetchInterval: 15000,
  });

  const { data: incidents = [], isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => IncidentService.getIncidents(),
  });

  const isLoading = nodesLoading || incidentsLoading;

  // Compute derived stats
  const healthyCount = nodes.filter(n => n.status === 'HEALTHY').length;
  const integrityScore = nodes.length > 0 ? Math.round((healthyCount / nodes.length) * 100) : 100;
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL').length;
  const degradedNodes = nodes.filter(n => n.status === 'DEGRADED' || n.status === 'DOWN').length;

  // Build risk markers from nodes by region
  const regionRisks: Record<string, { riskScore: number; details: string }> = {};
  nodes.forEach(node => {
    const regionJurisdiction = node.region.includes('eu') ? 'France' : node.region.includes('us') ? 'USA' : 'Japan';
    if (!regionRisks[regionJurisdiction]) {
      regionRisks[regionJurisdiction] = { riskScore: 0, details: '' };
    }
    if (node.status === 'DEGRADED') regionRisks[regionJurisdiction].riskScore += 30;
    if (node.status === 'DOWN') regionRisks[regionJurisdiction].riskScore += 60;
    regionRisks[regionJurisdiction].details = `${node.name} - ${node.status}`;
  });

  // Add incident-based risk
  incidents.forEach(inc => {
    const score = inc.severity === 'CRITICAL' ? 90 : inc.severity === 'HIGH' ? 60 : inc.severity === 'MEDIUM' ? 30 : 10;
    // Assign to USA by default for now
    if (!regionRisks['USA']) regionRisks['USA'] = { riskScore: 0, details: '' };
    regionRisks['USA'].riskScore = Math.max(regionRisks['USA'].riskScore, score);
    regionRisks['USA'].details = inc.title;
  });

  const riskMarkers = Object.entries(regionRisks).map(([jurisdiction, risk]) => ({
    jurisdiction,
    ...risk,
    position: jurisdictionPositions[jurisdiction] || { left: '50%', top: '50%' },
  }));

  const metrics = [
    { label: 'Integrity Score', value: isLoading ? '...' : `${integrityScore}%`, icon: ShieldCheck, color: integrityScore > 80 ? 'text-emerald-500' : 'text-amber-500' },
    { label: 'Active Alerts', value: isLoading ? '...' : String(criticalIncidents), icon: AlertTriangle, color: criticalIncidents > 0 ? 'text-red-500' : 'text-slate-400' },
    { label: 'Degraded Nodes', value: isLoading ? '...' : String(degradedNodes), icon: Activity, color: degradedNodes > 0 ? 'text-amber-500' : 'text-slate-400' },
    { label: 'Sites Covered', value: isLoading ? '...' : String(nodes.length), icon: Globe, color: 'text-blue-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col group/heatmap">
      <div className="p-8 border-b border-slate-50 dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                <Globe size={18} />
             </div>
             <h3 className="text-sm font-black text-[#091426] dark:text-white uppercase tracking-[0.2em]">Global Risk Perimeter</h3>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-11">Predictive Threat Intelligence / Cluster Sync Active</p>
        </div>
        <div className="flex gap-6 pr-2">
          {[
            { label: 'CRITICAL', color: 'bg-red-500' },
            { label: 'ELEVATED', color: 'bg-amber-500' },
            { label: 'NOMINAL', color: 'bg-emerald-500' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 text-[10px] font-black text-slate-500 tracking-tighter">
              <span className={`w-2 h-2 rounded-full ${l.color} shadow-[0_0_8px_currentColor]`} /> {l.label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[420px] bg-[#091426] overflow-hidden">
        {/* Dynamic Scan Line */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-px bg-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.5)] z-20 pointer-events-none"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(99,179,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        {/* SVG Map Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07] scale-110 pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
          <path d="M80,80 L250,60 L280,180 L200,250 L120,200 Z" fill="white" />
          <path d="M180,270 L280,260 L290,420 L200,440 L150,360 Z" fill="white" />
          <path d="M400,70 L560,65 L570,180 L450,200 L390,130 Z" fill="white" />
          <path d="M420,200 L570,195 L585,390 L460,420 L400,320 Z" fill="white" />
          <path d="M570,60 L900,50 L920,280 L700,300 L560,200 Z" fill="white" />
          <path d="M720,330 L880,320 L890,430 L740,440 Z" fill="white" />
        </svg>

        {/* Risk Markers */}
        <AnimatePresence>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin" />
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Compiling Perimeter Risk...</span>
              </div>
            </div>
          ) : (
            riskMarkers.map((marker, i) => {
              const weight = marker.riskScore >= 60 ? 'CRITICAL' : marker.riskScore >= 30 ? 'ELEVATED' : 'NOMINAL';
              return (
                <motion.div
                  key={marker.jurisdiction}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2, zIndex: 100 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  style={marker.position}
                >
                  <div className={`absolute inset-[-12px] ${riskToColor(marker.riskScore)} rounded-full opacity-20 blur-xl group-hover:opacity-60 transition-opacity animate-pulse`} />
                  
                  {weight === 'CRITICAL' && (
                    <div className="absolute inset-[-10px] border border-red-500/50 rounded-full animate-ping opacity-40" />
                  )}

                  <div className={`relative ${riskToSize(marker.riskScore)} ${riskToColor(marker.riskScore)} rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all`}>
                     {weight === 'CRITICAL' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                  </div>

                  {/* Enhanced Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-[#091426] border border-white/10 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-2xl scale-95 group-hover:scale-100 min-w-[200px]">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{marker.jurisdiction} Entity</span>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black ${
                           weight === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : weight === 'ELEVATED' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                           {weight}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Aggregated Risk</span>
                           <span className="text-sm font-black text-white font-mono">{Math.round(marker.riskScore)}%</span>
                        </div>
                        <div className="pt-1">
                           <p className="text-[9px] font-medium text-slate-400 leading-tight flex items-center gap-1.5">
                              <Zap size={10} className="text-blue-400" /> {marker.details || 'Baseline synchronization active'}
                           </p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Floating AI metrics */}
        <div className="absolute top-6 left-6 space-y-3 z-30 opacity-60 group-hover/heatmap:opacity-100 transition-opacity">
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Neural Cluster: Alpha Active</span>
           </div>
        </div>

        {/* Bottom metrics grid - Enhanced */}
        <div className="absolute bottom-6 left-8 right-8 grid grid-cols-4 gap-6 z-30">
          {metrics.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl group/metric hover:bg-black/60 transition-all hover:border-white/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-white/5 ${m.color} group-hover/metric:scale-110 transition-transform`}>
                  <m.icon size={14} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">{m.label}</p>
                   <p className="text-lg font-black text-white tracking-tighter leading-none">{m.value}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '100%' }} 
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full opacity-50 ${m.color.replace('text', 'bg')}`}
                 />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
