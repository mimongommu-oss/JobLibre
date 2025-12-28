import { CurrencyBreakdown } from '../types';

export const getCurrencyBreakdown = (amount: number): CurrencyBreakdown => {
    let remaining = amount;
    
    const gold = Math.floor(remaining / 50000);
    remaining %= 50000;
    
    const silver = Math.floor(remaining / 10000);
    remaining %= 10000;
    
    const copper = Math.floor(remaining / 1000);
    
    return { gold, silver, copper };
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};