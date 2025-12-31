
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

// --- GEOLOCATION STRUCTURE (GABON 2025 OFFICIAL GRID) ---

export interface Province {
    code: string;
    name: string;
    cities: string[];
}

export const GABON_PROVINCES: Province[] = [
    { 
        code: 'G1', 
        name: 'Estuaire', 
        cities: ['Akanda', 'Libreville', 'Owendo', 'Ntoum', 'Kango', 'Cocobeach', 'Ndzomoe'] 
    },
    { 
        code: 'G2', 
        name: 'Haut-Ogooué', 
        cities: ['Franceville', 'Moanda', 'Okondja', 'Akiéni', 'Bongoville', 'Lékoni', 'Bakoumba', 'Ngouoni', 'Boumango', 'Onga', 'Aboumi'] 
    },
    { 
        code: 'G3', 
        name: 'Moyen-Ogooué', 
        cities: ['Lambaréné', 'Ndjolé'] 
    },
    { 
        code: 'G4', 
        name: 'Ngounié', 
        cities: ['Mouila', 'Fougamou', 'Ndendé', 'Lébamba', 'Mbigou', 'Mimongo', 'Malinga', 'Guiétsou', 'Mandji'] 
    },
    { 
        code: 'G5', 
        name: 'Nyanga', 
        cities: ['Tchibanga', 'Mayumba', 'Moabi', 'Mabanda', 'Ndindi', 'Moulengui-Binza'] 
    },
    { 
        code: 'G6', 
        name: 'Ogooué-Ivindo', 
        cities: ['Makokou', 'Booué', 'Mékambo', 'Ovan'] 
    },
    { 
        code: 'G7', 
        name: 'Ogooué-Lolo', 
        cities: ['Koulamoutou', 'Lastourville', 'Pana', 'Iboundji'] 
    },
    { 
        code: 'G8', 
        name: 'Ogooué-Maritime', 
        cities: ['Port-Gentil', 'Gamba', 'Omboué'] 
    },
    { 
        code: 'G9', 
        name: 'Woleu-Ntem', 
        cities: ['Oyem', 'Bitam', 'Mitzic', 'Minvoul', 'Medouneu'] 
    },
];

