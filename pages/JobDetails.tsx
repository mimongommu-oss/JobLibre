import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Shield, Share2, Wallet, Zap, ImageIcon, CheckCircle2, Navigation, Camera, ExternalLink, Plus, Minus, Bookmark, Send, Phone, Lock, AlertOctagon, FileText, ChevronLeft, ChevronRight as ChevronRightIcon, EyeOff, TrendingUp, BarChart3, Eye, MousePointer2, Briefcase, Info, MessageCircle, Heart, Star, MoreHorizontal, UserCheck, FileCheck, Clock, Check, AlertTriangle, Flag, ThumbsUp, Scale, Gavel, FileSignature, ScrollText, ArrowDown, Fingerprint, ShieldCheck } from 'lucide-react';
import { Job, AppTab, ChatMessage, User } from '../types';
import { Button } from '../components/ui/Button';
import { DEFAULT_JOB_PHOTOS, TIER_LIMITS, BOOST_OPTIONS, COIN_VALUE_XAF, MOCK_USERS } from '../constants';
import { cn, formatMoney } from '../lib/utils';
import { useUser } from '../context/UserContext';
import { CoinShopModal } from '../components/CoinShopModal';
import { BoostSelector, BoostValidationModal } from '../components/BoostSelector';
import { ReviewsModal } from '../components/ReviewsModal';

interface JobDetailsProps {
    job: Job;
    onBack: () => void;
    onNavigate?: (tab: AppTab) => void;
}

const SectionTitle: React.FC<{ label: string, info: string, onInfo: (t: string, c: string) => void }> = ({ label, info, onInfo }) => (
    <div className="flex items-center gap-2 mb-3">
        <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">{label}</h3>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onInfo(label, info); }} className="text-gray-300 hover:text-jobgreen transition-colors p-1 -m-1 active:scale-95"><Info size={14} /></button>
    </div>
);

