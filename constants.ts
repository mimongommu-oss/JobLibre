
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

// 1. PROVINCE DE L'ESTUAIRE (G1)
const ESTUAIRE_LOCATIONS: Record<string, string[]> = {
    'Libreville': [
        'Akébé-Plaine', 'Akébé-Ville', 'Alibandeng', 'Angondjé', 'Atong-Abè', 'Avorbam', 'Bambouchine', 
        'Baraka', 'Bas de Gué-Gué', 'Batavéa', 'Batterie IV', 'Beau-Séjour', 'Bel-Air', 'Belle-Vue', 
        'Bessieux', 'Bikélé', 'Bisségué', 'Camp de Police', 'Charbonnages', 'Cité Damas', 'Cité de la Caisse', 
        'Cité Mébiame', 'Cocotiers', 'Derrière la Prison', 'Dragages', 'Glass', 'Gros-Bouquet', 
        'Haut de Gué-Gué', 'IAI', 'Kalikak', 'Kinguélé', 'Lalala', 'Les Charbonnages', 'Likouala', 
        'London', 'Louis', 'Mindoubé', 'Mont-Bouët', 'Montagne Sainte', 'Montalier', 'Nkembo', 'Nomba', 
        'Nzeng-Ayong', 'Okala', 'Oloumi', 'Ozangué', 'Petit-Paris', 'Peyrie', 'PK 5', 'PK 6', 'PK 7', 
        'PK 8', 'PK 9', 'PK 10', 'PK 11', 'PK 12', 'Plaine-Niger', 'Plein-Ciel', 'Rio', 'Sainte-Anne', 
        'Sherko', 'Sibang', 'Sotega', 'Terre Nouvelle', 'Toulon'
    ],
    'Akanda': [
        'Angondjé', 'Avorbam', 'Cap Estérias', 'Cap Santa Clara', 'Château', 'Cité des Ailes', 
        'Delta Postal', 'La Sablière', 'Malibé', 'Marseille', 'Okala Mikolongo', 'Sherko'
    ],
    'Owendo': [
        'Akournam', 'Alénakiri', 'Awoungou', 'Barracuda', 'Cité OCTRA', 'Cité SNI', 'Igoumié', 
        'Lycée Technique', 'Port d\'Owendo', 'Port-Mole', 'Razel', 'Sogatol'
    ],
    'Ntoum': [
        'Bikélé', 'Cocobeach', 'Essassa', 'Kango', 'Meyang', 'Nkoltang', 'Ntoum Centre', 'Okolassi'
    ]
};

// 2. PROVINCE DU HAUT-OGOOUÉ (G2)
const HAUT_OGOOUÉ_LOCATIONS: Record<string, string[]> = {
    'Franceville': [
        'Centre-ville', 'Potos', 'Sable', 'Mangoungou', 'Ombele', 'La Carrière', 'Lekei', 'Menaye', 
        'Mamadou-Diop', 'Yéné', 'Ngoungoulou', 'Mbaya', 'Epila'
    ],
    'Moanda': [
        'Centre-ville', 'Fumier', 'Alliance', 'Lekolo', 'Cité Comilog', 'Montagne Sainte', 'Rio', 'Belle-Vue'
    ],
    'Okondja': ['Centre-ville', 'Quartier Administratif'],
    'Bongoville': ['Centre-ville', 'Plateau']
};

// 3. PROVINCE DU MOYEN-OGOOUÉ (G3)
const MOYEN_OGOOUÉ_LOCATIONS: Record<string, string[]> = {
    'Lambaréné': [
        'Centre-ville', 'Adouma', 'Atongowanga', 'Isaac', 'Abongo', 'Lalala', 'Point V', 'Schweitzer', 'Saint-François'
    ],
    'Ndjolé': ['Centre-ville', 'Gare', 'Bingoma']
};

