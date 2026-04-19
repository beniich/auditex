import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Library, Search, Folder, FolderOpen, FileText, Clock,
  ShieldCheck, Download, Filter, MoreVertical, ChevronRight,
  BookOpen, CheckCircle2, Activity, History, ExternalLink,
  Gavel, Lock, Zap, HardDrive, Plus, X, AlertCircle
} from 'lucide-react';
import { useApiQuery } from '../hooks/useApiQuery';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ComplianceService } from '../services/ComplianceService';
import { toast } from '../hooks/useToast';
import { SkeletonTable } from './Skeleton';

const PolicyLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPolicyForm, setShowNewPolicyForm] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ title: '', framework: 'ISO-27001', content: '' });
  const queryClient = useQueryClient();

  const { data: policies = [], isLoading } = useApiQuery(
    ['policies'],
    () => ComplianceService.getPolicies()
  );

  const createPolicyMutation = useMutation({
    mutationFn: (data: { title: string; framework: string; content: string }) =>
      ComplianceService.createPolicy(data),
    onSuccess: (policy) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success(`Policy "${policy.title}" created successfully.`, 'Policy Library');
      setShowNewPolicyForm(false);
      setNewPolicy({ title: '', framework: 'ISO-27001', content: '' });
    },
    onError: () => toast.error('Failed to create policy.', 'Error'),
  });

  const filteredPolicies = policies.filter(p =>
    searchQuery === '' ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const compliantCount = policies.flatMap(p => p.controls).filter(c => c.status === 'COMPLIANT').length;
  const totalControls = policies.flatMap(p => p.controls).length;

  const frameworkGroups = policies.reduce<Record<string, typeof policies>>((acc, p) => {
    if (!acc[p.framework]) acc[p.framework] = [];
    acc[p.framework].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f8fbff] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                Policy Vault v5.1
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2">
                <ShieldCheck size={10} className="fill-current" /> {policies.length} ACTIVE POLICIES
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Global Policy Library</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
              Central repository for all organizational policies — directly linked to compliance frameworks, cryptographic audit controls, and remediation workflows.
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowNewPolicyForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">
              <Plus size={14} /> New Policy
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-bold text-[#091426] placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            placeholder="Search policies, frameworks, controls..."
          />
        </div>

        {/* New Policy Modal */}
        <AnimatePresence>
          {showNewPolicyForm && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-blue-200 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-widest">Register New Policy</h3>
                <button onClick={() => setShowNewPolicyForm(false)} className="text-slate-300 hover:text-slate-600"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Policy Title</label>
                  <input value={newPolicy.title} onChange={e => setNewPolicy(p => ({ ...p, title: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm font-bold text-[#091426] outline-none focus:border-blue-400 transition-colors"
                    placeholder="e.g. Access Control Policy v2" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Framework</label>
                  <select value={newPolicy.framework} onChange={e => setNewPolicy(p => ({ ...p, framework: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm font-bold text-[#091426] outline-none bg-white">
                    <option>ISO-27001</option>
                    <option>SOC2</option>
                    <option>GDPR</option>
                    <option>NIST</option>
                    <option>PCI-DSS</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={newPolicy.content} onChange={e => setNewPolicy(p => ({ ...p, content: e.target.value }))}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Describe control objectives and scope..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  disabled={!newPolicy.title || createPolicyMutation.isPending}
                  onClick={() => createPolicyMutation.mutate(newPolicy)}
                  className="px-6 py-2.5 bg-[#091426] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {createPolicyMutation.isPending ? 'Registering...' : 'Register Policy'}
                </button>
                <button onClick={() => setShowNewPolicyForm(false)}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                Frameworks <HardDrive size={12} />
              </h3>
              <div className="space-y-2">
                {Object.entries(frameworkGroups).map(([framework, fpolicies]) => (
                  <div key={framework} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all text-[#091426]">
                    <div className="flex items-center gap-3">
                      <Folder size={16} />
                      <span className="text-xs font-black uppercase tracking-tight">{framework}</span>
                    </div>
                    <span className="font-mono text-[10px] font-black text-slate-300">{fpolicies.length}</span>
                  </div>
                ))}
                {isLoading && <div className="h-10 bg-slate-100 rounded-2xl animate-pulse" />}
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Library Health</h3>
              {[
                { label: 'Compliance Rate', val: totalControls > 0 ? Math.round((compliantCount / totalControls) * 100) : 0, color: 'emerald' },
                { label: 'Active Policies', val: policies.length > 0 ? 100 : 0, color: 'blue' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{stat.label}</span>
                    <span className={`text-${stat.color}-600`}>{stat.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: stat.val + '%' }}
                      className={`h-full ${stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-600'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="col-span-9 space-y-8">
            {/* Policy Cards */}
            <div className="grid grid-cols-2 gap-6">
              {isLoading ? (
                [1, 2].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem] animate-pulse" />)
              ) : filteredPolicies.slice(0, 2).map((policy, i) => {
                const compliant = policy.controls.filter(c => c.status === 'COMPLIANT').length;
                const score = policy.controls.length > 0 ? Math.round((compliant / policy.controls.length) * 100) : 0;
                return (
                  <div key={policy.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:bg-blue-50 transition-colors" />
                    <div className="relative z-10 space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                            score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-red-50 text-red-700 border-red-100'
                          }`}>{score >= 80 ? 'COMPLIANT' : score >= 50 ? 'PARTIAL' : 'AT RISK'}</span>
                          <span className="text-[10px] font-mono font-black text-slate-300">{policy.framework}</span>
                        </div>
                        <span className="text-[9px] font-mono font-black text-slate-200 uppercase group-hover:text-blue-200 transition-colors">
                          {policy.id.substring(0, 10)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-[#091426] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors leading-tight">{policy.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{policy.content}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Controls: {policy.controls.length}</span>
                          <span className={`text-[10px] font-black ${score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{score}% compliance</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Policy Table */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] flex items-center gap-2">
                  <BookOpen size={16} /> Central Policy Index
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span>Active ({policies.length})</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /><span>Controls ({totalControls})</span></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-10"><SkeletonTable rows={5} /></div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-10 py-5">Policy Name</th>
                        <th className="px-10 py-5">Framework</th>
                        <th className="px-10 py-5 text-center">Controls</th>
                        <th className="px-10 py-5">Compliance</th>
                        <th className="px-10 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPolicies.length === 0 ? (
                        <tr><td colSpan={5} className="px-10 py-16 text-center text-slate-300 text-sm">No policies found</td></tr>
                      ) : filteredPolicies.map(policy => {
                        const compliant = policy.controls.filter(c => c.status === 'COMPLIANT').length;
                        const score = policy.controls.length > 0 ? Math.round((compliant / policy.controls.length) * 100) : 0;
                        return (
                          <tr key={policy.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <FileText size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                <div>
                                  <p className="text-sm font-black text-[#091426] uppercase tracking-tight">{policy.title}</p>
                                  <p className="text-[10px] font-mono font-bold text-slate-400">{policy.id.substring(0, 14)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                {policy.framework}
                              </span>
                            </td>
                            <td className="px-10 py-6 text-center">
                              <span className="text-xs font-black text-slate-900">{policy.controls.length}</span>
                              <span className="text-[10px] text-slate-400 ml-1">controls</span>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <span className={`text-[11px] font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                              <button className="text-slate-300 hover:text-blue-600 transition-colors">
                                <ChevronRight size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyLibrary;
