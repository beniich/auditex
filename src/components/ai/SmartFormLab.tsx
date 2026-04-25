import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Layout, 
  Activity, 
  Brain, 
  FileText, 
  Plus, 
  Trash2, 
  Smartphone, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  RefreshCcw,
  BarChart3,
  MapPin,
  Camera,
  Binary,
  Type,
  Hash,
  ListFilter,
  Signature,
  Settings,
  Terminal,
  History,
  Mail,
  Send,
  ShieldCheck
} from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Types ---
interface FormField {
  id: string;
  type: string;
  icon: any;
  label: string;
  required: boolean;
  ai: boolean;
  preview: string;
}

const FIELD_TYPES: Record<string, any> = {
  text:      { icon: Type, label: 'Texte Libre',     preview: 'Zone de texte...',       ai: false },
  number:    { icon: Hash, label: 'Numérique',       preview: '0 — 100',                ai: false },
  photo:     { icon: Camera, label: 'Photo / Média',   preview: '📎 Joindre fichier',     ai: true  },
  location:  { icon: MapPin, label: 'Localisation',    preview: '📱 Détecter GPS',        ai: true  },
  scale:     { icon: Zap, label: 'Échelle de Risque',preview: '● ○ ○ ○ ○',            ai: true  },
  checkbox:  { icon: CheckCircle2, label: 'Cases à cocher',  preview: '☐ Option 1  ☐ Option 2',ai: false },
  select:    { icon: ListFilter, label: 'Sélecteur',       preview: '▼ Choisir...',           ai: false },
  'ai-tag':  { icon: Brain, label: 'Tag IA Auto',     preview: '🏷️ Classification auto', ai: true  },
  signature: { icon: Signature, label: 'Signature',       preview: '✍ Signer ici',           ai: false },
};

