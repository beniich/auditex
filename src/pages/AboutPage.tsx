import React from 'react';
import { Target, Heart, Award } from 'lucide-react';

export const AboutPage = () => {
    return (
        <div className="bg-[#f0fdf4] text-slate-900 min-h-screen">
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-[#091426]">
                    About <span className="text-emerald-600">AuditAX</span> Company.
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium mb-12">
                    Pioneering the future of automated, zero-hallucination compliance.
                </p>
            </section>

            {/* Timeline Zigzag */}
            <section className="py-20 px-6 max-w-5xl mx-auto relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-emerald-500/20 transform -translate-x-1/2 hidden md:block"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between mb-24 relative">
                    <div className="md:w-5/12 ml-auto text-left relative z-10 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
                        <div className="absolute top-1/2 -left-12 w-8 h-8 rounded-full bg-emerald-500 border-4 border-[#f0fdf4] transform -translate-y-1/2 hidden md:block"></div>
                        <h3 className="text-emerald-600 font-black text-xl mb-2">2018</h3>
                        <h4 className="text-2xl font-bold mb-4 text-[#091426]">Foundation & First Ledger</h4>
                        <p className="text-slate-500">Naissance de la vision d'une piste d'audit totalement inaltérable. Le premier protoype cryptographique est né.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mb-24 relative">
                    <div className="md:w-5/12 mr-auto text-right relative z-10 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
                        <div className="absolute top-1/2 -right-12 w-8 h-8 rounded-full bg-emerald-500 border-4 border-[#f0fdf4] transform -translate-y-1/2 hidden md:block"></div>
                        <h3 className="text-emerald-600 font-black text-xl mb-2">2020</h3>
                        <h4 className="text-2xl font-bold mb-4 text-[#091426]">AI-Driven Risk Engine Launch</h4>
                        <p className="text-slate-500">L'introduction du modèle IA pour prédire les risques avant même que les audits manuels ne commencent.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between relative">
                    <div className="md:w-5/12 ml-auto text-left relative z-10 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
                        <div className="absolute top-1/2 -left-12 w-8 h-8 rounded-full bg-emerald-500 border-4 border-[#f0fdf4] transform -translate-y-1/2 hidden md:block"></div>
                        <h3 className="text-emerald-600 font-black text-xl mb-2">2022 - Présent</h3>
                        <h4 className="text-2xl font-bold mb-4 text-[#091426]">SHA-256 & Global Expansion</h4>
                        <p className="text-slate-500">AuditAX devient le standard pour les infrastructures militaires et financières, adoptant l'architecture "Zero-Hallucination".</p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#091426] text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black mb-16">Nos Valeurs Core</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-white/10 pt-16 mt-8">
                        <div>
                            <Target className="mx-auto text-emerald-400 mb-6" size={48} />
                            <h3 className="text-2xl font-bold mb-4">Precision (Zero-Hallucination)</h3>
                            <p className="text-slate-400">Aucune donnée inventée, uniquement des faits infrastructurels prouvés.</p>
                        </div>
                        <div>
                            <Heart className="mx-auto text-red-400 mb-6" size={48} />
                            <h3 className="text-2xl font-bold mb-4">Souveraineté Intègre</h3>
                            <p className="text-slate-400">Vos données vous appartiennent. Le SHA-256 garantit qu'elles ne sont jamais altérées.</p>
                        </div>
                        <div>
                            <Award className="mx-auto text-blue-400 mb-6" size={48} />
                            <h3 className="text-2xl font-bold mb-4">Excellence Technique</h3>
                            <p className="text-slate-400">Un code robuste, typé et pensé pour des charges critiques (Fortune 500).</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