// --- STRICT LEGAL CONTRACT MODAL (PROVIDER VERSION) ---
const LegalContractModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => void, jobTitle: string, clientName: string, budget: number, jobLocation: string, applicant: User }> = ({ isOpen, onClose, onConfirm, jobTitle, clientName, budget, jobLocation, applicant }) => {
    const [canToggle, setCanToggle] = useState(false); 
    const [isChecked, setIsChecked] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const contractId = useMemo(() => `PRO-CTR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`, []);

    useEffect(() => {
        if (isOpen) {
            setCanToggle(false);
            setIsChecked(false);
            setIsSigning(false);
            setTimeout(() => {
                if (scrollRef.current) {
                    const { scrollHeight, clientHeight } = scrollRef.current;
                    if (scrollHeight <= clientHeight + 20) {
                        setCanToggle(true);
                    }
                }
            }, 500);
        }
    }, [isOpen]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 10) {
                setCanToggle(true);
            }
        }
    };

    const handleConfirm = () => {
        if (!isChecked) return;
        setIsSigning(true);
        setTimeout(() => {
            setIsSigning(false);
            onConfirm();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header Official */}
                <div className="bg-slate-900 text-white p-5 text-center border-b-4 border-jobgold relative shadow-lg z-20">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-glow">
                            <Scale size={24} className="text-jobgold" />
                        </div>
                    </div>
                    <h2 className="text-lg font-serif font-black uppercase tracking-widest text-jobgold mb-1">Engagement du Prestataire</h2>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {contractId} • JobLibre Certified</p>
                    
                    {!canToggle && (
                        <div className="absolute bottom-4 right-4 animate-bounce text-jobgold bg-white/10 p-1.5 rounded-full">
                            <ArrowDown size={16} />
                        </div>
                    )}
                </div>

                {/* Content - Paper Style */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="p-8 overflow-y-auto bg-[#FDFBF7] space-y-6 text-justify border-b border-gray-200 relative font-serif text-gray-800"
                >
                    {/* Parties Identified */}
                    <div className="border-b border-gray-300 pb-6">
                        <h4 className="font-bold text-gray-900 text-xs uppercase mb-4">Entre les soussignés :</h4>
                        
                        {/* CLIENT */}
                        <div className="mb-4 pl-2 border-l-2 border-gray-300">
                            <p className="text-xs">
                                <span className="font-bold text-gray-500 uppercase">Donneur d'Ordre (Client)</span><br/>
                                <span className="font-black text-gray-900 text-sm">{clientName}</span>
                            </p>
                        </div>

                        {/* PRESTATAIRE (DIGITAL ID CARD) */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center gap-4 relative overflow-hidden">
                            {/* Watermark */}
                            <div className="absolute -right-4 -bottom-4 text-gray-100 rotate-[-15deg]">
                                <ShieldCheck size={80} />
                            </div>
                            
                            <img src={applicant.avatar} className="w-14 h-14 rounded-lg object-cover border border-gray-200 bg-gray-50 z-10" />
                            <div className="z-10 flex-1">
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">L'Exécutant (Vous)</div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="font-black text-sm uppercase text-gray-900">{applicant.name}</span>
                                    <CheckCircle2 size={14} className="text-blue-500 fill-blue-50" />
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">ID Compte: {applicant.id.toUpperCase()}</div>
                                <div className="text-[10px] text-green-700 font-bold flex items-center gap-1 mt-1">
                                    <Fingerprint size={10} /> Identité Vérifiée (KYC)
                                </div>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-2 italic text-center">
                            * En signant, vous autorisez JobLibre à fournir votre identité aux autorités en cas de vol ou de dommage.
                        </p>
                    </div>

                    {/* Objet */}
                    <div>
                        <h4 className="font-black text-gray-900 text-sm uppercase mb-2 bg-gray-200/50 p-1 pl-2 border-l-4 border-gray-900">Article 1 : La Mission</h4>
                        <div className="bg-white border border-gray-300 p-3 rounded mt-2 shadow-sm">
                            <p className="font-bold text-sm text-center">"{jobTitle}"</p>
                            <p className="text-xs text-center text-gray-500 mt-1">Lieu d'intervention : {jobLocation}</p>
                            <p className="text-xs text-center text-gray-500">Budget annoncé : {budget > 0 ? formatMoney(budget) + ' FCFA' : 'Sur Devis'}</p>
                        </div>
                    </div>

                    {/* Anti-Arnaque (CRUCIAL) */}
                    <div>
                        <h4 className="font-black text-red-900 text-sm uppercase mb-2 bg-red-50 p-1 pl-2 border-l-4 border-red-600 flex items-center gap-2">
                            <AlertTriangle size={14}/> Article 2 : Intégrité
                        </h4>
                        <p className="text-xs leading-relaxed font-bold text-red-900 mb-2">
                            Il est strictement interdit de demander au Client des frais supplémentaires (transport, dossier, avance) en dehors de l'application.
                        </p>
                        <p className="text-xs leading-relaxed text-gray-800">
                            <span className="font-bold">Pas de sous-traitance :</span> Je certifie que c'est bien moi, <span className="font-bold">{applicant.name}</span>, qui effectuerai le travail. Je ne revendrai pas cette mission.
                        </p>
                    </div>

                    {/* Sanctions */}
                    <div>
                        <h4 className="font-black text-gray-900 text-sm uppercase mb-2 bg-gray-200/50 p-1 pl-2 border-l-4 border-gray-900">Article 3 : Obligations</h4>
                        <p className="text-xs leading-relaxed">
                            Je m'engage à :
                        </p>
                        <ul className="list-disc list-inside text-xs space-y-1 ml-1 mt-1">
                            <li>Respecter les horaires convenus.</li>
                            <li>Fournir un travail de qualité professionnelle.</li>
                            <li>Respecter la confidentialité du domicile du client.</li>
                        </ul>
                    </div>
                    
                    {!canToggle && (
                        <div className="py-4 text-center">
                            <p className="text-[10px] text-red-500 font-bold animate-pulse uppercase tracking-wider">
                                Veuillez lire l'intégralité du contrat
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Interaction */}
                <div className="p-5 bg-white pb-safe border-t border-gray-100 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    
                    {/* CONFIRMATION TOGGLE */}
                    <div 
                        onClick={() => canToggle && setIsChecked(!isChecked)}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border-2 transition-all mb-4 cursor-pointer select-none",
                            !canToggle ? "opacity-50 grayscale cursor-not-allowed bg-gray-50 border-gray-100" : 
                            isChecked ? "bg-green-50 border-green-600 shadow-md" : "bg-white border-gray-200 hover:border-gray-400"
                        )}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors shrink-0",
                            isChecked ? "bg-green-600 border-green-600 text-white" : "border-gray-300 bg-white"
                        )}>
                            {isChecked && <Check size={16} strokeWidth={4} />}
                        </div>
                        <div className="flex-1">
                            <p className={cn("text-xs font-bold leading-tight", isChecked ? "text-green-900" : "text-gray-500")}>
                                {canToggle ? "Je suis la personne identifiée ci-dessus et je m'engage à respecter ces règles." : "Lecture obligatoire pour signature."}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="flex-1 font-bold border-2 border-gray-100 text-gray-500 h-14 rounded-xl">
                            Refuser
                        </Button>
                        <Button 
                            onClick={handleConfirm} 
                            disabled={!isChecked}
                            isLoading={isSigning}
                            className={cn(
                                "flex-[2] h-14 text-base shadow-xl transition-all rounded-xl font-serif font-black flex items-center justify-center gap-2",
                                isChecked ? "bg-gray-900 hover:bg-black text-white shadow-slate-900/30" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
                            )}
                        >
                            {isSigning ? 'Signature sécurisée...' : <><FileSignature size={18}/> SIGNER (POSTULER)</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (CongratulationModal, MissionControlPanel, ClientValidationPanel, ApplicantCard, HireModal kept same)
const CongratulationModal: React.FC<{ isOpen: boolean, onClose: () => void, budget: number }> = ({ isOpen, onClose, budget }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-sm rounded-[40px] p-8 relative z-10 animate-in zoom-in-95 duration-500 shadow-2xl flex flex-col items-center text-center overflow-hidden">
                {/* Confetti Background (Simulated via CSS gradients/dots) */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent"></div>
                
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200 animate-in zoom-in duration-700 delay-100 border-4 border-white ring-4 ring-green-50">
                    <CheckCircle2 size={48} strokeWidth={4} />
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">Félicitations !</h2>
                <p className="text-gray-500 font-medium mb-6">Le client vous a choisi pour cette mission.</p>
                
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 w-full mb-6">
                    <div className="text-xs font-bold text-green-800 uppercase mb-1">Fonds Sécurisés</div>
                    <div className="text-3xl font-black text-green-700">{formatMoney(budget)} F</div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-green-600 mt-2 font-medium">
                        <Lock size={10} /> Argent bloqué sur le séquestre
                    </div>
                </div>

                <Button onClick={onClose} className="w-full h-14 text-lg rounded-2xl bg-gray-900 text-white shadow-xl hover:scale-105 transition-transform">
                    Voir ma mission
                </Button>
            </div>
        </div>
    );
};

const MissionControlPanel: React.FC<{ job: Job, onProof: () => void, onContact: () => void, onGPS: () => void }> = ({ job, onProof, onContact, onGPS }) => {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl shadow-gray-900/20 mb-6 relative overflow-hidden animate-in slide-in-from-top-4">
            {/* Background FX */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-jobgreen/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <h3 className="font-black text-sm uppercase tracking-widest text-green-400">Mission En Cours</h3>
                        </div>
                        <div className="text-2xl font-black text-white">{job.title}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                        <Briefcase size={20} className="text-white" />
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -z-10 transform -translate-y-1/2"></div>
                    <div className="flex flex-col items-center gap-2 bg-gray-900 px-2 z-10">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-gray-900 flex items-center justify-center"><Check size={14} strokeWidth={4} /></div>
                        <span className="text-green-500">Validé</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-gray-900 px-2 z-10">
                        <div className="w-6 h-6 rounded-full bg-white text-gray-900 flex items-center justify-center animate-pulse"><Clock size={14} /></div>
                        <span className="text-white">En cours</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-gray-900 px-2 z-10">
                        <div className="w-6 h-6 rounded-full bg-gray-700 text-gray-500 flex items-center justify-center border border-gray-600"><Wallet size={12} /></div>
                        <span>Paiement</span>
                    </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/5 backdrop-blur-sm mb-6 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Montant Séquestré</div>
                        <div className="text-2xl font-black text-jobgold flex items-center gap-2">
                            {formatMoney(job.budget)} F <Lock size={14} className="opacity-50" />
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Client</div>
                        <div className="font-bold text-white text-sm">{job.postedBy.name}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onGPS} className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                        <Navigation size={16} /> Y aller
                    </button>
                    <button onClick={onContact} className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                        <Phone size={16} /> Contacter
                    </button>
                </div>
            </div>
        </div>
    );
};

// ... (ClientValidationPanel, ApplicantCard, HireModal, CampaignDashboard, BoostSuccessModal, ProofOfWorkModal kept same)
const ClientValidationPanel: React.FC<{ 
    job: Job, 
    worker: User, 
    onValidate: () => void, 
    onDispute: () => void 
}> = ({ job, worker, onValidate, onDispute }) => {
    return (
        <div className="bg-white border-2 border-green-500 rounded-3xl p-6 shadow-xl shadow-green-900/10 mb-6 relative overflow-hidden animate-in slide-in-from-top-4">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className="font-black text-sm uppercase tracking-widest text-green-700">Mission Terminée</h3>
                    </div>
                    <div className="text-2xl font-black text-gray-900 leading-tight">Validation Requise</div>
                </div>
                <div className="bg-green-100 p-2 rounded-xl text-green-700">
                    <CheckCircle2 size={24} />
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <img src={worker.avatar} className="w-12 h-12 rounded-xl object-cover" alt="Worker" />
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{worker.name}</div>
                        <div className="text-xs text-gray-500">a marqué la mission comme terminée.</div>
                    </div>
                </div>
                
                {/* Mock Proofs */}
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Preuves fournies</div>
                    <div className="flex gap-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg relative overflow-hidden group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye size={12} className="text-white"/></div>
                        </div>
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-col items-center justify-center text-gray-400 border border-gray-300">
                            <MapPin size={16} />
                            <span className="text-[9px] font-bold mt-1">GPS OK</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <button 
                    onClick={onValidate}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 px-4 font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 transition-all active:scale-95"
                >
                    <Wallet size={20} /> Valider & Payer {formatMoney(job.budget)} F
                </button>
                <button 
                    onClick={onDispute}
                    className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-transparent hover:border-red-100 rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <Flag size={16} /> Signaler un problème
                </button>
            </div>
        </div>
    );
};

const ApplicantCard: React.FC<{ applicant: User, onChat: () => void, onHire: () => void }> = ({ applicant, onChat, onHire }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-transform">
        <div className="flex items-center gap-3">
            <div className="relative">
                <img src={applicant.avatar} className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-50" alt={applicant.name} />
                {applicant.isVerified && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white"><Shield size={8} fill="currentColor" /></div>}
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{applicant.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-0.5 text-jobgold"><Star size={10} fill="currentColor"/> {applicant.rating}</span>
                    <span>•</span>
                    <span>{applicant.jobsCompleted} jobs</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onChat(); }} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 hover:text-jobgreen transition-colors">
                <MessageCircle size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onHire(); }} className="h-10 px-4 rounded-xl bg-jobgreen/10 text-jobgreen font-bold text-xs hover:bg-jobgreen hover:text-white transition-colors border border-jobgreen/20">
                Engager
            </button>
        </div>
    </div>
);

