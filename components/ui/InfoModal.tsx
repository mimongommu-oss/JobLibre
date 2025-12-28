
import React from 'react';
import { X, Info, HelpCircle } from 'lucide-react';
import { Button } from './Button';

interface InfoModalProps {
    isOpen: boolean;
    title: string;
    content: string;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, title, content, onClose }) => {
    if (!isOpen) return null;

    return (
        // CHARTE NIVEAU 5 (DIVIN) : z-[200]
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className="bg-white w-full max-w-md rounded-[32px] p-6 relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col items-center text-center">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-blue-100">
                    <HelpCircle size={32} />
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                    {title}
                </h3>

                <p className="text-gray-600 font-medium leading-relaxed text-sm mb-6">
                    {content}
                </p>

                <Button 
                    onClick={onClose}
                    className="w-full h-12 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all active:scale-95"
                >
                    J'ai compris
                </Button>
            </div>
        </div>
    );
};
