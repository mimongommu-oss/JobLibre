
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, Conversation, ChatMessage, Job, AppNotification, InfoModalState, StatusStory, UserRole } from '../types';
import { useAuth } from './AuthContext';
import { useMarketplace } from './MarketplaceContext';
import { useChatContext } from './ChatContext';
import { useUI } from './UIContext';

// Category interface definition for consumers
interface Category {
    id: string;
    name: string;
    icon?: string;
}

// Keep the exact same interface as before to avoid breaking changes in other files
interface UserContextType {
    // Auth Data (Explicitly added)
    user: User;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
    transactions: Transaction[];
    
    // Marketplace Data
    conversations: Conversation[];
    jobs: Job[];
    stories: StatusStory[];
    savedJobIds: string[]; 
    notifications: AppNotification[]; 
    categories: Category[]; 
    
    // Info Modal State
    infoModal: InfoModalState;
    openInfoModal: (title: string, content: string) => void;
    closeInfoModal: () => void;

    // Actions
    spendCoins: (amount: number, description: string) => boolean;
    addCoins: (amount: number, description: string) => void;
    spendCash: (amount: number, description: string) => boolean;
    addCash: (amount: number, description: string) => void;
    updateUser: (updates: Partial<User>) => void;
    
    // Job Actions
    addJob: (job: Job) => void;
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
    updateJob: (jobId: string, updates: Partial<Job>) => void;
    incrementJobView: (jobId: string) => void; 
    incrementStoryView: (storyId: string) => void;
    applyToJob: (job: Job) => void;
    releaseEscrow: (job: Job) => void;
    
    // DEBUG: Simulation
    debugSimulateHiring: () => Job | null;
    
    // Comment Actions
    activeCommentJobId: string | null;
    setActiveCommentJobId: (id: string | null) => void;
    addJobComment: (jobId: string, text: string) => void;
    
    // Category Actions
    addNewCategory: (name: string) => void;

    // Likes
    toggleJobLike: (jobId: string) => void;
    toggleJobCommentLike: (jobId: string, commentId: string) => void;
    toggleMessageLike: (conversationId: string, messageId: string) => void;

    // Chat Actions
    addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
    updateMessageInConversation: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void;
    markConversationAsRead: (conversationId: string) => void;
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;

    // Feature Actions
    toggleSavedJob: (jobId: string) => void;
    markNotificationsRead: () => void;
    deleteNotification: (id: string) => void;
    addNotification: (title: string, message: string, type?: 'info' | 'success' | 'alert') => void;
    
    // Transaction Helpers from Auth
    addTransaction: (t: Transaction) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// The Legacy Provider now just renders children, assuming they are wrapped in the new providers in App.tsx.
const UserContextAggregator: React.FC<{ children: ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const marketplace = useMarketplace();
    const chat = useChatContext();
    const ui = useUI();

    // --- DEBUG FUNCTION ---
    const debugSimulateHiring = (): Job | null => {
        // Find a job not posted by me
        const targetJob = marketplace.jobs.find(j => j.postedBy.id !== auth.user.id && j.status === 'open');
        
        if (targetJob) {
            // Create the updated object immediately to return it
            const updatedJob: Job = {
                ...targetJob,
                status: 'taken',
                assignedTo: auth.user,
                applicants: (targetJob.applicants || 0) + 1
            };

            // Update state
            marketplace.updateJob(targetJob.id, updatedJob);
            
            // Add notification
            ui.addNotification(
                'Félicitations !', 
                `Vous avez été recruté pour la mission "${targetJob.title}".`, 
                'success'
            );
            
            return updatedJob;
        }
        return null;
    };

    // --- RELEASE FUNDS FUNCTION ---
    const releaseEscrow = (job: Job) => {
        if (!job.assignedTo || job.status !== 'completed') return;

        // 1. Update Job Status (Local logic for demo)
        // In real app, backend handles this. We simulate by keeping it completed but notifying.
        
        // 2. Create Transaction for ME (Debit/Release log)
        auth.addTransaction({
            id: `tx_rel_${Date.now()}`,
            type: 'escrow_release',
            amount: job.budget,
            currency: 'XAF',
            description: `Paiement libéré pour : ${job.title}`,
            date: new Date().toLocaleString(),
            status: 'completed'
        });

        // 3. Notify
        ui.addNotification(
            'Paiement Effectué',
            `Les fonds (${job.budget.toLocaleString()} F) ont été libérés pour ${job.assignedTo.name}.`,
            'success'
        );

        // 4. Send System Message in Chat
        const convId = chat.getOrCreateConversation(job.assignedTo, job);
        chat.addMessageToConversation(convId, {
            id: `msg_sys_${Date.now()}`,
            senderId: 'system',
            text: '✅ Le client a validé le travail. Les fonds ont été libérés.',
            timestamp: "À l'instant",
            type: 'escrow_release',
            metadata: { amount: job.budget, status: 'completed' }
        });
    };

    const value: UserContextType = {
        ...auth,
        ...marketplace,
        ...chat,
        ...ui,
        debugSimulateHiring,
        releaseEscrow
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <UserContextAggregator>
            {children}
        </UserContextAggregator>
    );
};

export const useUser = () => {
    // Legacy Hook that mimics the old behavior
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider hierarchy');
    }
    return context;
};
