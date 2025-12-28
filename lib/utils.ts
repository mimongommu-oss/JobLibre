
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GABON_CITIES } from '../constants';

/**
 * Merges Tailwind classes conditionally without conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to XAF standards
 */
export const formatMoney = (amount: number) => {
    return amount.toLocaleString('fr-GA');
};

/**
 * Parse a location string (e.g., "Louis, Libreville" or "Libreville")
 * Returns normalized city and neighborhood for matching logic.
 * Smartly detects if a single string is a known City or a Neighborhood.
 */
export const parseLocation = (locationString?: string) => {
    if (!locationString) return { city: '', neighborhood: '' };
    
    // Normalize string: remove extra spaces
    const cleanLoc = locationString.trim();
    const parts = cleanLoc.split(',').map(s => s.trim());
    
    if (parts.length >= 2) {
        // Format explicit: "Quartier, Ville" (ex: "Louis, Libreville")
        // On suppose toujours que la dernière partie est la ville si virgule présente
        return {
            neighborhood: parts[0],
            city: parts[parts.length - 1] // Prend le dernier élément comme ville
        };
    } else {
        // Format simple: "Libreville" ou "Louis"
        // On vérifie si c'est une ville connue du Gabon
        const isKnownCity = GABON_CITIES.some(c => c.toLowerCase() === cleanLoc.toLowerCase());
        
        if (isKnownCity) {
            return { neighborhood: '', city: cleanLoc };
        } else {
            // Si ce n'est pas une ville connue, on assume que c'est un quartier de la capitale par défaut (ou ville inconnue)
            // Pour être safe, on le met en quartier, et on laisse la ville vide ou on déduit Libreville par défaut pour le UX
            return { neighborhood: cleanLoc, city: 'Libreville' }; 
        }
    }
};
