
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/Button';
import { GABON_CITIES, GABON_LOCATIONS } from '../constants';
import { useUser } from '../context/UserContext';
import { parseLocation } from '../lib/utils';

export const LocationGuardModal: React.FC = () => {
    const { user, updateUser } = useUser();
    const loc = parseLocation(user.location);
    
    // Check if data is missing
    const isMissingData = !loc.city || !loc.neighborhood;

    const [city, setCity] = useState(loc.city || 'Libreville');
    const [neighborhood, setNeighborhood] = useState(loc.neighborhood || '');
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const hoods = GABON_LOCATIONS[city] || [];
        setAvailableNeighborhoods(hoods);
        // Reset neighborhood if it's not in the new list to ensure valid selection
        if (hoods.length > 0 && !hoods.includes(neighborhood)) {
            setNeighborhood('');
        }
    }, [city]);

    const handleSave = () => {
        if (!city || !neighborhood.trim()) return;
        
        setIsSubmitting(true);
        // Simulate network delay for UX
        setTimeout(() => {
            const fullLocation = `${neighborhood.trim()}, ${city}`;
            updateUser({ location: fullLocation });
            setIsSubmitting(false);
        }, 800);
    };

    // If user has location set, do not render anything
    if (!isMissingData) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-jobbg">
            {/* Solid Backdrop */}
            <div className="absolute inset-0 bg-white sm:bg-gray-100 flex flex-col items-center justify-center p-6">
                
                <div className="w-full max-w-md bg-white sm:shadow-xl sm:rounded-[32px] sm:p-8 flex flex-col h-full sm:h-auto justify-center">
                    
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100 animate-bounce">
                            <MapPin size={40} className="fill-blue-600 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2">Où êtes-vous ?</h1>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed">
                            Pour vous montrer les jobs <span className="font-bold text-gray-900">autour de vous</span>, nous avons besoin de votre localisation exacte.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-900 uppercase ml-1">Commune</label>
                            <div className="relative">
                                <select 
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none appearance-none"
                                >
                                    {GABON_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Navigation size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-900 uppercase ml-1">Quartier</label>
                            <div className="relative">
                                <select 
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none appearance-none"
                                >
                                    <option value="" disabled>Sélectionner un quartier</option>
                                    {availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <MapPin size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                onClick={handleSave} 
                                isLoading={isSubmitting}
                                disabled={!neighborhood.trim()}
                                className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-blue-900/10 bg-jobgreen hover:bg-green-700"
                            >
                                Commencer
                            </Button>
                            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium">
                                Ces données servent uniquement à filtrer les annonces.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
