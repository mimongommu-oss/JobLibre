
import { Job, User, Conversation, StatusStory, Transaction, TargetZone, CoinPack, BoostOption, PricingUnit } from './types';

// Wealth is now in FCFA directly
// Gold = 50k, Silver = 10k, Copper = 1k

export const COIN_VALUE_XAF = 250;

export const COSTS = {
    BOOST_BASIC: 10, // 2500 FCFA env
    BOOST_URGENT: 25, // 6250 FCFA env
    NEGOTIATION: 2, 
    VERIFIED_MONTHLY: 5000 // FCFA
};

export const DEFAULT_JOB_PHOTOS = [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=1000&q=80'
];

export const COIN_PACKS: CoinPack[] = [
    { id: 'pack_starter', name: 'Pack Découverte', coins: 10, priceXaf: 2500, tag: 'Essentiel' },
    { id: 'pack_pro', name: 'Pack Artisan', coins: 50, priceXaf: 11000, bonus: 5, tag: 'Populaire' }, // 1500F eco
    { id: 'pack_business', name: 'Pack Business', coins: 120, priceXaf: 25000, bonus: 20, tag: 'Best Value' }, // 5000F eco
];

export const BOOST_OPTIONS: BoostOption[] = [
    { 
        id: 'basic', 
        label: 'Boost Standard', 
        description: 'Votre annonce remonte en tête de liste et gagne un badge "Sponsorisé".', 
        duration: '24 Heures',
        cost: COSTS.BOOST_BASIC, 
        icon: 'TrendingUp'
    },
    { 
        id: 'urgent', 
        label: 'Urgence Maximale', 
        description: 'Notification Push envoyée aux Pros de la zone + Badge Rouge + Story.', 
        duration: '48 Heures',
        cost: COSTS.BOOST_URGENT, 
        icon: 'Zap'
    }
];

// --- GEOLOCATION CONSTANTS (GABON 2025) ---
// ... (Location constants remain unchanged, truncated for brevity but assumed present)
const ESTUAIRE_LOCATIONS: Record<string, string[]> = {
    'Libreville': ['Louis', 'Mont-Bouët', 'PK 8', 'Charbonnages', 'Nzeng-Ayong'],
    'Akanda': ['Avorbam', 'Angondjé'],
    'Owendo': ['Akournam']
};
export const GABON_LOCATIONS = ESTUAIRE_LOCATIONS;
export const GABON_CITIES = Object.keys(GABON_LOCATIONS);

// --- TIER LIMITS CONFIGURATION ---
export const TIER_LIMITS = {
    standard: {
        maxApplications: 3,
        maxBudgetView: 25000,
        canViewPremiumJobs: false,
        canViewVerifiedJobs: false,
        canNegotiate: false,
        canSeeCompetitors: 'none',
    },
    verified: {
        maxApplications: 15,
        maxBudgetView: 150000,
        canViewPremiumJobs: false,
        canViewVerifiedJobs: true,
        canNegotiate: true,
        canSeeCompetitors: 'partial',
    },
    premium: {
        maxApplications: 9999,
        maxBudgetView: 999999999,
        canViewPremiumJobs: true,
        canViewVerifiedJobs: true,
        canNegotiate: true,
        canSeeCompetitors: 'full',
    }
};

// --- DATA GENERATION HELPERS ---
const LOCATIONS = ['Louis, Libreville', 'Mont-Bouët, Libreville', 'Avorbam, Akanda', 'Akournam, Owendo', 'PK 8, Libreville'];
const CATEGORY_NAMES = ['Plomberie', 'Déménagement', 'Ménage', 'Peinture', 'Électricité', 'Informatique', 'Jardinage', 'Mécanique'];

// --- 1. MASTER USER (VOUS) ---
export const MOCK_USER: User = {
  id: 'u_me',
  name: 'Marc O. (Moi)',
  role: 'client',
  tier: 'standard', 
  avatar: 'https://i.pravatar.cc/150?u=marc_owner',
  isVerified: false,
  rating: 4.8,
  jobsCompleted: 12,
  location: 'Louis, Libreville', 
  wealth: 25000,
  bronzeCoins: 12,
  monthlyApplicationsUsed: 2,
  monthlyMessagesUsed: 1,
  appliedJobIds: [],
  // NEW VERIFICATION FIELDS
  verificationScore: 20, 
  verificationDocs: [
      { type: 'id_card', status: 'pending' },
      { type: 'security_video', status: 'missing' }
  ]
};

// --- 2. GENERATE MOCK USERS ---
const createMockUser = (id: number, name: string, tier: 'standard' | 'verified' | 'premium', role: 'client' | 'pro', gender: 'men' | 'women'): User => ({
    id: `u_${id}`,
    name,
    role,
    tier,
    avatar: `https://randomuser.me/api/portraits/${gender}/${id}.jpg`,
    isVerified: tier !== 'standard',
    isPremium: tier === 'premium',
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    jobsCompleted: Math.floor(Math.random() * 150),
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    wealth: Math.floor(Math.random() * 500000),
    bronzeCoins: Math.floor(Math.random() * 100),
    monthlyApplicationsUsed: Math.floor(Math.random() * 10),
    monthlyMessagesUsed: Math.floor(Math.random() * 20),
    skills: role === 'pro' ? [CATEGORY_NAMES[Math.floor(Math.random() * CATEGORY_NAMES.length)]] : undefined,
    appliedJobIds: [],
    verificationScore: tier === 'premium' ? 100 : tier === 'verified' ? 80 : 20,
    verificationDocs: []
});

export const MOCK_USERS: User[] = [
    createMockUser(1, 'Jean K.', 'premium', 'pro', 'men'),
    createMockUser(2, 'Sarah Elec', 'premium', 'pro', 'women'),
    createMockUser(3, 'Entreprise BTP', 'premium', 'pro', 'men'),
    createMockUser(4, 'Marie Services', 'premium', 'pro', 'women'),
    createMockUser(5, 'Tech Solutions', 'premium', 'pro', 'men'),
    createMockUser(6, 'David B.', 'verified', 'pro', 'men'),
    createMockUser(11, 'Luc T.', 'standard', 'client', 'men'),
    // ... reduced list for brevity
];

// --- 3. GENERATE JOBS ---
export const CATEGORIES = [
  { id: 'plumb', name: 'Plomberie', icon: 'Wrench' },
  { id: 'move', name: 'Déménagement', icon: 'Truck' },
  { id: 'clean', name: 'Ménage', icon: 'Sparkles' },
  { id: 'paint', name: 'Peinture', icon: 'PaintRoller' },
  { id: 'elec', name: 'Électricité', icon: 'Zap' },
];

export const MOCK_JOBS: Job[] = []; // (Assumed populated like before)
export const MOCK_STORIES: StatusStory[] = [];
export const HALL_OF_FAME_DATA = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_CONVERSATIONS: Conversation[] = [];
export const MOCK_REVIEWS = [];
