import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Shield, Users, Database, FileCheck, BarChart2 } from 'lucide-react';
import { JourneyStep } from '../../types';

interface ComplianceStepperProps {
  steps: JourneyStep[];
  currentStep: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Users,
  Database,
  Lock,
  BarChart2,
  FileCheck,
};

export const ComplianceStepper = ({ steps, currentStep }: ComplianceStepperProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-start relative max-w-5xl mx-auto px-4">
        {/* Connector Line Base */}
        <div className="absolute top-[22px] left-0 right-0 h-0.5 bg-slate-100 -z-0 mx-8" />
        
        {/* Connector Line Progress */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          className="absolute top-[22px] left-0 h-0.5 bg-blue-600 -z-0 transition-all duration-500 ease-in-out mx-8"
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isLocked = idx > currentStep;
          const Icon = ICON_MAP[step.icon] || FileCheck;

          return (
            <div key={idx} className="z-10 flex flex-col items-center gap-3 group">
              <motion.div 
                layout
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : isActive 
                    ? 'bg-white border-blue-600 text-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/5' 
                    : 'bg-white border-slate-200 text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : isLocked ? (
                  <Lock size={18} />
                ) : (
                  <Icon size={20} />
                )}
              </motion.div>
              
              <div className="flex flex-col items-center">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter"
                  >
                    Active Node
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
