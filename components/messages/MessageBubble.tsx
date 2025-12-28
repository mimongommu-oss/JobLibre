
import React from 'react';
import { Shield, DollarSign, Play, MapPin, CheckCheck, RefreshCw, XCircle, Lock } from 'lucide-react';
import { ChatMessage } from '../../types';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { TIER_LIMITS } from '../../constants';

interface MessageBubbleProps { 
    msg: ChatMessage; 
    isMe: boolean; 
    onCounter?: () => void;
    onAccept?: () => void;
    onRefuse?: () => void;
    isOutdated?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, isMe, onCounter, onAccept, onRefuse, isOutdated }) => {
    const { user } = useUser();
    
    // Check specific status
    const status = msg.metadata?.status;
    const isRejected = status === 'rejected';
    const isAccepted = status === 'accepted';
    
    // Check Limits
    const amount = msg.metadata?.amount || 0;
    const maxBudget = TIER_LIMITS[user.tier].maxBudgetView;
    const isOverLimit = amount > maxBudget && !isMe;

    // Style adjustments if rejected
    const bubbleOpacity = isRejected ? 'opacity-70 bg-gray-50' : 'bg-white';
    
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[20px] p-3 shadow-sm transition-all ${
                isMe 
                ? 'bg-jobgreen text-white rounded-tr-sm' 
                : `${bubbleOpacity} text-gray-900 rounded-tl-sm border border-gray-100`
            } ${isOutdated && !isAccepted && !isRejected ? 'opacity-60 grayscale' : ''}`}>
                
                {/* 1. NEGOTIATION / OFFER */}
                {(msg.type === 'offer' || msg.type === 'negotiation') && msg.metadata && (
                    <div className={`mb-2 p-3 rounded-xl border ${isMe ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded-full ${isMe ? 'bg-white text-jobgreen' : isRejected ? 'bg-red-100 text-red-500' : 'bg-jobgreen text-white'}`}>
                                <DollarSign size={12} />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wide">
                                {isRejected ? 'Offre Rejetée' : isAccepted ? 'Offre Acceptée' : 'Proposition'}
                            </span>
                        </div>
                        <div className={`text-3xl font-black mb-1 text-center tracking-tight flex items-center justify-center gap-2 ${isOutdated || isRejected ? 'line-through decoration-2 opacity-50' : ''}`}>
                            {msg.metadata.amount?.toLocaleString()} <span className="text-xs font-bold opacity-60">FCFA</span>
                            {isOverLimit && !isAccepted && !isRejected && <Lock size={20} className="text-red-500 animate-pulse" />}
                        </div>
                        
                        {isOverLimit && !isAccepted && !isRejected && (
                            <div className="text-[10px] text-red-500 font-bold text-center mb-2 bg-red-50 p-1 rounded">
                                Au-dessus de votre plafond ({maxBudget.toLocaleString()} F)
                            </div>
                        )}

                        {/* Status / Action Area */}
                        {isAccepted ? (
                            <div className="mt-2 text-center text-xs font-bold flex items-center justify-center gap-1 text-green-600 bg-green-50 py-1 rounded-lg">
                                <CheckCheck size={14} /> Offre Validée
                            </div>
                        ) : isRejected ? (
                            <div className="mt-2 text-center text-xs font-bold flex items-center justify-center gap-1 text-red-500 bg-red-50 py-1 rounded-lg">
                                <XCircle size={14} /> Offre Refusée
                            </div>
                        ) : isOutdated ? (
                             <div className="mt-2 text-center text-[10px] font-bold opacity-60">
                                Offre dépassée
                            </div>
                        ) : msg.metadata.status === 'pending' && !isMe ? (
                            <div className="flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                                <Button 
                                    size="sm" 
                                    variant={isOverLimit ? 'ghost' : 'secondary'} 
                                    className={`w-full font-bold h-10 shadow-sm ${isOverLimit ? 'bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-not-allowed' : ''}`}
                                    onClick={isOverLimit ? undefined : onAccept}
                                    disabled={isOverLimit && true} // Actually blocked in logic too
                                >
                                    {isOverLimit ? 'Bloqué (Tier insuffisant)' : 'Accepter & Payer'}
                                </Button>
                                
                                {/* If Over Limit, show Upgrade Hint instead of Refuse/Counter */}
                                {isOverLimit ? (
                                     <Button 
                                        size="sm" 
                                        className="bg-gray-900 text-white font-bold h-10"
                                        onClick={onAccept} // This will trigger the InfoModal due to logic in useChat
                                    >
                                        Mettre à niveau
                                    </Button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 font-bold h-10"
                                            onClick={onRefuse}
                                        >
                                            Refuser
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="bg-gray-900 text-white font-bold h-10"
                                            onClick={onCounter}
                                        >
                                            <RefreshCw size={12} className="mr-1.5" /> Contre
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-2 text-center text-[10px] opacity-60 italic">
                                En attente de réponse...
                            </div>
                        )}
                    </div>
                )}
                
                {/* 2. ESCROW / SYSTEM */}
                {msg.type === 'escrow_release' && msg.metadata && (
                    <div className="mb-2 bg-green-800 p-3 rounded-xl border border-white/20">
                        <div className="flex items-center gap-2 mb-2 text-white">
                            <Shield size={14} className="fill-white" />
                            <span className="font-bold text-sm">Paiement Sécurisé</span>
                        </div>
                        <p className="text-xs opacity-90 mb-2">Les fonds ont été bloqués sur le séquestre.</p>
                        <div className="text-xl font-black text-white">{msg.metadata.amount?.toLocaleString()} FCFA</div>
                    </div>
                )}

                {/* 3. MEDIA TYPES */}
                {msg.type === 'voice' && (
                    <div className="flex items-center gap-3 min-w-[160px] py-1">
                        <button className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isMe ? 'bg-white text-jobgreen' : 'bg-gray-100 text-gray-600'}`}>
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                        </button>
                        <div className="flex flex-col flex-1">
                            <div className={`h-1.5 w-full rounded-full mb-1 ${isMe ? 'bg-white/30' : 'bg-gray-200'}`}>
                                <div className={`h-full w-1/3 rounded-full ${isMe ? 'bg-white' : 'bg-gray-500'}`}></div>
                            </div>
                            <span className="text-[10px] font-bold opacity-80">{msg.metadata?.duration}</span>
                        </div>
                    </div>
                )}
                {msg.type === 'location' && (
                    <div className="mb-2 overflow-hidden rounded-xl border border-white/20">
                        <div className={`h-28 w-full bg-gray-200 relative`}>
                             <div className="absolute inset-0 flex items-center justify-center z-10">
                                 <div className="bg-white p-2 rounded-full shadow-lg">
                                    <MapPin size={24} className="text-red-500 fill-red-500" />
                                 </div>
                             </div>
                             <img src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/9.45,0.41,13,0/300x150?access_token=pk.mock" className="w-full h-full object-cover opacity-80" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/map/300/150'; }} />
                        </div>
                    </div>
                )}
                {msg.type === 'image' && (
                    <div className="mb-2 overflow-hidden rounded-xl border border-white/20">
                         <img src={msg.metadata?.url || 'https://picsum.photos/300/200'} className="w-full h-auto object-cover max-h-[200px]" alt="Shared" />
                    </div>
                )}

                {/* 4. PLAIN TEXT */}
                {msg.text && msg.type !== 'voice' && (
                    <p className={`text-[15px] leading-snug whitespace-pre-wrap font-medium ${msg.type === 'text' ? '' : 'mt-2 text-xs opacity-80'}`}>
                        {msg.type === 'text' ? msg.text : msg.type === 'location' ? '' : msg.text}
                    </p>
                )}

                <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 font-bold ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                    {msg.timestamp}
                    {isMe && <CheckCheck size={12} />}
                </div>
            </div>
        </div>
    );
};
