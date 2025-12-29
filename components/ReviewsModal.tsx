
import React, { useState } from 'react';
import { X, Star, ThumbsUp, User, MessageSquare, CheckCircle2, Shield, Heart } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { MOCK_REVIEWS } from '../constants';

interface ReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    rating: number;
    reviewCount: number;
    userName: string;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose, rating, reviewCount, userName }) => {
    const [view, setView] = useState<'list' | 'write'>('list');
    const [newRating, setNewRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Local State for Reviews to handle Likes (since we use MOCK data)
    // In a real app, this would come from an API/Context
    const [reviews, setReviews] = useState(() => 
        MOCK_REVIEWS.map(r => ({ ...r, likes: 0, likedByMe: false }))
    );

    // Mock Data for Breakdown
    const breakdown = [
        { stars: 5, count: 85, percent: 70 },
        { stars: 4, count: 20, percent: 20 },
        { stars: 3, count: 5, percent: 5 },
        { stars: 2, count: 2, percent: 3 },
        { stars: 1, count: 1, percent: 2 },
    ];

    const tags = ['Ponctuel', 'Travail soigné', 'Sympathique', 'Expert', 'Rapide', 'Bon prix'];

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const toggleLike = (id: string) => {
        setReviews(prev => prev.map(r => {
            if (r.id === id) {
                const isLiked = r.likedByMe;
                return { 
                    ...r, 
                    likedByMe: !isLiked, 
                    likes: (r.likes || 0) + (isLiked ? -1 : 1) 
                };
            }
            return r;
        }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setView('list');
            setNewRating(0);
            setComment('');
            setSelectedTags([]);
            alert("Avis publié avec succès !");
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            
            <div className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Avis & Réputation</h2>
                        <p className="text-xs text-gray-500 font-medium">Profil de {userName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-safe">
                    
                    {view === 'list' ? (
                        <div className="p-6 space-y-8 animate-in slide-in-from-left-4 fade-in duration-300">
                            
                            {/* Summary Card */}
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 min-w-[100px] border border-gray-100">
                                    <div className="text-5xl font-black text-gray-900 tracking-tighter">{rating}</div>
                                    <div className="flex text-jobgold gap-0.5 my-1">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= Math.round(rating) ? "currentColor" : "none"} />)}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase">{reviewCount} avis</div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {breakdown.map((row) => (
                                        <div key={row.stars} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                            <span className="w-2">{row.stars}</span>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-jobgold rounded-full" style={{ width: `${row.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* Reviews List */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900">Avis récents</h3>
                                    <Button size="sm" onClick={() => setView('write')} className="h-9 px-4 text-xs font-bold rounded-xl bg-gray-900 text-white shadow-lg shadow-gray-900/10">
                                        Écrire un avis
                                    </Button>
                                </div>

                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <img src={review.avatar} className="w-10 h-10 rounded-full object-cover bg-gray-200" alt={review.name} />
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900">{review.name}</div>
                                                    <div className="text-[10px] text-gray-400 font-medium">{review.date}</div>
                                                </div>
                                            </div>
                                            <div className="flex text-jobgold">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} className={s > review.rating ? "text-gray-200" : ""} />)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                            {review.comment}
                                        </p>
                                        {review.tags && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {review.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-[10px] font-bold border border-gray-100">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {review.response && (
                                            <div className="mt-3 bg-blue-50/50 p-3 rounded-xl border-l-2 border-blue-200 ml-4">
                                                <div className="text-[10px] font-bold text-blue-800 mb-0.5 flex items-center gap-1">
                                                    <Shield size={10} /> Réponse du prestataire
                                                </div>
                                                <p className="text-xs text-blue-900/80 italic">"{review.response}"</p>
                                            </div>
                                        )}

                                        {/* Like Button on Review */}
                                        <div className="flex justify-end mt-2">
                                            <button 
                                                onClick={() => toggleLike(review.id)}
                                                className={cn(
                                                    "flex items-center gap-1 px-2 py-1 rounded-full border shadow-sm transition-all active:scale-95",
                                                    review.likedByMe ? "border-red-100 bg-red-50 text-red-500" : "border-gray-100 bg-white text-gray-400 hover:text-red-400"
                                                )}
                                            >
                                                <Heart size={12} className={cn(review.likedByMe ? "fill-current animate-wiggle-violent" : "")} />
                                                {(review.likes || 0) > 0 && <span className="text-[10px] font-bold">{review.likes}</span>}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 h-full flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">
                            {/* WRITE MODE */}
                            <div className="flex-1 space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-gray-900 mb-2">Notez votre expérience</h3>
                                    <p className="text-sm text-gray-500">Votre avis aide la communauté à garder un haut standard de qualité.</p>
                                </div>

                                {/* Interactive Stars */}
                                <div className="flex justify-center gap-2 py-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setNewRating(star)}
                                            className="transform transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                                        >
                                            <Star 
                                                size={40} 
                                                fill={star <= newRating ? "#FFD700" : "none"} 
                                                className={star <= newRating ? "text-jobgold drop-shadow-md" : "text-gray-200"}
                                                strokeWidth={star <= newRating ? 0 : 1.5}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="text-center text-sm font-bold text-jobgold h-6 mb-4">
                                    {newRating === 5 && "Excellent ! 🤩"}
                                    {newRating === 4 && "Très bien ! 🙂"}
                                    {newRating === 3 && "Moyen 😐"}
                                    {newRating === 2 && "Décevant 😕"}
                                    {newRating === 1 && "À éviter 😡"}
                                </div>

                                {/* Tags Selection */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Points forts (Optionnel)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                                                    selectedTags.includes(tag) 
                                                        ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                                                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment Area */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Votre commentaire</label>
                                    <textarea 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Dites-nous en plus sur la prestation..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-jobgreen/20 focus:border-jobgreen min-h-[120px] resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3 pb-safe">
                                <Button variant="ghost" onClick={() => setView('list')} className="flex-1 text-gray-500 font-bold border border-gray-200 rounded-xl h-14">
                                    Annuler
                                </Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={newRating === 0 || !comment} 
                                    isLoading={isSubmitting}
                                    className="flex-[2] bg-jobgreen text-white font-black rounded-xl shadow-lg shadow-green-900/10 h-14 text-base"
                                >
                                    Publier l'avis
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};