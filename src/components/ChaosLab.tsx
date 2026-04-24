import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ScanLine,
  RefreshCw,
  AlertCircle,
  Terminal,
  Skull,
  ShieldCheck,
  Fingerprint,
  Lock,
  CircuitBoard,
  RotateCcw,
  Bug
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChaosService } from '../services/ChaosService';
import { toast } from '../hooks/useToast';
import { SafeMarkdown } from './SafeMarkdown';
import { useTranslation } from 'react-i18next';

interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'ATTACK' | 'DETECTION' | 'CORRECTION' | 'SUCCESS';
  message: string;
}

const typeStyle: Record<LogEntry['type'], string> = {
  INFO:       'text-slate-400',
  ATTACK:     'text-red-400',
  DETECTION:  'text-amber-400',
  CORRECTION: 'text-blue-400',
  SUCCESS:    'text-emerald-400'
};

const typePrefix: Record<LogEntry['type'], string> = {
  INFO:       '[INFO]     ',
  ATTACK:     '[ATTACK]   ',
  DETECTION:  '[DETECTED] ',
  CORRECTION: '[FIXED]    ',
  SUCCESS:    '[OK]       '
};

export const ChaosLab: React.FC = () => {
  const { t } = useTranslation('chaos');
  const queryClient = useQueryClient();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [phase, setPhase] = useState<'IDLE' | 'ATTACKING' | 'SCANNING' | 'CORRECTED'>('IDLE');
  const [xssPayload, setXssPayload] = useState('');
  const [xssResult, setXssResult] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      time: new Date().toLocaleTimeString(),
      type,
      message
    }]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['chaos-status'],
    queryFn: ChaosService.getStatus,
    refetchInterval: 15000
  });

  const corruptMutation = useMutation({
    mutationFn: ChaosService.injectCorruption,
    onMutate: () => {
      setPhase('ATTACKING');
      addLog('INFO', t('logs.initiated'));
      addLog('ATTACK', t('logs.simulating'));
    },
    onSuccess: (data) => {
      addLog('ATTACK', t('logs.target_locked', { audit: data.auditId?.slice(0, 8), event: data.targetEventId?.slice(0, 8) }));
      addLog('ATTACK', t('logs.hash_overwritten', { hash: data.corruptedHash }));
      addLog('INFO', t('logs.watchdog_trigger'));
      toast.error('⚠ Hash corruption injected.', 'Red Team');
      setTimeout(() => scanMutation.mutate(), 1500);
    },
    onError: (err: any) => {
      addLog('INFO', `Attack failed: ${err.message}`);
      setPhase('IDLE');
    }
  });

  const scanMutation = useMutation({
    mutationFn: ChaosService.triggerScan,
    onMutate: () => {
      setPhase('SCANNING');
      addLog('INFO', t('logs.watchdog_run'));
    },
    onSuccess: (data) => {
      const compromised = data.reports?.filter((r: any) => !r.valid) || [];
      const healthy    = data.reports?.filter((r: any) => r.valid) || [];

      addLog('INFO', t('logs.scan_complete', { count: data.reports?.length || 0 }));
      healthy.forEach((r: any) => addLog('SUCCESS', t('logs.chain_valid', { id: r.auditId.slice(0, 8), count: r.eventCount })));
      compromised.forEach((r: any) => {
        addLog('DETECTION', t('logs.chain_rupture', { id: r.auditId.slice(0, 8), block: r.compromisedAt?.slice(0, 8) }));
        addLog('CORRECTION', t('logs.correction_injected'));
        addLog('CORRECTION', t('logs.re_sealed'));
      });

      if (compromised.length > 0) {
        setPhase('CORRECTED');
        toast.success('Chain rupture detected.', 'Watchdog');
      } else {
        setPhase('IDLE');
        toast.success('Integrity confirmed.', 'Watchdog');
      }
      refetchStatus();
      queryClient.invalidateQueries({ queryKey: ['chaos-status'] });
    }
  });

  const resetMutation = useMutation({
    mutationFn: ChaosService.resetCorrectionBlocks,
    onSuccess: (data) => {
      addLog('INFO', t('logs.reset_done', { count: data.deletedCorrectionBlocks }));
      setPhase('IDLE');
      setLogs([]);
      refetchStatus();
      toast.info('Chaos lab reset.', 'Lab Reset');
    }
  });

  const handleXssTest = (payload: string) => {
    setXssPayload(payload);
    addLog('INFO', `XSS Pressure Test...`);
    setXssResult(payload);
    addLog('SUCCESS', t('logs.sanitization_applied'));
    toast.success('Sanitization verified.', 'XSS Scanner');
  };

  const isAttacking = phase === 'ATTACKING';
  const isScanning  = phase === 'SCANNING';

  return (
    <div className="min-h-screen bg-[#050d1a] p-6 lg:p-10 font-mono cursor-default">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Header */}
        <div className="relative border border-red-900/50 rounded-[2rem] p-8 lg:p-10 overflow-hidden bg-black/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.08),transparent_60%)]" />
          <div className="absolute top-6 right-8 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${phase === 'IDLE' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {phase === 'IDLE' ? t('status.standby') : phase === 'ATTACKING' ? t('status.attacking') : phase === 'SCANNING' ? t('status.scanning') : t('status.corrected')}
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600/20 border border-red-900/50 text-red-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Skull size={10} /> {t('header.module')}
              </span>
              <span className="text-slate-600 text-[10px] tracking-widest uppercase">{t('header.sprint')}</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
              {t('header.title')}<span className="text-red-500">_</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-[11px] leading-relaxed font-sans">
              {t('header.subtitle')}
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('status.healthy'), val: status?.healthy ?? 0, icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-900/30', bg: 'bg-emerald-500/10' },
            { label: t('status.compromised'), val: status?.compromised ?? 0, icon: AlertCircle, color: 'text-red-400', border: 'border-red-900/30', bg: 'bg-red-500/10' },
            { label: t('status.correction_blocks'), val: status?.correctionBlocks ?? 0, icon: Fingerprint, color: 'text-blue-400', border: 'border-blue-900/30', bg: 'bg-blue-500/10' },
            { label: t('status.total_audits'), val: status?.totalAudits ?? 0, icon: CircuitBoard, color: 'text-slate-400', border: 'border-slate-700', bg: 'bg-slate-800/50' },
          ].map((s, i) => (
            <motion.div key={i} className={`border ${s.border} ${s.bg} rounded-[1.5rem] p-6 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                <p className={`text-2xl font-black ${s.color} tracking-tighter`}>
                  {statusLoading ? '...' : s.val}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 border border-slate-800 rounded-[2rem] overflow-hidden bg-black/60">
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-900/80 border-b border-slate-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                <Terminal size={10} className="inline mr-2" />auditax-red-team — chaos_simulator@v1.0
              </span>
            </div>

            <div className="p-6 h-[480px] overflow-y-auto space-y-1 text-[11px] leading-relaxed">
              {logs.length === 0 ? (
                <p className="text-slate-700 italic">{t('logs.awaiting')}</p>
              ) : (
                logs.map(log => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className={typeStyle[log.type]}>
                    <span className="text-slate-700 mr-2">{log.time}</span>
                    <span className="opacity-60">{typePrefix[log.type]}</span>
                    {log.message}
                  </motion.div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="border border-slate-800 rounded-[1.5rem] p-6 bg-slate-900/50">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{t('phases.indicator_label')}</p>
              <div className="flex justify-between items-center">
                {(['IDLE', 'ATTACKING', 'SCANNING', 'CORRECTED'] as const).map((p, i) => (
                  <div key={p} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-black transition-all ${
                      phase === p ? 'border-red-500 bg-red-500/20 text-red-400' :
                      (['IDLE', 'ATTACKING', 'SCANNING', 'CORRECTED'].indexOf(phase) > i) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                      'border-slate-700 text-slate-600'
                    }`}>
                      {i + 1}
                    </div>
                    <p className={`text-[7px] font-black uppercase tracking-wider ${phase === p ? 'text-red-400' : 'text-slate-600'}`}>{t(`phases.${p.toLowerCase()}`)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => corruptMutation.mutate(undefined)}
                disabled={isAttacking || isScanning}
                className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                {isAttacking ? <RefreshCw size={14} className="animate-spin" /> : <Skull size={14} />}
                {isAttacking ? t('actions.injecting') : t('actions.inject')}
              </button>

              <button
                onClick={() => scanMutation.mutate()}
                disabled={isScanning}
                className="w-full py-5 bg-amber-600/20 border border-amber-900/50 text-amber-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <ScanLine size={14} />}
                {isScanning ? t('actions.scanning') : t('actions.scan')}
              </button>

              <button
                onClick={() => resetMutation.mutate()}
                disabled={isAttacking || isScanning}
                className="w-full py-5 bg-slate-800 text-slate-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                <RotateCcw size={14} />
                {t('actions.reset')}
              </button>
            </div>

            <div className="border border-blue-900/30 bg-blue-500/5 rounded-[1.5rem] p-6 space-y-4">
              <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Lock size={10} /> {t('doctrine.title')}
              </h3>
              <div className="space-y-3 text-[10px] text-slate-500 leading-relaxed font-sans">
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 1:</span> {t('doctrine.rule1')}</p>
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 2:</span> {t('doctrine.rule2')}</p>
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 3:</span> {t('doctrine.rule3')}</p>
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 4:</span> {t('doctrine.rule4')}</p>
              </div>
            </div>

            <div className="border border-purple-900/30 bg-purple-500/5 rounded-[1.5rem] p-6 space-y-4">
              <h3 className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Bug size={10} /> {t('xss.title')}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                   {[
                     { label: t('xss.basic'), payload: "<img src=x onerror=alert('XSS')>" },
                     { label: t('xss.markdown'), payload: "[Click Me](javascript:alert('Hacked'))" },
                     { label: t('xss.script'), payload: "<script>document.cookie.steal()</script>" },
                     { label: t('xss.svg'), payload: "<svg onload=alert(1)>" }
                   ].map((item, i) => (
                     <button key={i} onClick={() => handleXssTest(item.payload)} className="py-2 bg-purple-500/10 border border-purple-900/50 rounded-lg text-[7px] font-black uppercase text-purple-400">
                        {item.label}
                     </button>
                   ))}
                </div>
                
                {xssPayload && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[7px] font-black text-slate-500 uppercase">{t('xss.input')}</p>
                    <div className="p-2 bg-black border border-slate-800 rounded text-[8px] text-red-400 break-all h-10 overflow-auto">
                      <code>{xssPayload}</code>
                    </div>
                    <p className="text-[7px] font-black text-slate-500 uppercase mt-2">{t('xss.output')}</p>
                    <div className="p-3 bg-white/5 border border-emerald-900/30 rounded text-[9px] text-white min-h-[60px]">
                      <SafeMarkdown content={xssResult} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
          <span className="flex items-center gap-2"><ShieldAlert size={12} className="text-red-900" /> RED TEAM MOD — AuditAX Sprint 38</span>
          <span>Doctrine v1.0 // Chain Monitor Active</span>
        </div>
      </div>
    </div>
  );
};

export default ChaosLab;
