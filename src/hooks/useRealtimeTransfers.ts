import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface TransferPayload {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  purpose: string | null;
  status: string;
  created_at: string;
}

interface UseRealtimeTransfersOptions {
  userId: string | null;
  onInsert?: (transfer: TransferPayload) => void;
  onUpdate?: (transfer: TransferPayload) => void;
  onDelete?: (transfer: TransferPayload) => void;
  onAnyChange?: () => void;
}

export function useRealtimeTransfers({
  userId,
  onInsert,
  onUpdate,
  onDelete,
  onAnyChange,
}: UseRealtimeTransfersOptions) {
  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<TransferPayload>) => {
      const transfer = payload.new as TransferPayload || payload.old as TransferPayload;
      
      // Only process if this user is involved
      if (userId && transfer) {
        const isRelevant = transfer.from_user_id === userId || transfer.to_user_id === userId;
        if (!isRelevant) return;
      }

      if (payload.eventType === 'INSERT' && onInsert) {
        onInsert(payload.new as TransferPayload);
      } else if (payload.eventType === 'UPDATE' && onUpdate) {
        onUpdate(payload.new as TransferPayload);
      } else if (payload.eventType === 'DELETE' && onDelete) {
        onDelete(payload.old as TransferPayload);
      }

      // Always call onAnyChange if provided
      if (onAnyChange) {
        onAnyChange();
      }
    },
    [userId, onInsert, onUpdate, onDelete, onAnyChange]
  );

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('transfers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'demo_transfers',
        },
        handleChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, handleChange]);
}
