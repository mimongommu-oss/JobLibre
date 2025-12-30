
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Settings, ShieldCheck, MapPin, Award, Wallet, CreditCard, ChevronDown, ChevronUp, Crown, History, ArrowUpRight, ArrowDownLeft, Lock, Plus, Gift, Coins, EyeOff, LogOut, Bell, User as UserIcon, HelpCircle, Info, Edit3, Camera, Share2, Check, X, Tag, Sparkles, Star, Heart, TrendingUp, Calendar, Briefcase, PieChart, BarChart2, Trophy, Activity, MessageSquare, MousePointer2, Eye, Zap, FileText, FileSignature, AlertTriangle, Scale, Fingerprint, FileCheck, CheckCircle2 } from 'lucide-react';
import { AppTab, Job, User, Transaction } from '../types';
import { useUser } from '../context/UserContext';
import { cn, formatMoney } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { CoinShopModal } from '../components/CoinShopModal';
import { PinModal } from '../components/PinModal';
import { VerificationModal } from '../components/VerificationModal';
import { LocationSelectorModal } from '../components/LocationSelectorModal';
import { ReviewsModal } from '../components/ReviewsModal';
import { ReputationGauge } from '../components/ReputationGauge';
import { HALL_OF_FAME_DATA } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, sub, isPremium }: { label: string, value: string | number, icon: any, color: string, sub: string, isPremium?: boolean }) => (
    <div className={cn("bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center h-28 relative overflow-hidden group hover:border-gray-200 transition-all", isPremium ? "bg-gradient-to-br from-yellow-50 to-white border-yellow-200" : "")}>
        <div className={`p-2 rounded-full mb-1 ${isPremium ? 'bg-yellow-100 text-yellow-700' : `bg-${color}-50 text-${color}-600`}`}>
            <Icon size={18} />
        </div>
        <div className="text-xl font-black text-gray-900 tracking-tight">
            {value}
        </div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</div>
        {isPremium && <div className="absolute top-1 right-1 text-yellow-500"><Crown size={10} fill="currentColor"/></div>}
    </div>
);

const BronzeWallet = ({ coins, onOpenShop, onGift, onInfo }: { coins: number, onOpenShop: (t: 'shop') => void, onGift: () => void, onInfo: () => void }) => (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-5 text-white shadow-xl shadow-gray-200 mb-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 cursor-pointer" onClick={onInfo}>
                    Portefeuille Bronze <Info size={10} />
                </div>
                <div className="text-3xl font-black flex items-center gap-2">
                    {coins} <span className="text-sm font-medium opacity-60">Crédits</span>
                </div>
            </div>
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <Coins size={20} className="text-jobgold" />
            </div>
        </div>
        <div className="flex gap-2 mt-4 relative z-10">
            <button onClick={() => onOpenShop('shop')} className="flex-1 bg-white text-gray-900 py-2.5 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                <Plus size={14} /> Recharger
            </button>
            <button onClick={onGift} className="flex-1 bg-white/10 text-white py-2.5 rounded-xl text-xs font-bold border border-white/10 active:scale-95 transition-transform hover:bg-white/20 flex items-center justify-center gap-1.5">
                <Gift size={14} /> Offrir
            </button>
        </div>
    </div>
);

const CashWallet = ({ wealth, isUnlocked, transactions, onToggle, onLock, onInfo }: { wealth: number, isUnlocked: boolean, transactions: Transaction[], onToggle: () => void, onLock: (e: any) => void, onInfo: () => void }) => (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start mb-2">
            <div>
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 cursor-pointer" onClick={onInfo}>
                    Revenus Réels (FCFA) <Info size={10} />
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={onToggle}>
                    {isUnlocked ? (
                        <div className="text-3xl font-black text-gray-900 tracking-tight">{formatMoney(wealth)} F</div>
                    ) : (
                        <div className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <span className="blur-md select-none">150 000</span> <span className="text-lg text-gray-400">F</span>
                        </div>
                    )}
                    {isUnlocked ? (
                        <EyeOff size={16} className="text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); onLock(e); }} />
                    ) : (
                        <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                    )}
                </div>
            </div>
            <div className="bg-green-50 p-2 rounded-xl text-green-600">
                <Wallet size={20} />
            </div>
        </div>
        
        {/* Mini Graph Placeholder or Recent Transaction */}
        <div className="mt-4 pt-4 border-t border-gray-100">
            {transactions.length > 0 ? (
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", transactions[0].type === 'credit' ? "bg-green-500" : "bg-red-500")}></div>
                        <span className="text-gray-600 font-medium truncate max-w-[150px]">{transactions[0].description}</span>
                    </div>
                    <span className={cn("font-bold", transactions[0].type === 'credit' ? "text-green-600" : "text-gray-900")}>
                        {transactions[0].type === 'credit' ? '+' : '-'}{formatMoney(transactions[0].amount)} F
                    </span>
                </div>
            ) : (
                <div className="text-xs text-gray-400 text-center italic">Aucune transaction récente</div>
            )}
        </div>
    </div>
);