// 4. PROVINCE DE LA NGOUNIÉ (G4)
const NGOUNIÉ_LOCATIONS: Record<string, string[]> = {
    'Mouila': [
        'Centre-ville', 'Dikongo', 'Val-Marie', 'Lac Bleu', 'Bavanga', 'Ngougi', 'Mukuakana'
    ],
    'Ndendé': ['Centre-ville', 'Mapembi', 'Quartier Commercial'],
    'Lébamba': ['Centre-ville']
};

// 5. PROVINCE DE LA NYANGA (G5)
const NYANGA_LOCATIONS: Record<string, string[]> = {
    'Tchibanga': [
        'Centre-ville', 'Mavoundi', 'Bibora', 'Quartier Château', 'Polyclinique', 'Korossou', 'Ibanga'
    ],
    'Mayumba': ['Centre-ville', 'Bord de Mer']
};

// 6. PROVINCE DE L'OGOOUÉ-IVINDO (G6)
const OGOOUÉ_IVINDO_LOCATIONS: Record<string, string[]> = {
    'Makokou': [
        'Centre-ville', 'Loa-Loa', 'Zoatab', 'Epassendjé', 'Mbolo', 'Quartier Latin', 'Ntsibélon'
    ],
    'Booué': ['Centre-ville', 'Gare']
};

// 7. PROVINCE DE L'OGOOUÉ-LOLO (G7)
const OGOOUÉ_LOLO_LOCATIONS: Record<string, string[]> = {
    'Koulamoutou': [
        'Centre-ville', 'Mikalou', 'Ménage', 'Bambomo', 'Libagué', 'Konadembé'
    ],
    'Lastourville': ['Centre-ville', 'Gare', 'Mikouyi', 'Pala']
};

// 8. PROVINCE DE L'OGOOUÉ-MARITIME (G8)
const OGOOUE_MARITIME_LOCATIONS: Record<string, string[]> = {
    'Port-Gentil': [
        'Centre-ville', 'Grand-Village', 'Balise', 'Matanda', 'Quartier Chic', 'N\'Tchengue', 'Sindara', 
        'Mosquée', 'Port', 'Salsa', 'Namino', 'Roger Buttin', 'Rombintcho', 'Sogara', 'Tchengué'
    ],
    'Omboué': ['Centre-ville', 'Lagune'],
    'Gamba': ['Centre-ville', 'Plaine', 'Aéroport']
};

// 9. PROVINCE DU WOLEU-NTEM (G9)
const WOLEU_NTEM_LOCATIONS: Record<string, string[]> = {
    'Oyem': [
        'Centre-ville', 'Akoakam', 'Nkomayat', 'Adjougou', 'Vallée', 'Methui', 'Koulmongomo', 
        'Angone', 'Eyenassi', 'Mekaga'
    ],
    'Bitam': ['Centre-ville', 'Frontière', 'Marché', 'Quartier Nord'],
    'Mitzic': ['Centre-ville', 'Oka'],
    'Minvoul': ['Centre-ville']
};

// --- FUSION ET EXPORT GLOBAL ---
export const GABON_LOCATIONS: Record<string, string[]> = {
    ...ESTUAIRE_LOCATIONS,
    ...HAUT_OGOOUÉ_LOCATIONS,
    ...MOYEN_OGOOUÉ_LOCATIONS,
    ...NGOUNIÉ_LOCATIONS,
    ...NYANGA_LOCATIONS,
    ...OGOOUÉ_IVINDO_LOCATIONS,
    ...OGOOUÉ_LOLO_LOCATIONS,
    ...OGOOUE_MARITIME_LOCATIONS,
    ...WOLEU_NTEM_LOCATIONS
};

// Tri alphabétique des quartiers pour l'UX
Object.keys(GABON_LOCATIONS).forEach(city => {
    GABON_LOCATIONS[city].sort();
});

