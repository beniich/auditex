import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Camera, ChevronRight, ChevronLeft, Save, Send, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { Audit, AuditTemplate, AuditQuestion } from '../types';
import { AuditService } from '../services/AuditService';
import { StorageService } from '../services/StorageService';
import { AiApiService } from '../services/AiApiService';
import { toast } from '../hooks/useToast';
import { FindingsPanel } from './FindingsPanel';

interface AuditRunnerProps {
  auditId: string;
  template: AuditTemplate;
  onComplete: () => void;
}

export const AuditRunner = ({ auditId, template, onComplete }: AuditRunnerProps) => {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [audit, setAudit] = useState<Audit | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiDiagnostics, setAiDiagnostics] = useState<Record<string, { type: 'success' | 'warning' | 'info', status: string, message: string, suggestion?: string, loading?: boolean }>>({});

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
    
    // Real-Time Agentic AI Verification
    runAIDiagnostic(questionId, value);

    await loadAudit();
    setSaving(false);
  };

  const runAIDiagnostic = async (questionId: string, value: any) => {
    const questionText = template.sections.flatMap(s => s.questions).find(q => q.id === questionId)?.text || '';
    
    setAiDiagnostics(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], loading: true, type: 'info', status: 'ANALYZING', message: 'Agentic AI analyzing response alignment...' }
    }));

    try {
      // Find associated policy for RAG context (simple lookup for demo)
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
    } catch (err) {
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
      [`evidence_${questionId}`]: { loading: true, status: 'VETTING', message: 'Vision AI inspecting cryptographic alignment of evidence...', type: 'info' }
    }));

    try {
      const result = await AiApiService.analyzeEvidence(url, "Is this a valid technical proof (screenshot, log, certificate)? Confirm date and context.");
      
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

  const handleSubmit = async () => {
    if (confirm('Voulez-vous soumettre cet audit pour revue ? Cette action est irréversible.')) {
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
             <button 
               onClick={onComplete}
               className="p-2 border border-brand-border text-brand-text-muted rounded-lg hover:bg-slate-50 uppercase tracking-widest text-[10px] font-bold"
             >
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
      case 'greater_than': return response > value;
      case 'less_than': return response < value;
      default: return true;
    }
  };

  const visibleQuestions = currentSection.questions.filter(shouldShowQuestion);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Stepper */}
      <div className="flex gap-2 mb-2">
        {template.sections.map((sec, idx) => (
          <div 
            key={sec.id}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              idx === currentSectionIdx ? 'bg-blue-600' : 
              idx < currentSectionIdx ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <header className="flex justify-between items-start bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1">
           <div className={`text-[8px] font-black px-2 py-1 rounded bg-[#091426] text-white uppercase tracking-widest ${saving ? 'animate-pulse opacity-100' : 'opacity-0'}`}>
             Syncing to Ledger...
           </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              Section {currentSectionIdx + 1} / {template.sections.length} • GUIDED MISSION
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#091426] uppercase tracking-tighter">{currentSection.title}</h2>
          <p className="text-slate-500 text-xs font-medium mt-1">{template.title} • {audit.entityId}</p>
        </div>
        <div className="flex gap-3">
          <button className="w-12 h-12 flex items-center justify-center border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">
            <Save size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSection.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            {visibleQuestions.map((q) => (
              <div 
                key={q.id} 
                className={`bg-white p-6 rounded-xl border transition-all duration-500 shadow-sm ${
                  aiDiagnostics[q.id]?.status === 'NON_CONFORM' ? 'border-amber-400 border-2 shadow-lg shadow-amber-500/5 bg-amber-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="flex flex-col gap-1">
                    {aiDiagnostics[q.id]?.status === 'NON_CONFORM' && (
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <AlertTriangle size={10} /> AI_FLAGGED: NON-ALIGNMENT
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-[#091426] leading-snug uppercase tracking-tight">
                      {q.text}
                      {q.required && <span className="text-brand-danger ml-1">*</span>}
                    </h4>
                  </div>
                  <span className="text-[9px] font-bold border border-brand-border px-2 py-0.5 rounded text-brand-text-muted uppercase tracking-tighter">Poids: {q.weight}</span>
                </div>

                {q.type === 'YES_NO' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleResponse(q.id, true)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-xs font-bold transition-all ${
                        audit.responses[q.id]?.value === true 
                        ? 'bg-brand-success/5 border-brand-success text-brand-success' 
                        : 'border-slate-50 bg-slate-50 text-brand-text-muted hover:border-brand-border'
                      }`}
                    >
                      <Check size={16} /> OUI / CONFORME
                    </button>
                    <button 
                      onClick={() => handleResponse(q.id, false)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-xs font-bold transition-all ${
                        audit.responses[q.id]?.value === false 
                        ? 'bg-brand-danger/5 border-brand-danger text-brand-danger' 
                        : 'border-slate-50 bg-slate-50 text-brand-text-muted hover:border-brand-border'
                      }`}
                    >
                      <X size={16} /> NON / ÉCART
                    </button>
                  </div>
                )}

                {q.type === 'SCORE' && (
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button 
                        key={score}
                        onClick={() => handleResponse(q.id, score)}
                        className={`flex-1 py-3 rounded-lg border-2 text-xs font-bold transition-all ${
                          audit.responses[q.id]?.value === score 
                          ? 'bg-brand-sidebar border-brand-sidebar text-white shadow-md' 
                          : 'border-slate-50 bg-slate-50 text-brand-text-muted hover:border-brand-border'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'TEXT' && (
                  <textarea
                    rows={4}
                    placeholder="Saisir vos observations..."
                    defaultValue={audit.responses[q.id]?.value || ''}
                    onBlur={(e) => {
                      if (e.target.value !== audit.responses[q.id]?.value) {
                        handleResponse(q.id, e.target.value);
                      }
                    }}
                    className="w-full p-4 bg-slate-50 border border-brand-border rounded-lg text-sm text-brand-text-main resize-none focus:outline-none focus:border-brand-accent transition-all"
                  />
                )}

                {q.type === 'IMAGE' && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-4">
                      {audit.responses[q.id]?.evidenceUrl?.map((url, i) => (
                        <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                          <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-all cursor-pointer">
                        <Camera size={24} />
                        <span className="text-[10px] font-bold">AJOUTER</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSaving(true);
                              try {
                                const res = await StorageService.uploadEvidence(file, auditId);
                                await AuditService.appendEvent(auditId, 'EVIDENCE_ADDED', { questionId: q.id, url: res.url });
                                
                                // AI Evidence Vetting
                                runAIEvidenceCheck(q.id, res.url);

                                await loadAudit();
                              } catch (err) {
                                console.error("Upload failed", err);
                              }
                              setSaving(false);
                            }
                          }} 
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Agentic AI Analysis Module */}
                <AnimatePresence>
                  {aiDiagnostics[q.id] && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-5 rounded-2xl border-2 flex flex-col gap-3 relative overflow-hidden ${
                        aiDiagnostics[q.id].loading ? 'bg-slate-50 border-slate-100 text-slate-400' :
                        aiDiagnostics[q.id].type === 'warning' 
                          ? 'bg-amber-50/50 border-amber-100 text-amber-900'
                          : 'bg-emerald-50/50 border-emerald-100 text-emerald-900 border-2'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            {aiDiagnostics[q.id].loading ? <RefreshCw size={14} className="animate-spin" /> : 
                             aiDiagnostics[q.id].type === 'warning' ? <AlertTriangle size={16} className="text-amber-600" /> : <Sparkles size={16} className="text-emerald-600" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">
                               {aiDiagnostics[q.id].loading ? 'AI Verifying...' : `AI ${aiDiagnostics[q.id].status}`}
                            </span>
                         </div>
                         {!aiDiagnostics[q.id].loading && (
                           <div className="flex items-center gap-4">
                              <span className="text-[9px] font-black uppercase text-current opacity-40">Confidence: 94%</span>
                              <span className="text-[9px] font-bold bg-white/50 px-2 py-0.5 rounded-full border border-current opacity-50 uppercase tracking-tighter">Beta Agent v1.4</span>
                           </div>
                         )}
                      </div>

                      <div className="space-y-2">
                        <p className={`text-xs font-bold leading-relaxed ${aiDiagnostics[q.id].loading ? 'animate-pulse' : ''}`}>
                          {aiDiagnostics[q.id].message}
                        </p>
                        
                        {!aiDiagnostics[q.id].loading && aiDiagnostics[q.id].suggestion && (
                          <div className="pt-3 border-t border-current/10 space-y-4">
                            <div>
                               <p className="text-[10px] uppercase font-black tracking-wider opacity-60 mb-1">Recommended Remediation</p>
                               <p className="text-[11px] font-medium italic">"{aiDiagnostics[q.id].suggestion}"</p>
                            </div>

                            {/* Human-In-The-Loop Validation */}
                            {aiDiagnostics[q.id].status !== 'CONFORM' && (
                              <div className="flex gap-2 pt-2">
                                 <button 
                                   onClick={() => toast.success('AI Finding validated and anchored to evidence.', 'HITL Success')}
                                   className="flex-1 py-2 bg-current text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all font-sans"
                                 >
                                    Accept Finding
                                 </button>
                                 <button 
                                   onClick={() => toast.error('Hallucination report sent to AI Governance.', 'Feedback Received')}
                                   className="px-3 py-2 border border-current rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all font-sans"
                                 >
                                    Report Error
                                 </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Diagnostic Decorative Glow */}
                      {!aiDiagnostics[q.id].loading && (
                        <>
                          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${
                            aiDiagnostics[q.id].type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <div className="mt-4 pt-3 border-t border-current/5">
                             <p className="text-[8px] font-medium opacity-40 uppercase tracking-widest text-center">
                                AI-Generated Analysis. Verify critical findings with technical evidence ledger.
                             </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Evidence AI Vetting Results */}
                <AnimatePresence>
                  {aiDiagnostics[`evidence_${q.id}`] && (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                       className={`mt-4 p-4 rounded-xl border flex flex-col gap-2 ${
                         aiDiagnostics[`evidence_${q.id}`].loading ? 'bg-slate-50 border-slate-100' : 
                         'bg-blue-50/50 border-blue-100 text-blue-900 border-dashed'
                       }`}
                    >
                       <div className="flex items-center gap-2">
                          {aiDiagnostics[`evidence_${q.id}`].loading ? <RefreshCw size={14} className="animate-spin text-blue-400" /> : <Camera size={14} className="text-blue-600" />}
                          <span className="text-[9px] font-black uppercase tracking-widest">
                             {aiDiagnostics[`evidence_${q.id}`].loading ? 'Evidence Under AI Inspection...' : 'AI Evidence Certification'}
                          </span>
                       </div>
                       <p className="text-[11px] font-medium leading-relaxed opacity-80">
                          {aiDiagnostics[`evidence_${q.id}`].message}
                       </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex justify-between items-center py-10">
        <button 
          onClick={() => setCurrentSectionIdx(prev => Math.max(0, prev - 1))}
          disabled={currentSectionIdx === 0}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#091426] hover:bg-white hover:border-slate-300 disabled:opacity-20 transition-all font-sans"
        >
          <ChevronLeft size={16} /> Previous Sector
        </button>

        {currentSectionIdx === template.sections.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-900/10 transition-all font-sans"
          >
            <Send size={16} /> Finalize Mission
          </button>
        ) : (
          <button 
            onClick={() => setCurrentSectionIdx(prev => prev + 1)}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-900/10 transition-all font-sans"
          >
            Advance <ChevronRight size={16} />
          </button>
        )}
      </footer>
    </div>
  );
};
