
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppNotification, InfoModalState, GlobalActionPayload, ActionType } from '../types';

interface UIContextType {
    notifications: AppNotification[];
    infoModal: InfoModalState;
    
    // Global Action Dispatcher
    pendingAction: GlobalActionPayload | null;
    triggerAction: (type: ActionType, targetId?: string, contextData?: any) => void;
    clearPendingAction: () => void;

    openInfoModal: (title: string, content: string) => void;
    closeInfoModal: () => void;
    addNotification: (title: string, message: string, type?: 'info' | 'success' | 'alert', action?: AppNotification['action']) => void;
    markNotificationsRead: () => void;
    deleteNotification: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const STORAGE_KEYS = {
    NOTIFICATIONS: 'joblibre_notifications_v2', // Updated key version
};

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- MOCK INITIAL NOTIFICATIONS FOR DEMO ---
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
            // Default intelligent notifications to showcase the feature
            return saved ? JSON.parse(saved) : [
                { 
                    id: 'n_critical_1', 
                    title: 'Action Requise : Identité', 
                    message: 'Votre profil est invisible. Validez votre identité pour débloquer les jobs.', 
                    read: false, 
                    date: 'À l\'instant', 
                    type: 'alert',
                    action: { label: 'Réparer maintenant', actionType: 'verify_identity', contextData: { tab: 'video' } }
                },
                { 
                    id: 'n_info_1', 
                    title: 'Boostez vos revenus', 
                    message: 'Les profils complets gagnent 3x plus. Ajoutez vos compétences.', 
                    read: false, 
                    date: 'Il y a 10 min', 
                    type: 'info',
                    action: { label: 'Compléter Profil', actionType: 'complete_profile' }
                },
                { 
                    id: 'n_alert_2', 
                    title: 'Solde Insuffisant', 
                    message: 'Votre solde est bas. Rechargez pour continuer à postuler.', 
                    read: false, 
                    date: 'Hier', 
                    type: 'alert',
                    action: { label: 'Recharger', actionType: 'recharge_wallet', contextData: { tab: 'shop' } }
                }
            ];
        } catch (e) { return []; }
    });

    const [infoModal, setInfoModal] = useState<InfoModalState>({
        isOpen: false,
        title: '',
        content: ''
    });

    const [pendingAction, setPendingAction] = useState<GlobalActionPayload | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }, [notifications]);

    // --- ACTION SYSTEM ---
    const triggerAction = (type: ActionType, targetId?: string, contextData?: any) => {
        console.log("⚡ TRIGGER ACTION:", type, targetId);
        setPendingAction({ type, targetId, contextData });
    };

    const clearPendingAction = () => {
        setPendingAction(null);
    };

    const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' = 'info', action?: AppNotification['action']) => {
        setNotifications(prev => [{
            id: Date.now().toString(),
            title,
            message,
            read: false,
            date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type,
            action
        }, ...prev]);
    };

    const markNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const openInfoModal = (title: string, content: string) => {
        setInfoModal({ isOpen: true, title, content });
    };

    const closeInfoModal = () => {
        setInfoModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <UIContext.Provider value={{
            notifications,
            infoModal,
            pendingAction,
            triggerAction,
            clearPendingAction,
            openInfoModal,
            closeInfoModal,
            addNotification,
            markNotificationsRead,
            deleteNotification
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