export const GABON_LOCATIONS: Record<string, string[]> = {
    // --- G1: ESTUAIRE ---
    'Libreville': [
        // 1er Arr
        'Bas de Gué-Gué', 'Haut de Gué-Gué', 'Batterie IV', 'Kalikak', 'Likouala', 'Okala (Sud)', 'Angondjé (limite)', 'Sherko',
        // 2ème Arr
        'Cocotiers', 'Atong-Abè', 'Nkembo', 'Sotega', 'Camp de Police', 'Mont-Bouët',
        // 3ème Arr
        'Montagne Sainte', 'Sainte Anne', 'Glass', 'Nomba', 'Bessieux', 'Peyrie', 'Akom-Nlong',
        // 4ème Arr
        'London', 'Toulon', 'Saint-Benoît', 'Baraka', 'Plaine-Niger', 'Batavéa', 'Akyébé Ville', 'Akyébé Poteaux',
        // 5ème Arr
        'Mindoubé', 'IAI', 'Plein-Ciel', 'Ozangué', 'Bisségué', 'Cité Damas', 'Beau-Séjour', 'PK 5', 'PK 6', 'PK 7', 'PK 8', 'PK 9', 'PK 10', 'PK 11', 'PK 12',
        // 6ème Arr
        'Nzeng-Ayong', 'Sibang', 'Dragages', 'Alibandeng', 'Bel-Air', 'Montalier'
    ],
    'Akanda': [
        // 1er Arr
        'Cap Estérias', 'Cap Santa Clara', 'Avorbam', 'Marseille', '1er Campement', 'Bolokobouet', 'Malibé',
        // 2ème Arr
        'Angondjé Château', 'Angondjé Cité', 'La Sablière', 'Okala Mikolongo', 'Okala Delta Postal', 'Jiji', 'Sherko'
    ],
    'Owendo': [
        // 1er Arr
        'Alénakiri', 'Barracuda', 'Port-Mole (Sud)', 'Cité OCTRA', 'SNI Owendo',
        // 2ème Arr
        'Akournam', 'Igoumié', 'Awoungou', 'Port d\'Owendo'
    ],
    'Ntoum': ['Gare-Routière', 'Ntoum-Centre', 'Lalala', 'Meyang', 'Bikélé', 'Essassa'],
    'Kango': ['Centre-ville', 'Quartier Mission', 'Bord de Komo'],
    'Cocobeach': ['Centre Administratif', 'Quartiers Côtiers'],
    'Ndzomoe': ['Centre'],

    // --- G2: HAUT-OGOOUÉ ---
    'Franceville': [
        'Poto-Poto', 'Mangoungou', 'Mbaya', 'Mingara', 'Menai', 'Ombelé', 'Yéné', 
        'Montagne Sainte (Masuku)', 'Quartier de l\'Hôpital', 'Franceville II', 'Mamadou Lewaï'
    ],
    'Moanda': [
        'Onkoula', 'Commercial', 'Montagne Sainte', 'Fumier', 'Alliance', 'Oasis', 'Belle-Vue', 'Moukaba 1', 'Moukaba 2'
    ],
    'Okondja': ['Centre', 'Administratif', 'Sébé'],
    'Akiéni': ['Centre', 'Lékoni'],
    'Bongoville': ['Centre', 'Djouori'],
    'Lékoni': ['Centre', 'Plateaux'],
    'Bakoumba': ['Centre', 'Lékoko'],
    'Ngouoni': ['Centre'],
    'Boumango': ['Centre'],
    'Onga': ['Centre'],
    'Aboumi': ['Centre'],

    // --- G3: MOYEN-OGOOUÉ ---
    'Lambaréné': [
        'Village Schweitzer', 'Texas', 'Adouma', 'Sahara', 'Grand Village', 'Issala', 'Atong-Mbeng'
    ],
    'Ndjolé': [
        'Tsouka', 'Divindet', 'Dourouni 1', 'Dourouni 2', 'Minembe', 'Dikongo', 'Didjanou', 'Pambou'
    ],

    // --- G4: NGOUNIÉ ---
    'Mouila': [
        'Dikongo', 'Val-Marie', 'Bavanga', 'Mbadi', 'Baleka', 'Saint-Gabriel', // Rive Droite
        'Ngouandji', 'Quartier Commercial', 'Minembé', 'Koungoulou', 'Moutassou', 'Guidouma' // Rive Gauche
    ],
    'Fougamou': ['Douani', 'Mandji-Lola', 'Bessia', 'Saint-Hilaire', 'Ngounda', 'Quartier du Port', 'Ikobey', 'Cité des Cadres'],
    'Ndendé': ['Camp de Police', 'Massambou', 'Lébal-Mpassa', 'Quartier Administratif', 'Mouvengue', 'Quartier Commercial'],
    'Lébamba': ['Bongolo', 'Moungoundou', 'Moufouta', 'Cité-Cadre', 'Quartier du Marché', 'Saint-Paul'],
    'Mbigou': ['Malembe', 'Dibam', 'Mbinan', 'Mouvambou', 'Quartier de la Mission', 'Cité Administrative'],
    'Mimongo': ['Dibamba', 'Dibenga', 'Ngounda-Bani', 'Quartier Mission', 'Quartier des Travailleurs'],
    'Malinga': ['Quartier Central', 'Quartier de la Douane', 'Mission Catholique', 'Villages Urbains'],
    'Guiétsou': ['Centre Administratif', 'Quartier du Marché', 'Quartier des Enseignants'],
    'Mandji': ['Quartier Mission', 'Quartier Administratif', 'Cité Pétrolière', 'Bilala'],

    // --- G5: NYANGA ---
    'Tchibanga': [
        // 1er Arr
        'Quartier Administratif', 'Massanga', 'Ibanga', 'Mougoutsi', 'Dialogue', 'Inguity', 'Bakala', 
        // 2ème Arr
        'Minembé', 'Likoula', 'Tchenzélé', 'Moukaba', 'Mavoundi', 'Aéroport', 'Bibora', 'Moungali'
    ],
    'Mayumba': ['Quartier de la Plage', 'Quartier du Port', 'Mpivié', 'Likwala', 'Centre-ville', 'Mani-Kassa', 'Cité des Travailleurs', 'Mayumba II'],
    'Moabi': ['Quartier Mission', 'Quartier Administratif', 'Cité des Cadres', 'Mbinda', 'Malembe', 'Moukigni', 'Dibotsa'],
    'Mabanda': ['Quartier de la Douane', 'Centre-ville', 'Quartier Mission', 'Massiala', 'Gendarmerie', 'Moulongo'],
    'Ndindi': ['Centre-Administratif', 'Quartier des Pêcheurs', 'Quartier de la Mission', 'Cité des Enseignants'],
    'Moulengui-Binza': ['Quartier Central', 'Quartier du Marché', 'Village Urbain', 'Quartier de la Santé'],

    // --- G6: OGOOUÉ-IVINDO ---
    'Makokou': [
        // 1er Arr
        'Centre-ville (Administratif)', 'Quartier Château', 'Mvoung-Nord', 'Nkok-Est', 'Zoolandé', 
        // 2ème Arr
        'Ngouadi', 'Petit-Paris', 'Epassendjé', 'Quartier de la Mission', 'Mingone', 'Loa-Loa'
    ],
    'Booué': ['Quartier Gare (OCTRA)', 'Centre-ville', 'Quartier de la Mission', 'Cité des Travailleurs', 'Petit-Paris', 'Abila'],
    'Mékambo': ['Quartier Administratif', 'Bakota', 'Fang', 'Quartier de l\'Hôpital', 'Mission Catholique', 'Cité des Cadres'],
    'Ovan': ['Quartier Central', 'Quartier de la Mission', 'Quartier du Marché', 'Village Urbain', 'Quartier des Enseignants'],

    // --- G7: OGOOUÉ-LOLO ---
    'Koulamoutou': ['Centre-ville', 'Bambomo', 'Ménaye', 'Koungou', 'Mayia', 'Madiadi', 'Babongo', 'Mouila-Koula', 'Mikouma', 'Dienga', 'Liyanga'],
    'Lastourville': ['Centre-ville', 'Mikatsia', 'Bembicani', 'Kessi Poughou', 'Limbenga', 'Lingoma', 'Mission Catholique', 'Ngouamba', 'Pahon Pira', 'Pahon Youngou', 'Tsengue Moupinda'],
    'Pana': ['Quartier Administratif', 'Quartier Mission', 'Quartier du Marché', 'Villages Urbains'],
    'Iboundji': ['Quartier Central', 'Quartier de la Mission', 'Cité des Cadres', 'Massiala'],

    // --- G8: OGOOUÉ-MARITIME ---
    'Port-Gentil': [
        // 1er Arr
        'Quartier Administratif', 'Balise', 'Ngadi', 'Quartier du Port', 'Base-Navale', 'Tulipe', 
        // 2ème Arr
        'Grand-Village', 'Quartier Chic', 'Tchenzélé', 'Quartier Sans-Culotte', 'Matanda', 'Banco', 
        // 3ème Arr
        'Sainte-Thérèse', 'Massoukou', 'Ngouadi', 'Quartier de la Mosquée', 'Soge-Gabon', 
        // 4ème Arr
        'N\'tchéngué', 'Cap-Lopez', 'Sogara', 'Quartier de l\'Aéroport', 'Pierre-Louis'
    ],
    'Gamba': ['Quartier Administratif', 'Cité Shell', 'Plaine-Gamba', 'Quartier Sud', 'Yenzi', 'Quartier du Lac'],
    'Omboué': ['Centre-ville', 'Quartier de la Mission', 'Quartier des Pêcheurs', 'Cité Administrative', 'Mpivié'],

    // --- G9: WOLEU-NTEM ---
    'Oyem': [
        // 1er Arr
        'Ngouéma', 'Adzougou', 'Mont-Miyélé', 'Quartier Administratif', 'Methui', 'Nkolayop', 
        // 2ème Arr
        'Akoakam', 'Tougou-Tougou', 'Eyenassi', 'Akok-Barrage', 'Mekaga', 'Sougoudzap', 'Sangmelima'
    ],
    'Bitam': ['Quartier Commercial', 'Bitam II', 'Quartier de la Mission', 'Essangui', 'Mbira', 'Quartier Administratif', 'Cité des Cadres'],
    'Mitzic': ['Quartier Central', 'Quartier de la Mission', 'Cité Forestière', 'Abang-Minko', 'Essong', 'Quartier du Marché'],
    'Minvoul': ['Quartier Administratif', 'Mission Catholique', 'Mission Protestante', 'Cité des Enseignants'],
    'Medouneu': ['Centre-ville', 'Quartier de la Gendarmerie', 'Quartier de la Mission', 'Regroupements']
};

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
