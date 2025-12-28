
import React from 'react';
import { getCurrencyBreakdown } from '../utils/currency';

interface CoinBreakdownProps {
    amount: number; // Amount in FCFA
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const CoinBreakdown: React.FC<CoinBreakdownProps> = ({ amount, size = 'md', className = '' }) => {
    const { gold, silver, copper } = getCurrencyBreakdown(amount);

    if (amount === 0) return <span className="text-gray-400 text-xs">Aucune pièce</span>;

    const sizeClasses = {
        sm: { container: 'gap-1', text: 'text-[10px]', padding: 'px-1.5 py-0.5', icon: 'text-[8px]' },
        md: { container: 'gap-2', text: 'text-xs', padding: 'px-2 py-1', icon: 'text-[10px]' },
        lg: { container: 'gap-3', text: 'text-sm', padding: 'px-3 py-1.5', icon: 'text-xs' },
    };

    const s = sizeClasses[size];

    return (
        <div className={`flex items-center ${s.container} ${className}`}>
            {gold > 0 && (
                <div className={`flex items-center font-black text-yellow-900 bg-gradient-to-b from-yellow-300 to-yellow-500 ${s.padding} rounded-md shadow-sm border border-yellow-600`}>
                    <span className={`${s.icon} mr-1 opacity-80`}>OR</span>
                    <span className={s.text}>{gold}</span>
                </div>
            )}
            {silver > 0 && (
                <div className={`flex items-center font-black text-gray-900 bg-gradient-to-b from-gray-200 to-gray-400 ${s.padding} rounded-md shadow-sm border border-gray-500`}>
                    <span className={`${s.icon} mr-1 opacity-70`}>ARG</span>
                    <span className={s.text}>{silver}</span>
                </div>
            )}
            {copper > 0 && (
                <div className={`flex items-center font-black text-orange-900 bg-gradient-to-b from-orange-300 to-orange-500 ${s.padding} rounded-md shadow-sm border border-orange-700`}>
                     <span className={`${s.icon} mr-1 opacity-70`}>CU</span>
                    <span className={s.text}>{copper}</span>
                </div>
            )}
        </div>
    );
};
