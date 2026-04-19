import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, AlertCircle as ErrorIcon, Cpu, RefreshCw,
  Plus, Minus, Locate, AlertTriangle, ListFilter, Info,
  Server, Database, Shield, Layers, Activity, CheckCircle2, XCircle
} from 'lucide-react';
import { InfrastructureService, NetworkNode, NodeStats } from '../services/InfrastructureService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { toast } from '../hooks/useToast';
import { SkeletonTopology, SkeletonCard } from './Skeleton';
import ForceGraph2D from 'react-force-graph-2d';

const nodeIcon = (type: string) => {
  switch (type) {
    case 'API_GATEWAY': return <Globe size={28} className="text-blue-600" />;
    case 'DATABASE': return <Database size={22} className="text-purple-500" />;
    case 'FIREWALL': return <Shield size={22} className="text-red-500" />;
    case 'KUBERNETES_CLUSTER': return <Layers size={22} className="text-emerald-500" />;
    default: return <Server size={22} className="text-slate-500" />;
  }
};

const NetworkNodeTopology: React.FC = () => {
  useLiveUpdates();
  const queryClient = useQueryClient();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newNodeForm, setNewNodeForm] = useState(false);
  const fgRef = useRef<any>();

  const { data: nodes = [], isLoading: loadingNodes } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => InfrastructureService.getNodes(),
    refetchInterval: 10000,
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => InfrastructureService.getStats(),
    refetchInterval: 10000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ nodeId, status }: { nodeId: string; status: string }) =>
      InfrastructureService.updateNodeStatus(nodeId, status),
    onSuccess: (node) => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success(`Node "${node.name}" status updated to ${node.status}`, 'Infrastructure');
    },
    onError: () => toast.error('Failed to update node status', 'Error'),
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || (nodes.length > 0 ? nodes[0] : null);

  const graphData = useMemo(() => {
    const gNodes = nodes.map(n => ({ id: n.id, ...n, val: n.type === 'API_GATEWAY' ? 20 : 12 }));
    const links: any[] = [];
    
    // Auto-generate realistic links based on node types
    const gateways = gNodes.filter(n => n.type === 'API_GATEWAY');
    const firewalls = gNodes.filter(n => n.type === 'FIREWALL');
    const clusters = gNodes.filter(n => n.type === 'KUBERNETES_CLUSTER');
    const dbs = gNodes.filter(n => n.type === 'DATABASE');
    const vms = gNodes.filter(n => n.type === 'VIRTUAL_MACHINE');

    // Flow: Gateway -> Firewall -> Clusters -> (DBs & VMs)
    gateways.forEach(g => {
      if (firewalls.length > 0) {
        firewalls.forEach(f => links.push({ source: g.id, target: f.id, type: 'traffic' }));
      } else {
        clusters.forEach(c => links.push({ source: g.id, target: c.id, type: 'traffic' }));
      }
    });

    firewalls.forEach(f => {
      clusters.forEach(c => links.push({ source: f.id, target: c.id, type: 'traffic' }));
    });

    clusters.forEach(c => {
      dbs.forEach(d => links.push({ source: c.id, target: d.id, type: 'data' }));
      vms.forEach(v => {
        if (Math.random() > 0.3) links.push({ source: c.id, target: v.id, type: 'compute' });
      });
    });
    
    // Fallback if no specific flow exists
    if (links.length === 0 && gNodes.length > 1) {
      for (let i = 1; i < gNodes.length; i++) {
        links.push({ source: gNodes[0].id, target: gNodes[i].id, type: 'basic' });
      }
    }

    return { nodes: gNodes, links };
  }, [nodes]);

  const statCards = [
    { label: 'Total Active Nodes', value: stats?.total ?? '—', badge: 'Online', color: 'emerald' },
    { label: 'Healthy', value: stats?.healthy ?? '—', badge: 'Stable', color: 'emerald' },
    { label: 'Degraded', value: stats?.degraded ?? '—', badge: 'Warning', color: 'amber' },
    { label: 'Down / Offline', value: stats?.down ?? '—', badge: 'Critical', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={12} className="text-emerald-400" /> Live Topology Feed
              </span>
              <span className={`text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 ${(stats?.degraded ?? 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {(stats?.degraded ?? 0) > 0 ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                {(stats?.degraded ?? 0) > 0 ? `${stats?.degraded} NODE(S) DEGRADED` : 'ALL SYSTEMS NOMINAL'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Network Infrastructure</h1>
            <p className="text-slate-500 max-w-2xl mt-3 text-sm leading-relaxed font-medium">
              Real-time interactive force-graph of all managed nodes. Traffic flows simulated in real-time.
            </p>
          </div>
          <button
            onClick={() => setNewNodeForm(v => !v)}
            className="flex items-center gap-2 px-6 py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all"
          >
            <Plus size={14} /> Register Node
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{card.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black tracking-tighter ${
                    card.color === 'emerald' ? 'text-slate-900' : card.color === 'amber' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {String(card.value).padStart(2, '0')}
                  </span>
                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    card.color === 'emerald' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                    card.color === 'amber' ? 'text-amber-700 bg-amber-50 border-amber-100' :
                    'text-red-700 bg-red-50 border-red-100'
                  }`}>{card.badge}</span>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Topology Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[740px] relative shadow-2xl">
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20 z-10">
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /><span className="text-xs font-bold uppercase tracking-widest opacity-80">Healthy</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" /><span className="text-xs font-bold uppercase tracking-widest opacity-80">Degraded</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" /><span className="text-xs font-bold uppercase tracking-widest opacity-80">Down</span></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
              <Activity size={12} className="text-blue-500 animate-pulse" /> Force-Directed Layout • {nodes.length} Nodes
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-slate-950"
            style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}>

            {loadingNodes ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <SkeletonTopology />
              </div>
            ) : (
                <div className="absolute inset-0 z-0">
                  <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    nodeRelSize={8}
                    linkColor={(link: any) => 
                      link.target.status === 'DOWN' || link.source.status === 'DOWN' ? '#ef444455' : 
                      link.target.status === 'DEGRADED' || link.source.status === 'DEGRADED' ? '#f59e0b55' :
                      '#3b82f644'
                    }
                    linkWidth={1.5}
                    linkDirectionalParticles={4}
                    linkDirectionalParticleWidth={2}
                    linkDirectionalParticleColor={(link: any) => 
                      link.target.status === 'DOWN' ? '#ef4444' : 
                      link.target.status === 'DEGRADED' ? '#f59e0b' : '#60a5fa'
                    }
                    linkDirectionalParticleSpeed={0.005}
                    nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                      const label = node.name;
                      const fontSize = 12 / globalScale;
                      
                      // Node style
                      const r = node.val;
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                      
                      // Status colors
                      ctx.fillStyle = node.status === 'HEALTHY' ? '#10b981' : 
                                      node.status === 'DEGRADED' ? '#f59e0b' : '#ef4444';
                      
                      if (node.id === selectedNodeId) {
                        ctx.strokeStyle = '#60a5fa'; // Blue outline for selected
                        ctx.lineWidth = 4 / globalScale;
                        ctx.stroke();
                        
                        // Pulse effect for selected
                        const t = Date.now() / 300;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, r + 4 + Math.sin(t)*2, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
                        ctx.fill();
                        
                        ctx.fillStyle = node.status === 'HEALTHY' ? '#10b981' : 
                                      node.status === 'DEGRADED' ? '#f59e0b' : '#ef4444';
                      }
                      
                      ctx.fill();

                      // Text shadow
                      ctx.font = `bold ${fontSize}px Sans-Serif`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      
                      ctx.fillStyle = 'rgba(0,0,0,0.8)';
                      ctx.fillText(label, node.x, node.y + r + fontSize + 2);
                      
                      // Text label
                      ctx.fillStyle = '#f8fafc';
                      ctx.fillText(label, node.x, node.y + r + fontSize + 2);

                      // Node Type Icon Initial (Simple letter for performance)
                      ctx.fillStyle = '#ffffff';
                      ctx.font = `bold ${fontSize * 1.5}px monospace`;
                      const typeChar = node.type === 'API_GATEWAY' ? 'G' : 
                                       node.type === 'DATABASE' ? 'D' : 
                                       node.type === 'FIREWALL' ? 'F' :
                                       node.type === 'KUBERNETES_CLUSTER' ? 'K' : 'V';
                      ctx.fillText(typeChar, node.x, node.y);
                    }}
                    onNodeClick={(node: any) => {
                      setSelectedNodeId(node.id);
                      if (fgRef.current) {
                        fgRef.current.centerAt(node.x, node.y, 1000);
                        fgRef.current.zoom(2, 1000);
                      }
                    }}
                    onBackgroundClick={() => {
                       setSelectedNodeId(null);
                       if (fgRef.current) {
                         fgRef.current.zoomToFit(1000);
                       }
                    }}
                  />
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
              <button 
                onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.2, 400)}
                className="w-10 h-10 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
               ><Plus size={18} /></button>
              <button 
                onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.2, 400)}
                className="w-10 h-10 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              ><Minus size={18} /></button>
              <button
                onClick={() => { fgRef.current?.zoomToFit(400); }}
                className="w-10 h-10 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors mt-2"
              ><Locate size={18} /></button>
              <button
                onClick={() => { queryClient.invalidateQueries({ queryKey: ['nodes'] }); queryClient.invalidateQueries({ queryKey: ['stats'] }); }}
                className="w-10 h-10 bg-blue-600/20 backdrop-blur border border-blue-500/30 text-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-600/40 transition-colors mt-2"
              ><RefreshCw size={18} /></button>
            </div>

            {/* Inspector Panel */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 right-6 w-80 bg-[#091426]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 z-30 text-white"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black uppercase tracking-tight text-blue-400">Node Inspector</h3>
                  <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white"><XCircle size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="p-2 bg-white/10 rounded-lg">
                       {nodeIcon(selectedNode.type)}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase">{selectedNode.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{selectedNode.type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="p-3 border border-white/10 bg-white/5 rounded-xl">
                      <p className="text-slate-400 uppercase font-bold mb-1">Region</p>
                      <p className="font-black text-white font-mono">{selectedNode.region}</p>
                    </div>
                    <div className="p-3 border border-white/10 bg-white/5 rounded-xl">
                      <p className="text-slate-400 uppercase font-bold mb-1">IP Address</p>
                      <p className="font-black text-white font-mono">{selectedNode.ipAddress || '10.0.X.X'}</p>
                    </div>
                    <div className="p-3 border border-white/10 bg-white/5 rounded-xl col-span-2">
                      <p className="text-slate-400 uppercase font-bold mb-1">Last Heartbeat</p>
                      <p className="font-black text-white font-mono">{selectedNode.lastSync ? new Date(selectedNode.lastSync).toLocaleString() : 'Never'}</p>
                    </div>
                  </div>
                  <div className="p-3 border border-white/10 bg-white/5 rounded-xl">
                    <p className="text-slate-400 uppercase font-bold text-[10px] mb-2">Status Override</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['HEALTHY', 'DEGRADED', 'DOWN'] as const).map(s => (
                        <button
                          key={s}
                          disabled={updateStatusMutation.isPending}
                          onClick={() => updateStatusMutation.mutate({ nodeId: selectedNode.id, status: s })}
                          className={`py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                            selectedNode.status === s
                              ? s === 'HEALTHY' ? 'bg-emerald-500 text-white border-emerald-400' :
                                s === 'DEGRADED' ? 'bg-amber-500 text-white border-amber-400' :
                                'bg-red-500 text-white border-red-400'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Node List Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
              <Server size={16} className="text-blue-600" /> All Nodes Registry
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{nodes.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Node Name</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Region</th>
                  <th className="px-8 py-4">IP</th>
                  <th className="px-8 py-4">Last Sync</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {nodes.map(node => (
                  <tr key={node.id} onClick={() => setSelectedNodeId(node.id)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedNode?.id === node.id ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        {nodeIcon(node.type)}
                        <span className="text-sm font-bold text-[#091426]">{node.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-mono text-[10px] text-slate-500">{node.type}</td>
                    <td className="px-8 py-4 font-mono text-[10px] text-slate-500">{node.region}</td>
                    <td className="px-8 py-4 font-mono text-[10px] text-slate-400">{node.ipAddress || '—'}</td>
                    <td className="px-8 py-4 font-mono text-[10px] text-slate-400">
                      {node.lastSync ? new Date(node.lastSync).toLocaleTimeString() : 'Never'}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        node.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        node.status === 'DEGRADED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          node.status === 'HEALTHY' ? 'bg-emerald-500' :
                          node.status === 'DEGRADED' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                        }`} />
                        {node.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NetworkNodeTopology;
