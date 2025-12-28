
import React, { useState } from 'react';
import { X, Briefcase, Info, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { TIER_LIMITS } from '../../constants';
import { formatMoney } from '../../lib/utils';

interface NegotiationDrawerProps {
    onClose: () => void;
    onSubmit: (amount: number) => void;
    initialAmount: number;
    mode: 'new' | 'counter';
}

export const NegotiationDrawer: React.FC<NegotiationDrawerProps> = ({ onClose, onSubmit, initialAmount, mode }) => {
    const { user } = useUser();
    const [amount, setAmount] = useState(initialAmount);
    
    // Fee Logic (Simulated 10% commission for Pro, or Fixed fee)
    const SERVICE_FEE = 500;
    const netAmount = Math.max(0, amount - SERVICE_FEE);

    // --- HARD LIMIT LOGIC ---
    const userMaxBudget = TIER_LIMITS[user.tier].maxBudgetView;
    const isOverLimit = amount > userMaxBudget;

    const handleAmountChange = (delta: number) => {
        setAmount(prev => Math.max(0, prev + delta));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-t-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Briefcase className="text-jobgreen" size={28} /> 
                        {mode === 'counter' ? 'Contre-offre' : 'Négociation'}
                    </h2>
                    <button onClick={onClose} className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={24} /></button>
                </div>

                {/* Amount Display */}
                <div className="flex items-center justify-center mb-6 gap-4">
                    <button onClick={() => handleAmountChange(-500)} className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform shadow-sm"><span className="text-4xl font-bold mb-1">-</span></button>
                    
                    <div className={`flex-1 text-center py-4 rounded-3xl border-2 transition-colors ${isOverLimit ? 'bg-red-50 border-red-200 animate-tilt-shaking' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {mode === 'counter' ? 'Votre Prix' : 'Proposition'}
                        </div>
                        <div className={`text-3xl font-black tracking-tighter ${isOverLimit ? 'text-red-500' : 'text-gray-900'}`}>
                            {amount.toLocaleString()} <span className="text-base font-bold opacity-60">F</span>
                        </div>
                    </div>
                    
                    <button onClick={() => handleAmountChange(500)} className="w-16 h-16 rounded-3xl bg-jobgreen flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-green-200"><span className="text-4xl font-bold mb-1">+</span></button>
                </div>

                {/* --- FIREWALL ERROR MESSAGE --- */}
                {isOverLimit && (
                    <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in zoom-in-95">
                        <div className="bg-white p-2 rounded-full text-red-500 shadow-sm shrink-0">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-red-900 text-sm mb-1">Plafond de Compte Atteint</h3>
                            <p className="text-xs text-red-700 font-medium leading-relaxed">
                                Votre compte <span className="uppercase font-black">{user.tier}</span> limite les transactions à {formatMoney(userMaxBudget)} F.
                                <br/>Pour négocier au-delà, passez au niveau supérieur.
                            </p>
                        </div>
                    </div>
                )}

                {!isOverLimit && (
                    <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-500 font-medium">Prix proposé</span>
                            <span className="font-bold text-gray-900">{amount.toLocaleString()} F</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-500 font-medium flex items-center gap-1">
                                Frais Service <Info size={12} />
                            </span>
                            <span className="font-bold text-red-500">-{SERVICE_FEE} F</span>
                        </div>
                        <div className="h-px bg-blue-200 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-900 font-black uppercase text-xs tracking-wider">Net Vendeur</span>
                            <span className="font-black text-xl text-blue-700">{netAmount.toLocaleString()} FCFA</span>
                        </div>
                    </div>
                )}

                <Button 
                    className={`w-full h-16 text-xl rounded-2xl shadow-xl mb-2 ${isOverLimit ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-jobgreen hover:bg-green-700 shadow-green-900/10'}`} 
                    onClick={() => { if (!isOverLimit) onSubmit(amount); }}
                    disabled={isOverLimit}
                >
                    {isOverLimit ? 'Montant Bloqué' : (mode === 'counter' ? 'Envoyer contre-offre' : 'Envoyer l\'offre')}
                </Button>
            </div>
        </div>
    );
};
