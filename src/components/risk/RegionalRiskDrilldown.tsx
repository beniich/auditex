import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Plus, 
  Minus, 
  Locate, 
  ListFilter,
  Activity,
  AlertTriangle,
  Globe,
  Zap,
  MapPin,
  TrendingDown,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { InfrastructureService } from '../../services/InfrastructureService';
import { IncidentService } from '../../services/IncidentService';
import { CertificationService } from '../../services/CertificationService';
import { Skeleton } from '../common/Skeleton';

const RegionalRiskDrilldown: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('Western Europe');

  const { data: nodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => InfrastructureService.getNodes(),
    refetchInterval: 15000,
  });

  const { data: incidents = [], isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => IncidentService.getIncidents(),
    refetchInterval: 30000,
  });

  const { data: risks = [] } = useQuery({
    queryKey: ['risks-regional'],
    queryFn: () => CertificationService.getRisks(),
    refetchInterval: 30000,
  });

  const isLoading = nodesLoading || incidentsLoading;

  // Real-time calculation of regional risks
  const processedData = useMemo(() => {
    const regionMap: Record<string, { 
      name: string, 
      nodes: number, 
      riskScore: number, 
      status: 'LOW' | 'MED' | 'HIGH' | 'CRIT',
      incidents: number,
      lastEvent: string,
      lat: number,
      lng: number,
      detail: string
    }> = {};

    if (risks.length === 0) {
      regionMap['Paris, FR'] = { name: 'Paris, FR', nodes: 0, riskScore: 0, status: 'LOW', incidents: 0, lastEvent: '', lat: 55, lng: 38, detail: 'Operational Baseline' };
      regionMap['London, UK'] = { name: 'London, UK', nodes: 0, riskScore: 0, status: 'LOW', incidents: 0, lastEvent: '', lat: 35, lng: 30, detail: 'Operational Baseline' };
      regionMap['Frankfurt, DE'] = { name: 'Frankfurt, DE', nodes: 0, riskScore: 0, status: 'LOW', incidents: 0, lastEvent: '', lat: 45, lng: 48, detail: 'Operational Baseline' };
    } else {
      risks.forEach((r: any, idx: number) => {
        // Assign visual lat/lng if not present
        const lat = 25 + ((idx * 17) % 50);
        const lng = 15 + ((idx * 23) % 70);
        regionMap[r.jurisdiction] = {
          name: r.jurisdiction,
          nodes: 0,
          riskScore: r.riskScore,
          status: 'LOW',
          incidents: 0,
          lastEvent: `Assessment: ${r.category}`,
          lat,
          lng,
          detail: r.details
        };
      });
    }

    // Distribute nodes to regions
    nodes.forEach(node => {
      const regionsList = Object.keys(regionMap);
      let regionKey = regionsList[0];
      if (node.region.includes('us') && regionsList.includes('US East')) regionKey = 'US East';
      if (node.region.includes('eu') && regionsList.includes('EU West (GDPR)')) regionKey = 'EU West (GDPR)';
      
      
      const region = regionMap[regionKey];
      if (region) {
         region.nodes++;
         if (node.status === 'DEGRADED') region.riskScore += 15;
         if (node.status === 'DOWN') region.riskScore += 40;
      }
    });

    // Layer incidents over the risk
    incidents.filter(i => i.status !== 'RESOLVED').forEach(inc => {
      // Logic to assign incident to region (mocking assignments for demo purposes)
      const regions = Object.keys(regionMap);
      const regionKey = regions[Math.floor(Math.random() * regions.length)];
      const region = regionMap[regionKey];
      
      region.incidents++;
      const incWeight = inc.severity === 'CRITICAL' ? 40 : inc.severity === 'HIGH' ? 25 : 10;
      region.riskScore += incWeight;
      region.lastEvent = `${(inc as any).type}: ${inc.title}`;
      region.detail = (inc as any).description;
    });

    // Final pass for status
    return Object.values(regionMap).map(r => ({
      ...r,
      riskScore: Math.min(100, r.riskScore),
      status: r.riskScore >= 70 ? 'CRIT' : r.riskScore >= 40 ? 'HIGH' : r.riskScore >= 20 ? 'MED' : 'LOW'
    }));
  }, [nodes, incidents]);

  const totalRiskScore = useMemo(() => {
     if (processedData.length === 0) return 0;
     return Math.round(processedData.reduce((acc, r) => acc + r.riskScore, 0) / processedData.length);
  }, [processedData]);

  const recentEvents = useMemo(() => {
     return incidents.slice(0, 3).map(inc => ({
        id: inc.id,
        title: inc.title,
        status: inc.status,
        severity: inc.severity,
        time: new Date((inc as any).createdAt || inc.detectedAt).toLocaleTimeString(),
        detail: (inc as any).description
     }));
  }, [incidents]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default text-slate-900">
      <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header & Breadcrumbs */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-8">
           <div>
              <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 gap-2 mb-3">
                 <span>Global Risk Dashboard</span>
                 <ChevronRight size={14} />
                 <span className="text-blue-600">{selectedRegion} View</span>
              </nav>
              <h1 className="text-4xl font-black tracking-tight text-[#091426] uppercase">Jurisdictional Risk Drilldown</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Industrial mapping of infrastructure health and compliance drift.</p>
           </div>
           <div className="flex gap-4">
              <div className="flex bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                 <button className="px-6 py-2 text-[10px] uppercase font-black tracking-widest bg-[#091426] text-white rounded-lg shadow-lg">Map Topology</button>
                 <button className="px-6 py-2 text-[10px] uppercase font-black tracking-widest text-slate-500 hover:bg-slate-50 transition-all rounded-lg">Tabular Feed</button>
              </div>
           </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
           
           {/* Map Drilldown Section */}
           <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden relative group shadow-sm h-[640px] flex flex-col group/map">
              
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent h-20 w-full animate-scan z-20 pointer-events-none" />

              <div className="absolute top-8 left-8 z-30 flex flex-col gap-4">
                 <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-2 rounded-2xl shadow-2xl flex flex-col gap-1">
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 rounded-xl text-slate-600 transition-all"><Plus size={20} /></button>
                    <div className="h-px bg-slate-100 mx-2" />
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 rounded-xl text-slate-600 transition-all"><Minus size={20} /></button>
                 </div>
                 <button className="bg-white/95 backdrop-blur-xl border border-slate-200 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-all">
                    <Locate size={22} />
                 </button>
              </div>

              {/* Status HUD */}
              <div className="absolute bottom-8 right-8 z-30 bg-[#091426]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl min-w-[320px]">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 text-center border-b border-white/5 pb-3">Perimeter Threat Spectrum</p>
                 <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                       <span className="text-[10px] font-black text-white uppercase tracking-tighter tracking-widest whitespace-nowrap">Nominal Range</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse" />
                       <span className="text-[10px] font-black text-white uppercase tracking-tighter tracking-widest whitespace-nowrap">Critical breach</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                       <span className="text-[10px] font-black text-white uppercase tracking-tighter tracking-widest whitespace-nowrap">Elevated risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                       <span className="text-[10px] font-black text-white uppercase tracking-tighter tracking-widest whitespace-nowrap">Offline node</span>
                    </div>
                 </div>
              </div>

              {/* Map Canvas */}
              <div className="flex-1 bg-[#0a192f] relative overflow-hidden flex items-center justify-center p-20 cursor-grab active:cursor-grabbing" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, #1e293b 1.5px, transparent 1.5px)', 
                     backgroundSize: '40px 40px' 
                   }}>
                 <motion.div 
                    animate={{ scale: zoom }}
                    className="relative w-full h-full"
                 >
                    <img 
                       src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
                       alt="Western Europe Map" 
                       className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen scale-125"
                    />
                    
                    {/* SVG Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                       <path d="M450,250 L380,340 L200,480" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="5,5" />
                       <path d="M450,250 L300,210 L180,180" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="5,5" />
                    </svg>

                    {/* Regional Markers from dynamic data */}
                    {isLoading ? (
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="text-blue-500 animate-spin" size={48} />
                       </div>
                    ) : processedData.map((marker, i) => (
                       <motion.div 
                          key={marker.name}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="absolute group/marker z-20"
                          style={{ top: `${marker.lat}%`, left: `${marker.lng}%` }}
                       >
                          <div className="relative flex items-center justify-center">
                             {marker.status === 'CRIT' && (
                                <div className="absolute w-12 h-12 bg-red-600/30 rounded-full animate-ping" />
                             )}
                             <motion.div 
                                whileHover={{ scale: 1.5 }}
                                className={`w-5 h-5 rounded-full border-[3px] border-white shadow-2xl cursor-pointer transition-all ${
                                   marker.status === 'CRIT' ? 'bg-red-600 shadow-red-500/50' :
                                   marker.status === 'HIGH' ? 'bg-orange-500 shadow-orange-500/50' :
                                   marker.status === 'MED' ? 'bg-amber-400 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'
                                }`} 
                             />
                             
                             {/* Tooltip Industrial */}
                             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-72 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none translate-y-2 group-hover/marker:translate-y-0 z-50">
                                <div className="bg-[#091426] border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                                   <div className={`p-4 flex justify-between items-center border-b border-white/5 ${
                                      marker.status === 'CRIT' ? 'bg-red-500/10' : 'bg-white/5'
                                   }`}>
                                      <div className="flex items-center gap-2">
                                         <MapPin size={14} className="text-blue-400" />
                                         <span className="text-xs font-black text-white uppercase tracking-widest">{marker.name}</span>
                                      </div>
                                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                         marker.status === 'CRIT' ? 'bg-red-600 text-white' : 
                                         marker.status === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
                                      }`}>
                                         {Math.round(marker.riskScore)}%
                                      </span>
                                   </div>
                                   <div className="p-4 space-y-3">
                                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                                         <span>Nodes Monitored</span>
                                         <span className="text-white">{marker.nodes} ACTIVE</span>
                                      </div>
                                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                                         <span>Active Incidents</span>
                                         <span className="text-red-400">{marker.incidents} THREATS</span>
                                      </div>
                                      <div className="pt-2">
                                         <p className="text-[10px] font-medium text-slate-300 italic">" {marker.lastEvent || marker.detail} "</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                 </motion.div>
              </div>
           </div>

           {/* Side Intelligence Panel */}
           <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              
              {/* Metrics Card - High Contrast */}
              <div className="bg-[#091426] text-white border border-slate-800 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group/card">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:rotate-12 transition-transform duration-1000">
                    <Shield size={120} />
                 </div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8 border-l-2 border-blue-600 pl-4">Global Perimeter Health</h3>
                 <div className="space-y-10 relative z-10">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Aggregated Risk Index</p>
                          <p className="text-6xl font-black tracking-tighter text-white">
                             {isLoading ? '...' : totalRiskScore} 
                             <span className="text-xl text-slate-500 font-medium ml-2">/ 100</span>
                          </p>
                       </div>
                       <motion.div 
                          animate={{ rotate: totalRiskScore * 3.6 }}
                          className="w-24 h-24 rounded-full border-[8px] border-slate-800 flex items-center justify-center relative overflow-hidden"
                       >
                          <div className="absolute inset-0 border-[8px] border-blue-600 border-t-transparent border-r-transparent rounded-full opacity-50" />
                          <span className={`text-base font-black ${totalRiskScore > 70 ? 'text-red-500' : 'text-blue-500'}`}>{totalRiskScore}%</span>
                       </motion.div>
                    </div>
                    
                    <div className="h-0.5 bg-gradient-to-r from-blue-600/50 to-transparent" />
                    
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                             <TrendingUp size={12} className="text-emerald-500" /> Availability
                          </p>
                          <p className="text-3xl font-black text-emerald-400 tabular-nums">99.98%</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                             <TrendingDown size={12} className="text-red-500" /> Compliance
                          </p>
                          <p className="text-3xl font-black text-red-500 tabular-nums">{100 - totalRiskScore}%</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Regional Breakdown - Modern Table */}
              <div className="bg-white border border-slate-200 rounded-[2rem] flex flex-col flex-1 shadow-sm overflow-hidden h-full max-h-[360px]">
                 <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                       <ListFilter size={16} className="text-blue-600" /> Entity Distribution
                    </h3>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 </div>
                 <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left">
                       <thead className="bg-white border-b border-slate-50 sticky top-0 z-10">
                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <th className="px-8 py-4">Jurisdiction</th>
                             <th className="px-8 py-4">Fleet</th>
                             <th className="px-8 py-4 text-right">Risk Factor</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 font-mono text-xs">
                          {processedData.map(region => (
                             <tr key={region.name} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                <td className="px-8 py-5">
                                   <p className="font-black text-[#091426] uppercase tracking-tight group-hover:text-blue-600 transition-colors">{region.name}</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Primary Cluster Active</p>
                                </td>
                                <td className="px-8 py-5 text-slate-600 font-bold">{String(region.nodes).padStart(2, '0')} Nodes</td>
                                <td className="px-8 py-5 text-right">
                                   <span className={`inline-flex items-center px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
                                      region.status === 'LOW' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                      region.status === 'MED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                      'bg-red-50 text-red-700 border-red-100'
                                   }`}>
                                      {Math.round(region.riskScore)}% - {region.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                          {isLoading && Array.from({ length: 5 }).map((_, i) => (
                             <tr key={i}><td colSpan={3} className="px-8 py-5"><Skeleton className="h-4 w-full" /></td></tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

           </div>

           {/* Bottom Insight Panel - Timeline */}
           <div className="col-span-12 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm group/feed">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                       <Activity size={20} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Global Threat Intelligence Feed</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Live Cryptographic Audit Trail</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-[#091426] px-4 py-2 rounded-xl text-white">
                    <Zap size={14} className="text-blue-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">Real-time Stream Active</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                 <AnimatePresence>
                    {recentEvents.map((event, i) => (
                       <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className="relative p-6 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all group/event hover:shadow-xl"
                       >
                          <div className="flex justify-between items-start mb-4">
                             <div className={`p-2 rounded-lg ${
                                event.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                                event.severity === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
                             }`}>
                                <AlertTriangle size={16} />
                             </div>
                             <span className="text-[10px] font-mono font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-200">{event.time}</span>
                          </div>
                          <h5 className="text-xs font-black text-[#091426] uppercase tracking-tight mb-2 group-hover/event:text-blue-600 transition-colors">{event.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-4 font-medium italic">"{event.detail}"</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                             <span className="text-[9px] font-mono font-black text-slate-300">TRK-{event.id.substring(0, 6)}</span>
                             <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                event.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                             }`}>{event.status}</span>
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-50 flex justify-center">
                 <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-4 transition-all">
                    Access Ledger History <ChevronRight size={14} />
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default RegionalRiskDrilldown;