// ... (HireModal, CampaignDashboard, BoostSuccessModal, ProofOfWorkModal kept same)
const HireModal: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void, 
    applicant: User | null, 
    job: Job,
    onConfirm: () => void 
}> = ({ isOpen, onClose, applicant, job, onConfirm }) => {
    const [step, setStep] = useState<'review' | 'locking' | 'success'>('review');
    
    // CGU State
    const [acceptedEscrow, setAcceptedEscrow] = useState(false);
    const [acceptedRules, setAcceptedRules] = useState(false);

    // Fee Logic
    const amount = job.budget > 0 ? job.budget : 0;
    const fees = Math.round(amount * 0.05);
    const total = amount + fees;

    // Reset on Open
    useEffect(() => {
        if(isOpen) {
            setStep('review');
            setAcceptedEscrow(false);
            setAcceptedRules(false);
        }
    }, [isOpen]);

    const handleLock = () => {
        setStep('locking');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onConfirm();
            }, 1500);
        }, 2000);
    };

    if (!isOpen || !applicant) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl flex flex-col pb-safe max-h-[90vh]">
                
                {step === 'review' && (
                    <div className="p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <FileCheck className="text-jobgreen" size={24} /> Contrat
                            </h2>
                            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><Minus size={20} /></button>
                        </div>

                        {/* Recap Card */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6">
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
                                <img src={applicant.avatar} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">Prestataire</div>
                                    <div className="font-bold text-gray-900">{applicant.name}</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Montant Mission</span>
                                    <span className="font-bold text-gray-900">{formatMoney(amount)} F</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Frais de service (5%)</span>
                                    <span className="font-bold text-gray-900">{formatMoney(fees)} F</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-gray-900 uppercase text-xs">Total à Bloquer</span>
                                    <span className="font-black text-xl text-jobgreen">{formatMoney(total)} F</span>
                                </div>
                            </div>
                        </div>

                        {/* CGU CHECKBOXES */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Engagements</h3>
                            
                            <label className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer active:scale-[0.99] transition-transform">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${acceptedEscrow ? 'bg-jobgreen border-jobgreen text-white' : 'border-gray-300'}`}>
                                    {acceptedEscrow && <Check size={14} strokeWidth={3} />}
                                </div>
                                <input type="checkbox" className="hidden" checked={acceptedEscrow} onChange={() => setAcceptedEscrow(!acceptedEscrow)} />
                                <div className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Je comprends que les fonds seront <span className="font-bold text-gray-900">bloqués sur un compte séquestre</span> et libérés uniquement à la fin des travaux.
                                </div>
                            </label>

                            <label className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer active:scale-[0.99] transition-transform">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${acceptedRules ? 'bg-jobgreen border-jobgreen text-white' : 'border-gray-300'}`}>
                                    {acceptedRules && <Check size={14} strokeWidth={3} />}
                                </div>
                                <input type="checkbox" className="hidden" checked={acceptedRules} onChange={() => setAcceptedRules(!acceptedRules)} />
                                <div className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Je m'engage à <span className="font-bold text-gray-900">ne pas payer en dehors de l'application</span> (Airtel/MoMo direct) pour bénéficier de la protection.
                                </div>
                            </label>
                        </div>

                        <Button 
                            onClick={handleLock} 
                            disabled={!acceptedEscrow || !acceptedRules}
                            className={cn(
                                "w-full h-14 text-lg shadow-xl transition-all",
                                (!acceptedEscrow || !acceptedRules) ? "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black"
                            )}
                        >
                            <Lock size={18} className="mr-2" /> Bloquer les fonds
                        </Button>
                    </div>
                )}

                {step === 'locking' && (
                    <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in h-full min-h-[300px]">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-jobgreen border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lock size={32} className="text-gray-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Sécurisation des fonds...</h3>
                        <p className="text-sm text-gray-500">Création du contrat intelligent.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in h-full min-h-[300px]">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
                            <CheckCircle2 size={48} strokeWidth={4} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Félicitations !</h3>
                        <p className="text-gray-500 font-medium">{applicant.name} a été engagé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (CampaignDashboard, BoostSuccessModal, ProofOfWorkModal, JobCommentInput - kept same)
const CampaignDashboard: React.FC<{ job: Job, onInfo: (t: string, c: string) => void }> = ({ job, onInfo }) => {
    // ... (No changes needed here)
    const totalViews = job.views || 0;
    const organicViews = Math.floor(totalViews * 0.4);
    const boostedViews = totalViews - organicViews;
    const clicks = Math.floor(totalViews * 0.15); 
    
    const startDate = new Date(job.createdAt);
    const durationDays = job.isUrgent ? 2 : 1;
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const progress = Math.min(100, Math.max(0, ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
    
    const formatDate = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    return (
        <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl shadow-gray-900/20 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <h3 className="font-black text-sm uppercase tracking-widest text-white/80">Campagne Active</h3>
                    </div>
                    <div className="text-xs font-medium text-gray-400">{job.isUrgent ? "Boost Urgence (Max)" : "Boost Standard"}</div>
                </div>
                <button onClick={() => onInfo("Statistiques", "Données en temps réel sur la performance de votre mise en avant.")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <BarChart3 size={16} className="text-white" />
                </button>
            </div>
            <div className="mb-6 relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>{formatDate(startDate)}</span>
                    <span>Fin le {formatDate(endDate)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-jobgold to-yellow-300 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase"><Eye size={12} /> Vues Totales</div>
                    <div className="text-2xl font-black text-white">{totalViews}</div>
                    <div className="text-[10px] text-gray-400 mt-1 flex gap-1"><span className="text-jobgold font-bold">{boostedViews} Boost</span> • {organicViews} Orga.</div>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase"><MousePointer2 size={12} /> Clics (CTR)</div>
                    <div className="text-2xl font-black text-white">{clicks}</div>
                    <div className="text-[10px] text-green-400 mt-1 font-bold">15% Taux de clic</div>
                </div>
            </div>
        </div>
    );
}

const BoostSuccessModal: React.FC<{ isOpen: boolean; onClose: () => void; boostType: 'basic' | 'urgent'; duration: number }> = ({ isOpen, onClose, boostType, duration }) => {
    if (!isOpen) return null;
    const option = BOOST_OPTIONS.find(o => o.id === boostType);
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div><div className="bg-white w-full max-w-sm rounded-[32px] p-6 relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col items-center text-center overflow-hidden"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200 animate-in zoom-in duration-500 delay-100"><CheckCircle2 size={40} strokeWidth={4} /></div><h2 className="text-2xl font-black text-gray-900 mb-1">Transaction Validée !</h2><p className="text-sm text-gray-500 font-medium mb-6">Votre visibilité est active.</p><Button onClick={onClose} className="w-full h-14 text-lg rounded-xl bg-gray-900 text-white shadow-lg">Voir mon tableau de bord</Button></div></div>);
};

const ProofOfWorkModal: React.FC<{ onClose: () => void, onSubmit: () => void }> = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState<'photo' | 'geo' | 'confirm'>('photo');
    const [isLocating, setIsLocating] = useState(false);
    const handleGeoLocate = () => { setIsLocating(true); setTimeout(() => { setIsLocating(false); setStep('confirm'); }, 2000); };
    return (<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div><div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 pb-safe shadow-2xl"><div className="p-6"><div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div><h2 className="text-xl font-black text-gray-900 mb-2">Preuve de Travail</h2><p className="text-gray-500 text-sm font-medium mb-6">Pour débloquer les fonds, validez la fin de mission.</p>{step === 'photo' && (<div className="space-y-4 animate-in fade-in"><div className="aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-jobgreen hover:text-jobgreen transition-all" onClick={() => setStep('geo')}><Camera size={48} className="mb-2" /><span className="font-bold text-sm">Prendre photo "Après"</span><span className="text-[10px] text-gray-400 mt-1">Camera requise</span></div><Button variant="ghost" onClick={onClose} className="w-full">Annuler</Button></div>)}{step === 'geo' && (<div className="space-y-6 animate-in slide-in-from-right-4"><div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center gap-4 border border-blue-100 text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-pulse"><Navigation size={32} /></div><div><h3 className="font-bold text-blue-900">Géolocalisation</h3><p className="text-xs text-blue-700 mt-1">Nous vérifions que vous êtes sur le lieu d'intervention.</p></div></div><Button onClick={handleGeoLocate} isLoading={isLocating} className="w-full h-14 text-base shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">{isLocating ? 'Acquisition GPS...' : 'Valider ma position'}</Button></div>)}{step === 'confirm' && (<div className="space-y-6 animate-in zoom-in duration-300"><div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4"><CheckCircle2 size={32} /></div><h3 className="font-bold text-green-900 text-lg">Preuves Validées</h3><ul className="text-xs text-green-700 mt-3 space-y-2 text-left bg-white/50 p-3 rounded-xl"><li className="flex items-center gap-2"><CheckCircle2 size={12} /> Photo ajoutée au dossier</li><li className="flex items-center gap-2"><CheckCircle2 size={12} /> Position GPS confirmée (± 5m)</li><li className="flex items-center gap-2"><CheckCircle2 size={12} /> Horodatage certifié</li></ul></div><Button onClick={onSubmit} className="w-full h-14 text-lg shadow-lg shadow-green-500/20 bg-jobgreen hover:bg-green-700">Terminer la Mission</Button></div>)}</div></div></div>);
};

// ... (JobCommentInput, JobDetails... kept same)
// --- SIMPLE INPUT COMPONENT ---
const JobCommentInput = ({ 
    value, 
    onChange, 
    onSubmit 
}: { 
    value: string, 
    onChange: (val: string) => void, 
    onSubmit: (e: React.FormEvent) => void 
}) => {
    return (
        <form onSubmit={onSubmit} className="flex gap-2 relative z-10">
            <div className="flex-1 bg-gray-50 rounded-xl flex items-center px-4 py-2 border border-gray-200 focus-within:border-jobgreen focus-within:bg-white transition-colors">
                <input 
                    id="comment-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Posez une question..."
                    className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-900 placeholder:text-gray-400 selection:bg-jobgreen/20 selection:text-jobgreen"
                    autoComplete="off"
                />
            </div>
            <button 
                type="submit"
                disabled={!value.trim()}
                className="w-10 h-10 bg-jobgreen text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-900/10 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
            >
                <Send size={18} />
            </button>
        </form>
    );
};

export const JobDetails: React.FC<JobDetailsProps> = ({ job: initialJob, onBack, onNavigate }) => {
    const { user, jobs, savedJobIds, toggleSavedJob, addNotification, updateJob, openInfoModal, incrementJobView, applyToJob, addJobComment, getOrCreateConversation, addMessageToConversation, setActiveConversationId, toggleJobLike, toggleJobCommentLike, releaseEscrow } = useUser();
    const job = jobs.find(j => j.id === initialJob.id) || initialJob;

    const [activeTab, setActiveTab] = useState<'photos' | 'map'>('photos');
    const [showNegotiate, setShowNegotiate] = useState(false);
    const [commentText, setCommentText] = useState('');
    
    // Updated Boost UI State
    const [showBoostModal, setShowBoostModal] = useState(false);
    const [selectedBoost, setSelectedBoost] = useState<'basic' | 'urgent' | 'none'>('basic');
    const [boostDuration, setBoostDuration] = useState(1);
    const [showBoostValidation, setShowBoostValidation] = useState(false);
    const [showBoostSuccess, setShowBoostSuccess] = useState(false);

    // Hiring & Proof Modals
    const [showProofModal, setShowProofModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showHireModal, setShowHireModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<User | null>(null);
    
    // New: Congrats Modal for Hired User
    const [showCongrats, setShowCongrats] = useState(false);
    
    // New: Review Modal after closing
    const [showReviewModal, setShowReviewModal] = useState(false);

    // New: Legal Contract Modal State
    const [showLegalModal, setShowLegalModal] = useState(false);

    const viewCounted = useRef(false);
    const isOwner = job.postedBy.id === user.id;

    // --- MOCK APPLICANTS FOR OWNER VIEW ---
    const applicants = useMemo(() => {
        if (!isOwner || (job.applicants || 0) === 0) return [];
        const availableUsers = MOCK_USERS.filter(u => u.id !== user.id);
        const count = Math.min(job.applicants || 0, 5);
        return availableUsers.slice(0, count);
    }, [isOwner, job.applicants, user.id]);

    const unitLabelVerbose = {
        'fixed': '',
        'hourly': '/ Heure',
        'daily': '/ Jour',
        'monthly': '/ Mois'
    }[job.pricingUnit || 'fixed'];

    useEffect(() => {
        if (!isOwner && !viewCounted.current) {
            incrementJobView(job.id);
            viewCounted.current = true;
        }
    }, [isOwner, job.id]);

    useEffect(() => {
        if (job.status === 'taken' && job.assignedTo?.id === user.id) {
            const key = `seen_congrats_${job.id}`;
            if (!sessionStorage.getItem(key)) {
                setShowCongrats(true);
                sessionStorage.setItem(key, 'true');
            }
        }
    }, [job.status, job.assignedTo, user.id]);

    // ... (Carousel logic same)
    const displayPhotos = (job.images && job.images.length > 0) ? job.images : DEFAULT_JOB_PHOTOS;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const KEY = 'joblibre_arrows_seen_at';
        const lastSeen = localStorage.getItem(KEY);
        const now = Date.now();
        if (!lastSeen || (now - parseInt(lastSeen) > 24 * 60 * 60 * 1000)) setShowArrows(true);
    }, []);
    const dismissArrows = () => { if (showArrows) { setShowArrows(false); localStorage.setItem('joblibre_arrows_seen_at', Date.now().toString()); } };
    const scrollToImage = (index: number) => { if (carouselRef.current) { carouselRef.current.scrollTo({ left: carouselRef.current.offsetWidth * index, behavior: 'smooth' }); setCurrentImageIndex(index); } };
    const handleScroll = () => { dismissArrows(); if (carouselRef.current) { const newIndex = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth); if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex); } };
    const nextImage = () => { dismissArrows(); scrollToImage(currentImageIndex === displayPhotos.length - 1 ? 0 : currentImageIndex + 1); };
    const prevImage = () => { dismissArrows(); scrollToImage(currentImageIndex === 0 ? displayPhotos.length - 1 : currentImageIndex - 1); };

    const [offer, setOffer] = useState<number>(job.budget > 0 ? job.budget : 10000);
    const [loading, setLoading] = useState(false);
    
    // --- UPDATED APPLICATION LOGIC ---
    const hasApplied = user.appliedJobIds?.includes(job.id) || false;
    
    const isHiring = job.type === 'hiring';
    const isSaved = savedJobIds.includes(job.id);
    const isLiked = job.likedByMe;
    const likeCount = job.likes || 0;

    const isAssignedToMe = job.assignedTo?.id === user.id || (job.status === 'taken' && hasApplied); // Simplification for demo
    const userLimits = TIER_LIMITS[user.tier];
    const appLimit = userLimits.maxApplications;
    const appsUsed = user.monthlyApplicationsUsed;
    const isQuotaExceeded = appsUsed >= appLimit;
    const canNegotiate = userLimits.canNegotiate;
    
    const isBudgetMasked = !isOwner && job.budget > userLimits.maxBudgetView;

    // --- DETERMINE FOOTER STATUS ---
    const showActionFooter = !isOwner && !isAssignedToMe;
    const showWorkerFooter = isAssignedToMe && job.status !== 'completed';

    const handleToggleSave = () => { toggleSavedJob(job.id); addNotification(isSaved ? 'Retiré' : 'Sauvegardé', `L'annonce a été ${isSaved ? 'retirée de' : 'ajoutée à'} vos favoris.`, 'success'); }
    const handleToggleLike = () => { toggleJobLike(job.id); };
    const handleShare = async () => { if (navigator.share) { try { await navigator.share({ title: `JobLibre: ${job.title}`, text: `Regarde cette mission sur JobLibre : ${job.title}`, url: window.location.href }); } catch (error) { console.log('Error sharing', error); } } else { alert("Lien copié dans le presse-papier !"); } };
    const handleOpenMap = () => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`, '_blank'); };
    
    const handleOfferSubmit = () => { 
        setLoading(true); 
        const conversationId = getOrCreateConversation(job.postedBy, job);
        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            text: `Je vous propose ${offer.toLocaleString()} FCFA pour cette mission.`,
            timestamp: 'À l\'instant',
            type: 'negotiation',
            metadata: { amount: offer, status: 'pending', jobId: job.id }
        };
        addMessageToConversation(conversationId, msg);
        setTimeout(() => { 
            setLoading(false); 
            setShowNegotiate(false); 
            setActiveConversationId(conversationId);
            if (onNavigate) {
                onNavigate(AppTab.MESSAGES);
            }
        }, 1000); 
    };
    
    // 1. TRIGGER MODAL OR VERIFICATION
    const handleApplyClick = () => { 
        // 1. Identity Check
        if (!user.isVerified) {
            openInfoModal(
                "Identité non vérifiée", 
                "Pour postuler à une mission et signer un contrat, vous devez valider votre identité (CNI/Passeport). Rendez-vous dans votre Profil > Vérification."
            );
            return;
        }

        if (isQuotaExceeded) { setShowUpgradeModal(true); return; } 
        setShowLegalModal(true); // Open Contract
    };

    // 2. ACTUAL APPLY LOGIC AFTER CONTRACT SIGNATURE
    const handleConfirmApplication = () => {
        setShowLegalModal(false);
        setLoading(true);
        setTimeout(() => { 
            applyToJob(job);
            setLoading(false); 
            if (onNavigate) {
                onNavigate(AppTab.MESSAGES);
            }
        }, 1000); 
    };
    
    const handleProofSubmit = () => { updateJob(job.id, { status: 'completed' }); addNotification('Mission Terminée', 'Les fonds seront libérés après validation client.', 'success'); setShowProofModal(false); onBack(); };
    
    const triggerUpgrade = () => { setShowUpgradeModal(true); };

    const handleConfirmBoost = (boostType: 'basic' | 'urgent') => {
        if (boostType === 'basic') updateJob(job.id, { isBoosted: true });
        if (boostType === 'urgent') updateJob(job.id, { isUrgent: true, isBoosted: true });
        setShowBoostValidation(false);
        setShowBoostModal(false);
        setTimeout(() => setShowBoostSuccess(true), 300);
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addJobComment(job.id, commentText);
        setCommentText('');
    };

    const handleContactApplicant = (applicant: User) => {
        const conversationId = getOrCreateConversation(applicant, job);
        setActiveConversationId(conversationId);
        if (onNavigate) {
            onNavigate(AppTab.MESSAGES);
        }
    };

    const handleContactClient = () => {
        const conversationId = getOrCreateConversation(job.postedBy, job);
        setActiveConversationId(conversationId);
        if (onNavigate) {
            onNavigate(AppTab.MESSAGES);
        }
    };

    const openHireModal = (applicant: User) => {
        setSelectedApplicant(applicant);
        setShowHireModal(true);
    };

    const handleConfirmHire = () => {
        if (selectedApplicant) {
            updateJob(job.id, { status: 'taken', assignedTo: selectedApplicant });
            addNotification('Fonds Séquestrés', `Le montant de la mission est bloqué. ${selectedApplicant.name} a été notifié.`, 'success');
            setShowHireModal(false);
            onBack();
        }
    };

    const handleClientValidate = () => {
        if (confirm("Confirmer la libération des fonds ? Cette action est irréversible.")) {
            releaseEscrow(job);
            setShowReviewModal(true);
        }
    };

    const handleDispute = () => {
        openInfoModal("Signalement", "Le support client a été notifié du litige. Un médiateur vous contactera sous 24h.");
    };

    return (
        <div className={cn("min-h-screen bg-gray-50 relative", (showActionFooter || showWorkerFooter) ? "pb-44" : "pb-24")}>
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-50 px-4 py-3 flex justify-between items-center border-b border-gray-200 transition-all">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform"><ArrowLeft size={22} className="text-gray-900" /></button>
                <div className="flex flex-col items-center"><span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Mission</span><span className="font-black text-sm text-gray-900 truncate max-w-[150px]">{job.title}</span></div>
                <div className="flex gap-1 -mr-2">
                    {/* Header Actions */}
                    <button onClick={handleToggleSave} className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform"><Bookmark size={22} className={cn("text-gray-900 transition-all", isSaved ? "fill-jobgold text-jobgold" : "")} /></button>
                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-transform"><Share2 size={22} className="text-gray-900" /></button>
                </div>
            </div>

            <div>
                <div className="bg-white border-b border-gray-200 pb-6">
                    {/* ... Image Carousel Code ... */}
                    <div className="h-64 w-full relative bg-gray-100 overflow-hidden group">
                        {/* ... (Kept existing image logic) ... */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10"></div>
                        {activeTab === 'photos' ? (<><div ref={carouselRef} onScroll={handleScroll} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">{displayPhotos.map((photo, i) => (<div key={i} className="w-full h-full flex-shrink-0 snap-center"><img src={photo} className="w-full h-full object-cover" alt={`Job ${i+1}`} /></div>))}</div>{displayPhotos.length > 1 && (<><button onClick={(e) => { e.stopPropagation(); prevImage(); }} className={cn("absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm z-20 transition-all duration-500", showArrows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none")}><ChevronLeft size={24} /></button><button onClick={(e) => { e.stopPropagation(); nextImage(); }} className={cn("absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm z-20 transition-all duration-500", showArrows ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none")}><ChevronRightIcon size={24} /></button></>)}<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">{displayPhotos.map((_, i) => (<div key={i} className={cn("h-1.5 rounded-full transition-all duration-300 shadow-sm", i === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50")} />))}</div></>) : (<div onClick={handleOpenMap} className="w-full h-full relative cursor-pointer"><img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/9.45,0.41,13,0/600x400?access_token=pk.mock`} className="w-full h-full object-cover" alt="Map" /><div className="absolute inset-0 bg-black/10 flex items-center justify-center"><button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-xs hover:scale-105 transition-transform"><ExternalLink size={14}/> Ouvrir GPS</button></div></div>)}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur p-1 rounded-xl shadow-lg flex gap-1 border border-white/50 z-20"><button onClick={() => setActiveTab('photos')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2", activeTab === 'photos' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100")}><ImageIcon size={14} /> Photos</button><button onClick={() => setActiveTab('map')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2", activeTab === 'map' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100")}><MapPin size={14} /> Carte</button></div>
                    </div>

                    <div className="px-5 pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2 items-center flex-wrap">
                                <span className="bg-jobgreen/10 text-jobgreen px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-jobgreen/20">{job.category}</span>
                                {job.isUrgent ? (
                                    <div className="relative group/badge overflow-hidden rounded-md">
                                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wide border border-red-400 flex items-center gap-1 shadow-sm relative">
                                            <div className="absolute inset-0 -translate-x-full animate-glass-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"></div>
                                            <div className="animate-wiggle-violent relative z-10"><Zap size={8} fill="white" /></div>
                                            <span className="relative z-10">URGENT</span>
                                        </div>
                                    </div>
                                ) : job.isBoosted ? (
                                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-orange-200 flex items-center gap-1">
                                        <TrendingUp size={12} strokeWidth={3} />
                                        <span>Boosté</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{job.title}</h1>
                        
                        {/* LOCATION & HEART ROW */}
                        <div className="flex items-center justify-between mt-1">
                            <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" /> {job.location}
                            </div>
                            
                            {/* HEART MOVED HERE */}
                            <button 
                                onClick={handleToggleLike}
                                className="flex items-center gap-1.5 group active:scale-95 transition-transform p-1 -mr-1"
                            >
                                {likeCount > 0 && <span className={cn("text-xs font-bold", isLiked ? "text-red-500" : "text-gray-400")}>{likeCount}</span>}
                                <Heart size={24} className={cn("transition-all", isLiked ? "fill-red-500 text-red-500 animate-wiggle-violent" : "text-gray-300 group-hover:text-gray-400")} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-6 space-y-6">
                    {/* --- NEW: ACTIVE MISSION DASHBOARD (WORKER VIEW) --- */}
                    {isAssignedToMe && (
                        <MissionControlPanel 
                            job={job} 
                            onProof={() => setShowProofModal(true)} 
                            onContact={handleContactClient}
                            onGPS={handleOpenMap}
                        />
                    )}

                    {/* --- NEW: CLIENT VALIDATION PANEL (OWNER VIEW + COMPLETED) --- */}
                    {isOwner && job.status === 'completed' && job.assignedTo && (
                        <ClientValidationPanel 
                            job={job}
                            worker={job.assignedTo}
                            onValidate={handleClientValidate}
                            onDispute={handleDispute}
                        />
                    )}

                    {/* ... (Campaign Dashboard, Quota, Budget Blocks kept same) ... */}
                    {isOwner && job.isBoosted && (
                        <div className="animate-in slide-in-from-bottom-4">
                            <CampaignDashboard job={job} onInfo={openInfoModal} />
                        </div>
                    )}

                    {/* --- APPLICANTS SECTION (OWNER ONLY) --- */}
                    {isOwner && applicants.length > 0 && (
                        <div className="animate-in slide-in-from-bottom-6">
                            <SectionTitle label={`Candidatures Reçues (${applicants.length})`} info="Liste des personnes intéressées par votre mission." onInfo={openInfoModal} />
                            <div className="space-y-3">
                                {applicants.map(app => (
                                    <ApplicantCard 
                                        key={app.id} 
                                        applicant={app} 
                                        onChat={() => handleContactApplicant(app)}
                                        onHire={() => openHireModal(app)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HIDE BUDGET BLOCK IF ASSIGNED TO ME (IT'S IN DASHBOARD) */}
                    {!isOwner && !isAssignedToMe && (
                        <>
                            <div onClick={() => isQuotaExceeded && triggerUpgrade()} className={cn("rounded-2xl p-4 border flex items-start gap-3 relative overflow-hidden transition-all active:scale-98 cursor-pointer", isQuotaExceeded ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100")}>
                                <div className={cn("p-2 rounded-full shrink-0", isQuotaExceeded ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")}><AlertOctagon size={20} /></div>
                                <div className="flex-1 z-10"><h3 className={cn("font-black text-sm uppercase mb-1", isQuotaExceeded ? "text-red-900" : "text-blue-900")}>Vos Quotas Mensuels</h3><div className="w-full bg-white/50 h-2 rounded-full mb-2 overflow-hidden border border-black/5"><div className={cn("h-full transition-all duration-500", isQuotaExceeded ? "bg-red-500" : "bg-blue-500")} style={{ width: `${Math.min((appsUsed / appLimit) * 100, 100)}%` }}></div></div><p className={cn("text-xs font-medium leading-tight", isQuotaExceeded ? "text-red-800" : "text-blue-800")}>Vous avez utilisé <span className="font-bold">{appsUsed} / {appLimit}</span> candidatures. {isQuotaExceeded ? " Touchez pour débloquer l'illimité." : " Choisissez bien vos missions."}</p></div>
                            </div>
                            
                            <div onClick={() => isBudgetMasked && triggerUpgrade()} className={cn("bg-gradient-to-br rounded-2xl p-5 shadow-lg relative overflow-hidden transform transition-all active:scale-[0.99] cursor-pointer", isBudgetMasked ? "from-gray-800 to-gray-900 border-2 border-jobgold/50" : "from-gray-900 to-gray-800")}>
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <div className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                            Budget Client
                                        </div>
                                        <div className="text-3xl font-black tracking-tight flex items-center gap-1.5 text-jobgold">
                                            {isBudgetMasked ? (
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <EyeOff size={24} /> <span className="blur-sm select-none">350.000</span>
                                                </div>
                                            ) : (
                                                job.budget > 0 ? (
                                                    <>
                                                        <span className="text-jobgold">{job.budget.toLocaleString()}</span>
                                                        <span className="text-lg text-gray-400 ml-1">FCFA</span>
                                                        <span className="text-sm font-bold text-gray-500 ml-1">{unitLabelVerbose}</span>
                                                    </>
                                                ) : <span className="text-jobgold">Sur Devis</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                        {isBudgetMasked ? (
                                            <Lock size={24} className="text-jobgold" />
                                        ) : (
                                            <div className="animate-wiggle-violent">
                                                <Shield size={24} className="text-jobgold fill-jobgold/20" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {/* DESCRIPTION (Restored to simple) */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <SectionTitle label="Description de la mission" info="Détails fournis par le client." onInfo={openInfoModal} />
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 mt-1">
                                <FileText size={16} />
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                {job.description || "Aucune description détaillée fournie."}
                            </p>
                        </div>
                        <div className="text-[10px] font-medium text-gray-400 mt-4 text-right border-t border-gray-50 pt-2">
                            Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}
                        </div>
                    </div>
                    
                    {/* COMMENT SECTION IN DETAILS - FULLY ADAPTIVE */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <SectionTitle label={`Commentaires (${job.comments?.length || 0})`} info="Questions publiques sur cette mission." onInfo={openInfoModal} />
                        
                        <div className="space-y-4 mb-4">
                            {job.comments && job.comments.length > 0 ? (
                                job.comments.map((comment) => {
                                    const isMe = comment.userId === user.id;
                                    const isLiked = comment.likedByMe;
                                    const likes = comment.likes || 0;

                                    return (
                                        <div key={comment.id} className={cn("flex gap-3 relative group", isMe ? "flex-row-reverse" : "")}>
                                            <img src={comment.userAvatar} className="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1" />
                                            <div className={cn("max-w-[85%] rounded-xl p-3 text-sm relative pb-5", isMe ? "bg-blue-50 text-gray-900 rounded-tr-none" : "bg-gray-50 text-gray-900 rounded-tl-none")}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-xs text-gray-900">{isMe ? "Moi" : comment.userName}</span>
                                                    {comment.isOwner && <span className="bg-jobgreen text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-bold"><Shield size={8} /> Auteur</span>}
                                                    <span className="text-[9px] text-gray-400">{comment.timestamp}</span>
                                                </div>
                                                <p className="text-gray-700">{comment.text}</p>

                                                {/* Like Button (Cleaned) */}
                                                <button 
                                                    onClick={() => toggleJobCommentLike(job.id, comment.id)}
                                                    className={cn(
                                                        "absolute -bottom-2 flex items-center gap-1 px-1.5 py-0.5 transition-all active:scale-90",
                                                        isMe ? "left-0" : "right-0",
                                                        isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                                                    )}
                                                >
                                                    <Heart size={10} className={cn(isLiked ? "fill-current animate-wiggle-violent" : "")} />
                                                    {likes > 0 && <span className="text-[9px] font-bold">{likes}</span>}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-center text-gray-400 text-xs py-4">Aucun commentaire pour l'instant.</p>
                            )}
                        </div>
                    </div>

                    <div className="h-6"></div>
                </div>
            </div>

            {/* UNIFIED FIXED FOOTER (Consistent Input + Action Buttons) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
                
                {/* 1. Comment Input Area (Always Visible) */}
                <div className={cn("px-3 py-2", (showActionFooter || showWorkerFooter) ? "border-b border-gray-100" : "")}>
                    <div className="max-w-lg mx-auto">
                        <JobCommentInput 
                            value={commentText} 
                            onChange={setCommentText} 
                            onSubmit={handleSendComment} 
                        />
                    </div>
                </div>

                {/* 2. Action Buttons (Visitor Only) */}
                {showActionFooter && (
                    <div className="p-3 pt-2">
                        <div className="flex gap-3 max-w-lg mx-auto">
                            <Button 
                                onClick={() => { if (canNegotiate) { setShowNegotiate(true); } else { triggerUpgrade(); } }} 
                                variant="secondary" 
                                className="flex-1 font-bold rounded-xl border-b-4 border-yellow-500 active:border-b-0 active:translate-y-1 transition-all h-14 text-sm relative" 
                                disabled={hasApplied}
                            >
                                {!canNegotiate && <Lock size={14} className="absolute top-1 right-1 text-yellow-700 opacity-50" />}
                                {canNegotiate ? "Négocier" : "Prix Fixe"}
                            </Button>
                            <Button 
                                onClick={handleApplyClick} // Calls Legal Modal
                                isLoading={loading} 
                                disabled={hasApplied} 
                                className={cn("flex-[2] font-black text-lg rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all h-14 shadow-lg", hasApplied ? "bg-gray-100 text-gray-500 border-gray-200 shadow-none" : isQuotaExceeded ? "bg-gray-200 text-gray-500 border-gray-300" : isHiring ? "bg-jobgreen border-green-800 shadow-green-900/20" : "bg-blue-600 hover:bg-blue-700 border-blue-800 shadow-blue-900/20")}
                            >
                                {hasApplied ? (<span className="flex items-center gap-2"><CheckCircle2 size={20} /> Voir Candidature</span>) : isQuotaExceeded ? (<span className="flex items-center gap-2"><Lock size={20} /> Quota Atteint</span>) : isHiring ? (<span className="flex items-center gap-2"><Send size={20} /> Postuler</span>) : (<span className="flex items-center gap-2"><Phone size={20} /> Réserver</span>)}
                            </Button>
                        </div>
                    </div>
                )}

                {/* 3. WORKER FOOTER (Active Mission) */}
                {showWorkerFooter && (
                    <div className="p-3 pt-2">
                        <Button 
                            onClick={() => setShowProofModal(true)}
                            className="w-full h-14 text-lg rounded-xl bg-jobgreen text-white shadow-lg shadow-green-900/20 font-bold"
                        >
                            <Camera size={20} className="mr-2" /> Terminer (Envoyer Preuves)
                        </Button>
                    </div>
                )}
            </div>
            
            {/* ... Modals included ... */}
            
            <LegalContractModal 
                isOpen={showLegalModal}
                onClose={() => setShowLegalModal(false)}
                onConfirm={handleConfirmApplication}
                jobTitle={job.title}
                clientName={job.postedBy.name}
                budget={job.budget}
                jobLocation={job.location}
                applicant={user}
            />

            {showNegotiate && canNegotiate && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in" onClick={() => setShowNegotiate(false)}/>
                    <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 pointer-events-auto shadow-2xl animate-in slide-in-from-bottom-10 border-t-2 border-gray-200 relative pb-safe">
                         {/* ... Drawer Content ... */}
                         <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                         <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-black text-gray-900">Faire une offre</h2><p className="text-sm text-gray-500 font-medium">Proposez votre tarif pour cette mission.</p></div><div className="w-12 h-12 rounded-full bg-jobgold/10 flex items-center justify-center border border-jobgold/20"><Wallet className="text-jobgold" size={24} /></div></div>
                         <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 mb-6 flex items-center justify-between"><div className="text-sm font-bold text-gray-500">Budget client</div><div className="text-xl font-black text-gray-900">{job.budget > 0 ? job.budget.toLocaleString() : 'Sur devis'} <span className="text-sm text-gray-400">FCFA</span></div></div>
                         <div className="flex items-center justify-between gap-4 mb-6"><button onClick={() => setOffer(p => Math.max(0, p - 500))} className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 active:scale-90 transition-all hover:bg-gray-200"><Minus size={28} strokeWidth={3} /></button><div className="flex-1 text-center bg-gray-50 py-3 rounded-2xl border border-gray-100"><div className="text-xs font-bold text-gray-400 uppercase mb-1">Votre Offre</div><div className="text-3xl font-black text-gray-900 tracking-tight">{offer.toLocaleString()} <span className="text-lg text-gray-400">F</span></div></div><button onClick={() => setOffer(p => p + 500)} className="w-16 h-16 rounded-2xl bg-jobgreen flex items-center justify-center text-white active:scale-90 transition-all shadow-lg shadow-green-200 hover:bg-green-700"><Plus size={28} strokeWidth={3} /></button></div>
                         <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6"><Shield className="text-blue-600 shrink-0 mt-0.5" size={18} /><div className="text-xs text-blue-800 font-medium"><span className="font-bold">Protection JobLibre</span><br/>Le paiement est bloqué jusqu'à ce que le client valide la fin de la mission.</div></div>
                         <div className="flex gap-3"><Button variant="ghost" onClick={() => setShowNegotiate(false)} className="flex-1 border-2 border-gray-200 h-14 font-bold text-gray-500">Annuler</Button><Button className="flex-[2] h-14 text-base font-bold shadow-lg shadow-green-900/10" onClick={handleOfferSubmit} isLoading={loading} disabled={offer <= 0}>Envoyer</Button></div>
                    </div>
                </div>
            )}

            {showBoostModal && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowBoostModal(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 pb-safe shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="p-6 pb-2">
                            <h2 className="text-xl font-black text-gray-900 text-center mb-1">Booster l'annonce</h2>
                            <p className="text-sm text-gray-500 text-center font-medium">Augmentez votre visibilité.</p>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <BoostSelector 
                                selectedBoostId={selectedBoost === 'none' ? 'basic' : selectedBoost} 
                                onSelect={(id) => id !== 'none' && setSelectedBoost(id)} 
                                userCoins={user.bronzeCoins}
                                duration={boostDuration}
                                onDurationChange={setBoostDuration}
                            />
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <Button 
                                onClick={() => setShowBoostValidation(true)} 
                                className="w-full h-14 text-lg rounded-xl shadow-xl"
                            >
                                Continuer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <BoostValidationModal 
                isOpen={showBoostValidation} 
                onClose={() => setShowBoostValidation(false)}
                boostId={selectedBoost === 'none' ? 'basic' : selectedBoost} 
                duration={boostDuration}
                onConfirm={() => handleConfirmBoost(selectedBoost === 'none' ? 'basic' : selectedBoost)} 
            />

            <BoostSuccessModal 
                isOpen={showBoostSuccess}
                onClose={() => setShowBoostSuccess(false)}
                boostType={selectedBoost === 'none' ? 'basic' : selectedBoost}
                duration={boostDuration}
            />
            
            {/* Hire Modal (For Owner) */}
            <HireModal 
                isOpen={showHireModal} 
                onClose={() => setShowHireModal(false)}
                applicant={selectedApplicant}
                job={job}
                onConfirm={handleConfirmHire}
            />

            {/* CONGRATS MODAL (For Worker) */}
            <CongratulationModal 
                isOpen={showCongrats} 
                onClose={() => setShowCongrats(false)} 
                budget={job.budget} 
            />

            {showProofModal && (<ProofOfWorkModal onClose={() => setShowProofModal(false)} onSubmit={handleProofSubmit} />)}
            <CoinShopModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} initialTab='premium' />
            <ReviewsModal isOpen={showReviewModal} onClose={() => { setShowReviewModal(false); onBack(); }} rating={0} reviewCount={0} userName={job.assignedTo?.name || ''} />
        </div>
    );
};