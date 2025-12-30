
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Briefcase, User, ChevronRight, Lock, ArrowRight, Smartphone, Eye, EyeOff, Fingerprint, ScanFace } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { AppTab } from '../types';

export const AuthScreen: React.FC<{ onSuccess: (tab: AppTab) => void }> = ({ onSuccess }) => {
    const { login } = useUser();
    const [step, setStep] = useState<'role' | 'phone' | 'otp' | 'biometric'>('role');
    const [selectedRole, setSelectedRole] = useState<'client' | 'pro'>('client');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Admin Login State
    const [showAdminInput, setShowAdminInput] = useState(false);
    const [adminKey, setAdminKey] = useState('');

    const handleRoleSelect = (role: 'client' | 'pro') => {
        setSelectedRole(role);
        setStep('phone');
    };

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length > 5) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setStep('otp');
            }, 500);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('biometric');
        }, 1000);
    };

    const handleBiometricSuccess = () => {
        setTimeout(() => {
            login(selectedRole);
            onSuccess(AppTab.HOME);
        }, 1500);
    };

    const handleGuestMode = () => {
        login('client'); 
        onSuccess(AppTab.HOME);
    };

    const submitAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminKey === '0000') { // Mock secure key
            login('admin');
            onSuccess(AppTab.ADMIN);
        } else {
            alert("Clé d'accès invalide");
            setAdminKey('');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-jobgreen/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-jobgold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            {/* Logo Header */}
            <div className="pt-safe px-6 pb-4 flex justify-between items-center relative z-10 mt-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-jobgreen to-green-700 text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                        <span className="font-black text-xl italic tracking-tighter">JL</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">Job<span className="text-jobgreen">Libre</span></h1>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gabon</span>
                    </div>
                </div>
                <button onClick={() => setShowAdminInput(!showAdminInput)} className="text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-wider border border-gray-100 px-3 py-1 rounded-full">
                    Staff
                </button>
            </div>

            <div className="flex-1 px-6 flex flex-col justify-center relative z-10 max-w-md mx-auto w-full">
                
                {showAdminInput ? (
                    <form onSubmit={submitAdminLogin} className="space-y-6 animate-in zoom-in-95">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <ShieldCheck size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Accès Staff</h2>
                            <p className="text-gray-500 font-medium text-sm">Veuillez saisir votre clé d'administration.</p>
                        </div>

                        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-gray-900 focus-within:bg-white transition-all">
                            <Lock className="text-gray-400" size={20} />
                            <input 
                                autoFocus
                                type="password"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                placeholder="Clé sécurisée"
                                className="flex-1 bg-transparent text-lg font-black text-gray-900 outline-none placeholder:text-gray-300 tracking-widest"
                            />
                        </div>

                        <Button type="submit" className="w-full h-14 text-lg rounded-2xl shadow-xl bg-gray-900 text-white hover:bg-black">
                            Entrer au QG
                        </Button>
                        <button type="button" onClick={() => setShowAdminInput(false)} className="w-full text-center text-xs font-bold text-gray-400 py-2">Annuler</button>
                    </form>
                ) : (
                    <>
                        {step === 'role' && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">Bienvenue !</h2>
                                    <p className="text-gray-500 font-medium">Quel est votre objectif aujourd'hui ?</p>
                                </div>

                                <button onClick={() => handleRoleSelect('client')} className="w-full bg-white border-2 border-gray-100 p-5 rounded-3xl flex items-center gap-4 hover:border-jobgreen hover:shadow-lg hover:shadow-jobgreen/10 transition-all group text-left active:scale-98">
                                    <div className="w-14 h-14 bg-green-50 text-jobgreen rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">Je cherche un Pro</h3>
                                        <p className="text-xs text-gray-500">Pour une mission ou un service</p>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-jobgreen" />
                                </button>

                                <button onClick={() => handleRoleSelect('pro')} className="w-full bg-white border-2 border-gray-100 p-5 rounded-3xl flex items-center gap-4 hover:border-jobgold hover:shadow-lg hover:shadow-jobgold/10 transition-all group text-left active:scale-98">
                                    <div className="w-14 h-14 bg-yellow-50 text-jobgold rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Briefcase size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">Je suis un Pro</h3>
                                        <p className="text-xs text-gray-500">Je propose mes services</p>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-jobgold" />
                                </button>

                                <div className="text-center pt-4">
                                    <button onClick={handleGuestMode} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                        Explorer en mode invité
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'phone' && (
                            <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                                <button type="button" onClick={() => setStep('role')} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600">
                                    <ChevronRight className="rotate-180" size={14} /> Retour
                                </button>
                                
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Votre Numéro</h2>
                                    <p className="text-gray-500 text-sm font-medium">Nous vous enverrons un code de vérification.</p>
                                </div>

                                <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-jobgreen focus-within:bg-white transition-all">
                                    <Smartphone className="text-gray-400" size={20} />
                                    <span className="font-bold text-gray-500 text-lg">+241</span>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <input 
                                        autoFocus
                                        type="tel" 
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="07 00 00 00"
                                        className="flex-1 bg-transparent text-lg font-black text-gray-900 outline-none placeholder:text-gray-300"
                                    />
                                </div>

                                <Button type="submit" isLoading={isLoading} disabled={phoneNumber.length < 8} className="w-full h-14 text-lg rounded-2xl shadow-xl bg-gray-900 text-white">
                                    Continuer <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                                <button type="button" onClick={() => setStep('phone')} className="flex items-center gap-1 text-xs font-bold text-gray-400 mb-4 hover:text-gray-600">
                                    <ChevronRight className="rotate-180" size={14} /> Modifier numéro
                                </button>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Mot de passe</h2>
                                    <p className="text-gray-500 text-sm font-medium">Entrez votre code secret ou PIN.</p>
                                </div>

                                <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-jobgreen focus-within:bg-white transition-all">
                                    <Lock className="text-gray-400" size={20} />
                                    <input 
                                        autoFocus
                                        type={showPin ? "text" : "password"}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="••••"
                                        className="flex-1 bg-transparent text-lg font-black text-gray-900 outline-none placeholder:text-gray-300 tracking-widest"
                                    />
                                    <button type="button" onClick={() => setShowPin(!showPin)} className="text-gray-400 hover:text-gray-600">
                                        {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <Button type="submit" isLoading={isLoading} disabled={pin.length < 4} className="w-full h-14 text-lg rounded-2xl shadow-xl bg-jobgreen text-white">
                                    Connexion
                                </Button>
                                
                                <div className="text-center">
                                    <button type="button" className="text-xs font-bold text-gray-400 hover:text-jobgreen">Code oublié ?</button>
                                </div>
                            </form>
                        )}

                        {step === 'biometric' && (
                            <BiometricAuth onComplete={handleBiometricSuccess} />
                        )}
                    </>
                )}

            </div>

            {/* Footer Trust */}
            <div className="pb-safe p-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                    <ShieldCheck size={14} className="text-jobgreen" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Sécurité Garanti par JobLibre</span>
                </div>
            </div>
        </div>
    );
};

// Simulated Biometric Component
const BiometricAuth: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    useEffect(() => {
        onComplete();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-jobgreen/20 rounded-full animate-ping"></div>
                <div className="relative w-24 h-24 bg-white border-4 border-jobgreen rounded-full flex items-center justify-center shadow-2xl">
                    <ScanFace size={48} className="text-jobgreen" />
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-xl font-black text-gray-900">Vérification...</h3>
                <p className="text-sm text-gray-500">Authentification biométrique</p>
            </div>
        </div>
    );
};
