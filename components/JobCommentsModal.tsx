
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Shield, Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Job } from '../types';
import { cn } from '../lib/utils';

interface JobCommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string | null;
}

export const JobCommentsModal: React.FC<JobCommentsModalProps> = ({ isOpen, onClose, jobId }) => {
    const { jobs, addJobComment, user, toggleJobCommentLike } = useUser();
    const [commentText, setCommentText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const job = jobs.find(j => j.id === jobId);
    
    // Auto-scroll to bottom when comments change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [job?.comments?.length, isOpen]);

    if (!isOpen || !job) return null;

    const comments = job.comments || [];

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!commentText.trim()) return;
        
        addJobComment(job.id, commentText);
        setCommentText('');
    };

    const handleLike = (commentId: string) => {
        toggleJobCommentLike(job.id, commentId);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            
            <div className="bg-white w-full max-w-md h-[80vh] sm:h-[70vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="text-jobgreen" size={24} />
                        <div>
                            <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">Commentaires</h2>
                            <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{job.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Comments List */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-gray-50/50">
                    {comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <MessageCircle size={48} className="opacity-20 mb-2" />
                            <p className="font-bold text-sm">Aucun commentaire</p>
                            <p className="text-xs">Soyez le premier à poser une question.</p>
                        </div>
                    ) : (
                        comments.map((comment) => {
                            const isMe = comment.userId === user.id;
                            const isLiked = comment.likedByMe;
                            const likes = comment.likes || 0;

                            return (
                                <div key={comment.id} className={cn("flex gap-3 relative group", isMe ? "flex-row-reverse" : "")}>
                                    <img 
                                        src={comment.userAvatar} 
                                        alt={comment.userName} 
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1"
                                    />
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl p-3 text-sm relative pb-5", // Extra padding bottom for like
                                        isMe ? "bg-blue-50 text-gray-900 rounded-tr-none" : "bg-white border border-gray-100 text-gray-900 rounded-tl-none shadow-sm"
                                    )}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-xs text-gray-900">{isMe ? "Moi" : comment.userName}</span>
                                            {comment.isOwner && (
                                                <span className="bg-jobgreen text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-bold">
                                                    <Shield size={8} /> Auteur
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                                        </div>
                                        <p className="leading-snug">{comment.text}</p>

                                        {/* Like Button on Comment (Cleaned) */}
                                        <button 
                                            onClick={() => handleLike(comment.id)}
                                            className={cn(
                                                "absolute -bottom-2 flex items-center gap-1 px-1.5 py-0.5 transition-all active:scale-90",
                                                isMe ? "left-0" : "right-0",
                                                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                                            )}
                                        >
                                            <Heart size={10} className={cn(isLiked ? "fill-current animate-wiggle-violent" : "")} />
                                            {likes > 0 && <span className="text-[9px] font-bold">{likes}</span>}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-end gap-2 pb-safe">
                    <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-200 mb-1" />
                    <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2">
                        <input 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Poser une question publique..."
                            className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!commentText.trim()}
                        className="w-10 h-10 bg-jobgreen text-white rounded-full flex items-center justify-center shadow-lg shadow-green-900/10 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none mb-0.5"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
