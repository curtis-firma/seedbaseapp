// Commitments API - Supabase operations for seed commitments
import { supabase } from '@/integrations/supabase/client';

export interface DemoCommitment {
  id: string;
  user_id: string;
  amount: number;
  years: number;
  committed_at: string;
  unlocks_at: string | null;
  status: string;
}

// Create a new commitment
export async function createCommitment(data: {
  user_id: string;
  amount: number;
  years: number;
}): Promise<DemoCommitment | null> {
  const unlocksAt = new Date();
  unlocksAt.setFullYear(unlocksAt.getFullYear() + data.years);

  const { data: commitment, error } = await supabase
    .from('demo_commitments')
    .insert({
      user_id: data.user_id,
      amount: data.amount,
      years: data.years,
      unlocks_at: unlocksAt.toISOString(),
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating commitment:', error);
    return null;
  }

  return commitment;
}

// Get commitments for a user
export async function getCommitmentsByUserId(userId: string): Promise<DemoCommitment[]> {
  const { data, error } = await supabase
    .from('demo_commitments')
    .select('*')
    .eq('user_id', userId)
    .order('committed_at', { ascending: false });

  if (error) {
    console.error('Error getting commitments:', error);
    return [];
  }

  return data || [];
}

// Get total committed amount for a user
export async function getTotalCommitted(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('demo_commitments')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) {
    console.error('Error getting total committed:', error);
    return 0;
  }

  return (data || []).reduce((sum, c) => sum + Number(c.amount), 0);
}

// Get active commitment
export async function getActiveCommitment(userId: string): Promise<DemoCommitment | null> {
  const { data, error } = await supabase
    .from('demo_commitments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('committed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error getting active commitment:', error);
    return null;
  }

  return data;
}