const AnalyticsTab = ({ user }: { user: User }) => (
    <div className="animate-in fade-in space-y-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={16}/> Performance Mensuelle</h3>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{name: 'S1', val: 12000}, {name: 'S2', val: 19000}, {name: 'S3', val: 15000}, {name: 'S4', val: 28000}]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <Tooltip />
                        <Line type="monotone" dataKey="val" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="text-blue-500 mb-2"><Eye size={20}/></div>
                <div className="text-2xl font-black text-blue-900">1.2k</div>
                <div className="text-[10px] text-blue-700 font-bold uppercase">Vues Profil</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <div className="text-purple-500 mb-2"><MousePointer2 size={20}/></div>
                <div className="text-2xl font-black text-purple-900">4.8%</div>
                <div className="text-[10px] text-purple-700 font-bold uppercase">Taux Conv.</div>
            </div>
        </div>
    </div>
);

const RankingTab = () => (
    <div className="animate-in fade-in space-y-3">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-4 text-white shadow-lg mb-4">
            <div className="flex items-center gap-3">
                <Trophy size={32} className="text-white drop-shadow-md" />
                <div>
                    <div className="font-black text-lg">Top 100 Gabon</div>
                    <div className="text-xs font-medium opacity-90">Vous êtes 42ème cette semaine !</div>
                </div>
            </div>
        </div>
        {HALL_OF_FAME_DATA.slice(0, 5).map((item, idx) => (
            <div key={item.rank} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black text-xs", idx === 0 ? "bg-yellow-100 text-yellow-700" : idx === 1 ? "bg-gray-100 text-gray-700" : idx === 2 ? "bg-orange-100 text-orange-700" : "bg-white text-gray-500")}>
                    {item.rank}
                </div>
                <img src={item.user.avatar} className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900">{item.user.name}</div>
                    <div className="text-[10px] text-gray-500">{item.title}</div>
                </div>
                <div className="text-xs font-bold text-jobgold">{formatMoney(item.user.wealth)}</div>
            </div>
        ))}
    </div>
);

const EditProfileModal = ({ isOpen, onClose, user, onSave }: { isOpen: boolean, onClose: () => void, user: User, onSave: (u: Partial<User>) => void }) => {
    const [name, setName] = useState(user.name);
    const [skills, setSkills] = useState(user.skills?.join(', ') || '');
    
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-black mb-4">Modifier Profil</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full border-b-2 border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-jobgreen" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Compétences (séparées par virgule)</label>
                        <input value={skills} onChange={e => setSkills(e.target.value)} className="w-full border-b-2 border-gray-200 py-2 font-bold text-gray-900 outline-none focus:border-jobgreen" />
                    </div>
                    <Button onClick={() => { onSave({ name, skills: skills.split(',').map(s => s.trim()).filter(Boolean) }); onClose(); }} className="w-full h-12 bg-jobgreen text-white rounded-xl shadow-lg mt-4">Enregistrer</Button>
                </div>
            </div>
        </div>
    );
};

