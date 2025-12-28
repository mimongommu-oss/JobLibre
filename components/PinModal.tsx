
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Delete, X } from 'lucide-react';

interface PinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setError(false);
        }
    }, [isOpen]);

    const handleNumberClick = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                // Simulate check (accept any 4 digits for demo, or specifically '0000')
                setTimeout(() => {
                    if (newPin === '0000' || newPin.length === 4) {
                        onSuccess();
                    } else {
                        setError(true);
                        setTimeout(() => {
                            setPin('');
                            setError(false);
                        }, 500);
                    }
                }, 300);
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            
            <div className="bg-white w-full max-w-md rounded-t-[30px] sm:rounded-[30px] p-6 relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">Sécurité</h2>
                    <p className="text-sm text-gray-500 mt-1">Entrez votre code secret pour voir le solde.</p>
                </div>

                {/* PIN Dots */}
                <div className="flex justify-center gap-4 mb-8">
                    {[0, 1, 2, 3].map(i => (
                        <div 
                            key={i} 
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                i < pin.length 
                                ? error ? 'bg-red-500 scale-110' : 'bg-jobgreen scale-110' 
                                : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
                {error && <p className="text-center text-red-500 text-xs font-bold -mt-6 mb-6">Code incorrect</p>}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button 
                            key={num}
                            onClick={() => handleNumberClick(num.toString())}
                            className="h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 font-black text-2xl text-gray-900 transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="h-16"></div>
                    <button 
                        onClick={() => handleNumberClick('0')}
                        className="h-16 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 font-black text-2xl text-gray-900 transition-colors"
                    >
                        0
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="h-16 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                        <Delete size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};
