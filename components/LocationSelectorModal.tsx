
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Globe, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { GABON_LOCATIONS, GABON_PROVINCES } from '../constants';
import { useUser } from '../context/UserContext';
import { parseLocation, cn } from '../lib/utils';

interface LocationSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUser } = useUser();
    const loc = parseLocation(user.location);
    
    // Steps: 0=Province, 1=City, 2=Neighborhood
    const [step, setStep] = useState(0); 
    
    const [province, setProvince] = useState('');
    const [city, setCity] = useState(loc.city || '');
    const [neighborhood, setNeighborhood] = useState(loc.neighborhood || '');
    
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Load Logic to determine current province if city is set
    useEffect(() => {
        if (isOpen) {
            const currentLoc = parseLocation(user.location);
            const currentCity = currentLoc.city || 'Libreville';
            
            // Find province of current city
            const prov = GABON_PROVINCES.find(p => p.cities.includes(currentCity));
            
            setProvince(prov ? prov.name : 'Estuaire');
            setCity(currentCity);
            setNeighborhood(currentLoc.neighborhood || '');
            
            // If already set, maybe start at step 2 (Neighborhood)?
            // For now, let's start at Step 0 to allow easy change, but pre-fill data.
            setStep(0);
        }
    }, [isOpen, user.location]);

    // Update cities when province changes
    useEffect(() => {
        const prov = GABON_PROVINCES.find(p => p.name === province);
        setAvailableCities(prov ? prov.cities : []);
        // If current city is not in new province, reset city
        if (prov && !prov.cities.includes(city)) {
            setCity('');
            setNeighborhood('');
        }
    }, [province]);

    // Update neighborhoods when city changes
    useEffect(() => {
        const hoods = GABON_LOCATIONS[city] || [];
        setAvailableNeighborhoods(hoods);
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
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900">Ma Position</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6">
                    
                    {/* STEP 0: PROVINCE */}
                    <div className={cn("transition-opacity", step !== 0 && "opacity-50 pointer-events-none")}>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Province (G1-G9)</label>
                        <div className="relative">
                            <select 
                                value={province}
                                onChange={(e) => { setProvince(e.target.value); setStep(1); }}
                                className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none appearance-none"
                            >
                                {GABON_PROVINCES.map(p => <option key={p.code} value={p.name}>{p.code} - {p.name}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <Globe size={16} />
                            </div>
                        </div>
                    </div>

                    {/* STEP 1: COMMUNE */}
                    {(step >= 1 || province) && (
                        <div className={cn("transition-opacity animate-in slide-in-from-right-4", step < 1 && "opacity-50 pointer-events-none")}>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Commune / Ville</label>
                            <div className="relative">
                                <select 
                                    value={city}
                                    onChange={(e) => { setCity(e.target.value); setStep(2); }}
                                    className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none appearance-none"
                                    disabled={!province}
                                >
                                    <option value="" disabled>Sélectionner une ville</option>
                                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Navigation size={16} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: QUARTIER */}
                    {(step >= 2 || city) && (
                        <div className={cn("transition-opacity animate-in slide-in-from-right-4", step < 2 && "opacity-50 pointer-events-none")}>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Quartier</label>
                            <div className="relative">
                                <select 
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 font-bold text-gray-900 focus:border-jobgreen focus:ring-0 outline-none appearance-none"
                                    disabled={!city}
                                >
                                    <option value="" disabled>Sélectionner un quartier</option>
                                    {availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                                    <option value="Autre / Centre">Autre / Centre</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <MapPin size={16} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button 
                            onClick={handleSave} 
                            isLoading={isSubmitting}
                            disabled={!neighborhood.trim()}
                            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-green-900/10 bg-jobgreen hover:bg-green-700 disabled:opacity-50 disabled:shadow-none"
                        >
                            Valider ma zone
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
