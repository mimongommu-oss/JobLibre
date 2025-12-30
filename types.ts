
export type UserRole = 'client' | 'pro' | 'admin'; // Added admin
export type UserTier = 'standard' | 'verified' | 'premium';
export type PricingUnit = 'fixed' | 'hourly' | 'daily' | 'monthly';

export interface VerificationDoc {
    type: 'id_card' | 'passport' | 'driver_license' | 'residence_proof' | 'security_video';
    status: 'missing' | 'pending' | 'verified' | 'rejected';
    uploadedAt?: string;
    url?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tier: UserTier; 
  avatar: string;
  isVerified: boolean; 
  rating: number;
  jobsCompleted: number;
  skills?: string[];
  location?: string; 
  available?: boolean;
  wealth: number; 
  bronzeCoins: number; 
  isPremium?: boolean; 
  
  // Quotas
  monthlyApplicationsUsed: number;
  monthlyMessagesUsed: number;
  
  // New: Tracking
  appliedJobIds: string[];

  // Identity & Verification
  verificationScore: number; // 0 to 100
  verificationDocs: VerificationDoc[];
}

export interface TargetZone {
    scope: 'COUNTRY' | 'CITY' | 'NEIGHBORHOOD';
    value: string; 
}

export interface JobComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
    isOwner?: boolean;
    likes?: number;
    likedByMe?: boolean;
}

export interface Job {
  id: string;
  type: 'hiring' | 'service_offer';
  title: string;
  description: string;
  category: string;
  budget: number; 
  pricingUnit?: PricingUnit; 
  location: string; 
  targetZone?: TargetZone; 
  status: 'open' | 'negotiating' | 'taken' | 'completed';
  postedBy: User;
  createdAt: string;
  isUrgent?: boolean;
  isBoosted?: boolean; 
  applicants?: number;
  assignedTo?: User;
  negotiable?: boolean;
  images?: string[]; 
  views?: number; 
  likes?: number;
  likedByMe?: boolean;
  minTierRequired?: UserTier; 
  comments?: JobComment[]; 
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  type?: 'text' | 'offer' | 'escrow_release' | 'image' | 'voice' | 'location' | 'negotiation' | 'application'; 
  metadata?: {
      amount?: number;
      duration?: string; 
      lat?: number; 
      lng?: number; 
      status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'countered';
      counterOffer?: number;
      jobId?: string; 
      url?: string;
  };
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
    jobId?: string; 
    views?: number; 
}

export interface Transaction {
    id: string;
    type: 'credit' | 'debit' | 'escrow_lock' | 'escrow_release' | 'coin_purchase' | 'gift_sent' | 'subscription';
    amount: number; 
    currency: 'XAF' | 'COIN';
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    userId?: string; // For Admin view
}

export enum AppTab {
  AUTH = 'auth', // New
  ADMIN = 'admin', // New
  HOME = 'home',
  MY_JOBS = 'my_jobs', 
  CREATE = 'create',
  MESSAGES = 'messages',
  PROFILE = 'profile',
}

export interface CurrencyBreakdown {
    gold: number;
    silver: number;
    copper: number;
}

// --- INTELLIGENT ACTION SYSTEM ---
export type ActionType = 
    | 'view_job' 
    | 'validate_mission' 
    | 'boost_job' 
    | 'verify_identity' 
    | 'complete_profile' 
    | 'recharge_wallet' 
    | 'upgrade_premium'
    | 'create_job';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    date: string;
    type: 'info' | 'success' | 'alert';
    action?: {
        label: string;
        actionType: ActionType;
        targetId?: string; // ID of job, user, etc.
        contextData?: any; // Extra data (e.g. { tab: 'video' })
    };
    icon?: string; 
}

export interface GlobalActionPayload {
    type: ActionType;
    targetId?: string;
    contextData?: any;
}

export interface InfoModalState {
    isOpen: boolean;
    title: string;
    content: string;
}

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
