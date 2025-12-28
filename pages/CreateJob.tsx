
import React, { useState, useEffect } from 'react';
import { 
    Briefcase, UserCheck, ArrowLeft, ArrowRight, Check, 
    MapPin, Camera, X, Plus, Save
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { AppTab, Job, TargetZone, PricingUnit } from '../types';
import { GABON_CITIES, GABON_LOCATIONS } from '../constants';
import { parseLocation, cn } from '../lib/utils';
import { BoostSelector, BoostValidationModal } from '../components/BoostSelector';

// --- TYPES & INITIAL STATE ---

type CreateJobStep = 'intent' | 'info' | 'budget' | 'boost';

interface JobFormData {
    intent: 'hiring' | 'service_offer' | null;
    title: string;
    category: string;
    description: string;
    images: string[];
    location: { city: string; neighborhood: string };
    targetZone: TargetZone;
    budget: string;
    pricingUnit: PricingUnit;
    boostId: 'none' | 'basic' | 'urgent';
    boostDuration: number;
}

const INITIAL_DATA: JobFormData = {
    intent: null,
    title: '',
    category: '',
    description: '',
    images: [],
    location: { city: 'Libreville', neighborhood: '' },
    targetZone: { scope: 'CITY', value: 'Libreville' },
    budget: '',
    pricingUnit: 'fixed',
    boostId: 'none',
    boostDuration: 1
};

interface CreateJobProps {
    onBack: () => void;
    onSuccess: (tab: AppTab) => void;
}

// --- SUB-COMPONENTS ---

const StepIntent = ({ value, onChange }: { value: string | null, onChange: (v: 'hiring' | 'service_offer') => void }) => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Quel est votre objectif ?</h2>
        
        <button 
            onClick={() => onChange('hiring')}
            className={cn(
                "w-full p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group",
                value === 'hiring' ? "border-jobgreen bg-green-50" : "border-gray-100 bg-white hover:border-gray-200"
            )}
        >
            <div className="flex items-center gap-4 relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", value === 'hiring' ? "bg-jobgreen text-white" : "bg-green-100 text-green-700")}>
                    <Briefcase size={28} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900">Je cherche un Pro</h3>
                    <p className="text-sm text-gray-500 font-medium">Pour une mission ou un service.</p>
                </div>
            </div>
            {value === 'hiring' && <div className="absolute top-4 right-4 text-jobgreen"><Check size={24} strokeWidth={3} /></div>}
        </button>

        <button 
            onClick={() => onChange('service_offer')}
            className={cn(
                "w-full p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group",
                value === 'service_offer' ? "border-jobgold bg-yellow-50" : "border-gray-100 bg-white hover:border-gray-200"
            )}
        >
            <div className="flex items-center gap-4 relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", value === 'service_offer' ? "bg-jobgold text-yellow-900" : "bg-yellow-100 text-yellow-700")}>
                    <UserCheck size={28} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900">Je suis disponible</h3>
                    <p className="text-sm text-gray-500 font-medium">Je propose mes services.</p>
                </div>
            </div>
            {value === 'service_offer' && <div className="absolute top-4 right-4 text-jobgold"><Check size={24} strokeWidth={3} /></div>}
        </button>
    </div>
);

