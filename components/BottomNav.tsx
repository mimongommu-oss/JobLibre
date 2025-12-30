
import React from 'react';
import { Home, Briefcase, Plus, MessageSquare, User, Zap } from 'lucide-react';
import { AppTab } from '../types';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isAuthenticated, isAdmin, notifications } = useUser();

  // Hide nav if not auth OR if on Admin dashboard OR on Auth screen
  if (!isAuthenticated || activeTab === AppTab.AUTH || activeTab === AppTab.ADMIN || isAdmin) {
      return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: AppTab.HOME, icon: Home, label: 'Accueil' },
    { id: AppTab.MY_JOBS, icon: Briefcase, label: 'Missions' }, 
    { id: AppTab.CREATE, icon: Plus, label: 'Publier', isMain: true },
    { id: AppTab.MESSAGES, icon: MessageSquare, label: 'Chat', badge: unreadCount },
    { id: AppTab.PROFILE, icon: User, label: 'Compte' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none lg:hidden flex justify-center">
      {/* 
         FLOATING ISLAND DESIGN 
         - Raised from bottom
         - Glassmorphism
         - Shadow for depth
      */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/10 rounded-full mb-6 mx-4 px-2 py-2 pointer-events-auto flex items-center justify-between w-full max-w-sm ring-1 ring-black/5">
        
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          if (item.isMain) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="group relative -top-8 mx-2"
              >
                <div className="absolute inset-0 bg-jobgreen/30 rounded-full blur-xl group-active:scale-90 transition-transform"></div>
                <div className={cn(
                  "relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-jobgreen/40 transform transition-all duration-300 group-active:scale-95 group-active:rotate-90",
                  "bg-gradient-to-tr from-jobgreen to-green-600 text-white border-4 border-[#F8F9FA]"
                )}>
                  <Plus size={28} strokeWidth={3} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-90",
                isActive ? "bg-gray-100 text-jobgreen" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className="relative">
                <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={cn("transition-all duration-300", isActive && "scale-110")}
                />
                {item.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                        {item.badge > 9 ? '9+' : item.badge}
                    </span>
                ) : null}
              </div>
              
              {/* Active Indicator Dot */}
              <span className={cn(
                  "absolute bottom-2 w-1 h-1 rounded-full bg-jobgreen transition-all duration-300",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
