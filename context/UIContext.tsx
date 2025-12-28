
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppNotification, InfoModalState } from '../types';

interface UIContextType {
    notifications: AppNotification[];
    infoModal: InfoModalState;
    openInfoModal: (title: string, content: string) => void;
    closeInfoModal: () => void;
    addNotification: (title: string, message: string, type?: 'info' | 'success' | 'alert') => void;
    markNotificationsRead: () => void;
    deleteNotification: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const STORAGE_KEYS = {
    NOTIFICATIONS: 'joblibre_notifications_v1',
};

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
            return saved ? JSON.parse(saved) : [
                { 
                    id: 'n1', 
                    title: 'Opportunité à Akanda', 
                    message: 'Forte demande de plombiers détectée dans votre zone.', 
                    read: false, 
                    date: 'Il y a 10 min', 
                    type: 'info',
                    action: { label: 'Voir le job', actionType: 'view_job', target: 'j1' }
                }
            ];
        } catch (e) { return []; }
    });

    const [infoModal, setInfoModal] = useState<InfoModalState>({
        isOpen: false,
        title: '',
        content: ''
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' = 'info') => {
        setNotifications(prev => [{
            id: Date.now().toString(),
            title,
            message,
            read: false,
            date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type
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
