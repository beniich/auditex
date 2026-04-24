import React from 'react';
import { Search, Bell, AlertTriangle, Users, Lock } from 'lucide-react';
import { ProgressRing } from '../components/journey/ProgressRing'; 
import { Protect } from '@clerk/clerk-react';

export const PartnerPortalPage = () => {
    return (
        <Protect 
            role="org:partner" 
            fallback={(
                <div className="bg-[#050505] min-h-screen pt-32 flex flex-col items-center text-center px-6">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">Accès Restreint</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Ce portail est exclusif aux partenaires certifiés AuditAX dotés du rôle <code>org:partner</code>. Veuillez vous connecter avec un compte partenaire validé pour visualiser vos clients.</p>
                </div>
            )}
        >
        <div className="bg-slate-50 min-h-screen pt-4 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                    <h1 className="text-2xl font-black text-[#091426] tracking-tight">Portail Partenaires</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Rechercher client..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm outline-none w-64 focus:border-blue-500 transition"/>
                        </div>
                        <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-500 transition">
                            <Bell size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                        <ProgressRing progress={87} size={140} label="Average Score" />
                        <p className="text-sm font-semibold text-emerald-600 mt-4">+2% depuis le mois dernier</p>
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Users size={20}/></div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Clients Actifs</h3>
                            </div>
                            <h2 className="text-4xl font-black text-[#091426]">56</h2>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-50 rounded-lg text-red-500"><AlertTriangle size={20}/></div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Risque Élevé</h3>
                            </div>
                            <h2 className="text-4xl font-black text-red-500">4</h2>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-500"><AlertTriangle size={20}/></div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Risque Moyen</h3>
                            </div>
                            <h2 className="text-4xl font-black text-amber-500">12</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-[#091426]">Derniers Audits Clients</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition">
                            Générer Global Report
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Nom du Client</th>
                                    <th className="px-8 py-4">Contact</th>
                                    <th className="px-8 py-4">Dernier Audit</th>
                                    <th className="px-8 py-4">Status ISO 27001</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-8 py-4 font-bold text-[#091426]">GlobalBank Inc.</td>
                                    <td className="px-8 py-4 text-slate-500">sarah.j@globalbank.ex</td>
                                    <td className="px-8 py-4 text-slate-500">Il y a 2 jours</td>
                                    <td className="px-8 py-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full font-bold text-xs">Compliant</span></td>
                                    <td className="px-8 py-4 text-right"><button className="text-blue-500 font-bold hover:underline">Voir le dossier</button></td>
                                </tr>
                                <tr className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-8 py-4 font-bold text-[#091426]">HealthCare Plus</td>
                                    <td className="px-8 py-4 text-slate-500">admin@hcplus.org</td>
                                    <td className="px-8 py-4 text-slate-500">Il y a 5 jours</td>
                                    <td className="px-8 py-4"><span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-bold text-xs">Critical Gap</span></td>
                                    <td className="px-8 py-4 text-right"><button className="text-blue-500 font-bold hover:underline">Voir le dossier</button></td>
                                </tr>
                                <tr className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-8 py-4 font-bold text-[#091426]">Nexus Tech</td>
                                    <td className="px-8 py-4 text-slate-500">cto@nexustech.io</td>
                                    <td className="px-8 py-4 text-slate-500">Aujourd'hui</td>
                                    <td className="px-8 py-4"><span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full font-bold text-xs">Review Pending</span></td>
                                    <td className="px-8 py-4 text-right"><button className="text-blue-500 font-bold hover:underline">Voir le dossier</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </Protect>
    );
};
