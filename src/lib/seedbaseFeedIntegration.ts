// Seedbase Feed Integration
// Handles injecting Seedbase actions into the global feed

export interface SeedbaseFeedItem {
  id: string;
  type: 'commitment' | 'mission_launched' | 'allocation' | 'harvest' | 'vote' | 'envoy_update';
  title: string;
  body: string;
  amount?: number;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  seedbase: string;
  timestamp: Date;
  image_url?: string;
}

const FEED_STORAGE_KEY = 'seedbase-user-feed-items';

// Get all user-generated feed items
export function getUserFeedItems(): SeedbaseFeedItem[] {
  const stored = localStorage.getItem(FEED_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const items = JSON.parse(stored);
    // Convert timestamps back to Date objects
    return items.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch {
    return [];
  }
}

// Add a new feed item
export function addFeedItem(item: Omit<SeedbaseFeedItem, 'id' | 'timestamp'>): SeedbaseFeedItem {
  const newItem: SeedbaseFeedItem = {
    ...item,
    id: `seedbase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  
  const existing = getUserFeedItems();
  const updated = [newItem, ...existing].slice(0, 50); // Keep last 50 items
  
  localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(updated));
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('seedbase-feed-update', { detail: newItem }));
  
  return newItem;
}

// Create commitment feed item
export function createCommitmentFeedItem(data: {
  amount: number;
  years: number;
  userName: string;
  userAvatar: string;
  userHandle: string;
}): SeedbaseFeedItem {
  return addFeedItem({
    type: 'commitment',
    title: 'New Seed Commitment',
    body: `@${data.userHandle} locked $${data.amount.toLocaleString()} into Christ is King Seedbase for ${data.years} years. 🌱`,
    amount: data.amount,
    author: {
      name: data.userName,
      avatar: data.userAvatar,
      handle: data.userHandle,
    },
    seedbase: 'Christ is King Seedbase',
  });
}

// Create mission launched feed item
export function createMissionFeedItem(data: {
  missionName: string;
  goal: number;
  envoyName: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
}): SeedbaseFeedItem {
  return addFeedItem({
    type: 'mission_launched',
    title: 'Mission Launched 🚀',
    body: `New mission "${data.missionName}" launched with a $${data.goal.toLocaleString()} goal. ${data.envoyName} will lead this initiative.`,
    amount: data.goal,
    author: {
      name: data.userName,
      avatar: data.userAvatar,
      handle: data.userHandle,
    },
    seedbase: 'Christ is King Seedbase',
  });
}

// Create allocation feed item
export function createAllocationFeedItem(data: {
  missionName: string;
  amount: number;
  userName: string;
  userAvatar: string;
  userHandle: string;
}): SeedbaseFeedItem {
  return addFeedItem({
    type: 'allocation',
    title: 'Funds Allocated',
    body: `$${data.amount.toLocaleString()} allocated from the Provision Pool to ${data.missionName}. 💸`,
    amount: data.amount,
    author: {
      name: data.userName,
      avatar: data.userAvatar,
      handle: data.userHandle,
    },
    seedbase: 'Christ is King Seedbase',
  });
}

// Create harvest report feed item
export function createHarvestFeedItem(data: {
  missionName: string;
  weekNumber: string;
  peopleServed?: string;
  summary?: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  imageUrl?: string;
}): SeedbaseFeedItem {
  return addFeedItem({
    type: 'harvest',
    title: `Week ${data.weekNumber} Harvest Report 🌾`,
    body: data.summary || `Harvest report submitted for ${data.missionName}. ${data.peopleServed ? `${data.peopleServed} people served this week.` : ''}`,
    author: {
      name: data.userName,
      avatar: data.userAvatar,
      handle: data.userHandle,
    },
    seedbase: 'Christ is King Seedbase',
    image_url: data.imageUrl,
  });
}

// Create envoy update feed item
export function createEnvoyUpdateFeedItem(data: {
  postType: string;
  content: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  imageUrl?: string;
}): SeedbaseFeedItem {
  return addFeedItem({
    type: 'envoy_update',
    title: data.postType === 'testimony' ? 'Testimony ✨' : data.postType === 'announcement' ? 'Announcement 📢' : 'Mission Update',
    body: data.content,
    author: {
      name: data.userName,
      avatar: data.userAvatar,
      handle: data.userHandle,
    },
    seedbase: 'Christ is King Seedbase',
    image_url: data.imageUrl,
  });
}

// Clear all user feed items (for testing)
export function clearUserFeedItems(): void {
  localStorage.removeItem(FEED_STORAGE_KEY);
}
