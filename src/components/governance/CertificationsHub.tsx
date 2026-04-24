import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  BookOpen, 
  AlertTriangle, 
  UserCheck, 
  Search, 
  Activity,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Fingerprint,
  Zap,
  Globe,
  Gavel,
  ShieldCheck,
  Plus,
  Filter,
  Download,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { SkeletonCard, SkeletonTable } from '../common/Skeleton';
import { CertificationService } from '../../services/CertificationService';

export const CertificationsHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'FRAMEWORKS' | 'ONBOARDING' | 'PERFORMANCE' | 'COI'>('FRAMEWORKS');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: frameworks = [], isLoading } = useApiQuery(
    ['certifications-status'],
    () => CertificationService.getStatus(),
    { refetchInterval: 15000 }
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans cursor-default">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white border border-slate-200 p-8 lg:p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Fingerprint size={120} />
          </div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#091426] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <Gavel size={12} className="text-blue-400" /> Auditor_Control v4.2
              </span>
              <span className="text-blue-600 text-[10px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 pl-2 border-l border-slate-200">
                 {428} ACTIVE REGISTRANTS
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#091426] tracking-tighter uppercase leading-none">Governance Registry</h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-sm leading-relaxed font-medium">
               Structural management of state auditor credentials, certification lifecycles, and cryptographic conflict-of-interest (COI) anchoring.
            </p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0 relative z-10">
             <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner">
                {(['FRAMEWORKS', 'ONBOARDING', 'PERFORMANCE', 'COI'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeSubTab === tab ? 'bg-white text-[#091426] shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeSubTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {activeSubTab === 'FRAMEWORKS' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[#091426] uppercase tracking-tighter">Compliance Frameworks</h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">Live integration with Prisma Policy Controls</p>
                  </div>
                </div>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {frameworks.map((fw: any) => (
                      <div key={fw.id} className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={32} />
                          </div>
                          <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${
                            fw.status === 'MAINTAINED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            fw.status === 'IN_REVIEW' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            'bg-blue-50 text-blue-600 border-blue-200'
                          }`}>
                            {fw.status}
                          </span>
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-2xl font-black text-[#091426] uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{fw.name}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                            {fw.details}
                          </p>
                        </div>
                        <div className="mt-10 relative z-10">
                          <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">Readiness Score</span>
                            <span className="text-[#091426]">{fw.progress}%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${fw.progress}%` }} 
                              className={`h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000 ${
                                fw.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                              }`} 
                            />
                          </div>
                        </div>
                        <div className="absolute right-0 bottom-0 p-10 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                          <Globe size={120} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'ONBOARDING' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { label: 'Active Auditors', val: '428', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                     { label: 'Certifications Issued', val: '1,902', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                     { label: 'Pending Training', val: '14', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                        <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                           <stat.icon size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                          <p className="text-3xl font-black text-[#091426] mt-1 tracking-tighter">{stat.val}</p>
                        </div>
                     </div>
                   ))}
                 </div>

                 <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden">
                    <div className="p-8 lg:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                       <div>
                          <h3 className="text-sm font-black text-[#091426] uppercase tracking-tighter">Auditor Onboarding Pipeline</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest leading-none">Multi-organizational Credentialing</p>
                       </div>
                       <div className="flex gap-4">
                          <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input 
                              placeholder="Search registry..."
                              className="bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-[#091426] outline-none focus:ring-4 focus:ring-blue-50 transition-all w-64"
                            />
                          </div>
                          <button className="px-6 py-3 bg-[#091426] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Invite Principal</button>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">
                          <tr>
                            <th className="px-10 py-6">Principal Auditor / Entity</th>
                            <th className="px-10 py-6">Ledger Status</th>
                            <th className="px-10 py-6">Validation Progress</th>
                            <th className="px-10 py-6 text-right">Registry Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { name: 'Dr. Sarah Jenkins', entity: 'State Regulator Board', status: 'IN_REVIEW', progress: 85, color: 'amber' },
                            { name: 'Michael Chen', entity: 'External Agency (APAC)', status: 'ACTIVE', progress: 100, color: 'emerald' },
                            { name: 'Robert Fox', entity: 'ISO Compliance Validator', status: 'PENDING', progress: 40, color: 'blue' },
                            { name: 'Alisa Volkov', entity: 'Brussels Integrity Group', status: 'ACTIVE', progress: 100, color: 'emerald' },
                          ].map(auditor => (
                            <tr key={auditor.name} className="hover:bg-slate-50/50 group transition-colors">
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-xs border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 transition-all">
                                       {auditor.name[0]}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-[#091426] group-hover:text-blue-600 transition-colors uppercase italic">{auditor.name}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{auditor.entity}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                   auditor.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                   auditor.status === 'IN_REVIEW' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                 }`}>{auditor.status}</span>
                              </td>
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-4 max-w-[200px]">
                                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                       <motion.div initial={{ width: 0 }} animate={{ width: `${auditor.progress}%` }} className={`h-full rounded-full ${auditor.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}></motion.div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900">{auditor.progress}%</span>
                                 </div>
                              </td>
                              <td className="px-10 py-8 text-right">
                                 <button className="text-[#091426] hover:text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-end ml-auto">Review Portfolio <ChevronRight size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </div>
            )}

            {activeSubTab === 'COI' && (
              <div className="space-y-8">
                <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10 flex items-start gap-6 group hover:shadow-xl transition-all overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
                      <ShieldAlert size={100} className="text-red-900" />
                   </div>
                   <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                      <ShieldAlert size={32} />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-xl font-black text-red-900 tracking-tight uppercase">Critical COI Intersections Identified</h3>
                      <p className="text-sm text-red-700 mt-2 max-w-3xl font-medium leading-relaxed">
                         Our integrity engine identified {2} high-severity conflicts where an assigned principal auditor has significant historical financial linkages with the target organization. 
                         Immediate recusal or institutional oversight elevation required.
                      </p>
                      <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">Execute Recusal Protocol <Zap size={14} /></button>
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
                  <div className="p-8 lg:p-10 border-b border-slate-100 flex justify-between items-center bg-[#091426] text-white">
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3"><Lock size={18} className="text-blue-400" /> Cryptographic COI Registry</h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Immutable Conflict Ledger // SHA-256 Anchored</p>
                     </div>
                     <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white/60 hover:text-white transition-all"><Download size={14} /> Export Forensic Log</button>
                  </div>
                  <div className="p-10">
                    <div className="space-y-6">
                      {[
                        { id: 'COI-091A', auditor: 'David Bowman', target: 'Aerotech Defense', severity: 'HIGH', date: '2023-11-20', detail: 'Prior board member of subsidiary "AeroParts Global". Transaction detected: $42k consulting fee.' },
                        { id: 'COI-084X', auditor: 'Julia Childress', target: 'Global Pharma Corp', severity: 'MEDIUM', date: '2023-10-15', detail: 'Spouse holds 2.4% beneficial equity in primary clinical partner "BioTrials Lab".' }
                      ].map(coi => (
                        <div key={coi.id} className="flex gap-10 items-center p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/30 hover:bg-white hover:shadow-xl transition-all cursor-default group">
                           <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-mono text-blue-600 font-black tracking-widest">#{coi.id}</span>
                                 <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${
                                   coi.severity === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                 }`}>{coi.severity} RISK_THRESHOLD</div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div>
                                   <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Affiliated Principal</p>
                                   <p className="text-lg font-black text-[#091426] uppercase italic underline decoration-blue-200 underline-offset-4">{coi.auditor}</p>
                                 </div>
                                 <div className="w-10 h-px bg-slate-200" />
                                 <div>
                                   <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Target Entity</p>
                                   <p className="text-lg font-black text-[#091426] uppercase">{coi.target}</p>
                                 </div>
                              </div>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">{coi.detail}</p>
                           </div>
                           <div className="flex flex-col gap-3 min-w-[140px]">
                              <button className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Recuse Principal</button>
                              <button className="w-full py-4 bg-white border border-slate-200 text-[#091426] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">Elevate Review <ChevronRight size={14} /></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'PERFORMANCE' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl transition-all">
                      <div className="relative w-40 h-40 mb-8 items-center justify-center flex">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * 94) / 100} className="text-emerald-500 transition-all duration-1000 ease-out" />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-[#091426] tracking-tighter">94%</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rank</span>
                         </div>
                      </div>
                      <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em]">Audit Accuracy Metric</h3>
                      <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium max-w-xs">Aggregated precision score based on peer-cross-validation and secondary state reviews.</p>
                   </div>
                   
                   <div className="bg-[#091426] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                      <div>
                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.25em] mb-8">Auditor Efficiency Index</h3>
                        <div className="space-y-10">
                          <div>
                             <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                <span>Report Turnaround Orbit</span>
                                <span className="text-white">4.2 Days Avg</span>
                             </div>
                             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></motion.div>
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                <span>Finding Retention Rate</span>
                                <span className="text-white">98.2% Accuracy</span>
                             </div>
                             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></motion.div>
                             </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-10 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <p className="flex items-center gap-2"><Zap size={14} className="text-blue-400" /> Predictive Benchmark active</p>
                         <button className="text-white hover:text-blue-400 transition-colors">See Leaderboard →</button>
                      </div>
                   </div>
                </div>
                
                 <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                   <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   <h3 className="text-[10px] font-black text-[#091426] uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-6 flex items-center justify-between">
                      System Telemetry Insights
                      <span className="text-blue-600">LIVE_PULSE</span>
                   </h3>
                   <div className="flex items-center justify-center py-20 flex-col gap-6 relative z-10">
                      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center animate-bounce shadow-lg shadow-blue-500/10">
                         <Activity size={40} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-black text-[#091426] uppercase tracking-tighter">Core Telemetry Stream Initialized</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching historical performance datasets from central jurisdictional nodes...</p>
                      </div>
                   </div>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Technical Strip */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
           <p className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-[#091426]" /> 
              Registry_Auth: TIER-5 // Anchored: 2024-Q3
           </p>
           <p className="text-blue-600">Protocol: RSA_4096_LEDGER // Verified: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CertificationsHub;
