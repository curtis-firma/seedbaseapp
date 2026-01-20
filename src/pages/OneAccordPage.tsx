import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, X, DollarSign, Inbox, RefreshCw, Vote, FileText, Bell, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  getPendingTransfers, 
  acceptTransfer, 
  declineTransfer,
  getTransfersForUser,
  type DemoTransfer 
} from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { SendModal } from '@/components/wallet/SendModal';
import { ComposeMessageModal } from '@/components/oneaccord/ComposeMessageModal';
import { InlineComposeBar } from '@/components/oneaccord/InlineComposeBar';
import { useRealtimeTransfers } from '@/hooks/useRealtimeTransfers';
import { oneAccordMessages } from '@/data/mockData';
import { Confetti } from '@/components/shared/Confetti';
import { triggerHaptic } from '@/hooks/useHaptic';
import seedbasePfp from '@/assets/seedbase-pfp.png';

// Message type icons and styles - Using blue (base) for branding
const messageTypeConfig: Record<string, { icon: typeof DollarSign; gradient: string; bgColor: string }> = {
  distribution: { icon: DollarSign, gradient: 'gradient-base', bgColor: 'bg-base/10' },
  transfer: { icon: Send, gradient: 'gradient-base', bgColor: 'bg-base/10' },
  harvest: { icon: FileText, gradient: 'gradient-envoy', bgColor: 'bg-envoy/10' },
  governance: { icon: Vote, gradient: 'gradient-trust', bgColor: 'bg-trust/10' },
  milestone: { icon: Sprout, gradient: 'gradient-base', bgColor: 'bg-base/10' },
  system: { icon: Bell, gradient: 'gradient-base', bgColor: 'bg-muted' },
  update: { icon: FileText, gradient: 'gradient-envoy', bgColor: 'bg-envoy/10' },
};

