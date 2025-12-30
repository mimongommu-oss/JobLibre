
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Send, Zap, ChevronRight, Phone, MessageCircle, Briefcase, MapPin, ExternalLink, Eye } from 'lucide-react';
import { StatusStory, Job, AppTab } from '../types';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';

interface StoryViewerProps {
    stories: StatusStory[];
    initialStoryId: string;
    onClose: () => void;
    onViewJob?: (job: Job) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialStoryId, onClose, onViewJob }) => {
    const { addNotification, jobs, user, incrementStoryView, getOrCreateConversation, addMessageToConversation, setActiveConversationId } = useUser();
    // Context needed to switch tabs via a hack or prop if available, 
    // strictly speaking StoryViewer is usually mounted at App level. 
    // We will rely on setActiveConversationId which triggers the effect in App.tsx.

    // Find initial index
    const startIndex = stories.findIndex(s => s.id === initialStoryId);
    const [currentIndex, setCurrentIndex] = useState(startIndex >= 0 ? startIndex : 0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [replyText, setReplyText] = useState('');
    
    // To prevent double counting in the same session open
    const viewedInSession = useRef<Set<string>>(new Set());
    
    // REF FOR INPUT FOCUS
    const inputRef = useRef<HTMLInputElement>(null);

    const currentStory = stories[currentIndex];
    const relatedJob = currentStory?.jobId ? jobs.find(j => j.id === currentStory.jobId) : null;
    const isOwner = currentStory?.user.id === user.id;

    const STORY_DURATION = 5000; // 5 seconds per story
    const stepRef = useRef<number>(0);

    // Random delay for glass shine effect (Consistency with JobCard)
    const glassDelay = useMemo(() => Math.random() * 5, []);

    // --- VIEW COUNTING LOGIC ---
    useEffect(() => {
        if (!currentStory) return;

        // If I am NOT the owner, count a view
        if (!isOwner) {
            if (!viewedInSession.current.has(currentStory.id)) {
                incrementStoryView(currentStory.id);
                viewedInSession.current.add(currentStory.id);
            }
        }
    }, [currentStory?.id, isOwner]);

    // --- AUTO PROGRESS LOGIC ---
    useEffect(() => {
        setProgress(0);
        stepRef.current = 0;
    }, [currentIndex]);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            stepRef.current += 50; // Update every 50ms
            const newProgress = (stepRef.current / STORY_DURATION) * 100;
            
            if (newProgress >= 100) {
                handleNext();
            } else {
                setProgress(newProgress);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused]);

    // --- NAVIGATION ---
    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            // Restart current story if it's the first one
            setProgress(0);
            stepRef.current = 0;
        }
    };

    // --- ACTIONS ---
    const handleMainAction = () => {
        setIsPaused(true);
        
        if (currentStory.type === 'urgent_job') {
            // ACTION FOR URGENT: Apply / "Je suis dispo"
            addNotification('Candidature Fast-Track', `Votre profil a été envoyé en priorité à ${currentStory.user.name}`, 'success');
            
            // Create conversation + send auto message
            const convId = getOrCreateConversation(currentStory.user, relatedJob || undefined);
            addMessageToConversation(convId, {
                id: Date.now().toString(),
                senderId: user.id,
                text: "👋 Je suis disponible immédiatement pour votre urgence !",
                timestamp: "À l'instant",
                type: 'text'
            });
            setActiveConversationId(convId);
            onClose();
        }
    };

    const handleViewJobDetails = () => {
        if (relatedJob && onViewJob) {
            setIsPaused(true);
            onViewJob(relatedJob);
            onClose();
        }
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!replyText.trim()) return;
        
        setIsPaused(true);
        
        // 1. Create or Get Conversation
        const convId = getOrCreateConversation(currentStory.user, relatedJob || undefined);
        
        // 2. Add Message with Context
        addMessageToConversation(convId, {
            id: Date.now().toString(),
            senderId: user.id,
            text: `Réponse à votre story : "${replyText}"`,
            timestamp: "À l'instant",
            type: 'text',
            metadata: {
                // Optional: link to story content?
            }
        });

        // 3. Trigger Redirection (App.tsx listens to activeConversationId)
        setActiveConversationId(convId);
        
        setReplyText('');
        onClose();
    };

    const handleTouchStart = () => setIsPaused(true);
    const handleTouchEnd = () => setIsPaused(false);

    if (!currentStory) return null;

    // Determine Theme based on type
    const isUrgent = currentStory.type === 'urgent_job';
    const bgGradient = isUrgent 
        ? 'from-red-900/90 via-gray-900 to-black' 
        : 'from-blue-900/90 via-gray-900 to-black';

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* --- PROGRESS BAR HEADER --- */}
            <div className="absolute top-0 left-0 right-0 z-20 pt-4 px-2 flex gap-1">
                {stories.map((story, idx) => (
                    <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-75 ease-linear"
                            style={{ 
                                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* --- TOP BAR (User Info) --- */}
            <div className="absolute top-8 left-0 right-0 z-20 px-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={currentStory.user.avatar} className="w-10 h-10 rounded-full border-2 border-white/50" />
                    <div className="text-white drop-shadow-md">
                        <div className="font-bold text-sm flex items-center gap-2">
                            {currentStory.user.name} 
                            <span className="text-gray-300 font-normal text-xs">• 2 min</span>
                        </div>
                        {isUrgent && (
                            // CONSISTENT URGENT BADGE with Random Delay
                            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-red-200 mt-1">
                                {/* GLASS SHINE with Random Delay */}
                                <div 
                                    className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" 
                                    style={{ animationDelay: `${glassDelay}s` }}
                                />
                                <div className="animate-wiggle-violent relative z-10"><Zap size={10} fill="white" /></div> 
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 relative z-10">URGENT</span>
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={onClose} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full">
                    <X size={24} />
                </button>
            </div>

            {/* --- MAIN CONTENT AREA (Touchable) --- */}
            <div 
                className={cn("flex-1 relative flex flex-col justify-center items-center p-8 bg-gradient-to-b", bgGradient)}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Navigation Zones */}
                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>

                {/* Story Content */}
                <div className="relative z-20 text-center animate-in zoom-in-95 duration-500 w-full max-w-sm">
                    {/* Visual Icon */}
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/10">
                         {isUrgent ? <Zap size={48} className="text-red-500 fill-red-500" /> : <Briefcase size={48} className="text-blue-400" />}
                    </div>
                    
                    {/* Story Title */}
                    <h2 className="text-3xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                        {currentStory.text}
                    </h2>
                    
                    {/* Job Details Card (If linked) */}
                    {relatedJob ? (
                        <div onClick={handleViewJobDetails} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-left mb-6 cursor-pointer active:scale-95 transition-transform hover:bg-white/15">
                             <div className="flex justify-between items-start mb-2">
                                <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">{relatedJob.category}</span>
                                <ExternalLink size={16} className="text-white/70" />
                             </div>
                             <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">{relatedJob.title}</h3>
                             <div className="flex items-center gap-2 text-white/80 text-xs mb-3">
                                <MapPin size={12} /> {relatedJob.location}
                             </div>
                             <div className="text-2xl font-black text-jobgold">
                                 {relatedJob.budget > 0 ? relatedJob.budget.toLocaleString() : 'Sur Devis'} <span className="text-sm text-white/80 font-medium">FCFA</span>
                             </div>
                        </div>
                    ) : (
                        <p className="text-white/80 text-lg font-medium max-w-xs mx-auto mb-8">
                            {/* Shortened text for Info Stories */}
                            {isUrgent ? `Recherche immédiate à ${currentStory.user.location || 'Libreville'}. Budget disponible.` : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* --- PRIVATE VIEW COUNTER (OWNER ONLY) --- */}
            {isOwner && (
                <div className="absolute bottom-28 left-4 z-40 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white animate-in slide-in-from-left-4">
                    <Eye size={14} className="opacity-80" />
                    <span className="text-xs font-bold">{currentStory.views || 0} vues</span>
                </div>
            )}

            {/* --- FOOTER ACTIONS --- */}
            <div className="pb-safe bg-gradient-to-t from-black via-black/80 to-transparent pt-10 px-4 pb-6 flex flex-col gap-4 relative z-30">
                
                {/* Actions Row - Only Show if there's a reason (Job Link or Urgent Action) */}
                {(relatedJob || isUrgent) && (
                    <div className="flex gap-3">
                         {relatedJob && (
                            <Button 
                                onClick={handleViewJobDetails}
                                className={cn(
                                    "h-14 bg-gray-800 text-white border border-gray-700 font-bold text-sm hover:bg-gray-700 rounded-2xl shadow-lg active:scale-95 transition-all",
                                    isUrgent ? "flex-1" : "w-full"
                                )}
                            >
                                <Briefcase size={18} className="mr-2" /> Voir la mission
                            </Button>
                         )}
                         
                         {isUrgent && (
                             <Button 
                                onClick={handleMainAction}
                                className={cn(
                                    "h-14 bg-white text-black font-black text-base hover:bg-gray-200 rounded-2xl shadow-lg transform active:scale-95 transition-all",
                                    relatedJob ? "flex-[2]" : "w-full"
                                )}
                            >
                                <Zap size={20} className="mr-2 fill-black" /> Je suis dispo
                            </Button>
                         )}
                    </div>
                )}

                {/* Reply Input */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => setIsPaused(false)}
                            placeholder={isUrgent ? "Poser une question..." : "Répondre à la story..."}
                            className="w-full bg-transparent border border-white/40 rounded-full py-3 px-5 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/10 transition-all font-medium"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="p-3 text-white disabled:opacity-50"
                        disabled={!replyText.trim()}
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};