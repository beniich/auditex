import React, { useState } from 'react';
import { ShieldCheck, Rocket, Info, GripVertical, Settings, LayoutGrid, FileCheck, BarChart3, Bot, Zap, Globe, Save, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

const RangeSlider = ({ label, value, min = 0, max = 100, unit = '%', info = "" }: any) => (
  <div className="mb-8 group">
    <div className="flex justify-between items-center mb-4">
      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-blue-600 italic">{value}{unit}</span>
        {info && <span className="text-[10px] font-bold text-slate-400 uppercase">/ {info}</span>}
      </div>
    </div>
    <div className="relative h-6 flex items-center">
      <div className="absolute w-full h-1.5 bg-slate-100 rounded-full border border-slate-50"></div>
      <div 
        className="absolute h-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all duration-300"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      ></div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        onChange={() => {}} 
      />
      <div 
        className="absolute w-5 h-5 bg-white border-4 border-blue-600 rounded-full shadow-lg transform -translate-x-1/2 pointer-events-none transition-all duration-300 group-hover:scale-125"
        style={{ left: `${((value - min) / (max - min)) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between mt-3">
       <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Min_System</span>
       <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Max_Peak</span>
    </div>
  </div>
);

const DomainControl = ({ label, value }: { label: string, value: number }) => (
  <div className="grid grid-cols-[140px_1fr_60px] items-center gap-10 mb-6 group">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors italic">{label}</span>
    <div className="relative h-4 flex items-center">
       <div className="absolute w-full h-1 bg-slate-50 rounded-full border border-slate-100"></div>
       <div className="absolute h-1 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20" style={{ width: `${value}%` }}></div>
       <input type="range" value={value} className="absolute w-full h-full opacity-0 cursor-pointer z-10" readOnly />
       <div 
         className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm transform -translate-x-1/2 group-hover:scale-125 transition-transform"
         style={{ left: `${value}%` }}
       ></div>
    </div>
    <span className="text-[10px] font-black text-slate-900 text-right italic tabular-nums">{value}%</span>
  </div>
);

export const AIAgentConfiguration = () => {
  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="AI Agent Configuration"
        subtitle="Manage autonomous inspection protocols and neural trust levels."
        badge="Inspector v4.0 - ACTIVE"
        icon={Bot}
        breadcrumb={['Admin', 'AI', 'Agents']}
        actions={
          <div className="flex gap-4">
             <Button variant="brand" icon={Play} size="sm">Hot Swap Engine</Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8 h-full">
         {/* Left: Futuristic Visualizer */}
         <div className="col-span-12 lg:col-span-7">
            <SectionCard padding="none" className="min-h-[600px] h-full flex flex-col items-center justify-center relative overflow-hidden bg-white group">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
                  backgroundImage: 'linear-gradient(#091426 1px, transparent 1px), linear-gradient(90deg, #091426 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
               }}></div>
               
               <div className="absolute top-10 left-10">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div> Agent_Spatial_Visualizer
                  </h3>
               </div>

               {/* Glowing Globe */}
               <div className="relative mt-10">
                  {/* Pulsing Aura */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-blue-600 rounded-full blur-[80px]"
                  ></motion.div>
                  
                  {/* Core Globe */}
                  <div className="relative w-80 h-80 rounded-[4rem] bg-gradient-to-br from-blue-400 via-blue-700 to-indigo-950 border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                     <Globe size={160} className="text-white/40 animate-[spin_30s_linear_infinite]" strokeWidth={0.5} />
                     <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent"></div>
                  </div>

                  {/* Scanning Rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-10 border-2 border-dashed border-blue-200/50 rounded-full"
                  ></motion.div>
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-16 border border-slate-100 rounded-full"
                  ></motion.div>
               </div>

               <div className="mt-16 text-center relative z-10 space-y-6">
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Agent Alpha IX</h4>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Telemetry: Operational // Stable</p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                     <StatusBadge label="Efficiency 94.2%" variant="success" icon={Zap} className="px-6 py-2" />
                     <StatusBadge label="Trust Level 10" variant="brand" icon={ShieldCheck} className="px-6 py-2" />
                  </div>
               </div>
            </SectionCard>
         </div>

         {/* Right: Fine-Grained Controls */}
         <div className="col-span-12 lg:col-span-5 h-full">
            <SectionCard title="Neural Control Panel" subtitle="Fine-tune autonomous weightings and rigor" padding="large" className="h-full flex flex-col">
               <div className="flex-1 space-y-4 mt-8">
                  <RangeSlider label="Compliance Rigor (Strictness)" value={75} info="High Precision Mode" />
                  <RangeSlider label="Scan Cycle Frequency" value={2} min={1} max={4} unit="" info="4 Cycles / 24h" />

                  <div className="pt-10 border-t border-slate-100 mt-10">
                     <div className="flex justify-between items-center mb-10">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Domain Weight Distribution</span>
                        <StatusBadge label="BALANCED" variant="info" className="scale-75" />
                     </div>
                     
                     <div className="space-y-2">
                        <DomainControl label="Financial Ops" value={40} />
                        <DomainControl label="Regulatory Data" value={30} />
                        <DomainControl label="Infras. Logs" value={20} />
                        <DomainControl label="Identity Vault" value={10} />
                     </div>
                  </div>
               </div>

               <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-6">
                  <Button variant="primary" className="py-5 bg-slate-900 shadow-slate-900/20" icon={Save}>
                     Lock Config
                  </Button>
                  <Button variant="secondary" className="py-5 border-blue-600 text-blue-600 hover:bg-blue-50" icon={Rocket}>
                     Deploy Agent
                  </Button>
               </div>

               <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-center gap-5">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100 text-blue-600"><Info size={20} /></div>
                  <p className="text-[10px] font-black text-blue-900 leading-relaxed uppercase tracking-tight">
                     <span className="text-blue-600">Protocol Status:</span> Deployment is verified stable. Next autonomous audit cycle in <span className="p-1 bg-white rounded border border-blue-200">24 MIN</span>.
                  </p>
               </div>
            </SectionCard>
         </div>
      </div>
    </PageWrapper>
  );
};
export default AIAgentConfiguration;
