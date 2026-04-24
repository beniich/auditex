import React from 'react';
import { Search, Plus, Send, Shield, Lock, Users, Hash, MoreHorizontal, Smile, Paperclip } from 'lucide-react';

const MESSAGES = [
  { id: 1, user: 'John Smith', initials: 'JS', time: '10:15 AM', content: "Reviewing the Q3 Financial Risk Report. Finding #F-2451 requires immediate attention. Need access logs from the EMEA cluster.", me: false },
  { id: 2, user: 'Sarah Chen', initials: 'SC', time: '10:17 AM', content: "Agreed, I'm pulling the latest access logs now. Should have them ready in the vault within 10 minutes.", me: true },
  { id: 3, user: 'System Bot', initials: 'AI', time: '10:18 AM', content: "Intelligence Insight: Finding #F-2451 correlates with 3 anomalous login attempts from unknown IP ranges.", me: false, bot: true }
];

export const TeamCollaboration = () => {
  return (
    <div className="flex h-full bg-white rounded-3xl overflow-hidden min-h-[850px] border border-slate-200 shadow-sm">
      {/* Sidebar: Channels */}
      <div className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/20">
         <div className="p-6 pb-2">
            <h2 className="text-xl font-black text-[#091426] tracking-tighter italic uppercase">AuditAX</h2>
         </div>

         <div className="p-6">
            <div className="relative mb-8">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input type="text" placeholder="Jump to..." className="w-full pl-9 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
            </div>

            <div className="space-y-8">
               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center px-2">
                     CHANNELS <Plus size={14} className="cursor-pointer hover:text-blue-600" />
                  </h3>
                  <div className="space-y-1">
                     {['General', 'Audit Team Alpha', 'Risk Analysis Group'].map((ch, i) => (
                        <div key={ch} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${i === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100'}`}>
                           <Hash size={16} className={i === 1 ? 'opacity-70' : 'text-slate-400'} />
                           <span>{ch}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center px-2">
                     DIRECT MESSAGES <Plus size={14} className="cursor-pointer hover:text-blue-600" />
                  </h3>
                  <div className="space-y-1">
                     {['Sarah Chen', 'David Lee', 'Marcus Aurelius'].map((dm, i) => (
                        <div key={dm} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer group">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></div>
                           <span>{dm}</span>
                           <span className="ml-auto text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">ACTIVE</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-auto p-6">
            <button className="w-full py-3 border-2 border-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2">
               <Plus size={14} /> New Secure Channel
            </button>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
         {/* Top Header */}
         <div className="h-20 px-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#091426]">Audit Team Alpha</h3>
                  <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                     <Lock size={10} /> E2EE Active
                  </div>
               </div>
               <p className="text-xs font-bold text-slate-400">Collaboration for ISO 27001 Re-Certification Project</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                     </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#091426] text-blue-400 flex items-center justify-center text-[10px] font-black shadow-sm">+8</div>
               </div>
               <div className="w-px h-8 bg-slate-100"></div>
               <MoreHorizontal className="text-slate-400 hover:text-[#091426] cursor-pointer" size={20} />
            </div>
         </div>

         {/* Screen Background Effect */}
         <div className="flex-1 bg-slate-50/30 overflow-y-auto px-12 py-10 space-y-12 custom-scrollbar">
            {MESSAGES.map(msg => (
               <div key={msg.id} className={`flex gap-5 max-w-4xl ${msg.me ? 'flex-row-reverse float-right clear-both' : 'float-left clear-both'}`}>
                  {!msg.me && (
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-lg ${msg.bot ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-[#091426]'}`}>
                        {msg.bot ? <BotIcon size={20} /> : msg.initials}
                     </div>
                  )}
                  <div className={`flex flex-col ${msg.me ? 'items-end' : 'items-start'}`}>
                     <div className="flex items-center gap-3 mb-2 px-1">
                        <span className="text-xs font-black text-[#091426] tracking-tight">{msg.user}</span>
                        <span className="text-[10px] font-bold text-slate-300">{msg.time}</span>
                     </div>
                     <div className={`p-4 rounded-3xl text-sm font-semibold leading-relaxed shadow-sm border ${
                        msg.me ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' : 
                        msg.bot ? 'bg-indigo-50 text-indigo-900 border-indigo-100 rounded-tl-none' :
                        'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                     }`}>
                        {msg.content}
                     </div>
                     {!msg.me && msg.bot && (
                        <div className="mt-3 flex gap-2">
                           <button className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 uppercase hover:bg-indigo-50 transition-colors">Analyze correlation</button>
                           <button className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 uppercase hover:bg-indigo-50 transition-colors">Ignore</button>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>

         {/* Input Area */}
         <div className="p-8 pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-2 px-6 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
               <button className="text-slate-400 hover:text-[#091426] p-2 hover:bg-slate-50 rounded-xl transition-all"><Paperclip size={20} /></button>
               <input 
                  type="text" 
                  placeholder="Type a secure message to Audit Team Alpha..." 
                  className="flex-1 py-4 text-sm font-semibold outline-none placeholder:text-slate-300"
               />
               <div className="flex items-center gap-2">
                  <button className="text-slate-300 hover:text-slate-600 p-2"><Smile size={20} /></button>
                  <button className="w-12 h-12 bg-[#091426] text-blue-400 rounded-2xl flex items-center justify-center hover:shadow-xl hover:shadow-slate-900/10 active:scale-95 transition-all">
                     <Send size={20} />
                  </button>
               </div>
            </div>
            <div className="flex justify-center mt-3">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Shield size={10} /> Cryptographically secured with AES-256 for AuditAX High-Security Tunnels</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const BotIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export default TeamCollaboration;
