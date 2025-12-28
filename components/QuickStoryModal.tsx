
import React, { useState, useEffect } from 'react';
import { X, Zap, Briefcase, UserCheck, ChevronRight, Clock, Info, MapPin, Hammer, ShoppingBag, Truck, Plus, ArrowLeft, Camera, Trash2, Megaphone, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';
import { GABON_CITIES, GABON_LOCATIONS } from '../constants';

interface QuickStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QuickStoryModal: React.FC<QuickStoryModalProps> = ({ isOpen, onClose }) => {
    const { addUrgentStory, addInfoStory, openInfoModal, categories, addNewCategory } = useUser();
    
    // Mode Selection: 'urgent' (Red) or 'info' (Blue)
    const [mode, setMode] = useState<'urgent' | 'info' | null>(null);
    const [step, setStep] = useState(0); // 0 = Choice, 1 = Type (for urgent), 2 = Details

    const [type, setType] = useState<'hiring' | 'service_offer' | null>(null);
    const [category, setCategory] = useState('');
    const [text, setText] = useState('');
    const [budget, setBudget] = useState('');
    
    const [city, setCity] = useState('Libreville');
    const [neighborhood, setNeighborhood] = useState('');
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    
    const [logistics, setLogistics] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    
    const [isAddingCat, setIsAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    useEffect(() => {
        const hoods = GABON_LOCATIONS[city] || [];
        setAvailableNeighborhoods(hoods);
        // Always reset neighborhood on city change to ensure valid selection
        setNeighborhood('');
    }, [city]);

    // Reset handler
    const reset = () => {
        setStep(0); setMode(null); setType(null); setText(''); setBudget(''); setCategory(''); setCity('Libreville'); setNeighborhood(''); setLogistics([]); setImages([]); setIsAddingCat(false); setNewCatName('');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const toggleLogistic = (item: string) => {
        setLogistics(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const handleAddCategory = () => {
        if (newCatName.trim()) {
            addNewCategory(newCatName.trim());
            const formatted = newCatName.trim().charAt(0).toUpperCase() + newCatName.trim().slice(1);
            setCategory(formatted);
            setIsAddingCat(false);
            setNewCatName('');
        }
    };

    const handleAddPhoto = () => {
        const mockImages = [
            'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
        ];
        const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
        setImages(prev => [...prev, randomImg]);
    };

    const removePhoto = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (mode === 'urgent') {
            if (type && text && budget && category && city && neighborhood) {
                addUrgentStory(type, text, parseInt(budget), category, city, neighborhood, logistics, images);
                handleClose();
            }
        } else if (mode === 'info') {
            if (text) {
                addInfoStory(text, images);
                handleClose();
            }
        }
    };

    // MOVED: The conditional return must be AFTER all hooks are declared.
    if (!isOpen) return null;

    const themeColor = mode === 'info' ? 'blue' : 'red';
    const ThemeIcon = mode === 'info' ? Info : Zap;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={handleClose}></div>
            
            <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl pb-safe flex flex-col max-h-[90vh]">
                
                {/* DYNAMIC HEADER */}
                <div className={cn(
                    "p-6 text-white text-center relative overflow-hidden shrink-0 transition-colors duration-300",
                    mode === 'info' ? "bg-gradient-to-r from-blue-600 to-blue-500" : "bg-gradient-to-r from-red-600 to-red-500"
                )}>
                    {step > 0 && (
                        <button 
                            onClick={() => {
                                if (step === 2 && mode === 'urgent') setStep(1);
                                else if (step === 1) { setStep(0); setMode(null); }
                                else setStep(0);
                            }}
                            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm z-50"
                        >
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                    )}

                    <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm z-50">
                        <X size={20} />
                    </button>

                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 backdrop-blur-md animate-pulse">
                        <ThemeIcon size={28} className="fill-white" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">
                        {mode === 'info' ? 'Info / Promo' : mode === 'urgent' ? 'Flash Urgence' : 'Publier une Story'}
                    </h2>
                    <p className={cn("text-xs font-medium flex items-center justify-center gap-1", mode === 'info' ? "text-blue-100" : "text-red-100")}>
                        <Clock size={12} /> Visible 24h • Cercle {mode === 'info' ? 'Bleu' : 'Rouge'}
                    </p>
                </div>

                <div className="p-6 overflow-y-auto no-scrollbar">
                    
                    {/* STEP 0: CHOOSE MODE */}
                    {step === 0 && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-4">
                            <button 
                                onClick={() => { setMode('urgent'); setStep(1); }}
                                className="w-full p-5 rounded-3xl border-2 border-red-100 bg-red-50/50 hover:bg-red-50 hover:border-red-300 transition-all group text-left relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                        <Zap size={24} className="fill-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-black text-lg text-gray-900">Urgence / Job</div>
                                        <div className="text-xs text-gray-500 font-medium">J'ai besoin d'un pro ou je cherche une mission.</div>
                                    </div>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <ChevronRight className="text-red-300" />
                                </div>
                            </button>

                            <button 
                                onClick={() => { setMode('info'); setStep(1); }} // Info goes directly to editing
                                className="w-full p-5 rounded-3xl border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all group text-left relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <Megaphone size={24} />
                                    </div>
                                    <div>
                                        <div className="font-black text-lg text-gray-900">Info / Promo</div>
                                        <div className="text-xs text-gray-500 font-medium">Je partage une news, une promo ou une info.</div>
                                    </div>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <ChevronRight className="text-blue-300" />
                                </div>
                            </button>
                        </div>
                    )}

                    {/* URGENT FLOW: STEP 1 (TYPE) */}
                    {step === 1 && mode === 'urgent' && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-lg font-bold text-gray-900 text-center mb-6">Quelle est l'urgence ?</h3>
                            <button onClick={() => { setType('hiring'); setStep(2); }} className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 flex items-center gap-4 transition-all group text-left">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-200 group-hover:text-red-800 text-gray-500"><Briefcase size={20} /></div>
                                <div className="flex-1"><div className="font-bold text-gray-900 group-hover:text-red-700">Je cherche un pro</div><div className="text-xs text-gray-500">Plombier, Nounou, etc.</div></div>
                                <ChevronRight className="text-gray-300" />
                            </button>
                            <button onClick={() => { setType('service_offer'); setStep(2); }} className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 flex items-center gap-4 transition-all group text-left">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-red-200 group-hover:text-red-800 text-gray-500"><UserCheck size={20} /></div>
                                <div className="flex-1"><div className="font-bold text-gray-900 group-hover:text-red-700">Je suis disponible</div><div className="text-xs text-gray-500">Pour une mission immédiate</div></div>
                                <ChevronRight className="text-gray-300" />
                            </button>
                        </div>
                    )}

                    {/* URGENT FLOW: STEP 2 (DETAILS) */}
                    {step === 2 && mode === 'urgent' && (
                        <div className="space-y-5 animate-in slide-in-from-right-8">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Catégorie</label>
                                {!isAddingCat ? (
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar items-center">
                                        {categories.map(cat => (
                                            <button key={cat.id} onClick={() => setCategory(cat.name)} className={cn("px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border", category === cat.name ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200")}>{cat.name}</button>
                                        ))}
                                        <button 
                                            onClick={() => setIsAddingCat(true)}
                                            className="px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border border-dashed border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-600 flex items-center gap-1"
                                        >
                                            Autre <Plus size={10} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 animate-in fade-in">
                                        <input 
                                            autoFocus
                                            value={newCatName}
                                            onChange={(e) => setNewCatName(e.target.value)}
                                            placeholder="Nouvelle catégorie..."
                                            className="flex-1 h-10 px-3 rounded-lg border-2 border-red-500 bg-white text-sm font-bold text-gray-900 outline-none"
                                        />
                                        <button 
                                            onClick={handleAddCategory}
                                            disabled={!newCatName.trim()}
                                            className="h-10 w-10 bg-red-600 text-white rounded-lg flex items-center justify-center shadow-sm disabled:opacity-50"
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
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-3">
                                <div className="flex items-center gap-2 mb-1"><MapPin size={14} className="text-red-500" /><span className="text-xs font-black text-gray-800 uppercase">Localisation</span></div>
                                <div className="flex gap-2">
                                    <div className="w-1/3"><select value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 bg-white border border-gray-200 rounded-lg px-2 text-xs font-bold text-gray-900 focus:border-red-500 outline-none">{GABON_CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                    <div className="flex-1">
                                        <select 
                                            value={neighborhood} 
                                            onChange={(e) => setNeighborhood(e.target.value)} 
                                            className="w-full h-10 bg-white border border-gray-200 rounded-lg px-2 text-sm font-medium text-gray-900 focus:border-red-500 outline-none"
                                        >
                                            <option value="" disabled>Choisir quartier...</option>
                                            {availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Besoin Urgent</label>
                                <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Décrivez l'urgence..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[80px] text-sm" maxLength={300} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{type === 'hiring' ? 'Budget Max' : 'Tarif'}</label>
                                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="FCFA" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-black text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                            </div>
                            <Button onClick={handleSubmit} disabled={!text || !budget || !category || !neighborhood} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg shadow-red-500/30">Publier Urgence</Button>
                        </div>
                    )}

                    {/* INFO FLOW: STEP 1 (SIMPLE) */}
                    {step === 1 && mode === 'info' && (
                        <div className="space-y-6 animate-in slide-in-from-right-8">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Votre Message</label>
                                <textarea 
                                    autoFocus
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Ex: Je suis absent cet après-midi..."
                                    className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl p-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px] text-base resize-none"
                                    maxLength={200}
                                />
                                <div className="text-right text-[10px] text-gray-400 mt-1">{text.length}/200</div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Image (Optionnel)</label>
                                <div className="flex gap-2">
                                    <button onClick={handleAddPhoto} className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 bg-white"><Camera size={20} /></button>
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative w-16 h-16"><img src={img} className="w-full h-full object-cover rounded-xl" /><button onClick={() => removePhoto(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><Trash2 size={10}/></button></div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                onClick={handleSubmit} 
                                disabled={!text}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-500/30"
                            >
                                Publier Info
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
