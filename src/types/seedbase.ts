// Seedbase Core Types

export type KeyType = 'SeedKey' | 'BaseKey' | 'MissionKey';

export type UserRole = 'activator' | 'trustee' | 'envoy';

export interface UserKey {
  type: KeyType;
  isActive: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  keys: UserKey[];
  activeRole: UserRole;
  walletBalance: number;
  lockedSeed: number;
  pendingDistributions: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  seedbaseId: string;
  seedbaseName: string;
  envoyId: string;
  envoyName: string;
  status: 'active' | 'completed' | 'pending';
  fundingGoal: number;
  fundingRaised: number;
  milestones: Milestone[];
  createdAt: Date;
  impactMetrics: ImpactMetric[];
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface ImpactMetric {
  label: string;
  value: string | number;
  icon?: string;
}

export interface Seedbase {
  id: string;
  name: string;
  description: string;
  logo: string;
  totalCommitted: number;
  activeMissions: number;
  trustees: string[];
  category: string;
}

export interface FeedItem {
  id: string;
  type: 'mission_update' | 'harvest' | 'testimony' | 'commitment' | 'distribution' | 'transparency' | 'milestone';
  title: string;
  content: string;
  author?: {
    name: string;
    avatar: string;
    role: UserRole;
  };
  mission?: {
    id: string;
    name: string;
  };
  seedbase?: {
    id: string;
    name: string;
  };
  media?: {
    type: 'image' | 'video' | 'chart';
    url?: string;
    data?: any;
  };
  metrics?: ImpactMetric[];
  timestamp: Date;
  likes: number;
  comments: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isTransfer?: boolean;
  transfer?: {
    amount: number;
    purpose: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  hasTransfer?: boolean;
}

export interface VaultMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  changeLabel: string;
  chartData?: { date: string; value: number }[];
}
