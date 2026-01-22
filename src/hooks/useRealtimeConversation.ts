import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DemoTransfer } from '@/lib/supabase/transfersApi';

interface UseRealtimeConversationOptions {
  userId1: string | null;
  userId2: string | null;
  onNewMessage?: (transfer: DemoTransfer) => void;
  onMessageUpdate?: (transfer: DemoTransfer) => void;
}

export function useRealtimeConversation({
  userId1,
  userId2,
  onNewMessage,
  onMessageUpdate,
}: UseRealtimeConversationOptions) {
  
  const isConversationMessage = useCallback((transfer: any) => {
    if (!userId1 || !userId2) return false;
    return (
      (transfer.from_user_id === userId1 && transfer.to_user_id === userId2) ||
      (transfer.from_user_id === userId2 && transfer.to_user_id === userId1)
    );
  }, [userId1, userId2]);

  useEffect(() => {
    if (!userId1 || !userId2) return;

    const channelId = `conversation-${[userId1, userId2].sort().join('-')}`;
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'demo_transfers',
        },
        (payload) => {
          if (isConversationMessage(payload.new) && onNewMessage) {
            onNewMessage(payload.new as DemoTransfer);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'demo_transfers',
        },
        (payload) => {
          if (isConversationMessage(payload.new) && onMessageUpdate) {
            onMessageUpdate(payload.new as DemoTransfer);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId1, userId2, isConversationMessage, onNewMessage, onMessageUpdate]);
}