export const GABON_CITIES = Object.keys(GABON_LOCATIONS).sort();

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
const LOCATIONS = ['Louis, Libreville', 'Mont-Bouët, Libreville', 'Avorbam, Akanda', 'Akournam, Owendo', 'PK 8, Libreville', 'Charbonnages, Libreville', 'Nzeng-Ayong, Libreville', 'Potos, Franceville', 'Centre-ville, Moanda', 'Isaac, Lambaréné', 'Gare, Ndjolé', 'Val-Marie, Mouila', 'Centre-ville, Ndendé', 'Bibora, Tchibanga', 'Bord de Mer, Mayumba', 'Loa-Loa, Makokou', 'Gare, Booué', 'Mikalou, Koulamoutou', 'Gare, Lastourville', 'Grand-Village, Port-Gentil', 'Plaine, Gamba', 'Lagune, Omboué', 'Akoakam, Oyem', 'Centre-ville, Bitam', 'Oka, Mitzic'];
const CATEGORY_NAMES = ['Plomberie', 'Déménagement', 'Ménage', 'Peinture', 'Électricité', 'Informatique', 'Jardinage', 'Mécanique', 'Maçonnerie', 'Cuisine'];

// --- 1. MASTER USER (VOUS) ---
export const MOCK_USER: User = {
  id: 'u_me',
  name: 'Marc O. (Moi)',
  role: 'client',
  tier: 'standard', // Start Standard to see limitations
  avatar: 'https://i.pravatar.cc/150?u=marc_owner',
  isVerified: false,
  rating: 4.8,
  jobsCompleted: 12,
  location: 'Louis, Libreville', // Updated format for consistency
  wealth: 25000,
  bronzeCoins: 12,
  monthlyApplicationsUsed: 2,
  monthlyMessagesUsed: 1,
  appliedJobIds: [] // NEW
};

// --- 2. GENERATE 20 MOCK USERS ---
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
    appliedJobIds: []
});

export const MOCK_USERS: User[] = [
    createMockUser(1, 'Jean K.', 'premium', 'pro', 'men'),
    createMockUser(2, 'Sarah Elec', 'premium', 'pro', 'women'),
    createMockUser(3, 'Entreprise BTP', 'premium', 'pro', 'men'),
    createMockUser(4, 'Marie Services', 'premium', 'pro', 'women'),
    createMockUser(5, 'Tech Solutions', 'premium', 'pro', 'men'),
    createMockUser(6, 'David B.', 'verified', 'pro', 'men'),
    createMockUser(7, 'Paul Plombier', 'verified', 'pro', 'men'),
    createMockUser(8, 'Julie Nettoyage', 'verified', 'pro', 'women'),
    createMockUser(9, 'Garage Auto', 'verified', 'pro', 'men'),
    createMockUser(10, 'Fleuriste Anna', 'verified', 'pro', 'women'),
    createMockUser(11, 'Luc T.', 'standard', 'client', 'men'),
    createMockUser(12, 'Sophie L.', 'standard', 'client', 'women'),
    createMockUser(13, 'Pierre M.', 'standard', 'client', 'men'),
    createMockUser(14, 'Alice K.', 'standard', 'client', 'women'),
    createMockUser(15, 'Mamadou D.', 'standard', 'pro', 'men'), 
    createMockUser(16, 'Chloé R.', 'standard', 'client', 'women'),
    createMockUser(17, 'Kevin S.', 'standard', 'client', 'men'),
    createMockUser(18, 'Isabelle P.', 'standard', 'client', 'women'),
    createMockUser(19, 'Ahmed B.', 'standard', 'client', 'men'),
    createMockUser(20, 'Clara J.', 'standard', 'client', 'women'),
];

export const MOCK_PRO = MOCK_USERS[0];
export const MOCK_PRO_2 = MOCK_USERS[1];
export const MOCK_PRO_3 = MOCK_USERS[5];

