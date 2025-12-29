
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Conversation, ChatMessage, User, Job } from '../types';
import { MOCK_CONVERSATIONS, MOCK_USER } from '../constants';

interface ChatContextType {
    conversations: Conversation[];
    addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
    updateMessageInConversation: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void;
    markConversationAsRead: (conversationId: string) => void;
    toggleMessageLike: (conversationId: string, messageId: string) => void; // NEW
    
    // New methods for "Apply & Redirect"
    getOrCreateConversation: (withUser: User, relatedJob?: Job) => string; 
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    const addMessageToConversation = (conversationId: string, message: ChatMessage) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, message],
                    lastMessage: message.type === 'image' ? '📷 Photo' : message.type === 'voice' ? '🎤 Vocal' : message.text,
                    timestamp: message.timestamp,
                };
            }
            return conv;
        }));
    };

    const updateMessageInConversation = (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: conv.messages.map(msg => 
                        msg.id === messageId ? { ...msg, ...updates, metadata: { ...msg.metadata, ...updates.metadata } } : msg
                    )
                };
            }
            return conv;
        }));
    };

    const toggleMessageLike = (conversationId: string, messageId: string) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: conv.messages.map(msg => {
                        if (msg.id === messageId) {
                            const isLiked = msg.likedByMe;
                            return {
                                ...msg,
                                likedByMe: !isLiked,
                                likes: (msg.likes || 0) + (isLiked ? -1 : 1)
                            };
                        }
                        return msg;
                    })
                };
            }
            return conv;
        }));
    };

    const markConversationAsRead = (conversationId: string) => {
        setConversations(prev => prev.map(conv => 
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        ));
    };

    // Logic to find existing conversation or create new one
    const getOrCreateConversation = (withUser: User, relatedJob?: Job): string => {
        // 1. Check if conversation already exists (simple logic: matches user ID)
        // In a real app, we might also check if it matches the same Job ID if we want per-job threads
        const existing = conversations.find(c => c.withUser.id === withUser.id);
        
        if (existing) {
            return existing.id;
        }

        // 2. Create new
        const newId = `c_new_${Date.now()}`;
        const newConv: Conversation = {
            id: newId,
            withUser: withUser,
            lastMessage: relatedJob ? `Candidature: ${relatedJob.title}` : 'Nouvelle conversation',
            timestamp: 'À l\'instant',
            unreadCount: 0,
            messages: [],
            relatedJobId: relatedJob?.id
        };

        setConversations(prev => [newConv, ...prev]);
        return newId;
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            addMessageToConversation,
            updateMessageInConversation,
            markConversationAsRead,
            toggleMessageLike,
            getOrCreateConversation,
            activeConversationId,
            setActiveConversationId
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChatContext must be used within ChatProvider');
    return context;
};
