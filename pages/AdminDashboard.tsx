
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Radio, Users, Briefcase, Megaphone, Scale, Wallet, Send, Settings, 
    ShieldCheck, X, LogOut, Menu, Bell, Search, Filter, MoreHorizontal, AlertTriangle, 
    ArrowUpRight, ArrowDownRight, CheckCircle2, AlertOctagon, UserPlus, Zap, Lock, ChevronRight,
    Fingerprint, Mail, Phone, Ban, Check, UserCheck, Eye, Activity, Server, Wifi, Pause, Play, Globe, Database,
    Map, List, CreditCard, Crosshair, Terminal, RefreshCw, ArrowLeft, MapPin, CornerDownRight, Home, Map as MapIcon,
    BarChart2, ZapOff, Crown, Calendar, FileText, Smartphone, AlertCircle, Star, MessageSquare, Mic, DollarSign, Clock, History, FileWarning, ArrowDownLeft
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { cn, formatMoney } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { MOCK_USERS, GABON_LOCATIONS, GABON_CITIES, GABON_PROVINCES, Province } from '../constants';
import { User } from '../types';
import { ChatList } from '../components/messages/ChatList';
import { ChatDetail } from '../components/messages/ChatDetail';

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

// --- EXTENDED TYPES FOR ADMIN ---
type ActionDuration = '1h' | '12h' | '24h' | '3d' | '7d' | '30d' | 'permanent';
type AdminActionType = 'BAN_ACCOUNT' | 'MUTE_CHAT' | 'BLOCK_POSTING' | 'FREEZE_FUNDS' | 'GIFT_PREMIUM' | 'REVOKE_PREMIUM';

interface ActionConfig {
    type: AdminActionType;
    label: string;
    icon: any;
    color: string; // Tailwind color class base (e.g. 'red', 'blue')
    isPositive?: boolean;
    templates?: string[]; // Quick reasons
}

// --- CONFIG ACTIONS WITH TEMPLATES ---
const ACTION_TEMPLATES: Record<AdminActionType, string[]> = {
    'BAN_ACCOUNT': ['Arnaque avérée', 'Faux Profil', 'Harcèlement grave', 'Non-respect CGU'],
    'MUTE_CHAT': ['Insultes', 'Spam messagerie', 'Langage inapproprié', 'Conflit en cours'],
    'BLOCK_POSTING': ['Spam d\'annonces', 'Contenu interdit', 'Doublons multiples', 'Publicité externe'],
    'FREEZE_FUNDS': ['Suspicion blanchiment', 'Litige en cours', 'Vérification identité requise'],
    'GIFT_PREMIUM': ['Geste commercial', 'Récompense Top User', 'Test Admin'],
    'REVOKE_PREMIUM': ['Fin de période', 'Paiement échoué', 'Abus des avantages']
};

// --- LIVE MONITOR TYPES ---
interface SystemLog {
    id: string;
    timestamp: Date;
    type: 'USER_NEW' | 'TRANSACTION' | 'JOB_NEW' | 'ALERT' | 'SUB' | 'SYSTEM';
    message: string;
    user?: string;
    location?: string;
    neighborhood?: string;
    amount?: number;
    meta?: any;
}

// --- MOCK SUB-COMPONENTS ---

interface OverviewProps {
    onNavigate: (tab: AdminTab) => void;
    alerts: typeof INITIAL_ALERTS;
    onDismissAlert: (id: number) => void;
}

