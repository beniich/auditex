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
  Globe
} from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { ToastContainer } from './ToastContainer';
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
          <NavSection title={t('sidebar.sections.system')} collapsed={isCollapsed}>
            <NavItem icon={AppWindow} label={t('sidebar.links.capability')} active={activeTab === 'capability_center'} onClick={() => onTabChange('capability_center')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title={t('sidebar.sections.command')} collapsed={isCollapsed}>
            <NavItem icon={LayoutDashboard} label={t('sidebar.links.global_board')} active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} collapsed={isCollapsed}/>
            <NavItem icon={Radio} label={t('sidebar.links.war_room')} active={activeTab === 'war_room'} onClick={() => onTabChange('war_room')} collapsed={isCollapsed}/>
            <NavItem icon={ClipboardList} label={t('sidebar.links.audit_runner')} active={activeTab === 'audits'} onClick={() => onTabChange('audits')} collapsed={isCollapsed}/>
            <NavItem icon={CheckCircle2} label={t('sidebar.links.compliance_hub')} active={activeTab === 'compliance'} onClick={() => onTabChange('compliance')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title={t('sidebar.sections.forensics')} collapsed={isCollapsed}>
            <NavItem icon={Workflow} label={t('sidebar.links.remediation')} active={activeTab === 'remediation_workflow'} onClick={() => onTabChange('remediation_workflow')} collapsed={isCollapsed}/>
            <NavItem icon={Terminal} label={t('sidebar.links.integrity_diag')} active={activeTab === 'integrity_diagnostics'} onClick={() => onTabChange('integrity_diagnostics')} collapsed={isCollapsed}/>
            <NavItem icon={Activity} label={t('sidebar.links.forensics')} active={activeTab === 'forensics'} onClick={() => onTabChange('forensics')} collapsed={isCollapsed}/>
            <NavItem icon={History} label={t('sidebar.links.audit_trail')} active={activeTab === 'trail'} onClick={() => onTabChange('trail')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title={t('sidebar.sections.governance')} collapsed={isCollapsed}>
            <NavItem icon={Gavel} label={t('sidebar.links.governance_portal')} active={activeTab === 'governance'} onClick={() => onTabChange('governance')} collapsed={isCollapsed}/>
            <NavItem icon={Library} label={t('sidebar.links.policy_vault')} active={activeTab === 'policy_library'} onClick={() => onTabChange('policy_library')} collapsed={isCollapsed}/>
            <NavItem icon={Users} label={t('sidebar.links.certifications')} active={activeTab === 'users'} onClick={() => onTabChange('users')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title={t('sidebar.sections.infra')} collapsed={isCollapsed}>
            <NavItem icon={Network} label={t('sidebar.links.topology')} active={activeTab === 'network_topology'} onClick={() => onTabChange('network_topology')} collapsed={isCollapsed}/>
            <NavItem icon={Lock} label={t('sidebar.links.system_vault')} active={activeTab === 'vault'} onClick={() => onTabChange('vault')} collapsed={isCollapsed}/>
            <NavItem icon={Server} label={t('sidebar.links.asset_mapper')} active={activeTab === 'entities'} onClick={() => onTabChange('entities')} collapsed={isCollapsed}/>
            <NavItem icon={MapPin} label={t('sidebar.links.regional_risk')} active={activeTab === 'regional_risk'} onClick={() => onTabChange('regional_risk')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title={t('sidebar.sections.analytics')} collapsed={isCollapsed}>
            <NavItem icon={Brain} label={t('sidebar.links.risk_prediction')} active={activeTab === 'analytics'} onClick={() => onTabChange('analytics')} collapsed={isCollapsed}/>
            <NavItem icon={Wallet} label={t('sidebar.links.cfo_dashboard')} active={activeTab === 'financial_dashboard'} onClick={() => onTabChange('financial_dashboard')} collapsed={isCollapsed}/>
            <NavItem icon={BarChart3} label={t('sidebar.links.bi_reporting')} active={activeTab === 'stakeholder_reporting'} onClick={() => onTabChange('stakeholder_reporting')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title={t('sidebar.sections.red_team')} collapsed={isCollapsed}>
            <NavItem icon={Skull} label={t('sidebar.links.chaos_lab')} active={activeTab === 'chaos_lab'} onClick={() => onTabChange('chaos_lab')} collapsed={isCollapsed}/>
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
