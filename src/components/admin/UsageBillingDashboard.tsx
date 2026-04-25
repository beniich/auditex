import React, { useState } from 'react';
import { useOrganization, Protect } from '@clerk/clerk-react';
import { Download, CreditCard, PieChart, Database, Cpu, TrendingUp, History, Info, Zap, Clock, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BillingService } from '../../services/BillingService';
import { useApiQuery } from '../../hooks/useApiQuery';

const StatCard = ({ title, value, sub, icon: Icon, children }: any) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div>
         <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{title}</span>
         <div className="text-2xl font-black text-[#091426] mt-1">{value}</div>
         <div className="text-[10px] font-bold text-slate-400 mt-0.5">{sub}</div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#091426] group-hover:text-blue-400 transition-all">
         <Icon size={20} />
      </div>
    </div>
    <div className="flex-1 mt-2">
       {children}
    </div>
  </div>
);

export const UsageBillingDashboard = () => {
  const { organization, isLoaded } = useOrganization();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: invoices = [], isLoading: isInvoicesLoading } = useApiQuery(
    ['billing-invoices'],
    () => BillingService.getInvoices()
  );

  const { data: usage = {}, isLoading: isUsageLoading } = useApiQuery(
    ['billing-usage'],
    () => BillingService.getUsageStats()
  );

  if (!isLoaded) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200 animate-pulse">
        <div className="h-20 bg-white border-b border-slate-200 p-8"></div>
        <div className="flex-1 p-8 gap-8 grid grid-cols-[320px_1fr]">
          <div className="bg-slate-200 rounded-3xl h-[400px]"></div>
          <div className="bg-slate-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const plan = (organization?.publicMetadata?.plan as string) || 'Startup';

  const handleUpgrade = async () => {
    try {
      setIsRedirecting(true);
      const data = await BillingService.createCheckoutSession('enterprise_annual');
      window.location.href = data.url;
    } catch (e) {
      console.error('Failed to start checkout', e);
      setIsRedirecting(false);
    }
  };

  const handlePortal = async () => {
    try {
      const data = await BillingService.getCustomerPortalUrl();
      window.location.href = data.url;
    } catch (e) {
      console.error('Failed to open portal', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-8 border-b border-slate-200 relative overflow-hidden">
         <div className="flex justify-between items-center relative z-10">
            <div>
               <h2 className="text-2xl font-black text-[#091426] tracking-tight">Usage & Billing Dashboard</h2>
               <p className="text-slate-500 text-sm font-medium mt-1">Monitor infrastructure consumption and manage your subscription.</p>
            </div>
            <div className="flex gap-3">
               {plan !== 'Enterprise' && (
                  <button 
                    onClick={handleUpgrade} 
                    disabled={isRedirecting}
                    className="px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    {isRedirecting ? <Clock className="animate-spin" size={14} /> : <Zap size={14} />}
                    Upgrade to Enterprise
                  </button>
               )}
            </div>
         </div>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 overflow-hidden">
         {/* Sidebar: Plan Summary */}
         <div className="flex flex-col gap-6">
            <div className="bg-[#091426] rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/10 flex flex-col gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
               
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Plan</label>
                  <div className="text-3xl font-black tracking-tight">{plan}</div>
                  <div className="text-xs font-bold text-blue-400 mt-1">{plan === 'Enterprise' ? 'Annual Enterprise License' : 'Standard Monthly Tier'}</div>
               </div>

               <div className="h-px bg-white/10"></div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400 font-bold">Next Invoice</span>
                     <span className="font-black">{plan === 'Enterprise' ? '$4,999.00' : '$99.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 font-bold">Billing Date</span>
                     <span className="text-slate-300">Dec 15, 2024</span>
                  </div>
               </div>

               <button className="w-full py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Download size={14} /> Download Invoice
               </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                     <CreditCard size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Method</span>
                     <span className="text-sm font-bold text-[#091426]">Visa ending in 4242</span>
                  </div>
               </div>
               <Protect
                  role="org:admin"
                  fallback={(
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col gap-2">
                       <div className="flex items-center gap-2 text-rose-600 font-black text-[8px] uppercase tracking-widest">
                          <AlertCircle size={12} /> Read Only Access
                       </div>
                       <p className="text-[10px] text-rose-800 font-medium leading-tight">Billing management restricted to Organization Admins.</p>
                    </div>
                  )}
               >
                  <button 
                    onClick={handlePortal}
                    className="w-full py-2.5 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#091426] hover:text-white hover:border-[#091426] transition-all flex items-center justify-center gap-2 group"
                  >
                     Stripe Customer Portal <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
               </Protect>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard title="AI Usage (Tokens)" value={usage.tokens || '0'} sub="Tokens utilized this cycle" icon={Cpu}>
                  <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-100 to-transparent"></div>
                     <div className="absolute bottom-4 left-0 w-full h-1 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" style={{ clipPath: 'polygon(0 80%, 20% 40%, 40% 60%, 60% 20%, 80% 50%, 100% 10%)' }}></div>
                  </div>
               </StatCard>
               
               <StatCard title="Ledger Storage (GB)" value={usage.storage || '0 GB'} sub="Audit data encrypted" icon={Database}>
                  <div className="flex items-end gap-1.5 h-20 px-2 pb-2">
                     {[40, 70, 50, 90, 60, 85, 45].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-100 rounded-sm hover:bg-blue-500 transition-colors" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
               </StatCard>

               <StatCard title="Active Entities" value={usage.entities || '0'} sub="Licensed subsidiaries" icon={PieChart}>
                  <div className="flex justify-center items-center h-20">
                     <div className="w-16 h-16 rounded-full border-[6px] border-slate-100 relative">
                        <div className="absolute inset-[-6px] rounded-full border-[6px] border-blue-600 border-t-transparent border-l-transparent" style={{ transform: 'rotate(45deg)' }}></div>
                        <div className="absolute inset-[-6px] rounded-full border-[6px] border-blue-400 border-t-transparent border-r-transparent border-b-transparent" style={{ transform: 'rotate(180deg)' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-[10px] text-blue-600">82%</div>
                     </div>
                  </div>
               </StatCard>
            </div>

             <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-[#091426]">Billing History (Stripe Vault)</h3>
                  <TrendingUp className="text-emerald-500" size={20} />
               </div>
               
               <div className="space-y-4">
                  {isInvoicesLoading ? (
                    <div className="text-center text-slate-400 py-10 uppercase text-[10px] font-black tracking-widest">Retrieving Invoices...</div>
                  ) : invoices.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 uppercase text-[10px] font-black tracking-widest">No Billing History Found</div>
                  ) : invoices.map((tx: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent shadow-sm hover:border-slate-100 hover:shadow-md group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                              <History size={18} />
                           </div>
                           <div>
                              <div className="text-sm font-black text-[#091426]">{tx.label}</div>
                              <div className="flex gap-3 mt-0.5">
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.date}</div>
                                 <div className="text-[10px] font-mono text-slate-300">{tx.id}</div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-sm font-black text-[#091426]">{tx.amount}</div>
                           <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{tx.status}</span>
                           <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                              <Download size={16} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <Info size={18} className="text-slate-400" />
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed">Usage-based consumption is synchronized every 24h with Stripe Metered Billing. Managed by {organization?.name || 'Organization Admin'}.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default UsageBillingDashboard;
