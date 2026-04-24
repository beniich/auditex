import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastState, Toast } from '../../hooks/useToast';

const variantConfig = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', icon_color: 'text-emerald-600', title_color: 'text-emerald-900' },
  error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', icon_color: 'text-red-600', title_color: 'text-red-900' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', icon_color: 'text-amber-600', title_color: 'text-amber-900' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', icon_color: 'text-blue-600', title_color: 'text-blue-900' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const config = variantConfig[toast.variant];
  const Icon = config.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${config.bg} ${config.border} max-w-sm w-full`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${config.icon_color}`} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${config.title_color}`}>{toast.title}</p>}
        <p className="text-xs font-medium text-slate-700 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={() => onDismiss(toast.id)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToastState();
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
