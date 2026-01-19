import { motion } from 'framer-motion';
import { ArrowRight, Check, X, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransferCardProps {
  fromUsername: string;
  toUsername: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined';
  purpose?: string;
  isIncoming?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function TransferCard({
  fromUsername,
  toUsername,
  amount,
  status,
  purpose,
  isIncoming,
  onAccept,
  onDecline,
}: TransferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-4",
        status === 'pending' && isIncoming ? "bg-primary/5 border-primary/30" :
        status === 'accepted' ? "bg-primary/5 border-primary/30" :
        status === 'declined' ? "bg-destructive/5 border-destructive/30" :
        "bg-muted/50 border-border/50"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          status === 'accepted' ? "bg-primary/10" :
          status === 'declined' ? "bg-destructive/10" :
          "bg-primary/10"
        )}>
          <DollarSign className={cn(
            "h-5 w-5",
            status === 'accepted' ? "text-primary" :
            status === 'declined' ? "text-destructive" :
            "text-primary"
          )} />
        </div>
        
        <div className="flex-1 flex items-center gap-2">
          <span className="font-medium">@{fromUsername}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">@{toUsername}</span>
        </div>
        
        <span className={cn(
          "text-lg font-bold",
          status === 'accepted' ? "text-primary" :
          status === 'declined' ? "text-destructive" :
          "text-foreground"
        )}>
          ${amount.toFixed(2)}
        </span>
      </div>
      
      {purpose && (
        <p className="text-sm text-muted-foreground mb-3">"{purpose}"</p>
      )}
      
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full capitalize",
          status === 'pending' ? "bg-primary/10 text-primary" :
          status === 'accepted' ? "bg-primary/10 text-primary" :
          "bg-destructive/10 text-destructive"
        )}>
          {status}
        </span>
        
        {status === 'pending' && isIncoming && onAccept && onDecline && (
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onDecline}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium"
            >
              <X className="h-4 w-4" />
              Decline
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onAccept}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium"
            >
              <Check className="h-4 w-4" />
              Accept
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
