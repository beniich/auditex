import React, { useState, useCallback } from 'react';
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

const nodeIcon = (type: string) => {
  switch (type) {
    case 'API_GATEWAY': return <Globe size={28} className="text-blue-600" />;
    case 'DATABASE': return <Database size={22} className="text-purple-500" />;
    case 'FIREWALL': return <Shield size={22} className="text-red-500" />;
    case 'KUBERNETES_CLUSTER': return <Layers size={22} className="text-emerald-500" />;
    default: return <Server size={22} className="text-slate-500" />;
  }
};

const nodePositions = [
  { left: '50%', top: '50%' },
  { left: '75%', top: '70%' },
  { left: '20%', top: '30%' },
  { left: '80%', top: '20%' },
  { left: '30%', top: '80%' },
  { left: '65%', top: '35%' },
  { left: '15%', top: '65%' },
];

const NetworkNodeTopology: React.FC = () => {
  useLiveUpdates();
  const queryClient = useQueryClient();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newNodeForm, setNewNodeForm] = useState(false);

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
              Real-time topology map of all managed infrastructure nodes. Click a node to inspect or update its status.
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
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[680px] relative shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Healthy</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /><span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Degraded</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-600" /><span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Down</span></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black text-slate-400 uppercase">
              <Activity size={12} className="text-blue-500 animate-pulse" /> Live Feed • {nodes.length} Nodes
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-[#f8fafc]"
            style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}>

            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.slice(1).map((_, i) => {
                const from = nodePositions[0];
                const to = nodePositions[(i + 1) % nodePositions.length];
                return (
                  <line key={i}
                    x1={from.left} y1={from.top}
                    x2={to.left} y2={to.top}
                    stroke={nodes[i + 1]?.status === 'DEGRADED' ? '#f59e0b' : nodes[i + 1]?.status === 'DOWN' ? '#dc2626' : '#2563eb'}
                    strokeWidth="1.5"
                    strokeDasharray={nodes[i + 1]?.status === 'HEALTHY' ? undefined : '4'}
                    opacity="0.3"
                  />
                );
              })}
            </svg>

            {loadingNodes ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <SkeletonTopology />
              </div>
            ) : nodes.map((node, idx) => {
              const pos = nodePositions[idx % nodePositions.length];
              const isSelected = node.id === selectedNode?.id;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="absolute group cursor-pointer z-10"
                  style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <div className={`rounded-full border-4 flex items-center justify-center bg-white shadow-xl relative z-10 transition-all duration-300 group-hover:scale-110 ${
                    isSelected ? 'ring-4 ring-blue-300 ring-offset-2' : ''
                  } ${
                    node.status === 'HEALTHY' ? 'border-emerald-500' :
                    node.status === 'DEGRADED' ? 'border-amber-500 animate-pulse' :
                    'border-red-600'
                  } ${node.type === 'API_GATEWAY' ? 'w-20 h-20' : 'w-14 h-14'}`}>
                    {nodeIcon(node.type)}
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -inset-3 rounded-full border-2 border-blue-400 border-dashed animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                    )}
                  </AnimatePresence>
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                    <div className="font-mono text-[10px] font-bold text-slate-900 border border-slate-200 bg-white px-2 py-0.5 rounded shadow-sm mb-1">{node.name}</div>
                    <div className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      node.status === 'HEALTHY' ? 'text-emerald-700 bg-emerald-50' :
                      node.status === 'DEGRADED' ? 'text-amber-700 bg-amber-50' : 'text-white bg-red-600'
                    }`}>{node.status}</div>
                  </div>
                </motion.div>
              );
            })}

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors"><Plus size={18} /></button>
              <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors"><Minus size={18} /></button>
              <button
                onClick={() => { queryClient.invalidateQueries({ queryKey: ['nodes'] }); queryClient.invalidateQueries({ queryKey: ['stats'] }); }}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors mt-2"
              ><RefreshCw size={18} /></button>
            </div>

            {/* Inspector Panel */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 right-6 w-80 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-6 z-30"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-[#091426] uppercase tracking-tight">Node Inspector</h3>
                  <button onClick={() => setSelectedNodeId(null)} className="text-slate-300 hover:text-slate-600"><XCircle size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    {nodeIcon(selectedNode.type)}
                    <div>
                      <p className="text-sm font-black text-[#091426] uppercase">{selectedNode.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{selectedNode.type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="p-3 border border-slate-100 rounded-xl">
                      <p className="text-slate-400 uppercase font-bold mb-1">Region</p>
                      <p className="font-black text-slate-900 font-mono">{selectedNode.region}</p>
                    </div>
                    <div className="p-3 border border-slate-100 rounded-xl">
                      <p className="text-slate-400 uppercase font-bold mb-1">IP Address</p>
                      <p className="font-black text-slate-900 font-mono">{selectedNode.ipAddress || 'N/A'}</p>
                    </div>
                    <div className="p-3 border border-slate-100 rounded-xl col-span-2">
                      <p className="text-slate-400 uppercase font-bold mb-1">Last Heartbeat</p>
                      <p className="font-black text-slate-900 font-mono">{selectedNode.lastSync ? new Date(selectedNode.lastSync).toLocaleString() : 'Never'}</p>
                    </div>
                  </div>
                  <div className="p-3 border border-slate-100 rounded-xl">
                    <p className="text-slate-400 uppercase font-bold text-[10px] mb-2">Status Control</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['HEALTHY', 'DEGRADED', 'DOWN'] as const).map(s => (
                        <button
                          key={s}
                          disabled={updateStatusMutation.isPending}
                          onClick={() => updateStatusMutation.mutate({ nodeId: selectedNode.id, status: s })}
                          className={`py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                            selectedNode.status === s
                              ? s === 'HEALTHY' ? 'bg-emerald-500 text-white border-emerald-600' :
                                s === 'DEGRADED' ? 'bg-amber-500 text-white border-amber-600' :
                                'bg-red-500 text-white border-red-600'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
