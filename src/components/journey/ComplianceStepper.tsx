import React from 'react';
import { CheckCircle2, Lock, FileCheck, Shield, Users, BarChart2, Network } from 'lucide-react';
import { JourneyStep } from '../../types';

interface ComplianceStepperProps {
  steps: JourneyStep[];
  currentStep: number;
  completedSteps: number[]; // e.g. [1, 2]
}

const getIcon = (name: string) => {
  const icons: Record<string, any> = { Shield, Users, BarChart2, Network, Lock, FileCheck };
  return icons[name] || FileCheck;
};

export const ComplianceStepper: React.FC<ComplianceStepperProps> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="w-full bg-[#091426] p-6 lg:px-10 lg:py-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex items-center justify-between">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      
      {steps.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.step);
        const isActive = step.step === currentStep;
        const Icon = getIcon(step.icon);

        return (
          <React.Fragment key={step.step}>
            <div className="flex flex-col items-center relative z-10 w-24">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : isActive 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 shadow-blue-500/30' 
                      : 'bg-white/10 text-slate-400 border border-white/5'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={24} /> : isActive ? <Icon size={24} /> : <Lock size={20} />}
              </div>
              <p className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                {step.title}
              </p>
            </div>
            
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 rounded-full overflow-hidden relative z-10 bg-white/10">
                <div 
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-1000 ${
                    isCompleted ? 'w-full' : isActive ? 'w-1/2 animate-pulse' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
