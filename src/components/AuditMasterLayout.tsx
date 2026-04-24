import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  Users,
  Lock,
  BarChart3,
  Gavel,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Activity,
  Network,
  Brain,
  Terminal,
  Library,
  Workflow,
  Server,
  MapPin,
  AppWindow,
  Zap,
  Radio,
  Wallet,
  Skull,
  Globe,
  CreditCard,
  Bot,
  Award,
  Tag,
  BellDot,
  MessageSquare,
  Blocks,
  ShieldCheck,
  Database,
  FileEdit,
  Route,
  Building2,
  AlertTriangle,
  FileSearch,
  UserPlus,
  Key,
  Lightbulb,
  Wrench,
  HelpCircle,
  AreaChart,
  Scale,
  BringToFront
} from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { ToastContainer } from './common/ToastContainer';
import { motion, AnimatePresence } from 'motion/react';
import { useQuota } from '../hooks/useQuota';
import { useApiQuery } from '../hooks/useApiQuery';
import { NotificationService } from '../services/NotificationService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 transition-all hover:bg-white/5 group relative ${
      active 
      ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500' 
      : 'text-slate-400 hover:text-white'
    }`}
  >
    <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'group-hover:bg-slate-800'}`}>
      <Icon size={18} />
    </div>
    {!collapsed && (
      <span className="font-sans text-[10px] uppercase tracking-[0.15em] font-black whitespace-nowrap">
        {label}
      </span>
    )}
  </button>
);

