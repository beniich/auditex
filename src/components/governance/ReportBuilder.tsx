import React, { useState } from 'react';
import { 
  PieChart, 
  Table, 
  FileText, 
  Award, 
  Shield, 
  Download, 
  Layout, 
  Eye, 
  Save, 
  Plus, 
  GripVertical 
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COMPONENTS = [
  { id: 'risk_matrix', name: 'Risk Matrix Chart', icon: PieChart },
  { id: 'audit_trail', name: 'Audit Trail Table', icon: Table },
  { id: 'reg_summary', name: 'Regulation Summary', icon: FileText },
  { id: 'attestation', name: 'Attestation Statement', icon: Award },
  { id: 'secure_seal', name: 'Secure Seal (Military)', icon: Shield }
];

const SortableItem = ({ id, name, icon: Icon }: { id: string, name: string, icon: any }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 group cursor-grab active:cursor-grabbing hover:border-blue-300 transition-all"
    >
      <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
        <GripVertical size={20} />
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-[#091426] uppercase tracking-tight">{name}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Live Component Slot</p>
      </div>
    </div>
  );
};

export const ReportBuilder = () => {
  const [reportItems, setReportItems] = useState<string[]>(['risk_matrix', 'audit_trail']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setReportItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex h-full bg-[#f8fafc] rounded-[3rem] overflow-hidden min-h-[900px] border border-slate-200">
      {/* Left Sidebar: Components */}
      <div className="w-[400px] bg-white border-r border-slate-200 p-10 flex flex-col gap-8">
         <div>
            <h2 className="text-2xl font-black text-[#091426] tracking-tight">Report Builder</h2>
            <p className="text-slate-400 font-medium text-xs mt-1 uppercase tracking-widest">DRAG & DROP COMPONENT PALETTE</p>
         </div>

         <div className="flex flex-col gap-3">
            {COMPONENTS.map(comp => (
               <div 
                 key={comp.id} 
                 onClick={() => {
                   if (!reportItems.includes(comp.id)) {
                     setReportItems([...reportItems, comp.id]);
                   }
                 }}
                 className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
               >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                     <comp.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-[#091426]">{comp.name}</span>
                    <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                      <Plus size={14} />
                    </button>
                  </div>
               </div>
            ))}
         </div>

         <div className="mt-auto p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Build Advice</p>
            <p className="text-xs font-semibold text-blue-900 leading-relaxed">Include the 'Secure Seal' for reports destined for external regulatory bodies to ensure cryptographic integrity.</p>
         </div>
      </div>

      {/* Main Area: Preview */}
      <div className="flex-1 flex flex-col">
         <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center px-10">
            <div className="flex gap-4">
               <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                  <Eye size={14} /> Preview Mode
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                  <Save size={14} /> Save Draft
               </button>
            </div>
            <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:opacity-90 transition-all">
               <Download size={14} /> Export PDF
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-16 bg-slate-200/50 flex justify-center">
            {/* The "Paper" */}
            <div className="w-[800px] min-h-[1032px] bg-white shadow-2xl rounded-sm p-20 flex flex-col gap-12 border border-slate-300">
               {/* Header */}
               <div className="flex justify-between items-start border-b-2 border-[#091426] pb-8">
                  <div>
                     <h1 className="text-xs font-black text-[#091426] uppercase tracking-[0.3em]">MILITARY GRADE COMPLIANCE</h1>
                     <p className="text-slate-400 text-[10px] uppercase font-bold mt-1">AuditAX Forensic Instance #556A</p>
                  </div>
                  <div className="w-24 h-8 bg-slate-100 rounded flex items-center justify-center">
                     <span className="text-[10px] font-black text-slate-400">LOGO HERE</span>
                  </div>
               </div>

               {/* Title Section */}
               <div className="text-center py-10">
                  <h2 className="text-4xl font-black text-[#091426] uppercase tracking-tight">Q3 2024 Compliance & Risk Report</h2>
                  <p className="text-slate-400 font-serif italic mt-2">Generated on October 25, 2024 • Certified by TrustEngine™</p>
               </div>

               {/* AI Summary */}
               <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative">
                  <div className="absolute -top-3 left-8 bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">AI executive summary</div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                     Automated forensic analysis indicates a 90.5% adherence to international security standards (ISO/NIST). 
                     Key vulnerabilities identified in regional S3 buckets have been mitigated as of Oct 20.
                  </p>
               </div>

               {/* Dynamic Content Slots with Drag & Drop */}
               <div className="flex flex-col gap-8">
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={reportItems}
                      strategy={verticalListSortingStrategy}
                    >
                      {reportItems.map(itemId => {
                        const comp = COMPONENTS.find(c => c.id === itemId);
                        if (!comp) return null;
                        return (
                          <SortableItem 
                            key={itemId} 
                            id={itemId} 
                            name={comp.name} 
                            icon={comp.icon} 
                          />
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                  {reportItems.length === 0 && (
                    <div className="p-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-4">
                      <Layout size={48} />
                      <p className="text-xs font-black uppercase tracking-widest">Drop components here to build your report</p>
                    </div>
                  )}
               </div>

               {/* Footer */}
               <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-8 opacity-50">
                  <span className="text-[10px] font-bold text-slate-400">Page 1 of 18</span>
                  <div className="flex gap-2 items-center">
                     <Shield size={12} className="text-blue-600" />
                     <span className="text-[9px] font-black uppercase">SECURE DRAFT v.2.4.1</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default ReportBuilder;
