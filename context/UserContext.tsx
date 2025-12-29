
import React, { createContext, useContext, ReactNode } from 'react';
import { User, Transaction, Conversation, ChatMessage, Job, AppNotification, InfoModalState, StatusStory } from '../types';
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
    user: User;
    transactions: Transaction[];
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
    applyToJob: (job: Job) => void; // NEW
    
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// The Legacy Provider now just renders children, assuming they are wrapped in the new providers in App.tsx.
const UserContextAggregator: React.FC<{ children: ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const marketplace = useMarketplace();
    const chat = useChatContext();
    const ui = useUI();

    const value: UserContextType = {
        ...auth,
        ...marketplace,
        ...chat,
        ...ui
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
