
export type UserRole = 'client' | 'pro';
export type UserTier = 'standard' | 'verified' | 'premium';
export type PricingUnit = 'fixed' | 'hourly' | 'daily' | 'monthly';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tier: UserTier; // Nouveau champ Tier
  avatar: string;
  isVerified: boolean; // Gardé pour rétrocompatibilité visuelle, mais lié au tier
  rating: number;
  jobsCompleted: number;
  skills?: string[];
  location?: string; // Format attendu: "Quartier, Ville" ou juste "Ville"
  available?: boolean;
  wealth: number; 
  bronzeCoins: number; 
  isPremium?: boolean; // Gardé pour rétrocompatibilité
  
  // Quotas
  monthlyApplicationsUsed: number;
  monthlyMessagesUsed: number;
  
  // New: Tracking
  appliedJobIds: string[];
}

export interface TargetZone {
    scope: 'COUNTRY' | 'CITY' | 'NEIGHBORHOOD';
    value: string; // "Gabon", "Libreville", "Louis", etc.
}

export interface JobComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
    isOwner?: boolean;
    // Likes
    likes?: number;
    likedByMe?: boolean;
}

export interface Job {
  id: string;
  type: 'hiring' | 'service_offer';
  title: string;
  description: string;
  category: string;
  budget: number; // in XAF
  pricingUnit?: PricingUnit; // NOUVEAU: Unité de prix
  location: string; // Localisation précise du job (ex: Quartier Louis)
  targetZone?: TargetZone; // NOUVEAU: Zone de visibilité (Qui peut voir ça ?)
  status: 'open' | 'negotiating' | 'taken' | 'completed';
  postedBy: User;
  createdAt: string;
  isUrgent?: boolean;
  isBoosted?: boolean; 
  applicants?: number;
  assignedTo?: User;
  negotiable?: boolean;
  images?: string[]; // Ajout des images
  views?: number; // NOUVEAU: Compteur de vues
  
  // Likes
  likes?: number;
  likedByMe?: boolean;
  
  // New visibility rules
  minTierRequired?: UserTier; // Le tier minimum pour voir/postuler
  
  // Social
  comments?: JobComment[]; // Commentaires publics
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  type?: 'text' | 'offer' | 'escrow_release' | 'image' | 'voice' | 'location' | 'negotiation' | 'application'; // Added 'application'
  metadata?: {
      amount?: number;
      duration?: string; // For voice
      lat?: number; // For location
      lng?: number; // For location
      status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'countered';
      counterOffer?: number;
      jobId?: string; // Link message to a job
      url?: string;
  };
  // Reactions
  likes?: number;
  likedByMe?: boolean;
}

export interface Conversation {
    id: string;
    withUser: User;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    messages: ChatMessage[];
    relatedJobId?: string;
}

export interface StatusStory {
    id: string;
    user: User;
    type: 'urgent_job' | 'info';
    text: string;
    expiresAt: string;
    jobId?: string; // Link to the full job details
    views?: number; // NOUVEAU: Compteur de vues
}

export interface Transaction {
    id: string;
    type: 'credit' | 'debit' | 'escrow_lock' | 'escrow_release' | 'coin_purchase' | 'gift_sent' | 'subscription';
    amount: number; // Can be FCFA or Coins depending on context
    currency: 'XAF' | 'COIN';
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

export enum AppTab {
  HOME = 'home',
  MY_JOBS = 'my_jobs', // Replaced HALL_OF_AME
  CREATE = 'create',
  MESSAGES = 'messages',
  PROFILE = 'profile',
}

export interface CurrencyBreakdown {
    gold: number;
    silver: number;
    copper: number;
}

// Updated Notification Interface
export interface AppNotification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    date: string;
    type: 'info' | 'success' | 'alert';
    action?: {
        label: string;
        target?: string;
        actionType?: 'view_job' | 'boost' | 'verify';
    };
    icon?: string; // Lucide icon name hint
}

// State for the Global Info Modal
export interface InfoModalState {
    isOpen: boolean;
    title: string;
    content: string;
}

// --- COMMERCE TYPES ---
export interface CoinPack {
    id: string;
    name: string;
    coins: number;
    priceXaf: number;
    tag?: string;
    bonus?: number;
}

export interface BoostOption {
    id: 'basic' | 'urgent';
    label: string;
    description: string;
    duration: string;
    cost: number;
    icon: string;
}