import React, { useState } from 'react';
import { ShieldCheck, Copy, Code, Layers, History, Settings, CheckCircle2, ChevronRight, Palette } from 'lucide-react';

const COLORS = ['#2563eb', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#091426'];

export const VerifiedBadgeCenter = () => {
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script src="https://auditax.com/badge.js" data-id="12345" async></script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[850px] border border-slate-200">
      <div className="bg-white p-10 border-b border-slate-200">
         <h2 className="text-3xl font-black text-[#091426] tracking-tight">Verified Badge Center</h2>
         <p className="text-slate-500 font-medium mt-1">Manage and customize your cryptographically verified trust signals.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 p-10 overflow-hidden">
         {/* Internal Sidebar */}
         <div className="flex flex-col gap-2">
            {[
               { icon: Layers, label: 'Overview' },
               { icon: Palette, label: 'Badge Customization', active: true },
               { icon: Code, label: 'Integration Code' },
               { icon: History, label: 'Validation History' }
            ].map(item => (
               <button 
                  key={item.label}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                     item.active ? 'bg-white border border-slate-200 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-[#091426] hover:bg-slate-50'
                  }`}
               >
                  <item.icon size={18} />
                  {item.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex flex-col gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm flex flex-col md:flex-row gap-12 items-center md:items-start">
               {/* Badge Preview */}
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Live Preview</span>
                  <div 
                    className="w-56 h-56 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center p-8 transition-all shadow-xl shadow-slate-100"
                    style={{ background: 'white' }}
                  >
                     <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group cursor-pointer active:scale-95 transition-transform" style={{ backgroundColor: selectedColor }}>
                        <ShieldCheck size={40} />
                     </div>
                     <div className="text-lg font-black text-[#091426] leading-tight">AuditAX Verified</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Status: Active. Level: Elite
                     </div>
                  </div>
               </div>

               {/* Customization Details */}
               <div className="flex-1 space-y-10 w-full">
                  <div>
                     <label className="text-sm font-black text-[#091426] uppercase tracking-widest block mb-6">Primary Branding Color</label>
                     <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                        {COLORS.map(color => (
                           <button 
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`w-10 h-10 rounded-xl transition-all border-4 ${selectedColor === color ? 'border-[#091426] scale-110 shadow-lg' : 'border-white hover:scale-105 shadow-sm'}`}
                              style={{ backgroundColor: color }}
                           />
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                     <div className="space-y-3">
                        <label className="text-sm font-black text-[#091426] uppercase tracking-widest">Badge Style</label>
                        <div className="relative">
                           <select className="w-full appearance-none px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#091426] outline-none">
                              <option>Standard Floating Card</option>
                              <option>Minimalist Icon Only</option>
                              <option>Expanded Compliance Block</option>
                           </select>
                           <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={18} />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-sm font-black text-[#091426] uppercase tracking-widest">Trust Indicators</label>
                        <div className="flex flex-wrap gap-2">
                           {['Show Health', 'Real-time Stats', 'Verification Date'].map(tag => (
                              <button key={tag} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-colors">{tag}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Integration Code Section */}
            <div className="bg-[#091426] rounded-3xl p-10 text-white shadow-2xl shadow-slate-900/10 flex flex-col gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4">
                  <Code size={180} className="text-white/5" strokeWidth={1} />
               </div>
               
               <div>
                  <h3 className="text-xl font-black mb-1">Integration Code</h3>
                  <p className="text-slate-400 text-sm font-medium">Embed this snippet in your footer to display the live verification badge.</p>
               </div>
               
               <div className="relative group">
                  <pre className="bg-black/30 backdrop-blur-md p-8 rounded-3xl font-mono text-sm text-blue-300 border border-white/5 overflow-x-auto select-all">
                     {`<script src="https://auditax.com/badge.js" \n        data-id="12345" \n        data-theme="${selectedColor}" \n        async></script>`}
                  </pre>
                  <button 
                    onClick={handleCopy}
                    className={`absolute bottom-4 right-4 flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                       copied ? 'bg-emerald-500 text-white scale-105' : 'bg-white text-[#091426] hover:bg-blue-50 active:scale-95'
                    }`}
                  >
                     {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                     {copied ? 'Copied' : 'Copy Snippet'}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default VerifiedBadgeCenter;