const NavSection = ({ title, children, collapsed }: any) => (
  <div className="mb-8">
    {!collapsed && (
      <div className="px-6 mb-4 flex items-center gap-2">
        <div className="h-px w-4 bg-slate-800" />
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</span>
      </div>
    )}
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

export const AuditMasterLayout = ({ children, activeTab, onTabChange }: any) => {
  const { t, i18n } = useTranslation('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { balance, isLow } = useQuota();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useApiQuery(
    ['notifications'],
    () => NotificationService.getNotifications(),
    { refetchInterval: 30000 }
  );

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] dark:bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside 
        className={`flex flex-col glass-sidebar fixed left-0 h-screen z-50 transition-all duration-500 shadow-2xl ${
          isCollapsed ? 'w-24' : 'w-[280px]'
        }`}
      >
        <div className="px-8 py-10 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="min-w-10 h-10 bg-blue-600 flex items-center justify-center rounded-xl shadow-lg">
              <Shield size={22} className="text-white fill-current" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <h1 className="text-xl font-black text-[#091426] dark:text-white leading-none tracking-tighter uppercase italic">Auditax</h1>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-600 mt-1">Enterprise Core</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar py-4 overflow-x-hidden">
          <NavSection title="COMMAND" collapsed={isCollapsed}>
            <NavItem icon={LayoutDashboard} label="Main Dashboard" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} collapsed={isCollapsed}/>
            <NavItem icon={Radio} label="War Room" active={activeTab === 'war_room'} onClick={() => onTabChange('war_room')} collapsed={isCollapsed}/>
            <NavItem icon={Zap} label="Chaos Lab" active={activeTab === 'chaos_lab'} onClick={() => onTabChange('chaos_lab')} collapsed={isCollapsed}/>
            <NavItem icon={BellDot} label="Action Center" active={activeTab === 'action_center'} onClick={() => onTabChange('action_center')} collapsed={isCollapsed}/>
            <NavItem icon={AlertTriangle} label="Incidents" active={activeTab === 'incidents'} onClick={() => onTabChange('incidents')} collapsed={isCollapsed}/>
            <NavItem icon={MessageSquare} label="Collaboration" active={activeTab === 'collaboration'} onClick={() => onTabChange('collaboration')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="GOVERNANCE & AUDIT" collapsed={isCollapsed}>
            <NavItem icon={Library} label="Policy Library" active={activeTab === 'policy_center'} onClick={() => onTabChange('policy_center')} collapsed={isCollapsed}/>
            <NavItem icon={CheckCircle2} label="Ready Scorecard" active={activeTab === 'certification_scorecard'} onClick={() => onTabChange('certification_scorecard')} collapsed={isCollapsed}/>
            <NavItem icon={History} label="Immutable Ledger" active={activeTab === 'ledger_browser'} onClick={() => onTabChange('ledger_browser')} collapsed={isCollapsed}/>
            <NavItem icon={Workflow} label="Task Board" active={activeTab === 'remediation_workflow'} onClick={() => onTabChange('remediation_workflow')} collapsed={isCollapsed}/>
            <NavItem icon={Scale} label="Regulator Portal" active={activeTab === 'regulator'} onClick={() => onTabChange('regulator')} collapsed={isCollapsed}/>
            <NavItem icon={FileSearch} label="Security Logs" active={activeTab === 'security_log'} onClick={() => onTabChange('security_log')} collapsed={isCollapsed}/>
            <NavItem icon={Shield} label="Sovereignty" active={activeTab === 'sovereignty'} onClick={() => onTabChange('sovereignty')} collapsed={isCollapsed}/>
            <NavItem icon={Award} label="Badge Center" active={activeTab === 'badge_center'} onClick={() => onTabChange('badge_center')} collapsed={isCollapsed}/>
            <NavItem icon={BringToFront} label="Batch Processing" active={activeTab === 'batch_center'} onClick={() => onTabChange('batch_center')} collapsed={isCollapsed}/>
            <NavItem icon={ShieldCheck} label="Control Library" active={activeTab === 'control_library'} onClick={() => onTabChange('control_library')} collapsed={isCollapsed}/>
            <NavItem icon={Database} label="AI Knowledge (RAG)" active={activeTab === 'rag_knowledge'} onClick={() => onTabChange('rag_knowledge')} collapsed={isCollapsed}/>
            <NavItem icon={FileEdit} label="Report Builder" active={activeTab === 'report_builder'} onClick={() => onTabChange('report_builder')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="INFRASTRUCTURE" collapsed={isCollapsed}>
            <NavItem icon={Server} label="Org Hierarchy" active={activeTab === 'entities'} onClick={() => onTabChange('entities')} collapsed={isCollapsed}/>
            <NavItem icon={MapPin} label="Discovery Hub" active={activeTab === 'discovery_center'} onClick={() => onTabChange('discovery_center')} collapsed={isCollapsed}/>
            <NavItem icon={Tag} label="Smart Tagging" active={activeTab === 'asset_tagging'} onClick={() => onTabChange('asset_tagging')} collapsed={isCollapsed}/>
            <NavItem icon={Activity} label="Risk Register" active={activeTab === 'regional_risk'} onClick={() => onTabChange('regional_risk')} collapsed={isCollapsed}/>
            <NavItem icon={Route} label="Data Mapping" active={activeTab === 'data_mapping'} onClick={() => onTabChange('data_mapping')} collapsed={isCollapsed}/>
            <NavItem icon={Building2} label="Subsidiary Detail" active={activeTab === 'subsidiary_detail'} onClick={() => onTabChange('subsidiary_detail')} collapsed={isCollapsed}/>
            <NavItem icon={Blocks} label="Marketplace" active={activeTab === 'integrations'} onClick={() => onTabChange('integrations')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="SYSTEM" collapsed={isCollapsed}>
            <NavItem icon={BarChart3} label="Financial Ops" active={activeTab === 'financial_dashboard'} onClick={() => onTabChange('financial_dashboard')} collapsed={isCollapsed}/>
            <NavItem icon={Bot} label="AI Agents" active={activeTab === 'ai_agents'} onClick={() => onTabChange('ai_agents')} collapsed={isCollapsed}/>
            <NavItem icon={AreaChart} label="AI Analytics" active={activeTab === 'ai_analytics'} onClick={() => onTabChange('ai_analytics')} collapsed={isCollapsed}/>
            <NavItem icon={Users} label="Access Control" active={activeTab === 'access_control'} onClick={() => onTabChange('access_control')} collapsed={isCollapsed}/>
            <NavItem icon={UserPlus} label="IDP Setup" active={activeTab === 'identity_setup'} onClick={() => onTabChange('identity_setup')} collapsed={isCollapsed}/>
            <NavItem icon={Key} label="API Security" active={activeTab === 'api_security'} onClick={() => onTabChange('api_security')} collapsed={isCollapsed}/>
            <NavItem icon={Lightbulb} label="Innovation Lab" active={activeTab === 'innovation_lab'} onClick={() => onTabChange('innovation_lab')} collapsed={isCollapsed}/>
            <NavItem icon={Wrench} label="Maintenance" active={activeTab === 'maintenance'} onClick={() => onTabChange('maintenance')} collapsed={isCollapsed}/>
            <NavItem icon={CreditCard} label="Billing & Usage" active={activeTab === 'billing'} onClick={() => onTabChange('billing')} collapsed={isCollapsed}/>
            <NavItem icon={Settings} label="System Config" active={activeTab === 'profile'} onClick={() => onTabChange('profile')} collapsed={isCollapsed}/>
            <NavItem icon={HelpCircle} label="Help & Support" active={activeTab === 'help'} onClick={() => onTabChange('help')} collapsed={isCollapsed}/>
          </NavSection>
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 space-y-4">
          <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="w-full flex items-center justify-center h-10 rounded-xl bg-white/5 text-slate-400 hover:text-[#091426]"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2"><ChevronLeft size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">{t('sidebar.collapse')}</span></div>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${isCollapsed ? 'ml-24' : 'ml-[280px]'}`}>
        {/* Header */}
        <header className="sticky top-0 w-full flex justify-between items-center h-20 px-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-slate-200 z-40">
          <div className="flex items-center flex-1">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-400"><Search size={20} /></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab.replace('_', ' ')}</span>
                   <span className="text-xs font-black text-[#091426] uppercase">Sector: Global Mainframe</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isLow ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
              <Wallet size={14} />
              <span className="text-[10px] font-black">${balance.toFixed(2)}</span>
            </div>
            
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="text-slate-400 hover:text-blue-600 transition-all">
                <Bell size={22} className={unreadCount > 0 ? 'animate-bounce' : ''} />
              </button>
              {/* Notification dropdown simplified for brevity as logic remains similar */}
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
               <button 
                 onClick={() => i18n.changeLanguage('fr')}
                 className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${i18n.language === 'fr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 FR
               </button>
               <button 
                 onClick={() => i18n.changeLanguage('en')}
                 className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${i18n.language === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 EN
               </button>
            </div>

            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <div className="p-6 lg:p-10 flex-1 w-full max-w-[1700px] mx-auto">
          {children}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};
