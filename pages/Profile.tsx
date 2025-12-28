
import React, { useState, useEffect, useMemo } from 'react';
import { Settings, ShieldCheck, MapPin, Award, Wallet, CreditCard, ChevronDown, ChevronUp, Crown, History, ArrowUpRight, ArrowDownLeft, Lock, Plus, Gift, Coins, EyeOff, LogOut, Bell, User as UserIcon, HelpCircle, Info, Edit3, Camera, Share2, Check, X, Tag, Sparkles, Star, Heart, TrendingUp, Calendar, Briefcase, PieChart } from 'lucide-react';
import { COIN_VALUE_XAF, TIER_LIMITS, GABON_CITIES, GABON_LOCATIONS } from '../constants';
import { ReviewsModal } from '../components/ReviewsModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { CoinShopModal } from '../components/CoinShopModal';
import { CoinBreakdown } from '../components/CoinBreakdown';
import { PinModal } from '../components/PinModal';
import { Button } from '../components/ui/Button';
import { cn, formatMoney, parseLocation } from '../lib/utils';
import { useUser } from '../context/UserContext';
import { Transaction, User, AppTab } from '../types';

// --- COMPONENTS ---

const StatCard: React.FC<{ label: string, value: string | number, icon: any, color: string, sub?: string }> = ({ label, value, icon: Icon, color, sub }) => (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group h-28">
        <div className={`absolute top-0 right-0 p-1.5 rounded-bl-xl bg-${color}-50 text-${color}-500 opacity-50 group-hover:opacity-100 transition-opacity`}>
            <Icon size={12} />
        </div>
        <div className={`text-${color}-600 font-black text-2xl mb-1`}>{value}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</div>
        {sub && <div className="text-[9px] text-gray-300 font-medium mt-0.5">{sub}</div>}
    </div>
);

