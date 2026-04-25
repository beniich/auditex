import React, { useState } from 'react';
import { useOrganization, Protect } from '@clerk/clerk-react';
import { Download, CreditCard, PieChart, Database, Cpu, TrendingUp, History, Info, Zap, Clock, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BillingService } from '../../services/BillingService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

export const UsageBillingDashboard: React.FC = () => {
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
      <PageWrapper>
        <div className="animate-pulse space-y-8">
           <div className="h-40 bg-slate-100 rounded-[3rem]" />
           <div className="grid grid-cols-12 gap-8">
              <div className="col-span-4 h-96 bg-slate-50 rounded-[3rem]" />
              <div className="col-span-8 h-96 bg-slate-50 rounded-[3rem]" />
           </div>
        </div>
      </PageWrapper>
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
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Usage & Billing Dashboard"
        subtitle="Monitor infrastructure consumption and manage your subscription via the Stripe Vault."
        badge="Financial Operations"
        icon={CreditCard}
        breadcrumb={['Admin', 'Finance', 'Billing']}
        actions={
          <div className="flex gap-4">
             {plan !== 'Enterprise' && (
                <Button 
                  variant="primary" 
                  onClick={handleUpgrade} 
                  loading={isRedirecting}
                  icon={Zap}
                >
                  Upgrade to Enterprise
                </Button>
             )}
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
         {/* Sidebar: Plan Summary */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <SectionCard variant="dark" padding="large">
               <div className="relative z-10 flex flex-col gap-10">
                  <div>
                     <label className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em] block mb-3 italic">Active Plan</label>
                     <div className="text-4xl font-black tracking-tighter uppercase">{plan}</div>
                     <StatusBadge 
                        label={plan === 'Enterprise' ? 'Annual License' : 'Standard Monthly'} 
                        variant="info" 
                        className="mt-3 bg-white/5 border-white/10 text-white" 
                     />
                  </div>

                  <div className="h-px bg-white/5 shadow-2xl"></div>

                  <div className="space-y-6">
                     <div className="flex justify-between items-center text-sm font-black uppercase tracking-tight">
                        <span className="text-slate-400">Next Invoice</span>
                        <span className="text-white text-lg">{plan === 'Enterprise' ? '$4,999.00' : '$99.00'}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                        <span>Cycle Resets</span>
                        <span className="text-blue-400">Dec 15, 2024</span>
                     </div>
                  </div>

                  <Button variant="secondary" className="w-full py-5 bg-white/5 border-white/10 text-white hover:bg-white/10 shadow-2xl" icon={Download}>
                     Generate Breakdown
                  </Button>
               </div>
               <div className="absolute top-0 right-0 p-16 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            </SectionCard>

            <SectionCard padding="large">
               <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                        <CreditCard size={28} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Method</span>
                        <span className="text-sm font-black text-slate-900 italic uppercase">Visa •••• 4242</span>
                     </div>
                  </div>
                  
                  <Protect 
                     role="org:admin"
                     fallback={
                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-red-600 font-black text-[9px] uppercase tracking-widest">
                              <AlertCircle size={14} /> Root Access Required
                           </div>
                           <p className="text-[10px] text-red-900/60 font-bold uppercase leading-tight tracking-tight">
                              Subscription management restricted to Organization Owners.
                           </p>
                        </div>
                     }
                  >
                     <Button variant="secondary" className="w-full py-4 uppercase tracking-[0.2em] text-[10px]" icon={ExternalLink} onClick={handlePortal}>
                        Stripe Customer Portal
                     </Button>
                  </Protect>
               </div>
            </SectionCard>
         </div>

         {/* Content Area */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: 'AI Tokens', value: usage.tokens || '0', sub: 'Cycle Consumption', icon: Cpu, variant: 'brand' as const },
                  { title: 'Vault Storage', value: usage.storage || '0 GB', sub: 'Audit Forensic Data', icon: Database, variant: 'info' as const },
                  { title: 'Entities', value: usage.entities || '0', sub: 'Active Organizations', icon: PieChart, variant: 'success' as const },
               ].map((stat, i) => (
                  <SectionCard key={i} padding="medium" className="group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:text-blue-600 transition-colors">
                           <stat.icon size={20} />
                        </div>
                        <StatusBadge label={stat.variant.toUpperCase()} variant={stat.variant} className="scale-75" />
                     </div>
                     <div className="text-3xl font-black text-slate-900 tracking-tighter mb-2 italic">{stat.value}</div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</span>
                     <div className="mt-8 h-12 bg-slate-50/50 rounded-xl overflow-hidden relative">
                         {i === 0 && <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 shadow-inner" style={{ width: '65%' }} />}
                         {i === 1 && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 shadow-inner" style={{ width: '40%' }} />}
                         {i === 2 && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 shadow-inner" style={{ width: '85%' }} />}
                     </div>
                  </SectionCard>
               ))}
            </div>

            <SectionCard 
               title="Financial History" 
               subtitle="Secure ledger of Stripe transactional records"
               padding="none"
               actions={<Button variant="ghost" size="sm" icon={TrendingUp}>Analytics</Button>}
            >
               <div className="mt-4 px-4 pb-4">
                  {isInvoicesLoading ? (
                     <div className="p-20 flex flex-col items-center gap-4">
                        <Clock className="animate-spin text-blue-600" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticating Vault...</p>
                     </div>
                  ) : invoices.length === 0 ? (
                     <div className="p-20 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No transactional data streams detected</p>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        {invoices.map((tx: any, i: number) => (
                           <div key={i} className="flex flex-col md:flex-row justify-between items-center p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-blue-200 rounded-[2rem] transition-all group gap-6">
                              <div className="flex items-center gap-6 flex-1">
                                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                    <History size={24} />
                                 </div>
                                 <div className="flex flex-col gap-1">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{tx.label}</h4>
                                    <div className="flex flex-wrap gap-4">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.date}</span>
                                       <span className="text-[10px] font-mono font-bold text-slate-300">ID: {tx.id}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-10 shrink-0">
                                 <div className="text-lg font-black text-slate-900 italic">{tx.amount}</div>
                                 <StatusBadge label={tx.status} variant="success" className="min-w-[80px]" />
                                 <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm">
                                    <Download size={20} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
               
               <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center gap-6">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50 text-blue-600"><Info size={20} /></div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                     Usage-based consumption is synchronized every 24h with <span className="text-slate-900 font-black">Stripe Metered Billing Engine</span>. 
                     Protocol managed by {organization?.name || 'System Operator'}.
                  </p>
               </div>
            </SectionCard>
         </div>
      </div>
    </PageWrapper>
  );
};

export default UsageBillingDashboard;