export default function OneAccordPage() {
  const [pendingTransfers, setPendingTransfers] = useState<DemoTransfer[]>([]);
  const [recentTransfers, setRecentTransfers] = useState<DemoTransfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<DemoTransfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [acceptedTransferId, setAcceptedTransferId] = useState<string | null>(null);
  // Persist accepted demo IDs in localStorage
  const [acceptedDemoIds, setAcceptedDemoIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('seedbase-accepted-demo-ids');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const navigate = useNavigate();

  // Get current user ID from session
  const getCurrentUserId = (): string | null => {
    const sessionData = localStorage.getItem('seedbase-session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        return parsed.userId || null;
      } catch {}
    }
    return null;
  };

  const loadTransfers = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const [pending, recent] = await Promise.all([
        getPendingTransfers(userId),
        getTransfersForUser(userId, 20)
      ]);
      setPendingTransfers(pending);
      setRecentTransfers(recent);
    } catch (err) {
      console.error('Error loading transfers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  // Subscribe to realtime transfer updates
  useRealtimeTransfers({
    userId: getCurrentUserId(),
    onInsert: (transfer) => {
      if (transfer.to_user_id === getCurrentUserId()) {
        toast.info('New transfer received!');
      }
      loadTransfers();
    },
    onUpdate: () => {
      loadTransfers();
    },
  });

  const handleAccept = async (transfer: DemoTransfer) => {
    const updated = await acceptTransfer(transfer.id);
    if (updated) {
      // Show success state with confetti
      setAcceptedTransferId(transfer.id);
      setShowConfetti(true);
      triggerHaptic('success');
      
      toast.success(`Accepted $${transfer.amount} from @${transfer.from_user?.username || 'user'}`);
      
      // Delay removal to show success animation
      setTimeout(() => {
        setShowConfetti(false);
        setAcceptedTransferId(null);
        loadTransfers();
      }, 1500);
    } else {
      toast.error('Failed to accept transfer');
    }
  };

  const handleDecline = async (transfer: DemoTransfer) => {
    const updated = await declineTransfer(transfer.id);
    if (updated) {
      triggerHaptic('light');
      toast.success('Transfer declined');
      loadTransfers();
    } else {
      toast.error('Failed to decline transfer');
    }
  };

  const handleDemoAccept = (messageId: string) => {
    // Add to accepted set and persist to localStorage
    const newAcceptedIds = new Set(acceptedDemoIds);
    newAcceptedIds.add(messageId);
    setAcceptedDemoIds(newAcceptedIds);
    localStorage.setItem('seedbase-accepted-demo-ids', JSON.stringify([...newAcceptedIds]));
    
    setShowConfetti(true);
    triggerHaptic('success');
    toast.success('Transfer accepted! Funds added to your wallet.');
    setTimeout(() => {
      setShowConfetti(false);
    }, 2000);
  };

  const currentUserId = getCurrentUserId();

  // Always show demo messages first, then any real transfers below

  return (
    <div className="min-h-screen pb-36">
      {/* Confetti Animation */}
      <Confetti isActive={showConfetti} />
      
      <AnimatePresence mode="wait">
        {selectedTransfer ? (
          <TransferDetailView
            key="detail"
            transfer={selectedTransfer}
            currentUserId={currentUserId}
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
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Header */}
            <header className="sticky top-0 z-20 glass-strong border-b border-border/50">
              <div className="px-4 py-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">OneAccord</h1>
                  <p className="text-sm text-muted-foreground">Messages & Transfers</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={loadTransfers}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </motion.button>
                </div>
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

            {isLoading ? (
              <div className="px-4 py-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : (
              <div className="px-4 py-2">
                {/* ALWAYS show demo messages first */}
                {/* Pending Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="font-semibold">Pending</h2>
                    <span className="px-2 py-0.5 bg-base/10 text-base rounded-full text-xs font-medium">
                      {oneAccordMessages.filter(m => !m.isRead && m.hasAcceptButton).length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {oneAccordMessages.filter(m => m.hasAcceptButton && m.status === 'pending').map((message, i) => {
                      const config = messageTypeConfig[message.type] || messageTypeConfig.system;
                      const IconComponent = config.icon;
                      
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            "bg-card rounded-2xl border p-4",
                            !message.isRead ? "border-base/30" : "border-border/50"
                          )}
                        >
                        <div className="flex items-start gap-3 mb-3">
                            {message.avatar.startsWith('http') ? (
                              <img 
                                src={message.avatar}
                                alt={message.from}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                          ) : ['system', 'trustee', 'envoy'].includes(message.fromRole?.toLowerCase() || '') ? (
                              <img 
                                src={seedbasePfp}
                                alt="Seedbase"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.gradient)}>
                                {message.avatar.length <= 2 ? (
                                  <span className="text-lg">{message.avatar}</span>
                                ) : (
                                  <IconComponent className="h-5 w-5 text-white" />
                                )}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{message.from}</p>
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase",
                                  config.bgColor
                                )}>
                                  {message.fromRole}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            {message.amount && (
                              <p className="text-xl font-bold text-base">${message.amount.toLocaleString()}</p>
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <p className="font-medium text-foreground">{message.title}</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{message.body}</p>
                          </div>
                          
                          {message.hasAcceptButton && (
                            <div className="flex gap-2">
                              {acceptedDemoIds.has(message.id) ? (
                                <motion.div
                                  initial={{ scale: 0.95 }}
                                  animate={{ scale: [1, 1.05, 1] }}
                                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/20 border-2 border-primary rounded-xl text-primary font-medium cursor-not-allowed"
                                >
                                  <Check className="h-5 w-5" />
                                  Accepted
                                </motion.div>
                              ) : (
                                <>
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDemoAccept(message.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 gradient-base rounded-xl text-white font-medium"
                                  >
                                    <Check className="h-4 w-4" />
                                    Accept
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-3 bg-muted rounded-xl"
                                  >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                  </motion.button>
                                </>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* All Demo Messages */}
                <h2 className="font-semibold mb-3">All Messages</h2>
                <div className="space-y-2">
                  {oneAccordMessages.filter(m => m.status !== 'pending' || !m.hasAcceptButton).map((message, i) => {
                    const config = messageTypeConfig[message.type] || messageTypeConfig.system;
                    const IconComponent = config.icon;
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          "bg-card rounded-xl border p-4",
                          !message.isRead ? "border-primary/30" : "border-border/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {message.avatar.startsWith('http') ? (
                            <img 
                              src={message.avatar}
                              alt={message.from}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : ['system', 'trustee', 'envoy'].includes(message.fromRole?.toLowerCase() || '') ? (
                            <img 
                              src={seedbasePfp}
                              alt="Seedbase"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bgColor)}>
                              {message.avatar.length <= 2 ? (
                                <span className="text-lg">{message.avatar}</span>
                              ) : (
                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium truncate">{message.from}</p>
                              {message.status === 'accepted' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-base/10 text-base font-medium">
                                  Accepted
                                </span>
                              )}
                              {message.status === 'review' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 font-medium">
                                  In Review
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-sm">{message.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{message.body}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                          {message.amount && (
                            <p className={cn(
                              "font-semibold text-lg",
                              message.status === 'accepted' ? "text-base" : "text-foreground"
                            )}>
                              ${message.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Real Transfers Section - Only show if there are real transfers */}
                {(pendingTransfers.length > 0 || recentTransfers.length > 0) && (
                  <>
                    <div className="my-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs font-medium text-muted-foreground">YOUR TRANSFERS</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    {pendingTransfers.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <h2 className="font-semibold">Pending Transfers</h2>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
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
                              className="bg-card rounded-2xl border border-primary/30 p-4"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                {transfer.from_user?.avatar_url ? (
                                  <img 
                                    src={transfer.from_user.avatar_url}
                                    alt={transfer.from_user.display_name || transfer.from_user.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-white" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold">@{transfer.from_user?.username || 'unknown'}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <p className="text-xl font-bold text-primary">${transfer.amount.toFixed(2)}</p>
                              </div>
                              
                              {transfer.purpose && (
                                <p className="text-sm text-muted-foreground mb-3">"{transfer.purpose}"</p>
                              )}
                              
                              <div className="flex gap-2">
                                {acceptedTransferId === transfer.id ? (
                                  <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary rounded-xl text-white font-medium"
                                  >
                                    <Check className="h-5 w-5" />
                                    Accepted!
                                  </motion.div>
                                ) : (
                                  <>
                                    <motion.button
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleAccept(transfer)}
                                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium"
                                    >
                                      <Check className="h-4 w-4" />
                                      Accept
                                    </motion.button>
                                    <motion.button
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleDecline(transfer)}
                                      className="px-4 py-3 bg-muted rounded-xl"
                                    >
                                      <X className="h-4 w-4 text-muted-foreground" />
                                    </motion.button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {recentTransfers.filter(t => t.status !== 'pending').length > 0 && (
                      <div>
                        <h2 className="font-semibold mb-3">Recent Activity</h2>
                        <div className="space-y-2">
                          {recentTransfers.filter(t => t.status !== 'pending').map((transfer, i) => {
                            const isIncoming = transfer.to_user_id === currentUserId;
                            const isAccepted = transfer.status === 'accepted';
                            
                            return (
                              <motion.button
                                key={transfer.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => setSelectedTransfer(transfer)}
                                className="w-full bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4 text-left"
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center",
                                  isAccepted ? "bg-base/10" : "bg-muted"
                                )}>
                                  <DollarSign className={cn(
                                    "h-5 w-5",
                                    isAccepted ? "text-base" : "text-muted-foreground"
                                  )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {isIncoming ? `From @${transfer.from_user?.username || 'user'}` : `To @${transfer.to_user?.username || 'user'}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {transfer.status === 'accepted' ? 'Accepted' : 'Declined'} • {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <p className={cn(
                                  "font-semibold",
                                  isIncoming && isAccepted ? "text-primary" : "text-foreground"
                                )}>
                                  {isIncoming ? '+' : '-'}${transfer.amount.toFixed(2)}
                                </p>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSuccess={loadTransfers}
      />

      {/* Inline Compose Bar */}
      <InlineComposeBar onSuccess={loadTransfers} />

      <ComposeMessageModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSuccess={() => {
          loadTransfers();
          setShowComposeModal(false);
        }}
      />
    </div>
  );
}

function TransferDetailView({ 
  transfer, 
  currentUserId,
  onBack,
  onAccept,
  onDecline,
}: { 
  transfer: DemoTransfer; 
  currentUserId: string | null;
  onBack: () => void;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const isIncoming = transfer.to_user_id === currentUserId;
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
            transfer.status === 'accepted' ? "bg-primary" : 
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
            <span className="font-medium">@{transfer.from_user?.username || 'unknown'}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-muted-foreground">To</span>
            <span className="font-medium">@{transfer.to_user?.username || 'unknown'}</span>
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
              transfer.status === 'accepted' && "text-primary",
              transfer.status === 'declined' && "text-destructive"
            )}>
              {transfer.status}
            </span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">
              {new Date(transfer.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions for pending incoming transfers */}
        {isPending && isIncoming && (
          <div className="mt-6 space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              className="w-full py-4 bg-primary hover:bg-primary/90 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
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
