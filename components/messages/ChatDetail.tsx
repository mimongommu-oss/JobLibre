
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Send, DollarSign, Mic, MapPin, Plus, Camera, CalendarClock, X, Briefcase, Shield, Info, Lock, ChevronRight, StopCircle, Check } from 'lucide-react';
import { Conversation, ChatMessage, Job } from '../../types';
import { MOCK_USER, MOCK_JOBS, TIER_LIMITS } from '../../constants';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { NegotiationDrawer } from './NegotiationDrawer';
import { formatMoney, cn } from '../../lib/utils';
import { useUser } from '../../context/UserContext';
import { Button } from '../ui/Button';

// Helper for the Action Menu Buttons
const ActionButton: React.FC<{ icon: any, color: string, bg: string, label: string, onClick: () => void, disabled?: boolean }> = ({ icon: Icon, color, bg, label, onClick, disabled }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 min-w-[72px] active:scale-95 transition-transform group relative">
        <div className={`w-14 h-14 ${bg} rounded-[20px] flex items-center justify-center border border-transparent group-hover:border-black/5 shadow-sm`}>
            {disabled ? <Lock size={20} className="text-gray-400" /> : <Icon size={24} className={color} />}
        </div>
        <span className="text-xs font-bold text-gray-600">{label}</span>
    </button>
);

