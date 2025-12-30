
import React, { useState } from 'react';
import { X, Bell, Zap, CheckCircle2, Info, Trash2, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useUI } from '../context/UIContext';
import { AppNotification } from '../types';
import { cn } from '../lib/utils';

interface SmartNotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SmartNotificationDrawer: React.FC<SmartNotificationDrawerProps> = ({ isOpen, onClose }) => {
    const { notifications, markNotificationsRead, deleteNotification } = useUser();
    const { triggerAction } = useUI(); // Use UI Dispatcher
    const [activeFilter, setActiveFilter] = useState<'all' | 'priority'>('all');

    if (!isOpen) return null;

    // Filter Logic
    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'priority') return n.type === 'alert' || n.type === 'success';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    // Helper to get icon based on type
    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return <CheckCircle2 size={20} className="text-green-600" />;
            case 'alert': return <Zap size={20} className="text-red-500 fill-red-500" />;
            default: return <Info size={20} className="text-blue-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch(type) {
            case 'success': return 'bg-green-50 border-green-100';
            case 'alert': return 'bg-red-50 border-red-100';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    const handleActionClick = (notif: AppNotification) => {
        if (notif.action) {
            // FIRE THE GLOBAL REPAIR ACTION
            triggerAction(notif.action.actionType, notif.action.targetId, notif.action.contextData);
            onClose(); // Close drawer immediately to show the solution
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
                onClick={onClose}
            ></div>

            {/* Drawer Content */}
            <div className="w-full max-w-sm h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 pointer-events-auto flex flex-col">
                
                {/* Header */}
                <div className="pt-safe px-6 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-4 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Bell size={24} className="text-gray-900" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                Notifications
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                activeFilter === 'all' 
                                ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            Tout
                        </button>
                        <button 
                            onClick={() => setActiveFilter('priority')}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                activeFilter === 'priority' 
                                ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-200" 
                                : "bg-white text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-500"
                            )}
                        >
                            Prioritaire
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]">
                    {unreadCount > 0 && (
                        <div className="flex justify-between items-center px-1 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{unreadCount} non lues</span>
                            <button onClick={markNotificationsRead} className="text-xs font-bold text-jobgreen hover:underline">Tout marquer comme lu</button>
                        </div>
                    )}

                    {filteredNotifications.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                            <Bell size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">Aucune notification</p>
                            <p className="text-xs mt-1">Vous êtes à jour !</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                onClick={() => handleActionClick(notif)} // Whole card is clickable if action
                                className={cn(
                                    "p-4 rounded-2xl border transition-all relative group animate-in slide-in-from-bottom-4 duration-300 cursor-pointer active:scale-[0.98]",
                                    getBgColor(notif.type),
                                    !notif.read && "shadow-sm ring-1 ring-inset ring-black/5"
                                )}
                            >
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm",
                                            notif.type === 'alert' && "shadow-red-200 animate-pulse"
                                        )}>
                                            {getIcon(notif.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={cn("font-bold text-sm leading-tight mb-1", notif.read ? "text-gray-700" : "text-gray-900")}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 font-medium">{notif.date}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed mb-3">
                                            {notif.message}
                                        </p>

                                        {/* Action Button if Present */}
                                        {notif.action && (
                                            <button 
                                                className={cn(
                                                "w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-transform bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 group-hover:border-jobgreen/30"
                                            )}>
                                                {notif.action.label} <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Delete Action (Hover) */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                    className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
