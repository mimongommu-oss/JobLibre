
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Radio, Users, Briefcase, Megaphone, Scale, Wallet, Send, Settings, 
    ShieldCheck, X, LogOut, Menu, Bell, Search, Filter, MoreHorizontal, AlertTriangle, 
    ArrowUpRight, ArrowDownRight, CheckCircle2, AlertOctagon, UserPlus, Zap, Lock, ChevronRight,
    Fingerprint, Mail, Phone, Ban, Check, UserCheck, Eye, Activity, Server, Wifi, Pause, Play, Globe, Database,
    Map, List, CreditCard, Crosshair, Terminal, RefreshCw, ArrowLeft, MapPin, CornerDownRight, Home, Map as MapIcon,
    BarChart2, ZapOff
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { cn, formatMoney } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { MOCK_USERS, GABON_LOCATIONS, GABON_CITIES, GABON_PROVINCES, Province } from '../constants';

// --- TYPES ---
export type AdminTab = 'overview' | 'live' | 'users' | 'jobs' | 'ads' | 'disputes' | 'finance' | 'communication' | 'settings';
type TimeRange = '7d' | '30d' | '90d';

// --- MOCK DATASETS ---
const DATA_SETS = {
    '7d': [
        { name: 'Lun', volume: 400000, commission: 20000, escrow: 350000 },
        { name: 'Mar', volume: 300000, commission: 15000, escrow: 280000 },
        { name: 'Mer', volume: 200000, commission: 10000, escrow: 150000 },
        { name: 'Jeu', volume: 278000, commission: 13900, escrow: 260000 },
        { name: 'Ven', volume: 189000, commission: 9450, escrow: 180000 },
        { name: 'Sam', volume: 680000, commission: 34000, escrow: 600000 },
        { name: 'Dim', volume: 590000, commission: 29500, escrow: 550000 },
    ],
    '30d': [
        { name: 'S1', volume: 2400000, commission: 120000, escrow: 2100000 },
        { name: 'S2', volume: 3100000, commission: 155000, escrow: 2800000 },
        { name: 'S3', volume: 2800000, commission: 140000, escrow: 2600000 },
        { name: 'S4', volume: 4200000, commission: 210000, escrow: 3800000 },
    ],
    '90d': [
        { name: 'Oct', volume: 12000000, commission: 600000, escrow: 10000000 },
        { name: 'Nov', volume: 15000000, commission: 750000, escrow: 13000000 },
        { name: 'Dec', volume: 22000000, commission: 1100000, escrow: 20000000 },
    ]
};

const KPI_DATA = {
    '7d': { users: 24, usersTrend: '+12%', volume: '2.4M', volumeTrend: '+8%', active: 85 },
    '30d': { users: 145, usersTrend: '+28%', volume: '12.5M', volumeTrend: '+15%', active: 210 },
    '90d': { users: 450, usersTrend: '+45%', volume: '49M', volumeTrend: '+32%', active: 540 },
};

const USER_DISTRIBUTION = [
  { name: 'Clients', value: 850, color: '#1E293B' }, // Slate-800
  { name: 'Prestataires', value: 390, color: '#2E7D32' }, // JobGreen
];

const INITIAL_ALERTS = [
    { id: 1, type: 'finance', message: 'Retrait important (500k+) en attente', time: '10 min', critical: true },
    { id: 2, type: 'dispute', message: 'Litige non résolu > 48h (Mission #882)', time: '2h', critical: true },
    { id: 3, type: 'kyc', message: '5 identités en attente de validation', time: '4h', critical: false },
    { id: 4, type: 'system', message: 'Taux d\'erreur API Mobile Money en hausse', time: '15 min', critical: false },
];

// --- MOCK SUB-COMPONENTS ---

interface OverviewProps {
    onNavigate: (tab: AdminTab) => void;
    alerts: typeof INITIAL_ALERTS;
    onDismissAlert: (id: number) => void;
}

