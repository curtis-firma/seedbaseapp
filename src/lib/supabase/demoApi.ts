// Demo API Layer - Supabase operations for demo users, wallets, keys
import { supabase } from '@/integrations/supabase/client';

// Generate stable display ID from UUID (0x + first 12 hex chars)
export function generateDisplayId(uuid: string): string {
  const hex = uuid.replace(/-/g, '').toUpperCase();
  return `0x${hex.slice(0, 12)}`;
}

// Truncate display ID for UI
export function truncateDisplayId(displayId: string): string {
  if (displayId.length <= 10) return displayId;
  return `${displayId.slice(0, 6)}...${displayId.slice(-4)}`;
}

// Get key type from role
export function getKeyTypeFromRole(role: string): 'SeedKey' | 'BaseKey' | 'MissionKey' {
  switch (role) {
    case 'trustee': return 'BaseKey';
    case 'envoy': return 'MissionKey';
    default: return 'SeedKey';
  }
}

// Types for demo data
export interface DemoUser {
  id: string;
  phone: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  active_role: 'activator' | 'trustee' | 'envoy';
  onboarding_complete: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface DemoWallet {
  id: string;
  user_id: string;
  wallet_type: string;
  display_id: string;
  balance: number;
  created_at: string;
}

export interface DemoKey {
  id: string;
  user_id: string;
  key_type: 'SeedKey' | 'BaseKey' | 'MissionKey';
  display_id: string;
  status: 'active' | 'inactive';
  created_at: string;
}

// Helper to cast database response to typed DemoUser
function castToDemoUser(data: any): DemoUser {
  return {
    ...data,
    active_role: data.active_role as 'activator' | 'trustee' | 'envoy',
  };
}

// Helper to cast database response to typed DemoKey
function castToDemoKey(data: any): DemoKey {
  return {
    ...data,
    key_type: data.key_type as 'SeedKey' | 'BaseKey' | 'MissionKey',
    status: data.status as 'active' | 'inactive',
  };
}

// Find user by phone number
export async function findUserByPhone(phone: string): Promise<DemoUser | null> {
  const { data, error } = await supabase
    .from('demo_users')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();
  
  if (error) {
    console.error('Error finding user by phone:', error);
    return null;
  }
  return data ? castToDemoUser(data) : null;
}

// Find user by username (uses public view - no phone exposed)
export async function findUserByUsername(username: string): Promise<DemoUser | null> {
  const normalizedUsername = username.toLowerCase().replace(/^@/, '');
  const { data, error } = await supabase
    .from('demo_users_public')
    .select('*')
    .ilike('username', normalizedUsername)
    .maybeSingle();
  
  if (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
  // Add empty phone since view doesn't include it
  return data ? castToDemoUser({ ...data, phone: '' }) : null;
}

// Get user by ID (uses public view - no phone exposed for general lookups)
export async function getUserById(userId: string): Promise<DemoUser | null> {
  const { data, error } = await supabase
    .from('demo_users_public')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
  // Add empty phone since view doesn't include it
  return data ? castToDemoUser({ ...data, phone: '' }) : null;
}

// Create new user (returns the created user)
export async function createUser(data: {
  phone: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  active_role?: 'activator' | 'trustee' | 'envoy';
}): Promise<DemoUser | null> {
  const { data: user, error } = await supabase
    .from('demo_users')
    .insert({
      phone: data.phone,
      username: data.username.toLowerCase(),
      display_name: data.display_name || data.username,
      avatar_url: data.avatar_url,
      active_role: data.active_role || 'activator',
      onboarding_complete: false,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  return user ? castToDemoUser(user) : null;
}

// Update user
export async function updateUser(userId: string, data: Partial<{
  username: string;
  display_name: string;
  avatar_url: string;
  active_role: 'activator' | 'trustee' | 'envoy';
  onboarding_complete: boolean;
  last_login_at: string;
}>): Promise<DemoUser | null> {
  const { data: user, error } = await supabase
    .from('demo_users')
    .update(data)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return user ? castToDemoUser(user) : null;
}

// Check if username is taken
export async function isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean> {
  const normalizedUsername = username.toLowerCase();
  let query = supabase
    .from('demo_users')
    .select('id')
    .ilike('username', normalizedUsername);
  
  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }
  
  const { data, error } = await query.maybeSingle();
  
  if (error) {
    console.error('Error checking username:', error);
    return false;
  }
  return data !== null;
}

// Get user's wallet
export async function getWalletByUserId(userId: string, walletType = 'personal'): Promise<DemoWallet | null> {
  const { data, error } = await supabase
    .from('demo_wallets')
    .select('*')
    .eq('user_id', userId)
    .eq('wallet_type', walletType)
    .maybeSingle();
  
  if (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
  return data;
}

// Create wallet for user
export async function createWallet(userId: string, walletType = 'personal', initialBalance = 25): Promise<DemoWallet | null> {
  // Generate display ID from a new UUID
  const tempId = crypto.randomUUID();
  const displayId = generateDisplayId(tempId);
  
  const { data, error } = await supabase
    .from('demo_wallets')
    .insert({
      user_id: userId,
      wallet_type: walletType,
      display_id: displayId,
      balance: initialBalance,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating wallet:', error);
    return null;
  }
  return data;
}

// Update wallet balance
export async function updateWalletBalance(walletId: string, newBalance: number): Promise<DemoWallet | null> {
  const { data, error } = await supabase
    .from('demo_wallets')
    .update({ balance: newBalance })
    .eq('id', walletId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating wallet balance:', error);
    return null;
  }
  return data;
}

// Get user's key (most recent active key)
export async function getKeyByUserId(userId: string): Promise<DemoKey | null> {
  const { data, error } = await supabase
    .from('demo_keys')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error('Error getting key:', error);
    return null;
  }
  return data ? castToDemoKey(data) : null;
}

// Create key for user
export async function createKey(userId: string, keyType: 'SeedKey' | 'BaseKey' | 'MissionKey'): Promise<DemoKey | null> {
  // Generate display ID from a new UUID
  const tempId = crypto.randomUUID();
  const displayId = generateDisplayId(tempId);
  
  const { data, error } = await supabase
    .from('demo_keys')
    .insert({
      user_id: userId,
      key_type: keyType,
      display_id: displayId,
      status: 'active',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating key:', error);
    return null;
  }
  return data ? castToDemoKey(data) : null;
}

// Search users by username or display name (uses public view - no phone exposed)
export async function searchUsers(query: string, excludeUserId?: string, limit = 20): Promise<DemoUser[]> {
  const searchPattern = `%${query.toLowerCase().replace(/^@/, '')}%`;
  
  let dbQuery = supabase
    .from('demo_users_public')
    .select('*')
    .eq('onboarding_complete', true)
    .or(`username.ilike.${searchPattern},display_name.ilike.${searchPattern}`)
    .limit(limit);
  
  if (excludeUserId) {
    dbQuery = dbQuery.neq('id', excludeUserId);
  }
  
  const { data, error } = await dbQuery;
  
  if (error) {
    console.error('Error searching users:', error);
    return [];
  }
  // Add empty phone since view doesn't include it
  return (data || []).map(d => castToDemoUser({ ...d, phone: '' }));
}

// Get all completed users (for Send modal) - uses public view - no phone exposed
export async function getAllCompletedUsers(excludeUserId?: string, limit = 50): Promise<DemoUser[]> {
  let query = supabase
    .from('demo_users_public')
    .select('*')
    .eq('onboarding_complete', true)
    .order('username')
    .limit(limit);
  
  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error getting all users:', error);
    return [];
  }
  // Add empty phone since view doesn't include it
  return (data || []).map(d => castToDemoUser({ ...d, phone: '' }));
}

// Get full user data with wallet and key
export async function getFullUserData(userId: string): Promise<{
  user: DemoUser;
  wallet: DemoWallet | null;
  key: DemoKey | null;
} | null> {
  const user = await getUserById(userId);
  if (!user) return null;
  
  const [wallet, key] = await Promise.all([
    getWalletByUserId(userId),
    getKeyByUserId(userId),
  ]);
  
  return { user, wallet, key };
}

// Count demo users (for seeding check)
export async function countDemoUsers(): Promise<number> {
  const { count, error } = await supabase
    .from('demo_users')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error counting users:', error);
    return 0;
  }
  return count || 0;
}

// Upload avatar to storage
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    // Convert file to ArrayBuffer for more reliable upload
    const arrayBuffer = await file.arrayBuffer();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });
    
    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    
    if (!data?.publicUrl) {
      console.error('Failed to get public URL for avatar');
      return null;
    }
    
    return data.publicUrl;
  } catch (err) {
    console.error('Avatar upload exception:', err);
    return null;
  }
}

// Get ALL keys for a user (active + inactive)
export async function getAllKeysByUserId(userId: string): Promise<DemoKey[]> {
  const { data, error } = await supabase
    .from('demo_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
  return (data || []).map(castToDemoKey);
}