// FIXED: Added onLogout prop and handler to the button
const SettingsModal = ({ isOpen, onClose, onSimulateHire, onLogout }: { isOpen: boolean, onClose: () => void, onSimulateHire: () => void, onLogout: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Settings size={20}/> Paramètres</h3>
                <div className="space-y-2">
                    <button className="w-full p-4 bg-gray-50 rounded-xl text-left font-bold text-sm hover:bg-gray-100 flex justify-between items-center">Notifications <ChevronDown className="-rotate-90 text-gray-400" size={16}/></button>
                    <button className="w-full p-4 bg-gray-50 rounded-xl text-left font-bold text-sm hover:bg-gray-100 flex justify-between items-center">Sécurité & Confidentialité <ChevronDown className="-rotate-90 text-gray-400" size={16}/></button>
                    <button onClick={onSimulateHire} className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl text-left font-bold text-sm hover:bg-blue-100 flex justify-between items-center">
                        <span className="flex items-center gap-2"><Zap size={16}/> Simuler Recrutement (Debug)</span>
                    </button>
                    <button onClick={onLogout} className="w-full p-4 bg-red-50 text-red-600 rounded-xl text-left font-bold text-sm hover:bg-red-100 flex justify-between items-center mt-4">
                        Déconnexion <LogOut size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContractViewerModal = ({ isOpen, onClose, contract }: { isOpen: boolean, onClose: () => void, contract: any }) => {
    if (!isOpen || !contract) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <div className="font-mono text-xs">ID: {contract.id}</div>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <div className="p-8 font-serif text-sm leading-relaxed space-y-4 max-h-[70vh] overflow-y-auto">
                    <h2 className="text-xl font-black text-center uppercase tracking-widest mb-6 border-b-2 border-black pb-2">Contrat de Prestation</h2>
                    <p>Entre le Client et le Prestataire, il est convenu ce qui suit pour la mission : <strong>{contract.title}</strong>.</p>
                    <div className="bg-gray-50 p-4 border border-gray-200 my-4">
                        <div className="flex justify-between mb-2"><span>Montant :</span> <strong>{formatMoney(contract.amount)} FCFA</strong></div>
                        <div className="flex justify-between"><span>Date :</span> <strong>{contract.date}</strong></div>
                    </div>
                    <p>Le prestataire s'engage à fournir un travail de qualité. Les fonds sont séquestrés jusqu'à validation.</p>
                    <div className="flex justify-between items-end mt-8 pt-8">
                        <div className="text-center">
                            <div className="mb-2 font-bold text-xs uppercase">Le Client</div>
                            <div className="font-script text-lg text-blue-600">Signé numériquement</div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 font-bold text-xs uppercase">Le Prestataire</div>
                            <div className="font-script text-lg text-green-600">Signé numériquement</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export const Profile: React.FC<{ onNavigate?: (tab: AppTab) => void, onJobSelect?: (job: Job) => void }> = ({ onNavigate, onJobSelect }) => {
    const { user, transactions, openInfoModal, updateUser, savedJobIds, debugSimulateHiring, logout, jobs } = useUser();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'ranking'>('dashboard');
    
    // Modal States
    const [shopModalOpen, setShopModalOpen] = useState(false);
    const [shopInitialTab, setShopInitialTab] = useState<'shop' | 'premium' | 'exchange'>('shop');
    const [showPinModal, setShowPinModal] = useState(false);
    const [isBalanceUnlocked, setIsBalanceUnlocked] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showLocationSelector, setShowLocationSelector] = useState(false);
    const [showGiftModal, setShowGiftModal] = useState(false);
    
    // Contract States
    const [showContract, setShowContract] = useState(false);
    const [selectedContract, setSelectedContract] = useState<any>(null);

    // Glass shine delay
    const glassDelay = useMemo(() => Math.random() * 5, []);

    // Derived Data
    const contracts = useMemo(() => {
        // Mock contracts from transactions that are 'escrow_release' or jobs completed
        const completedJobs = jobs.filter(j => j.status === 'completed' && (j.postedBy.id === user.id || j.assignedTo?.id === user.id));
        return completedJobs.map(j => ({
            id: `ctr_${j.id}`,
            title: j.title,
            amount: j.budget,
            date: new Date(j.createdAt).toLocaleDateString(),
            role: j.postedBy.id === user.id ? 'client' : 'provider'
        }));
    }, [jobs, user.id]);

    const isProfileIncomplete = !user.location || !user.skills || user.skills.length === 0;

    // Direct logout without confirmation alert
    const handleLogout = () => {
        logout();
    };

    const openShop = (tab: 'shop' | 'premium' | 'exchange') => {
        setShopInitialTab(tab);
        setShopModalOpen(true);
    };

    const goToFavorites = () => {
        if (onNavigate) {
            sessionStorage.setItem('open_favorites', 'true');
            onNavigate(AppTab.HOME);
        }
    };

    const handleSimulateHire = () => {
        const job = debugSimulateHiring();
        if (job) {
            setShowSettings(false);
            if (onJobSelect) onJobSelect(job);
        } else {
            openInfoModal("Simulation Impossible", "Aucun job disponible pour la simulation.");
        }
    };

    const handleViewContract = (c: any) => {
        setSelectedContract(c);
        setShowContract(true);
    };

    return (
        <div className="pb-24 bg-[#F8F9FA] min-h-screen">
             {/* Header */}
             <div className="relative bg-gradient-to-br from-jobgreen to-green-900 pt-safe pb-24 rounded-b-[40px] shadow-xl overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-40 h-40 bg-jobgold/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                 <div className="px-6 py-4 flex justify-between items-center relative z-10">
                     <button className="text-white/80 hover:text-white transition-colors">
                        <Share2 size={24} />
                     </button>
                     <div className="text-white font-black tracking-widest text-sm opacity-80">MON ESPACE</div>
                     <button 
                        onClick={() => setShowSettings(true)}
                        className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                    >
                        <Settings size={20} />
                    </button>
                 </div>
             </div>
            
            {/* Main Card */}
            <div className="px-4 -mt-20 relative z-20 mb-6">
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="relative group">
                            <div className="p-1.5 bg-white rounded-[28px] shadow-sm">
                                <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-[22px] object-cover border border-gray-100 shadow-inner" />
                            </div>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-xl border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform active:scale-90"
                            >
                                <Edit3 size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-14 text-center">
                         <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
                             {user.name}
                             {user.isVerified && <ShieldCheck className="text-blue-500 fill-blue-50" size={20} />}
                         </h1>
                         <div 
                            onClick={() => setShowLocationSelector(true)}
                            className="flex items-center justify-center gap-1.5 mt-1 text-sm text-gray-500 font-medium cursor-pointer hover:text-jobgreen transition-colors group"
                         >
                            <MapPin size={14} className="group-hover:scale-110 transition-transform" /> 
                            <span>{user.location || 'Localisation inconnue'}</span>
                            <Edit3 size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                         </div>
                         
                         <div className="flex justify-center gap-2 mt-4 flex-wrap">
                            <span 
                                onClick={() => openShop('premium')}
                                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border relative overflow-hidden", 
                                user.isPremium 
                                    ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200" 
                                    : "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20"
                                )}
                            >
                                <div 
                                    className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" 
                                    style={{ animationDelay: `${glassDelay}s` }}
                                />
                                <Crown size={12} fill={user.isPremium ? "currentColor" : "none"} className={user.isPremium ? "animate-wiggle-violent relative z-10" : "animate-pulse relative z-10"} /> 
                                <span className="relative z-10">{user.isPremium ? "Membre Premium" : "Passer Pro"}</span>
                            </span>
                             <div className="flex gap-1">
                                {user.skills?.slice(0, 2).map(skill => (
                                    <span key={skill} className="bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-gray-100">{skill}</span>
                                ))}
                                {(user.skills?.length || 0) > 2 && (
                                     <span className="bg-gray-50 text-gray-400 px-2 py-1.5 rounded-lg text-xs font-bold border border-gray-100">+{user.skills!.length - 2}</span>
                                )}
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Internal Tabs */}
            <div className="px-4 mb-6">
                <div className="bg-white p-1.5 rounded-2xl flex gap-1 shadow-sm border border-gray-100">
                    <button onClick={() => setActiveTab('dashboard')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all", activeTab === 'dashboard' ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50")}>
                        <Briefcase size={14} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all", activeTab === 'analytics' ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50")}>
                        <BarChart2 size={14} /> Analytics
                    </button>
                    <button onClick={() => setActiveTab('ranking')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all", activeTab === 'ranking' ? "bg-jobgold text-yellow-900 shadow-md" : "text-gray-500 hover:bg-gray-50")}>
                        <Trophy size={14} /> Classement
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4">
                {activeTab === 'dashboard' && (
                    <div className="space-y-4 animate-in slide-in-from-left-4 fade-in">
                        <div 
                            onClick={() => setShowVerification(true)}
                            className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-4 flex items-center gap-4 cursor-pointer hover:border-jobgreen transition-colors active:scale-98 group"
                        >
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="24" cy="24" r="20" stroke="#f3f4f6" strokeWidth="4" fill="none" />
                                    <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (user.verificationScore || 0)) / 100} className="transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-700">
                                    {user.verificationScore}%
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-sm group-hover:text-jobgreen transition-colors flex items-center gap-1">
                                    Centre de Vérification <ShieldCheck size={14} />
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                                    {user.isVerified ? "Identité validée. Crédibilité maximale." : "Complétez votre profil pour rassurer les clients."}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-xl text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                <ChevronDown className="-rotate-90" size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                             <StatCard label="Jobs" value={user.jobsCompleted} icon={Check} color="blue" sub="Terminés" />
                             <div onClick={() => setShowReviews(true)} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center h-28 relative overflow-hidden cursor-pointer active:scale-95 transition-all hover:border-jobgold group">
                                <div className="absolute top-0 right-0 p-1.5 rounded-bl-xl bg-yellow-50 text-jobgold opacity-50 group-hover:opacity-100 transition-opacity"><Star size={12} /></div>
                                <div className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{user.rating}</div>
                                <div className="flex gap-0.5 text-jobgold">{[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= Math.round(user.rating) ? "currentColor" : "none"} />)}</div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 group-hover:text-jobgold transition-colors">124 Avis</div>
                             </div>
                             <StatCard label="Niveau" value={user.tier === 'standard' ? 'STD' : user.tier === 'verified' ? 'VER' : 'PRO'} icon={Crown} color={user.tier === 'premium' ? 'yellow' : user.tier === 'verified' ? 'blue' : 'gray'} sub="Statut" isPremium={user.tier === 'premium'} />
                        </div>

                        <BronzeWallet coins={user.bronzeCoins} onOpenShop={openShop} onGift={() => setShowGiftModal(true)} onInfo={() => openInfoModal("Compte Bronze", "La monnaie virtuelle pour booster vos annonces.")} />
                        
                        <CashWallet wealth={user.wealth} isUnlocked={isBalanceUnlocked} transactions={transactions} onToggle={() => !isBalanceUnlocked && setShowPinModal(true)} onLock={(e) => { e.stopPropagation(); setIsBalanceUnlocked(false); }} onInfo={() => openInfoModal("Portefeuille Cash", "Vos revenus en FCFA réels.")} />

                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                    <FileText size={16} /> Mes Contrats Signés
                                </h3>
                                <div className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full">
                                    {contracts.length} Docs
                                </div>
                            </div>
                            
                            {contracts.length > 0 ? (
                                <div className="space-y-3">
                                    {contracts.map(contract => (
                                        <div 
                                            key={contract.id} 
                                            onClick={() => handleViewContract(contract)}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-300 cursor-pointer transition-all active:scale-95 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", contract.role === 'client' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                                                    {contract.role === 'client' ? <UserIcon size={20} /> : <FileSignature size={20} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs text-gray-900 truncate max-w-[150px]">{contract.title}</div>
                                                    <div className="text-[10px] text-gray-500 font-medium">
                                                        {contract.date} • {formatMoney(contract.amount)} F
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg text-gray-400 group-hover:text-gray-900 transition-colors shadow-sm">
                                                <Eye size={16} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-xs font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    Aucun contrat signé pour le moment.
                                </div>
                            )}
                        </div>

                        <button onClick={goToFavorites} className="mt-2 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-transform">
                             <Heart size={16} className="fill-current" /> Voir mes {savedJobIds.length} favoris
                        </button>

                        {isProfileIncomplete && (
                             <div onClick={() => setIsEditing(true)} className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-red-100 transition-colors">
                                 <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-50 shrink-0 animate-pulse"><Info size={16} /></div>
                                 <div className="text-left flex-1"><div className="text-xs font-black text-red-800 uppercase">Profil incomplet</div><div className="text-[10px] text-red-600 font-medium">Ajoutez vos compétences pour recevoir des jobs.</div></div>
                                 <ChevronDown className="-rotate-90 text-red-300" size={16} />
                             </div>
                        )}

                        <div className="pt-4 pb-2">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-red-100 text-red-600 font-bold bg-white hover:bg-red-50 transition-colors active:scale-98 shadow-sm"
                            >
                                <LogOut size={20} /> Se déconnecter
                            </button>
                            <div className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                                JobLibre v1.2.0 • Gabon
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && <AnalyticsTab user={user} />}
                {activeTab === 'ranking' && <RankingTab />}
            </div>

            {/* Modals */}
            <CoinShopModal isOpen={shopModalOpen} onClose={() => setShopModalOpen(false)} initialTab={shopInitialTab} />
            <PinModal isOpen={showPinModal} onClose={() => setShowPinModal(false)} onSuccess={() => { setIsBalanceUnlocked(true); setShowPinModal(false); }} />
            <ContractViewerModal isOpen={showContract} onClose={() => setShowContract(false)} contract={selectedContract} />
            <VerificationModal isOpen={showVerification} onClose={() => setShowVerification(false)} />
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSimulateHire={handleSimulateHire} onLogout={handleLogout} />
            <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} user={user} onSave={updateUser} />
            <ReviewsModal isOpen={showReviews} onClose={() => setShowReviews(false)} rating={user.rating} reviewCount={124} userName={user.name} />
            <LocationSelectorModal isOpen={showLocationSelector} onClose={() => setShowLocationSelector(false)} />
        </div>
    );
};
