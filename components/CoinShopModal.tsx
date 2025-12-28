
import React, { useState, useEffect } from 'react';
import { X, Crown, Coins, Zap, Shield, TrendingUp, User, Sparkles, ArrowUp, Info, Check, X as XIcon, CreditCard, ArrowRightLeft, Smartphone, Loader2, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { COIN_VALUE_XAF, TIER_LIMITS, COIN_PACKS, COSTS } from '../constants';
import { getCurrencyBreakdown } from '../utils/currency';
import { useUser } from '../context/UserContext';
import { formatMoney, cn } from '../lib/utils';

interface CoinShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'shop' | 'premium' | 'exchange';
}

// Internal State for Checkout Flow
type CheckoutState = 'idle' | 'summary' | 'processing' | 'success' | 'error';

export const CoinShopModal: React.FC<CoinShopModalProps> = ({ isOpen, onClose, initialTab = 'shop' }) => {
    const { user, addCoins, spendCash, updateUser } = useUser();
    const [activeTab, setActiveTab] = useState(initialTab);
    
    // Checkout State
    const [checkoutState, setCheckoutState] = useState<CheckoutState>('idle');
    const [selectedItem, setSelectedItem] = useState<{ id: string, name: string, price: number, reward: number, type: 'pack' | 'sub' | 'exchange' } | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'airtel' | 'momo'>('wallet');

    // Exchange State
    const [exchangeAmount, setExchangeAmount] = useState(1000);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setCheckoutState('idle'); // Reset on open
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    // --- ACTIONS HANDLERS ---

    const initiatePurchase = (item: { id: string, name: string, price: number, reward: number, type: 'pack' | 'sub' | 'exchange' }) => {
        setSelectedItem(item);
        setCheckoutState('summary');
    };

    const confirmPayment = () => {
        if (!selectedItem) return;

        setCheckoutState('processing');

        setTimeout(() => {
            // LOGIC
            let success = false;

            if (selectedItem.type === 'exchange') {
                // Wallet to Coins
                if (spendCash(selectedItem.price, "Échange vers Crédits")) {
                    addCoins(selectedItem.reward, "Échange depuis Cash");
                    success = true;
                }
            } else {
                // Buying Pack or Sub (Assuming External Payment OR Wallet if enough funds)
                // For this demo, we simulate "External Payment" always succeeding, 
                // OR "Wallet Payment" checking funds.
                
                if (paymentMethod === 'wallet') {
                    if (spendCash(selectedItem.price, `Achat: ${selectedItem.name}`)) {
                        if (selectedItem.type === 'pack') addCoins(selectedItem.reward, `Achat: ${selectedItem.name}`);
                        if (selectedItem.type === 'sub') updateUser({ isPremium: true, tier: 'premium' });
                        success = true;
                    }
                } else {
                    // Airtel/MoMo Simulation (Always Success for Demo)
                    if (selectedItem.type === 'pack') addCoins(selectedItem.reward, `Achat via ${paymentMethod === 'airtel' ? 'Airtel' : 'MoMo'}`);
                    if (selectedItem.type === 'sub') updateUser({ isPremium: true, tier: 'premium' });
                    success = true;
                }
            }

            if (success) {
                setCheckoutState('success');
                setTimeout(() => {
                    setCheckoutState('idle');
                    setSelectedItem(null);
                    // Stay in modal, but show balance updated
                }, 2000);
            } else {
                setCheckoutState('error');
                setTimeout(() => setCheckoutState('summary'), 2000);
            }

        }, 2500); // 2.5s simulated delay
    };

    // --- RENDERERS ---

    const renderCheckoutOverlay = () => {
        if (checkoutState === 'idle' || !selectedItem) return null;

        return (
            <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
                    <button 
                        onClick={() => setCheckoutState('idle')} 
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-500"
                        disabled={checkoutState === 'processing' || checkoutState === 'success'}
                    >
                        <XIcon size={24} />
                    </button>
                    <h3 className="font-black text-lg text-gray-900">
                        {checkoutState === 'success' ? 'Reçu' : 'Caisse'}
                    </h3>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col justify-center items-center p-6">
                    {checkoutState === 'processing' && (
                        <div className="text-center animate-in fade-in">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-jobgreen border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Lock size={32} className="text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Sécurisation...</h3>
                            <p className="text-sm text-gray-500">Connexion à la passerelle de paiement.</p>
                        </div>
                    )}

                    {checkoutState === 'success' && (
                        <div className="text-center animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
                                <Check size={48} strokeWidth={4} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Paiement Réussi !</h3>
                            <p className="text-gray-500 font-medium mb-8">Votre compte a été crédité.</p>
                        </div>
                    )}

                    {checkoutState === 'error' && (
                        <div className="text-center animate-in shake">
                            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XIcon size={48} strokeWidth={4} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Échec</h3>
                            <p className="text-gray-500 font-medium">Solde insuffisant.</p>
                        </div>
                    )}

                    {checkoutState === 'summary' && (
                        <div className="w-full max-w-sm animate-in slide-in-from-bottom-4">
                            <div className="text-center mb-8">
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Vous achetez</div>
                                <div className="text-3xl font-black text-gray-900">{selectedItem.name}</div>
                                {selectedItem.type === 'pack' && <div className="text-jobgold font-black mt-1 flex items-center justify-center gap-1"><Coins size={16}/> {selectedItem.reward} Crédits</div>}
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <span className="text-gray-500 font-bold">Total à payer</span>
                                    <span className="text-xl font-black text-gray-900">{formatMoney(selectedItem.price)} F</span>
                                </div>
                                <div className="h-px bg-gray-200 mb-4"></div>
                                
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Moyen de paiement</label>
                                    
                                    {selectedItem.type !== 'exchange' && (
                                        <>
                                            <button 
                                                onClick={() => setPaymentMethod('airtel')}
                                                className={cn("w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all", paymentMethod === 'airtel' ? "border-red-500 bg-red-50" : "border-gray-200 bg-white")}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">AM</div>
                                                <span className="font-bold text-sm text-gray-800">Airtel Money</span>
                                            </button>
                                            <button 
                                                onClick={() => setPaymentMethod('momo')}
                                                className={cn("w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all", paymentMethod === 'momo' ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white")}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold text-[10px]">MTN</div>
                                                <span className="font-bold text-sm text-gray-800">MoMo Pay</span>
                                            </button>
                                        </>
                                    )}
                                    
                                    <button 
                                        onClick={() => setPaymentMethod('wallet')}
                                        className={cn("w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all", paymentMethod === 'wallet' ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white")}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"><Shield size={14} /></div>
                                        <div className="flex-1 text-left">
                                            <div className="font-bold text-sm text-gray-800">Solde Cash App</div>
                                            <div className="text-[10px] text-gray-500">Dispo: {formatMoney(user.wealth)} F</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <Button onClick={confirmPayment} className="w-full h-14 text-lg rounded-xl shadow-xl bg-gray-900 text-white">
                                Confirmer {formatMoney(selectedItem.price)} F
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            
            <div className="bg-[#F8F9FA] w-full max-w-md h-[95vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[40px] rounded-t-[40px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 flex flex-col shadow-2xl">
                
                {renderCheckoutOverlay()}

                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-2 bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {activeTab === 'shop' && 'Boutique'}
                            {activeTab === 'premium' && 'Premium'}
                            {activeTab === 'exchange' && 'Échange'}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">Gérez vos finances JobLibre</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 gap-2 mb-4 bg-white pb-4 border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('shop')}
                        className={`flex-1 py-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all border-2 ${activeTab === 'shop' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}
                    >
                        <Coins size={20} className={activeTab === 'shop' ? 'fill-orange-500 text-orange-600' : ''} />
                        Crédits
                    </button>
                    <button 
                        onClick={() => setActiveTab('premium')}
                        className={`flex-1 py-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all border-2 ${activeTab === 'premium' ? 'bg-gray-900 border-gray-700 text-jobgold' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}
                    >
                        <Crown size={20} className={activeTab === 'premium' ? 'fill-jobgold text-jobgold animate-pulse-glow' : ''} />
                        Abo Pro
                    </button>
                    <button 
                        onClick={() => setActiveTab('exchange')}
                        className={`flex-1 py-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 transition-all border-2 ${activeTab === 'exchange' ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}
                    >
                        <ArrowRightLeft size={20} className={activeTab === 'exchange' ? 'text-blue-600' : ''} />
                        Échange
                    </button>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-safe relative">
                    
                    {/* --- SHOP TAB (PACKS) --- */}
                    {activeTab === 'shop' && (
                        <div className="p-6 pt-2 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            {/* Balance Header */}
                            <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <div>
                                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Votre Solde</div>
                                    <div className="text-3xl font-black text-orange-600 flex items-center gap-2">
                                        {user.bronzeCoins} <span className="text-sm text-gray-500 font-bold">Crédits</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                    <Zap size={24} className="fill-current" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider ml-1 flex items-center gap-2">
                                    Packs Disponibles <CreditCard size={14} />
                                </h3>
                                
                                {COIN_PACKS.map(pack => (
                                    <button 
                                        key={pack.id}
                                        onClick={() => initiatePurchase({ 
                                            id: pack.id, 
                                            name: pack.name, 
                                            price: pack.priceXaf, 
                                            reward: pack.coins + (pack.bonus || 0), 
                                            type: 'pack' 
                                        })}
                                        className="w-full flex items-center p-1 bg-white border-2 border-gray-100 rounded-3xl relative overflow-hidden group active:scale-95 shadow-sm hover:border-orange-200 transition-all text-left"
                                    >
                                        {pack.tag && (
                                            <div className={`absolute top-0 right-0 text-[9px] font-black px-3 py-1 rounded-bl-xl z-10 ${pack.tag === 'Populaire' ? 'bg-orange-500 text-white' : pack.tag === 'Best Value' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                {pack.tag}
                                            </div>
                                        )}
                                        <div className="p-4 w-full flex items-center">
                                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform border border-orange-100">
                                                <span className="text-xl font-black">{pack.coins}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-900">{pack.name}</div>
                                                {pack.bonus ? (
                                                    <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                        <TrendingUp size={10} /> +{pack.bonus} Offerts
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-400">Pack standard</div>
                                                )}
                                            </div>
                                            <div className="font-black text-lg text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                                                {formatMoney(pack.priceXaf)} F
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- PREMIUM TAB --- */}
                    {activeTab === 'premium' && (
                        <div className="pb-6 animate-in slide-in-from-right-4 fade-in duration-300">
                             {/* Hero */}
                             <div className="bg-[#111827] text-white pt-8 pb-12 px-6 rounded-b-[40px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-jobgold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 text-center">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-jobgold to-yellow-600 rounded-3xl flex items-center justify-center shadow-gold-glow mb-4 rotate-3">
                                        <Crown size={32} className="text-white fill-white" />
                                    </div>
                                    <h2 className="text-3xl font-black mb-2">Club Pro</h2>
                                    <p className="text-gray-400 text-sm font-medium max-w-xs mx-auto">Devenez un prestataire d'élite.</p>
                                </div>
                             </div>

                             {/* COMPARISON MATRIX */}
                             <div className="px-4 -mt-6 relative z-20">
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 text-center py-3">
                                        <div className="text-xs font-bold text-gray-400 uppercase pt-2">Avantage</div>
                                        <div className="text-xs font-black text-gray-500 uppercase pt-2">Gratuit</div>
                                        <div className="text-xs font-black text-jobgold uppercase pt-2 bg-yellow-50 rounded-t-lg mx-1">Premium</div>
                                    </div>

                                    {[
                                        { label: 'Candidatures', std: '3 / mois', prem: 'Illimitées', highlight: true },
                                        { label: 'Budget Max', std: formatMoney(TIER_LIMITS.standard.maxBudgetView), prem: 'Illimité', highlight: false },
                                        { label: 'Négociation', std: <XIcon size={16} className="mx-auto text-gray-300" />, prem: <Check size={16} className="mx-auto text-green-600" />, highlight: false },
                                        { label: 'Voir Prix', std: <XIcon size={16} className="mx-auto text-gray-300" />, prem: <Check size={16} className="mx-auto text-green-600" />, highlight: true },
                                        { label: 'Badge Pro', std: <XIcon size={16} className="mx-auto text-gray-300" />, prem: <Crown size={14} className="mx-auto text-jobgold fill-current" />, highlight: false },
                                    ].map((row, i) => (
                                        <div key={i} className="grid grid-cols-3 text-center py-3 border-b border-gray-50 last:border-0 items-center">
                                            <div className="text-xs font-bold text-gray-600 text-left pl-4">{row.label}</div>
                                            <div className="text-xs font-medium text-gray-500">{row.std}</div>
                                            <div className={`text-xs font-bold ${row.highlight ? 'text-jobgold' : 'text-gray-900'} bg-yellow-50/50 h-full flex items-center justify-center mx-1 rounded`}>{row.prem}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-900 rounded-3xl p-6 mt-6 text-center text-white relative overflow-hidden shadow-2xl">
                                    <div className="text-sm font-bold text-gray-400 uppercase mb-2">Abonnement Mensuel</div>
                                    <div className="text-4xl font-black text-white mb-4">{formatMoney(COSTS.VERIFIED_MONTHLY)} <span className="text-lg text-gray-500">F</span></div>
                                    
                                    {user.isPremium ? (
                                        <Button disabled className="w-full bg-green-600 text-white h-14 text-base opacity-100">
                                            <Check size={20} className="mr-2" /> Abonnement Actif
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={() => initiatePurchase({ id: 'sub_pro', name: 'Abonnement Club Pro', price: COSTS.VERIFIED_MONTHLY, reward: 0, type: 'sub' })}
                                            className="w-full bg-jobgold hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 h-14 text-base animate-pulse-glow"
                                        >
                                            Activer Maintenant
                                        </Button>
                                    )}
                                </div>
                             </div>
                        </div>
                    )}

                    {/* --- EXCHANGE TAB --- */}
                    {activeTab === 'exchange' && (
                        <div className="p-6 pt-10 h-full flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100">
                                    <ArrowRightLeft size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Cash vers Crédits</h3>
                                <p className="text-sm text-gray-500 font-medium px-4">
                                    Convertissez votre solde de mission en crédits de visibilité.
                                </p>
                            </div>

                            <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase">
                                    <span>Je convertis (FCFA)</span>
                                    <span>Solde: {formatMoney(user.wealth)} F</span>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <input 
                                        type="number" 
                                        value={exchangeAmount}
                                        onChange={(e) => setExchangeAmount(Number(e.target.value))}
                                        className="flex-1 text-3xl font-black text-gray-900 bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent focus:border-blue-500 outline-none"
                                        min={250}
                                        step={250}
                                    />
                                    <div className="text-xl font-bold text-gray-400">F</div>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <ArrowUp size={24} className="text-gray-300" />
                                </div>

                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase">
                                    <span>Je reçois (Crédits)</span>
                                </div>
                                <div className="bg-orange-50 border-2 border-orange-100 rounded-xl px-4 py-4 flex items-center justify-between">
                                    <span className="text-3xl font-black text-orange-600">{Math.floor(exchangeAmount / COIN_VALUE_XAF)}</span>
                                    <span className="font-bold text-orange-800 flex items-center gap-1"><Coins size={16}/> Crédits</span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <Button 
                                    onClick={() => initiatePurchase({ 
                                        id: 'exchange', 
                                        name: 'Conversion Crédits', 
                                        price: exchangeAmount, 
                                        reward: Math.floor(exchangeAmount / COIN_VALUE_XAF), 
                                        type: 'exchange' 
                                    })}
                                    disabled={exchangeAmount > user.wealth || exchangeAmount < 250}
                                    className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                >
                                    Valider l'échange
                                </Button>
                                {exchangeAmount > user.wealth && (
                                    <p className="text-center text-xs font-bold text-red-500 mt-3">Solde insuffisant</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
