
import React, { useState, useEffect } from 'react';
import { Conversation } from '../types';
import { ChatList } from '../components/messages/ChatList';
import { ChatDetail } from '../components/messages/ChatDetail';
import { useUser } from '../context/UserContext';

export const Messages: React.FC = () => {
    const { conversations, activeConversationId, setActiveConversationId } = useUser();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    // Effect: If global context has an ID set (from Redirect), select it immediately
    useEffect(() => {
        if (activeConversationId) {
            const target = conversations.find(c => c.id === activeConversationId);
            if (target) {
                setSelectedConversation(target);
            }
            // Reset global ID so back button works correctly later
            setActiveConversationId(null);
        }
    }, [activeConversationId, conversations, setActiveConversationId]);

    if (selectedConversation) {
        return (
            <ChatDetail 
                conversation={selectedConversation} 
                onBack={() => setSelectedConversation(null)} 
            />
        );
    }

    return <ChatList onSelect={setSelectedConversation} />;
};
