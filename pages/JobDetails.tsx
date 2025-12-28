
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Shield, Share2, Wallet, Zap, ImageIcon, CheckCircle2, Navigation, Camera, ExternalLink, Plus, Minus, Bookmark, Send, Phone, Lock, AlertOctagon, FileText, ChevronLeft, ChevronRight as ChevronRightIcon, EyeOff, TrendingUp, BarChart3, Eye, MousePointer2, Briefcase, Info, MessageCircle } from 'lucide-react';
import { Job, AppTab, ChatMessage } from '../types';
import { Button } from '../components/ui/Button';
import { DEFAULT_JOB_PHOTOS, TIER_LIMITS, BOOST_OPTIONS, COIN_VALUE_XAF } from '../constants';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';
import { CoinShopModal } from '../components/CoinShopModal';
import { BoostSelector, BoostValidationModal } from '../components/BoostSelector';

interface JobDetailsProps {
    job: Job;
    onBack: () => void;
    // We add this to trigger app-level navigation
    onNavigate?: (tab: AppTab) => void;
}

const SectionTitle: React.FC<{ label: string, info: string, onInfo: (t: string, c: string) => void }> = ({ label, info, onInfo }) => (
    <div className="flex items-center gap-2 mb-3">
        <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">{label}</h3>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onInfo(label, info); }} className="text-gray-300 hover:text-jobgreen transition-colors p-1 -m-1 active:scale-95"><Info size={14} /></button>
    </div>
);

