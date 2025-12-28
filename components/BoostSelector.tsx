
import React, { useMemo, useState, useEffect } from 'react';
import { Check, Coins, TrendingUp, Zap, Eye, LayoutTemplate, ShieldCheck, ShoppingBag, Clock } from 'lucide-react';
import { BOOST_OPTIONS, COIN_VALUE_XAF } from '../constants';
import { useUser } from '../context/UserContext';
import { Button } from './ui/Button';
import { CoinShopModal } from './CoinShopModal';
import { cn, formatMoney } from '../lib/utils';

interface BoostSelectorProps {
    selectedBoostId: string | 'none';
    onSelect: (boostId: 'none' | 'basic' | 'urgent') => void;
    userCoins: number;
    duration: number;
    onDurationChange: (d: number) => void;
}

// --- MOVED OUTSIDE ---
const GlassShine = () => (
    <div className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" />
);

export const BoostSelector: React.FC<BoostSelectorProps> = ({ selectedBoostId, onSelect, userCoins, duration, onDurationChange }) => {
    
    // Helper to render the Preview Card
    const renderPreview = () => {
        let borderColor = "border-gray-200";
        let bg = "bg-white";
        let badge = null;

        if (selectedBoostId === 'basic') {
            borderColor = "border-orange-300";
            bg = "bg-gradient-to-br from-white via-orange-50/10 to-white";
            badge = (
                <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-yellow-200">
                    <GlassShine />
                    <TrendingUp size={10} strokeWidth={3} className="text-white relative z-10" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 whitespace-nowrap relative z-10">
                        SPONSORISÉ
                    </span>
                </div>
            );
        } else if (selectedBoostId === 'urgent') {
            borderColor = "border-red-500/30";
            bg = "bg-red-50/5";
            badge = (
                <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-red-200">
                    <GlassShine />
                    <div className="animate-wiggle-violent relative z-10"><Zap size={10} fill="white" /></div>
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 relative z-10">URGENT</span>
                </div>
            );
        }

        return (
            <div className="mt-6 mb-8 relative">
                <div className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                    <Eye size={12} /> Ce que voient les autres
                </div>
                
                {/* MOCK CARD (Reusing JobCard Styles) */}
                <div className={cn("relative rounded-[28px] p-5 border-2 transition-all duration-300 mx-auto max-w-[280px] shadow-sm", borderColor, bg)}>
                    
                    {/* Badge Positioned exactly like JobCard */}
                    {badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                            {badge}
                        </div>
                    )}

                    <div className="flex gap-3 mb-3 relative z-10 mt-2">
                        <div className="w-11 h-11 rounded-[18px] bg-gray-200 shrink-0 border-2 border-white shadow-sm"></div>
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-2.5 w-2/3 bg-gray-800 rounded-full opacity-80"></div>
                            <div className="h-2 w-1/2 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex gap-2 mb-2 relative z-10">
                        <div className="h-5 w-16 bg-gray-100 rounded-lg border border-gray-200"></div>
                        <div className="h-5 w-24 bg-gray-100 rounded-lg border border-gray-200"></div>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 border-dashed relative z-10">
                        <div className="h-2 w-12 bg-gray-300 rounded-full"></div>
                        <div className={cn("h-8 w-20 rounded-xl", selectedBoostId === 'none' ? "bg-gray-100" : selectedBoostId === 'urgent' ? "bg-red-500 shadow-red-200 shadow-md" : "bg-blue-600 shadow-blue-200 shadow-md")}></div>
                    </div>
                </div>
                
                {selectedBoostId !== 'none' && (
                    <div className="text-center mt-3 text-xs text-gray-500 font-medium animate-in fade-in">
                        {selectedBoostId === 'basic' ? "Votre annonce remonte en tête de liste." : "Notification envoyée à 50+ Pros autour de vous."}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* 1. SELECTION */}
            <div className="grid grid-cols-3 gap-2">
                <div 
                    onClick={() => onSelect('none')}
                    className={cn(
                        "rounded-2xl p-3 border-2 cursor-pointer transition-all active:scale-95 flex flex-col items-center justify-center gap-2 h-28",
                        selectedBoostId === 'none' ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900" : "border-gray-100 bg-white hover:border-gray-200"
                    )}
                >
                    <LayoutTemplate size={24} className={selectedBoostId === 'none' ? "text-gray-900" : "text-gray-300"} />
                    <div className="text-center">
                        <div className={cn("text-xs font-bold", selectedBoostId === 'none' ? "text-gray-900" : "text-gray-500")}>Gratuit</div>
                        <div className="text-[10px] text-gray-400">Standard</div>
                    </div>
                </div>

                {BOOST_OPTIONS.map((option) => {
                    const isSelected = selectedBoostId === option.id;
                    const canAfford = userCoins >= option.cost;
                    const colorClass = option.id === 'urgent' ? 'red' : 'orange';
                    const Icon = option.id === 'urgent' ? Zap : TrendingUp;

                    return (
                        <div 
                            key={option.id}
                            onClick={() => onSelect(option.id as any)}
                            className={cn(
                                "rounded-2xl p-3 border-2 cursor-pointer transition-all active:scale-95 flex flex-col items-center justify-center gap-2 h-28 relative overflow-hidden",
                                isSelected 
                                    ? `border-${colorClass}-500 bg-${colorClass}-50 ring-1 ring-${colorClass}-500` 
                                    : "border-gray-100 bg-white hover:border-gray-200"
                            )}
                        >
                            <div className={cn("p-2 rounded-full", isSelected ? `bg-${colorClass}-100 text-${colorClass}-600` : "bg-gray-50 text-gray-300")}>
                                <Icon size={20} className={option.id === 'urgent' && isSelected ? 'fill-current' : ''} />
                            </div>
                            <div className="text-center z-10">
                                <div className={cn("text-xs font-bold", isSelected ? `text-${colorClass}-900` : "text-gray-500")}>
                                    {option.label.split(' ')[1] || option.label}
                                </div>
                                <div className={cn("text-[10px] font-black mt-0.5", canAfford ? `text-${colorClass}-600` : "text-gray-400")}>
                                    {option.cost} P / jour
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. DURATION SELECTOR (Only if boosted) */}
            {selectedBoostId !== 'none' && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <Clock size={12} /> Durée de la campagne
                        </label>
                        <span className="text-xs font-black text-gray-900">{duration} Jours</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 3, 7].map(d => (
                            <button
                                key={d}
                                onClick={() => onDurationChange(d)}
                                className={cn(
                                    "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                                    duration === d 
                                        ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {d} Jour{d > 1 ? 's' : ''}
                            </button>
                        ))}
                    </div>
                    
                    {/* REAL MONEY INDICATOR */}
                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Coût estimé en FCFA</span>
                        <div className="text-right">
                            <div className="font-black text-gray-900">
                                {formatMoney(
                                    (BOOST_OPTIONS.find(o => o.id === selectedBoostId)?.cost || 0) * duration * COIN_VALUE_XAF
                                )} <span className="text-[10px] text-gray-500">FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. PREVIEW */}
            {renderPreview()}
        </div>
    );
};

// --- VALIDATION MODAL REFACTORED FOR SMOOTH CLOSING ---
export const BoostValidationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    boostId: 'basic' | 'urgent';
    duration: number;
    onConfirm: () => void;
}> = ({ isOpen, onClose, boostId, duration, onConfirm }) => {
    const { user, spendCoins } = useUser();
    const [showShop, setShowShop] = useState(false);
    const [step, setStep] = useState<'summary' | 'processing' | 'success'>('summary');
    
    // Reset state on open
    useEffect(() => {
        if(isOpen) setStep('summary');
    }, [isOpen]);

    if (!isOpen) return null;

    const option = BOOST_OPTIONS.find(o => o.id === boostId);
    if (!option) return null;

    const totalCost = option.cost * duration;
    const realMoneyCost = totalCost * COIN_VALUE_XAF;
    const canAfford = user.bronzeCoins >= totalCost;

    const handlePay = async () => {
        setStep('processing');
        
        // Simulate network call
        setTimeout(() => {
            const success = spendCoins(totalCost, `Boost: ${option.label} (${duration}j)`);
            if (success) {
                setStep('success');
                // AUTO CLOSE after short success animation
                setTimeout(() => {
                    onConfirm(); // This should trigger the parent to close ALL modals and show summary
                }, 800);
            } else {
                setStep('summary');
                alert("Erreur de solde.");
            }
        }, 1500);
    };

    return (
        <>
            <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
                <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe overflow-hidden">
                    
                    {/* STEP 1: SUMMARY */}
                    {step === 'summary' && (
                        <>
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                            <div className="text-center mb-6">
                                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in", boostId === 'urgent' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600")}>
                                    {boostId === 'urgent' ? <Zap size={32} className="fill-current"/> : <TrendingUp size={32} />}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-1">Confirmer le Boost</h3>
                                <p className="text-sm text-gray-500 font-medium">{option.label} • {duration} Jour{duration > 1 ? 's' : ''}</p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                                <div className="flex justify-between items-center mb-3 text-sm">
                                    <span className="text-gray-500 font-medium">Prix (Crédits)</span>
                                    <span className="font-bold text-gray-900">{totalCost} P</span>
                                </div>
                                <div className="flex justify-between items-center mb-3 text-sm">
                                    <span className="text-gray-500 font-medium">Valeur Réelle</span>
                                    <span className="font-bold text-gray-600">{formatMoney(realMoneyCost)} FCFA</span>
                                </div>
                                <div className="h-px bg-gray-200 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-gray-900 uppercase text-xs tracking-wider">Votre Solde</span>
                                    <span className={cn("font-black text-xl", canAfford ? "text-green-600" : "text-red-500")}>
                                        {user.bronzeCoins} P
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {canAfford ? (
                                    <Button onClick={handlePay} className="w-full h-14 text-lg rounded-xl bg-gray-900 text-white shadow-xl hover:bg-black transition-all active:scale-95">
                                        Payer {totalCost} P
                                    </Button>
                                ) : (
                                    <Button onClick={() => setShowShop(true)} className="w-full h-14 text-lg rounded-xl bg-orange-600 text-white shadow-xl hover:bg-orange-700">
                                        <ShoppingBag size={20} className="mr-2" /> Recharger Crédits
                                    </Button>
                                )}
                                <button onClick={onClose} className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-600">
                                    Annuler
                                </button>
                            </div>
                        </>
                    )}

                    {/* STEP 2: PROCESSING */}
                    {step === 'processing' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in">
                            <div className="relative w-20 h-20 mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-jobgreen border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck size={32} className="text-jobgreen" />
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Paiement en cours...</h3>
                            <p className="text-xs text-gray-500 font-medium">Activation de votre campagne de {duration} jours.</p>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS (Briefly shown before close) */}
                    {step === 'success' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
                                <Check size={40} strokeWidth={4} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Validé !</h3>
                        </div>
                    )}

                </div>
            </div>
            
            <CoinShopModal isOpen={showShop} onClose={() => setShowShop(false)} initialTab="shop" />
        </>
    );
};
