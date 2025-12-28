
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, Conversation } from '../types';
import { MOCK_USER, TIER_LIMITS } from '../constants';
import { formatMoney } from '../lib/utils';
import { useUser } from '../context/UserContext';

export const useChat = (conversation: Conversation) => {
    const { addMessageToConversation, updateMessageInConversation, markConversationAsRead, conversations, user, openInfoModal } = useUser();
    
    // Get the *live* conversation from context, not the initial prop
    const liveConversation = conversations.find(c => c.id === conversation.id) || conversation;
    const messages = liveConversation.messages;

    const [isTyping, setIsTyping] = useState(false);

    // Mark as read on mount
    useEffect(() => {
        if (liveConversation.unreadCount > 0) {
            markConversationAsRead(liveConversation.id);
        }
    }, [liveConversation.id]);

    // --- BOT SIMULATION LOGIC ---
    const triggerBotResponse = useCallback((userAmount: number) => {
        setIsTyping(true);
        // Simulate "Thinking" time
        setTimeout(() => {
            setIsTyping(false);
            
            const targetPrice = 18000;
            let responseMsg: ChatMessage;

            if (userAmount >= targetPrice) {
                 // Bot Accepts
                 responseMsg = {
                    id: Date.now().toString(),
                    senderId: conversation.withUser.id,
                    text: `C'est d'accord pour ${formatMoney(userAmount)} FCFA. On valide ?`,
                    timestamp: 'À l\'instant',
                    type: 'negotiation',
                    metadata: { amount: userAmount, status: 'pending' }
                };
            } else {
                // Bot Counters (Average between target and user offer, rounded to 500)
                const counterAmount = Math.ceil((targetPrice + userAmount) / 2 / 500) * 500;
                responseMsg = {
                    id: Date.now().toString(),
                    senderId: conversation.withUser.id,
                    text: `C'est un peu bas... Je peux descendre à ${formatMoney(counterAmount)} FCFA, mais pas moins.`,
                    timestamp: 'À l\'instant',
                    type: 'negotiation',
                    metadata: { amount: counterAmount, status: 'pending' }
                };
            }
            
            addMessageToConversation(conversation.id, responseMsg);
        }, 2000);
    }, [conversation.id, conversation.withUser.id, addMessageToConversation]);

    // --- ACTIONS ---
    const sendMessage = useCallback((text?: string, type: ChatMessage['type'] = 'text', metadata?: any) => {
        if (!text && type === 'text') return;

        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            senderId: MOCK_USER.id,
            text: text || '',
            timestamp: 'À l\'instant',
            type: type,
            metadata: metadata
        };

        addMessageToConversation(conversation.id, newMsg);

        // Trigger Bot if it's an offer
        if ((type === 'negotiation' || type === 'offer') && metadata?.amount) {
            triggerBotResponse(metadata.amount);
        }
    }, [conversation.id, addMessageToConversation, triggerBotResponse]);

    const acceptOffer = useCallback((msgId: string, amount: number) => {
        // --- STRICT SECURITY CHECK ---
        // Prevents Standard users from accepting offers above their tier limit
        // even if the offer came from a Premium user.
        const maxBudget = TIER_LIMITS[user.tier].maxBudgetView;
        
        if (amount > maxBudget) {
            openInfoModal(
                "Plafond Dépassé", 
                `Votre compte ${user.tier.toUpperCase()} est limité à ${formatMoney(maxBudget)} FCFA par transaction. Passez au niveau Verified ou Premium pour valider cette offre de ${formatMoney(amount)} FCFA.`
            );
            return;
        }

        // 1. Update the offer message status to 'accepted'
        updateMessageInConversation(conversation.id, msgId, { 
            metadata: { amount, status: 'accepted' } 
        });

        // 2. Send confirmation text
        sendMessage(`Offre de ${formatMoney(amount)} FCFA acceptée.`, 'text');
        
        // 3. Simulate System Escrow Event
        setTimeout(() => {
            const escrowMsg: ChatMessage = {
                id: Date.now().toString() + 'esc',
                senderId: 'system',
                text: 'Fonds bloqués',
                timestamp: 'À l\'instant',
                type: 'escrow_release',
                metadata: { amount: amount, status: 'completed' }
            };
            addMessageToConversation(conversation.id, escrowMsg);
        }, 1000);
    }, [conversation.id, sendMessage, addMessageToConversation, updateMessageInConversation, user.tier, openInfoModal]);

    const refuseOffer = useCallback((msgId: string) => {
        // 1. Update the offer message status to 'rejected'
        const targetMsg = messages.find(m => m.id === msgId);
        if (targetMsg?.metadata) {
             updateMessageInConversation(conversation.id, msgId, { 
                metadata: { ...targetMsg.metadata, status: 'rejected' } 
            });
        }

        // 2. Send rejection text
        sendMessage("Je ne suis pas intéressé par cette offre.", "text");

    }, [conversation.id, messages, updateMessageInConversation, sendMessage]);

    return {
        messages,
        isTyping,
        sendMessage,
        acceptOffer,
        refuseOffer
    };
};