// --- CALL CONFIRMATION MODAL ---
const CallModal: React.FC<{ isOpen: boolean, onClose: () => void, user: any }> = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;
    
    // Simulate a phone number based on user ID for demo consistency
    const fakeNumber = `+241 07 ${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)} ${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)} ${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;

    const handleCall = () => {
        // In a real app this opens the dialer
        window.location.href = `tel:${fakeNumber.replace(/\s/g, '')}`;
        setTimeout(onClose, 500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe">
                
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <img src={user.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                        <div className="absolute bottom-1 right-1 bg-green-500 border-4 border-white w-6 h-6 rounded-full"></div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{user.name}</h3>
                    <p className="text-lg font-bold text-gray-500 mb-6">{fakeNumber}</p>
                    
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-6 text-left w-full flex gap-3">
                        <Shield className="text-orange-600 shrink-0" size={20} />
                        <div className="text-xs text-orange-800 leading-relaxed">
                            <span className="font-bold">Avertissement Sécurité</span><br/>
                            N'envoyez jamais d'argent (Airtel/MoMo) directement. Utilisez toujours le paiement sécurisé de l'application pour être protégé.
                        </div>
                    </div>

                    <div className="flex gap-3 w-full">
                        <Button variant="ghost" onClick={onClose} className="flex-1 font-bold border-2 border-gray-100 h-14">
                            Annuler
                        </Button>
                        <Button onClick={handleCall} className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold h-14 shadow-lg shadow-green-200">
                            <Phone className="mr-2" size={20} fill="currentColor" /> Appeler
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PRO ACCEPTANCE TERMS MODAL ---
const AcceptTermsModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => void, amount: number }> = ({ isOpen, onClose, onConfirm, amount }) => {
    const [accepted, setAccepted] = useState(false);
    
    useEffect(() => {
        if (isOpen) setAccepted(false);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe">
                
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="text-jobgreen" size={24} /> Validation Mission
                </h2>

                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 text-center">
                    <div className="text-xs font-bold text-green-700 uppercase mb-1">Montant à recevoir</div>
                    <div className="text-3xl font-black text-green-900">{formatMoney(amount)} F</div>
                </div>

                <div className="space-y-4 mb-6">
                    <label className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer active:scale-[0.99] transition-transform">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${accepted ? 'bg-jobgreen border-jobgreen text-white' : 'border-gray-300'}`}>
                            {accepted && <Check size={14} strokeWidth={3} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={accepted} onChange={() => setAccepted(!accepted)} />
                        <div className="text-xs text-gray-600 font-medium leading-relaxed">
                            Je m'engage à réaliser la mission avec professionnalisme et je comprends que le paiement ne sera libéré qu'après validation du client.
                        </div>
                    </label>
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={onClose} className="flex-1 font-bold border-2 border-gray-100 h-14">
                        Annuler
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        disabled={!accepted}
                        className={cn(
                            "flex-[2] font-bold h-14 shadow-lg",
                            accepted ? "bg-jobgreen text-white shadow-green-200" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
                        )}
                    >
                        Accepter
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const ChatDetail: React.FC<{ conversation: Conversation; onBack: () => void, onJobSelect?: (job: Job) => void, className?: string }> = ({ conversation, onBack, onJobSelect, className }) => {
    // --- HOOKS ---
    const { messages, isTyping, sendMessage, acceptOffer, refuseOffer } = useChat(conversation);
    const { openInfoModal, user, toggleMessageLike } = useUser();
    
    // --- LOCAL UI STATE ---
    const [inputText, setInputText] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [negotiationBaseAmount, setNegotiationBaseAmount] = useState<number>(15000); 
    const [negotiationMode, setNegotiationMode] = useState<'new' | 'counter'>('new');
    const [showJobContext, setShowJobContext] = useState(true);
    const [showCallModal, setShowCallModal] = useState(false);
    
    // Terms Modal State
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [pendingOfferId, setPendingOfferId] = useState<string | null>(null);
    const [pendingOfferAmount, setPendingOfferAmount] = useState(0);
    
    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    
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
    }, [messages, isTyping, isRecording]);

    // --- HANDLERS ---
    const handleSendClick = () => {
        sendMessage(inputText);
        setInputText('');
        setIsMenuOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendClick();
    };

    // --- RECORDING LOGIC ---
    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        recordingInterval.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = (cancel = false) => {
        if (recordingInterval.current) {
            clearInterval(recordingInterval.current);
        }
        setIsRecording(false);
        
        if (!cancel && recordingTime > 0) {
            // Format duration
            const mins = Math.floor(recordingTime / 60);
            const secs = recordingTime % 60;
            const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;
            sendMessage(`Vocal (${durationStr})`, 'voice', { duration: durationStr });
        }
        setRecordingTime(0);
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
        setShowCallModal(true);
    };

    const handleLike = (msgId: string) => {
        toggleMessageLike(conversation.id, msgId);
    };

    // --- ACCEPT FLOW ---
    const initiateAccept = (msgId: string, amount: number) => {
        setPendingOfferId(msgId);
        setPendingOfferAmount(amount);
        setShowTermsModal(true);
    };

    const confirmAccept = () => {
        if (pendingOfferId) {
            acceptOffer(pendingOfferId, pendingOfferAmount);
            setShowTermsModal(false);
            setPendingOfferId(null);
        }
    };

    // Helper for formatting recording time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // REMOVE FIXED POSITIONING, USE FLEXBOX FOR LAYOUT INTEGRITY
    return (
        <div className={cn("flex flex-col h-full bg-[#F0F2F5]", className)}>
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={conversation.withUser.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-base text-gray-900 leading-tight">{conversation.withUser.name}</h3>
                                {conversation.withUser.role === 'admin' && (
                                    <span className="bg-slate-900 text-jobgold px-1.5 py-0.5 rounded text-[8px] font-black uppercase border border-slate-700">Staff</span>
                                )}
                            </div>
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
                className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 flex items-center justify-center gap-2 relative z-10 overflow-hidden shadow-md shrink-0"
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
                    className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2 relative z-10 cursor-pointer active:bg-blue-100 transition-colors group shrink-0"
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

            {/* Messages Area - SCROLLABLE FLEX ITEM */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#E5DDD5]/10">
                {messages.map((msg, index) => {
                    const isOutdated = (msg.type === 'offer' || msg.type === 'negotiation') && 
                                       messages.slice(index + 1).some(m => m.type === 'offer' || m.type === 'negotiation');
                    
                    const isMe = msg.senderId === user.id;
                    
                    // Determine if sender is Admin
                    // 1. If I sent it, check my role.
                    // 2. If They sent it, check their role.
                    const isSenderAdmin = isMe 
                        ? user.role === 'admin' 
                        : conversation.withUser.role === 'admin';

                    return (
                        <MessageBubble 
                            key={msg.id} 
                            msg={msg} 
                            isMe={isMe} 
                            isAdmin={isSenderAdmin}
                            onCounter={() => handleCounterOffer(msg.metadata?.amount || 0)}
                            onAccept={() => initiateAccept(msg.id, msg.metadata?.amount || 0)} // Trigger Terms Modal
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
            </div>

            {/* --- BOTTOM INPUT AREA (STATIC FLEX ITEM) --- */}
            <div className="bg-white border-t border-gray-200 pb-safe shrink-0 transition-all duration-300">
                {/* Menu */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen && !isRecording ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
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

                {/* Input Bar or Recording Bar */}
                <div className="p-2 px-3">
                    {isRecording ? (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 h-[44px]">
                            <button 
                                onClick={() => stopRecording(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="flex-1 bg-red-50 rounded-full px-4 py-2 flex items-center gap-3 border border-red-100">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-red-600 font-bold font-mono text-sm">{formatTime(recordingTime)}</span>
                                <div className="flex-1 flex items-center gap-0.5 h-4 opacity-50">
                                    {[...Array(10)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="w-1 bg-red-400 rounded-full animate-pulse"
                                            style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={() => stopRecording(false)}
                                className="w-10 h-10 bg-jobgreen text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 active:scale-90 transition-all"
                            >
                                <Send size={20} className="ml-0.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-end gap-2">
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
                                    onClick={startRecording}
                                    className="w-10 h-10 bg-jobgreen text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 active:scale-90 transition-all mb-0.5"
                                >
                                    <Mic size={20} />
                                </button>
                            )}
                        </div>
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

            {/* Call Modal */}
            <CallModal 
                isOpen={showCallModal} 
                onClose={() => setShowCallModal(false)} 
                user={conversation.withUser} 
            />

            {/* Terms Acceptance Modal */}
            <AcceptTermsModal 
                isOpen={showTermsModal} 
                onClose={() => setShowTermsModal(false)} 
                onConfirm={confirmAccept} 
                amount={pendingOfferAmount} 
            />
        </div>
    );
};
