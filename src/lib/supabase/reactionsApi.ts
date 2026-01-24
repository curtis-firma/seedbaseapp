import { supabase } from '@/integrations/supabase/client';

export interface DemoReaction {
  id: string;
  transfer_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

// Grouped reactions for display
export interface ReactionGroup {
  emoji: string;
  count: number;
  userIds: string[];
  hasReacted: boolean; // Whether current user has reacted with this emoji
}

// Popular reaction emojis
export const REACTION_EMOJIS = ['🙏', '❤️', '🔥', '👏', '💯', '🙌'];

/**
 * Get all reactions for a transfer
 */
export async function getReactionsForTransfer(transferId: string): Promise<DemoReaction[]> {
  const { data, error } = await supabase
    .from('demo_reactions')
    .select('*')
    .eq('transfer_id', transferId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }

  return data || [];
}

/**
 * Get reactions for multiple transfers at once (more efficient)
 */
export async function getReactionsForTransfers(transferIds: string[]): Promise<Map<string, DemoReaction[]>> {
  if (transferIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from('demo_reactions')
    .select('*')
    .in('transfer_id', transferIds)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching reactions:', error);
    return new Map();
  }

  // Group by transfer_id
  const grouped = new Map<string, DemoReaction[]>();
  (data || []).forEach(reaction => {
    const existing = grouped.get(reaction.transfer_id) || [];
    existing.push(reaction);
    grouped.set(reaction.transfer_id, existing);
  });

  return grouped;
}

/**
 * Add a reaction to a transfer
 */
export async function addReaction(
  transferId: string,
  userId: string,
  emoji: string
): Promise<DemoReaction | null> {
  const { data, error } = await supabase
    .from('demo_reactions')
    .insert({
      transfer_id: transferId,
      user_id: userId,
      emoji,
    })
    .select()
    .single();

  if (error) {
    // Might be a duplicate - that's okay
    if (error.code === '23505') {
      console.log('Reaction already exists');
      return null;
    }
    console.error('Error adding reaction:', error);
    return null;
  }

  return data;
}

/**
 * Remove a reaction from a transfer
 */
export async function removeReaction(
  transferId: string,
  userId: string,
  emoji: string
): Promise<boolean> {
  const { error } = await supabase
    .from('demo_reactions')
    .delete()
    .eq('transfer_id', transferId)
    .eq('user_id', userId)
    .eq('emoji', emoji);

  if (error) {
    console.error('Error removing reaction:', error);
    return false;
  }

  return true;
}

/**
 * Toggle a reaction (add if not exists, remove if exists)
 */
export async function toggleReaction(
  transferId: string,
  userId: string,
  emoji: string
): Promise<{ added: boolean; reaction: DemoReaction | null }> {
  // Check if reaction exists
  const { data: existing } = await supabase
    .from('demo_reactions')
    .select('*')
    .eq('transfer_id', transferId)
    .eq('user_id', userId)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing) {
    // Remove it
    await removeReaction(transferId, userId, emoji);
    return { added: false, reaction: null };
  } else {
    // Add it
    const reaction = await addReaction(transferId, userId, emoji);
    return { added: true, reaction };
  }
}

/**
 * Group reactions by emoji for display
 */
export function groupReactions(
  reactions: DemoReaction[],
  currentUserId: string | null
): ReactionGroup[] {
  const groups = new Map<string, ReactionGroup>();

  reactions.forEach(reaction => {
    const existing = groups.get(reaction.emoji);
    if (existing) {
      existing.count++;
      existing.userIds.push(reaction.user_id);
      if (reaction.user_id === currentUserId) {
        existing.hasReacted = true;
      }
    } else {
      groups.set(reaction.emoji, {
        emoji: reaction.emoji,
        count: 1,
        userIds: [reaction.user_id],
        hasReacted: reaction.user_id === currentUserId,
      });
    }
  });

  // Sort by count descending
  return Array.from(groups.values()).sort((a, b) => b.count - a.count);
}
