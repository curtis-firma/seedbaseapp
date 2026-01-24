import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface TypingUser {
  id: string;
  username: string;
  isTyping: boolean;
  lastTyped: string;
}

interface UseTypingIndicatorProps {
  conversationId: string | null; // Could be a combination of user IDs
  currentUserId: string | null;
  currentUsername: string | null;
}

export function useTypingIndicator({
  conversationId,
  currentUserId,
  currentUsername,
}: UseTypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Generate a consistent conversation channel name
  const getChannelName = useCallback(() => {
    if (!conversationId) return null;
    return `typing:${conversationId}`;
  }, [conversationId]);

  // Set up presence channel
  useEffect(() => {
    const channelName = getChannelName();
    if (!channelName || !currentUserId) return;

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: TypingUser[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          if (key !== currentUserId && Array.isArray(presences) && presences.length > 0) {
            const presence = presences[0] as any;
            if (presence.isTyping) {
              users.push({
                id: key,
                username: presence.username || 'Someone',
                isTyping: presence.isTyping,
                lastTyped: presence.lastTyped,
              });
            }
          }
        });
        
        setTypingUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key !== currentUserId && newPresences.length > 0) {
          const presence = newPresences[0] as any;
          if (presence.isTyping) {
            setTypingUsers(prev => {
              const exists = prev.some(u => u.id === key);
              if (exists) {
                return prev.map(u => 
                  u.id === key 
                    ? { ...u, isTyping: presence.isTyping, lastTyped: presence.lastTyped }
                    : u
                );
              }
              return [...prev, {
                id: key as string,
                username: presence.username || 'Someone',
                isTyping: presence.isTyping,
                lastTyped: presence.lastTyped,
              }];
            });
          }
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== currentUserId) {
          setTypingUsers(prev => prev.filter(u => u.id !== key));
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track initial presence as not typing
          await channel.track({
            username: currentUsername,
            isTyping: false,
            lastTyped: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [conversationId, currentUserId, currentUsername, getChannelName]);

  // Start typing indicator
  const startTyping = useCallback(async () => {
    if (!channelRef.current || isTypingRef.current) return;
    
    isTypingRef.current = true;
    
    await channelRef.current.track({
      username: currentUsername,
      isTyping: true,
      lastTyped: new Date().toISOString(),
    });

    // Auto-stop typing after 3 seconds of no input
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [currentUsername]);

  // Stop typing indicator
  const stopTyping = useCallback(async () => {
    if (!channelRef.current) return;
    
    isTypingRef.current = false;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    await channelRef.current.track({
      username: currentUsername,
      isTyping: false,
      lastTyped: new Date().toISOString(),
    });
  }, [currentUsername]);

  // Called on each keystroke to reset the timeout
  const onKeystroke = useCallback(() => {
    startTyping();
  }, [startTyping]);

  return {
    typingUsers,
    onKeystroke,
    stopTyping,
  };
}

// Helper to generate consistent conversation ID from two user IDs
export function getConversationId(userId1: string | null, userId2: string | null): string | null {
  if (!userId1 || !userId2) return null;
  // Sort IDs to ensure consistent ordering
  const sorted = [userId1, userId2].sort();
  return `${sorted[0]}_${sorted[1]}`;
}
