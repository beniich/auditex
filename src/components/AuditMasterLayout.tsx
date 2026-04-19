import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  Settings, 
  Search, 
  Bell, 
  FileText, 
  Plus,
  Users,
  Lock,
  BarChart3,
  Gavel,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Activity,
  AlertTriangle,
  Database,
  Network,
  Scale,
  Brain,
  Terminal,
  Library,
  Share2,
  FileCheck,
  Workflow,
  HelpCircle,
  Wrench,
  Server,
  Cable,
  MapPin,
  ShieldCheck,
  LogOut,
  AppWindow,
  Cpu,
  Zap
} from 'lucide-react';
import { UserButton, SignOutButton } from '@clerk/clerk-react';
import { ToastContainer } from './ToastContainer';
import { motion, AnimatePresence } from 'motion/react';

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
    {collapsed && active && (
      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] dark:bg-slate-950 font-sans">
      {/* Sidebar - Dark Industrial Style */}
      <aside 
        className={`flex flex-col bg-[#091426] fixed left-0 h-screen z-50 transition-all duration-500 shadow-2xl ${
          isCollapsed ? 'w-24' : 'w-[280px]'
        }`}
      >
        <div className="px-8 py-10 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="min-w-10 h-10 bg-blue-600 flex items-center justify-center rounded-xl shadow-lg shadow-blue-500/20">
              <Shield size={22} className="text-white fill-current" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <h1 className="text-xl font-black text-white leading-none tracking-tighter uppercase italic">Auditax</h1>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400 mt-1">Enterprise Core</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar py-4">
          <NavSection title="Command Center" collapsed={isCollapsed}>
            <NavItem icon={LayoutDashboard} label="Global Board" active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} collapsed={isCollapsed}/>
            <NavItem icon={ClipboardList} label="Audit Runner" active={activeTab === 'audits'} onClick={() => onTabChange('audits')} collapsed={isCollapsed}/>
            <NavItem icon={CheckCircle2} label="Compliance Hub" active={activeTab === 'compliance'} onClick={() => onTabChange('compliance')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="Forensics & Ops" collapsed={isCollapsed}>
            <NavItem icon={Workflow} label="Remediation" active={activeTab === 'remediation_workflow'} onClick={() => onTabChange('remediation_workflow')} collapsed={isCollapsed}/>
            <NavItem icon={Terminal} label="Integrity Diag" active={activeTab === 'integrity_diagnostics'} onClick={() => onTabChange('integrity_diagnostics')} collapsed={isCollapsed}/>
            <NavItem icon={Activity} label="Forensic View" active={activeTab === 'forensics'} onClick={() => onTabChange('forensics')} collapsed={isCollapsed}/>
            <NavItem icon={History} label="Audit Trail" active={activeTab === 'trail'} onClick={() => onTabChange('trail')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="Governance" collapsed={isCollapsed}>
            <NavItem icon={Gavel} label="Portal Portal" active={activeTab === 'governance'} onClick={() => onTabChange('governance')} collapsed={isCollapsed}/>
            <NavItem icon={Library} label="Policy Vault" active={activeTab === 'policy_library'} onClick={() => onTabChange('policy_library')} collapsed={isCollapsed}/>
            <NavItem icon={Users} label="Certifications" active={activeTab === 'users'} onClick={() => onTabChange('users')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="Network & Infra" collapsed={isCollapsed}>
            <NavItem icon={Network} label="Topology" active={activeTab === 'network_topology'} onClick={() => onTabChange('network_topology')} collapsed={isCollapsed}/>
            <NavItem icon={Lock} label="System Vault" active={activeTab === 'vault'} onClick={() => onTabChange('vault')} collapsed={isCollapsed}/>
            <NavItem icon={Server} label="Asset Mapper" active={activeTab === 'entities'} onClick={() => onTabChange('entities')} collapsed={isCollapsed}/>
            <NavItem icon={MapPin} label="Regional Risk" active={activeTab === 'regional_risk'} onClick={() => onTabChange('regional_risk')} collapsed={isCollapsed}/>
          </NavSection>

          <NavSection title="Analytics" collapsed={isCollapsed}>
            <NavItem icon={Brain} label="Risk Prediction" active={activeTab === 'analytics'} onClick={() => onTabChange('analytics')} collapsed={isCollapsed}/>
            <NavItem icon={BarChart3} label="BI Reporting" active={activeTab === 'stakeholder_reporting'} onClick={() => onTabChange('stakeholder_reporting')} collapsed={isCollapsed}/>
          </NavSection>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="w-full flex items-center justify-center h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2"><ChevronLeft size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Collapse View</span></div>}
          </button>
          
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-4'} py-3 bg-white/5 rounded-2xl border border-white/5 overflow-hidden`}>
             <UserButton afterSignOutUrl="/" />
             {!isCollapsed && (
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white leading-none">ROOT_ADMIN</span>
                  <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter mt-1">Tier-5 Access</span>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${
          isCollapsed ? 'ml-24' : 'ml-[280px]'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 w-full flex justify-between items-center h-20 px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-40 shadow-sm">
          <div className="flex items-center flex-1">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-400">
                   <Search size={20} />
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab.replace('_', ' ')}</span>
                   <span className="text-xs font-black text-[#091426] uppercase">Sector: Global Mainframe</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 border-r border-slate-200 dark:border-slate-700 pr-8">
              <button className="text-slate-400 hover:text-blue-600 transition-all relative group">
                <Bell size={22} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
              </button>
              <button className="text-slate-400 hover:text-blue-600 transition-all">
                <Zap size={22} className="fill-current" />
              </button>
            </div>
            
            <button className="bg-[#091426] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
               <Plus size={16} /> Deploy Asset
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-6 lg:p-10 flex-1 w-full max-w-[1700px] mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};
