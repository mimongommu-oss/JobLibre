
import React from 'react';
import { Home, Briefcase, PlusCircle, MessageSquare, User } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: AppTab.HOME, icon: Home, label: 'Missions' },
    { id: AppTab.MY_JOBS, icon: Briefcase, label: 'Gérer' }, // CHANGED
    { id: AppTab.CREATE, icon: PlusCircle, label: 'Publier', isMain: true },
    { id: AppTab.MESSAGES, icon: MessageSquare, label: 'Discussions' },
    { id: AppTab.PROFILE, icon: User, label: 'Profil' },
  ];

  return (
    // CHARTE NIVEAU 4 (NAVIGATION) : z-50
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-safe pt-2 z-50 shadow-up">
      <div className="flex justify-around items-end w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          if (item.isMain) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative -top-6 flex flex-col items-center justify-center group"
              >
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-active:scale-95
                  bg-jobgreen text-white ring-4 ring-jobbg
                `}>
                  <Icon size={28} />
                </div>
                <span className="text-[10px] font-semibold text-gray-600 mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-1/5 py-1 transition-colors ${
                isActive ? 'text-jobgreen' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-jobgreen' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
