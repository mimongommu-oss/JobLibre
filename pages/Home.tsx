
import React, { useState, useEffect } from 'react';
import { Bell, Search, MapPin, Plus, Info, Briefcase, UserCheck, Heart, ChevronDown } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { AdCard } from '../components/AdCard';
import { HeroCarousel } from '../components/HeroCarousel'; // Imported
import { JobCardSkeleton } from '../components/ui/Skeleton';
import { StoryCircle } from '../components/StoryCircle';
import { StoryViewer } from '../components/StoryViewer';
import { SmartNotificationDrawer } from '../components/SmartNotificationDrawer';
import { CoinShopModal } from '../components/CoinShopModal';
import { QuickStoryModal } from '../components/QuickStoryModal';
import { AppTab, Job } from '../types';
import { useUser } from '../context/UserContext';
import { cn, parseLocation } from '../lib/utils';
import { Button } from '../components/ui/Button';

interface HomeProps {
    onChangeTab: (tab: AppTab) => void;
    onJobSelect: (job: Job) => void;
}

export const Home: React.FC<HomeProps> = ({ onChangeTab, onJobSelect }) => {
    const { user, jobs, stories, notifications, openInfoModal, savedJobIds, categories, getOrCreateConversation, setActiveConversationId } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [activeType, setActiveType] = useState<'hiring' | 'service_offer'>('hiring'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [viewedStories, setViewedStories] = useState<string[]>([]);
    const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    // Pagination State
    const BATCH_SIZE = 8;
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    
    // Geo Filter State with Persistence
    const [isGeoFilterActive, setIsGeoFilterActive] = useState(() => {
        try {
            const saved = localStorage.getItem('joblibre_geo_filter');
            return saved !== 'false'; // Default to true
        } catch { return true; }
    });
    
    // Modals State
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showQuickStory, setShowQuickStory] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        
        // CHECK INTENT FROM PROFILE (SHORTCUT)
        const openFavs = sessionStorage.getItem('open_favorites');
        if (openFavs === 'true') {
            setSelectedCategory('Favoris');
            sessionStorage.removeItem('open_favorites');
        }

        return () => clearTimeout(timer);
    }, []);

    // Persist Geo Filter Preference
    useEffect(() => {
        localStorage.setItem('joblibre_geo_filter', String(isGeoFilterActive));
    }, [isGeoFilterActive]);

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(BATCH_SIZE);
    }, [selectedCategory, activeType, searchQuery, isGeoFilterActive]);

    // --- GEO FILTERING LOGIC (STRICT) ---
    const userLoc = parseLocation(user.location);
    const userCity = (userLoc.city || '').toLowerCase().trim();
    const userHood = (userLoc.neighborhood || '').toLowerCase().trim();

    // Determine matches based on hierarchy
    const filteredJobs = jobs.filter(job => {
        // 0. FAVORITES FILTER OVERRIDE (If selected, we only check ID, but still respect search and maybe type)
        if (selectedCategory === 'Favoris') {
            const isSaved = savedJobIds.includes(job.id);
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              job.description.toLowerCase().includes(searchQuery.toLowerCase());
            // We also keep type filtering because "Saved Hiring" vs "Saved Talents" is useful
            const matchesType = job.type === activeType;
            return isSaved && matchesSearch && matchesType;
        }

        // 1. Basic Filters
        const matchesType = job.type === activeType;
        const matchesCategory = selectedCategory === 'Tout' || job.category === selectedCategory;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              job.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 2. Geographic Target Matching (STRICT)
        let matchesLocation = true;
        
        if (isGeoFilterActive) {
            const jobLoc = parseLocation(job.location);
            const jobCity = (jobLoc.city || '').toLowerCase().trim();
            const jobScope = job.targetZone?.scope;

            // Only show jobs in MY city or COUNTRY wide
            // Exclude jobs from other cities
            if (jobScope === 'COUNTRY') {
                matchesLocation = true;
            } else if (jobCity === userCity) {
                matchesLocation = true;
            } else {
                matchesLocation = false;
            }
        }

        return matchesType && matchesCategory && matchesSearch && matchesLocation;
    }).sort((a, b) => {
        // --- SMART SORTING: NEIGHBORHOOD MUST BE FIRST ---
        if (!isGeoFilterActive) return 0;

        const scoreA = getGeoScore(a);
        const scoreB = getGeoScore(b);

        return scoreB - scoreA; // Descending score (Higher is better)
    });

    // Helper to score geographic relevance
    function getGeoScore(job: Job): number {
        const jobLoc = parseLocation(job.location);
        const jobHood = (jobLoc.neighborhood || '').toLowerCase().trim();
        
        // 1. Strict Neighborhood Match (Top Priority - The "Ma Zone" Promise)
        if (userHood && jobHood === userHood) return 100;
        
        // 2. City Wide / General City (Mid Priority)
        // If it's in the same city but different neighborhood, it's a fallback
        return 10;
    }

    // SLICE FOR PAGINATION
    const displayedJobs = filteredJobs.slice(0, visibleCount);
    const hasMore = filteredJobs.length > visibleCount;

    const unreadNotifications = notifications.filter(n => !n.read).length;

    // --- SMART NAVIGATION LOGIC ---
    const handleNotificationAction = (actionType: string, target?: string) => {
        setIsNotifOpen(false); 

        switch(actionType) {
            case 'view_job':
                if (target) {
                    const job = jobs.find(j => j.id === target);
                    if (job) {
                        onJobSelect(job);
                    } else {
                        onChangeTab(AppTab.HOME);
                    }
                }
                break;
            case 'verify':
            case 'view_wallet':
            case 'boost':
                onChangeTab(AppTab.PROFILE);
                break;
            case 'create_job':
                onChangeTab(AppTab.CREATE);
                break;
            default:
                onChangeTab(AppTab.HOME);
                break;
        }
    };

    // --- QUICK ACTIONS HANDLER ---
    const handleJobAction = (job: Job, action: 'apply' | 'contact' | 'unlock' | 'manage') => {
        switch(action) {
            case 'unlock':
                setShowUpgradeModal(true);
                break;
            case 'apply':
                onJobSelect(job);
                break;
            case 'contact':
                // NEW: Redirect to Chat directly
                const conversationId = getOrCreateConversation(job.postedBy, job);
                setActiveConversationId(conversationId);
                onChangeTab(AppTab.MESSAGES);
                break;
            case 'manage':
                onJobSelect(job);
                break;
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + BATCH_SIZE);
    };

    return (
        <div className="min-h-screen bg-jobbg pb-24">
            {/* CHARTE NIVEAU 4 (NAVIGATION) : z-50 */}
            <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
                <div className="flex justify-between items-center mb-4">
                    {/* LOGO SECTION */}
                    <div className="flex items-center gap-2 animate-in slide-in-from-left-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-jobgreen to-green-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20 transform -rotate-3">
                            <span className="font-black text-xl italic tracking-tighter">JL</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">
                                Job<span className="text-jobgreen">Libre</span>
                            </h1>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Gabon</span>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                         {/* Location Pill */}
                         <div onClick={() => onChangeTab(AppTab.PROFILE)} className="hidden sm:flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer active:scale-95 transition-transform">
                            <MapPin size={14} className="text-jobgreen" />
                            <span className="text-xs font-bold text-gray-700 max-w-[100px] truncate">
                                {userLoc.neighborhood ? `${userLoc.neighborhood}, ${userLoc.city}` : userLoc.city || 'Libreville'}
                            </span>
                         </div>
                         
                         <button 
                            onClick={() => setIsNotifOpen(true)}
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                        >
                            <Bell size={24} className="text-gray-700" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={activeType === 'hiring' ? "Rechercher une mission..." : "Rechercher un talent..."}
                        className="w-full bg-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-jobgreen/20 focus:bg-white transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        onClick={() => openInfoModal("Filtre Ma Zone", "L'application affiche EN PREMIER les annonces qui correspondent exactement à votre Quartier. Ensuite, celles de votre Ville.")}
                        className="absolute right-3 top-2.5 p-1 bg-white rounded-lg shadow-sm border border-gray-100 hover:text-jobgreen"
                    >
                        <Info size={16} className="text-gray-400" />
                    </button>
                </div>
                
                {/* Mobile Location Sub-header */}
                <div className="flex items-center gap-1 sm:hidden mb-1 px-1 cursor-pointer" onClick={() => onChangeTab(AppTab.PROFILE)}>
                     <MapPin size={10} className="text-gray-400" />
                     <span className="text-[10px] font-bold text-gray-400 uppercase">{userLoc.neighborhood ? `${userLoc.neighborhood}, ${userLoc.city}` : userLoc.city || 'Localisation non définie'}</span>
                </div>
            </div>

            {/* Stories Rail */}
            <div className="bg-white pt-2 pb-4 mb-2 overflow-x-auto no-scrollbar border-b border-gray-100 relative">
                {/* Info bubble for stories */}
                <button 
                    onClick={() => openInfoModal("Urgence 24h", "Les Stories sont des annonces URGENTES qui expirent dans 24h. Utilisez le bouton + pour en créer une instantanément.")}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full z-10 shadow-sm"
                >
                    <Info size={12} className="text-gray-400" />
                </button>

                <div className="flex gap-4 px-4">
                     {/* Add Story Button (Trigger Modal) */}
                    <div className="flex flex-col items-center gap-1 min-w-[72px]">
                        <div 
                            onClick={() => setShowQuickStory(true)}
                            className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 p-[2px] cursor-pointer hover:border-jobgreen transition-colors active:scale-95"
                        >
                            <img src={user.avatar} className="w-full h-full rounded-full object-cover opacity-80 grayscale" alt="Me" />
                            <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-sm">
                                <Plus size={14} strokeWidth={4} />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-900">Ajouter</span>
                    </div>

                    {stories.map(story => (
                        <StoryCircle 
                            key={story.id} 
                            story={story} 
                            isViewed={viewedStories.includes(story.id)}
                            onClick={() => {
                                setActiveStoryId(story.id);
                                if (!viewedStories.includes(story.id)) {
                                    setViewedStories(prev => [...prev, story.id]);
                                }
                            }} 
                        />
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="px-4">
                
                {/* --- AD CAROUSEL (NEW) --- */}
                <HeroCarousel />

                {/* TYPE SWITCHER (MISSIONS vs TALENTS) */}
                <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 mb-6 shadow-inner">
                    <button
                        onClick={() => setActiveType('hiring')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-300",
                            activeType === 'hiring' 
                                ? "bg-white text-gray-900 shadow-md ring-1 ring-black/5 scale-[1.02]" 
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Briefcase size={16} className={activeType === 'hiring' ? 'text-jobgreen' : ''} />
                        Missions
                    </button>
                    <button
                        onClick={() => setActiveType('service_offer')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-300",
                            activeType === 'service_offer' 
                                ? "bg-white text-gray-900 shadow-md ring-1 ring-black/5 scale-[1.02]" 
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <UserCheck size={16} className={activeType === 'service_offer' ? 'text-jobgold' : ''} />
                        Talents (CV)
                    </button>
                </div>

                {/* Categories: Fixed Left & Scrollable Right */}
                <div className="flex items-center mb-6">
                    {/* FIXED SECTION */}
                    <div className="flex gap-2 shrink-0">
                        {['Tout', 'Favoris'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5",
                                    selectedCategory === cat
                                        ? cat === 'Favoris' ? "bg-red-50 text-white shadow-lg shadow-red-200" : "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                                        : "bg-white text-gray-500 border border-gray-200"
                                )}
                            >
                                {cat === 'Favoris' && <Heart size={12} className={selectedCategory === cat ? "fill-white" : "fill-gray-500"} />}
                                {cat === 'Favoris' ? `Mes Favoris` : cat}
                                {cat === 'Favoris' && savedJobIds.length > 0 && (
                                    <span className={cn(
                                        "ml-1 text-[9px] px-1.5 py-0.5 rounded-full",
                                        selectedCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                                    )}>
                                        {savedJobIds.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* DIVIDER */}
                    <div className="w-px h-6 bg-gray-200 mx-3 shrink-0"></div>

                    {/* SCROLLABLE SECTION */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-1 mask-fade-right">
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5",
                                    selectedCategory === cat.name
                                        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                                        : "bg-white text-gray-500 border border-gray-200"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        {selectedCategory === 'Favoris' 
                            ? 'Annonces Sauvegardées' 
                            : activeType === 'hiring' ? 'Missions Récentes' : 'Talents Disponibles'
                        }
                        {selectedCategory !== 'Favoris' && (
                            <button 
                                onClick={() => openInfoModal("Flux Localisé", "Le filtre 'Ma Zone' est actif. Les annonces de votre quartier sont en haut de liste (avec un badge spécifique).")}
                                className="text-gray-300 hover:text-jobgreen transition-colors"
                            >
                                <Info size={16} />
                            </button>
                        )}
                    </h2>

                    {/* Geo Toggle Swipe Button (Hidden if in Favorites mode) */}
                    {selectedCategory !== 'Favoris' && (
                        <div 
                            onClick={() => setIsGeoFilterActive(!isGeoFilterActive)}
                            className={cn(
                                "flex items-center gap-2 px-1.5 py-1 rounded-full border shadow-sm cursor-pointer transition-all duration-300",
                                isGeoFilterActive ? "bg-white border-green-200 shadow-green-100" : "bg-gray-100 border-gray-200"
                            )}
                        >
                            <span 
                                className={cn(
                                    "text-[10px] font-bold uppercase pl-1.5 transition-colors", 
                                    isGeoFilterActive ? "text-jobgreen" : "text-gray-400"
                                )}
                            >
                                {isGeoFilterActive ? "Ma Zone" : "Global"}
                            </span>
                            <div 
                                className={cn(
                                    "w-10 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center relative",
                                    isGeoFilterActive ? "bg-jobgreen" : "bg-gray-300"
                                )}
                            >
                                <div 
                                    className={cn(
                                        "w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 absolute top-0.5",
                                        isGeoFilterActive ? "left-[18px]" : "left-0.5"
                                    )} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Job List with Injected Ads and Pagination */}
                <div className="space-y-4">
                    {isLoading ? (
                        [1, 2, 3].map(i => <JobCardSkeleton key={i} />)
                    ) : (
                        <>
                            {displayedJobs.map((job, index) => (
                                <React.Fragment key={job.id}>
                                    <JobCard 
                                        job={job} 
                                        onClick={() => onJobSelect(job)} 
                                        onAction={(action) => handleJobAction(job, action)}
                                    />
                                    {/* Inject Ad after every 4 items (Index 3, 7, 11...) */}
                                    {(index + 1) % 4 === 0 && (
                                        <AdCard variant={index % 8 === 3 ? 'dark' : 'brand'} />
                                    )}
                                </React.Fragment>
                            ))}
                            
                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center pt-4 pb-8">
                                    <button 
                                        onClick={handleLoadMore}
                                        className="bg-white hover:bg-gray-50 text-gray-600 font-bold py-3 px-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 transition-all active:scale-95"
                                    >
                                        Charger plus d'annonces
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    
                    {!isLoading && filteredJobs.length === 0 && (
                        <div className="text-center py-12 opacity-50 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                            <Info size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-black text-gray-400 text-lg">
                                {selectedCategory === 'Favoris' 
                                    ? "Aucun favori enregistré." 
                                    : `Aucun résultat ${isGeoFilterActive ? "dans votre zone" : ""}.`
                                }
                            </p>
                            <p className="text-xs font-medium text-gray-400 mt-1">
                                {selectedCategory === 'Favoris'
                                    ? "Cliquez sur l'icône marque-page pour sauvegarder des annonces."
                                    : isGeoFilterActive ? "Essayez de désactiver le filtre 'Ma Zone'." : "Essayez une autre catégorie."
                                }
                            </p>
                            {isGeoFilterActive && selectedCategory !== 'Favoris' && (
                                <button 
                                    onClick={() => setIsGeoFilterActive(false)}
                                    className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-bold text-gray-600"
                                >
                                    Passer en vue Global
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Notification Drawer (Niveau 5 - géré en interne avec z-[100]) */}
            <SmartNotificationDrawer 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)} 
                onAction={handleNotificationAction}
            />

            {/* Story Viewer Modal (Niveau 5) */}
            {activeStoryId && (
                <StoryViewer 
                    stories={stories} 
                    initialStoryId={activeStoryId} 
                    onClose={() => setActiveStoryId(null)}
                    onViewJob={(job) => {
                        setActiveStoryId(null);
                        onJobSelect(job);
                    }}
                />
            )}

            {/* Quick Upgrade Modal */}
            <CoinShopModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                initialTab='premium' 
            />

            {/* NEW: Quick Story Creation Modal */}
            <QuickStoryModal 
                isOpen={showQuickStory}
                onClose={() => setShowQuickStory(false)}
            />
        </div>
    );
};
