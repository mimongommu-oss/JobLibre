
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, UserRole } from '../types';
import { MOCK_USER, MOCK_TRANSACTIONS } from '../constants';

interface AuthContextType {
    user: User;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
    transactions: Transaction[];
    updateUser: (updates: Partial<User>) => void;
    spendCoins: (amount: number, description: string) => boolean;
    addCoins: (amount: number, description: string) => void;
    spendCash: (amount: number, description: string) => boolean;
    addCash: (amount: number, description: string) => void;
    addTransaction: (t: Transaction) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    USER: 'joblibre_user_v1',
    TRANSACTIONS: 'joblibre_transactions_v1',
    IS_AUTH: 'joblibre_is_auth_v1'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // MODIFICATION: Default false pour forcer l'écran de connexion au rechargement (Mode Démo)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState<User>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.USER);
            return saved ? JSON.parse(saved) : MOCK_USER;
        } catch (e) { return MOCK_USER; }
    });

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
            return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
        } catch (e) { return MOCK_TRANSACTIONS; }
    });

    useEffect(() => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)), [user]);
    useEffect(() => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)), [transactions]);
    // Note: We don't read IS_AUTH anymore on init, but we save it just in case logic changes back
    useEffect(() => localStorage.setItem(STORAGE_KEYS.IS_AUTH, String(isAuthenticated)), [isAuthenticated]);

    const login = (role: UserRole) => {
        if (role === 'admin') {
            setUser(prev => ({ ...prev, role: 'admin', name: 'Administrateur', avatar: 'https://cdn-icons-png.flaticon.com/512/9703/9703596.png' }));
        } else {
            setUser(prev => ({ ...prev, role, name: 'Marc O. (Moi)', avatar: MOCK_USER.avatar }));
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(MOCK_USER); // Reset to default mock
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    const addTransaction = (t: Transaction) => {
        setTransactions(prev => [t, ...prev]);
    };

    const spendCoins = (amount: number, description: string): boolean => {
        if (user.bronzeCoins < amount) return false;
        setUser(prev => ({ ...prev, bronzeCoins: prev.bronzeCoins - amount }));
        addTransaction({ id: Date.now().toString(), type: 'debit', amount, currency: 'COIN', description, date: new Date().toLocaleString(), status: 'completed' });
        return true;
    };

    const addCoins = (amount: number, description: string) => {
        setUser(prev => ({ ...prev, bronzeCoins: prev.bronzeCoins + amount }));
        addTransaction({ id: Date.now().toString(), type: 'credit', amount, currency: 'COIN', description, date: new Date().toLocaleString(), status: 'completed' });
    };

    const spendCash = (amount: number, description: string): boolean => {
        if (user.wealth < amount) return false;
        setUser(prev => ({ ...prev, wealth: prev.wealth - amount }));
        addTransaction({ id: Date.now().toString(), type: 'debit', amount, currency: 'XAF', description, date: new Date().toLocaleString(), status: 'completed' });
        return true;
    };

    const addCash = (amount: number, description: string) => {
        setUser(prev => ({ ...prev, wealth: prev.wealth + amount }));
        addTransaction({ id: Date.now().toString(), type: 'credit', amount, currency: 'XAF', description, date: new Date().toLocaleString(), status: 'completed' });
    };

    return (
        <AuthContext.Provider value={{
            user, 
            isAuthenticated,
            isAdmin: user.role === 'admin',
            login,
            logout,
            transactions, 
            updateUser, 
            spendCoins, 
            addCoins, 
            spendCash, 
            addCash, 
            addTransaction
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
