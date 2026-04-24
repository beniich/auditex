import React from 'react';
import { Server, Lock, Globe, Shield, Cpu, Zap, Key } from 'lucide-react';

export const FeaturesPage = () => {
    return (
        <div className="bg-[#0a0e1a] text-white min-h-screen">
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center border-b border-white/10">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AuditAX</span> Platform Features
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                    Une architecture monolithique conçue pour encaisser l'échelle des entreprises Fortune 500, tout en garantissant zero trust et secrèt absolu.
                </p>
            </section>

            {/* Section A */}
            <section id="agentic" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
                <div className="mb-16">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">A. Intelligence Agentique & RAG</h2>
                    <p className="text-slate-400">Le cerveau de la plateforme. Analyse des milliers de logs par seconde.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-indigo-500/50 transition duration-300">
                        <Cpu className="text-indigo-400 mb-6" size={40} />
                        <h3 className="text-2xl font-bold mb-4">Agentic AI Core</h3>
                        <p className="text-slate-400">Des agents autonomes surveillent des sous-ensembles spécifiques de l'infrastructure (IAM, Réseau, DB). Ils déclenchent des audits ciblés à chaque changement d'état (Event-driven validation).</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-indigo-500/50 transition duration-300">
                        <Zap className="text-indigo-400 mb-6" size={40} />
                        <h3 className="text-2xl font-bold mb-4">RAG Validation Engine</h3>
                        <p className="text-slate-400">Plutôt que des requêtes LLM génériques, chaque question de conformité est validée contre un RAG (Retrieval-Augmented Generation) strictement limité à vos documents internes et logs serveurs.</p>
                    </div>
                </div>
            </section>

            {/* Section B */}
            <section id="security" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">B. Enterprise-Grade Security</h2>
                    <p className="text-slate-400">La sécurité par design n'est pas une option.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#111827] border border-blue-500/20 p-6 rounded-3xl">
                        <Lock className="text-emerald-400 mb-4" size={32} />
                        <h4 className="text-lg font-bold mb-2">AES-256 Ledger</h4>
                        <p className="text-sm text-slate-400">Aucune donnée n'est altérable. Tout est chiffré at rest et in transit.</p>
                    </div>
                    <div className="bg-[#111827] border border-blue-500/20 p-6 rounded-3xl">
                        <Shield className="text-emerald-400 mb-4" size={32} />
                        <h4 className="text-lg font-bold mb-2">SOC2 & ISO 27001</h4>
                        <p className="text-sm text-slate-400">Built-in mapping pour les plus hauts standards internationaux.</p>
                    </div>
                    <div className="bg-[#111827] border border-blue-500/20 p-6 rounded-3xl">
                        <Key className="text-emerald-400 mb-4" size={32} />
                        <h4 className="text-lg font-bold mb-2">Granular RBAC</h4>
                        <p className="text-sm text-slate-400">Modèle de permissions poussé pour différencier Partenaires, Auditeurs et Viewers.</p>
                    </div>
                    <div className="bg-[#111827] border border-blue-500/20 p-6 rounded-3xl">
                        <Globe className="text-emerald-400 mb-4" size={32} />
                        <h4 className="text-lg font-bold mb-2">Data Residency</h4>
                        <p className="text-sm text-slate-400">Choix de la région de stockage (EU, US) pour stricte conformité RGPD.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
