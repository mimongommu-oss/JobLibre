
import React, { useState, useEffect } from 'react';
import { Search, Info } from 'lucide-react';
import { MOCK_CONVERSATIONS } from '../../constants';
import { Conversation } from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { useUser } from '../../context/UserContext';

interface ChatListProps {
    onSelect: (c: Conversation) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelect }) => {
    const { openInfoModal } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Header - Z-INDEX CORRIGÉ */}
            <div className="px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-50 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-black text-gray-900">Messages</h1>
                    <button 
                        onClick={() => openInfoModal("Messagerie Sécurisée", "Toutes les conversations sont cryptées. Pour votre sécurité, n'échangez jamais d'argent en dehors de l'application avant la fin de la mission.")}
                        className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-jobgreen"
                    >
                        <Info size={20} />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-jobgreen/20"
                    />
                </div>
            </div>

            <div className="divide-y divide-gray-50">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="p-4 flex gap-4">
                            <Skeleton className="w-14 h-14 rounded-full" />
                            <div className="flex-1 space-y-2 py-2">
                                <div className="flex justify-between">
                                    <Skeleton className="w-24 h-4" />
                                    <Skeleton className="w-10 h-3" />
                                </div>
                                <Skeleton className="w-3/4 h-3" />
                            </div>
                        </div>
                    ))
                ) : (
                    MOCK_CONVERSATIONS.map(conv => (
                        <div 
                            key={conv.id} 
                            onClick={() => onSelect(conv)}
                            className="p-4 flex gap-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <div className="relative">
                                <img src={conv.withUser.avatar} alt={conv.withUser.name} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                                {conv.withUser.available && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 truncate">{conv.withUser.name}</h3>
                                    <span className={`text-[11px] ${conv.unreadCount > 0 ? 'text-jobgreen font-bold' : 'text-gray-400'}`}>
                                        {conv.timestamp}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <div className="flex flex-col justify-center">
                                    <span className="bg-jobgreen text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full">
                                        {conv.unreadCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
