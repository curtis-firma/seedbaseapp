import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, X, DollarSign, Inbox, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { 
  getPendingTransfersForUser, 
  acceptTransfer, 
  declineTransfer,
  getRecentTransfers,
  type Transfer 
} from '@/lib/demoTransfers';
import { loadUserByPhone } from '@/lib/demoAuth';
import { toast } from 'sonner';

export default function OneAccordPage() {
  const { phoneNumber } = useUser();
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const navigate = useNavigate();

  const loadTransfers = () => {
    if (phoneNumber) {
      setPendingTransfers(getPendingTransfersForUser(phoneNumber));
      setRecentTransfers(getRecentTransfers(phoneNumber, 20));
    }
  };

  useEffect(() => {
    loadTransfers();
  }, [phoneNumber]);

  const handleAccept = (transfer: Transfer) => {
    const updated = acceptTransfer(transfer.id);
    if (updated) {
      toast.success(`Accepted $${transfer.amount} from @${transfer.fromUsername}`);
      loadTransfers();
    }
  };

  const handleDecline = (transfer: Transfer) => {
    const updated = declineTransfer(transfer.id);
    if (updated) {
      toast.success('Transfer declined');
      loadTransfers();
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {selectedTransfer ? (
          <TransferDetailView
            key="detail"
            transfer={selectedTransfer}
            onBack={() => setSelectedTransfer(null)}
            onAccept={() => {
              handleAccept(selectedTransfer);
              setSelectedTransfer(null);
            }}
            onDecline={() => {
              handleDecline(selectedTransfer);
              setSelectedTransfer(null);
            }}
          />
        ) : (
          <TransferListView
            key="list"
            pendingTransfers={pendingTransfers}
            recentTransfers={recentTransfers}
            onSelectTransfer={setSelectedTransfer}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onRefresh={loadTransfers}
            currentPhone={phoneNumber}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TransferListView({ 
  pendingTransfers,
  recentTransfers,
  onSelectTransfer,
  onAccept,
  onDecline,
  onRefresh,
  currentPhone,
}: { 
  pendingTransfers: Transfer[];
  recentTransfers: Transfer[];
  onSelectTransfer: (t: Transfer) => void;
  onAccept: (t: Transfer) => void;
  onDecline: (t: Transfer) => void;
  onRefresh: () => void;
  currentPhone: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">OneAccord</h1>
            <p className="text-sm text-muted-foreground">Messages & Transfers</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </motion.button>
        </div>
      </header>

      {/* Info Banner */}
      <div className="px-4 py-3">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">All transfers arrive here.</span> Accept USDC transfers to move them to your wallet.
          </p>
        </div>
      </div>

      {/* Pending Transfers */}
      {pendingTransfers.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-semibold">Pending</h2>
            <span className="px-2 py-0.5 bg-seed/10 text-seed rounded-full text-xs font-medium">
              {pendingTransfers.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingTransfers.map((transfer, i) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-seed/30 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full gradient-seed flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">@{transfer.fromUsername}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transfer.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-seed">${transfer.amount.toFixed(2)}</p>
                </div>
                
                {transfer.purpose && (
                  <p className="text-sm text-muted-foreground mb-3">"{transfer.purpose}"</p>
                )}
                
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAccept(transfer)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 gradient-seed rounded-xl text-white font-medium"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDecline(transfer)}
                    className="px-4 py-3 bg-muted rounded-xl"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingTransfers.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No pending transfers</h3>
          <p className="text-sm text-muted-foreground">
            When someone sends you USDC, it will appear here
          </p>
        </div>
      )}

      {/* Recent Activity */}
      {recentTransfers.length > 0 && (
        <div className="px-4 py-4">
          <h2 className="font-semibold mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {recentTransfers.filter(t => t.status !== 'pending').map((transfer, i) => {
              const isIncoming = transfer.toPhone === currentPhone;
              const isAccepted = transfer.status === 'accepted';
              
              return (
                <motion.button
                  key={transfer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelectTransfer(transfer)}
                  className="w-full bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4 text-left"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isAccepted ? "bg-seed/10" : "bg-muted"
                  )}>
                    <DollarSign className={cn(
                      "h-5 w-5",
                      isAccepted ? "text-seed" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {isIncoming ? `From @${transfer.fromUsername}` : `To @${transfer.toUsername}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transfer.status === 'accepted' ? 'Accepted' : 'Declined'} • {formatDistanceToNow(new Date(transfer.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <p className={cn(
                    "font-semibold",
                    isIncoming && isAccepted ? "text-seed" : "text-foreground"
                  )}>
                    {isIncoming ? '+' : '-'}${transfer.amount.toFixed(2)}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TransferDetailView({ 
  transfer, 
  onBack,
  onAccept,
  onDecline,
}: { 
  transfer: Transfer; 
  onBack: () => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const { phoneNumber } = useUser();
  const isIncoming = transfer.toPhone === phoneNumber;
  const isPending = transfer.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-muted rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="font-semibold">Transfer Details</h1>
            <p className="text-xs text-muted-foreground capitalize">{transfer.status}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="text-center mb-8">
          <div className={cn(
            "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
            transfer.status === 'accepted' ? "gradient-seed" : 
            transfer.status === 'declined' ? "bg-muted" : "gradient-base"
          )}>
            <DollarSign className={cn(
              "h-8 w-8",
              transfer.status === 'declined' ? "text-muted-foreground" : "text-white"
            )} />
          </div>
          <p className="text-4xl font-bold mb-2">
            {isIncoming ? '+' : '-'}${transfer.amount.toFixed(2)}
          </p>
          <p className="text-muted-foreground">USDC</p>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          <div className="p-4 flex justify-between">
            <span className="text-muted-foreground">From</span>
            <span className="font-medium">@{transfer.fromUsername}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-muted-foreground">To</span>
            <span className="font-medium">@{transfer.toUsername}</span>
          </div>
          {transfer.purpose && (
            <div className="p-4 flex justify-between">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium">{transfer.purpose}</span>
            </div>
          )}
          <div className="p-4 flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={cn(
              "font-medium capitalize",
              transfer.status === 'accepted' && "text-seed",
              transfer.status === 'declined' && "text-destructive"
            )}>
              {transfer.status}
            </span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {new Date(transfer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions for pending incoming transfers */}
        {isPending && isIncoming && (
          <div className="mt-6 space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              className="w-full py-4 gradient-seed rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              Accept Transfer
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onDecline}
              className="w-full py-4 bg-muted rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              <X className="h-5 w-5" />
              Decline
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
