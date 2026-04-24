import React, { useEffect, useState, useRef } from 'react';
import { DollarSign, TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';
import { motion, useInView } from 'motion/react';

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}</span>;
}

export const CFOPage = () => {
  return (
    <div className="bg-[#f0fdf4] text-slate-900 min-h-screen">
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <DollarSign size={32} />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-[#091426]">
          Quantify Your Regulatory Risk in <span className="text-emerald-500">Dollars</span>.<br /> Not Just Alerts.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium mb-12">
          Passez de la conformité "coût" à la conformité "ROI". Notre IA cartographie l'impact financier d'une potentielle faille avant qu'elle ne survienne.
        </p>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
             <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4"><ShieldAlert size={24}/></div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Exposure Mapping</p>
             <h2 className="text-5xl font-black text-[#091426] mb-2">$<CountUp end={1200} />M</h2>
             <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">-34% mitigated this quarter</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center relative overflow-hidden border-b-4 border-b-emerald-500">
             <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-4"><TrendingUp size={24}/></div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Compliance ROI</p>
             <h2 className="text-5xl font-black text-[#091426] mb-2"><CountUp end={320} />%</h2>
             <p className="text-xs font-semibold text-slate-500">Compared to manual external audits</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
             <div className="bg-blue-50 text-blue-500 p-3 rounded-xl mb-4"><BarChart3 size={24}/></div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Audit Readiness</p>
             <h2 className="text-5xl font-black text-[#091426] mb-2"><CountUp end={94} />/100</h2>
             <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Score excellent - Ready for SOC2</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10">Faisant gagner des millions en audits manuels à</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale font-black text-2xl tracking-tighter text-[#091426]">
               <span>GLOBALBANK</span>
               <span>TECHCORP</span>
               <span>PHARMAGIANT</span>
               <span>ENERGYDYNAMICS</span>
            </div>
         </div>
      </section>
    </div>
  );
};
