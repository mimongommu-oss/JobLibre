
import React, { useState } from 'react';
import { Briefcase, FileText, ChevronRight, MapPin, Eye, Clock, CheckCircle2, XCircle, Search, Info, FolderOpen, ClipboardList } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Job, AppTab } from '../types';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const MyJobs: React.FC<{ onNavigate: (tab: AppTab) => void, onJobSelect: (job: Job) => void }> = ({ onNavigate, onJobSelect }) => {
    const { user, jobs, openInfoModal } = useUser();
    const [activeTab, setActiveTab] = useState<'applications' | 'posted'>('applications');

    // 1. Filter Applications (Mock logic based on user.appliedJobIds)
    const applications = jobs.filter(j => user.appliedJobIds?.includes(j.id));

    // 2. Filter Posted Jobs
    const myJobs = jobs.filter(j => j.postedBy.id === user.id);

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Header */}
            <div className="px-6 pt-6 pb-2 sticky top-0 bg-white z-50 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        Gestion
                    </h1>
                    <button 
                        onClick={() => openInfoModal("Tableau de Bord", "Suivez ici l'état de vos candidatures envoyées et gérez les annonces que vous avez publiées.")}
                        className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-jobgreen"
                    >
                        <Info size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide border-b-2 transition-all",
                            activeTab === 'applications' 
                                ? "border-jobgreen text-jobgreen bg-green-50/50" 
                                : "border-transparent text-gray-400 hover:bg-gray-50"
                        )}
                    >
                        Mes Candidatures <span className="ml-1 bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">{applications.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('posted')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide border-b-2 transition-all",
                            activeTab === 'posted' 
                                ? "border-jobgold text-yellow-700 bg-yellow-50/50" 
                                : "border-transparent text-gray-400 hover:bg-gray-50"
                        )}
                    >
                        Mes Annonces <span className="ml-1 bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">{myJobs.length}</span>
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {activeTab === 'applications' ? (
                    applications.length > 0 ? (
                        applications.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => onJobSelect(job)}
                                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs uppercase">
                                            {job.category.slice(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{job.title}</h3>
                                            <div className="text-xs text-gray-500 font-medium">{job.postedBy.name}</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg border border-yellow-200">
                                        En attente
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium border-t border-gray-50 pt-3">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} /> Postulé récemment
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50"></div>
                                <div className="absolute inset-2 bg-white rounded-full border-4 border-green-50 flex items-center justify-center text-green-200">
                                    <ClipboardList size={40} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Aucune candidature</h3>
                            <p className="text-gray-500 text-sm mb-8 font-medium max-w-[250px] mx-auto leading-relaxed">
                                Vous n'avez pas encore postulé. C'est le moment de trouver votre prochaine mission !
                            </p>
                            <Button 
                                onClick={() => onNavigate(AppTab.HOME)} 
                                className="h-14 px-8 rounded-2xl bg-jobgreen text-white shadow-lg shadow-green-200 hover:bg-green-700 text-base font-bold flex items-center gap-2"
                            >
                                <Search size={20} /> Trouver une mission
                            </Button>
                        </div>
                    )
                ) : (
                    myJobs.length > 0 ? (
                        myJobs.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => onJobSelect(job)}
                                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{job.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                {job.status === 'open' ? 'Active' : 'Fermée'}
                                            </span>
                                            {job.isBoosted && (
                                                <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                    Boosté
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-gray-900">{job.budget > 0 ? job.budget.toLocaleString() : '-'} <span className="text-xs text-gray-400">F</span></div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3 mt-2">
                                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Vues</div>
                                        <div className="font-black text-gray-700">{job.views || 0}</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Candidats</div>
                                        <div className="font-black text-gray-700">{job.applicants || 0}</div>
                                    </div>
                                    <div className="flex items-center justify-center p-2 bg-gray-900 text-white rounded-lg group-hover:bg-jobgreen transition-colors">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-yellow-100 rounded-full animate-pulse opacity-50"></div>
                                <div className="absolute inset-2 bg-white rounded-full border-4 border-yellow-50 flex items-center justify-center text-yellow-200">
                                    <FolderOpen size={40} />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Aucune annonce</h3>
                            <p className="text-gray-500 text-sm mb-8 font-medium max-w-[250px] mx-auto leading-relaxed">
                                Vous n'avez rien publié. Besoin d'aide pour un service ou des travaux ?
                            </p>
                            <Button 
                                onClick={() => onNavigate(AppTab.CREATE)} 
                                className="h-14 px-8 rounded-2xl bg-gray-900 text-white shadow-lg text-base font-bold"
                            >
                                Publier une annonce
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