const BronzeWallet: React.FC<{ 
    coins: number, 
    onOpenShop: (tab: any) => void,
    onGift: () => void,
    onInfo: () => void
}> = ({ coins, onOpenShop, onGift, onInfo }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-gradient-to-br from-orange-500 to-amber-700 rounded-3xl overflow-hidden shadow-lg shadow-orange-900/20 mb-4 animate-in fade-in slide-in-from-bottom-4 relative">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 flex items-center justify-between cursor-pointer active:bg-white/5 relative z-10"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20 shadow-inner">
                        <Coins size={24} className="fill-white/40" />
                    </div>
                    <div className="text-white">
                        <div className="flex items-center gap-1.5">
                            <div className="text-[10px] uppercase font-bold text-orange-100 tracking-wider">Compte Bronze</div>
                            <button onClick={(e) => { e.stopPropagation(); onInfo(); }} className="text-orange-200/60 hover:text-white"><Info size={12} /></button>
                        </div>
                        <div className="font-black text-2xl flex items-center gap-2 tracking-tight">
                            {coins} <span className="text-sm font-bold opacity-60">Pièces</span>
                        </div>
                    </div>
                </div>
                <div className="text-white opacity-80 bg-white/10 p-2 rounded-full">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isExpanded && (
                <div className="px-5 pb-5 animate-in slide-in-from-top-2 relative z-10">
                    <div className="text-xs text-orange-100 font-medium mb-4 flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
                        <span className="opacity-70">Valeur marchande estimée:</span>
                        <span className="text-white font-bold">{formatMoney(coins * COIN_VALUE_XAF)} FCFA</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => onOpenShop('shop')} className="bg-white text-orange-800 hover:bg-orange-50 rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 text-[10px] font-black shadow-sm active:scale-95 transition-transform">
                            <Plus size={16} /> Recharger
                        </button>
                        <button onClick={onGift} className="bg-white/20 hover:bg-white/30 text-white rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 text-[10px] font-bold active:scale-95 transition-transform backdrop-blur-sm border border-white/10">
                            <Gift size={16} /> Offrir
                        </button>
                        <button onClick={() => onOpenShop('alchemy')} className="bg-white/20 hover:bg-white/30 text-white rounded-xl py-3 px-2 flex flex-col items-center justify-center gap-1 text-[10px] font-bold active:scale-95 transition-transform backdrop-blur-sm border border-white/10">
                            <ArrowUpRight size={16} /> Convertir
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CashWallet: React.FC<{
    wealth: number,
    isUnlocked: boolean,
    transactions: Transaction[],
    onToggle: () => void,
    onLock: (e: React.MouseEvent) => void,
    onInfo: () => void
}> = ({ wealth, isUnlocked, transactions, onToggle, onLock, onInfo }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleHeaderClick = () => {
        if (!isUnlocked) {
            onToggle();
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    if (!isUnlocked && isExpanded) setIsExpanded(false);

    return (
        <div className={cn("bg-gray-900 rounded-3xl overflow-hidden shadow-xl shadow-gray-400/20 transition-all mb-8 animate-in fade-in slide-in-from-bottom-4 delay-100 border border-gray-800", isExpanded ? 'pb-4' : 'pb-0')}>
            <div onClick={handleHeaderClick} className="p-5 flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-jobgold border border-gray-700">
                        <Wallet size={24} className="fill-jobgold/10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Portefeuille Cash</div>
                            <button onClick={(e) => { e.stopPropagation(); onInfo(); }} className="text-gray-600 hover:text-white"><Info size={12} /></button>
                        </div>
                        <div className="font-black text-2xl text-white flex items-center gap-2 tracking-tight">
                            {isUnlocked ? (
                                <span>{formatMoney(wealth)} <span className="text-sm text-gray-500 font-bold">FCFA</span></span>
                            ) : (
                                <span className="tracking-widest flex items-center gap-1 h-8 opacity-50">•••••• <Lock size={14} className="text-gray-500 ml-1" /></span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isUnlocked ? (
                        <button onClick={onLock} className="p-2 text-gray-500 hover:text-white transition-colors bg-gray-800 rounded-full"><EyeOff size={16} /></button>
                    ) : (
                        <div className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded border border-gray-700">Privé</div>
                    )}
                </div>
            </div>

            {isExpanded && isUnlocked && (
                <div className="px-5 animate-in slide-in-from-top-2">
                    <div className="mb-6 bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
                        <div className="text-[10px] text-gray-400 font-bold mb-2 uppercase flex items-center gap-1"><ShieldCheck size={10} /> Équivalent Séquestre</div>
                        <CoinBreakdown amount={wealth} size="md" />
                    </div>
                    <div className="flex gap-3 mb-4">
                        <button className="flex-1 bg-white hover:bg-gray-100 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-900 border border-transparent active:scale-95 transition-transform">
                            <CreditCard size={16} /> Retirer
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-transform border border-gray-700">
                            <History size={16} /> Historique
                        </button>
                    </div>
                    {showHistory && (
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-inner animate-in slide-in-from-top-4 overflow-hidden">
                             <div className="divide-y divide-gray-700 max-h-60 overflow-y-auto">
                                {transactions.length > 0 ? transactions.map(t => (
                                    <div key={t.id} className="p-3 flex items-center justify-between hover:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", t.currency === 'COIN' ? 'bg-orange-900/30 text-orange-400' : t.type === 'credit' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400')}>
                                                {t.currency === 'COIN' ? <Coins size={14} /> : t.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-200 truncate max-w-[150px]">{t.description}</p>
                                                <p className="text-[10px] text-gray-500">{t.date}</p>
                                            </div>
                                        </div>
                                        <span className={cn("text-sm font-bold whitespace-nowrap", t.type === 'credit' ? 'text-green-400' : 'text-gray-300')}>
                                            {t.type === 'debit' ? '-' : '+'}{t.amount.toLocaleString()} {t.currency === 'COIN' ? 'P' : ''}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="p-4 text-center text-xs text-gray-500">Aucune transaction récente</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- MOVED OUTSIDE ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-gray-700 p-3 rounded-xl shadow-xl">
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">{label}</p>
                <p className="text-white font-black text-lg">{formatMoney(payload[0].value)} F</p>
                <p className="text-green-400 text-xs font-bold mt-1 flex items-center gap-1">
                    <Briefcase size={10} /> {payload[0].payload.jobs} Jobs
                </p>
            </div>
        );
    }
    return null;
};

const PerformanceChart: React.FC = () => {
    const { openInfoModal } = useUser();
    const [period, setPeriod] = useState<'7J' | '30J' | '90J'>('7J');

    // MOCK DATA GENERATOR (Advanced Look)
    const data = useMemo(() => [
        { name: 'Lun', value: 15000, jobs: 1 },
        { name: 'Mar', value: 25000, jobs: 2 },
        { name: 'Mer', value: 12000, jobs: 1 },
        { name: 'Jeu', value: 32000, jobs: 2 },
        { name: 'Ven', value: 45000, jobs: 3 },
        { name: 'Sam', value: 58000, jobs: 4 }, // Peak
        { name: 'Dim', value: 42000, jobs: 3 },
    ], [period]); // Static for now, but wired to switch

    const totalRevenue = data.reduce((acc, curr) => acc + curr.value, 0);
    const totalJobs = data.reduce((acc, curr) => acc + curr.jobs, 0);

    return (
        <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                    <TrendingUp className="text-jobgreen" size={20} /> Analytics
                </h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['7J', '30J'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p as any)}
                            className={cn(
                                "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                                period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#111827] rounded-[32px] p-6 relative overflow-hidden shadow-xl shadow-gray-900/10">
                {/* Header Stats */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                            Revenu {period} <Info size={10} onClick={() => openInfoModal('Revenus', 'Total encaissé sur la période sélectionnée, hors séquestres en cours.')} className="cursor-pointer hover:text-white" />
                        </div>
                        <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                            {formatMoney(totalRevenue)} <span className="text-sm text-gray-500">F</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                                <TrendingUp size={12} /> +12.5%
                            </span>
                            <span className="text-gray-500 text-xs font-medium">vs s. dernière</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white mb-1 ml-auto">
                            <Briefcase size={18} />
                        </div>
                        <div className="text-xl font-bold text-white">{totalJobs}</div>
                        <div className="text-[9px] text-gray-500 uppercase font-bold">Missions</div>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="h-48 w-full -ml-2 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 700}} 
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#10B981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Breakdown Pills */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-800">
                    <div className="flex-1 bg-gray-800/50 rounded-xl p-2 flex items-center gap-3 border border-gray-700/50">
                        <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                        <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Missions</div>
                            <div className="text-white font-bold text-xs">85%</div>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-800/50 rounded-xl p-2 flex items-center gap-3 border border-gray-700/50">
                        <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
                        <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Pourboires</div>
                            <div className="text-white font-bold text-xs">15%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (EditProfileModal)
const EditProfileModal: React.FC<{ isOpen: boolean, onClose: () => void, user: User, onSave: (u: Partial<User>) => void }> = ({ isOpen, onClose, user, onSave }) => {
    const { categories, addNewCategory } = useUser();
    const [name, setName] = useState(user.name);
    const [skills, setSkills] = useState(user.skills || []);
    const loc = parseLocation(user.location);
    const [city, setCity] = useState(loc.city || 'Libreville');
    const [neighborhood, setNeighborhood] = useState(loc.neighborhood || '');
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            const parsed = parseLocation(user.location);
            setCity(parsed.city || 'Libreville');
            setNeighborhood(parsed.neighborhood || '');
            setSkills(user.skills || []);
        }
    }, [isOpen, user]);

    useEffect(() => {
        const hoods = GABON_LOCATIONS[city] || [];
        setAvailableNeighborhoods(hoods);
        // Reset if invalid
        if (hoods.length > 0 && !hoods.includes(neighborhood)) {
            setNeighborhood('');
        }
    }, [city]);

    const filteredSuggestions = useMemo(() => {
        if (!skillInput.trim()) return [];
        const lowerInput = skillInput.toLowerCase();
        return categories
            .filter(cat => cat.name.toLowerCase().includes(lowerInput) && !skills.includes(cat.name))
            .slice(0, 5); 
    }, [skillInput, categories, skills]);

    const handleAddSkill = (skillName: string) => {
        if (!skills.includes(skillName)) {
            setSkills([...skills, skillName]);
            setSkillInput('');
            setIsFocused(false);
        }
    };

    const handleCreateSkill = () => {
        if (skillInput.trim()) {
            const newName = skillInput.trim();
            addNewCategory(newName);
            handleAddSkill(newName.charAt(0).toUpperCase() + newName.slice(1));
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSave = () => {
        if (!neighborhood.trim()) return;
        setIsSaving(true);
        const finalLocation = `${neighborhood.trim()}, ${city}`;
        setTimeout(() => {
            onSave({ name, location: finalLocation, skills });
            setIsSaving(false);
            onClose();
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 pb-safe shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                    <h3 className="font-black text-lg">Modifier Profil</h3>
                    <button onClick={handleSave} disabled={!name || !city || !neighborhood} className="text-jobgreen font-bold text-sm px-3 py-1.5 bg-green-50 rounded-full hover:bg-green-100 disabled:opacity-50">{isSaving ? '...' : 'Enregistrer'}</button>
                </div>
                <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <img src={user.avatar} className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg" />
                            <button className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-2 rounded-xl border-2 border-white shadow-sm hover:scale-110 transition-transform"><Camera size={16} /></button>
                        </div>
                        <p className="text-xs font-bold text-gray-400">Tapez pour changer la photo</p>
                    </div>
                    <div className="space-y-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Nom complet</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none transition-colors" /></div>
                        
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                            <label className="text-xs font-black text-blue-900 uppercase mb-2 block flex items-center gap-1"><MapPin size={12} /> Ma Zone (Géolocalisation)</label>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Commune</label>
                                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white border border-blue-200 rounded-xl px-3 py-3 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none">
                                        {GABON_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Quartier</label>
                                    <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full bg-white border border-blue-200 rounded-xl px-3 py-3 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none">
                                        <option value="" disabled>Choisir quartier...</option>
                                        {availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                            <p className="text-[10px] text-blue-600 mt-2 font-medium">Ces infos permettent de filtrer les annonces "Ma Zone" sur l'accueil.</p>
                        </div>
                    </div>
                    <div className="relative"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Compétences & Tags</label><div className="flex flex-wrap gap-2 mb-3">{skills.map(skill => (<span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in">{skill}<button onClick={() => handleRemoveSkill(skill)}><X size={12} className="text-gray-400 hover:text-red-500"/></button></span>))}</div><div className="relative"><div className="flex items-center gap-2 border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-jobgreen focus-within:bg-white transition-colors"><Tag size={18} className="text-gray-400" /><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onFocus={() => setIsFocused(true)} placeholder="Ajouter (ex: Plomberie)..." className="flex-1 bg-transparent text-sm font-bold outline-none text-gray-900" />{skillInput && (<button onClick={() => setSkillInput('')} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>)}</div>{isFocused && skillInput && (<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2">{filteredSuggestions.map(cat => (<button key={cat.id} onClick={() => handleAddSkill(cat.name)} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-0">{cat.name}<Plus size={14} className="text-gray-400" /></button>))}<button onClick={handleCreateSkill} className="w-full text-left px-4 py-3 hover:bg-green-50 text-sm font-bold text-jobgreen flex items-center gap-2"><Plus size={16} /> Créer le tag "{skillInput}"</button></div>)}</div></div>
                </div>
            </div>
        </div>
    );
};

// --- MOVED OUTSIDE ---
const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (<button onClick={onChange} className={cn("w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center", checked ? "bg-jobgreen" : "bg-gray-200")}><div className={cn("w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300", checked ? "translate-x-5" : "translate-x-0")} /></button>);

const SettingsModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [notifPush, setNotifPush] = useState(true);
    const [notifEmail, setNotifEmail] = useState(false);
    const [visible, setVisible] = useState(true);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div><div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 pb-safe shadow-2xl"><div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0"><h3 className="font-black text-lg">Paramètres</h3><button onClick={onClose} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button></div><div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]"><div><h4 className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">Notifications</h4><div className="bg-gray-50 rounded-2xl p-1 border border-gray-100"><div className="flex items-center justify-between p-3 border-b border-gray-200/50"><div className="flex items-center gap-3"><div className="p-2 bg-white rounded-lg text-gray-600 shadow-sm"><Bell size={18} /></div><span className="font-bold text-sm text-gray-800">Push Mobile</span></div><Toggle checked={notifPush} onChange={() => setNotifPush(!notifPush)} /></div><div className="flex items-center justify-between p-3"><div className="flex items-center gap-3"><div className="p-2 bg-white rounded-lg text-gray-600 shadow-sm"><Info size={18} /></div><span className="font-bold text-sm text-gray-800">Emails Marketing</span></div><Toggle checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} /></div></div></div><div><h4 className="text-xs font-bold text-gray-400 uppercase mb-3 px-1">Confidentialité</h4><div className="bg-gray-50 rounded-2xl p-1 border border-gray-100"><div className="flex items-center justify-between p-3"><div className="flex items-center gap-3"><div className="p-2 bg-white rounded-lg text-gray-600 shadow-sm"><EyeOff size={18} /></div><div><div className="font-bold text-sm text-gray-800">Profil Public</div><div className="text-[10px] text-gray-400">Visible dans la recherche</div></div></div><Toggle checked={visible} onChange={() => setVisible(!visible)} /></div></div></div><div className="space-y-2 pt-2"><button className="w-full flex items-center gap-3 p-4 bg-white border border-gray-100 hover:bg-gray-50 rounded-2xl transition-colors text-left group"><div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-colors"><HelpCircle size={20} /></div><span className="font-bold text-gray-700 group-hover:text-gray-900">Aide & Support</span></button><button className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors text-left group"><div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-red-500"><LogOut size={20} /></div><span className="font-bold text-red-600">Déconnexion</span></button></div></div><div className="p-4 bg-gray-50 text-center text-[10px] text-gray-400 font-medium">Version 1.2.0 • JobLibre Gabon</div></div></div>
    );
}

// --- MAIN PROFILE COMPONENT ---

interface ProfileProps {
    onNavigate?: (tab: AppTab) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
    const { user, transactions, openInfoModal, updateUser, savedJobIds } = useUser();
    const [isBalanceUnlocked, setIsBalanceUnlocked] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [shopModalOpen, setShopModalOpen] = useState(false);
    const [shopInitialTab, setShopInitialTab] = useState<'shop' | 'premium' | 'alchemy'>('shop');
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    // Random delay for glass shine effect
    const glassDelay = useMemo(() => Math.random() * 5, []);

    const openShop = (tab: 'shop' | 'premium' | 'alchemy') => {
        setShopInitialTab(tab);
        setShopModalOpen(true);
    };

    const goToFavorites = () => {
        if (onNavigate) {
            sessionStorage.setItem('open_favorites', 'true');
            onNavigate(AppTab.HOME);
        }
    };

    const loc = parseLocation(user.location);
    const isProfileIncomplete = !user.location || !user.skills || user.skills.length === 0;

    return (
        <div className="pb-24 bg-[#F8F9FA] min-h-screen">
             {/* --- IMMERSIVE HEADER --- */}
             <div className="relative bg-gradient-to-br from-jobgreen to-green-900 pt-safe pb-24 rounded-b-[40px] shadow-xl overflow-hidden">
                 {/* Abstract Shapes */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-40 h-40 bg-jobgold/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                 
                 {/* Top Actions */}
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
            
            {/* --- MAIN CARD --- */}
            <div className="px-4 -mt-20 relative z-20 mb-6">
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 relative">
                    {/* Avatar & Edit */}
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
                         <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-gray-500 font-medium">
                            <MapPin size={14} /> 
                            <span>{user.location || 'Localisation inconnue'}</span>
                         </div>
                         
                         {/* Badges */}
                         <div className="flex justify-center gap-2 mt-4 flex-wrap">
                            <span 
                                onClick={() => openShop('premium')}
                                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border relative overflow-hidden", 
                                user.isPremium 
                                    ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200" 
                                    : "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20"
                                )}
                            >
                                {/* GLASS SHINE EFFECT */}
                                <div 
                                    className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" 
                                    style={{ animationDelay: `${glassDelay}s` }}
                                />

                                <Crown size={12} fill={user.isPremium ? "currentColor" : "none"} className={!user.isPremium ? "animate-pulse relative z-10" : "relative z-10"} /> 
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
                         
                         {/* Stats Grid */}
                         <div className="grid grid-cols-3 gap-3 mt-6">
                             <StatCard 
                                label="Jobs" 
                                value={user.jobsCompleted} 
                                icon={Check} 
                                color="blue" 
                                sub="Terminés"
                             />
                             <div 
                                onClick={() => setShowReviews(true)}
                                className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center h-28 relative overflow-hidden cursor-pointer active:scale-95 transition-all hover:border-jobgold group"
                             >
                                <div className="absolute top-0 right-0 p-1.5 rounded-bl-xl bg-yellow-50 text-jobgold opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Star size={12} />
                                </div>
                                <div className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{user.rating}</div>
                                <div className="flex gap-0.5 text-jobgold">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= Math.round(user.rating) ? "currentColor" : "none"} />)}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 group-hover:text-jobgold transition-colors">124 Avis</div>
                             </div>
                             <StatCard 
                                label="Niveau" 
                                value={user.tier === 'standard' ? 'STD' : user.tier === 'verified' ? 'VER' : 'PRO'} 
                                icon={Crown} 
                                color={user.tier === 'premium' ? 'yellow' : user.tier === 'verified' ? 'blue' : 'gray'}
                                sub="Statut"
                             />
                         </div>

                         {/* FAVORITES SHORTCUT BUTTON (NEW) */}
                         <button 
                             onClick={goToFavorites}
                             className="mt-4 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-transform"
                         >
                             <Heart size={16} className="fill-current" /> 
                             Voir mes {savedJobIds.length} favoris
                         </button>

                         {/* Incomplete Profile Warning */}
                         {isProfileIncomplete && (
                             <div onClick={() => setIsEditing(true)} className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-red-100 transition-colors">
                                 <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-50 shrink-0 animate-pulse">
                                     <Info size={16} />
                                 </div>
                                 <div className="text-left flex-1">
                                     <div className="text-xs font-black text-red-800 uppercase">Profil incomplet</div>
                                     <div className="text-[10px] text-red-600 font-medium">Ajoutez vos compétences pour recevoir des jobs.</div>
                                 </div>
                                 <ChevronDown className="-rotate-90 text-red-300" size={16} />
                             </div>
                         )}
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD WIDGETS --- */}
            <div className="px-4 space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                <PerformanceChart />
                <BronzeWallet 
                    coins={user.bronzeCoins} 
                    onOpenShop={openShop} 
                    onGift={() => setShowGiftModal(true)} 
                    onInfo={() => openInfoModal("Compte Bronze", "La monnaie virtuelle pour booster vos annonces et débloquer des fonctionnalités Premium.")}
                />
                <CashWallet 
                    wealth={user.wealth}
                    isUnlocked={isBalanceUnlocked}
                    transactions={transactions}
                    onToggle={() => !isBalanceUnlocked && setShowPinModal(true)}
                    onLock={(e) => { e.stopPropagation(); setIsBalanceUnlocked(false); }}
                    onInfo={() => openInfoModal("Portefeuille Cash", "Vos revenus en FCFA réels. Retirez vos fonds via Airtel Money ou MoMo à partir de 5000 F.")}
                />
            </div>

            {/* --- MODALS --- */}
            <CoinShopModal isOpen={shopModalOpen} onClose={() => setShopModalOpen(false)} initialTab={shopInitialTab} />
            <PinModal isOpen={showPinModal} onClose={() => setShowPinModal(false)} onSuccess={() => { setIsBalanceUnlocked(true); setShowPinModal(false); }} />
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} user={user} onSave={updateUser} />
            <ReviewsModal isOpen={showReviews} onClose={() => setShowReviews(false)} rating={user.rating} reviewCount={124} userName={user.name} />
        </div>
    );
};
