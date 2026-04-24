import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Pencil, MoreHorizontal } from 'lucide-react';

const Toggle = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-200 shadow-inner'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
  </button>
);

const USERS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@auditax.com', role: 'Manager', active: '10 mins ago', admin: false, auditor: true, viewer: true },
  { id: 2, name: 'Markin Smith', email: 'sarah.j@auditax.com', role: 'Senior Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 3, name: 'David Lee', email: 'david.l@auditax.com', role: 'Senior Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 4, name: 'Iliurin Flonin', email: 'tiunin.j@auditax.com', role: 'Senior Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 5, name: 'Sarah Johnson', email: 'sarah.ij@auditax.com', role: 'Manager', active: '8 days ago', admin: false, auditor: true, viewer: true },
  { id: 6, name: 'David Lee', email: 'david.l@auditax.com', role: 'Senior Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 7, name: 'Luthana Pachson', email: 'lanton.j@auditax.com', role: 'Manager', active: '2 hours ago', admin: false, auditor: true, viewer: true },
  { id: 8, name: 'Markin Smith', email: 'david.l@auditax.com', role: 'Senior Analyst', active: '2 hours ago', admin: false, auditor: true, viewer: true }
];

export const AccessControlManagement = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden min-h-[800px] border border-slate-200">
      <div className="bg-white p-8 border-b border-slate-200">
         <h2 className="text-2xl font-black text-[#091426] tracking-tight">User Roles & Permissions</h2>
         <p className="text-slate-500 text-sm font-medium mt-1">Manage user access and security roles within the platform.</p>
      </div>

      <div className="p-8 flex-1 flex flex-col overflow-hidden">
         <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                     type="text" 
                     placeholder="Search Users" 
                     className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
               </div>
               <div className="relative">
                  <select className="appearance-none px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#091426] outline-none shadow-sm pr-12 min-w-[160px]">
                     <option>Filter by Role</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
               </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
               <Plus size={18} /> Add User
            </button>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl flex-1 flex flex-col shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-50 z-10">
                     <tr className="text-[#091426] text-[11px] font-black uppercase tracking-widest border-b border-slate-200">
                        <th className="p-4 pl-8">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Last Active</th>
                        <th className="p-4 text-center">Admin</th>
                        <th className="p-4 text-center">Auditor</th>
                        <th className="p-4 text-center">Viewer</th>
                        <th className="p-4 pr-8 text-center">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {USERS.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="p-4 pl-8">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src={`https://i.pravatar.cc/100?u=${user.id}`} alt={user.name} />
                                 </div>
                                 <span className="text-sm font-bold text-[#091426]">{user.name}</span>
                              </div>
                           </td>
                           <td className="p-4 text-sm font-semibold text-slate-500">{user.email}</td>
                           <td className="p-4 text-sm font-bold text-[#091426]">{user.role}</td>
                           <td className="p-4 text-sm font-semibold text-slate-500">{user.active}</td>
                           <td className="p-4 text-center"><Toggle active={user.admin} onChange={() => {}} /></td>
                           <td className="p-4 text-center"><Toggle active={user.auditor} onChange={() => {}} /></td>
                           <td className="p-4 text-center"><Toggle active={user.viewer} onChange={() => {}} /></td>
                           <td className="p-4 pr-8 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={18} /></button>
                                 <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"><MoreHorizontal size={18} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-4 px-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <div className="flex gap-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Users: <span className="text-[#091426] ml-1">154</span></span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Sessions: <span className="text-emerald-600 ml-1">32</span></span>
               </div>
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Last Audit Log: <span className="text-[#091426] ml-1">Today, 10:45 AM</span></span>
            </div>
         </div>
      </div>
    </div>
  );
};
export default AccessControlManagement;
