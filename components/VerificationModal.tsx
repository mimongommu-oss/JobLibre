
import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, Camera, CheckCircle2, Video, AlertTriangle, Fingerprint, Lock, Upload, Play, Square, UserCheck, Clock, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';
import { User } from '../types';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUser, openInfoModal } = useUser();
    const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'video'>('overview');
    const [isUploading, setIsUploading] = useState(false);
    
    // Video Recorder State
    const [isRecording, setIsRecording] = useState(false);
    const [videoTime, setVideoTime] = useState(0);
    const [videoBlob, setVideoBlob] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Calculate score dynamically based on user.verificationDocs
    const getDocStatus = (type: string) => user.verificationDocs?.find(d => d.type === type)?.status || 'missing';
    
    // Determine Score
    const calculateScore = () => {
        let score = 0;
        if (getDocStatus('id_card') === 'verified') score += 40;
        else if (getDocStatus('id_card') === 'pending') score += 10;

        if (getDocStatus('security_video') === 'verified') score += 40;
        else if (getDocStatus('security_video') === 'pending') score += 20;

        if (getDocStatus('residence_proof') === 'verified') score += 20;
        return score;
    };

    const currentScore = calculateScore();

    // Reset on open
    useEffect(() => {
        if(isOpen) setActiveTab('overview');
    }, [isOpen]);

    // Handle File Upload Simulation
    const handleFileUpload = (type: 'id_card' | 'residence_proof') => {
        setIsUploading(true);
        setTimeout(() => {
            const currentDocs = user.verificationDocs || [];
            const newDocs = [...currentDocs.filter(d => d.type !== type)];
            newDocs.push({ type, status: 'pending', uploadedAt: new Date().toISOString() });
            
            updateUser({ verificationDocs: newDocs });
            setIsUploading(false);
            openInfoModal("Document Reçu", "Votre document est en cours d'analyse par nos équipes de sécurité.");
        }, 1500);
    };

    // --- VIDEO RECORDING LOGIC (SIMULATED) ---
    const startRecording = () => {
        setIsRecording(true);
        setVideoTime(0);
        timerRef.current = setInterval(() => {
            setVideoTime(prev => {
                if (prev >= 10) { // Max 10s
                    stopRecording();
                    return 10;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        setVideoBlob("fake_video_blob_url"); // Simulate a recorded video
    };

    const submitVideo = () => {
        setIsUploading(true);
        setTimeout(() => {
            const currentDocs = user.verificationDocs || [];
            const newDocs = [...currentDocs.filter(d => d.type !== 'security_video')];
            newDocs.push({ type: 'security_video', status: 'verified', uploadedAt: new Date().toISOString() }); // Auto-verify for demo
            
            // If ID Card is also pending/verified, set user as Global Verified
            const idStatus = getDocStatus('id_card');
            let updates: Partial<User> = { verificationDocs: newDocs };
            
            // Verification Score logic check
            const score = calculateScore();
            if (score >= 80) {
                updates.isVerified = true;
                updates.tier = 'verified';
            }

            updateUser(updates);
            setIsUploading(false);
            setVideoBlob(null);
            setActiveTab('overview');
            openInfoModal("Vérification Réussie", "Votre vidéo de sécurité a été validée. Votre profil gagne en crédibilité !");
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl flex flex-col">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-black flex items-center gap-2">
                                <ShieldCheck className="text-jobgreen" /> Centre de Confiance
                            </h2>
                            <p className="text-slate-400 text-xs font-medium mt-1">
                                Prouvez votre identité pour débloquer les contrats sécurisés.
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-700" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-jobgreen transition-all duration-1000" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * currentScore) / 100} />
                            </svg>
                            <span className="absolute text-sm font-black">{currentScore}%</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold uppercase text-jobgreen mb-1">Score de Crédibilité</div>
                            <p className="text-[10px] text-slate-300">
                                {currentScore < 50 ? "Profil Faible. Risque de rejet des contrats." : "Profil Solide. Accès prioritaire aux missions."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-white">
                    <button onClick={() => setActiveTab('overview')} className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors", activeTab === 'overview' ? "border-jobgreen text-jobgreen" : "border-transparent text-gray-400")}>Vue d'ensemble</button>
                    <button onClick={() => setActiveTab('docs')} className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors", activeTab === 'docs' ? "border-jobgreen text-jobgreen" : "border-transparent text-gray-400")}>Documents</button>
                    <button onClick={() => setActiveTab('video')} className={cn("flex-1 py-4 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors flex items-center justify-center gap-1", activeTab === 'video' ? "border-jobgreen text-jobgreen" : "border-transparent text-gray-400")}>
                        <Video size={14} /> Preuve Vidéo
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-6 pb-safe">
                    
                    {/* --- TAB 1: OVERVIEW --- */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                    <Fingerprint size={20} className="text-blue-600" /> Éléments requis
                                </h3>
                                <div className="space-y-3">
                                    <StatusRow 
                                        label="Pièce d'Identité (CNI/Passeport)" 
                                        status={getDocStatus('id_card')} 
                                        onClick={() => setActiveTab('docs')}
                                    />
                                    <StatusRow 
                                        label="Vidéo de Sécurité (Preuve de vie)" 
                                        status={getDocStatus('security_video')} 
                                        onClick={() => setActiveTab('video')}
                                        isCrucial
                                    />
                                    <StatusRow 
                                        label="Justificatif de Domicile" 
                                        status={getDocStatus('residence_proof')} 
                                        onClick={() => setActiveTab('docs')}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                                <Lock className="text-blue-600 shrink-0" size={20} />
                                <div className="text-xs text-blue-800 leading-relaxed">
                                    <span className="font-bold">Confidentialité Totale :</span> Vos documents sont cryptés et stockés dans un coffre-fort numérique. Ils ne sont jamais partagés publiquement. Seul le statut "Vérifié" est visible.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB 2: DOCUMENTS --- */}
                    {activeTab === 'docs' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <UploadCard 
                                title="Carte Nationale d'Identité"
                                subtitle="Recto/Verso lisible. Pas de reflets."
                                status={getDocStatus('id_card')}
                                onUpload={() => handleFileUpload('id_card')}
                                isUploading={isUploading}
                            />
                            <UploadCard 
                                title="Justificatif de Domicile"
                                subtitle="Facture SEEG ou Certificat de résidence < 3 mois."
                                status={getDocStatus('residence_proof')}
                                onUpload={() => handleFileUpload('residence_proof')}
                                isUploading={isUploading}
                            />
                        </div>
                    )}

                    {/* --- TAB 3: VIDEO (THE CORE FEATURE) --- */}
                    {activeTab === 'video' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            {!videoBlob ? (
                                <>
                                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl text-center">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 text-yellow-700">
                                            <Video size={24} />
                                        </div>
                                        <h3 className="font-bold text-yellow-900 text-sm mb-1">Preuve de Vie Obligatoire</h3>
                                        <p className="text-xs text-yellow-800 mb-3">
                                            Pour éviter les faux profils, vous devez enregistrer une courte vidéo (10s max).
                                        </p>
                                    </div>

                                    {/* CAMERA PREVIEW MOCK */}
                                    <div className="aspect-[3/4] bg-gray-900 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                                        {isRecording && (
                                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 px-3 py-1 rounded-full text-white text-xs font-bold animate-pulse">
                                                <div className="w-2 h-2 bg-white rounded-full"></div> REC {videoTime}s
                                            </div>
                                        )}
                                        
                                        <UserCheck size={64} className="text-gray-700 mb-4" />
                                        
                                        {/* SCRIPT OVERLAY */}
                                        <div className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur rounded-xl p-4 text-white text-center border border-white/20">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Lisez ce texte à haute voix :</p>
                                            <p className="text-sm font-bold leading-relaxed">
                                                "Je suis <span className="text-jobgreen">{user.name}</span>, né(e) le [Date], et je certifie mon identité sur JobLibre."
                                            </p>
                                        </div>

                                        {/* CONTROLS */}
                                        <div className="absolute bottom-6 w-full flex justify-center">
                                            {!isRecording ? (
                                                <button onClick={startRecording} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:scale-105 transition-transform shadow-lg">
                                                    <div className="w-6 h-6 bg-white rounded-full"></div> 
                                                </button>
                                            ) : (
                                                <button onClick={stopRecording} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors">
                                                    <Square size={24} className="fill-red-500 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4 animate-in zoom-in">
                                    <div className="aspect-video bg-black rounded-2xl flex items-center justify-center relative">
                                        <Play size={48} className="text-white opacity-50" />
                                        <span className="absolute bottom-2 right-2 text-white text-xs font-mono">00:{videoTime < 10 ? `0${videoTime}` : videoTime}</span>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-600" />
                                        <span className="text-xs font-bold text-green-800">Vidéo enregistrée avec succès.</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="ghost" onClick={() => setVideoBlob(null)} className="flex-1 border-2 border-gray-200">Recommencer</Button>
                                        <Button onClick={submitVideo} isLoading={isUploading} className="flex-[2] bg-jobgreen text-white shadow-lg shadow-green-200">
                                            Envoyer pour validation
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StatusRow: React.FC<{ label: string, status: string, onClick: () => void, isCrucial?: boolean }> = ({ label, status, onClick, isCrucial }) => (
    <div onClick={onClick} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                status === 'verified' ? "bg-green-100 text-green-600" : status === 'pending' ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-400"
            )}>
                {status === 'verified' ? <CheckCircle2 size={16} /> : status === 'pending' ? <Clock size={16} /> : <AlertTriangle size={16} />}
            </div>
            <div>
                <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    {label} {isCrucial && <span className="bg-red-100 text-red-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Requis</span>}
                </div>
                <div className={cn("text-[10px] font-medium uppercase", 
                    status === 'verified' ? "text-green-600" : status === 'pending' ? "text-yellow-600" : "text-gray-400"
                )}>
                    {status === 'verified' ? "Validé" : status === 'pending' ? "En cours..." : "Manquant"}
                </div>
            </div>
        </div>
        <div className="bg-white p-1.5 rounded-lg text-gray-400 shadow-sm">
            <Upload size={14} />
        </div>
    </div>
);

const UploadCard: React.FC<{ title: string, subtitle: string, status: string, onUpload: () => void, isUploading: boolean }> = ({ title, subtitle, status, onUpload, isUploading }) => (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-jobgreen/50 transition-colors group">
        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors", status === 'verified' ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-400 group-hover:text-jobgreen group-hover:bg-green-50")}>
            {status === 'verified' ? <CheckCircle2 size={32} /> : <Camera size={32} />}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-4 max-w-[200px] mx-auto">{subtitle}</p>
        
        {status === 'verified' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                <CheckCircle2 size={14} /> Document Validé
            </div>
        ) : status === 'pending' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold animate-pulse">
                <Clock size={14} /> Analyse en cours...
            </div>
        ) : (
            <Button onClick={onUpload} isLoading={isUploading} className="h-10 text-xs bg-gray-900 text-white shadow-md">
                Prendre une photo
            </Button>
        )}
    </div>
);
