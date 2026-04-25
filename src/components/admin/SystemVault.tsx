import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Lock, 
  RefreshCw,
  Search,
  Key,
  Fingerprint,
  Eye,
  Cpu,
  ShieldAlert,
  Copy,
  Shield,
  FileLock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApiQuery } from '../../hooks/useApiQuery';
import { VaultService } from '../../services/VaultService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../hooks/useToast';
import { SkeletonTable } from '../common/Skeleton';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

export const SystemVault: React.FC = () => {
  const { t } = useTranslation('vault');
  const [showSecret, setShowSecret] = useState<{ id: string, name: string, value: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: secrets = [], isLoading } = useApiQuery(
    ['vault-keys'],
    () => VaultService.getKeys(),
    { refetchInterval: 15000 }
  );

  const rotateMutation = useMutation({
    mutationFn: (id: string) => VaultService.rotateKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-keys'] });
      toast.success(t('toast.rotation_success'), 'Vault Security');
    }
  });

  const accessMutation = useMutation({
    mutationFn: (id: string) => VaultService.accessKey(id),
    onSuccess: (data, variables) => {
      const key = secrets.find((s: any) => s.id === variables);
      setShowSecret({ id: data.id, name: key?.name || 'Unknown Key', value: data.value });
      toast.info(t('toast.access_info'), 'Security Audit');
    }
  });

  const createMutation = useMutation({
    mutationFn: () => VaultService.createKey(`Key_${Math.floor(Math.random()*1000)}`, 'AES-256-GCM'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-keys'] });
      toast.success(t('toast.deploy_success'), 'Vault Security');
    }
  });

  return (
    <PageWrapper>
      {/* Header Block */}
      <PageHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
        badge={t('header.module')}
        icon={Lock}
        breadcrumb={['Admin', 'Security', 'Vault']}
        actions={
          <Button 
            variant="primary" 
            onClick={() => createMutation.mutate()}
            loading={createMutation.isPending}
            icon={ShieldCheck}
          >
            {t('header.deploy')}
          </Button>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        {/* Main Registry */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <SectionCard 
            title={t('registry.title')} 
            subtitle={t('registry.authority')}
            padding="none"
            actions={
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                 <input className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 w-64 transition-all" placeholder={t('registry.filter')} />
              </div>
            }
          >
             <div className="divide-y divide-slate-50 mt-4">
                {isLoading ? (
                   <div className="p-10"><SkeletonTable /></div>
                ) : (
                   secrets.map((secret: any) => (
                      <div key={secret.id} className="p-8 hover:bg-slate-50/50 flex items-center justify-between transition-all group">
                         <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-[1.25rem] shadow-sm group-hover:scale-110 transition-transform ${
                              secret.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                               <Fingerprint size={28} />
                            </div>
                            <div className="flex flex-col">
                               <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[10px] font-mono font-black text-slate-400">ID: {secret.id.slice(0, 13)}...</span>
                                  <StatusBadge label={t(`registry.status.${secret.status.toLowerCase()}`)} variant={secret.status === 'ACTIVE' ? 'success' : 'info'} className="scale-75" />
                               </div>
                               <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">{secret.name}</h4>
                               <div className="flex gap-4 mt-2">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Cpu size={12} /> {secret.type}</span>
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <RefreshCw size={12} /> {secret.lastUsedAt ? t('registry.used', { time: new Date(secret.lastUsedAt).toLocaleTimeString() }) : t('registry.never_used')}
                                  </span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <Button variant="secondary" size="sm" icon={Eye} onClick={() => accessMutation.mutate(secret.id)} loading={accessMutation.isPending} />
                            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => rotateMutation.mutate(secret.id)} loading={rotateMutation.isPending} />
                         </div>
                      </div>
                   ))
                )}
             </div>
          </SectionCard>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <SectionCard title={t('metrics.health_index')} padding="large">
              <div className="flex flex-col items-center mt-4">
                 <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                       <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={440} strokeDashoffset={440 * (1 - 0.98)} className="text-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-1000" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-4xl font-black text-slate-900 tracking-tighter">98.4<span className="text-sm opacity-30">%</span></span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('metrics.entropy')}</span>
                    </div>
                 </div>
                 <div className="w-full space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50 pb-3">
                       <span className="text-slate-400">{t('metrics.latency')}</span>
                       <span className="text-slate-900">12ms</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50 pb-3">
                       <span className="text-slate-400">{t('metrics.sessions')}</span>
                       <span className="text-slate-900">4/1000</span>
                    </div>
                 </div>
              </div>
           </SectionCard>

           <SectionCard variant="dark" title={t('stream.title')}>
              <div className="space-y-4 mt-6 relative z-10">
                 {[
                   { user: 'sys_admin_7', action: 'DECRYPT', target: 'Ledger_Main', ts: t('stream.just_now'), ok: true },
                   { user: 'stakeholder_4', action: 'SIGN', target: 'Q3_Report', ts: t('stream.ago', { time: '2m' }), ok: true },
                   { user: 'unauth_0', action: 'ACCESS', target: 'Root_Secret', ts: t('stream.ago', { time: '1h' }), ok: false },
                 ].map((log, i) => (
                   <div key={i} className={`p-4 rounded-2xl border ${log.ok ? 'bg-white/5 border-white/5' : 'bg-red-500/10 border-red-500/20'} flex items-start gap-4 hover:bg-white/10 transition-colors cursor-pointer`}>
                      <div className={log.ok ? 'text-blue-400' : 'text-red-500'}>
                         {log.ok ? <Shield size={16} /> : <ShieldAlert size={16} />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">{log.user}</p>
                            <p className="text-[8px] font-mono font-bold text-slate-500">{log.ts}</p>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.action} → {log.target}</p>
                      </div>
                   </div>
                 ))}
                 <Button variant="ghost" className="w-full text-slate-500 hover:text-white mt-4 border-white/5 bg-white/5 uppercase tracking-[0.3em] text-[9px]">{t('stream.review')}</Button>
              </div>
           </SectionCard>

           <SectionCard className="border-emerald-100 bg-emerald-50/30">
              <div className="text-center">
                 <ShieldCheck size={32} className="text-emerald-500 mx-auto mb-4 animate-pulse" />
                 <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.2em]">{t('compliance.zero_trust')}</h4>
                 <p className="text-[9px] font-bold text-emerald-700/60 uppercase mt-2 tracking-widest leading-relaxed">{t('compliance.structural')}</p>
              </div>
           </SectionCard>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
               <FileLock size={20} className="text-slate-900" />
               <p className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">{t('footer.state')}</p>
            </div>
            <StatusBadge label={t('footer.protocol', { days: 89 })} variant="info" className="scale-90" />
         </div>
         <p className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.4em]">
            VAULT_EPOCH: {Date.now()}
         </p>
      </div>

      <AnimatePresence>
        {showSecret && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/60" onClick={() => setShowSecret(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[4rem] p-12 lg:p-20 max-w-4xl w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
               <div className="text-center space-y-10 relative z-10">
                  <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><Lock size={40} /></div>
                  <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">{t('modal.id_prefix')}</h3>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic underline decoration-blue-200 underline-offset-8">{showSecret?.name}</h2>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] group cursor-pointer hover:border-blue-200 transition-all">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{t('modal.ciphertext')}</p>
                     <p className="font-mono text-lg font-black text-slate-900 break-all group-hover:text-blue-600 transition-colors uppercase select-all">{showSecret?.value}</p>
                     <Button variant="primary" className="mt-10 mx-auto" icon={Copy} onClick={() => {
                        navigator.clipboard.writeText(showSecret?.value);
                        toast.success('Key copied to vault clipboard');
                     }}>
                        {t('modal.copy')}
                     </Button>
                  </div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">{t('modal.warning')}</p>
                  <button onClick={() => setShowSecret(null)} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] transition-colors pt-6">{t('modal.terminate')}</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default SystemVault;