// --- 3. GENERATE JOBS ---
export const CATEGORIES = [
  { id: 'plumb', name: 'Plomberie', icon: 'Wrench' },
  { id: 'move', name: 'Déménagement', icon: 'Truck' },
  { id: 'clean', name: 'Ménage', icon: 'Sparkles' },
  { id: 'paint', name: 'Peinture', icon: 'PaintRoller' },
  { id: 'elec', name: 'Électricité', icon: 'Zap' },
  { id: 'mech', name: 'Mécanique', icon: 'Wrench' },
  { id: 'gard', name: 'Jardinage', icon: 'Flower' },
];

const getTargetZone = (loc: string): TargetZone => {
    // Basic heuristic: check if it's a known city
    const cleanLoc = loc.includes(',') ? loc.split(',')[1].trim() : loc.trim();
    if (GABON_CITIES.includes(cleanLoc)) {
        return { scope: 'CITY', value: cleanLoc };
    }
    // If just neighborhood provided, assume Libreville or infer
    return { scope: 'CITY', value: 'Libreville' };
};

const createJob = (id: number, postedBy: User, title: string, cat: string, budget: number, isUrgent = false, forcedMinTier?: 'standard' | 'verified' | 'premium', pricingUnit?: PricingUnit): Job => {
    const location = postedBy.location || 'Louis, Libreville';
    return {
        id: `j_${id}`,
        type: Math.random() > 0.7 ? 'service_offer' : 'hiring',
        title,
        description: `Besoin de services professionnels pour ${title}. Disponible immédiatement. Contactez-moi pour plus de détails.`,
        category: cat,
        budget,
        pricingUnit: pricingUnit || 'fixed',
        location: location,
        targetZone: getTargetZone(location),
        status: 'open',
        postedBy,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
        isUrgent,
        isBoosted: isUrgent || Math.random() > 0.8,
        applicants: Math.floor(Math.random() * 15),
        negotiable: true,
        minTierRequired: forcedMinTier || (budget > 500000 ? 'premium' : budget > 100000 ? 'verified' : 'standard'),
        views: Math.floor(Math.random() * 200) + 5,
    };
};

export const MOCK_JOBS: Job[] = [
    createJob(100, MOCK_USER, 'Recherche Nounou Urgente', 'Ménage', 1000, true, 'standard', 'hourly'),
    createJob(101, MOCK_USER, 'Réparation Toiture', 'Maçonnerie', 120000, false, 'standard', 'fixed'),
    createJob(200, MOCK_USERS[0], 'Rénovation Complète Villa', 'Maçonnerie', 4500000, false, 'premium', 'fixed'),
    createJob(201, MOCK_USERS[1], 'Installation Solaire Industrielle', 'Électricité', 2500000, false, 'premium', 'fixed'), 
    createJob(300, MOCK_USERS[5], 'Peinture Salon + 2 Chambres', 'Peinture', 150000, false, 'verified', 'fixed'),
    createJob(301, MOCK_USERS[6], 'Plomberie SDB Complète', 'Plomberie', 85000, true, 'verified', 'fixed'), 
    createJob(400, MOCK_USERS[10], 'Tonte de pelouse', 'Jardinage', 15000, false, 'standard', 'fixed'),
    createJob(401, MOCK_USERS[11], 'Aide Déménagement (2h)', 'Déménagement', 5000, true, 'standard', 'hourly'),
    createJob(402, MOCK_USERS[12], 'Réparation Prise', 'Électricité', 5000, false, 'standard', 'fixed'),
    createJob(403, MOCK_USERS[13], 'Nettoyage Voiture', 'Ménage', 3000, false, 'standard', 'fixed'),
    createJob(404, MOCK_USERS[14], 'Cours Anglais Débutant', 'Informatique', 5000, false, 'standard', 'hourly'),
    createJob(500, MOCK_USERS[2], 'Construction Mur Clôture', 'Maçonnerie', 600000, false, 'premium', 'fixed'),
    createJob(501, MOCK_USERS[3], 'Traiteur Mariage (50 pers)', 'Cuisine', 250000, true, 'verified', 'fixed'),
    createJob(502, MOCK_USERS[4], 'Dépannage Serveur Entreprise', 'Informatique', 150000, true, 'verified', 'fixed'),
    createJob(503, MOCK_USERS[7], 'Ménage Fin de Chantier', 'Ménage', 20000, false, 'standard', 'daily'),
    createJob(504, MOCK_USERS[8], 'Vidange SUV + Filtres', 'Mécanique', 25000, false, 'standard', 'fixed'),
];

