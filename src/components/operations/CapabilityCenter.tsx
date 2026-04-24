import React, { useState } from 'react';
import { APP_CAPABILITIES } from '../../config/capabilities';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Filter, Zap } from 'lucide-react';

interface CapabilityCenterProps {
  onNavigate: (tabId: string) => void;
}

export const CapabilityCenter = ({ onNavigate }: CapabilityCenterProps) => {
  const [filter, setFilter] = useState('All');

  const filteredCaps = filter === 'All' 
    ? APP_CAPABILITIES 
    : APP_CAPABILITIES.filter(c => c.persona.includes(filter));

  const uniquePersonas = Array.from(
    new Set(APP_CAPABILITIES.flatMap(c => c.persona))
  ).sort();

  return (
    <div className="max-w-[1400px] mx-auto p-2">
      {/* Header */}
      <div className="mb-12 text-center pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Compass className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#091426] dark:text-white mb-4 uppercase">
          Capability <span className="text-blue-600">Center</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm uppercase tracking-widest font-bold">
          Explore the AuditAX arsenal. Filter by role to discover specialized modules engineered for your mission.
        </p>
      </div>

      {/* Persona Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <div className="flex items-center gap-2 mr-4 text-slate-400">
           <Filter size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Filter Role:</span>
        </div>
        {['All', ...uniquePersonas].map(role => (
          <button 
            key={role}
            onClick={() => setFilter(role)}
            className={`px-5 py-2.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${
              filter === role 
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-300 dark:hover:border-blue-900/50'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaps.map((cap, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={cap.id}
            className="group relative flex flex-col p-8 bg-white dark:bg-[#091426] border border-slate-200 dark:border-slate-800/80 rounded-[2rem] hover:border-blue-400 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl"
            onClick={() => onNavigate(cap.tabId)}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] font-black text-blue-600 bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                {cap.category}
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800 px-2 py-1 rounded-lg">
                {cap.powerTag}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-[#091426] dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
              {cap.name}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
              {cap.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center gap-2 text-slate-400">
                <Zap size={14} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Engine: {cap.engine}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:scale-110">
                <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