export const SmartFormLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'pipeline' | 'analytics' | 'dashboard' | 'reports'>('builder');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('Alerte Sécurité — Terrain');
  const [pipelineStep, setPipelineStep] = useState(0);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [submissions, setSubmissions] = useState(1247);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [emailTarget, setEmailTarget] = useState('ceo@auditmaster.io');
  const [certificate, setCertificate] = useState<{
    fingerprint: string;
    certificateText: string;
    issuer: string;
    issuedAt: string;
    validationCode: string;
  } | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // --- Builder Logic ---
  const addField = (type: string) => {
    const config = FIELD_TYPES[type];
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ...config
    };
    setFormFields([...formFields, newField]);
    addNotification(`Champ "${config.label}" ajouté`);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 4000);
  };

  // --- Pipeline Simulation ---
  const runPipeline = async () => {
    setIsPipelineRunning(true);
    setPipelineStep(0);
    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 1200));
      setPipelineStep(i);
    }
    setIsPipelineRunning(false);
    addNotification('Pipeline IA complété');
  };

  // --- Email Logic ---
  const sendEmailReport = async () => {
    if (!reportRef.current) return;
    setIsSendingEmail(true);
    addNotification('Conversion du rapport pour envoi...');

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 1.5, backgroundColor: '#f3f7fa' });
      const pdfBase64 = canvas.toDataURL('image/png');

      const response = await fetch('/api/ai/export-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailTarget,
          reportTitle: formTitle,
          pdfBase64: pdfBase64,
          organizationId: 'global-org-placeholder'
        })
      });

      if (response.ok) {
        addNotification(`Rapport envoyé à ${emailTarget}`);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      addNotification('Échec de l\'envoi de l\'email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const signReport = async () => {
    setIsSigning(true);
    addNotification('Certification cryptographique en cours...');

    try {
      const response = await fetch('/api/ai/sign-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportData: { title: formTitle, fields: formFields.length, submissions },
          organizationId: 'global-org-placeholder'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCertificate(data);
        addNotification('Signature électronique apposée');
      }
    } catch (err) {
      addNotification('Échec de la signature');
    } finally {
      setIsSigning(false);
    }
  };

  // --- PDF Export Logic ---
  const exportToPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    addNotification('Préparation du rapport PDF...');

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f3f7fa'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NEXUS_REPORT_${formTitle.toUpperCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
      addNotification('Rapport PDF généré avec succès');
    } catch (error) {
      console.error('PDF Export Error:', error);
      addNotification('Erreur lors de la génération du PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // --- Data for Charts ---
  const barData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Volume Signalements',
        data: [420, 582, 510, 734],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const donutData = {
    labels: ['Critique', 'Élevé', 'Moyen', 'Faible'],
    datasets: [{
      data: [23, 31, 28, 18],
      backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-[#f3f7fa] p-8 font-sans">
      
      {/* Header Area */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Zap size={14} className="fill-current" /> Module d'Innovation v2.4
          </div>
          <h1 className="text-4xl font-black text-[#01091d] tracking-tighter uppercase leading-none">SmartForm Analytics AI</h1>
          <p className="text-slate-500 mt-3 text-sm font-medium">L'architecture de la donnée, l'intelligence de l'analyse opérationnelle.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {(['builder', 'pipeline', 'analytics', 'dashboard', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-[#01091d] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- BUILDER VIEW --- */}
        {activeTab === 'builder' && (
          <motion.div 
            key="builder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-12 gap-8 h-[calc(100vh-280px)]"
          >
            {/* Library Panel */}
            <div className="col-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6 overflow-hidden">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Layout size={14} /> Bibliothèque Rubriques
               </h3>
               <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar focus:outline-none">
                  {Object.entries(FIELD_TYPES).map(([key, config]) => (
                    <button 
                      key={key}
                      onClick={() => addField(key)}
                      className="w-full flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-500 group transition-all"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <config.icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-[#01091d] uppercase tracking-tight">{config.label}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{config.ai ? 'Beta IA' : 'Standard'}</p>
                      </div>
                    </button>
                  ))}
               </div>
            </div>

            {/* Canvas Panel */}
            <div className="col-span-6 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col gap-8 overflow-hidden">
               <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <input 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="bg-transparent border-none text-xl font-black text-[#01091d] uppercase tracking-tight w-full focus:outline-none"
                    placeholder="Titre du formulaire..."
                  />
                  <div className="flex gap-2">
                    <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-1 rounded">Actif</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                  {formFields.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                       <Plus size={48} className="opacity-20" />
                       <p className="text-xs font-black uppercase tracking-widest">Glissez un champ ou cliquez sur la bibliothèque</p>
                    </div>
                  ) : (
                    formFields.map((field) => (
                      <motion.div 
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-all"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                           <field.icon size={22} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-[11px] font-black text-[#01091d] uppercase tracking-tight">{field.label}</h4>
                           <p className="text-[9px] text-slate-400 font-mono italic">input::{field.type}</p>
                        </div>
                        {field.ai && (
                           <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">AI_SYNC</span>
                        )}
                        <button 
                          onClick={() => removeField(field.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                           <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))
                  )}
               </div>

               <div className="pt-6 border-t border-slate-50 flex gap-4">
                  <button onClick={() => setFormFields([])} className="px-6 py-3 border border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Clear Canvas</button>
                  <button className="flex-1 py-3 bg-[#01091d] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:opacity-90">Deploy to Agents</button>
               </div>
            </div>

            {/* Smart Preview Panel */}
            <div className="col-span-3 bg-[#01091d] rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Smartphone size={120} className="text-white" />
               </div>
               <div className="relative z-10">
                 <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Live Capture Preview</h3>
                 <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tight">Agent-Facing Interface</p>
               </div>

               <div className="flex-1 bg-[#121b35] rounded-3xl border border-white/5 p-6 flex flex-col gap-4 overflow-hidden relative">
                  <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-2" />
                  <div className="text-white font-black text-xs uppercase tracking-tight mb-2">{formTitle}</div>
                  
                  <div className="space-y-3 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                    {formFields.slice(0, 4).map(f => (
                      <div key={f.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-1.5 opacity-50">
                           <f.icon size={12} className="text-blue-400" />
                           <span className="text-[8px] font-black text-white uppercase tracking-widest">{f.label}</span>
                        </div>
                        <div className="h-6 w-full bg-white/10 rounded-lg" />
                      </div>
                    ))}
                    {formFields.length > 4 && (
                      <div className="text-center text-[8px] text-slate-500 uppercase font-black">+ {formFields.length - 4} More Fields</div>
                    )}
                  </div>

                  <div className="mt-auto">
                     <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-900/50">Simulate Submit</button>
                  </div>
               </div>

               <div className="relative z-10 flex flex-col gap-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Sync Health</span>
                    <span>98.2%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '98.2%' }} />
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* --- PIPELINE VIEW --- */}
        {activeTab === 'pipeline' && (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8 h-[calc(100vh-280px)]"
          >
             <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col gap-10">
                <div className="flex justify-between items-center">
                   <div>
                     <h3 className="text-2xl font-black text-[#01091d] uppercase tracking-tighter">Harmonisation Engine Dataflow</h3>
                     <p className="text-slate-500 text-sm mt-1 uppercase tracking-tight font-medium">Automatic extraction & semantic cleaning pipeline</p>
                   </div>
                   <button 
                    onClick={runPipeline}
                    disabled={isPipelineRunning}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      isPipelineRunning ? 'bg-slate-100 text-slate-400 italic' : 'bg-blue-600 text-white shadow-xl shadow-blue-100 ring-4 ring-blue-50 hover:bg-blue-700'
                    }`}
                   >
                     {isPipelineRunning ? 'Processing Engine...' : 'Initialize Pipeline Launch'} <RefreshCcw size={14} className={isPipelineRunning ? 'animate-spin' : ''} />
                   </button>
                </div>

                <div className="relative flex justify-between items-start gap-4">
                   <div className="absolute top-24 left-0 right-0 h-1 bg-slate-100 -z-0" />
                   
                   {[
                     { label: 'INGESTION', icon: Binary, title: 'Raw Payload' },
                     { label: 'CLEANING', icon: Activity, title: 'NLP Sanitation' },
                     { label: 'CLASSIFY', icon: Brain, title: 'Taxonomy Map' },
                     { label: 'OUTPUT', icon: FileText, title: 'Struct Graph' },
                   ].map((step, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-6 relative z-10">
                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 transition-all duration-700 ${
                          pipelineStep >= i + 1 ? 'bg-blue-600 border-blue-100 text-white shadow-2xl rotate-12 scale-110' : 
                          pipelineStep === i ? 'bg-white border-blue-600 text-blue-600 animate-pulse' :
                          'bg-white border-slate-100 text-slate-200'
                        }`}>
                           <step.icon size={32} />
                        </div>
                        <div className="text-center">
                           <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${pipelineStep >= i+1 ? 'text-blue-600' : 'text-slate-400'}`}>{step.label}</p>
                           <h4 className="text-xs font-black text-[#01091d] uppercase">{step.title}</h4>
                        </div>
                        {pipelineStep >= i + 1 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl w-[180px] text-[9px] font-mono font-black text-slate-500 uppercase leading-relaxed shadow-sm"
                          >
                             {i === 0 && "✓ 4 RAW_PACKETS\n✓ SECT_NORD_V2\n✓ PAYLOAD: OK"}
                             {i === 1 && "✓ SYMBOLIC_REPLACE\n✓ XSSI_FILTER_ON\n✓ ENTITY_EXTRACT"}
                             {i === 2 && "✓ TAG: SAFETY_ALERT\n✓ SCORE: 0.942\n✓ MAP: UNIT_B"}
                             {i === 3 && "✓ JSON_EMIT_DONE\n✓ CACHE_W_SYNC\n✓ BROADCAST: READY"}
                          </motion.div>
                        )}
                     </div>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 flex-1 overflow-hidden">
                <div className="bg-[#01091d] rounded-[3rem] p-10 flex flex-col gap-6 overflow-hidden">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Terminal size={14} /> Pipeline Real-time Stream
                   </h4>
                   <div className="flex-1 font-mono text-[10px] text-blue-400/80 space-y-2 p-4 bg-black/30 rounded-2xl overflow-y-auto custom-scrollbar">
                      <p className="text-slate-500">[{new Date().toLocaleTimeString()}] INF::INIT_PIPELINE(SECT_ALPHA)</p>
                      {pipelineStep > 0 && <p className="text-emerald-400">[{new Date().toLocaleTimeString()}] INGESTION_COMPLETE::4_OBJECTS_LOCKED</p>}
                      {pipelineStep > 1 && <p className="text-blue-400">[{new Date().toLocaleTimeString()}] SANITIZATION_ENG::RUNNING(MAP_REDUCE)</p>}
                      {pipelineStep > 2 && <p className="text-purple-400">[{new Date().toLocaleTimeString()}] NEURAL_LAYER::CLASSIFIED(HIGH_SEVERITY)</p>}
                      {pipelineStep > 3 && <p className="text-emerald-400 animate-pulse">[{new Date().toLocaleTimeString()}] OUTPUT_EMIT::PIPELINE_STABLE</p>}
                      <p className="animate-pulse">_</p>
                   </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col gap-6 overflow-hidden shadow-sm">
                   <div className="flex justify-between items-center">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <History size={14} /> Processed Entity Logs
                     </h4>
                     <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{pipelineStep > 3 ? 'SUCCESS' : 'IDLE'}</span>
                   </div>
                   <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300">
                                 <Plus size={16} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-[#01091d] uppercase tracking-tight">ENTITY_LOG_00{i}_PACK</p>
                                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest italic">{pipelineStep > 3 ? "Processé" : "En attente"}</p>
                              </div>
                           </div>
                           <ArrowRight size={14} className="text-slate-100 group-hover:text-blue-400" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8"
          >
             {/* Key Metrics */}
             <div className="grid grid-cols-4 gap-8">
                {[
                  { label: 'Submissions', val: submissions, delta: '+18% vs prev', icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Critical Alerts', val: 23, delta: '+3 new today', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
                  { label: 'AI Precision', val: '94.2%', delta: 'High Confidence', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'ROI Savings', val: '€38.4k', delta: '+22% efficiency', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm group hover:shadow-xl hover:border-blue-200 transition-all">
                     <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <kpi.icon size={22} />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                     <h4 className="text-3xl font-black text-[#01091d] tracking-tighter uppercase leading-none mb-2">{kpi.val}</h4>
                     <p className="text-[9px] font-black uppercase tracking-tight text-slate-400 italic">{kpi.delta}</p>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col gap-8">
                   <div className="flex justify-between items-center">
                     <h4 className="text-sm font-black text-[#01091d] uppercase tracking-[0.15em]">Volumétrie Signalements Opérationnels</h4>
                   </div>
                   <div className="h-[300px]">
                      <Bar 
                        data={barData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { display: false },
                            x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' } }
                          }
                        }} 
                      />
                   </div>
                </div>
                <div className="col-span-4 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col gap-10">
                   <h4 className="text-sm font-black text-[#01091d] uppercase tracking-[0.15em] text-center">Score de Sévérité IA</h4>
                   <div className="flex-1 flex items-center justify-center">
                      <div className="w-[180px] h-[180px] relative">
                        <Pie 
                          data={donutData}
                          options={{ plugins: { legend: { display: false } } }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Avg</span>
                           <span className="text-2xl font-black text-[#01091d]">7.8</span>
                        </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      {donutData.labels.map((l, i) => (
                        <div key={i} className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }} />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{l}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* --- ANALYTICS VIEW --- */}
        {activeTab === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-12 gap-8 h-[calc(100vh-280px)]"
          >
             <div className="col-span-8 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col gap-10 overflow-hidden">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                      <Brain size={32} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-[#01091d] uppercase tracking-tighter leading-none">Cerveau Cognitif : Diagnostic Avancé</h3>
                      <p className="text-slate-500 text-sm mt-1 uppercase tracking-tight font-medium">Détection d'anomalies structurelles et prédictions préemptives</p>
                   </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar focus:outline-none">
                   {[
                     { title: 'Récurrence critique — Échelles', risk: 'HIGH', desc: '5 signalements / 30 jours sur Secteur Nord. Risque d\'accident imminent calculé à 73%.', rec: 'Remplacer immédiat 4 unités certifiées.' },
                     { title: 'Indicateur Fatigue — Pôle Dépannage', risk: 'MEDIUM', desc: 'Temps de réponse moyen +34% sur les dernières 2 semaines. Corrélation volume +22%.', rec: 'Réorganiser les plannings hebdomadaires.' },
                     { title: 'Corrélation Pannes — Véhicule #042', risk: 'URGENT', desc: '80% des pannes Secteur X impliquent ce véhicule. Télémétrie freins critique.', rec: 'Retrait du service pour maintenance 48h.' },
                   ].map((anom, i) => (
                     <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] group hover:border-blue-600 transition-all flex gap-8">
                        <div className={`w-1 h-20 rounded-full ${anom.risk === 'HIGH' ? 'bg-red-500' : anom.risk === 'MEDIUM' ? 'bg-amber-500' : 'bg-purple-600'}`} />
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-black text-[#01091d] uppercase tracking-tight">{anom.title}</h4>
                              <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${
                                anom.risk === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 
                                anom.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                'bg-purple-50 text-purple-600 border-purple-100'
                              }`}>{anom.risk} LEVEL</span>
                           </div>
                           <p className="text-[11px] font-medium text-slate-500 mb-4">{anom.desc}</p>
                           <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest pl-4 border-l-2 border-blue-100 italic">
                             Recommandation : {anom.rec}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="col-span-4 bg-[#01091d] text-white rounded-[3rem] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150">
                  <Activity size={240} />
               </div>
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em] mb-2">Cognitive Summary</p>
                 <h4 className="text-lg font-black uppercase tracking-tight mb-8">Executive AI Snapshot</h4>
                 <div className="space-y-8">
                    <div>
                       <div className="flex justify-between text-[11px] font-black uppercase tracking-tight mb-3">
                          <span className="text-slate-400">System Satiety</span>
                          <span>81%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '81%' }} className="h-full bg-blue-600" />
                       </div>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                       <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-tight">
                         "L'analyse croisée des données suggère un défaut systémique de maintenance préventive au pôle Nord. Priorité Alpha sur le remplacement matériel."
                       </p>
                    </div>
                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/50 hover:bg-blue-700 transition-all">Publish Report To CEO</button>
                 </div>
               </div>
             </div>
          </motion.div>
        )}

        {/* --- REPORTS VIEW --- */}
        {activeTab === 'reports' && (
          <motion.div 
            key="reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-12 gap-8 h-[calc(100vh-280px)]"
          >
             {/* Report Configuration */}
             <div className="col-span-4 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col gap-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Settings size={14} /> Configuration du Rapport
                </h3>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Période d'analyse</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-blue-600 transition-all">
                         <option>Dernier mois (Avril 2026)</option>
                         <option>Dernier trimestre</option>
                         <option>Année complète</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Format de sortie</label>
                      <div className="grid grid-cols-1 gap-2">
                         {['PDF Exécutif', 'Dashboard Web', 'PowerPoint'].map((fmt, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <div className={`w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center ${i === 0 ? 'border-blue-600' : ''}`}>
                                 {i === 0 && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                              </div>
                              <span className="text-[10px] font-black text-[#01091d] uppercase tracking-tight">{fmt}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="pt-8 space-y-4">
                      <div className="space-y-2 mb-6">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Mail size={12} /> Destinataire du Rapport
                        </label>
                        <input 
                           type="email"
                           value={emailTarget}
                           onChange={(e) => setEmailTarget(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-black focus:outline-none focus:border-blue-600"
                           placeholder="email@example.com"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Inclure résumé exécutif IA</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Analyse détaillée des anomalies</span>
                      </div>
                   </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                   <button 
                     onClick={exportToPdf}
                     disabled={isExporting}
                     className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 flex items-center justify-center gap-3 transition-all"
                   >
                      {isExporting ? <RefreshCcw size={14} className="animate-spin" /> : <Smartphone size={14} />} 
                      {isExporting ? '...' : 'Télécharger'}
                   </button>
                   <button 
                     onClick={sendEmailReport}
                     disabled={isSendingEmail}
                     className="py-4 bg-[#01091d] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:opacity-90 flex items-center justify-center gap-3 transition-all"
                   >
                      {isSendingEmail ? <RefreshCcw size={14} className="animate-spin" /> : <Send size={14} />} 
                      {isSendingEmail ? 'Envoi...' : 'Envoyer IA'}
                   </button>
                </div>

                <div className="pt-4">
                   <button 
                     onClick={signReport}
                     disabled={isSigning || certificate !== null}
                     className={`w-full py-4 border-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        certificate 
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600' 
                        : 'border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                     }`}
                   >
                      <ShieldCheck size={14} /> 
                      {isSigning ? 'Certification...' : certificate ? 'Rapport Signé' : 'Signer avec Nexus Notary'}
                   </button>
                </div>
             </div>

             {/* Report Preview Canvas */}
             <div className="col-span-8 bg-slate-200/50 rounded-[3rem] p-10 overflow-y-auto custom-scrollbar flex justify-center border-2 border-dashed border-slate-300">
                <div 
                  ref={reportRef}
                  className="w-[210mm] bg-[#f3f7fa] shadow-2xl p-[20mm] flex flex-col gap-10 min-h-[297mm]"
                >
                   <div className="flex justify-between items-start border-b-4 border-[#01091d] pb-8">
                      <div>
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Confidentiel — Usage Interne</p>
                         <h2 className="text-4xl font-black text-[#01091d] uppercase tracking-tighter leading-none">Rapport Analytique<br/>Sécurité & Performance</h2>
                         <p className="text-slate-500 mt-4 text-xs font-bold uppercase tracking-widest">Généré par NEXUS AI v2.4 • {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="w-16 h-16 bg-[#01091d] rounded-2xl flex items-center justify-center text-white">
                         <Zap size={32} className="fill-current" />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <h4 className="text-sm font-black text-[#01091d] uppercase tracking-widest underline decoration-blue-600 decoration-4 underline-offset-8">01 — Résumé Exécutif</h4>
                         <p className="text-[11px] text-[#01091d] leading-relaxed font-medium">
                            Au mois d'Avril 2026, nous notons une hausse significative des signalements pour le {formTitle} (+18%). 
                            L'analyse cognitive identifie trois zones critiques nécessitant une intervention immédiate. 
                            Le ROI projeté pour ces remédiations est estimé à 15.8x par rapport au risque de sinistre.
                         </p>
                      </div>
                      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4">
                         <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Indicateurs Clés</h4>
                         {[
                           { label: 'Indice Confiance IA', val: '94.2%' },
                           { label: 'Volume Capturé', val: submissions },
                           { label: 'Taux de Risque', val: '7.8/10' },
                         ].map((s, i) => (
                           <div key={i} className="flex justify-between items-end border-b border-slate-50 pb-2">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{s.label}</span>
                              <span className="text-sm font-black text-[#01091d]">{s.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-sm font-black text-[#01091d] uppercase tracking-widest underline decoration-blue-600 decoration-4 underline-offset-8">02 — Analyse des Anomalies</h4>
                      <div className="grid grid-cols-1 gap-4">
                         {[
                           { t: 'Récurrence critique — Échelles', r: 'HIGH', d: 'Risque imminent de chute au Secteur Nord.' },
                           { t: 'Fatigue Équipes Dépannage', r: 'MEDIUM', d: 'Surcharge opérationnelle détectée (+34%).' },
                         ].map((a, i) => (
                           <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-6">
                              <div className={`w-2 h-10 rounded-full ${a.r === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              <div>
                                 <h5 className="text-[11px] font-black text-[#01091d] uppercase tracking-tight">{a.t}</h5>
                                 <p className="text-[9px] text-slate-500 font-medium">{a.d}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Certification Badge */}
                   {certificate && (
                     <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-5">
                           <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                              <ShieldCheck size={28} className="text-blue-600" />
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Certification d'Intégrité AI</span>
                                 <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-full uppercase">{certificate.validationCode}</span>
                              </div>
                              <p className="text-[10px] leading-relaxed text-slate-500 font-medium italic">
                                 "{certificate.certificateText}"
                              </p>
                              <div className="pt-2 grid grid-cols-2 gap-4">
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">Fingerprint SHA-256</span>
                                    <span className="block text-[9px] font-mono text-slate-600 break-all">{certificate.fingerprint}</span>
                                 </div>
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-400 uppercase">Autorité de Certification</span>
                                    <span className="block text-[9px] font-black text-slate-800">{certificate.issuer}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Footer Signature */}
                   <div className="mt-auto pt-16 flex justify-between items-end">
                      <div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date d'édition</div>
                         <div className="text-[11px] font-black text-slate-800">{new Date().toLocaleDateString('fr-FR')} — {new Date().toLocaleTimeString('fr-FR')}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Signature Electronique</div>
                         <div className="inline-block p-2 border border-slate-200 rounded-lg">
                            <Binary size={24} className="text-slate-300" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications - Overlay */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-3 z-50 pointer-events-none">
        {notifications.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-[10px] font-black text-[#01091d] uppercase tracking-widest pointer-events-auto border-l-4 border-l-blue-600"
          >
             <CheckCircle2 size={16} className="text-blue-600" /> {msg}
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default SmartFormLab;
