
import React, { useState } from 'react';
import { 
    LayoutDashboard, Radio, Users, Briefcase, Megaphone, Scale, Wallet, Send, Settings, 
    ShieldCheck, X, LogOut, Menu, Bell, Search, Filter, MoreHorizontal, AlertTriangle
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';

// --- TYPES ---
export type AdminTab = 'overview' | 'live' | 'users' | 'jobs' | 'ads' | 'disputes' | 'finance' | 'communication' | 'settings';

// --- MOCK SUB-COMPONENTS ---

const OverviewContent = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                { label: 'Utilisateurs Totaux', value: '1,240', change: '+12%', icon: Users, color: 'blue' },
                { label: 'Missions Actives', value: '85', change: '+5%', icon: Briefcase, color: 'green' },
                { label: 'Revenus (Commissions)', value: '450k', change: '+8%', icon: Wallet, color: 'yellow' },
                { label: 'Litiges Ouverts', value: '3', change: '-1', icon: Scale, color: 'red' },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", stat.change.startsWith('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                            {stat.change}
                        </span>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
        {/* Placeholder Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                <h3 className="font-bold text-gray-900 mb-4">Activité Réseau</h3>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                    Graphique d'activité (Mock)
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Dernières Inscriptions</h3>
                <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1">
                                <div className="font-bold text-sm">Utilisateur {i}</div>
                                <div className="text-xs text-gray-500">Il y a {i*2} min</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const JobsContent = () => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Missions en cours</h3>
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-medium focus:outline-none" />
                </div>
                <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><Filter size={20} className="text-gray-500" /></button>
            </div>
        </div>
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                    <th className="px-6 py-4">Titre</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Budget</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {[1,2,3,4].map(i => (
                    <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-sm">Mission #{1000+i}</td>
                        <td className="px-6 py-4 text-sm">Client {i}</td>
                        <td className="px-6 py-4 font-mono text-sm">{(15000 * i).toLocaleString()} F</td>
                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></td>
                        <td className="px-6 py-4 text-gray-400"><MoreHorizontal size={20} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AdsContent = () => <div className="text-center py-20 text-gray-400">Gestion des Publicités (Bientôt)</div>;

const DisputesContent = () => (
    <div className="space-y-4 animate-in fade-in">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-800 font-medium">
            <AlertTriangle size={20} /> 3 litiges nécessitent votre attention immédiate.
        </div>
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Non-Paiement</span>
                        <span className="text-xs text-gray-400">• Il y a 2h</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Désaccord sur la finition - Mission #102{i}</h4>
                    <p className="text-sm text-gray-500 mt-1">Le client refuse de valider la fin de mission.</p>
                </div>
                <Button size="sm" className="bg-gray-900 text-white">Examiner</Button>
            </div>
        ))}
    </div>
);

const UsersContent = () => <div className="text-center py-20 text-gray-400">Gestion des Utilisateurs</div>;

const FinanceContent = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Solde Séquestre</div>
                <div className="text-3xl font-black">2,450,000 F</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Commissions (Mois)</div>
                <div className="text-3xl font-black text-gray-900">125,000 F</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Demandes Retrait</div>
                <div className="text-3xl font-black text-orange-500">12</div>
            </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">Demandes de Retrait en attente</h3>
            <div className="space-y-3">
                {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-xs">U{i}</div>
                            <div>
                                <div className="font-bold text-sm text-gray-900">Utilisateur {i}</div>
                                <div className="text-xs text-gray-500">Airtel Money • 07 00 00 0{i}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-gray-900">{(5000 * i).toLocaleString()} F</div>
                            <div className="flex gap-2 mt-1">
                                <button className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200">Valider</button>
                                <button className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-200">Refuser</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CommunicationContent = () => <div className="text-center py-20 text-gray-400">Centre de Communication</div>;

const LiveContent = () => (
    <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h3 className="font-bold text-red-600">Live Monitor</h3>
        </div>
        <div className="bg-black text-green-400 p-4 rounded-xl font-mono text-xs h-96 overflow-y-auto">
            <p>[10:42:01] User_123 logged in (IP: 197.xxx.xxx)</p>
            <p>[10:42:05] New Job Created: "Fuite d'eau" (ID: #8842)</p>
            <p>[10:42:12] Transaction: +15000 F (Escrow Lock)</p>
            <p>[10:42:45] API Request /geo/reverse latency: 120ms</p>
            <p className="text-yellow-400">[10:43:00] Warning: High traffic detected in "Akanda"</p>
        </div>
    </div>
);

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
    
    // Mock Counts
    const counts = {
        logs: 12,
        disputes: 3,
        withdrawals: 5
    };

    const handleLogout = () => {
        logout();
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
                    {activeTab === 'overview' && <OverviewContent />}
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