const OverviewContent = ({ onNavigate, alerts, onDismissAlert }: OverviewProps) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    
    const currentData = DATA_SETS[timeRange];
    const currentKPIs = KPI_DATA[timeRange];
    
    // Calculate alert counts for badges
    const disputeCount = alerts.filter(a => a.type === 'dispute').length;

    return (
        <div className="space-y-6 animate-in fade-in pb-10">
            
            {/* Header Controls */}
            <div className="flex justify-end mb-2">
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
                    {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                timeRange === range 
                                    ? "bg-gray-900 text-white shadow-sm" 
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            {range === '7d' ? '7 Jours' : range === '30d' ? '30 Jours' : '3 Mois'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 1. KPIs STRATÉGIQUES (LES BRÈVES) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* CARTE 1: ABONNÉS */}
                <div 
                    onClick={() => onNavigate('users')}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-95"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={22} />
                        </div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">
                            <ArrowUpRight size={14} className="mr-1"/> {currentKPIs.usersTrend}
                        </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1 transition-all duration-300">
                        {timeRange === '7d' ? '1 240' : timeRange === '30d' ? '1 385' : '1 690'}
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Inscrits</div>
                    <div className="text-[10px] text-gray-400 font-medium flex gap-2 items-center">
                        <span>+{currentKPIs.users} nouveaux</span>
                        <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                    </div>
                </div>

                {/* CARTE 2: CASH FLOW */}
                <div 
                    onClick={() => onNavigate('finance')}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-95"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Wallet size={22} />
                        </div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">
                            <ArrowUpRight size={14} className="mr-1"/> {currentKPIs.volumeTrend}
                        </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{currentKPIs.volume} F</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Volume d'Affaires</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center">
                        Commissions: <span className="text-green-600 font-bold ml-1">~8%</span>
                        <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
                    </div>
                </div>

                {/* CARTE 3: SÉQUESTRE */}
                <div 
                    onClick={() => onNavigate('finance')}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-95"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700 group-hover:bg-jobgold group-hover:text-white transition-colors">
                            <Lock size={22} />
                        </div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            Sécurité
                        </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">
                        {timeRange === '7d' ? '850k' : '2.1M'} F
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Fonds Bloqués</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center">
                        En attente de validation
                        <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500" />
                    </div>
                </div>

                {/* CARTE 4: ALERTES */}
                <div 
                    onClick={() => onNavigate('disputes')}
                    className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group bg-red-50/30 cursor-pointer active:scale-95"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <AlertOctagon size={22} />
                        </div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 animate-pulse">
                            Action
                        </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{alerts.length}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Alertes Actives</div>
                    <div className="text-[10px] text-red-600 font-bold flex items-center">
                        {disputeCount > 0 ? `${disputeCount} litiges critiques` : "Système stable"}
                        <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 2. GRAPHIQUE FINANCIER */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-black text-gray-900 text-lg">Flux Financiers</h3>
                            <p className="text-xs text-gray-500">Volume Global vs Fonds sous Séquestre</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-800"></div> Volume</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-jobgold"></div> Séquestre</div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1E293B" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#1E293B" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorEscrow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(value: number) => formatMoney(value) + ' F'}
                                />
                                <Area type="monotone" dataKey="volume" name="Volume Total" stroke="#1E293B" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                                <Area type="monotone" dataKey="escrow" name="Sous Séquestre" stroke="#FFD700" strokeWidth={3} fillOpacity={1} fill="url(#colorEscrow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. RÉPARTITION UTILISATEURS */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[350px] flex flex-col">
                        <h3 className="font-black text-gray-900 text-sm mb-1">Répartition de la Base</h3>
                        <p className="text-xs text-gray-500 mb-4">Clients vs Prestataires</p>
                        
                        <div className="flex-1 flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={USER_DISTRIBUTION}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {USER_DISTRIBUTION.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-gray-900">1240</span>
                                <span className="text-[10px] text-gray-400 uppercase">Comptes</span>
                            </div>
                        </div>
                        
                        {/* LEGEND */}
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                                <div className="text-xs font-bold text-gray-700">Clients (68%)</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-jobgreen"></div>
                                <div className="text-xs font-bold text-gray-700">Pros (32%)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. ACTIONS URGENTES (INTERACTIVE) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" /> Actions Requises Immédiates
                    </h3>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full transition-all", alerts.length > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
                        {alerts.length > 0 ? `${alerts.length} items` : "Tout est calme"}
                    </span>
                </div>
                
                {alerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                        <CheckCircle2 size={32} className="text-green-500 mb-2" />
                        <p className="text-xs font-bold">Aucune alerte en cours. Bon travail !</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", alert.critical ? "bg-red-500 animate-pulse" : "bg-orange-400")}></div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn("text-xs font-medium truncate", alert.critical ? "text-gray-900 font-bold" : "text-gray-600")}>{alert.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{alert.time} • {alert.type.toUpperCase()}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onDismissAlert(alert.id)}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-jobgreen hover:text-white hover:border-jobgreen transition-colors"
                                    >
                                        Traiter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- USERS CONTENT (Existing) ---
const UsersContent = () => <div className="text-center py-20 text-gray-400">Gestion des Utilisateurs</div>;
const JobsContent = () => <div className="text-center py-20 text-gray-400">Gestion des Missions</div>;
const AdsContent = () => <div className="text-center py-20 text-gray-400">Gestion Publicité</div>;
const DisputesContent = () => <div className="text-center py-20 text-gray-400">Gestion Litiges</div>;
const FinanceContent = () => <div className="text-center py-20 text-gray-400">Gestion Finance</div>;
const CommunicationContent = () => <div className="text-center py-20 text-gray-400">Communication</div>;

// --- LIVE MONITOR (REAL-TIME OPS) ---
interface SystemLog {
    id: string;
    timestamp: Date;
    type: 'USER_NEW' | 'TRANSACTION' | 'JOB_NEW' | 'ALERT' | 'SUB';
    message: string;
    user?: string;
    location?: string;
    neighborhood?: string;
    amount?: number;
    meta?: any;
}

const LogDetailPanel = ({ log, onClose }: { log: SystemLog, onClose: () => void }) => {
    // Generate mock technical data
    const ip = `197.234.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    const traceId = `req_${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="w-full max-w-md bg-[#1A1C1E] h-full shadow-2xl animate-in slide-in-from-right flex flex-col border-l border-gray-800 relative z-10 text-white font-mono">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                    <div>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase mb-2",
                            log.type === 'ALERT' ? "bg-red-900 text-red-400" : 
                            log.type === 'TRANSACTION' ? "bg-green-900 text-green-400" :
                            log.type === 'USER_NEW' ? "bg-blue-900 text-blue-400" :
                            log.type === 'JOB_NEW' ? "bg-orange-900 text-orange-400" : "bg-gray-800 text-gray-400"
                        )}>
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                            {log.type}
                        </div>
                        <h2 className="text-xl font-bold font-sans text-white leading-tight">{log.message}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"><X size={18} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Key Data */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                            <div className="text-[10px] text-gray-500 uppercase">Utilisateur</div>
                            <div className="text-sm font-bold text-blue-400 hover:underline cursor-pointer">{log.user || 'System'}</div>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                            <div className="text-[10px] text-gray-500 uppercase">Localisation</div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                <Map size={12} className="text-gray-500" /> {log.neighborhood ? `${log.neighborhood}, ${log.location}` : log.location || 'Global'}
                            </div>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                            <div className="text-[10px] text-gray-500 uppercase">Timestamp</div>
                            <div className="text-sm font-bold text-white">{log.timestamp.toLocaleTimeString()}</div>
                        </div>
                        {log.amount && (
                            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                                <div className="text-[10px] text-gray-500 uppercase">Montant</div>
                                <div className="text-sm font-bold text-green-400">{formatMoney(log.amount)} FCFA</div>
                            </div>
                        )}
                    </div>

                    {/* Technical Metadata */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <Terminal size={12} /> Métadonnées Techniques
                        </h3>
                        <div className="bg-black/50 p-3 rounded-lg border border-gray-800 text-[10px] space-y-1 text-gray-400">
                            <div className="flex justify-between"><span>Trace ID:</span> <span className="text-white">{traceId}</span></div>
                            <div className="flex justify-between"><span>IP Addr:</span> <span className="text-white">{ip}</span></div>
                            <div className="flex justify-between"><span>Latency:</span> <span className="text-green-500">42ms</span></div>
                            <div className="flex justify-between"><span>Region:</span> <span className="text-white">aws-af-south-1</span></div>
                        </div>
                    </div>

                    {/* Context Action */}
                    {log.type === 'ALERT' && (
                        <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-xl flex gap-3">
                            <AlertTriangle className="text-red-500 shrink-0" size={20} />
                            <div className="text-xs text-red-200">
                                <span className="font-bold">Risque Détecté:</span> Activité suspecte depuis une IP inconnue. Vérification manuelle requise.
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-800 bg-gray-900">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" className="border border-gray-700 text-gray-300 hover:bg-gray-800 h-12">
                            <Eye size={16} className="mr-2" /> Voir Profil
                        </Button>
                        {log.type === 'ALERT' ? (
                            <Button className="bg-red-600 hover:bg-red-700 text-white h-12 border-0">
                                <Ban size={16} className="mr-2" /> Bloquer
                            </Button>
                        ) : log.type === 'TRANSACTION' ? (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 border-0">
                                <CreditCard size={16} className="mr-2" /> Rembourser
                            </Button>
                        ) : (
                            <Button className="bg-white text-black hover:bg-gray-200 h-12 border-0">
                                <Crosshair size={16} className="mr-2" /> Inspecter
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW LIVE CONTENT ---
const LiveContent = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [filter, setFilter] = useState<'ALL' | 'USERS' | 'JOBS' | 'FINANCE' | 'SECURITY'>('ALL');
    const [mobileView, setMobileView] = useState<'map' | 'logs'>('map');
    
    // --- HIERARCHICAL NAVIGATION STATE ---
    const [viewLevel, setViewLevel] = useState<'national' | 'province' | 'city'>('national');
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // --- TRAFFIC SIMULATION CONTROLS ---
    const [trafficMode, setTrafficMode] = useState<'low' | 'medium' | 'high'>('low');

    // Metrics
    const [latency, setLatency] = useState(45);
    const [activeUsers, setActiveUsers] = useState(128);
    const [errorRate, setErrorRate] = useState(0.2);

    // Track "Heat" and MULTIPLE Colors for simultaneous events
    // Key format: 'National' | 'ProvinceName' | 'CityName' | 'City_Hood'
    // Value: Array of color strings to handle multiple simultaneous events
    const [activeEvents, setActiveEvents] = useState<Record<string, { colors: string[], timestamp: number }>>({});

    // Mock Real-time Feed
    useEffect(() => {
        const interval = setInterval(() => {
            if (isPaused) return;

            setLatency(prev => Math.max(20, Math.min(200, prev + (Math.random() - 0.5) * 20)));
            setActiveUsers(prev => Math.max(100, prev + Math.floor((Math.random() - 0.5) * 5)));
            setErrorRate(prev => Math.max(0, Math.min(5, prev + (Math.random() - 0.6) * 0.1)));

            // --- MASSIVE BATCH GENERATION LOGIC ---
            // Determines how many distinct events to fire in this single tick
            let batchCount = 1;
            if (trafficMode === 'medium') batchCount = Math.floor(Math.random() * 5) + 3; // 3-8 events
            if (trafficMode === 'high') batchCount = Math.floor(Math.random() * 20) + 15; // 15-35 events (Simulated chaos)

            const newLogs: SystemLog[] = [];
            
            // To ensure we map target IDs to a list of NEW colors for this batch
            const batchUpdates: Record<string, string[]> = {};

            // Event Types (Reused)
            const eventTypes = [
                { type: 'USER_NEW', prob: 0.2, msg: 'Nouvelle inscription', color: 'text-blue-500', bg: 'bg-blue-500' },
                { type: 'TRANSACTION', prob: 0.3, msg: 'Paiement Séquestre', color: 'text-green-500', bg: 'bg-green-500' },
                { type: 'JOB_NEW', prob: 0.2, msg: 'Nouvelle Annonce', color: 'text-orange-500', bg: 'bg-orange-500' },
                { type: 'ALERT', prob: 0.05, msg: 'Tentative Fraude IP', color: 'text-red-500', bg: 'bg-red-500' },
                { type: 'SUB', prob: 0.1, msg: 'Abonnement Premium', color: 'text-purple-500', bg: 'bg-purple-500' },
                { type: 'SYSTEM', prob: 0.15, msg: 'API Latency Spike', color: 'text-gray-400', bg: 'bg-gray-500' }
            ];

            // 1. SELECT LOCATIONS (WITH BURST LOGIC FOR 'HIGH' MODE TO SHOW SPLIT BARS)
            const selectedLocations: { prov: Province, city: string, hood: string, event: typeof eventTypes[0] }[] = [];

            // If High Traffic, pick ONE specific location and bombard it with distinct events to prove the visual split concept
            if (trafficMode === 'high' && Math.random() > 0.5) {
                // Pick a random city to be the "Hotspot"
                const hotspotProv = GABON_PROVINCES[Math.floor(Math.random() * GABON_PROVINCES.length)];
                if (hotspotProv.cities.length > 0) {
                    const hotspotCity = hotspotProv.cities[0];
                    const hotspotHood = (GABON_LOCATIONS[hotspotCity] || ['Centre'])[0];
                    
                    // Force 4 different event types on this single location
                    // Ex: Blue, Green, Orange, Red
                    const distinctEvents = [eventTypes[0], eventTypes[1], eventTypes[2], eventTypes[3]];
                    distinctEvents.forEach(evt => {
                        selectedLocations.push({ prov: hotspotProv, city: hotspotCity, hood: hotspotHood, event: evt });
                    });
                }
            }

            // Fill the rest with random scatter
            for (let i = 0; i < batchCount; i++) {
                const randomProv = GABON_PROVINCES[Math.floor(Math.random() * GABON_PROVINCES.length)];
                if (!randomProv.cities || randomProv.cities.length === 0) continue;
                const randomCity = randomProv.cities[Math.floor(Math.random() * randomProv.cities.length)];
                const subDivs = GABON_LOCATIONS[randomCity] || ['Centre'];
                const randomHood = subDivs.length > 0 ? subDivs[Math.floor(Math.random() * subDivs.length)] : 'Centre';

                // Random Event
                const rand = Math.random();
                let acc = 0;
                let chosenEvent = eventTypes[0];
                for (let evt of eventTypes) {
                    acc += evt.prob;
                    if (rand < acc) {
                        chosenEvent = evt;
                        break;
                    }
                }
                
                selectedLocations.push({ prov: randomProv, city: randomCity, hood: randomHood, event: chosenEvent });
            }

            // Process Batch
            selectedLocations.forEach((item, idx) => {
                newLogs.push({
                    id: Date.now().toString() + idx + Math.random(),
                    timestamp: new Date(),
                    type: item.event.type as any,
                    message: item.event.msg + (item.event.type === 'TRANSACTION' ? ' (15.000 F)' : ''),
                    user: `User_${Math.floor(Math.random() * 1000)}`,
                    location: item.city,
                    neighborhood: item.hood,
                    amount: item.event.type === 'TRANSACTION' || item.event.type === 'SUB' ? (Math.floor(Math.random() * 50) + 1) * 1000 : undefined
                });

                if (item.event.type !== 'SYSTEM') {
                    const targets = [item.prov.name, item.city, `${item.city}_${item.hood}`];
                    targets.forEach(t => {
                        if (!batchUpdates[t]) batchUpdates[t] = [];
                        batchUpdates[t].push(item.event.bg);
                    });
                }
            });

            // Update Logs (Throttle display if massive)
            setLogs(prev => [...newLogs, ...prev].slice(0, 50)); 
            
            // 3. PROPAGATE HEAT (ATOMIC RESET)
            // Instead of appending, we replace or merge carefully to ensure the latest batch triggers a new cut
            if (Object.keys(batchUpdates).length > 0) {
                setActiveEvents(prev => {
                    const next = { ...prev };
                    Object.entries(batchUpdates).forEach(([key, colors]) => {
                        // We combine previous colors (to show history) with new ones, but cap it at 4 for visuals
                        const prevColors = next[key]?.colors || [];
                        // Combine, keeping most recent at the end, but unique values only for cleaner visual
                        // Actually, duplicate colors might be wanted to show intensity, but let's do unique types first
                        const combined = [...new Set([...prevColors, ...colors])].slice(-4); 
                        
                        next[key] = {
                            colors: combined,
                            timestamp: Date.now() // This forces the re-render/cut
                        };
                    });
                    return next;
                });

                // Auto-cleanup OLD events after 1.5s to fade them out
                setTimeout(() => {
                    setActiveEvents(prev => {
                        const next = { ...prev };
                        let changed = false;
                        const now = Date.now();
                        
                        Object.keys(next).forEach(key => {
                            if (now - next[key].timestamp > 1200) {
                                delete next[key];
                                changed = true;
                            }
                        });
                        
                        return changed ? next : prev;
                    });
                }, 1500); 
            }

        }, 1200);

        return () => clearInterval(interval);
    }, [isPaused, trafficMode]);

    // Navigation Handlers
    const goToProvince = (prov: Province) => {
        setSelectedProvince(prov);
        setViewLevel('province');
        setSelectedCity(null);
    };

    const goToCity = (city: string) => {
        setSelectedCity(city);
        setViewLevel('city');
    };

    const goBack = () => {
        if (viewLevel === 'city') {
            setViewLevel('province');
            setSelectedCity(null);
        } else if (viewLevel === 'province') {
            setViewLevel('national');
            setSelectedProvince(null);
        }
    };

    // Helper for grid rendering
    const renderGrid = () => {
        let items: { id: string, label: string, code?: string }[] = [];
        let clickHandler: (item: any) => void = () => {};
        
        if (viewLevel === 'national') {
            items = GABON_PROVINCES.map(p => ({ id: p.name, label: p.name, code: p.code, obj: p }));
            clickHandler = (item) => goToProvince(item.obj);
        } else if (viewLevel === 'province' && selectedProvince) {
            items = selectedProvince.cities.map(c => ({ id: c, label: c }));
            clickHandler = (item) => goToCity(item.id);
        } else if (viewLevel === 'city' && selectedCity) {
            const hoods = GABON_LOCATIONS[selectedCity] || [];
            
            // --- EMPTY STATE FOR MISSING DATA ---
            if (hoods.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 animate-in fade-in">
                        <MapIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-xs font-bold uppercase">Cartographie en cours</p>
                        <p className="text-[10px]">Aucune subdivision enregistrée.</p>
                    </div>
                );
            }

            items = hoods.map(h => ({ id: `${selectedCity}_${h}`, label: h }));
            clickHandler = () => {}; // Leaf node
        }

        return (
            <div className="grid grid-cols-2 gap-2 lg:gap-3 content-start animate-in zoom-in-95 duration-300">
                {items.map((item) => {
                    const eventData = activeEvents[item.id];
                    const currentColors = eventData?.colors || [];
                    const isActive = currentColors.length > 0;
                    
                    return (
                        <div 
                            key={item.id} 
                            onClick={() => clickHandler(item)}
                            className={cn(
                                "rounded-xl border transition-all duration-300 flex flex-col justify-center relative overflow-hidden group",
                                viewLevel === 'national' ? "h-20 lg:h-24 p-3 lg:p-4 bg-white/5" : "h-14 lg:h-16 p-2 lg:p-3 bg-white/5",
                                isActive ? `border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]` : "border-white/5",
                                clickHandler !== (() => {}) ? "cursor-pointer hover:bg-white/10" : ""
                            )}
                        >
                            <div className="flex justify-between items-start relative z-10 h-full pointer-events-none">
                                <div className="flex flex-col justify-between h-full w-full">
                                    {/* --- 1. SPLIT BAR INDICATOR (Solid Bar divided by N colors) --- */}
                                    <div className="flex h-1.5 w-full mb-1.5 rounded-full overflow-hidden bg-gray-800/50">
                                        {isActive ? (
                                            currentColors.map((color, i) => (
                                                <div key={i} className={cn("h-full flex-1", color)}></div>
                                            ))
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                                        )}
                                    </div>
                                    
                                    <span className={cn("font-bold text-white transition-all line-clamp-2", viewLevel === 'national' ? "text-base" : "text-xs", isActive ? "opacity-100" : "opacity-70")}>
                                        {item.label}
                                        {item.code && <span className="text-[10px] font-mono text-gray-500 ml-1 ml-1 font-normal opacity-70">{item.code}</span>}
                                    </span>
                                </div>
                                {clickHandler.name !== '' && (
                                    <CornerDownRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end absolute right-0 top-0" />
                                )}
                            </div>
                            
                            {/* --- 2. SPLIT BACKGROUND (VERTICAL STRIPES) --- */}
                            {/* ABSOLUTELY NO OVERLAP - USES FLEXBOX */}
                            {isActive && (
                                <div className="absolute inset-0 flex z-0 opacity-20 h-full w-full pointer-events-none">
                                    {currentColors.map((color, i) => (
                                        <div 
                                            // The key includes timestamp to FORCE React to destroy/recreate div, effectively cutting animation
                                            key={`bg-${item.id}-${i}-${eventData.timestamp}`} 
                                            className={cn("h-full flex-1 animate-pulse", color)}
                                            style={{ animationDuration: '800ms' }}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Filter Logs
    const filteredLogs = logs.filter(l => {
        const typeMatch = 
            filter === 'ALL' ? true :
            filter === 'USERS' ? l.type === 'USER_NEW' :
            filter === 'JOBS' ? l.type === 'JOB_NEW' :
            filter === 'FINANCE' ? (l.type === 'TRANSACTION' || l.type === 'SUB') :
            filter === 'SECURITY' ? l.type === 'ALERT' : true;
        
        // Context filter
        let contextMatch = true;
        if (viewLevel === 'province' && selectedProvince) {
            contextMatch = selectedProvince.cities.includes(l.location || '');
        } else if (viewLevel === 'city' && selectedCity) {
            contextMatch = l.location === selectedCity;
        }

        return typeMatch && contextMatch;
    });

    return (
        <div className="space-y-4 lg:space-y-6 animate-in fade-in h-[calc(100vh-140px)] flex flex-col relative">
            
            {/* 1. SERVER HEALTH METRICS */}
            <div className="grid grid-cols-3 gap-2 lg:gap-4 shrink-0">
                <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                    <div>
                        <div className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Latence</div>
                        <div className={cn("text-lg lg:text-2xl font-black font-mono", latency > 150 ? "text-red-500" : "text-gray-900")}>
                            {Math.floor(latency)} ms
                        </div>
                    </div>
                    <div className={cn("p-1.5 lg:p-2 rounded-lg mt-2 lg:mt-0", latency > 150 ? "bg-red-50 text-red-500 animate-pulse" : "bg-green-50 text-green-500")}>
                        <Wifi size={16} className="lg:w-5 lg:h-5" />
                    </div>
                </div>
                <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                    <div>
                        <div className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">En Ligne</div>
                        <div className="text-lg lg:text-2xl font-black font-mono text-gray-900">{activeUsers}</div>
                    </div>
                    <div className="p-1.5 lg:p-2 rounded-lg mt-2 lg:mt-0 bg-blue-50 text-blue-500">
                        <Activity size={16} className="lg:w-5 lg:h-5" />
                    </div>
                </div>
                <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                    <div>
                        <div className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Erreurs</div>
                        <div className={cn("text-lg lg:text-2xl font-black font-mono", errorRate > 2 ? "text-red-500" : "text-green-600")}>
                            {errorRate.toFixed(1)}%
                        </div>
                    </div>
                    <div className={cn("p-1.5 lg:p-2 rounded-lg mt-2 lg:mt-0", errorRate > 2 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400")}>
                        <Server size={16} className="lg:w-5 lg:h-5" />
                    </div>
                </div>
            </div>

            {/* TRAFFIC DENSITY CONTROLS */}
            <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                <button 
                    onClick={() => setTrafficMode('low')}
                    className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5", trafficMode === 'low' ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}
                >
                    <ZapOff size={12} /> Calme
                </button>
                <button 
                    onClick={() => setTrafficMode('medium')}
                    className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5", trafficMode === 'medium' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}
                >
                    <Activity size={12} /> Normal
                </button>
                <button 
                    onClick={() => setTrafficMode('high')}
                    className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5", trafficMode === 'high' ? "bg-white text-red-600 shadow-sm animate-pulse" : "text-gray-500 hover:text-gray-700")}
                >
                    <Zap size={12} /> Intense
                </button>
            </div>

            {/* Mobile Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl lg:hidden shrink-0">
                <button 
                    onClick={() => setMobileView('map')}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", mobileView === 'map' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}
                >
                    <Map size={14} /> Carte Réseau
                </button>
                <button 
                    onClick={() => setMobileView('logs')}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", mobileView === 'logs' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}
                >
                    <List size={14} /> Flux Direct
                </button>
            </div>

            {/* 2. MAIN SPLIT VIEW (MAP & LOGS) */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden">
                
                {/* LEFT: GEOSPATIAL NETWORK GRID */}
                <div className={cn(
                    "w-full lg:w-1/3 bg-[#0F1113] rounded-3xl p-4 lg:p-6 relative overflow-hidden flex flex-col shadow-xl border border-gray-800 transition-all",
                    mobileView === 'map' ? "flex-1 lg:flex-none" : "hidden lg:flex"
                )}>
                    {/* Header Map */}
                    <div className="flex items-center gap-3 mb-4 lg:mb-6 relative z-10">
                        {viewLevel !== 'national' ? (
                            <button 
                                onClick={goBack}
                                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        ) : (
                            <div className="p-2 bg-white/5 rounded-full text-green-500 border border-white/5">
                                <Globe size={18} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-white font-bold text-lg leading-none flex items-center gap-2">
                                {viewLevel === 'national' && "Réseau National"}
                                {viewLevel === 'province' && selectedProvince?.name}
                                {viewLevel === 'city' && selectedCity}
                            </h3>
                            {/* BREADCRUMBS (NEW: INTERACTIVE) */}
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono mt-1 select-none">
                                <button 
                                    onClick={() => { setViewLevel('national'); setSelectedProvince(null); setSelectedCity(null); }}
                                    className={cn("hover:text-white transition-colors", viewLevel === 'national' ? "text-green-500 font-bold pointer-events-none" : "")}
                                >
                                    GAB
                                </button>
                                {viewLevel !== 'national' && (
                                    <>
                                        <ChevronRight size={10} />
                                        <button 
                                            onClick={() => { setViewLevel('province'); setSelectedCity(null); }}
                                            className={cn("hover:text-white transition-colors", viewLevel === 'province' ? "text-green-500 font-bold pointer-events-none" : "")}
                                        >
                                            {selectedProvince?.code}
                                        </button>
                                    </>
                                )}
                                {viewLevel === 'city' && (
                                    <>
                                        <ChevronRight size={10} />
                                        <span className="text-green-500 font-bold pointer-events-none">{selectedCity?.substring(0, 3).toUpperCase()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Grid Content */}
                    <div className="flex-1 relative z-10 overflow-y-auto lg:overflow-visible no-scrollbar">
                        {renderGrid()}
                    </div>
                    
                    {/* Footer Legend */}
                    <div className="mt-auto pt-4 border-t border-gray-800 shrink-0">
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-400 font-mono mb-2">
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div> User Login</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Transaction</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> New Job</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Alert</div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                            <span>Status: {trafficMode.toUpperCase()} Traffic</span>
                            <span>Region: {viewLevel.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: EVENT STREAM (Toggleable on Mobile) */}
                <div className={cn(
                    "flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all",
                    mobileView === 'logs' ? "flex" : "hidden lg:flex"
                )}>
                    {/* Stream Header */}
                    <div className="p-3 lg:p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
                            {selectedCity && (
                                <div className="px-3 py-1 rounded-lg bg-black text-white text-xs font-bold flex items-center gap-1 shrink-0 animate-in fade-in">
                                    <MapPin size={10} /> {selectedCity}
                                </div>
                            )}
                            <button onClick={() => setFilter('ALL')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'ALL' ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-200")}>Tout</button>
                            <button onClick={() => setFilter('USERS')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'USERS' ? "bg-blue-100 text-blue-800" : "text-gray-500 hover:bg-gray-200")}>Utilisateurs</button>
                            <button onClick={() => setFilter('JOBS')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'JOBS' ? "bg-orange-100 text-orange-800" : "text-gray-500 hover:bg-gray-200")}>Missions</button>
                            <button onClick={() => setFilter('FINANCE')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'FINANCE' ? "bg-green-100 text-green-800" : "text-gray-500 hover:bg-gray-200")}>Finance</button>
                            <button onClick={() => setFilter('SECURITY')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'SECURITY' ? "bg-red-100 text-red-800" : "text-gray-500 hover:bg-gray-200")}>Sécurité</button>
                        </div>
                        <button onClick={() => setIsPaused(!isPaused)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600 shrink-0">
                            {isPaused ? <Play size={18} className="fill-current"/> : <Pause size={18} className="fill-current"/>}
                        </button>
                    </div>

                    {/* Stream Logs */}
                    <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1 bg-white">
                        {filteredLogs.map(log => (
                            <div 
                                key={log.id} 
                                onClick={() => setSelectedLog(log)}
                                className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors group border-b border-gray-50 last:border-0 cursor-pointer animate-in slide-in-from-right-2 duration-300"
                            >
                                <span className="text-gray-400 min-w-[50px] lg:min-w-[60px]">{log.timestamp.toLocaleTimeString()}</span>
                                
                                <div className={cn(
                                    "px-1.5 py-0.5 rounded text-[9px] font-bold w-20 text-center shrink-0 border",
                                    log.type === 'TRANSACTION' ? "bg-green-50 text-green-700 border-green-200" :
                                    log.type === 'ALERT' ? "bg-red-50 text-red-700 border-red-200" :
                                    log.type === 'USER_NEW' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    log.type === 'JOB_NEW' ? "bg-orange-50 text-orange-700 border-orange-200" :
                                    log.type === 'SUB' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                    "bg-gray-100 text-gray-600"
                                )}>
                                    {log.type.replace('_', ' ')}
                                </div>

                                <div className="flex-1 text-gray-700 truncate flex items-center gap-2 min-w-0">
                                    <span className="truncate font-medium">{log.message}</span>
                                    {log.location && (
                                        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded hidden sm:inline-block border border-gray-200">
                                            {log.neighborhood ? log.neighborhood : log.location}
                                        </span>
                                    )}
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500" />
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                                <Activity size={24} className="mb-2 opacity-20" />
                                <span>En attente d'événements...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DETAIL MODAL (Tower Control Inspector) */}
            {selectedLog && (
                <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
            )}
        </div>
    );
};

const SettingsContent = () => <div className="text-center py-20 text-gray-400">Paramètres Système</div>;

// --- SIDEBAR COMPONENT ---
const Sidebar: React.FC<{ activeTab: AdminTab, onTabChange: (t: AdminTab) => void, isMobileMenuOpen: boolean, onCloseMobileMenu: () => void, onLogout: () => void, counts: any }> = ({ activeTab, onTabChange, isMobileMenuOpen, onCloseMobileMenu, onLogout, counts }) => {
    const menu = [
        { id: 'overview', icon: LayoutDashboard, label: 'Vue Stratégique' },
        { id: 'live', icon: Radio, label: 'Live Monitor', badge: counts.logs > 0 ? counts.logs : 0, badgeColor: 'bg-red-500' },
        { id: 'users', icon: Users, label: 'Utilisateurs' },
        { id: 'jobs', icon: Briefcase, label: 'Missions' },
        { id: 'ads', icon: Megaphone, label: 'Publicités' },
        { id: 'disputes', icon: Scale, label: 'Tribunal', badge: counts.disputes, badgeColor: 'bg-red-500' },
        { id: 'finance', icon: Wallet, label: 'Finance', badge: counts.withdrawals, badgeColor: 'bg-yellow-500' },
        { id: 'communication', icon: Send, label: 'Diffusion' },
        { id: 'settings', icon: Settings, label: 'Paramètres' },
    ];

    return (
        <>
            <aside className={cn("bg-[#1A1C1E] text-white w-64 flex-col fixed inset-y-0 z-40 transition-transform transform lg:translate-x-0 lg:static lg:h-screen shadow-xl lg:shadow-none", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <ShieldCheck className="text-jobgreen" /> ADMIN
                    </div>
                    <button onClick={onCloseMobileMenu} className="lg:hidden text-gray-400 hover:text-white"><X size={24}/></button>
                </div>
                <div className="px-4 pb-4">
                    <div className="bg-[#2A2D31] rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-jobgreen text-black flex items-center justify-center font-bold">AD</div>
                        <div>
                            <div className="text-sm font-bold text-white">Super Admin</div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> En ligne</div>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar">
                    {menu.map(item => (
                        <button key={item.id} onClick={() => { onTabChange(item.id as AdminTab); onCloseMobileMenu(); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold relative group", activeTab === item.id ? "bg-jobgreen text-black shadow-lg shadow-green-900/20" : "text-gray-400 hover:bg-white/5 hover:text-white")}>
                            <item.icon size={20} className={activeTab === item.id ? "text-black" : "text-gray-500 group-hover:text-white"} />
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className={cn("absolute right-4 text-[10px] text-white px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-black", item.badgeColor)}>{item.badge}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={onLogout} 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-bold cursor-pointer active:scale-95"
                    >
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
export const AdminDashboard: React.FC = () => {
    const { logout } = useUser();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Global Alerts State (Lifted Up)
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);

    // Dynamic Counts based on current state
    const counts = {
        logs: 12, // Still mock for live logs
        disputes: alerts.filter(a => a.type === 'dispute').length, // Dynamic
        withdrawals: alerts.filter(a => a.type === 'finance').length + 4 // Dynamic + base
    };

    const handleLogout = () => {
        logout();
    };

    const dismissAlert = (id: number) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="flex h-screen bg-[#F0F2F5] overflow-hidden font-sans">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={() => setIsMobileMenuOpen(false)} onLogout={handleLogout} counts={counts} />
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
            <div className="flex-1 flex flex-col h-full min-w-0">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4"><button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full relative"><Menu size={24} />{(counts.disputes + counts.withdrawals + counts.logs) > 0 && (<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>)}</button><h2 className="text-xl font-black text-gray-900 capitalize hidden sm:block">{activeTab === 'overview' ? 'Vue Stratégique' : activeTab}</h2></div>
                    <div className="flex items-center gap-3"><button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 relative"><Bell size={20} className="text-gray-500" /><span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span></button></div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {activeTab === 'overview' && <OverviewContent onNavigate={setActiveTab} alerts={alerts} onDismissAlert={dismissAlert} />}
                    {activeTab === 'jobs' && <JobsContent />}
                    {activeTab === 'ads' && <AdsContent />}
                    {activeTab === 'disputes' && <DisputesContent />}
                    {activeTab === 'users' && <UsersContent />}
                    {activeTab === 'finance' && <FinanceContent />}
                    {activeTab === 'communication' && <CommunicationContent />}
                    {activeTab === 'live' && <LiveContent />}
                    {activeTab === 'settings' && <SettingsContent />}
                </main>
            </div>
        </div>
    );
};
