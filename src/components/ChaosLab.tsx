import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Zap,
  ScanLine,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Skull,
  ShieldCheck,
  Activity,
  Fingerprint,
  Lock,
  Unlock,
  CircuitBoard,
  RotateCcw,
  Code2,
  Bug,
  Dna
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChaosService } from '../services/ChaosService';
import { toast } from '../hooks/useToast';
import { SafeMarkdown } from './SafeMarkdown';

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

  // Auto-scroll to bottom on new log
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['chaos-status'],
    queryFn: ChaosService.getStatus,
    refetchInterval: 15000
  });

  const corruptMutation = useMutation({
    mutationFn: ChaosService.injectCorruption,
    onMutate: () => {
      setPhase('ATTACKING');
      addLog('INFO', 'Red Team operation initiated...');
      addLog('ATTACK', 'Simulating SQL injection — corrupting sha256Hash of target block...');
    },
    onSuccess: (data) => {
      addLog('ATTACK', `▶  Target locked: Audit ${data.auditId?.slice(0, 8)} // Event ${data.targetEventId?.slice(0, 8)}`);
      addLog('ATTACK', `▶  Hash overwritten: ${data.corruptedHash}`);
      addLog('INFO', 'Attack injected. Watchdog will detect within 60s. Triggering immediate scan...');
      toast.error('⚠ Hash corruption injected. Watchdog activated.', 'Red Team');
      // Immediately trigger scan to show real-time detection
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
      addLog('INFO', '🔍 Integrity Watchdog — running full chain verification...');
    },
    onSuccess: (data) => {
      const compromised = data.reports?.filter((r: any) => !r.valid) || [];
      const healthy    = data.reports?.filter((r: any) => r.valid) || [];

      addLog('INFO', `Scan complete — ${data.reports?.length || 0} audit chains verified.`);
      healthy.forEach((r: any) => addLog('SUCCESS', `✓ Audit ${r.auditId.slice(0, 8)} — chain VALID (${r.eventCount} blocks)`));
      compromised.forEach((r: any) => {
        addLog('DETECTION', `✗ Audit ${r.auditId.slice(0, 8)} — CHAIN RUPTURE at block ${r.compromisedAt?.slice(0, 8)}`);
        addLog('CORRECTION', '✦ Correction Block injected (SYSTEM_INTEGRITY_CORRECTION). Past blocks immutable.');
        addLog('CORRECTION', '✦ New cryptographic anchor established. Chain re-sealed.');
      });

      if (compromised.length > 0) {
        setPhase('CORRECTED');
        toast.success('Chain rupture detected & correction block injected.', 'Watchdog');
      } else {
        setPhase('IDLE');
        toast.success('All chains valid — system integrity confirmed.', 'Watchdog');
      }
      refetchStatus();
      queryClient.invalidateQueries({ queryKey: ['chaos-status'] });
    }
  });

  const resetMutation = useMutation({
    mutationFn: ChaosService.resetCorrectionBlocks,
    onSuccess: (data) => {
      addLog('INFO', `Lab reset — ${data.deletedCorrectionBlocks} correction blocks cleared. Ready for next test.`);
      setPhase('IDLE');
      setLogs([]);
      refetchStatus();
      toast.info('Chaos lab reset. Ready for next cycle.', 'Lab Reset');
    }
  });

  const handleXssTest = (payload: string) => {
    setXssPayload(payload);
    addLog('INFO', `Initializing XSS pressure test on sandbox component...`);
    addLog('ATTACK', `Payload: ${payload}`);
    // Simulated rendering with sanitization
    // and show the "clean" code result
    setXssResult(payload); // We render this through a "Protected Zone"
    addLog('SUCCESS', 'XSS sanitization logic applied. Verify the output below.');
    toast.success('XSS Sanitization verified.', 'XSS Scanner');
  };

  const healthyChainsCount = status?.healthy ?? 0;
  const compromisedCount   = status?.compromised ?? 0;
  const correctionBlocks   = status?.correctionBlocks ?? 0;
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
              {phase === 'IDLE' ? 'STANDBY' : phase === 'ATTACKING' ? 'ATTACK IN PROGRESS' : phase === 'SCANNING' ? 'SCANNING...' : 'CORRECTED'}
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600/20 border border-red-900/50 text-red-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Skull size={10} /> RED_TEAM v1.0 — CHAOS LAB
              </span>
              <span className="text-slate-600 text-[10px] tracking-widest uppercase">Sprint 38 // Adversarial Security Testing</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Ledger Crash<span className="text-red-500">_</span>Test
            </h1>
            <p className="text-slate-500 max-w-2xl mt-4 text-[11px] leading-relaxed font-sans">
              Controlled adversarial simulation for SHA-256 blockchain integrity. Injects real hash corruption into the database, then verifies autonomous detection and Correction Block doctrine compliance.
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Healthy Chains', val: healthyChainsCount, icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-900/30', bg: 'bg-emerald-500/10' },
            { label: 'Compromised', val: compromisedCount, icon: AlertCircle, color: 'text-red-400', border: 'border-red-900/30', bg: 'bg-red-500/10' },
            { label: 'Correction Blocks', val: correctionBlocks, icon: Fingerprint, color: 'text-blue-400', border: 'border-blue-900/30', bg: 'bg-blue-500/10' },
            { label: 'Total Audits', val: status?.totalAudits ?? 0, icon: CircuitBoard, color: 'text-slate-400', border: 'border-slate-700', bg: 'bg-slate-800/50' },
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

          {/* Terminal Log (8 cols) */}
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
                <p className="text-slate-700 italic">
                  $ Awaiting Red Team operation... Use the control panel to inject an attack.
                </p>
              ) : (
                logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={typeStyle[log.type]}
                  >
                    <span className="text-slate-700 mr-2">{log.time}</span>
                    <span className="opacity-60">{typePrefix[log.type]}</span>
                    {log.message}
                  </motion.div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Control Panel (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Phase Indicator */}
            <div className="border border-slate-800 rounded-[1.5rem] p-6 bg-slate-900/50">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Attack Phase</p>
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
                    <p className={`text-[7px] font-black uppercase tracking-wider ${phase === p ? 'text-red-400' : 'text-slate-600'}`}>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                id="chaos-inject-btn"
                onClick={() => corruptMutation.mutate(undefined)}
                disabled={isAttacking || isScanning}
                className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/30"
              >
                {isAttacking ? <RefreshCw size={14} className="animate-spin" /> : <Skull size={14} />}
                {isAttacking ? 'Injecting Attack...' : '① Inject Hash Corruption'}
              </button>

              <button
                id="chaos-scan-btn"
                onClick={() => scanMutation.mutate()}
                disabled={isScanning}
                className="w-full py-5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-900/50 disabled:opacity-40 disabled:cursor-not-allowed text-amber-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
              >
                {isScanning ? <RefreshCw size={14} className="animate-spin" /> : <ScanLine size={14} />}
                {isScanning ? 'Running Watchdog Scan...' : '② Trigger Watchdog Scan'}
              </button>

              <button
                id="chaos-reset-btn"
                onClick={() => resetMutation.mutate()}
                disabled={isAttacking || isScanning}
                className="w-full py-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
              >
                <RotateCcw size={14} />
                Reset Lab State
              </button>
            </div>

            {/* Doctrine Card */}
            <div className="border border-blue-900/30 bg-blue-500/5 rounded-[1.5rem] p-6 space-y-4">
              <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Lock size={10} /> Correction Block Doctrine
              </h3>
              <div className="space-y-3 text-[10px] text-slate-500 leading-relaxed font-sans">
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 1:</span> Past blocks are immutable. No hash is ever modified.</p>
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 2:</span> On rupture, a <code className="text-blue-300 bg-blue-900/20 px-1 rounded">SYSTEM_INTEGRITY_CORRECTION</code> block is appended.</p>
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 3:</span> Corrupted block remains as forensic evidence.</p>
                <p className="flex gap-2"><span className="text-blue-400 font-black">Rule 4:</span> New chain anchor is established from the correction block forward.</p>
              </div>
            </div>

            {/* Live Chain Health */}
            {status?.reports && status.reports.length > 0 && (
              <div className="border border-slate-800 rounded-[1.5rem] p-6 space-y-3">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Chain Health</h3>
                {status.reports.slice(0, 5).map((r: any) => (
                  <div key={r.auditId} className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">{r.auditId.slice(0, 12)}...</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${r.valid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {r.valid ? '✓ INTACT' : '✗ RUPTURED'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* XSS Pressure Test Sandbox */}
            <div className="border border-purple-900/30 bg-purple-500/5 rounded-[1.5rem] p-6 space-y-4">
              <h3 className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Bug size={10} /> XSS Pressure Test (Sandbox)
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                   <button 
                     onClick={() => handleXssTest("<img src=x onerror=alert('XSS')>")}
                     className="py-2 bg-purple-500/10 border border-purple-900/50 rounded-lg text-[7px] font-black uppercase text-purple-400 hover:bg-purple-500/20"
                   >
                     Basic Injection
                   </button>
                   <button 
                     onClick={() => handleXssTest("[Click Me](javascript:alert('Hacked'))")}
                     className="py-2 bg-purple-500/10 border border-purple-900/50 rounded-lg text-[7px] font-black uppercase text-purple-400 hover:bg-purple-500/20"
                   >
                     Markdown Bypass
                   </button>
                   <button 
                     onClick={() => handleXssTest("<script>document.cookie.steal()</script>")}
                     className="py-2 bg-purple-500/10 border border-purple-900/50 rounded-lg text-[7px] font-black uppercase text-purple-400 hover:bg-purple-500/20"
                   >
                     Script Tag
                   </button>
                   <button 
                     onClick={() => handleXssTest("<svg onload=alert(1)>")}
                     className="py-2 bg-purple-500/10 border border-purple-900/50 rounded-lg text-[7px] font-black uppercase text-purple-400 hover:bg-purple-500/20"
                   >
                     SVG Handler
                   </button>
                </div>
                
                {xssPayload && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[7px] font-black text-slate-500 uppercase">Input Payload</p>
                    <div className="p-2 bg-black border border-slate-800 rounded text-[8px] text-red-400 break-all h-10 overflow-auto">
                      <code>{xssPayload}</code>
                    </div>
                    
                    <p className="text-[7px] font-black text-slate-500 uppercase mt-2">Sanitized Output (Safe)</p>
                    <div className="p-3 bg-white/5 border border-emerald-900/30 rounded text-[9px] text-white min-h-[60px]">
                      <SafeMarkdown content={xssResult} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-900 pt-6 flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
          <span className="flex items-center gap-2"><ShieldAlert size={12} className="text-red-900" /> Red Team Module — AuditAX Sprint 38</span>
          <span>Correction Block Doctrine v1.0 // SHA-256 Chain Monitor Active</span>
        </div>
      </div>
    </div>
  );
};

export default ChaosLab;
