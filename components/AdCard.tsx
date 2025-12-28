
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdCardProps {
    variant?: 'dark' | 'brand';
}

const ADS_CONFIG = {
    brand: {
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        url: '#'
    },
    dark: {
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80',
        url: '#'
    }
};

export const AdCard: React.FC<AdCardProps> = ({ variant = 'dark' }) => {
    const config = ADS_CONFIG[variant];

    return (
        <div className="mb-6 mt-4 relative group cursor-pointer active:scale-[0.99] transition-all">
            {/* Le Contour (Cadre) - Padding augmenté (p-3) pour agrandir le contour */}
            <div className="rounded-[32px] border-2 border-gray-200 bg-white p-3 shadow-sm relative hover:border-gray-300 transition-colors">
                
                {/* L'Image (Clean, sans texte par dessus) */}
                <div className="w-full aspect-video relative bg-gray-50 rounded-[24px] overflow-hidden">
                    <img 
                        src={config.image} 
                        alt="Publicité" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Interaction Overlay (Visible au survol uniquement) */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                         <div className="bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full opacity-0 transform scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl">
                            <ExternalLink size={20} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