const OverviewContent = ({ onNavigate, alerts, onDismissAlert }: OverviewProps) => {
    // ... (Keep existing implementation of OverviewContent) ...
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    
    const currentData = DATA_SETS[timeRange];
    const currentKPIs = KPI_DATA[timeRange];
    
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

            {/* 1. KPIs STRATÉGIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => onNavigate('users')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-95">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Users size={22} /></div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700"><ArrowUpRight size={14} className="mr-1"/> {currentKPIs.usersTrend}</div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1 transition-all duration-300">{timeRange === '7d' ? '1 240' : timeRange === '30d' ? '1 385' : '1 690'}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Inscrits</div>
                    <div className="text-[10px] text-gray-400 font-medium flex gap-2 items-center"><span>+{currentKPIs.users} nouveaux</span></div>
                </div>
                <div onClick={() => onNavigate('finance')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-95">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><Wallet size={22} /></div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700"><ArrowUpRight size={14} className="mr-1"/> {currentKPIs.volumeTrend}</div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{currentKPIs.volume} F</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Volume d'Affaires</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center">Commissions: <span className="text-green-600 font-bold ml-1">~8%</span></div>
                </div>
                <div onClick={() => onNavigate('finance')} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-95">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-yellow-50 text-yellow-700 group-hover:bg-jobgold group-hover:text-white transition-colors"><Lock size={22} /></div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">Sécurité</div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{timeRange === '7d' ? '850k' : '2.1M'} F</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Fonds Bloqués</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center">En attente de validation</div>
                </div>
                <div onClick={() => onNavigate('disputes')} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group bg-red-50/30 cursor-pointer active:scale-95">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors"><AlertOctagon size={22} /></div>
                        <div className="flex items-center text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 animate-pulse">Action</div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{alerts.length}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Alertes Actives</div>
                    <div className="text-[10px] text-red-600 font-bold flex items-center">{disputeCount > 0 ? `${disputeCount} litiges critiques` : "Système stable"}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. GRAPHIQUE FINANCIER */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <div><h3 className="font-black text-gray-900 text-lg">Flux Financiers</h3><p className="text-xs text-gray-500">Volume Global vs Fonds sous Séquestre</p></div>
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
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} formatter={(value: number) => formatMoney(value) + ' F'} />
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
                                    <Pie data={USER_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {USER_DISTRIBUTION.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-gray-900">1240</span>
                                <span className="text-[10px] text-gray-400 uppercase">Comptes</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-800"></div><div className="text-xs font-bold text-gray-700">Clients (68%)</div></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-jobgreen"></div><div className="text-xs font-bold text-gray-700">Pros (32%)</div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. ACTIONS URGENTES */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> Actions Requises Immédiates</h3>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full transition-all", alerts.length > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>{alerts.length > 0 ? `${alerts.length} items` : "Tout est calme"}</span>
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
                                    <button onClick={() => onDismissAlert(alert.id)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-jobgreen hover:text-white hover:border-jobgreen transition-colors">Traiter</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- USERS CONTENT (CONTROL TOWER) ---

// -- HELPER: Action Modal for Duration --
const ActionConfigModal = ({ 
    isOpen, 
    onClose, 
    action, 
    onConfirm 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    action: ActionConfig | null; 
    onConfirm: (duration: ActionDuration, reason?: string) => void; 
}) => {
    const [duration, setDuration] = useState<ActionDuration>('24h');
    const [reason, setReason] = useState('');

    if (!isOpen || !action) return null;

    const durations: { label: string, value: ActionDuration }[] = [
        { label: '1 Heure', value: '1h' },
        { label: '12 Heures', value: '12h' },
        { label: '24 Heures', value: '24h' },
        { label: '3 Jours', value: '3d' },
        { label: '1 Semaine', value: '7d' },
        { label: '1 Mois', value: '30d' },
        { label: 'Permanent', value: 'permanent' },
    ];

    const templates = ACTION_TEMPLATES[action.type] || [];

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe flex flex-col">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                <div className="text-center mb-6">
                    <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg", `bg-${action.color}-100 text-${action.color}-600`)}>
                        <action.icon size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">{action.label}</h3>
                    <p className="text-sm text-gray-500 font-medium">Configurez la durée et le motif.</p>
                </div>

                <div className="space-y-4 mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase">Durée</label>
                    <div className="grid grid-cols-3 gap-2">
                        {durations.map(d => (
                            <button
                                key={d.value}
                                onClick={() => setDuration(d.value)}
                                className={cn(
                                    "py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                                    duration === d.value 
                                        ? `bg-${action.color}-500 text-white border-${action.color}-500 shadow-md` 
                                        : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                                )}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                    
                    <label className="text-xs font-bold text-gray-400 uppercase block mt-2">Motif (Requis)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {templates.map(tpl => (
                            <button 
                                key={tpl} 
                                onClick={() => setReason(tpl)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors",
                                    reason === tpl ? `bg-${action.color}-50 text-${action.color}-700 border-${action.color}-200` : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                                )}
                            >
                                {tpl}
                            </button>
                        ))}
                    </div>
                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Précisez le motif..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-gray-200 min-h-[80px]"
                        rows={2}
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onClose} className="flex-1">Annuler</Button>
                    <Button 
                        onClick={() => onConfirm(duration, reason)}
                        disabled={!reason}
                        className={cn(
                            "flex-[2] h-12 shadow-lg text-white",
                            `bg-${action.color}-600 hover:bg-${action.color}-700 shadow-${action.color}-200`
                        )}
                    >
                        Confirmer
                    </Button>
                </div>
            </div>
        </div>
    );
};

const UserInspectorPanel = ({ user, onClose, onUpdateUser, onContact }: { user: User, onClose: () => void, onUpdateUser: (id: string, updates: Partial<User>) => void, onContact: () => void }) => {
    // Generate mock detailed data
    const joinDate = new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString();
    const lastLogin = "Il y a 2 heures";
    const device = "iPhone 14 Pro (iOS 17.2)";
    const ip = "102.16.44.12"; // Mock IP
    const isSuspiciousIP = false; // Mock logic

    // Panel Internal State
    const [tab, setTab] = useState<'profile' | 'controls' | 'history' | 'forensics'>('profile');
    
    // Action Modal State
    const [activeAction, setActiveAction] = useState<ActionConfig | null>(null);

    // Mock Permissions (In real app, this would be in User object)
    const [permissions, setPermissions] = useState({
        canChat: true,
        canPost: true,
        canWithdraw: true,
    });

    const handleActionTrigger = (action: ActionConfig) => {
        setActiveAction(action);
    };

    const handleActionConfirm = (duration: ActionDuration, reason?: string) => {
        if (!activeAction) return;

        // Apply logic based on action type
        switch (activeAction.type) {
            case 'BAN_ACCOUNT':
                onUpdateUser(user.id, { available: false });
                break;
            case 'MUTE_CHAT':
                setPermissions(p => ({ ...p, canChat: false }));
                break;
            case 'BLOCK_POSTING':
                setPermissions(p => ({ ...p, canPost: false }));
                break;
            case 'FREEZE_FUNDS':
                setPermissions(p => ({ ...p, canWithdraw: false }));
                break;
            case 'GIFT_PREMIUM':
                onUpdateUser(user.id, { isPremium: true, tier: 'premium' });
                break;
            case 'REVOKE_PREMIUM':
                onUpdateUser(user.id, { isPremium: false, tier: 'standard' });
                break;
        }

        // Close modal
        setActiveAction(null);
    };

    // Toggle back permissions directly (Restore access)
    const restorePermission = (key: keyof typeof permissions) => {
        if (confirm("Rétablir l'accès immédiatement ?")) {
            setPermissions(p => ({ ...p, [key]: true }));
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[60] animate-in slide-in-from-right duration-300 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-start mb-6">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onContact} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1">
                            <MessageSquare size={14} /> Contacter
                        </button>
                        <button onClick={() => onUpdateUser(user.id, { isVerified: !user.isVerified })} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1", user.isVerified ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-500")}>
                            <ShieldCheck size={14} /> {user.isVerified ? "Vérifié" : "Non Vérifié"}
                        </button>
                        <div className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1", !user.available ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-100 border-gray-200 text-gray-600")}>
                            {user.available === false ? "Banni" : "Actif"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src={user.avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg" />
                        {user.role === 'pro' && (
                            <div className="absolute -bottom-2 -right-2 bg-black text-white px-2 py-0.5 rounded text-[10px] font-black uppercase border-2 border-white">
                                PRO
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 leading-tight">{user.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">ID: {user.id}</span>
                            <span>•</span>
                            <span>{user.location || 'Libreville'}</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                            {user.isPremium && <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-[10px] font-bold border border-yellow-200 flex items-center gap-1"><Crown size={10} fill="currentColor"/> Premium</span>}
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 flex items-center gap-1"><Star size={10} fill="currentColor"/> {user.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-100 bg-white">
                <button onClick={() => setTab('profile')} className={cn("flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wide border-b-2 transition-colors", tab === 'profile' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600")}>Profil</button>
                <button onClick={() => setTab('forensics')} className={cn("flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wide border-b-2 transition-colors", tab === 'forensics' ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600")}>Enquête</button>
                <button onClick={() => setTab('controls')} className={cn("flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wide border-b-2 transition-colors", tab === 'controls' ? "border-red-500 text-red-600" : "border-transparent text-gray-400 hover:text-gray-600")}>Contrôle</button>
                <button onClick={() => setTab('history')} className={cn("flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wide border-b-2 transition-colors", tab === 'history' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600")}>Logs</button>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA]">
                
                {/* --- TAB 1: PROFIL (READ ONLY) --- */}
                {tab === 'profile' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4">
                        <div className="space-y-3">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Wallet size={14} /> Santé Financière
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-xl border border-gray-200">
                                    <div className="text-[10px] text-gray-500 mb-1">Portefeuille Cash</div>
                                    <div className="text-xl font-black text-gray-900">{formatMoney(user.wealth)} F</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-200">
                                    <div className="text-[10px] text-orange-600 mb-1">Crédits Bronze</div>
                                    <div className="text-xl font-black text-orange-800">{user.bronzeCoins} Pts</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Fingerprint size={14} /> Sécurité & Connexion
                            </h3>
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-xs">
                                <div className="flex justify-between p-3 border-b border-gray-100">
                                    <span className="text-gray-500">Membre depuis</span>
                                    <span className="font-bold text-gray-900">{joinDate}</span>
                                </div>
                                <div className="flex justify-between p-3 border-b border-gray-100">
                                    <span className="text-gray-500">Dernière activité</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {lastLogin}</span>
                                </div>
                                <div className="flex justify-between p-3 border-b border-gray-100">
                                    <span className="text-gray-500">Appareil</span>
                                    <span className="font-bold text-gray-900 flex items-center gap-1"><Smartphone size={12}/> {device}</span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-gray-500">IP (Gabon)</span>
                                    <span className={cn("font-mono font-bold", isSuspiciousIP ? "text-red-500" : "text-gray-600")}>{ip} {isSuspiciousIP && "⚠️"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 2: FORENSICS (NEW) --- */}
                {tab === 'forensics' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                            <FileWarning className="text-blue-600 shrink-0" size={20} />
                            <div className="text-xs text-blue-800">
                                <span className="font-bold">Analyse de risque : FAIBLE.</span> L'utilisateur a un comportement financier stable. Aucune alerte de blanchiment.
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                <Activity size={14} /> Flux Financiers (7j)
                            </h3>
                            {/* Mock Financial List */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                {[
                                    { id: 1, type: 'in', amount: 15000, label: 'Paiement Séquestre', date: 'Auj. 10:00' },
                                    { id: 2, type: 'out', amount: 5000, label: 'Retrait Airtel', date: 'Hier 14:30' },
                                    { id: 3, type: 'in', amount: 25000, label: 'Rechargement', date: '12 Oct' },
                                    { id: 4, type: 'out', amount: 2000, label: 'Achat Boost', date: '10 Oct' },
                                ].map((tx) => (
                                    <div key={tx.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0 text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", tx.type === 'in' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                                                {tx.type === 'in' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{tx.label}</div>
                                                <div className="text-[10px] text-gray-400">{tx.date}</div>
                                            </div>
                                        </div>
                                        <div className={cn("font-mono font-bold", tx.type === 'in' ? "text-green-600" : "text-gray-900")}>
                                            {tx.type === 'in' ? '+' : '-'}{formatMoney(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 3: CONTROLS (GRANULAR PERMISSIONS) --- */}
                {tab === 'controls' && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        
                        {/* 1. Global Status */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 text-sm">Accès Global</h3>
                                <div className={cn("w-2 h-2 rounded-full", user.available !== false ? "bg-green-500" : "bg-red-500")}></div>
                            </div>
                            {user.available !== false ? (
                                <button 
                                    onClick={() => handleActionTrigger({ type: 'BAN_ACCOUNT', label: 'Bannir le Compte', icon: Ban, color: 'red' })}
                                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Ban size={16} /> Suspendre / Bannir
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onUpdateUser(user.id, { available: true })}
                                    className="w-full py-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold border border-green-100 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16} /> Réactiver le Compte
                                </button>
                            )}
                        </div>

                        {/* 2. Granular Permissions */}
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Permissions & Restrictions</h3>
                            <div className="space-y-2">
                                {/* Chat */}
                                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg", permissions.canChat ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400")}><MessageSquare size={18} /></div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Messagerie</div>
                                            <div className="text-[10px] text-gray-500">{permissions.canChat ? "Autorisé" : "Mute (Lecture seule)"}</div>
                                        </div>
                                    </div>
                                    {permissions.canChat ? (
                                        <button onClick={() => handleActionTrigger({ type: 'MUTE_CHAT', label: 'Couper le Chat', icon: MessageSquare, color: 'orange' })} className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">Mute</button>
                                    ) : (
                                        <button onClick={() => restorePermission('canChat')} className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">Rétablir</button>
                                    )}
                                </div>

                                {/* Posting */}
                                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg", permissions.canPost ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-400")}><Mic size={18} /></div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Publication</div>
                                            <div className="text-[10px] text-gray-500">{permissions.canPost ? "Autorisé" : "Bloqué (Anti-spam)"}</div>
                                        </div>
                                    </div>
                                    {permissions.canPost ? (
                                        <button onClick={() => handleActionTrigger({ type: 'BLOCK_POSTING', label: 'Bloquer les Posts', icon: Mic, color: 'red' })} className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Bloquer</button>
                                    ) : (
                                        <button onClick={() => restorePermission('canPost')} className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">Rétablir</button>
                                    )}
                                </div>

                                {/* Funds */}
                                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg", permissions.canWithdraw ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400")}><DollarSign size={18} /></div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Retraits</div>
                                            <div className="text-[10px] text-gray-500">{permissions.canWithdraw ? "Autorisé" : "Gelé (Fraude suspectée)"}</div>
                                        </div>
                                    </div>
                                    {permissions.canWithdraw ? (
                                        <button onClick={() => handleActionTrigger({ type: 'FREEZE_FUNDS', label: 'Geler les Fonds', icon: Lock, color: 'red' })} className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Geler</button>
                                    ) : (
                                        <button onClick={() => restorePermission('canWithdraw')} className="text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">Débloquer</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Subscriptions & Bonuses */}
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Gratifications</h3>
                            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-lg", user.isPremium ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-400")}><Crown size={20} fill={user.isPremium ? "currentColor" : "none"} /></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Abonnement Premium</div>
                                        <div className="text-[10px] text-gray-500">{user.isPremium ? "Actif (Payant/Offert)" : "Inactif"}</div>
                                    </div>
                                </div>
                                {user.isPremium ? (
                                    <button onClick={() => handleActionTrigger({ type: 'REVOKE_PREMIUM', label: 'Révoquer Premium', icon: Crown, color: 'gray' })} className="text-xs font-bold text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Arrêter</button>
                                ) : (
                                    <button onClick={() => handleActionTrigger({ type: 'GIFT_PREMIUM', label: 'Offrir Premium', icon: Crown, color: 'yellow', isPositive: true })} className="text-xs font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-200 shadow-sm">Offrir</button>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* --- TAB 4: HISTORY (AUDIT TRAIL) --- */}
                {tab === 'history' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <History size={14} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Dernières Actions Admin</span>
                        </div>
                        
                        {/* Mock History Items */}
                        {[
                            { action: 'Mute Chat (24h)', admin: 'Admin Sarah', date: 'Auj. 14:30', reason: 'Insultes signalées', color: 'orange' },
                            { action: 'Validation KYC', admin: 'System AI', date: 'Hier 09:12', reason: 'Score > 80%', color: 'green' },
                            { action: 'Avertissement', admin: 'Admin Marc', date: '12 Oct', reason: 'Spam offre', color: 'blue' },
                        ].map((log, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3">
                                <div className={`w-1 h-full rounded-full bg-${log.color}-500 shrink-0`}></div>
                                <div>
                                    <div className="flex justify-between items-start w-full">
                                        <div className="text-xs font-bold text-gray-900">{log.action}</div>
                                        <div className="text-[9px] text-gray-400 ml-4 whitespace-nowrap">{log.date}</div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">Par <span className="font-medium text-gray-700">{log.admin}</span></div>
                                    {log.reason && <div className="text-[10px] text-gray-400 italic mt-1">"{log.reason}"</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Action Config Modal */}
            <ActionConfigModal 
                isOpen={!!activeAction} 
                onClose={() => setActiveAction(null)} 
                action={activeAction} 
                onConfirm={handleActionConfirm} 
            />
        </div>
    );
};

// ... (KEEP USERSCONTENT AND MAIN DASHBOARD EXPORT AS IS) ...
const UsersContent = ({ onNavigate, onContactUser }: { onNavigate: (tab: AdminTab) => void, onContactUser: (user: User) => void }) => {
    // ... (Keep existing implementation)
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'pro'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'premium' | 'banned'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Compute stats
    const stats = useMemo(() => ({
        total: users.length,
        premium: users.filter(u => u.isPremium).length,
        verified: users.filter(u => u.isVerified).length,
        banned: users.filter(u => u.available === false).length
    }), [users]);

    // Filter logic
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        let matchesStatus = true;
        if (statusFilter === 'verified') matchesStatus = u.isVerified;
        if (statusFilter === 'premium') matchesStatus = !!u.isPremium;
        if (statusFilter === 'banned') matchesStatus = u.available === false;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleUpdateUser = (id: string, updates: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        if (selectedUser && selectedUser.id === id) {
            setSelectedUser(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleContactClick = () => {
        if (selectedUser) {
            onContactUser(selectedUser);
            setSelectedUser(null);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"><div><div className="text-[10px] font-bold text-gray-400 uppercase">Utilisateurs</div><div className="text-2xl font-black text-gray-900">{stats.total}</div></div><div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"><Users size={20}/></div></div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"><div><div className="text-[10px] font-bold text-gray-400 uppercase">Premium</div><div className="text-2xl font-black text-gray-900">{stats.premium}</div></div><div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600"><Crown size={20}/></div></div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"><div><div className="text-[10px] font-bold text-gray-400 uppercase">Vérifiés KYC</div><div className="text-2xl font-black text-gray-900">{stats.verified}</div></div><div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><ShieldCheck size={20}/></div></div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"><div><div className="text-[10px] font-bold text-gray-400 uppercase">Suspendus</div><div className="text-2xl font-black text-red-600">{stats.banned}</div></div><div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600"><AlertCircle size={20}/></div></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" placeholder="Rechercher par nom, ville, ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl outline-none focus:border-gray-900">
                        <option value="all">Tous Rôles</option><option value="client">Clients</option><option value="pro">Prestataires</option>
                    </select>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl outline-none focus:border-gray-900">
                        <option value="all">Tout Statut</option><option value="verified">Vérifiés</option><option value="premium">Premium</option><option value="banned">Bannis</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-3xl border border-gray-200 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredUsers.map(u => (
                        <div key={u.id} onClick={() => setSelectedUser(u)} className={cn("group relative p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-4 bg-white", u.available === false ? "border-red-200 bg-red-50/10" : u.isPremium ? "border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20" : "border-gray-100 hover:border-gray-300")}>
                            <div className="relative">
                                <img src={u.avatar} className={cn("w-14 h-14 rounded-xl object-cover bg-gray-100", u.available === false && "grayscale opacity-70")} />
                                {u.isVerified && <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white"><Check size={8} strokeWidth={4} /></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start"><h3 className="font-bold text-gray-900 truncate pr-2">{u.name}</h3>{u.role === 'pro' && <span className="text-[9px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">PRO</span>}</div>
                                <div className="text-xs text-gray-500 truncate mb-1.5">{u.location || 'N/A'}</div>
                                <div className="flex items-center gap-2">
                                    {u.isPremium && <span className="text-[9px] font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded border border-yellow-200 flex items-center gap-0.5"><Crown size={8} fill="currentColor"/> PRO</span>}
                                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 flex items-center gap-0.5"><Wallet size={8}/> {formatMoney(u.wealth)}</span>
                                    {u.available === false && <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">BAN</span>}
                                </div>
                            </div>
                            <ChevronRight className="text-gray-300 group-hover:text-gray-900 transition-colors" size={18} />
                        </div>
                    ))}
                </div>
                {filteredUsers.length === 0 && <div className="h-full flex flex-col items-center justify-center text-gray-400"><Users size={48} className="mb-4 opacity-20" /><p>Aucun utilisateur trouvé.</p></div>}
            </div>

            {selectedUser && <UserInspectorPanel user={selectedUser} onClose={() => setSelectedUser(null)} onUpdateUser={handleUpdateUser} onContact={handleContactClick} />}
        </div>
    );
};

const JobsContent = () => <div className="text-center py-20 text-gray-400">Gestion des Missions</div>;
const AdsContent = () => <div className="text-center py-20 text-gray-400">Gestion Publicité</div>;
const DisputesContent = () => <div className="text-center py-20 text-gray-400">Gestion Litiges</div>;
const FinanceContent = () => <div className="text-center py-20 text-gray-400">Gestion Finance</div>;

const CommunicationContent = ({ onBackToPrev }: { onBackToPrev?: () => void }) => {
    const { activeConversationId, setActiveConversationId, conversations } = useUser();
    const activeConv = activeConversationId ? conversations.find(c => c.id === activeConversationId) : null;

    if (activeConv) {
        return (
            <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm relative">
                <ChatDetail 
                    conversation={activeConv} 
                    onBack={() => {
                        setActiveConversationId(null);
                        if (onBackToPrev) onBackToPrev();
                    }} 
                    className="absolute inset-0 z-0 h-full w-full" 
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <ChatList onSelect={(c) => setActiveConversationId(c.id)} />
        </div>
    );
};

const SettingsContent = () => <div className="text-center py-20 text-gray-400">Paramètres Système</div>;

// --- RESTORED LIVE CONTENT (Live Monitor) ---
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
    const [activeEvents, setActiveEvents] = useState<Record<string, { colors: string[], timestamp: number }>>({});

    // Mock Real-time Feed
    useEffect(() => {
        const interval = setInterval(() => {
            if (isPaused) return;

            setLatency(prev => Math.max(20, Math.min(200, prev + (Math.random() - 0.5) * 20)));
            setActiveUsers(prev => Math.max(100, prev + Math.floor((Math.random() - 0.5) * 5)));
            setErrorRate(prev => Math.max(0, Math.min(5, prev + (Math.random() - 0.6) * 0.1)));

            // --- MASSIVE BATCH GENERATION LOGIC ---
            let batchCount = 1;
            if (trafficMode === 'medium') batchCount = Math.floor(Math.random() * 5) + 3; // 3-8 events
            if (trafficMode === 'high') batchCount = Math.floor(Math.random() * 20) + 15; // 15-35 events (Simulated chaos)

            const newLogs: SystemLog[] = [];
            const batchUpdates: Record<string, string[]> = {};

            const eventTypes = [
                { type: 'USER_NEW', prob: 0.2, msg: 'Nouvelle inscription', color: 'text-blue-500', bg: 'bg-blue-500' },
                { type: 'TRANSACTION', prob: 0.3, msg: 'Paiement Séquestre', color: 'text-green-500', bg: 'bg-green-500' },
                { type: 'JOB_NEW', prob: 0.2, msg: 'Nouvelle Annonce', color: 'text-orange-500', bg: 'bg-orange-500' },
                { type: 'ALERT', prob: 0.05, msg: 'Tentative Fraude IP', color: 'text-red-500', bg: 'bg-red-500' },
                { type: 'SUB', prob: 0.1, msg: 'Abonnement Premium', color: 'text-purple-500', bg: 'bg-purple-500' },
                { type: 'SYSTEM', prob: 0.15, msg: 'API Latency Spike', color: 'text-gray-400', bg: 'bg-gray-500' }
            ];

            const selectedLocations: { prov: Province, city: string, hood: string, event: typeof eventTypes[0] }[] = [];

            // If High Traffic, pick ONE specific location and bombard it
            if (trafficMode === 'high' && Math.random() > 0.5) {
                const hotspotProv = GABON_PROVINCES[Math.floor(Math.random() * GABON_PROVINCES.length)];
                if (hotspotProv.cities.length > 0) {
                    const hotspotCity = hotspotProv.cities[0];
                    const hotspotHood = (GABON_LOCATIONS[hotspotCity] || ['Centre'])[0];
                    
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

            setLogs(prev => [...newLogs, ...prev].slice(0, 50)); 
            
            if (Object.keys(batchUpdates).length > 0) {
                setActiveEvents(prev => {
                    const next = { ...prev };
                    Object.entries(batchUpdates).forEach(([key, colors]) => {
                        const prevColors = next[key]?.colors || [];
                        const combined = [...new Set([...prevColors, ...colors])].slice(-4); 
                        next[key] = { colors: combined, timestamp: Date.now() };
                    });
                    return next;
                });

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

    const renderGrid = () => {
        let items: { id: string, label: string, code?: string, obj?: any }[] = [];
        let clickHandler: (item: any) => void = () => {};
        
        if (viewLevel === 'national') {
            items = GABON_PROVINCES.map(p => ({ id: p.name, label: p.name, code: p.code, obj: p }));
            clickHandler = (item) => goToProvince(item.obj);
        } else if (viewLevel === 'province' && selectedProvince) {
            items = selectedProvince.cities.map(c => ({ id: c, label: c }));
            clickHandler = (item) => goToCity(item.id);
        } else if (viewLevel === 'city' && selectedCity) {
            const hoods = GABON_LOCATIONS[selectedCity] || [];
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
                            {isActive && (
                                <div className="absolute inset-0 flex z-0 opacity-20 h-full w-full pointer-events-none">
                                    {currentColors.map((color, i) => (
                                        <div 
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

    const filteredLogs = logs.filter(l => {
        const typeMatch = 
            filter === 'ALL' ? true :
            filter === 'USERS' ? l.type === 'USER_NEW' :
            filter === 'JOBS' ? l.type === 'JOB_NEW' :
            filter === 'FINANCE' ? (l.type === 'TRANSACTION' || l.type === 'SUB') :
            filter === 'SECURITY' ? l.type === 'ALERT' : true;
        
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
                    <div><div className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Latence</div><div className={cn("text-lg lg:text-2xl font-black font-mono", latency > 150 ? "text-red-500" : "text-gray-900")}>{Math.floor(latency)} ms</div></div>
                    <div className={cn("p-1.5 lg:p-2 rounded-lg mt-2 lg:mt-0", latency > 150 ? "bg-red-50 text-red-500 animate-pulse" : "bg-green-50 text-green-500")}><Wifi size={16} className="lg:w-5 lg:h-5" /></div>
                </div>
                <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                    <div><div className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">En Ligne</div><div className="text-lg lg:text-2xl font-black font-mono text-gray-900">{activeUsers}</div></div>
                    <div className="p-1.5 lg:p-2 rounded-lg mt-2 lg:mt-0 bg-blue-50 text-blue-500"><Activity size={16} className="lg:w-5 lg:h-5" /></div>
                </div>
                <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:justify-between text-center lg:text-left">
                    <div><div className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Erreurs</div><div className={cn("text-lg lg:text-2xl font-black font-mono", errorRate > 2 ? "text-red-500" : "text-green-600")}>{errorRate.toFixed(1)}%</div></div>
                    <div className={cn("p-1.5 lg:p-2 rounded-lg mt-2 lg:mt-0", errorRate > 2 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400")}><Server size={16} className="lg:w-5 lg:h-5" /></div>
                </div>
            </div>

            {/* TRAFFIC CONTROLS */}
            <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                <button onClick={() => setTrafficMode('low')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5", trafficMode === 'low' ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}><ZapOff size={12} /> Calme</button>
                <button onClick={() => setTrafficMode('medium')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5", trafficMode === 'medium' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}><Activity size={12} /> Normal</button>
                <button onClick={() => setTrafficMode('high')} className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5", trafficMode === 'high' ? "bg-white text-red-600 shadow-sm animate-pulse" : "text-gray-500 hover:text-gray-700")}><Zap size={12} /> Intense</button>
            </div>

            {/* Mobile Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl lg:hidden shrink-0">
                <button onClick={() => setMobileView('map')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", mobileView === 'map' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}><Map size={14} /> Carte Réseau</button>
                <button onClick={() => setMobileView('logs')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", mobileView === 'logs' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}><List size={14} /> Flux Direct</button>
            </div>

            {/* MAIN SPLIT VIEW */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden">
                {/* LEFT: MAP */}
                <div className={cn("w-full lg:w-1/3 bg-[#0F1113] rounded-3xl p-4 lg:p-6 relative overflow-hidden flex flex-col shadow-xl border border-gray-800 transition-all", mobileView === 'map' ? "flex-1 lg:flex-none" : "hidden lg:flex")}>
                    <div className="flex items-center gap-3 mb-4 lg:mb-6 relative z-10">
                        {viewLevel !== 'national' ? (
                            <button onClick={goBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"><ArrowLeft size={18} /></button>
                        ) : (
                            <div className="p-2 bg-white/5 rounded-full text-green-500 border border-white/5"><Globe size={18} /></div>
                        )}
                        <div>
                            <h3 className="text-white font-bold text-lg leading-none flex items-center gap-2">
                                {viewLevel === 'national' && "Réseau National"}
                                {viewLevel === 'province' && selectedProvince?.name}
                                {viewLevel === 'city' && selectedCity}
                            </h3>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono mt-1 select-none">
                                <button onClick={() => { setViewLevel('national'); setSelectedProvince(null); setSelectedCity(null); }} className={cn("hover:text-white transition-colors", viewLevel === 'national' ? "text-green-500 font-bold pointer-events-none" : "")}>GAB</button>
                                {viewLevel !== 'national' && (<><ChevronRight size={10} /><button onClick={() => { setViewLevel('province'); setSelectedCity(null); }} className={cn("hover:text-white transition-colors", viewLevel === 'province' ? "text-green-500 font-bold pointer-events-none" : "")}>{selectedProvince?.code}</button></>)}
                                {viewLevel === 'city' && (<><ChevronRight size={10} /><span className="text-green-500 font-bold pointer-events-none">{selectedCity?.substring(0, 3).toUpperCase()}</span></>)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative z-10 overflow-y-auto lg:overflow-visible no-scrollbar">{renderGrid()}</div>
                    <div className="mt-auto pt-4 border-t border-gray-800 shrink-0">
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-400 font-mono mb-2">
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div> User Login</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Transaction</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> New Job</div>
                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Alert</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: STREAM */}
                <div className={cn("flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden transition-all", mobileView === 'logs' ? "flex" : "hidden lg:flex")}>
                    <div className="p-3 lg:p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
                            {selectedCity && <div className="px-3 py-1 rounded-lg bg-black text-white text-xs font-bold flex items-center gap-1 shrink-0 animate-in fade-in"><MapPin size={10} /> {selectedCity}</div>}
                            <button onClick={() => setFilter('ALL')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'ALL' ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-200")}>Tout</button>
                            <button onClick={() => setFilter('USERS')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'USERS' ? "bg-blue-100 text-blue-800" : "text-gray-500 hover:bg-gray-200")}>Utilisateurs</button>
                            <button onClick={() => setFilter('JOBS')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'JOBS' ? "bg-orange-100 text-orange-800" : "text-gray-500 hover:bg-gray-200")}>Missions</button>
                            <button onClick={() => setFilter('FINANCE')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'FINANCE' ? "bg-green-100 text-green-800" : "text-gray-500 hover:bg-gray-200")}>Finance</button>
                            <button onClick={() => setFilter('SECURITY')} className={cn("px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap", filter === 'SECURITY' ? "bg-red-100 text-red-800" : "text-gray-500 hover:bg-gray-200")}>Sécurité</button>
                        </div>
                        <button onClick={() => setIsPaused(!isPaused)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600 shrink-0">{isPaused ? <Play size={18} className="fill-current"/> : <Pause size={18} className="fill-current"/>}</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1 bg-white">
                        {filteredLogs.map(log => (
                            <div key={log.id} onClick={() => setSelectedLog(log)} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-colors group border-b border-gray-50 last:border-0 cursor-pointer animate-in slide-in-from-right-2 duration-300">
                                <span className="text-gray-400 min-w-[50px] lg:min-w-[60px]">{log.timestamp.toLocaleTimeString()}</span>
                                <div className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold w-20 text-center shrink-0 border", log.type === 'TRANSACTION' ? "bg-green-50 text-green-700 border-green-200" : log.type === 'ALERT' ? "bg-red-50 text-red-700 border-red-200" : log.type === 'USER_NEW' ? "bg-blue-50 text-blue-700 border-blue-200" : log.type === 'JOB_NEW' ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-gray-100 text-gray-600")}>{log.type.replace('_', ' ')}</div>
                                <div className="flex-1 text-gray-700 truncate flex items-center gap-2 min-w-0">
                                    <span className="truncate font-medium">{log.message}</span>
                                    {log.location && <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded hidden sm:inline-block border border-gray-200">{log.neighborhood ? log.neighborhood : log.location}</span>}
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedLog && <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />}
        </div>
    );
};

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
        <aside className={cn("bg-[#1A1C1E] text-white w-64 flex-col fixed inset-y-0 z-40 transition-transform transform lg:translate-x-0 lg:static lg:h-screen shadow-xl lg:shadow-none", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
            <div className="p-6 flex items-center justify-between"><div className="flex items-center gap-2 font-black text-xl tracking-tight"><ShieldCheck className="text-jobgreen" /> ADMIN</div><button onClick={onCloseMobileMenu} className="lg:hidden text-gray-400 hover:text-white"><X size={24}/></button></div>
            <div className="px-4 pb-4"><div className="bg-[#2A2D31] rounded-xl p-3 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-jobgreen text-black flex items-center justify-center font-bold">AD</div><div><div className="text-sm font-bold text-white">Super Admin</div><div className="text-[10px] text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> En ligne</div></div></div></div>
            <nav className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar">{menu.map(item => (<button key={item.id} onClick={() => { onTabChange(item.id as AdminTab); onCloseMobileMenu(); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold relative group", activeTab === item.id ? "bg-jobgreen text-black shadow-lg shadow-green-900/20" : "text-gray-400 hover:bg-white/5 hover:text-white")}><item.icon size={20} className={activeTab === item.id ? "text-black" : "text-gray-500 group-hover:text-white"} /><span>{item.label}</span>{item.badge > 0 && <span className={cn("absolute right-4 text-[10px] text-white px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-black", item.badgeColor)}>{item.badge}</span>}</button>))}</nav>
            <div className="p-4 border-t border-gray-800"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-bold cursor-pointer active:scale-95"><LogOut size={20} /> Déconnexion</button></div>
        </aside>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
export const AdminDashboard: React.FC = () => {
    const { logout, getOrCreateConversation, setActiveConversationId, addMessageToConversation } = useUser();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [previousTab, setPreviousTab] = useState<AdminTab | null>(null); // NEW: Track history
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const counts = { logs: 12, disputes: alerts.filter(a => a.type === 'dispute').length, withdrawals: alerts.filter(a => a.type === 'finance').length + 4 };
    
    const handleLogout = () => { logout(); };
    const dismissAlert = (id: number) => { setAlerts(prev => prev.filter(a => a.id !== id)); };

    // Handler for "Contacter" from Inspector
    const handleContactUser = (user: User) => {
        const convId = getOrCreateConversation(user);
        
        // Add System Note
        addMessageToConversation(convId, {
            id: Date.now().toString(),
            senderId: 'system',
            text: "⚠️ Support Intervention: This conversation is being monitored for quality assurance.",
            timestamp: "Now",
            type: 'text'
        });

        setActiveConversationId(convId);
        setPreviousTab(activeTab); // Remember where we came from
        setActiveTab('communication');
    };

    // Handler for Back button in Chat
    const handleBackFromChat = () => {
        if (previousTab) {
            setActiveTab(previousTab);
            setPreviousTab(null);
        }
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
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
                    {activeTab === 'overview' && <OverviewContent onNavigate={setActiveTab} alerts={alerts} onDismissAlert={dismissAlert} />}
                    {activeTab === 'jobs' && <JobsContent />}
                    {activeTab === 'ads' && <AdsContent />}
                    {activeTab === 'disputes' && <DisputesContent />}
                    {activeTab === 'users' && <UsersContent onNavigate={setActiveTab} onContactUser={handleContactUser} />}
                    {activeTab === 'finance' && <FinanceContent />}
                    {activeTab === 'communication' && <CommunicationContent onBackToPrev={handleBackFromChat} />}
                    {activeTab === 'live' && <LiveContent />}
                    {activeTab === 'settings' && <SettingsContent />}
                </main>
            </div>
        </div>
    );
};
