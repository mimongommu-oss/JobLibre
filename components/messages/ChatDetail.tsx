
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Send, DollarSign, Mic, MapPin, Plus, Camera, CalendarClock, X, Briefcase, Shield, Info, Lock, ChevronRight } from 'lucide-react';
import { Conversation, ChatMessage, Job } from '../../types';
import { MOCK_USER, MOCK_JOBS, TIER_LIMITS } from '../../constants';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { NegotiationDrawer } from './NegotiationDrawer';
import { formatMoney } from '../../lib/utils';
import { useUser } from '../../context/UserContext';

// Helper for the Action Menu Buttons
const ActionButton: React.FC<{ icon: any, color: string, bg: string, label: string, onClick: () => void, disabled?: boolean }> = ({ icon: Icon, color, bg, label, onClick, disabled }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 min-w-[72px] active:scale-95 transition-transform group relative">
        <div className={`w-14 h-14 ${bg} rounded-[20px] flex items-center justify-center border border-transparent group-hover:border-black/5 shadow-sm`}>
            {disabled ? <Lock size={20} className="text-gray-400" /> : <Icon size={24} className={color} />}
        </div>
        <span className="text-xs font-bold text-gray-600">{label}</span>
    </button>
);

export const ChatDetail: React.FC<{ conversation: Conversation; onBack: () => void, onJobSelect?: (job: Job) => void }> = ({ conversation, onBack, onJobSelect }) => {
    // --- HOOKS ---
    const { messages, isTyping, sendMessage, acceptOffer, refuseOffer } = useChat(conversation);
    const { openInfoModal, user, toggleMessageLike } = useUser();
    
    // --- LOCAL UI STATE ---
    const [inputText, setInputText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [negotiationBaseAmount, setNegotiationBaseAmount] = useState<number>(15000); 
    const [negotiationMode, setNegotiationMode] = useState<'new' | 'counter'>('new');
    const [showJobContext, setShowJobContext] = useState(true); // New State
    
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock finding the related job (in a real app, this comes from the DB)
    const relatedJob = conversation.relatedJobId ? MOCK_JOBS.find(j => j.id === conversation.relatedJobId) : null;

    // Check permissions
    const canNegotiate = TIER_LIMITS[user.tier].canNegotiate;

    // --- EFFECTS ---
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // --- HANDLERS ---
    const handleSendClick = () => {
        sendMessage(inputText);
        setInputText('');
        setIsMenuOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendClick();
    };

    const handleCounterOffer = (amountToCounter: number) => {
        if (!canNegotiate) {
             openInfoModal("Négociation Verrouillée", "Votre compte Standard ne permet pas de faire des contre-offres. Acceptez le prix ou passez au niveau supérieur.");
             return;
        }
        setNegotiationBaseAmount(amountToCounter);
        setNegotiationMode('counter');
        setIsNegotiating(true);
    };

    const handleNewOffer = () => {
        if (!canNegotiate) {
             openInfoModal("Offre Verrouillée", "Seuls les membres Verified et Premium peuvent initier une offre financière.");
             return;
        }
        setNegotiationBaseAmount(15000); 
        setNegotiationMode('new');
        setIsNegotiating(true);
    };

    const handleNegotiationSubmit = (amount: number) => {
        const text = negotiationMode === 'counter' 
            ? `Contre-proposition : ${formatMoney(amount)} FCFA` 
            : `Nouvelle offre : ${formatMoney(amount)} FCFA`;
        
        sendMessage(text, 'negotiation', { amount, status: 'pending' });
        setIsNegotiating(false);
    };

    const handleJobClick = () => {
        if (relatedJob && onJobSelect) {
            onJobSelect(relatedJob);
        }
    };

    const handlePhoneCall = () => {
        alert("Appel vers le " + conversation.withUser.name + "...");
        // window.location.href = 'tel:+241...';
    };

    const handleLike = (msgId: string) => {
        toggleMessageLike(conversation.id, msgId);
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-[#F0F2F5] z-[60]">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={conversation.withUser.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <div>
                            <h3 className="font-bold text-base text-gray-900 leading-tight">{conversation.withUser.name}</h3>
                            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> En ligne
                            </span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handlePhoneCall}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-200 active:scale-95 transition-all"
                >
                    <Phone size={20} />
                </button>
            </div>

            {/* SAFETY BANNER - REDESIGNED URGENT STYLE */}
            <button 
                onClick={() => openInfoModal("Règles de Sécurité", "Si vous payez hors de l'application (Main à main, Airtel direct), nous ne pouvons pas protéger votre argent en cas de problème. Utilisez toujours l'offre intégrée.")}
                className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 flex items-center justify-center gap-2 relative z-10 overflow-hidden shadow-md w-full"
            >
                {/* Shimmer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] h-full animate-shimmer-fast pointer-events-none"></div>
                
                {/* Icon Container with Wiggle */}
                <div className="bg-white/20 p-1 rounded-full animate-wiggle-violent shrink-0">
                    <Shield size={14} className="text-white fill-white" />
                </div>
                
                {/* Text */}
                <span className="text-[10px] font-black text-white uppercase tracking-wider relative z-10 drop-shadow-sm text-center leading-tight">
                    Ne payez jamais hors de l'application
                </span>
                <Info size={12} className="text-white/70" />
            </button>

            {/* Sticky Job Context Bar (CLICKABLE) */}
            {relatedJob && showJobContext && (
                <div 
                    onClick={handleJobClick}
                    className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2 relative z-10 cursor-pointer active:bg-blue-100 transition-colors group"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-blue-600 group-hover:scale-110 transition-transform">
                            <Briefcase size={14} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">Concerne la mission</div>
                            <div className="text-xs font-bold text-blue-900 truncate">{relatedJob.title}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ChevronRight size={16} className="text-blue-300" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowJobContext(false); }}
                            className="p-1.5 hover:bg-blue-200 text-blue-400 rounded-full transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#E5DDD5]/10">
                {messages.map((msg, index) => {
                    const isOutdated = (msg.type === 'offer' || msg.type === 'negotiation') && 
                                       messages.slice(index + 1).some(m => m.type === 'offer' || m.type === 'negotiation');
                    
                    return (
                        <MessageBubble 
                            key={msg.id} 
                            msg={msg} 
                            isMe={msg.senderId === MOCK_USER.id} 
                            onCounter={() => handleCounterOffer(msg.metadata?.amount || 0)}
                            onAccept={() => acceptOffer(msg.id, msg.metadata?.amount || 0)}
                            onRefuse={() => refuseOffer(msg.id)}
                            onLike={() => handleLike(msg.id)}
                            isOutdated={isOutdated}
                        />
                    );
                })}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm flex gap-1 items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div className="h-4" /> 
            </div>

            {/* --- BOTTOM INPUT AREA --- */}
            <div className="bg-white border-t border-gray-200 pb-safe transition-all duration-300">
                {/* Menu */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pt-4 pb-2 flex gap-4 overflow-x-auto no-scrollbar justify-between sm:justify-start">
                        <ActionButton 
                            icon={DollarSign} color="text-yellow-700" bg="bg-yellow-50" label={canNegotiate ? "Offre" : "Bloqué"} 
                            onClick={() => { handleNewOffer(); setIsMenuOpen(false); }} 
                            disabled={!canNegotiate}
                        />
                        <ActionButton 
                            icon={MapPin} color="text-blue-600" bg="bg-blue-50" label="Position" 
                            onClick={() => sendMessage('Ma position', 'location', { lat: 0, lng: 0 })} 
                        />
                        <ActionButton 
                            icon={Camera} color="text-purple-600" bg="bg-purple-50" label="Photo" 
                            onClick={() => sendMessage(undefined, 'image', { url: 'https://picsum.photos/300/200' })} 
                        />
                        <ActionButton 
                            icon={CalendarClock} color="text-gray-600" bg="bg-gray-100" label="RDV" 
                            onClick={() => sendMessage('📅 Rendez-vous proposé : Demain 14h00', 'text')} 
                        />
                    </div>
                </div>

                {/* Input Bar */}
                <div className="p-2 px-3 flex items-end gap-2">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isMenuOpen ? 'bg-gray-200 rotate-45 text-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        <Plus size={24} />
                    </button>

                    <div className="flex-1 bg-gray-100 rounded-[24px] flex items-center px-4 py-1 min-h-[44px] border border-transparent focus-within:border-jobgreen/30 focus-within:bg-white transition-colors">
                        <input 
                            className="w-full bg-transparent text-[15px] font-medium py-2.5 focus:outline-none max-h-32"
                            placeholder="Message..."
                            value={inputText}
                            onFocus={() => setIsMenuOpen(false)}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    
                    {inputText.trim() ? (
                        <button 
                            onClick={handleSendClick}
                            className="w-10 h-10 bg-jobgreen text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 active:scale-90 transition-all mb-0.5"
                        >
                            <Send size={20} className="ml-0.5" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => sendMessage('Vocal (0:08)', 'voice', { duration: '0:08' })}
                            className="w-10 h-10 bg-jobgreen text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 active:scale-90 transition-all mb-0.5"
                        >
                            <Mic size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Negotiation Drawer */}
            {isNegotiating && (
                <NegotiationDrawer 
                    onClose={() => setIsNegotiating(false)} 
                    mode={negotiationMode}
                    onSubmit={handleNegotiationSubmit} 
                    initialAmount={negotiationBaseAmount} 
                />
            )}
        </div>
    );
};
