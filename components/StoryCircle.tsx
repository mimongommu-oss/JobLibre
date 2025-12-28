
import React from 'react';
import { StatusStory } from '../types';
import { Zap, Info } from 'lucide-react';

interface StoryCircleProps {
    story: StatusStory;
    isViewed: boolean;
    onClick: () => void;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({ story, isViewed, onClick }) => {
    // VISUAL LOGIC FIX: 
    // Urgent = Red Ring. Info = Blue Ring. Read = Gray Ring.
    // This prevents "Info" stories from looking like broken "Urgent" stories.
    let ringColor = 'border-gray-300';
    
    if (!isViewed) {
        if (story.type === 'urgent_job') {
            ringColor = 'border-red-600';
        } else {
            ringColor = 'border-blue-500'; // Blue for Info/Standard stories
        }
    }
    
    const containerOpacity = isViewed ? 'opacity-80' : 'opacity-100';
    const imageOpacity = isViewed ? 'opacity-60' : 'opacity-100';

    return (
        <div 
            onClick={onClick}
            className={`flex flex-col items-center gap-1 min-w-[72px] cursor-pointer active:scale-95 transition-all ${containerOpacity}`}
        >
            <div className={`relative w-16 h-16 rounded-full p-[2px] border-2 ${ringColor}`}>
                <img 
                    src={story.user.avatar} 
                    alt={story.user.name} 
                    className={`w-full h-full rounded-full object-cover border-2 border-white transition-opacity ${imageOpacity}`}
                />
                
                {/* URGENT BADGE: Red + Lightning + Animation */}
                {story.type === 'urgent_job' && (
                    <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border-2 border-white z-10 shadow-sm">
                        <div className="animate-wiggle-violent">
                            <Zap size={10} className="text-white fill-white" />
                        </div>
                    </div>
                )}

                {/* INFO BADGE: Blue + Info Icon (New for consistency) */}
                {story.type === 'info' && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white z-10 shadow-sm">
                        <Info size={10} className="text-white" strokeWidth={3} />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-medium text-gray-700 truncate w-16 text-center">
                {story.user.name.split(' ')[0]}
            </span>
        </div>
    );
};
