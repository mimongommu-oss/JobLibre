
import React from 'react';
import { TrendingUp, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { formatMoney } from '../../lib/utils';
import { User } from '../../types';

export const SidebarRight: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div className="w-80 hidden xl:block h-screen sticky top-0 p-6 space-y-6 overflow-y-auto no-scrollbar">
            
            {/* Widget: Wallet Summary */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[24px] p-5 text-white shadow-xl shadow-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mon Solde</div>
                        <div className="text-2xl font-black">{formatMoney(user.wealth)} F</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl">
                        <ShieldCheck size={18} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 bg-white text-black text-[10px] font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        Recharger
                    </button>
                    <button className="flex-1 bg-white/10 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Retirer
                    </button>
                </div>
            </div>

            {/* Widget: Trending */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <TrendingUp size={16} className="text-jobgreen" /> Tendances
                    </h3>
                </div>
                <div className="space-y-4">
                    {[
                        { tag: '#Plomberie', count: '124 missions', trend: 'up' },
                        { tag: '#Déménagement', count: '85 missions', trend: 'stable' },
                        { tag: '#Informatique', count: '56 missions', trend: 'up' },
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <div className="text-sm font-bold text-gray-700 group-hover:text-jobgreen transition-colors">{item.tag}</div>
                                <div className="text-[10px] text-gray-400">{item.count}</div>
                            </div>
                            {item.trend === 'up' && <Zap size={12} className="text-jobgold fill-jobgold" />}
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 text-[10px] font-bold text-blue-600 hover:underline text-left">
                    Voir tout
                </button>
            </div>

            {/* Widget: Pro Suggestions */}
            <div className="bg-gray-50 rounded-[24px] border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <Users size={16} className="text-blue-600" /> Pros à suivre
                    </h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-400">
                                P{i}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-gray-900 truncate">Artisan {i}</div>
                                <div className="text-[10px] text-gray-500">Bricolage • Libreville</div>
                            </div>
                            <button className="p-1.5 bg-white rounded-lg border border-gray-200 hover:border-jobgreen hover:text-jobgreen transition-colors">
                                <ArrowRight size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-[10px] text-gray-400 text-center font-medium px-4">
                © 2025 JobLibre Gabon • Confidentialité • Conditions • Support
            </div>
        </div>
    );
};
