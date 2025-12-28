import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, Crown, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const SLIDES = [
    {
        id: 1,
        title: "Boostez vos revenus !",
        subtitle: "Passez Premium et débloquez les offres illimitées.",
        cta: "Voir les offres",
        icon: Crown,
        bgClass: "bg-gradient-to-r from-gray-900 to-gray-800",
        textClass: "text-jobgold",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Paiement 100% Sécurisé",
        subtitle: "Ne payez jamais en dehors de l'appli. Utilisez le séquestre.",
        cta: "En savoir plus",
        icon: ShieldCheck,
        bgClass: "bg-gradient-to-r from-blue-900 to-blue-700",
        textClass: "text-white",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Flash Promo MoMo",
        subtitle: "0% de frais sur les dépôts ce week-end avec Airtel.",
        cta: "Profiter",
        icon: Zap,
        bgClass: "bg-gradient-to-r from-red-600 to-red-500",
        textClass: "text-white",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80"
    }
];

export const HeroCarousel: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Swipe State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Mouse Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        
        if (!isPaused && !isDragging) {
            timeoutRef.current = setTimeout(() => {
                setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
            }, 4000); // 4 seconds per slide
        }

        return () => resetTimeout();
    }, [current, isPaused, isDragging]);

    const handlePrev = () => {
        setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    };

    // --- SWIPE HANDLERS (TOUCH) ---
    const onTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        setIsPaused(false);
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        
        if (distance > minSwipeDistance) {
            handleNext();
        } else if (distance < -minSwipeDistance) {
            handlePrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    // --- MOUSE HANDLERS (DESKTOP DRAG) ---
    const onMouseDown = (e: React.MouseEvent) => {
        setIsPaused(true);
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsPaused(false);
        const diff = startX - e.clientX;
        if (diff > 50) handleNext();
        if (diff < -50) handlePrev();
    };

    const onMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setIsPaused(false);
        }
    };

    return (
        <div 
            className={cn("w-full mb-6 relative group overflow-hidden rounded-[24px] shadow-lg shadow-gray-200 select-none touch-pan-y", isDragging ? "cursor-grabbing" : "cursor-grab")}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            {/* Slides Container */}
            <div 
                className="whitespace-nowrap transition-transform duration-500 ease-out h-40 sm:h-48"
                style={{ transform: `translateX(${-current * 100}%)` }}
            >
                {SLIDES.map((slide) => (
                    <div 
                        key={slide.id} 
                        className={cn("inline-block w-full h-full relative whitespace-normal align-top", slide.bgClass)}
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                            <img src={slide.image} className="w-full h-full object-cover" alt="Ad Background" />
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-center px-6 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                                    <slide.icon size={16} className="text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-md">Sponsorisé</span>
                            </div>
                            
                            <h3 className={cn("text-2xl font-black leading-tight mb-1", slide.textClass)}>
                                {slide.title}
                            </h3>
                            <p className="text-white/90 text-xs font-medium max-w-[80%] mb-4 leading-relaxed">
                                {slide.subtitle}
                            </p>
                            
                            <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-black self-start flex items-center gap-2 shadow-md active:scale-95 transition-transform hover:bg-gray-50">
                                {slide.cta} <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Navigation Arrows (Visible on hover) */}
            <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden sm:block"
                aria-label="Slide précédente"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden sm:block"
                aria-label="Slide suivante"
            >
                <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300 shadow-sm backdrop-blur-sm",
                            current === idx ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};