
import React from 'react';
import { Home, Briefcase, PlusCircle, MessageSquare, User, LogOut, Settings, Bell } from 'lucide-react';
import { AppTab, User as UserType } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarLeftProps {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
    user: UserType;
    unreadCount: number;
    onLogout: () => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ activeTab, onTabChange, user, unreadCount, onLogout }) => {
    const navItems = [
        { id: AppTab.HOME, icon: Home, label: 'Accueil' },
        { id: AppTab.MY_JOBS, icon: Briefcase, label: 'Mes Missions' },
        { id: AppTab.MESSAGES, icon: MessageSquare, label: 'Messages', badge: unreadCount },
        { id: AppTab.PROFILE, icon: User, label: 'Mon Profil' },
    ];

    return (
        <div className="w-64 hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-200 bg-white px-4 py-6">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-4 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-jobgreen to-green-700 text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <span className="font-black text-xl italic tracking-tighter">JL</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">Job<span className="text-jobgreen">Libre</span></h1>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gabon</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative",
                                isActive 
                                    ? "bg-jobgreen text-white shadow-lg shadow-green-900/10 font-bold" 
                                    : "text-gray-600 hover:bg-gray-50 font-medium"
                            )}
                        >
                            <Icon size={24} className={cn(isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")} />
                            <span className="text-sm">{item.label}</span>
                            {item.badge ? (
                                <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            ) : null}
                        </button>
                    );
                })}

                <button
                    onClick={() => onTabChange(AppTab.CREATE)}
                    className="w-full mt-6 bg-jobgold hover:bg-yellow-400 text-yellow-900 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-black shadow-lg shadow-yellow-500/20 transition-transform active:scale-95"
                >
                    <PlusCircle size={20} />
                    <span className="text-sm uppercase tracking-wide">Publier Annonce</span>
                </button>
            </nav>

            {/* User Mini Profile Footer */}
            <div className="mt-auto border-t border-gray-100 pt-4 space-y-2">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors font-bold text-sm group"
                >
                    <LogOut size={20} className="group-hover:stroke-red-600 transition-colors" />
                    <span>Déconnexion</span>
                </button>

                <button 
                    onClick={() => onTabChange(AppTab.PROFILE)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group border border-transparent hover:border-gray-200"
                >
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:border-jobgreen transition-colors" />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate">{user.name}</div>
                        <div className="text-[10px] text-gray-500 font-medium">@{user.role}</div>
                    </div>
                    <Settings size={18} className="text-gray-300 group-hover:text-gray-600" />
                </button>
            </div>
        </div>
    );
};