export const MOCK_STORIES: StatusStory[] = [
    { id: 's1', user: MOCK_USERS[11], type: 'urgent_job', text: 'SOS Plombier', expiresAt: '...', jobId: 'j_401', views: 42 },
    { id: 's2', user: MOCK_USERS[13], type: 'urgent_job', text: 'Clés Perdues', expiresAt: '...', jobId: 'j_403', views: 12 },
    { id: 's3', user: MOCK_USERS[0], type: 'info', text: 'Promo -50%', expiresAt: '...', views: 89 },
];

export const HALL_OF_FAME_DATA = [
    { rank: 1, user: MOCK_USERS[0], title: 'Maître Artisan' },
    { rank: 2, user: MOCK_USERS[1], title: 'Expert' },
    { rank: 3, user: MOCK_USERS[2], title: 'Fiable' },
    { rank: 4, user: MOCK_USERS[3], title: 'Pro Confirmé' },
    { rank: 5, user: MOCK_USERS[4], title: 'Star Montante' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'escrow_lock', amount: 15000, currency: 'XAF', description: 'Séquestre: Mission Plomberie', date: '27 Oct, 10:30', status: 'completed' },
    { id: 't2', type: 'debit', amount: 10, currency: 'COIN', description: 'Boost Annonce (24h)', date: '27 Oct, 09:00', status: 'completed' },
    { id: 't3', type: 'credit', amount: 35000, currency: 'XAF', description: 'Mission Terminée: Électricité', date: '25 Oct, 14:00', status: 'completed' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
      id: 'c1',
      withUser: MOCK_USERS[0], // Jean K
      lastMessage: "J'arrive dans 10 minutes pour le devis.",
      timestamp: '14:30',
      unreadCount: 1,
      relatedJobId: 'j_200',
      messages: [
          { id: 'm1', senderId: MOCK_USERS[0].id, text: 'Bonjour, je suis disponible pour votre chantier.', timestamp: '14:00', type: 'text' },
          { id: 'm2', senderId: MOCK_USER.id, text: 'Super, quel est votre tarif ?', timestamp: '14:05', type: 'text' },
          { id: 'm3', senderId: MOCK_USERS[0].id, text: 'Je propose 150 000 FCFA pour le gros oeuvre.', timestamp: '14:10', type: 'offer', metadata: { amount: 150000, status: 'pending' } },
      ]
  },
  {
      id: 'c2',
      withUser: MOCK_USERS[1], // Sarah
      lastMessage: 'Merci pour le paiement !',
      timestamp: 'Hier',
      unreadCount: 0,
      messages: []
  }
];

export const MOCK_REVIEWS = [
    {
        id: 'r1',
        name: 'Paul H.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5,
        date: 'Il y a 2 jours',
        comment: 'Excellent travail, très propre et rapide. Je recommande vivement pour tous vos travaux de plomberie.',
        tags: ['Ponctuel', 'Travail soigné', 'Sympathique'],
        response: 'Merci Paul ! Ce fut un plaisir.'
    },
    {
        id: 'r2',
        name: 'Julie M.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4,
        date: 'Il y a 1 semaine',
        comment: 'Bonne prestation globale. Un petit retard au démarrage mais le résultat est là. Prix correct.',
        tags: ['Bon prix', 'Efficace']
    },
    {
        id: 'r3',
        name: 'Ahmed K.',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
        rating: 5,
        date: 'Il y a 2 semaines',
        comment: 'Super pro ! A réglé le problème électrique en 30min alors que d\'autres galéraient. Merci !',
        tags: ['Expert', 'Rapide']
    }
];