// --- CAMPAIGN ANALYTICS DASHBOARD ---
const CampaignDashboard: React.FC<{ job: Job, onInfo: (t: string, c: string) => void }> = ({ job, onInfo }) => {
    const totalViews = job.views || 0;
    const organicViews = Math.floor(totalViews * 0.4);
    const boostedViews = totalViews - organicViews;
    const clicks = Math.floor(totalViews * 0.15); 
    
    const startDate = new Date(job.createdAt);
    const durationDays = job.isUrgent ? 2 : 1;
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const progress = Math.min(100, Math.max(0, ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
    
    const formatDate = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    return (
        <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl shadow-gray-900/20 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <h3 className="font-black text-sm uppercase tracking-widest text-white/80">Campagne Active</h3>
                    </div>
                    <div className="text-xs font-medium text-gray-400">{job.isUrgent ? "Boost Urgence (Max)" : "Boost Standard"}</div>
                </div>
                <button onClick={() => onInfo("Statistiques", "Données en temps réel sur la performance de votre mise en avant.")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <BarChart3 size={16} className="text-white" />
                </button>
            </div>
            <div className="mb-6 relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>{formatDate(startDate)}</span>
                    <span>Fin le {formatDate(endDate)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-jobgold to-yellow-300 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase"><Eye size={12} /> Vues Totales</div>
                    <div className="text-2xl font-black text-white">{totalViews}</div>
                    <div className="text-[10px] text-gray-400 mt-1 flex gap-1"><span className="text-jobgold font-bold">{boostedViews} Boost</span> • {organicViews} Orga.</div>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase"><MousePointer2 size={12} /> Clics (CTR)</div>
                    <div className="text-2xl font-black text-white">{clicks}</div>
                    <div className="text-[10px] text-green-400 mt-1 font-bold">15% Taux de clic</div>
                </div>
            </div>
        </div>
    );
}

// ... (BoostSuccessModal, ProofOfWorkModal)
// Included for completeness in XML but abbreviated here to focus on changes.
const BoostSuccessModal: React.FC<{ isOpen: boolean; onClose: () => void; boostType: 'basic' | 'urgent'; duration: number }> = ({ isOpen, onClose, boostType, duration }) => {
    if (!isOpen) return null;
    const option = BOOST_OPTIONS.find(o => o.id === boostType);
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div><div className="bg-white w-full max-w-sm rounded-[32px] p-6 relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col items-center text-center overflow-hidden"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200 animate-in zoom-in duration-500 delay-100"><CheckCircle2 size={40} strokeWidth={4} /></div><h2 className="text-2xl font-black text-gray-900 mb-1">Transaction Validée !</h2><p className="text-sm text-gray-500 font-medium mb-6">Votre visibilité est active.</p><Button onClick={onClose} className="w-full h-14 text-lg rounded-xl bg-gray-900 text-white shadow-lg">Voir mon tableau de bord</Button></div></div>);
};

const ProofOfWorkModal: React.FC<{ onClose: () => void, onSubmit: () => void }> = ({ onClose, onSubmit }) => {
    // ... same code ...
    const [step, setStep] = useState<'photo' | 'geo' | 'confirm'>('photo');
    const [isLocating, setIsLocating] = useState(false);
    const handleGeoLocate = () => { setIsLocating(true); setTimeout(() => { setIsLocating(false); setStep('confirm'); }, 2000); };
    return (<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div><div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 pb-safe shadow-2xl"><div className="p-6"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div><h2 className="text-xl font-black text-gray-900 mb-2">Preuve de Travail</h2><p className="text-gray-500 text-sm font-medium mb-6">Pour débloquer les fonds, validez la fin de mission.</p>{step === 'photo' && (<div className="space-y-4 animate-in fade-in"><div className="aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-jobgreen hover:text-jobgreen transition-all" onClick={() => setStep('geo')}><Camera size={48} className="mb-2" /><span className="font-bold text-sm">Prendre photo "Après"</span><span className="text-[10px] text-gray-400 mt-1">Camera requise</span></div><Button variant="ghost" onClick={onClose} className="w-full">Annuler</Button></div>)}{step === 'geo' && (<div className="space-y-6 animate-in slide-in-from-right-4"><div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center gap-4 border border-blue-100 text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-pulse"><Navigation size={32} /></div><div><h3 className="font-bold text-blue-900">Géolocalisation</h3><p className="text-xs text-blue-700 mt-1">Nous vérifions que vous êtes sur le lieu d'intervention.</p></div></div><Button onClick={handleGeoLocate} isLoading={isLocating} className="w-full h-14 text-base shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">{isLocating ? 'Acquisition GPS...' : 'Valider ma position'}</Button></div>)}{step === 'confirm' && (<div className="space-y-6 animate-in zoom-in duration-300"><div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4"><CheckCircle2 size={32} /></div><h3 className="font-bold text-green-900 text-lg">Preuves Validées</h3><ul className="text-xs text-green-700 mt-3 space-y-2 text-left bg-white/50 p-3 rounded-xl"><li className="flex items-center gap-2"><CheckCircle2 size={12} /> Photo ajoutée au dossier</li><li className="flex items-center gap-2"><CheckCircle2 size={12} /> Position GPS confirmée (± 5m)</li><li className="flex items-center gap-2"><CheckCircle2 size={12} /> Horodatage certifié</li></ul></div><Button onClick={onSubmit} className="w-full h-14 text-lg shadow-lg shadow-green-500/20 bg-jobgreen hover:bg-green-700">Terminer la Mission</Button></div>)}</div></div></div>);
};

export const JobDetails: React.FC<JobDetailsProps> = ({ job: initialJob, onBack, onNavigate }) => {
    // REACTIVE JOB FETCHING: Use ID to get latest state from context
    const { user, jobs, savedJobIds, toggleSavedJob, addNotification, updateJob, openInfoModal, incrementJobView, applyToJob, addJobComment, getOrCreateConversation, addMessageToConversation, setActiveConversationId } = useUser();
    const job = jobs.find(j => j.id === initialJob.id) || initialJob;

    const [activeTab, setActiveTab] = useState<'photos' | 'map'>('photos');
    const [showNegotiate, setShowNegotiate] = useState(false);
    const [commentText, setCommentText] = useState('');
    
    // Updated Boost UI State
    const [showBoostModal, setShowBoostModal] = useState(false);
    const [selectedBoost, setSelectedBoost] = useState<'basic' | 'urgent' | 'none'>('basic');
    const [boostDuration, setBoostDuration] = useState(1);
    const [showBoostValidation, setShowBoostValidation] = useState(false);
    const [showBoostSuccess, setShowBoostSuccess] = useState(false);

    const [showProofModal, setShowProofModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const viewCounted = useRef(false);
    const isOwner = job.postedBy.id === user.id;

    // --- PRICING UNIT LABEL (Verbose) ---
    const unitLabelVerbose = {
        'fixed': '',
        'hourly': '/ Heure',
        'daily': '/ Jour',
        'monthly': '/ Mois'
    }[job.pricingUnit || 'fixed'];

    useEffect(() => {
        if (!isOwner && !viewCounted.current) {
            incrementJobView(job.id);
            viewCounted.current = true;
        }
    }, [isOwner, job.id]);

    const displayPhotos = (job.images && job.images.length > 0) ? job.images : DEFAULT_JOB_PHOTOS;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    // ... (Scroll logic and arrows remain same) ...
    useEffect(() => {
        const KEY = 'joblibre_arrows_seen_at';
        const lastSeen = localStorage.getItem(KEY);
        const now = Date.now();
        if (!lastSeen || (now - parseInt(lastSeen) > 24 * 60 * 60 * 1000)) setShowArrows(true);
    }, []);
    const dismissArrows = () => { if (showArrows) { setShowArrows(false); localStorage.setItem('joblibre_arrows_seen_at', Date.now().toString()); } };
    const scrollToImage = (index: number) => { if (carouselRef.current) { carouselRef.current.scrollTo({ left: carouselRef.current.offsetWidth * index, behavior: 'smooth' }); setCurrentImageIndex(index); } };
    const handleScroll = () => { dismissArrows(); if (carouselRef.current) { const newIndex = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth); if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex); } };
    const nextImage = () => { dismissArrows(); scrollToImage(currentImageIndex === displayPhotos.length - 1 ? 0 : currentImageIndex + 1); };
    const prevImage = () => { dismissArrows(); scrollToImage(currentImageIndex === 0 ? displayPhotos.length - 1 : currentImageIndex - 1); };

    const [offer, setOffer] = useState<number>(job.budget > 0 ? job.budget : 10000);
    const [loading, setLoading] = useState(false);
    
    // --- UPDATED APPLICATION LOGIC ---
    // Check if user has already applied via tracked IDs
    const hasApplied = user.appliedJobIds?.includes(job.id) || false;
    
    const isHiring = job.type === 'hiring';
    const isSaved = savedJobIds.includes(job.id);
    const isAssignedToMe = job.assignedTo?.id === user.id || (job.status === 'taken' && hasApplied); // Simplification for demo
    const userLimits = TIER_LIMITS[user.tier];
    const appLimit = userLimits.maxApplications;
    const appsUsed = user.monthlyApplicationsUsed;
    const isQuotaExceeded = appsUsed >= appLimit;
    const canNegotiate = userLimits.canNegotiate;
    
    // VISIBILITY LOGIC FIX: Owner always sees budget
    const isBudgetMasked = !isOwner && job.budget > userLimits.maxBudgetView;

    const handleToggleSave = () => { toggleSavedJob(job.id); addNotification(isSaved ? 'Retiré' : 'Sauvegardé', `L'annonce a été ${isSaved ? 'retirée de' : 'ajoutée à'} vos favoris.`, 'success'); }
    const handleShare = async () => { if (navigator.share) { try { await navigator.share({ title: `JobLibre: ${job.title}`, text: `Regarde cette mission sur JobLibre : ${job.title}`, url: window.location.href }); } catch (error) { console.log('Error sharing', error); } } else { alert("Lien copié dans le presse-papier !"); } };
    const handleOpenMap = () => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`, '_blank'); };
    
    const handleOfferSubmit = () => { 
        setLoading(true); 
        
        // 1. Create/Get Conversation
        const conversationId = getOrCreateConversation(job.postedBy, job);

        // 2. Send Negotiation Message
        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            text: `Je vous propose ${offer.toLocaleString()} FCFA pour cette mission.`,
            timestamp: 'À l\'instant',
            type: 'negotiation',
            metadata: { amount: offer, status: 'pending', jobId: job.id }
        };
        addMessageToConversation(conversationId, msg);

        // 3. Set Active Conversation & Redirect
        setTimeout(() => { 
            setLoading(false); 
            setShowNegotiate(false); 
            setActiveConversationId(conversationId);
            if (onNavigate) {
                onNavigate(AppTab.MESSAGES);
            }
        }, 1000); 
    };
    
    // --- NEW APPLY HANDLER ---
    const handleApply = () => { 
        if (isQuotaExceeded) { setShowUpgradeModal(true); return; } 
        setLoading(true); 
        setTimeout(() => { 
            applyToJob(job);
            setLoading(false); 
            // Trigger Navigation
            if (onNavigate) {
                onNavigate(AppTab.MESSAGES);
            }
        }, 1500); 
    };
    
    const handleProofSubmit = () => { updateJob(job.id, { status: 'completed' }); addNotification('Mission Terminée', 'Les fonds seront libérés après validation client.', 'success'); setShowProofModal(false); onBack(); };
    
    const triggerUpgrade = () => { setShowUpgradeModal(true); };

    const handleConfirmBoost = (boostType: 'basic' | 'urgent') => {
        if (boostType === 'basic') updateJob(job.id, { isBoosted: true });
        if (boostType === 'urgent') updateJob(job.id, { isUrgent: true, isBoosted: true });
        setShowBoostValidation(false);
        setShowBoostModal(false);
        setTimeout(() => setShowBoostSuccess(true), 300);
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addJobComment(job.id, commentText);
        setCommentText('');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-safe relative">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-50 px-4 py-3 flex justify-between items-center border-b border-gray-200 transition-all">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform"><ArrowLeft size={22} className="text-gray-900" /></button>
                <div className="flex flex-col items-center"><span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Mission</span><span className="font-black text-sm text-gray-900 truncate max-w-[150px]">{job.title}</span></div>
                <div className="flex gap-2 -mr-2"><button onClick={handleToggleSave} className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform"><Bookmark size={22} className={cn("text-gray-900 transition-all", isSaved ? "fill-jobgold text-jobgold" : "")} /></button><button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform"><Share2 size={22} className="text-gray-900" /></button></div>
            </div>

            <div className="pb-32">
                <div className="bg-white border-b border-gray-200 pb-6">
                    <div className="h-64 w-full relative bg-gray-100 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10"></div>
                        {activeTab === 'photos' ? (<><div ref={carouselRef} onScroll={handleScroll} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">{displayPhotos.map((photo, i) => (<div key={i} className="w-full h-full flex-shrink-0 snap-center"><img src={photo} className="w-full h-full object-cover" alt={`Job ${i+1}`} /></div>))}</div>{displayPhotos.length > 1 && (<><button onClick={(e) => { e.stopPropagation(); prevImage(); }} className={cn("absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm z-20 transition-all duration-500", showArrows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none")}><ChevronLeft size={24} /></button><button onClick={(e) => { e.stopPropagation(); nextImage(); }} className={cn("absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm z-20 transition-all duration-500", showArrows ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none")}><ChevronRightIcon size={24} /></button></>)}<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">{displayPhotos.map((_, i) => (<div key={i} className={cn("h-1.5 rounded-full transition-all duration-300 shadow-sm", i === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50")} />))}</div></>) : (<div onClick={handleOpenMap} className="w-full h-full relative cursor-pointer"><img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/9.45,0.41,13,0/600x400?access_token=pk.mock`} className="w-full h-full object-cover" alt="Map" /><div className="absolute inset-0 bg-black/10 flex items-center justify-center"><button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-xs hover:scale-105 transition-transform"><ExternalLink size={14}/> Ouvrir GPS</button></div></div>)}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur p-1 rounded-xl shadow-lg flex gap-1 border border-white/50 z-20"><button onClick={() => setActiveTab('photos')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2", activeTab === 'photos' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100")}><ImageIcon size={14} /> Photos</button><button onClick={() => setActiveTab('map')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2", activeTab === 'map' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100")}><MapPin size={14} /> Carte</button></div>
                    </div>
                    <div className="px-5 pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2 items-center flex-wrap">
                                <span className="bg-jobgreen/10 text-jobgreen px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-jobgreen/20">{job.category}</span>
                                {job.isUrgent ? (
                                    <div className="relative group/badge overflow-hidden rounded-md">
                                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wide border border-red-400 flex items-center gap-1 shadow-sm relative">
                                            <div className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"></div>
                                            <div className="animate-wiggle-violent relative z-10"><Zap size={8} fill="white" /></div>
                                            <span className="relative z-10">URGENT</span>
                                        </div>
                                    </div>
                                ) : job.isBoosted ? (
                                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-orange-200 flex items-center gap-1">
                                        <TrendingUp size={12} strokeWidth={3} />
                                        <span>Boosté</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{job.title}</h1>
                        <div className="text-sm text-gray-500 font-medium flex items-center gap-2"><MapPin size={14} /> {job.location}</div>
                    </div>
                </div>

                <div className="px-4 mt-6 space-y-6">
                    {isOwner && job.isBoosted && (
                        <div className="animate-in slide-in-from-bottom-4">
                            <CampaignDashboard job={job} onInfo={openInfoModal} />
                        </div>
                    )}

                    {!isOwner && !isAssignedToMe && (
                        <div onClick={() => isQuotaExceeded && triggerUpgrade()} className={cn("rounded-2xl p-4 border flex items-start gap-3 relative overflow-hidden transition-all active:scale-98 cursor-pointer", isQuotaExceeded ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100")}>
                            <div className={cn("p-2 rounded-full shrink-0", isQuotaExceeded ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")}><AlertOctagon size={20} /></div>
                            <div className="flex-1 z-10"><h3 className={cn("font-black text-sm uppercase mb-1", isQuotaExceeded ? "text-red-900" : "text-blue-900")}>Vos Quotas Mensuels</h3><div className="w-full bg-white/50 h-2 rounded-full mb-2 overflow-hidden border border-black/5"><div className={cn("h-full transition-all duration-500", isQuotaExceeded ? "bg-red-500" : "bg-blue-500")} style={{ width: `${Math.min((appsUsed / appLimit) * 100, 100)}%` }}></div></div><p className={cn("text-xs font-medium leading-tight", isQuotaExceeded ? "text-red-800" : "text-blue-800")}>Vous avez utilisé <span className="font-bold">{appsUsed} / {appLimit}</span> candidatures. {isQuotaExceeded ? " Touchez pour débloquer l'illimité." : " Choisissez bien vos missions."}</p></div>
                        </div>
                    )}
                    <div onClick={() => isBudgetMasked && triggerUpgrade()} className={cn("bg-gradient-to-br rounded-2xl p-5 shadow-lg relative overflow-hidden transform transition-all active:scale-[0.99] cursor-pointer", isBudgetMasked ? "from-gray-800 to-gray-900 border-2 border-jobgold/50" : "from-gray-900 to-gray-800")}>
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <div className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                    Budget Client
                                </div>
                                <div className="text-3xl font-black tracking-tight flex items-center gap-1.5 text-jobgold">
                                    {isBudgetMasked ? (
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <EyeOff size={24} /> <span className="blur-sm select-none">350.000</span>
                                        </div>
                                    ) : (
                                        job.budget > 0 ? (
                                            <>
                                                <span className="text-jobgold">{job.budget.toLocaleString()}</span>
                                                <span className="text-lg text-gray-400 ml-1">FCFA</span>
                                                <span className="text-sm font-bold text-gray-500 ml-1">{unitLabelVerbose}</span>
                                            </>
                                        ) : <span className="text-jobgold">Sur Devis</span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                {isBudgetMasked ? (
                                    <Lock size={24} className="text-jobgold" />
                                ) : (
                                    <div className="animate-wiggle-violent">
                                        <Shield size={24} className="text-jobgold fill-jobgold/20" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><SectionTitle label="Description de la mission" info="Détails fournis par le client." onInfo={openInfoModal} /><div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 mt-1"><FileText size={16} /></div><p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{job.description || "Aucune description détaillée fournie."}</p></div></div>
                    
                    {/* COMMENT SECTION IN DETAILS */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <SectionTitle label={`Commentaires (${job.comments?.length || 0})`} info="Questions publiques sur cette mission." onInfo={openInfoModal} />
                        
                        <div className="space-y-4 mb-4">
                            {job.comments && job.comments.length > 0 ? (
                                job.comments.map((comment) => {
                                    const isMe = comment.userId === user.id;
                                    return (
                                        <div key={comment.id} className={cn("flex gap-3", isMe ? "flex-row-reverse" : "")}>
                                            <img src={comment.userAvatar} className="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1" />
                                            <div className={cn("max-w-[85%] rounded-xl p-3 text-sm", isMe ? "bg-blue-50 text-gray-900 rounded-tr-none" : "bg-gray-50 text-gray-900 rounded-tl-none")}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-xs text-gray-900">{isMe ? "Moi" : comment.userName}</span>
                                                    {comment.isOwner && <span className="bg-jobgreen text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-bold"><Shield size={8} /> Auteur</span>}
                                                    <span className="text-[9px] text-gray-400">{comment.timestamp}</span>
                                                </div>
                                                <p className="text-gray-700">{comment.text}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-gray-400 text-xs py-4">Aucun commentaire pour l'instant.</p>
                            )}
                        </div>

                        <form onSubmit={handleSendComment} className="flex gap-2">
                            <div className="flex-1 bg-gray-50 rounded-xl flex items-center px-4 py-2 border border-gray-200 focus-within:border-jobgreen focus-within:bg-white transition-colors">
                                <input 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Posez une question..."
                                    className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-900"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={!commentText.trim()}
                                className="w-10 h-10 bg-jobgreen text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-900/10 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="h-6"></div>
                </div>
            </div>

            {/* --- ACTION FOOTER --- */}
            
            {isAssignedToMe && job.status === 'taken' && (
                 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-40 shadow-up">
                    <Button onClick={() => setShowProofModal(true)} className="w-full h-14 rounded-xl font-black text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"><Camera size={20} className="mr-2" /> Valider Fin de Mission</Button>
                </div>
            )}
            
            {!isOwner && !isAssignedToMe && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-3 max-w-lg mx-auto">
                        <Button 
                            onClick={() => { if (canNegotiate) { setShowNegotiate(true); } else { triggerUpgrade(); } }} 
                            variant="secondary" 
                            className="flex-1 font-bold rounded-xl border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1 transition-all h-14 text-sm relative" 
                            disabled={hasApplied}
                        >
                            {!canNegotiate && <Lock size={14} className="absolute top-1 right-1 text-yellow-700 opacity-50" />}
                            {canNegotiate ? "Négocier" : "Prix Fixe"}
                        </Button>
                        <Button 
                            onClick={handleApply} 
                            isLoading={loading} 
                            disabled={hasApplied} 
                            className={cn("flex-[2] font-black text-lg rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all h-14 shadow-lg", hasApplied ? "bg-gray-100 text-gray-500 border-gray-200 shadow-none" : isQuotaExceeded ? "bg-gray-200 text-gray-500 border-gray-300" : isHiring ? "bg-jobgreen border-green-800 shadow-green-900/20" : "bg-blue-600 hover:bg-blue-700 border-blue-800 shadow-blue-900/20")}
                        >
                            {hasApplied ? (<span className="flex items-center gap-2"><CheckCircle2 size={20} /> Voir Candidature</span>) : isQuotaExceeded ? (<span className="flex items-center gap-2"><Lock size={20} /> Quota Atteint</span>) : isHiring ? (<span className="flex items-center gap-2"><Send size={20} /> Postuler</span>) : (<span className="flex items-center gap-2"><Phone size={20} /> Réserver</span>)}
                        </Button>
                    </div>
                </div>
            )}
            
            {isOwner && !job.isBoosted && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-40">
                     <div className="max-w-lg mx-auto">
                        <Button 
                            onClick={() => setShowBoostModal(true)}
                            className="w-full h-14 rounded-xl font-black bg-orange-500 hover:bg-orange-600 text-white border-b-4 border-orange-700 active:border-b-0 active:translate-y-1"
                        >
                            <Zap size={18} className="mr-2 fill-white" /> Booster l'annonce
                        </Button>
                     </div>
                </div>
            )}

            {/* --- MODALS --- */}
            {showNegotiate && canNegotiate && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in" onClick={() => setShowNegotiate(false)}/>
                    <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 pointer-events-auto shadow-2xl animate-in slide-in-from-bottom-10 border-t-2 border-gray-200 relative pb-safe">
                         <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                         <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-black text-gray-900">Faire une offre</h2><p className="text-sm text-gray-500 font-medium">Proposez votre tarif pour cette mission.</p></div><div className="w-12 h-12 rounded-full bg-jobgold/10 flex items-center justify-center border border-jobgold/20"><Wallet className="text-jobgold" size={24} /></div></div>
                         <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 mb-6 flex items-center justify-between"><div className="text-sm font-bold text-gray-500">Budget client</div><div className="text-xl font-black text-gray-900">{job.budget > 0 ? job.budget.toLocaleString() : 'Sur devis'} <span className="text-sm text-gray-400">FCFA</span></div></div>
                         <div className="flex items-center justify-between gap-4 mb-6"><button onClick={() => setOffer(p => Math.max(0, p - 500))} className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 active:scale-90 transition-all hover:bg-gray-200"><Minus size={28} strokeWidth={3} /></button><div className="flex-1 text-center bg-gray-50 py-3 rounded-2xl border border-gray-100"><div className="text-xs font-bold text-gray-400 uppercase mb-1">Votre Offre</div><div className="text-3xl font-black text-gray-900 tracking-tight">{offer.toLocaleString()} <span className="text-lg text-gray-400">F</span></div></div><button onClick={() => setOffer(p => p + 500)} className="w-16 h-16 rounded-2xl bg-jobgreen flex items-center justify-center text-white active:scale-90 transition-all shadow-lg shadow-green-200 hover:bg-green-700"><Plus size={28} strokeWidth={3} /></button></div>
                         <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6"><Shield className="text-blue-600 shrink-0 mt-0.5" size={18} /><div className="text-xs text-blue-800 font-medium"><span className="font-bold">Protection JobLibre</span><br/>Le paiement est bloqué jusqu'à ce que le client valide la fin de la mission.</div></div>
                         <div className="flex gap-3"><Button variant="ghost" onClick={() => setShowNegotiate(false)} className="flex-1 border-2 border-gray-200 h-14 font-bold text-gray-500">Annuler</Button><Button className="flex-[2] h-14 text-base font-bold shadow-lg shadow-green-900/10" onClick={handleOfferSubmit} isLoading={loading} disabled={offer <= 0}>Envoyer</Button></div>
                    </div>
                </div>
            )}

            {showBoostModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowBoostModal(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 pb-safe shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-6 pb-2">
                            <h2 className="text-xl font-black text-gray-900 text-center mb-1">Booster l'annonce</h2>
                            <p className="text-sm text-gray-500 text-center font-medium">Augmentez votre visibilité.</p>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <BoostSelector 
                                selectedBoostId={selectedBoost === 'none' ? 'basic' : selectedBoost} 
                                onSelect={(id) => id !== 'none' && setSelectedBoost(id)} 
                                userCoins={user.bronzeCoins}
                                duration={boostDuration}
                                onDurationChange={setBoostDuration}
                            />
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <Button 
                                onClick={() => setShowBoostValidation(true)} 
                                className="w-full h-14 text-lg rounded-xl shadow-xl"
                            >
                                Continuer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <BoostValidationModal 
                isOpen={showBoostValidation} 
                onClose={() => setShowBoostValidation(false)}
                boostId={selectedBoost === 'none' ? 'basic' : selectedBoost} 
                duration={boostDuration}
                onConfirm={() => handleConfirmBoost(selectedBoost === 'none' ? 'basic' : selectedBoost)} 
            />

            <BoostSuccessModal 
                isOpen={showBoostSuccess}
                onClose={() => setShowBoostSuccess(false)}
                boostType={selectedBoost === 'none' ? 'basic' : selectedBoost}
                duration={boostDuration}
            />
            
            {showProofModal && (<ProofOfWorkModal onClose={() => setShowProofModal(false)} onSubmit={handleProofSubmit} />)}
            <CoinShopModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} initialTab='premium' />
        </div>
    );
};
