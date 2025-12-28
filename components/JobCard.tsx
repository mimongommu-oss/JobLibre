
import React, { useMemo, useState } from 'react';
import { MapPin, Briefcase, Users, Crown, Star, Lock, Zap, Bookmark, User, Send, Phone, Settings, Lightbulb, Eye, TrendingUp, MoreHorizontal, Flag, Trash2, Edit, MessageCircle } from 'lucide-react';
import { Job } from '../types';
import { useUser } from '../context/UserContext';
import { cn, formatMoney, parseLocation } from '../lib/utils';
import { TIER_LIMITS } from '../constants';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  onAction?: (action: 'apply' | 'contact' | 'unlock' | 'manage') => void;
}

// --- REUSABLE SHINE ELEMENT WITH RANDOM DELAY ---
const GlassShine = () => {
    const delay = useMemo(() => Math.random() * 5, []);
    return (
        <div 
            className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" 
            style={{ animationDelay: `${delay}s` }}
        />
    );
};

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, onAction }) => {
    const { user, toggleSavedJob, savedJobIds, addNotification, setActiveCommentJobId } = useUser();
    const [showMenu, setShowMenu] = useState(false);
    
    const isSaved = savedJobIds.includes(job.id);
    const isHiring = job.type === 'hiring';

    // --- OWNER CHECK ---
    const isOwner = job.postedBy.id === user.id;

    // --- LOCATION MATCHING ---
    const userLoc = parseLocation(user.location);
    const jobLoc = parseLocation(job.location);
    
    // Strict match logic: Same City AND Same Neighborhood
    const isNeighborhoodMatch = !isOwner && 
                                userLoc.city?.toLowerCase() === jobLoc.city?.toLowerCase() &&
                                userLoc.neighborhood?.toLowerCase().trim() === jobLoc.neighborhood?.toLowerCase().trim();

    // --- ACCESS LOGIC (Modified: Owner is never locked) ---
    // 1. Tier Lock
    const minTier = job.minTierRequired || 'standard';
    const isTierLocked = !isOwner && (
        (minTier === 'premium' && user.tier !== 'premium') ||
        (minTier === 'verified' && user.tier === 'standard')
    );

    // 2. Budget Lock
    const isBudgetLocked = !isOwner && job.budget > TIER_LIMITS[user.tier].maxBudgetView;

    // 3. Masking & Locking Status
    // If I am the owner, NOTHING is locked or masked for me.
    const isLocked = !isOwner && (isTierLocked || isBudgetLocked);
    const isPriceMasked = isLocked;

    // Visual Status Helpers
    const isPremiumUser = job.postedBy.isPremium;
    const isVerifiedUser = job.postedBy.isVerified && !isPremiumUser;

    // --- PRICING UNIT LABEL ---
    const unitLabel = {
        'fixed': '',
        'hourly': '/h',
        'daily': '/j',
        'monthly': '/mois'
    }[job.pricingUnit || 'fixed'];

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSavedJob(job.id);
        
        if (!isSaved) {
            addNotification('Sauvegardé', 'Retrouvez-la dans l\'onglet "Favoris" de l\'accueil.', 'success');
        } else {
            addNotification('Retiré', 'Annonce retirée de vos favoris', 'info');
        }
    };

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveCommentJobId(job.id);
    };

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAction) {
            if (isOwner) onAction('manage');
            else if (isLocked) onAction('unlock');
            else if (isHiring) onAction('apply');
            else onAction('contact');
        }
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        addNotification('Signalement envoyé', 'Nous allons analyser cette annonce. Merci de votre vigilance.', 'success');
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
            addNotification('Supprimé', 'Votre annonce a été retirée.', 'info');
            // Logic to remove job from state would go here
        }
    };

    const commentCount = job.comments?.length || 0;

    return (
        <div 
            onClick={onClick}
            className="relative mb-6 group active:scale-[0.98] transition-transform duration-200 cursor-pointer pt-4"
            onMouseLeave={() => setShowMenu(false)}
        >
            
            {/* --- BADGE SYSTEM (Z-30) --- */}
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-30 flex gap-1 items-center flex-col sm:flex-row pointer-events-none">
                {isOwner ? (
                    <div className="relative overflow-hidden bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-blue-200">
                        <GlassShine />
                        <User size={10} className="text-white relative z-10" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 relative z-10">MON ANNONCE</span>
                    </div>
                ) : null}

                {/* NEIGHBORHOOD MATCH BADGE (Only for others) */}
                {isNeighborhoodMatch && (
                    <div className="relative overflow-hidden bg-teal-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-teal-200 animate-in zoom-in">
                        <GlassShine />
                        <Lightbulb size={12} className="animate-bulb-flash relative z-10" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 whitespace-nowrap relative z-10">
                            DANS TON QUARTIER
                        </span>
                    </div>
                )}

                {/* LOCK BADGE (Only if locked) */}
                {isLocked ? (
                    <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-yellow-200">
                        <GlassShine />
                        <Lock size={10} className="text-white relative z-10" />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 whitespace-nowrap relative z-10">
                            RÉSERVÉ {minTier === 'premium' ? 'CLUB PRO' : 'VÉRIFIÉS'}
                        </span>
                    </div>
                ) : (
                    // IF NOT LOCKED, SHOW BOOST/URGENT BADGES (Hierarchy: Urgent > Sponsored)
                    <>
                        {job.isUrgent ? (
                            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-red-200">
                                <GlassShine />
                                <div className="animate-wiggle-violent relative z-10"><Zap size={10} fill="white" /></div>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 relative z-10">URGENT</span>
                            </div>
                        ) : job.isBoosted ? (
                            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border-2 border-white shadow-md shadow-orange-200">
                                <GlassShine />
                                <TrendingUp size={10} strokeWidth={3} className="text-white relative z-10" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none pt-0.5 relative z-10">SPONSORISÉ</span>
                            </div>
                        ) : null}
                    </>
                )}
            </div>

            {/* --- MAIN CARD CONTAINER --- */}
            <div className={cn(
                "relative bg-white rounded-[28px] p-5 overflow-hidden border-2 transition-all duration-300 z-0",
                isOwner ? "border-blue-500/30 bg-blue-50/5" :
                isNeighborhoodMatch ? "border-teal-500/40 bg-teal-50/10" :
                isLocked ? "border-yellow-500/40 bg-yellow-50/5" :
                job.isUrgent ? "border-red-500/30 bg-red-50/5" :
                job.isBoosted ? "border-orange-400/30 bg-orange-50/10" : 
                isPremiumUser ? "border-yellow-400/30 bg-gradient-to-br from-white via-yellow-50/10 to-white" :
                "border-gray-100 hover:border-gray-200 shadow-sm"
            )}>
                
                {/* HEAD: User Info & Price */}
                <div className="flex justify-between items-start mb-3 mt-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={cn(
                                "p-[2px] rounded-[18px]",
                                isOwner ? "bg-blue-500" :
                                isPremiumUser ? "bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-200 shadow-gold-glow" :
                                isVerifiedUser ? "bg-blue-500 shadow-sm" : 
                                "bg-transparent"
                            )}>
                                <img 
                                    src={job.postedBy.avatar} 
                                    alt={job.postedBy.name} 
                                    className="w-11 h-11 rounded-2xl object-cover border-2 border-white bg-gray-50"
                                />
                            </div>
                            {isPremiumUser && !isOwner && (
                                <div className="absolute -bottom-1 -right-1 bg-jobgold text-white p-0.5 rounded-full border border-white z-10 shadow-sm">
                                    <Crown size={8} fill="currentColor" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                    {isOwner ? "Moi" : job.postedBy.name}
                                </h3>
                                {isPremiumUser && !isOwner && (
                                    <span className="text-[8px] font-black text-yellow-700 bg-yellow-100 px-1 rounded border border-yellow-200 uppercase">PRO</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                 <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                    <Star size={8} className="fill-jobgold text-jobgold"/> {job.postedBy.rating}
                                 </div>
                                 <span className="text-[10px] text-gray-400 font-medium">{job.postedBy.jobsCompleted} jobs</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* TOP RIGHT MENU & PRICE */}
                    <div className="text-right flex flex-col items-end">
                        {/* 3 DOTS MENU */}
                        <div className="relative -mt-2 -mr-2 mb-1">
                            <button 
                                onClick={toggleMenu}
                                className="p-2 text-gray-300 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <MoreHorizontal size={20} />
                            </button>
                            
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 w-40 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {isOwner ? (
                                        <>
                                            <button onClick={handleActionClick} className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <Edit size={14} /> Modifier
                                            </button>
                                            <button onClick={handleDelete} className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50">
                                                <Trash2 size={14} /> Supprimer
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={handleReport} className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <Flag size={14} /> Signaler
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {isPriceMasked ? (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1 text-gray-300 blur-[2px] select-none">
                                    <span className="font-black text-lg">150 000</span>
                                    <span className="text-xs font-bold">F</span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full mt-1">
                                    <Lock size={8} /> {isTierLocked ? "Verrouillé" : "Masqué"}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={cn(
                                    "font-black text-lg tracking-tight leading-none flex items-center justify-end gap-1", 
                                    isHiring ? "text-gray-900" : "text-jobgreen"
                                )}>
                                    {job.budget > 0 ? (
                                        <>
                                            {formatMoney(job.budget)}
                                            <span className="text-sm font-bold text-gray-500">{unitLabel}</span>
                                        </>
                                    ) : 'Sur devis'} 
                                    <span className="text-xs text-gray-400 font-bold mt-1">F</span>
                                </div>
                                <div className="text-[10px] font-bold mt-1 uppercase tracking-wide text-gray-400">
                                    {isHiring ? 'Budget' : 'Tarif'}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* BODY: Content */}
                <div className="mb-4 relative z-10">
                    <h3 className="font-black text-lg text-gray-900 leading-tight mb-2 line-clamp-1">
                        {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-gray-200/50">
                            {job.category}
                        </span>
                        <span className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border",
                            isNeighborhoodMatch ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                            <MapPin size={10} /> {job.location.split(',')[0]}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                        {job.description}
                    </p>
                </div>

                {/* FOOTER - ACTION AREA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 border-dashed relative z-10">
                    {/* Left: Metadata */}
                    <div className="flex items-center gap-3">
                        {/* OWNER ONLY: VIEWS */}
                        {isOwner && (
                             <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                <Eye size={14} /> {job.views || 0}
                             </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Briefcase size={14} className={isHiring ? "text-gray-900" : "text-jobgreen"} />
                            <span className="text-gray-600 hidden xs:inline">{isHiring ? 'Offre' : 'Demande'}</span>
                        </div>
                        {job.applicants !== undefined && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                 <Users size={14} />
                                 <span className="text-gray-600">{job.applicants}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={handleSave}
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border active:scale-75",
                                isSaved 
                                    ? "bg-red-50 text-red-500 border-red-200 shadow-sm" 
                                    : "bg-white text-gray-300 border-gray-100 hover:border-gray-200 hover:text-gray-400"
                            )}
                        >
                            <Bookmark size={18} className={cn("transition-all duration-300", isSaved ? "fill-current scale-110" : "")} />
                        </button>

                        <button 
                            onClick={handleComment}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border bg-white text-gray-300 border-gray-100 hover:border-gray-200 hover:text-gray-400 active:scale-75 relative"
                        >
                            <MessageCircle size={18} />
                            {commentCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-jobgreen text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                                    {commentCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleActionClick}
                            className={cn(
                                "h-10 px-4 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wide shadow-sm transition-transform active:scale-95",
                                isOwner 
                                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                                : isLocked
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-yellow-200"
                                : isHiring
                                    ? "bg-jobgreen text-white shadow-green-200"
                                    : "bg-blue-600 text-white shadow-blue-200"
                            )}
                        >
                            {isOwner ? (
                                <>Gérer <Settings size={14} /></>
                            ) : isLocked ? (
                                <>Débloquer <Lock size={14} /></>
                            ) : isHiring ? (
                                <>Postuler <Send size={14} /></>
                            ) : (
                                <>Contacter <Phone size={14} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
