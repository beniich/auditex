import React from 'react';
import { Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChaosLabPublic = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-black text-emerald-500 font-mono min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="text-center">
                  <Terminal size={48} className="mx-auto mb-6" />
                  <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-4">
                     Chaos Lab.
                  </h1>
                  <p className="text-emerald-500/60 uppercase tracking-widest text-sm">
                     Environment Red-Team / Test d'intrusion Ledger.
                  </p>
               </div>

               <div className="border border-emerald-500/30 bg-emerald-500/5 p-8 rounded-xl opacity-80 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <p className="mb-4">{`> INITIALIZING SECURE SHELL... [OK]`}</p>
                  <p className="mb-4">{`> CONNECTING TO CHAOS ENVIRONMENT... [OK]`}</p>
                  <p className="mb-4">{`> LOADING AUDITAX LEDGER FOR STRESS TEST...`}</p>
                  <p className="text-emerald-300 font-bold mb-8">{`> READY FOR PROMPT INJECTION.`}</p>
                  <p className="mb-6 leading-relaxed">Le Chaos Lab est un environnement ouvert aux chercheurs en sécurité pour tenter de compromettre la validité de l'Agentic Audit RAG. Toute vulnérabilité majeure sera récompensée par notre programme Bug Bounty (jusqu'à 50,000$).</p>
                  
                  <div className="flex justify-center mt-12">
                     <button onClick={() => navigate('/webinar')} className="px-8 py-4 border border-emerald-500 hover:bg-emerald-500 hover:text-black font-black uppercase tracking-widest text-xs transition transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        Join Next Webinar
                     </button>
                  </div>
               </div>
            </div>
        </div>
    );
};
