import React from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageSquare, 
  LifeBuoy, 
  ArrowRight, 
  ShieldCheck, 
  Gavel, 
  Lock, 
  Activity, 
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Database,
  Cpu
} from 'lucide-react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const SystemHelp: React.FC = () => {
  return (
    <PageWrapper>
      {/* Search Header */}
      <div className="bg-slate-900 rounded-[3rem] p-16 md:p-24 text-white relative overflow-hidden shadow-2xl mb-12">
         <div className="absolute top-0 right-0 p-10 opacity-5 blur-xl scale-150 rotate-12 pointer-events-none">
            <HelpCircle size={400} />
         </div>
         <div className="absolute -bottom-10 -left-10 p-20 opacity-5 pointer-events-none">
            <Cpu size={300} />
         </div>
         
         <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
               <StatusBadge label="Global Support Node" variant="brand" className="bg-blue-600 border-blue-500 text-white" icon={Sparkles} />
               <div className="h-4 w-px bg-white/10" />
               <span className="text-white/40 text-[10px] font-mono font-black tracking-widest uppercase">
                  Instruction Core v4.0
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-10 italic">How can we help you secure your infrastructure?</h1>
            
            <div className="relative group max-w-2xl">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
               <input 
                 className="w-full bg-white text-slate-900 pl-16 pr-8 py-6 rounded-[2rem] text-lg font-black placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-blue-600/10 transition-all shadow-2xl" 
                 placeholder="Search modules, laws, or guides..." 
               />
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8 text-[10px] font-black uppercase tracking-widest items-center">
               <p className="text-white/40">Frequent:</p>
               {['Integrity Vault', 'Sovereignty MoC', 'ISO 27001'].map((tag, i) => (
                 <button key={i} className="bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 px-5 py-2 rounded-full font-bold">
                    {tag}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
         {[
           { title: 'Compliance Base', icon: <Gavel size={24} />, desc: 'Understanding regulatory frameworks and local law mapping.', variant: 'info' as const },
           { title: 'Security Protocols', icon: <ShieldCheck size={24} />, desc: 'Deep-dive into the cryptographic event store and vault.', variant: 'success' as const },
           { title: 'Forensic Tools', icon: <Activity size={24} />, desc: 'Documentation for event replay, node analysis, and incident labs.', variant: 'warning' as const },
           { title: 'Platform Admin', icon: <Lock size={24} />, desc: 'Managing RBAC, entities, and global system configurations.', variant: 'brand' as const },
         ].map((cat, i) => (
           <SectionCard key={i} padding="large" className="group cursor-pointer hover:border-blue-600 transition-all">
              <div className="mb-8 group-hover:scale-110 transition-transform w-fit">
                 <StatusBadge label="" variant={cat.variant} icon={() => cat.icon} className="p-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
              <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight mb-8">{cat.desc}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest pt-6 border-t border-slate-50 opacity-40 group-hover:opacity-100 transition-all">
                 Explore Protocol <ChevronRight size={14} />
              </div>
           </SectionCard>
         ))}
      </div>

      {/* Knowledge & Tutorials */}
      <div className="grid grid-cols-12 gap-8 mb-12">
         {/* Essential Reading */}
         <SectionCard 
            className="col-span-12 lg:col-span-8"
            title="Essential Reading & Guides"
            subtitle="Foundation knowledge for system operators"
            actions={<Button variant="ghost" size="sm">View Library</Button>}
         >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
               {[
                 { title: 'The AuditMaster Lifecycle', read: '12 min', cat: 'FOUNDATIONS' },
                 { title: 'Securing Decentralized Nodes', read: '15 min', cat: 'ADVANCED' },
                 { title: 'RBAC Best Practices', read: '8 min', cat: 'SECURITY' },
                 { title: 'Interpreting Forensic Timelines', read: '20 min', cat: 'ANALYSIS' },
               ].map((guide, i) => (
                 <div key={i} className="group cursor-pointer border-b border-slate-50 pb-6 hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">{guide.cat}</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{guide.read} READ</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{guide.title}</h4>
                    <div className="mt-4 flex items-center gap-2 text-slate-100 group-hover:text-blue-600 transition-colors">
                       <div className="h-px flex-1 bg-current opacity-10" />
                       <ArrowRight size={16} />
                    </div>
                 </div>
               ))}
            </div>
         </SectionCard>

         {/* Video Training */}
         <SectionCard variant="dark" className="col-span-12 lg:col-span-4 flex flex-col justify-between">
            <div className="space-y-8 relative z-10">
               <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Video size={20} /> Academy Center
               </h2>
               <div className="aspect-video w-full bg-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center border border-white/10 group cursor-pointer shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&h=225" alt="Training" className="w-full h-full object-cover opacity-20 grayscale" />
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all" />
                  <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                     <LifeBuoy size={24} className="fill-current" />
                  </div>
               </div>
               <div>
                  <h5 className="text-[11px] font-black text-white uppercase tracking-tight mb-2">Onboarding Certification v2.1</h5>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">4 sessions // Instructor-led forensic deep-dive</p>
               </div>
            </div>
            <Button variant="primary" className="w-full py-5 mt-10 shadow-slate-900/40">Launch Training Site</Button>
         </SectionCard>
      </div>

      {/* Support Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <SectionCard variant="dark" className="bg-blue-600 border-blue-500 shadow-blue-500/20 overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-4">Direct Protocol</h4>
                  <p className="text-xs font-bold text-blue-100 leading-relaxed uppercase tracking-tight italic opacity-80">Sync with core engineers for critical system instrumentation.</p>
               </div>
               <Button variant="secondary" className="bg-white text-blue-600 border-transparent w-fit mt-8" icon={ExternalLink}>Open Node Ticket</Button>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
               <MessageSquare size={140} />
            </div>
         </SectionCard>
         
         <SectionCard className="col-span-1 md:col-span-2 border-red-100 bg-white group overflow-hidden" padding="none">
            <div className="flex flex-col md:flex-row h-full">
               <div className="flex-1 p-10 flex gap-8 items-center">
                  <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-600 shadow-inner group-hover:scale-110 transition-transform shrink-0">
                     <LifeBuoy size={48} className="animate-spin-slow" />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Critical Breach Suspected?</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-sm leading-relaxed">
                        If integrity is compromised, trigger the Emergency Protocol to isolate all compliance nodes immediately.
                     </p>
                  </div>
               </div>
               <div className="p-10 flex items-center justify-center bg-red-50 border-l border-red-100">
                  <button className="px-12 py-6 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-red-200 hover:bg-black hover:shadow-black/20 transition-all">
                     ACTIVATE SHUTDOWN
                  </button>
               </div>
            </div>
         </SectionCard>
      </div>

      {/* Technical Footer */}
      <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl"><Database size={20} className="text-slate-900" /></div>
               <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Index: G-HELP-99</p>
                  <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">Sync: 2024-05-22 09:15 UTC</p>
               </div>
            </div>
         </div>
         <button className="flex items-center gap-3 text-blue-600 font-black text-[10px] tracking-[0.2em] group">
            <Star size={14} className="fill-current group-hover:rotate-45 transition-transform" /> OFFICIAL_DOCS_PORTAL
         </button>
      </div>
    </PageWrapper>
  );
};

export default SystemHelp;
