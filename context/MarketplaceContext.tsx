
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, StatusStory, ChatMessage, JobComment } from '../types';
import { MOCK_JOBS, MOCK_STORIES, CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { useChatContext } from './ChatContext';

interface Category {
    id: string;
    name: string;
    icon?: string;
}

interface MarketplaceContextType {
    jobs: Job[];
    stories: StatusStory[];
    categories: Category[];
    savedJobIds: string[];
    addJob: (job: Job) => void;
    updateJob: (jobId: string, updates: Partial<Job>) => void;
    incrementJobView: (jobId: string) => void;
    incrementStoryView: (storyId: string) => void;
    toggleSavedJob: (jobId: string) => void;
    addNewCategory: (name: string) => void;
    addUrgentStory: (
        type: 'hiring' | 'service_offer', 
        text: string, 
        budget: number, 
        category: string, 
        city: string, 
        neighborhood: string,
        logistics: string[],
        images: string[]
    ) => void;
    addInfoStory: (text: string, images: string[]) => void;
    applyToJob: (job: Job) => void;
    
    // Comments
    activeCommentJobId: string | null;
    setActiveCommentJobId: (id: string | null) => void;
    addJobComment: (jobId: string, text: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEYS = {
    JOBS: 'joblibre_jobs_v1',
    STORIES: 'joblibre_stories_v1',
    SAVED: 'joblibre_saved_v1',
    CATEGORIES: 'joblibre_categories_v1'
};

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, updateUser } = useAuth();
    const { addNotification } = useUI();
    const { getOrCreateConversation, addMessageToConversation, setActiveConversationId } = useChatContext();

    const [activeCommentJobId, setActiveCommentJobId] = useState<string | null>(null);

    const [jobs, setJobs] = useState<Job[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
            return saved ? JSON.parse(saved) : MOCK_JOBS;
        } catch (e) { return MOCK_JOBS; }
    });

    const [stories, setStories] = useState<StatusStory[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
            return saved ? JSON.parse(saved) : MOCK_STORIES;
        } catch (e) { return MOCK_STORIES; }
    });

    const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [categories, setCategories] = useState<Category[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
            return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
        } catch (e) { return DEFAULT_CATEGORIES; }
    });

    useEffect(() => localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs)), [jobs]);
    useEffect(() => localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories)), [stories]);
    useEffect(() => localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedJobIds)), [savedJobIds]);
    useEffect(() => localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)), [categories]);

    const addJob = (job: Job) => {
        setJobs(prev => [job, ...prev]);
        addNotification('Annonce publiée', `Votre annonce "${job.title}" est en ligne et visible par tous.`, 'success');
    };

    const updateJob = (jobId: string, updates: Partial<Job>) => {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updates } : j));
    };

    const incrementJobView = (jobId: string) => {
        setJobs(prev => prev.map(j => 
            j.id === jobId ? { ...j, views: (j.views || 0) + 1 } : j
        ));
    };

    const incrementStoryView = (storyId: string) => {
        setStories(prev => prev.map(s => 
            s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s
        ));
    };

    const toggleSavedJob = (jobId: string) => {
        setSavedJobIds(prev => {
            if (prev.includes(jobId)) {
                return prev.filter(id => id !== jobId);
            } else {
                return [...prev, jobId];
            }
        });
    };

    const addNewCategory = (name: string) => {
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        if (!categories.some(c => c.name.toLowerCase() === formattedName.toLowerCase())) {
            const newCat = {
                id: `cat_${Date.now()}`,
                name: formattedName,
                icon: 'Tag'
            };
            setCategories(prev => [...prev, newCat]);
        }
    };

    const addUrgentStory = (
        type: 'hiring' | 'service_offer', 
        text: string, 
        budget: number, 
        category: string, 
        city: string, 
        neighborhood: string,
        logistics: string[],
        images: string[]
    ) => {
        const timestamp = Date.now();
        const jobId = `j_urgent_${timestamp}`;
        const storyId = `s_${timestamp}`;
        const fullLocation = `${neighborhood}, ${city}`;
        
        let richDescription = text;
        if (logistics.length > 0) {
            richDescription += "\n\n📋 LOGISTIQUE & MATÉRIEL :\n" + logistics.map(l => `• ${l}`).join('\n');
        }

        const newJob: Job = {
            id: jobId,
            type: type,
            title: text.length > 30 ? text.substring(0, 30) + "..." : text,
            description: richDescription,
            category: category,
            budget: budget,
            location: fullLocation,
            targetZone: { scope: 'CITY', value: city }, 
            status: 'open',
            postedBy: user,
            createdAt: new Date().toISOString(),
            isUrgent: true, 
            isBoosted: true,
            applicants: 0,
            negotiable: true,
            minTierRequired: 'standard',
            images: images,
            views: 0
        };

        addJob(newJob);

        const newStory: StatusStory = {
            id: storyId,
            user: user,
            type: 'urgent_job',
            text: text.length > 15 ? text.substring(0, 15) + "..." : text,
            expiresAt: new Date(timestamp + 24 * 60 * 60 * 1000).toISOString(),
            jobId: jobId,
            views: 0
        };
        setStories(prev => [newStory, ...prev]);
    };

    const addInfoStory = (text: string, images: string[]) => {
        const timestamp = Date.now();
        const storyId = `s_info_${timestamp}`;

        const newStory: StatusStory = {
            id: storyId,
            user: user,
            type: 'info',
            text: text, 
            expiresAt: new Date(timestamp + 24 * 60 * 60 * 1000).toISOString(),
            views: 0
        };
        setStories(prev => [newStory, ...prev]);
        addNotification('Statut publié', 'Votre info est visible pendant 24h (Cercle Bleu).', 'success');
    };

    // --- NEW: LOGIC TO APPLY & REDIRECT ---
    const applyToJob = (job: Job) => {
        // 1. Update User Stats (Quota & Tracked IDs)
        const updatedAppliedIds = [...(user.appliedJobIds || []), job.id];
        updateUser({ 
            monthlyApplicationsUsed: user.monthlyApplicationsUsed + 1,
            appliedJobIds: updatedAppliedIds 
        });

        // 2. Increment Job Applicants Counter locally
        updateJob(job.id, { applicants: (job.applicants || 0) + 1 });

        // 3. Create Conversation
        const conversationId = getOrCreateConversation(job.postedBy, job);

        // 4. Send "Application" System Message
        const appMsg: ChatMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            text: `Je suis intéressé par votre mission : "${job.title}"`,
            timestamp: 'À l\'instant',
            type: 'application',
            metadata: { jobId: job.id, status: 'pending' }
        };
        addMessageToConversation(conversationId, appMsg);

        // 5. Set Active Conversation for Redirection
        setActiveConversationId(conversationId);
    };

    // --- COMMENT LOGIC ---
    const addJobComment = (jobId: string, text: string) => {
        setJobs(prev => prev.map(job => {
            if (job.id === jobId) {
                const newComment: JobComment = {
                    id: `cmt_${Date.now()}`,
                    userId: user.id,
                    userName: user.name,
                    userAvatar: user.avatar,
                    text: text,
                    timestamp: 'À l\'instant',
                    isOwner: job.postedBy.id === user.id
                };
                return { ...job, comments: [...(job.comments || []), newComment] };
            }
            return job;
        }));
    };

    return (
        <MarketplaceContext.Provider value={{
            jobs, stories, categories, savedJobIds,
            addJob, updateJob, incrementJobView, incrementStoryView,
            toggleSavedJob, addNewCategory, addUrgentStory, addInfoStory, applyToJob,
            activeCommentJobId, setActiveCommentJobId, addJobComment
        }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
    return context;
};
