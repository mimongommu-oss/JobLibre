
import React from 'react';
import { Trophy, Medal, Crown, TrendingUp, Sparkles, User as UserIcon, ArrowUpRight, Info } from 'lucide-react';
import { HALL_OF_FAME_DATA } from '../constants';
import { getCurrencyBreakdown } from '../utils/currency';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';

// Extracted component to avoid re-creation on every render
const CurrencyDisplay = ({ wealth, minimal }: { wealth: number, minimal?: boolean }) => {
    const { gold, silver, copper } = getCurrencyBreakdown(wealth);
    return (
        <div className={`flex items-center gap-1.5 ${minimal ? 'text-[10px]' : 'text-xs'}`}>
            {gold > 0 && (
                <span className="flex items-center font-bold text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200 shadow-sm">
                    <span className="mr-1 w-1.5 h-1.5 rounded-full bg-yellow-500"></span>{gold}
                </span>
            )}
            {silver > 0 && (
                <span className="flex items-center font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                    <span className="mr-1 w-1.5 h-1.5 rounded-full bg-slate-400"></span>{silver}
                </span>
            )}
            {copper > 0 && (
                <span className="flex items-center font-bold text-orange-800 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 shadow-sm">
                    <span className="mr-1 w-1.5 h-1.5 rounded-full bg-orange-500"></span>{copper}
                </span>
            )}
        </div>
    );
};

export const HallOfFame: React.FC = () => {
    const { openInfoModal } = useUser();

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24">
            {/* Header - Z-INDEX CORRIGÉ à 50 */}
            <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Classement Élite
                        <button 
                            onClick={() => openInfoModal("Règles du Classement", "Le classement est basé sur la richesse totale accumulée (Or/Argent/Cuivre) et la réputation. Les 3 meilleurs artisans gagnent des boosts de visibilité gratuits chaque semaine.")}
                            className="text-gray-300 hover:text-jobgreen transition-colors"
                        >
                            <Info size={18} />
                        </button>
                    </h1>
                    <Trophy className="text-jobgold animate-pulse-glow" size={28} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Les meilleurs artisans de Libreville cette semaine.</p>
            </div>

            {/* Top 3 Podium */}
            <div className="px-4 py-8 bg-gradient-to-b from-white to-[#F8F9FA]">
                <div className="flex justify-center items-end gap-3 mb-8">
                    {/* Rank 2 */}
                    <div className="flex flex-col items-center w-1/3 order-1">
                        <div className="relative mb-2">
                            <img src={HALL_OF_FAME_DATA[1].user.avatar} className="w-16 h-16 rounded-2xl border-4 border-slate-200 object-cover" />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-300 text-slate-700 rounded-full flex items-center justify-center font-black border-2 border-white text-xs">2</div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-sm text-gray-900 truncate w-full">{HALL_OF_FAME_DATA[1].user.name}</h3>
                            <CurrencyDisplay wealth={HALL_OF_FAME_DATA[1].user.wealth} minimal />
                        </div>
                    </div>

                    {/* Rank 1 */}
                    <div className="flex flex-col items-center w-1/3 order-2 -mt-8 relative z-10">
                        <div className="absolute -top-6 animate-float">
                            <Crown size={32} className="text-jobgold fill-jobgold drop-shadow-md" />
                        </div>
                        <div className="relative mb-2">
                            <div className="p-1 rounded-[20px] bg-gradient-to-tr from-yellow-300 to-yellow-500 shadow-gold-glow">
                                <img src={HALL_OF_FAME_DATA[0].user.avatar} className="w-20 h-20 rounded-2xl border-4 border-white object-cover bg-white" />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-jobgold text-yellow-900 rounded-full flex items-center justify-center font-black border-2 border-white text-sm shadow-sm">1</div>
                        </div>
                        <div className="text-center mt-1">
                            <h3 className="font-bold text-base text-gray-900 truncate w-full">{HALL_OF_FAME_DATA[0].user.name}</h3>
                            <div className="flex justify-center mt-0.5">
                                <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                                    {HALL_OF_FAME_DATA[0].title}
                                </span>
                            </div>
                            <div className="mt-1 flex justify-center">
                                <CurrencyDisplay wealth={HALL_OF_FAME_DATA[0].user.wealth} />
                            </div>
                        </div>
                    </div>

                    {/* Rank 3 */}
                    <div className="flex flex-col items-center w-1/3 order-3">
                        <div className="relative mb-2">
                            <img src={HALL_OF_FAME_DATA[2].user.avatar} className="w-16 h-16 rounded-2xl border-4 border-orange-200 object-cover grayscale-[0.2]" />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-300 text-orange-800 rounded-full flex items-center justify-center font-black border-2 border-white text-xs">3</div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-sm text-gray-900 truncate w-full">{HALL_OF_FAME_DATA[2].user.name}</h3>
                            <CurrencyDisplay wealth={HALL_OF_FAME_DATA[2].user.wealth} minimal />
                        </div>
                    </div>
                </div>

                {/* List for the rest */}
                <div className="space-y-3 px-2">
                    {HALL_OF_FAME_DATA.slice(3).map((item) => (
                        <div key={item.rank} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50 active:scale-[0.99] transition-transform">
                            <div className="w-8 font-black text-gray-400 text-lg text-center">{item.rank}</div>
                            <div className="relative">
                                <img src={item.user.avatar} className="w-10 h-10 rounded-xl object-cover bg-gray-50" />
                                <div className="absolute -bottom-1 -right-1 bg-gray-100 text-[8px] font-bold px-1 rounded border border-white">
                                    {item.user.rating}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate">{item.user.name}</h4>
                                <div className="text-xs text-gray-500 font-medium truncate">{item.title}</div>
                            </div>
                            <div className="text-right">
                                <CurrencyDisplay wealth={item.user.wealth} minimal />
                                <div className="text-[10px] text-green-600 font-bold flex items-center justify-end gap-0.5 mt-0.5">
                                    <TrendingUp size={10} /> Top 5%
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* User Rank (Sticky Bottom) */}
                    <div className="fixed bottom-[84px] left-4 right-4 z-20">
                        <div className="bg-gray-900 text-white p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-gray-700">
                             <div className="w-8 font-black text-gray-500 text-lg text-center">42</div>
                             <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                                 <UserIcon className="text-gray-400" size={20} />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold">Vous</h4>
                                 <div className="text-xs text-gray-400">Continuez comme ça !</div>
                             </div>
                             <div className="flex items-center gap-1 text-xs font-bold text-jobgold">
                                 <ArrowUpRight size={14} /> +3 places
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
