
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from './ui/Button';
import { GABON_CITIES, GABON_LOCATIONS } from '../constants';
import { useUser } from '../context/UserContext';
import { parseLocation } from '../lib/utils';

interface LocationSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUser } = useUser();
    const loc = parseLocation(user.location);
    
    const [city, setCity] = useState(loc.city || 'Libreville');
    const [neighborhood, setNeighborhood] = useState(loc.neighborhood || '');
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const currentLoc = parseLocation(user.location);
            setCity(currentLoc.city || 'Libreville');
            setNeighborhood(currentLoc.neighborhood || '');
        }
    }, [isOpen, user.location]);

    useEffect(() => {
        const hoods = GABON_LOCATIONS[city] || [];
        setAvailableNeighborhoods(hoods);
        // Reset neighborhood if it's not in the new list to ensure valid selection
        // But only if lists are loaded and we have a previous value that mismatches
        if (hoods.length > 0 && neighborhood && !hoods.includes(neighborhood)) {
             setNeighborhood('');
        }
    }, [city]);

    const handleSave = () => {
        if (!city || !neighborhood.trim()) return;
        
        setIsSubmitting(true);
        setTimeout(() => {
            const fullLocation = `${neighborhood.trim()}, ${city}`;
            updateUser({ location: fullLocation });
            setIsSubmitting(false);
            onClose();
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900">Ma Position</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"><X size={20} /></button>
                </div>

                <div className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Commune</label>
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
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quartier</label>
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

                    <Button 
                        onClick={handleSave} 
                        isLoading={isSubmitting}
                        disabled={!neighborhood.trim()}
                        className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-green-900/10 bg-jobgreen hover:bg-green-700"
                    >
                        Mettre à jour
                    </Button>
                </div>
            </div>
        </div>
    );
};
