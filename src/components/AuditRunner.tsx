import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Camera, ChevronRight, ChevronLeft, Save, Send, Sparkles, RefreshCw, FileText, Zap, Cpu, Bot } from 'lucide-react';
import { Audit, AuditTemplate, AuditQuestion } from '../types';
import { AuditService } from '../services/AuditService';
import { GlassCard } from './common/GlassCard';
import { AiApiService } from '../services/AiApiService';
import { toast } from '../hooks/useToast';
import { FindingsPanel } from './FindingsPanel';
import { useQuota } from '../hooks/useQuota';
import { SafeMarkdown } from './SafeMarkdown';
import { useTranslation } from 'react-i18next';

interface AuditRunnerProps {
  auditId: string;
  template: AuditTemplate;
  onComplete: () => void;
}

type AIMode = 'SIMPLE' | 'DSL' | 'AGENTIC';

export const AuditRunner = ({ auditId, template, onComplete }: AuditRunnerProps) => {
  const { t } = useTranslation('audit');
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [audit, setAudit] = useState<Audit | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>('SIMPLE');
  const [aiDiagnostics, setAiDiagnostics] = useState<Record<string, { type: 'success' | 'warning' | 'info', status: string, message: string, suggestion?: string, loading?: boolean, selfCorrected?: boolean }>>({});
  const { balance, refreshQuota } = useQuota();

  const MODE_CONFIG: Record<AIMode, { label: string; color: string; cost: string; description: string; icon: React.ElementType }> = {
    SIMPLE:  { label: t('modes.simple'),  color: 'text-slate-400',   cost: '$0.01', description: t('modes.simple_desc'), icon: Zap },
    DSL:     { label: t('modes.logic'),   color: 'text-indigo-500',  cost: '$0.05', description: t('modes.logic_desc'),  icon: Cpu },
    AGENTIC: { label: t('modes.agentic'), color: 'text-blue-500',    cost: '$0.15', description: t('modes.agentic_desc'), icon: Bot },
  };

  useEffect(() => {
    loadAudit();
  }, [auditId]);

  const loadAudit = async () => {
    const data = await AuditService.getAudit(auditId);
    setAudit(data);
  };

  const currentSection = template.sections[currentSectionIdx];

  const handleResponse = async (questionId: string, value: any) => {
    setSaving(true);
    await AuditService.appendEvent(auditId, 'RESPONSE_UPDATED', {
      questionId,
      value,
      timestamp: new Date().toISOString()
    });
    
    runAIDiagnostic(questionId, value);

    await loadAudit();
    setSaving(false);
  };

  const handleExportReport = async () => {
    if (!auditId) return;
    setSaving(true);
    try {
      const response = await axios.get(`/api/reports/download/${auditId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Audit_Report_${auditId.substring(0, 8)}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Rapport de synthèse généré avec succès.', 'Report Engine');
    } catch (err: any) {
      console.error(err);
      toast.error('Échec de la génération du rapport.', 'Audit AX');
    } finally {
      setSaving(false);
    }
  };

  const runAIDiagnostic = async (questionId: string, value: any) => {
    const questionText = template.sections.flatMap(s => s.questions).find(q => q.id === questionId)?.text || '';
    const modeLabel = aiMode;

    setAiDiagnostics(prev => ({
      ...prev,
      [questionId]: { loading: true, type: 'info', status: t('ai_hub.analyzing'), message: t('ai_hub.processing') }
    }));

    try {
      if (aiMode === 'SIMPLE') {
        const result = await AiApiService.validateResponse(questionText, String(value));
        setAiDiagnostics(prev => ({
          ...prev,
          [questionId]: {
            loading: false,
            type: result.status === 'CONFORM' ? 'success' : 'warning',
            status: result.status,
            message: result.reasoning,
            suggestion: result.suggestion
          }
        }));
      } else {
        const result = await AiApiService.advancedAudit(questionText, String(value), aiMode, auditId);
        setAiDiagnostics(prev => ({
          ...prev,
          [questionId]: {
            loading: false,
            type: 'success',
            status: aiMode === 'AGENTIC' && result.selfCorrected ? 'SELF-CORRECTED' : aiMode === 'DSL' ? 'DSL-RULE' : 'ANALYZED',
            message: result.result || result.reasoning || JSON.stringify(result.rule),
            selfCorrected: result.selfCorrected
          }
        }));
        refreshQuota();
      }
    } catch (err: any) {
      if (err.message?.includes('402')) {
        toast.error('Quota AI insuffisant.', 'Quota Épuisé');
      }
      setAiDiagnostics(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const runAIEvidenceCheck = async (questionId: string, url: string) => {
    setAiDiagnostics(prev => ({
      ...prev,
      [`evidence_${questionId}`]: { loading: true, status: 'VETTING', message: 'Vision AI inspecting evidence...', type: 'info' }
    }));

    try {
      const result = await AiApiService.analyzeEvidence(url, "Verify proof context.");
      setAiDiagnostics(prev => ({
        ...prev,
        [`evidence_${questionId}`]: {
          loading: false,
          status: 'INSPECTED',
          message: result.analysis || 'Evidence vetted successfully.',
          type: 'success'
        }
      }));
    } catch (err) {
       setAiDiagnostics(prev => {
        const next = { ...prev };
        delete next[`evidence_${questionId}`];
        return next;
      });
    }
  };

  const handleAcceptFinding = async (questionId: string) => {
    setAiDiagnostics(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: 'ACCEPTED', type: 'success' }
    }));
    toast.success('AI Finding validated.', 'HITL Success');
  };

  const handleReportError = async (questionId: string) => {
    setAiDiagnostics(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: 'REPORTED', type: 'info', message: 'Reported as hallucination.' }
    }));
  };

  const handleSubmit = async () => {
    if (confirm('Voulez-vous soumettre cet audit pour revue ?')) {
      setSaving(true);
      await AuditService.appendEvent(auditId, 'STATUS_CHANGED', { status: 'SUBMITTED' });
      onComplete();
    }
  };

  if (!audit) return null;

  if (audit.status === 'SUBMITTED') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-start bg-white p-6 rounded-xl border border-brand-border shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text-muted mb-2 block">
              Rapport d'Audit
            </span>
            <h2 className="text-xl font-bold text-brand-text-main">{template.title}</h2>
            <p className="text-brand-text-muted text-sm mt-1">{audit.entityId} — Terminé</p>
          </div>
          <div className="flex gap-3">
             <button onClick={onComplete} className="p-2 border border-brand-border text-brand-text-muted rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[10px] font-bold">
               Fermer
             </button>
          </div>
        </header>
        <FindingsPanel audit={audit} template={template} />
      </div>
    );
  }

  const shouldShowQuestion = (q: AuditQuestion) => {
    if (!q.logic?.showIf || !audit) return true;
    const { questionId, operator, value } = q.logic.showIf;
    const response = audit.responses[questionId]?.value;
    switch (operator) {
      case 'equals': return response === value;
      case 'not_equals': return response !== value;
      default: return true;
    }
  };

  const visibleQuestions = currentSection.questions.filter(shouldShowQuestion);

  return (
    <div className="max-w-[1700px] mx-auto">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Missions Topology */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <GlassCard className="p-8 flex flex-col gap-8 h-full">
            <div>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">{t('topology')}</h3>
               <div className="space-y-4">
                  {template.sections.map((sec, idx) => (
                    <button 
                      key={sec.id}
                      onClick={() => setCurrentSectionIdx(idx)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                        idx === currentSectionIdx 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : idx < currentSectionIdx 
                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600'
                        : 'bg-white/50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                        idx === currentSectionIdx ? 'bg-white/20' : 'bg-slate-100'
                      }`}>
                         {idx + 1}
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                         <span className="text-[10px] font-black uppercase tracking-tight truncate w-full text-left">{sec.title}</span>
                         <span className="text-[8px] font-bold opacity-60 uppercase tracking-tighter">
                            {idx < currentSectionIdx ? t('status.verified') : idx === currentSectionIdx ? t('status.active') : t('status.locked')}
                         </span>
                      </div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase">{t('progress')}</span>
                  <span className="text-xl font-black text-[#091426] tracking-tighter">
                     {Math.round((currentSectionIdx / template.sections.length) * 100)}%
                  </span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(currentSectionIdx / template.sections.length) * 100}%` }} className="h-full bg-blue-600" />
               </div>
            </div>
          </GlassCard>
        </div>

        {/* Workspace */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <GlassCard className="p-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 ${saving ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
               <div className="flex items-center gap-2 bg-[#091426] text-white px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest">
                  <RefreshCw size={10} className="animate-spin" /> {t('execution.syncing')}
               </div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-blue-600" />
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">{t('execution.title')}</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#091426] dark:text-white uppercase tracking-tighter leading-none">{currentSection.title}</h2>
               </div>
               <button onClick={handleExportReport} className="px-6 py-3 bg-[#091426] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                  <FileText size={14} /> {t('execution.export')}
                </button>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div key={currentSection.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                  {visibleQuestions.map((q) => (
                    <div key={q.id} className="group relative">
                      <div className="flex justify-between items-start gap-6 mb-6">
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-[#091426] dark:text-white leading-tight uppercase tracking-tight">
                            {q.text}
                          </h4>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{t('execution.requirement_node')}: {q.id.substring(0, 8)}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {q.type === 'YES_NO' && (
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleResponse(q.id, true)} className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${audit.responses[q.id]?.value === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white/50 border-slate-100 text-slate-400'}`}>
                               <Check size={20} className="mb-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{t('execution.conformant')}</span>
                            </button>
                            <button onClick={() => handleResponse(q.id, false)} className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${audit.responses[q.id]?.value === false ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white/50 border-slate-100 text-slate-400'}`}>
                               <X size={20} className="mb-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{t('execution.deviation')}</span>
                            </button>
                          </div>
                        )}

                        {q.type === 'TEXT' && (
                          <textarea rows={4} placeholder={t('execution.respond_text')} defaultValue={audit.responses[q.id]?.value || ''} onBlur={(e) => handleResponse(q.id, e.target.value)} className="w-full p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-100 rounded-3xl text-sm font-medium outline-none" />
                        )}

                        <div className="flex flex-wrap gap-4 p-6 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                           {audit.responses[q.id]?.evidenceUrl?.map((url, i) => (
                             <div key={i} className="group/img relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200">
                               <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                             </div>
                           ))}
                           <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-blue-400 hover:text-blue-500 cursor-pointer">
                             <Camera size={20} />
                             <input type="file" className="hidden" />
                           </label>
                           <div className="flex flex-col justify-center gap-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('execution.upload_proof')}</span>
                              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{t('execution.supported_files')}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-20 pt-8 border-t border-slate-100">
               <button onClick={() => setCurrentSectionIdx(prev => Math.max(0, prev - 1))} disabled={currentSectionIdx === 0} className="flex items-center gap-2 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#091426] disabled:opacity-20 transition-all">
                  <ChevronLeft size={16} /> {t('execution.previous')}
               </button>
               {currentSectionIdx === template.sections.length - 1 ? (
                 <button onClick={handleSubmit} className="px-12 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center gap-3">
                    <Send size={16} /> {t('execution.finalize')}
                 </button>
               ) : (
                 <button onClick={() => setCurrentSectionIdx(prev => prev + 1)} className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center gap-3">
                    {t('execution.continue')} <ChevronRight size={16} />
                 </button>
               )}
            </div>
          </GlassCard>
        </div>

        {/* AI HUB */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <GlassCard className="p-8 flex flex-col gap-8 h-full bg-slate-900/10 backdrop-blur-2xl border-white/5">
            <div>
               <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-6">{t('ai_hub.title')}</h3>

               <div className="mb-6">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('ai_hub.precision_mode')}</p>
                  <div className="flex flex-col gap-2">
                    {(Object.keys(MODE_CONFIG) as AIMode[]).map(mode => {
                      const cfg = MODE_CONFIG[mode];
                      const Icon = cfg.icon;
                      const isActive = aiMode === mode;
                      return (
                        <button key={mode} onClick={() => setAiMode(mode)} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${isActive ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}><Icon size={12} /></div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[9px] font-black uppercase tracking-widest">{cfg.label}</span>
                            <span className="text-[7px] font-bold uppercase tracking-tighter opacity-50">{cfg.description}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
               </div>

               <div className="space-y-4">
                  {visibleQuestions.map(q => (
                    <AnimatePresence key={q.id}>
                      {aiDiagnostics[q.id] && (
                        <motion.div initial={{ opacity:0, x: 20 }} animate={{ opacity:1, x:0 }} className={`p-4 rounded-2xl border ${aiDiagnostics[q.id].loading ? 'animate-pulse' : 'bg-white/5 border-white/10'}`}>
                           <span className="text-[8px] font-black uppercase tracking-[0.1em] text-blue-400 block mb-2">{aiDiagnostics[q.id].status}</span>
                           <SafeMarkdown content={aiDiagnostics[q.id].message} className="text-[9px] font-medium leading-relaxed dark:text-white/80 italic" />
                            {!aiDiagnostics[q.id].loading && aiDiagnostics[q.id].type === 'warning' && (
                             <div className="flex gap-2 mt-3">
                                <button onClick={() => handleAcceptFinding(q.id)} className="flex-1 py-1.5 bg-[#091426] text-white rounded-lg text-[7px] font-black uppercase">{t('ai_hub.accept')}</button>
                                <button onClick={() => handleReportError(q.id)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-[7px] font-black text-slate-400 uppercase">{t('ai_hub.reject')}</button>
                             </div>
                           )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
               </div>
            </div>

            <div className="mt-auto space-y-4">
               <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('ai_hub.budget')}</span>
                    <span className="text-[10px] font-black font-mono text-emerald-500">${balance.toFixed(2)}</span>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-emerald-500 text-white rounded-2xl shadow-lg">
                  <Save size={16} />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest">{t('ai_hub.auto_registry')}</span>
                     <span className="text-[8px] font-bold opacity-80 uppercase tracking-tighter">{t('ai_hub.anchored')}</span>
                  </div>
               </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