const StepInfo = ({ data, update, categories, userLoc, onAddCategory }: { data: JobFormData, update: (k: Partial<JobFormData>) => void, categories: any[], userLoc: any, onAddCategory: (name: string) => void }) => {
    
    const [isAddingCat, setIsAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    // Auto-fill location if empty
    useEffect(() => {
        if (!data.location.neighborhood && userLoc.neighborhood) {
            update({ location: { city: userLoc.city || 'Libreville', neighborhood: userLoc.neighborhood } });
        }
    }, []);

    const addImage = () => {
        // Mock image for demo stability
        const mockImg = `https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=80&t=${Date.now()}`;
        update({ images: [...data.images, mockImg] });
    };

    const handleCreateCategory = () => {
        if (newCatName.trim()) {
            const formatted = newCatName.trim();
            onAddCategory(formatted); // Save to global context
            update({ category: formatted.charAt(0).toUpperCase() + formatted.slice(1) }); // Select it
            setIsAddingCat(false);
            setNewCatName('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Titre de l'annonce</label>
                <input 
                    value={data.title}
                    onChange={(e) => update({ title: e.target.value })}
                    placeholder={data.intent === 'hiring' ? "Ex: Fuite d'eau cuisine" : "Ex: Plombier qualifié"}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 focus:border-jobgreen focus:ring-0 outline-none font-bold text-gray-900 bg-white"
                />
            </div>

            <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Catégorie</label>
                
                {!isAddingCat ? (
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar items-center">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => update({ category: cat.name })}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border-2 transition-all",
                                    data.category === cat.name ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsAddingCat(true)}
                            className="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border-2 border-dashed border-gray-300 text-gray-500 hover:text-jobgreen hover:border-jobgreen flex items-center gap-1 bg-gray-50"
                        >
                            Autre <Plus size={12} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 animate-in fade-in">
                        <input 
                            autoFocus
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="Nouvelle catégorie..."
                            className="flex-1 h-10 px-3 rounded-lg border-2 border-jobgreen bg-white text-sm font-bold text-gray-900 outline-none"
                        />
                        <button 
                            onClick={handleCreateCategory}
                            disabled={!newCatName.trim()}
                            className="h-10 w-10 bg-jobgreen text-white rounded-lg flex items-center justify-center shadow-sm disabled:opacity-50"
                        >
                            <Save size={16} />
                        </button>
                        <button 
                            onClick={() => setIsAddingCat(false)}
                            className="h-10 w-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="relative">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">Description</label>
                </div>
                <textarea 
                    value={data.description}
                    onChange={(e) => update({ description: e.target.value })}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-jobgreen outline-none min-h-[120px] bg-white font-medium text-gray-700 text-sm"
                    placeholder="Détaillez votre besoin..."
                />
            </div>

            <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Images (Optionnel)</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    <button onClick={addImage} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 shrink-0">
                        <Camera size={20} />
                        <span className="text-[10px] font-bold mt-1">Ajouter</span>
                    </button>
                    {data.images.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 shrink-0 group">
                            <img src={img} className="w-full h-full object-cover rounded-xl bg-gray-100" />
                            <button 
                                onClick={() => update({ images: data.images.filter((_, idx) => idx !== i) })}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StepBudget = ({ data, update }: { data: JobFormData, update: (k: Partial<JobFormData>) => void }) => {
    // Dynamic Neighborhoods
    const neighborhoods = GABON_LOCATIONS[data.location.city] || [];

    const handleCityChange = (city: string) => {
        // Reset neighborhood when city changes to prevent invalid state
        update({ 
            location: { city, neighborhood: '' } 
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
                    <MapPin size={32} />
                </div>
                <h3 className="font-bold text-blue-900 mb-4">Où se passe la mission ?</h3>
                <div className="flex gap-2">
                    <select 
                        value={data.location.city} 
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="h-12 rounded-xl border border-blue-200 bg-white px-3 font-bold text-sm text-gray-900 outline-none w-1/3"
                    >
                        {GABON_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <select
                        value={data.location.neighborhood}
                        onChange={(e) => update({ location: { ...data.location, neighborhood: e.target.value } })}
                        className="h-12 rounded-xl border border-blue-200 bg-white px-4 font-bold text-sm text-gray-900 outline-none flex-1"
                        disabled={!data.location.city}
                    >
                        <option value="" disabled>Choisir Quartier...</option>
                        {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-green-600">
                    <Briefcase size={32} />
                </div>
                <h3 className="font-bold text-green-900 mb-1">
                    {data.intent === 'hiring' ? 'Votre Budget Max' : 'Votre Tarif'}
                </h3>
                <p className="text-xs text-green-700 mb-4 font-medium">Quel type de facturation appliquez-vous ?</p>
                
                {/* PRICING UNIT SELECTOR */}
                <div className="flex bg-white/60 p-1 rounded-xl mb-4 border border-green-200/50">
                    {[
                        { id: 'fixed', label: 'Forfait Global' },
                        { id: 'hourly', label: '/ Heure' },
                        { id: 'daily', label: '/ Jour' }
                    ].map(u => (
                        <button
                            key={u.id}
                            onClick={() => update({ pricingUnit: u.id as PricingUnit })}
                            className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                data.pricingUnit === u.id ? "bg-green-600 text-white shadow-md" : "text-green-800 hover:bg-green-100"
                            )}
                        >
                            {u.label}
                        </button>
                    ))}
                </div>

                <div className="relative max-w-[200px] mx-auto">
                    <input 
                        type="number"
                        value={data.budget}
                        onChange={(e) => update({ budget: e.target.value })}
                        placeholder="0"
                        className="w-full text-center text-3xl font-black bg-transparent border-b-2 border-green-300 pb-2 focus:border-green-600 outline-none text-gray-900 placeholder:text-gray-300"
                    />
                    <span className="text-xs font-bold text-gray-400 mt-1 block">FCFA</span>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export const CreateJob: React.FC<CreateJobProps> = ({ onBack, onSuccess }) => {
    const { user, addJob, categories, addNewCategory } = useUser();
    const userLoc = parseLocation(user.location);
    
    // --- ROBUST STATE ---
    const [step, setStep] = useState<CreateJobStep>('intent');
    const [formData, setFormData] = useState<JobFormData>(INITIAL_DATA);
    const [showValidation, setShowValidation] = useState(false);

    // Helper to update state safely
    const updateForm = (updates: Partial<JobFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // --- NAVIGATION LOGIC ---
    const goNext = () => {
        if (step === 'intent') setStep('info');
        else if (step === 'info') setStep('budget');
        else if (step === 'budget') setStep('boost');
    };

    const goBack = () => {
        if (step === 'intent') onBack();
        else if (step === 'info') setStep('intent');
        else if (step === 'budget') setStep('info');
        else if (step === 'boost') setStep('budget');
    };

    // --- VALIDATION ---
    const canProceed = () => {
        if (step === 'intent') return !!formData.intent;
        if (step === 'info') return !!formData.title && !!formData.category && formData.description.length > 5;
        if (step === 'budget') return !!formData.budget && !!formData.location.city && !!formData.location.neighborhood;
        return true;
    };

    // --- SUBMISSION ---
    const handleFinalize = () => {
        const fullLocation = `${formData.location.neighborhood}, ${formData.location.city}`;
        
        const newJob: Job = {
            id: `job_${Date.now()}`,
            type: formData.intent!,
            title: formData.title,
            category: formData.category,
            description: formData.description,
            budget: parseInt(formData.budget) || 0,
            pricingUnit: formData.pricingUnit, // Save Unit
            location: fullLocation,
            targetZone: { scope: 'NEIGHBORHOOD', value: formData.location.neighborhood },
            status: 'open',
            postedBy: user,
            createdAt: new Date().toISOString(),
            images: formData.images,
            isUrgent: formData.boostId === 'urgent',
            isBoosted: formData.boostId !== 'none',
            applicants: 0,
            views: 0,
            negotiable: true,
            minTierRequired: 'standard'
        };

        addJob(newJob);
        setShowValidation(false);
        setTimeout(() => onSuccess(AppTab.HOME), 500);
    };

    return (
        <div className="min-h-screen bg-white pb-safe flex flex-col">
            {/* HEADER */}
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white z-20">
                <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <div className="flex gap-1 mb-1">
                        {['intent', 'info', 'budget', 'boost'].map((s, i) => {
                            const steps = ['intent', 'info', 'budget', 'boost'];
                            const currentIdx = steps.indexOf(step);
                            return (
                                <div 
                                    key={s} 
                                    className={cn(
                                        "h-1.5 flex-1 rounded-full transition-colors duration-300", 
                                        i <= currentIdx ? "bg-jobgreen" : "bg-gray-100"
                                    )} 
                                />
                            );
                        })}
                    </div>
                    <h1 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {step === 'intent' ? 'Objectif' : step === 'info' ? 'Détails' : step === 'budget' ? 'Localisation' : 'Visibilité'}
                    </h1>
                </div>
            </div>

            {/* CONTENT SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-6 pb-32">
                {step === 'intent' && (
                    <StepIntent 
                        value={formData.intent} 
                        onChange={(v) => updateForm({ intent: v })} 
                    />
                )}

                {step === 'info' && (
                    <StepInfo 
                        data={formData} 
                        update={updateForm} 
                        categories={categories} 
                        userLoc={userLoc}
                        onAddCategory={addNewCategory}
                    />
                )}

                {step === 'budget' && (
                    <StepBudget 
                        data={formData} 
                        update={updateForm} 
                    />
                )}

                {step === 'boost' && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black text-gray-900">Boostez votre annonce</h2>
                            <p className="text-sm text-gray-500">Pour trouver preneur plus vite.</p>
                        </div>
                        <BoostSelector 
                            selectedBoostId={formData.boostId} 
                            onSelect={(id) => updateForm({ boostId: id })} 
                            userCoins={user.bronzeCoins} 
                            duration={formData.boostDuration}
                            onDurationChange={(d) => updateForm({ boostDuration: d })}
                        />
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30 pb-safe">
                {step !== 'boost' ? (
                    <Button 
                        onClick={goNext} 
                        disabled={!canProceed()} 
                        className="w-full h-14 text-lg rounded-xl shadow-xl font-bold"
                    >
                        Continuer <ArrowRight size={20} className="ml-2" />
                    </Button>
                ) : (
                    <Button 
                        onClick={() => formData.boostId !== 'none' ? setShowValidation(true) : handleFinalize()}
                        className="w-full h-14 text-lg rounded-xl shadow-xl font-bold bg-gray-900 text-white"
                    >
                        {formData.boostId !== 'none' ? 'Valider le Boost & Publier' : 'Publier Gratuitement'}
                    </Button>
                )}
            </div>

            {/* VALIDATION MODAL (If Boosted) */}
            <BoostValidationModal 
                isOpen={showValidation} 
                onClose={() => setShowValidation(false)}
                boostId={formData.boostId as 'basic' | 'urgent'} 
                duration={formData.boostDuration}
                onConfirm={handleFinalize} 
            />
        </div>
    );
};
