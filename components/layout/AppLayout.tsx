
import React from 'react';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { BottomNav } from '../BottomNav';
import { AppTab, User } from '../../types';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

interface AppLayoutProps {
    children: React.ReactNode;
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange }) => {
    const { user, logout } = useAuth();
    const { notifications } = useUser();
    
    const unreadCount = notifications.filter(n => !n.read).length;

    // Filter screens where we DON'T want the shell (e.g. Auth is handled in App.tsx)
    if (activeTab === AppTab.AUTH || activeTab === AppTab.ADMIN) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-jobbg lg:bg-gray-50 flex">
            {/* DESKTOP: LEFT SIDEBAR */}
            <SidebarLeft 
                activeTab={activeTab} 
                onTabChange={onTabChange} 
                user={user} 
                unreadCount={unreadCount}
                onLogout={logout}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 bg-jobbg min-h-screen border-x border-gray-100 lg:shadow-sm relative">
                <div className="pb-24 lg:pb-0 h-full">
                    {children}
                </div>
            </div>

            {/* DESKTOP: RIGHT SIDEBAR */}
            <SidebarRight user={user} />

            {/* MOBILE: BOTTOM NAV */}
            <div className="lg:hidden">
                <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
            </div>
        </div>
    );
};
