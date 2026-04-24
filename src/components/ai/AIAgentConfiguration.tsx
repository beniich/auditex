import React, { useState } from 'react';
import { ShieldCheck, Rocket, Info, GripVertical, Settings, LayoutGrid, FileCheck, BarChart3, Bot, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const RangeSlider = ({ label, value, min = 0, max = 100, unit = '%', info = "" }: any) => (
  <div className="mb-8 group">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-black text-[#091426] tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-blue-600">{value}{unit}</span>
        {info && <span className="text-[10px] font-bold text-slate-400"> - {info}</span>}
      </div>
    </div>
    <div className="relative h-6 flex items-center">
      <div className="absolute w-full h-1.5 bg-slate-100 rounded-full border border-slate-200 shadow-inner"></div>
      <div 
        className="absolute h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-all duration-300"
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
        className="absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-lg shadow-blue-500/20 transform -translate-x-1/2 pointer-events-none transition-all duration-300 group-hover:scale-110"
        style={{ left: `${((value - min) / (max - min)) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between mt-2">
       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MIN</span>
       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MAX</span>
    </div>
  </div>
);

const DomainControl = ({ label, value }: { label: string, value: number }) => (
  <div className="grid grid-cols-[120px_1fr_40px] items-center gap-6 mb-4 group">
    <span className="text-xs font-bold text-slate-500 group-hover:text-[#091426] transition-colors">{label}</span>
    <div className="relative h-4 flex items-center">
       <div className="absolute w-full h-1 bg-slate-100 rounded-full border border-slate-200"></div>
       <div className="absolute h-1 bg-blue-500 rounded-full" style={{ width: `${value}%` }}></div>
       <input type="range" value={value} className="absolute w-full h-full opacity-0 cursor-pointer z-10" readOnly />
       <div 
         className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-sm transform -translate-x-1/2"
         style={{ left: `${value}%` }}
       ></div>
    </div>
    <span className="text-[10px] font-black text-[#091426] text-right">{value}%</span>
  </div>
);

export const AIAgentConfiguration = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[850px] border border-slate-200">
      {/* Dynamic Header */}
      <div className="bg-white px-10 py-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-white via-white to-blue-50/30">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#091426] rounded-xl flex items-center justify-center text-blue-400 shadow-xl shadow-slate-900/10 active:scale-95 transition-transform cursor-pointer">
               <Bot size={28} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-[#091426] tracking-tight">AI Agent Configuration</h2>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Autonomous Inspector v4.0 - ACTIVE</span>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {[LayoutGrid, FileCheck, BarChart3, Settings].map((Icon, i) => (
               <button key={i} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-white hover:border-blue-200 transition-all">
                  <Icon size={18} />
               </button>
            ))}
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 h-[calc(100%-100px)]">
         {/* Left: Futuristic Visualizer */}
         <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
               backgroundImage: 'linear-gradient(#091426 1px, transparent 1px), linear-gradient(90deg, #091426 1px, transparent 1px)',
               backgroundSize: '30px 30px'
            }}></div>
            
            <div className="absolute top-8 left-8">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Agent Control Panel</h3>
            </div>

            {/* Glowing Globe */}
            <div className="relative group cursor-crosshair">
               {/* Pulsing Aura */}
               <motion.div 
                 animate={{ 
                   scale: [1, 1.1, 1],
                   opacity: [0.3, 0.5, 0.3]
                 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 bg-blue-500 rounded-full blur-[60px]"
               ></motion.div>
               
               {/* Core Globe */}
               <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-blue-300 via-blue-600 to-indigo-900 border-4 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 hover:opacity-40 transition-opacity"></div>
                  <Globe size={120} className="text-white/80 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
                  
                  {/* Internal Glow */}
                  <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent"></div>
               </div>

               {/* Scanning Ring */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 className="absolute -inset-6 border border-dashed border-blue-400/30 rounded-full"
               ></motion.div>
            </div>

            <div className="mt-12 text-center relative z-10">
               <h4 className="text-xl font-black text-[#091426] mb-1">Agent Alpha - Active</h4>
               <p className="text-slate-400 text-sm font-medium">Status: Calibrating System Parameters</p>
               
               <div className="flex gap-4 mt-8 justify-center">
                  <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                     <Zap size={14} className="text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Efficiency 94.2%</span>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-500" />
                     <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Trust Level 10</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Fine-Grained Controls */}
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 flex flex-col">
            <h3 className="text-sm font-black text-[#091426] uppercase tracking-[0.2em] mb-10 border-b border-slate-50 pb-4 flex items-center gap-2">
               <Settings size={16} className="text-blue-600" /> System Tuning
            </h3>

            <div className="flex-1 space-y-2">
               <RangeSlider label="Strictness (Compliance Rigor)" value={75} info="High Precision" />
               <RangeSlider label="Frequency of Scans" value={2} min={1} max={4} unit="" info="Every 4 Hours" />

               <div className="pt-6 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-8">
                     <span className="text-sm font-black text-[#091426] tracking-tight uppercase tracking-widest">Domain Focus (Weighted Areas)</span>
                     <span className="text-[10px] font-bold text-slate-400">Focus Distribution: Balanced</span>
                  </div>
                  
                  <div className="space-y-4">
                     <DomainControl label="Financial" value={40} />
                     <DomainControl label="Regulatory" value={30} />
                     <DomainControl label="Operational" value={20} />
                     <DomainControl label="Cybersecurity" value={10} />
                  </div>
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 grid grid-cols-2 gap-4">
               <button className="py-4 bg-[#091426] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <ShieldCheck size={16} /> Save Config
               </button>
               <button className="py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                  <Rocket size={16} /> Deploy Agent
               </button>
            </div>

            {/* Status Notification */}
            <div className="mt-6 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
               <Info size={18} className="text-blue-500" />
               <p className="text-xs font-bold text-blue-900 leading-tight">
                  <span className="font-black border-b border-blue-200">System Status:</span> Optimal. Next audit cycle starts in 24 minutes.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
export default AIAgentConfiguration;
