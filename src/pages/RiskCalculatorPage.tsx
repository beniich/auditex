import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

export const RiskCalculatorPage = () => {
    const [size, setSize] = useState('500');
    const [industry, setIndustry] = useState('finance');
    const [status, setStatus] = useState('partial');

    // Simulate risk score based on inputs
    const baseScore = industry === 'finance' ? 40 : industry === 'health' ? 45 : 30;
    const sizeMultiplier = parseInt(size) > 1000 ? 1.5 : 1;
    const statusDeduction = status === 'full' ? 40 : status === 'partial' ? 10 : 0;
    
    const riskScore = Math.min(100, Math.max(0, Math.floor((baseScore * sizeMultiplier) - statusDeduction + 20)));
    const riskLevel = riskScore > 75 ? 'Critique' : riskScore > 50 ? 'Medium Risk' : 'Faible';
    const riskColor = riskScore > 75 ? 'text-red-500' : riskScore > 50 ? 'text-amber-500' : 'text-emerald-500';

    return (
        <div className="bg-[#f8fafc] text-[#091426] min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-600/20">
                        <Calculator size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Évaluez votre Risque de Conformité.</h1>
                    <p className="text-slate-500">Un diagnostic rapide algorithmique pour modéliser votre exposition règlementaire.</p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-400 mb-4">1. Taille de l'entreprise</h3>
                            <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold outline-none focus:border-blue-500 transition">
                                <option value="100">10-100 Employés</option>
                                <option value="500">100-500 Employés</option>
                                <option value="1000">500-1000 Employés</option>
                                <option value="5000">1000+ Employés</option>
                            </select>
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-400 mb-4">2. Industrie</h3>
                            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-bold outline-none focus:border-blue-500 transition">
                                <option value="finance">Finance / Fintech</option>
                                <option value="health">Santé / BioTech</option>
                                <option value="tech">SAAS / Tech</option>
                                <option value="retail">Retail / E-commerce</option>
                            </select>
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-400 mb-4">3. Posture Actuelle</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition border-transparent">
                                    <input type="radio" value="none" checked={status === 'none'} onChange={(e) => setStatus(e.target.value)} className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold">Aucune évaluation récente</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-blue-500 bg-blue-50/50 rounded-xl cursor-pointer transition">
                                    <input type="radio" value="partial" checked={status === 'partial'} onChange={(e) => setStatus(e.target.value)} className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold">Evaluations partielles manquantes</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition border-transparent">
                                    <input type="radio" value="full" checked={status === 'full'} onChange={(e) => setStatus(e.target.value)} className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold">Entièrement conforme</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="border-l border-slate-100 pl-0 md:pl-12 flex flex-col items-center justify-center text-center">
                       <div className="relative w-64 h-32 overflow-hidden mb-6">
                          <div className="absolute w-64 h-64 border-[30px] border-slate-100 rounded-full border-t-blue-500 border-r-emerald-500 transform rotate-45 transition-all duration-1000"></div>
                       </div>
                       <h2 className={`text-6xl font-black ${riskColor} mb-2`}>{riskScore}/100</h2>
                       <h3 className="text-xl font-black text-[#091426] uppercase tracking-tight mb-6">{riskLevel}</h3>
                       <p className="text-slate-500 text-sm mb-8">
                          Basé sur notre LLM Model. L'amende potentielle maximale GDPR est estimée à €20M ou 4% du C.A.
                       </p>

                       <button className="w-full flex items-center justify-center gap-2 bg-[#091426] text-white px-6 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition shadow-xl shadow-slate-200">
                           Get Remediation Plan <ArrowRight size={16} />
                       </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
