import React, { useState, useRef } from 'react';
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
  ShieldCheck,
  Search,
  Globe
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

// Design System Imports
import { PageWrapper } from '../common/PageWrapper';
import { PageHeader } from '../common/PageHeader';
import { SectionCard } from '../common/SectionCard';
import { Button } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';

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

export const NexusAIHub: React.FC = () => {
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
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Nexus AI: SmartForm Lab"
        subtitle="Industrial data architecture and agentic operational intelligence hub."
        badge="Innovation v2.4"
        icon={Zap}
        breadcrumb={['Admin', 'AI', 'Nexus']}
        actions={
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {(['builder', 'pipeline', 'analytics', 'dashboard', 'reports'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:bg-white hover:text-slate-600 shadow-none'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      />

      <AnimatePresence mode="wait">
        
        {/* --- BUILDER VIEW --- */}
        {activeTab === 'builder' && (
          <motion.div 
            key="builder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-12 gap-8"
          >
            {/* Library Panel */}
            <div className="col-span-12 lg:col-span-3">
              <SectionCard title="Component Library" subtitle="Drag or click to add fields" padding="large" className="h-full">
                <div className="space-y-3 mt-6">
                   {Object.entries(FIELD_TYPES).map(([key, config]) => (
                     <button 
                       key={key}
                       onClick={() => addField(key)}
                       className="w-full flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-400 group transition-all"
                     >
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                         <config.icon size={20} />
                       </div>
                       <div className="text-left">
                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{config.label}</p>
                         <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{config.ai ? 'Beta IA' : 'Standard'}</p>
                       </div>
                     </button>
                   ))}
                </div>
              </SectionCard>
            </div>

            {/* Canvas Panel */}
            <div className="col-span-12 lg:col-span-6">
              <SectionCard padding="large" className="border-2 border-dashed border-slate-200 min-h-[600px] flex flex-col">
                 <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                    <input 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="bg-transparent border-none text-xl font-black text-slate-900 uppercase tracking-tight w-full focus:outline-none italic"
                      placeholder="Titre du formulaire..."
                    />
                    <StatusBadge label="ACTIVE" variant="success" />
                 </div>

                 <div className="flex-1 space-y-4">
                    {formFields.length === 0 ? (
                      <div className="h-96 flex flex-col items-center justify-center text-slate-300 gap-6">
                         <div className="p-8 bg-slate-50 rounded-full">
                            <Plus size={48} className="opacity-20" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Initialize canvas by adding library components</p>
                      </div>
                    ) : (
                      formFields.map((field) => (
                        <motion.div 
                          key={field.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-5 bg-white rounded-[2rem] border border-slate-100 flex items-center gap-4 group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                        >
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                             <field.icon size={22} />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{field.label}</h4>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Type: {field.type}</p>
                          </div>
                          {field.ai && <StatusBadge label="AI_SYNC" variant="info" className="scale-75" />}
                          <button 
                            onClick={() => removeField(field.id)}
                            className="p-3 text-slate-200 hover:text-red-500 transition-colors"
                          >
                             <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))
                    )}
                 </div>

                 <div className="pt-10 border-t border-slate-100 flex gap-4 mt-8">
                    <Button variant="secondary" onClick={() => setFormFields([])} className="px-8 bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-500">
                      Clear Canvas
                    </Button>
                    <Button variant="primary" className="flex-1 py-4 bg-slate-900 shadow-slate-900/10" icon={Globe}>
                      Deploy to Network Agents
                    </Button>
                 </div>
              </SectionCard>
            </div>

            {/* Smart Preview Panel */}
            <div className="col-span-12 lg:col-span-3">
              <SectionCard variant="dark" padding="large" className="h-full relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Smartphone size={100} className="text-white" />
                 </div>
                 <div className="relative z-10 mb-10">
                   <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1 italic">Live Capture Preview</h3>
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-tight">Agent-Facing Protocol Interface</p>
                 </div>

                 <div className="flex-1 bg-white/5 rounded-[3rem] border border-white/5 p-8 flex flex-col gap-6 relative group/mockup">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto" />
                    <div className="text-white font-black text-sm uppercase tracking-tight italic">{formTitle}</div>
                    
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                      {formFields.slice(0, 4).map(f => (
                        <div key={f.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover/mockup:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-3 mb-2 opacity-50">
                             <f.icon size={12} className="text-blue-400" />
                             <span className="text-[8px] font-black text-white uppercase tracking-widest">{f.label}</span>
                          </div>
                          <div className="h-8 w-full bg-white/10 rounded-xl" />
                        </div>
                      ))}
                      {formFields.length > 4 && (
                        <div className="text-center text-[9px] text-slate-500 uppercase font-black py-4 border-t border-white/5">+ {formFields.length - 4} More Fields</div>
                      )}
                    </div>

                    <div className="mt-auto">
                       <Button variant="primary" className="w-full py-4 text-[10px] bg-blue-600 shadow-blue-600/20" icon={Activity}>
                         Validate Sync
                       </Button>
                    </div>
                 </div>

                 <div className="relative z-10 flex flex-col gap-3 mt-10">
                   <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Sync Integrity</span>
                      <span className="text-blue-400">98.2%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '98.2%' }} className="h-full bg-blue-600" />
                   </div>
                 </div>
              </SectionCard>
            </div>
          </motion.div>
        )}

        {/* --- PIPELINE VIEW --- */}
        {activeTab === 'pipeline' && (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
          >
             <SectionCard title="Harmonization Dataflow" subtitle="Autonomous neural extraction & semantic cleaning registry" padding="large">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mt-10">
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-tight leading-relaxed max-w-xl">
                        Monitor the live ingestion of unstructured field data as it passes through our cryptographic audit filter and NLP sanitation layers.
                      </p>
                   </div>
                   <Button 
                    variant="brand"
                    size="lg"
                    onClick={runPipeline}
                    disabled={isPipelineRunning}
                    className={`px-12 py-5 shadow-blue-500/20 ${isPipelineRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    icon={RefreshCcw}
                   >
                     {isPipelineRunning ? 'Processing Engine...' : 'Initialize Pipeline Launch'}
                   </Button>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-between items-start gap-8 mt-20 px-10">
                   <div className="absolute top-12 left-20 right-20 h-px bg-slate-100 hidden lg:block -z-0" />
                   
                   {[
                     { label: 'INGESTION', icon: Binary, title: 'Raw Payload' },
                     { label: 'CLEANING', icon: Activity, title: 'NLP Sanitation' },
                     { label: 'CLASSIFY', icon: Brain, title: 'Taxonomy Map' },
                     { label: 'REPORT', icon: FileText, title: 'Struct Graph' },
                   ].map((step, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-8 relative z-10 w-full">
                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center border-4 transition-all duration-1000 ${
                          pipelineStep >= i + 1 ? 'bg-slate-900 border-slate-100 text-white shadow-2xl scale-110' : 
                          pipelineStep === i && isPipelineRunning ? 'bg-blue-600 border-blue-100 text-white animate-pulse' :
                          'bg-white border-slate-100 text-slate-200'
                        }`}>
                           <step.icon size={36} />
                        </div>
                        <div className="text-center">
                           <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${pipelineStep >= i+1 ? 'text-blue-600' : 'text-slate-400'}`}>{step.label}</p>
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{step.title}</h4>
                        </div>
                        {pipelineStep >= i + 1 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] w-full text-[9px] font-mono font-bold text-slate-500 uppercase leading-relaxed shadow-sm italic"
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
             </SectionCard>

             <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-7">
                  <SectionCard variant="dark" title="Inertial Stream" subtitle="Terminal interface for backend node comms" padding="none">
                    <div className="p-8 h-96 font-mono text-[11px] text-blue-400/80 space-y-3 bg-black/20 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-4 text-slate-600 border-b border-white/5 pb-2 mb-4">
                           <Terminal size={14} />
                           <span className="uppercase tracking-widest font-black">LOGS_NODE_ALPHA_04</span>
                        </div>
                        <p className="text-slate-500">[{new Date().toLocaleTimeString()}] INF::INIT_PIPELINE(SECT_ALPHA)</p>
                        {pipelineStep > 0 && <p className="text-emerald-400">[{new Date().toLocaleTimeString()}] INGESTION_COMPLETE::4_OBJECTS_LOCKED</p>}
                        {pipelineStep > 1 && <p className="text-blue-400">[{new Date().toLocaleTimeString()}] SANITIZATION_ENG::RUNNING(MAP_REDUCE)</p>}
                        {pipelineStep > 2 && <p className="text-purple-400">[{new Date().toLocaleTimeString()}] NEURAL_LAYER::CLASSIFIED(HIGH_SEVERITY)</p>}
                        {pipelineStep > 3 && <p className="text-emerald-400 animate-pulse">[{new Date().toLocaleTimeString()}] OUTPUT_EMIT::PIPELINE_STABLE</p>}
                        <span className="animate-pulse">_</span>
                    </div>
                  </SectionCard>
                </div>
                <div className="col-span-12 lg:col-span-5">
                  <SectionCard title="Processed Ledger" subtitle="Immutable history of data transactions" padding="none">
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors shadow-sm">
                                   <History size={20} />
                                </div>
                                <div>
                                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight italic">ENTITY_LOG_00{i}_PACK</p>
                                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{pipelineStep > 3 ? "Processé" : "Vaulted Buffer"}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <StatusBadge label={pipelineStep > 3 ? 'STABLE' : 'IDLE'} variant={pipelineStep > 3 ? 'success' : 'info'} className="scale-75" />
                                <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                             </div>
                          </div>
                        ))}
                    </div>
                  </SectionCard>
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
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Submissions', val: submissions, delta: '+18% vs prev', icon: Layout, variant: 'brand' as const },
                  { label: 'Critical Alerts', val: 23, delta: '+3 new today', icon: AlertCircle, variant: 'danger' as const },
                  { label: 'AI Precision', val: '94.2%', delta: 'High Confidence', icon: Brain, variant: 'info' as const },
                  { label: 'ROI Savings', val: '€38.4k', delta: '+22% efficiency', icon: BarChart3, variant: 'success' as const },
                ].map((kpi, i) => (
                  <SectionCard key={i} padding="large" className="hover:scale-[1.02] transition-all">
                     <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                           <kpi.icon size={28} className={
                              kpi.variant === 'danger' ? 'text-red-500' : 
                              kpi.variant === 'brand' ? 'text-blue-600' : 
                              kpi.variant === 'info' ? 'text-indigo-500' : 'text-emerald-500'
                           } />
                        </div>
                        <StatusBadge label={kpi.variant.toUpperCase()} variant={kpi.variant} className="scale-75" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                     <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3 italic">{kpi.val}</h4>
                     <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 italic bg-slate-50 inline-block px-3 py-1 rounded-lg">{kpi.delta}</p>
                  </SectionCard>
                ))}
             </div>

             <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8">
                  <SectionCard title="Submissions Volumetry" subtitle="Operational signal streams over time" padding="large">
                    <div className="h-[350px] mt-8">
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
                  </SectionCard>
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <SectionCard title="Severity Spectrum" subtitle="Neural risk score distribution" padding="large">
                    <div className="flex flex-col items-center justify-center mt-6">
                       <div className="w-[200px] h-[200px] relative">
                        <Pie 
                          data={donutData}
                          options={{ plugins: { legend: { display: false } } }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</span>
                           <span className="text-3xl font-black text-slate-900 italic">7.8</span>
                        </div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-50">
                       {donutData.labels.map((l, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{l}</span>
                         </div>
                       ))}
                    </div>
                  </SectionCard>
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
            className="grid grid-cols-12 gap-8"
          >
             <div className="col-span-12 lg:col-span-8">
               <SectionCard title="Cognitive Diagnostic Hub" subtitle="Advanced anomaly detection and structural forensic mapping" padding="large">
                  <div className="space-y-6 mt-8">
                     {[
                       { title: 'Critical Recurrence — Industrial Scales', risk: 'HIGH', desc: '5 signals detected in 30 days within Secteur Nord. Incident risk calculated at 73%.', rec: 'Immediate structural overhaul of 4 certified units.' },
                       { title: 'Personnel Fatigue — Maintenance Pool', risk: 'MEDIUM', desc: 'Avg response time +34% over last 2 weeks. Correlation with submission volume +22%.', rec: 'Optimize shift cycles and increase rest buffers.' },
                       { title: 'Fault Correlation — Asset #042', risk: 'URGENT', desc: '80% of Secteur X failures involve this specific node. Brake telemetry at critical levels.', rec: 'Complete asset decommission for 48h forensic audit.' },
                     ].map((anom, i) => (
                       <div key={i} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[3rem] group hover:border-blue-600 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex gap-8">
                          <div className={`w-1.5 h-20 rounded-full ${anom.risk === 'HIGH' || anom.risk === 'URGENT' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight italic">{anom.title}</h4>
                                <StatusBadge label={`${anom.risk} LEVEL`} variant={anom.risk === 'HIGH' || anom.risk === 'URGENT' ? 'danger' : 'warning'} />
                             </div>
                             <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight mb-6">{anom.desc}</p>
                             <div className="flex items-center gap-4 text-blue-600 font-black text-[10px] uppercase tracking-widest pl-6 border-l-4 border-blue-100 bg-blue-50/30 py-3 rounded-r-xl">
                               <ShieldCheck size={16} /> Recommendation: {anom.rec}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </SectionCard>
             </div>

             <div className="col-span-12 lg:col-span-4">
               <SectionCard variant="dark" title="Executive Snapshot" subtitle="AI-generated situational report" padding="large" className="h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none">
                    <Activity size={120} className="text-white" />
                 </div>
                 <div className="relative z-10 space-y-12 mt-6">
                    <div className="space-y-4">
                       <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                          <span className="text-slate-400">System Cognitive Satiety</span>
                          <span className="text-blue-400">81%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '81%' }} className="h-full bg-blue-600" />
                       </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:bg-white/10 transition-all">
                       <p className="text-[10px] text-slate-300 leading-relaxed font-black uppercase tracking-widest italic opacity-80">
                         "Cross-data analysis suggests a systemic defect in predictive maintenance at Sector North. Priority Alpha assigned to hardware lifecycle rejuvenation."
                       </p>
                    </div>

                    <Button variant="primary" className="w-full py-5 bg-blue-600 shadow-blue-500/20" icon={Send}>
                      Publish To Stakeholders
                    </Button>
                 </div>
               </SectionCard>
             </div>
          </motion.div>
        )}

        {/* --- REPORTS VIEW --- */}
        {activeTab === 'reports' && (
          <motion.div 
            key="reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-12 gap-8"
          >
             {/* Report Configuration */}
             <div className="col-span-12 lg:col-span-4">
               <SectionCard title="Configuration" subtitle="Tailor your executive situational report" padding="large" className="flex flex-col gap-10">
                  <div className="space-y-8 mt-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Window</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-blue-600 transition-all cursor-pointer">
                           <option>Dernier mois (Avril 2026)</option>
                           <option>Dernier trimestre</option>
                           <option>Année complète</option>
                        </select>
                     </div>
                     
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Artifact</label>
                        <div className="space-y-2">
                           {['PDF Exécutif (Notarized)', 'Live Dashboard Link', 'Situational deck (PPT)'].map((fmt, i) => (
                             <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-blue-200 transition-all">
                                <div className={`w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center ${i === 0 ? 'border-blue-600' : ''}`}>
                                   {i === 0 && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{fmt}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-8 space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                             <Mail size={14} /> Intelligence Distribution
                          </label>
                          <input 
                             type="email"
                             value={emailTarget}
                             onChange={(e) => setEmailTarget(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] font-bold focus:outline-none focus:border-blue-600 italic"
                             placeholder="email@example.com"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { label: 'Include Executive AI Digest', checked: true },
                            { label: 'Attach Deep Anomaly Maps', checked: true }
                          ].map((opt, i) => (
                            <div key={i} className="flex items-center gap-4">
                               <input type="checkbox" defaultChecked={opt.checked} className="w-5 h-5 rounded-lg border-slate-200 text-blue-600" />
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{opt.label}</span>
                            </div>
                          ))}
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto pt-10 grid grid-cols-2 gap-4">
                     <Button 
                       variant="secondary" 
                       onClick={exportToPdf}
                       loading={isExporting}
                       className="py-4 text-[10px] border-slate-200"
                       icon={FileText}
                     >
                        Download
                     </Button>
                     <Button 
                       variant="primary" 
                       onClick={sendEmailReport}
                       loading={isSendingEmail}
                       className="bg-slate-900 shadow-slate-900/10 py-4 text-[10px]"
                       icon={Send}
                     >
                        Send Situation
                     </Button>
                  </div>

                  <Button 
                    variant="ghost"
                    onClick={signReport}
                    disabled={isSigning || certificate !== null}
                    className={`w-full py-5 border-2 mt-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl ${
                       certificate 
                       ? 'border-emerald-200 bg-emerald-50 text-emerald-600' 
                       : 'border-slate-100 text-slate-400 hover:text-slate-900'
                    }`}
                    icon={ShieldCheck}
                  >
                     {isSigning ? 'Certification...' : certificate ? 'Rapport Signé' : 'Sign with Nexus Notary'}
                  </Button>
               </SectionCard>
             </div>

             {/* Report Preview Canvas */}
             <div className="col-span-12 lg:col-span-8">
               <SectionCard padding="none" className="bg-slate-100 border-2 border-dashed border-slate-300 min-h-[800px] flex justify-center py-20 px-10">
                  <div 
                    ref={reportRef}
                    className="w-full max-w-[210mm] bg-[#f3f7fa] shadow-2xl p-[20mm] flex flex-col gap-12 min-h-[297mm] rounded-sm transform scale-[0.9] origin-top"
                  >
                     <div className="flex justify-between items-start border-b-8 border-slate-900 pb-10">
                        <div className="max-w-xl">
                           <StatusBadge label="CONFIDENTIAL — INTERNAL PROTOCOL" variant="info" className="mb-4 bg-blue-600 text-white border-none" />
                           <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] italic">Situational Analytics<br/>Intelligence Report</h2>
                           <p className="text-slate-500 mt-6 text-xs font-black uppercase tracking-[0.3em] font-mono">Generated by NEXUS CORE ENGINE v2.4 • {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                           <Zap size={40} className="fill-current" />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-blue-600 inline-block pb-2">01 — Executive Summary</h4>
                           <p className="text-[11px] text-slate-800 leading-relaxed font-bold uppercase tracking-tight">
                              For the analysis window of April 2026, we observe a critical spike in reported deviations for {formTitle} (+18%). 
                              The cognition engine has isolated three high-density risk clusters within the Northern Quadrant. 
                              Remediation ROI is calculated at 15.8x against projected sinistral costs.
                           </p>
                        </div>
                        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary KPI Matrix</h4>
                           {[
                             { label: 'AI Confidence Index', val: '94.2%' },
                             { label: 'Payload Volume', val: submissions },
                             { label: 'Cumulative Risk Score', val: '7.8/10' },
                           ].map((s, i) => (
                             <div key={i} className="flex justify-between items-end border-b border-slate-50 pb-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{s.label}</span>
                                <span className="text-lg font-black text-slate-900 italic">{s.val}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-blue-600 inline-block pb-2">02 — Anomaly Forensics</h4>
                        <div className="grid grid-cols-1 gap-4">
                           {[
                             { t: 'Critical Recurrence — Industrial Scales', r: 'HIGH', d: 'Imminent failure risk detected at Secteur Nord.' },
                             { t: 'Maintenance Crew Fatigue Pattern', r: 'MEDIUM', d: 'Operational saturation across shift B (+34%).' },
                           ].map((a, i) => (
                             <div key={i} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-8 shadow-sm">
                                <div className={`w-1.5 h-12 rounded-full ${a.r === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                <div className="flex-1">
                                   <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">{a.t}</h5>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{a.d}</p>
                                </div>
                                <StatusBadge label={a.r} variant={a.r === 'HIGH' ? 'danger' : 'warning'} className="scale-75" />
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Certification Badge */}
                     {certificate && (
                       <div className="mt-8 pt-10 border-t-2 border-slate-900">
                          <div className="bg-white border-2 border-slate-900 rounded-[3rem] p-10 flex items-start gap-8 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-10 opacity-5">
                                <ShieldCheck size={120} />
                             </div>
                             <div className="p-5 bg-slate-900 rounded-[1.5rem] shadow-xl text-white">
                                <ShieldCheck size={32} />
                             </div>
                             <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                   <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">AI Cryptographic Integrity Notary</span>
                                   <StatusBadge label={certificate.validationCode} variant="success" className="px-4" />
                                </div>
                                <p className="text-[11px] leading-relaxed text-slate-600 font-black uppercase tracking-tight italic">
                                   "{certificate.certificateText}"
                                </p>
                                <div className="pt-6 grid grid-cols-2 gap-10">
                                   <div>
                                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Fingerprint SHA-256</span>
                                      <span className="block text-[10px] font-mono text-slate-800 break-all leading-tight">{certificate.fingerprint}</span>
                                   </div>
                                   <div className="text-right">
                                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Certification Authority</span>
                                      <span className="block text-[10px] font-black text-slate-900 uppercase tracking-tighter">{certificate.issuer}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                     )}

                     {/* Footer Signature */}
                     <div className="mt-auto pt-20 flex justify-between items-end border-t border-slate-100">
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">Chronological Stamp</div>
                           <div className="text-xs font-black text-slate-900 uppercase tabular-nums">{new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 italic">Autonomous Signature</div>
                           <div className="inline-block p-4 border-2 border-slate-900 rounded-[1.5rem] bg-slate-900 text-white shadow-xl">
                              <Binary size={28} />
                           </div>
                        </div>
                     </div>
                  </div>
               </SectionCard>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications - Overlay */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50 pointer-events-none">
        {notifications.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-slate-900 border border-white/10 px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 text-[10px] font-black text-white uppercase tracking-[0.2em] pointer-events-auto"
          >
             <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <CheckCircle2 size={14} />
             </div>
             {msg}
          </motion.div>
        ))}
      </div>

    </PageWrapper>
  );
};

export default NexusAIHub;
