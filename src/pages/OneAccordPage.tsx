import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, X, DollarSign, Inbox, RefreshCw, Vote, FileText, Bell, Sprout, Megaphone } from 'lucide-react';
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
import { SwipeableMessageCard } from '@/components/oneaccord/SwipeableMessageCard';
import { useRealtimeTransfers } from '@/hooks/useRealtimeTransfers';
import { oneAccordMessages } from '@/data/mockData';
import { Confetti } from '@/components/shared/Confetti';
import { triggerHaptic } from '@/hooks/useHaptic';
import { AmplifyPromptModal } from '@/components/social/AmplifyPromptModal';
import { AmplifyButton } from '@/components/social/AmplifyButton';
import { MessageReactions } from '@/components/oneaccord/MessageReactions';
import { MessageThread } from '@/components/oneaccord/MessageThread';
import seedbasePfp from '@/assets/seedbase-pfp.png';

// Message type icons and styles - Fun colorful design
const messageTypeConfig: Record<string, { icon: typeof DollarSign; gradient: string; bgColor: string }> = {
  distribution: { icon: DollarSign, gradient: 'bg-gradient-to-br from-blue-500 to-purple-600', bgColor: 'bg-blue-100' },
  transfer: { icon: Send, gradient: 'bg-gradient-to-br from-blue-500 to-purple-600', bgColor: 'bg-blue-100' },
  harvest: { icon: FileText, gradient: 'bg-gradient-to-br from-orange-500 to-red-500', bgColor: 'bg-orange-100' },
  governance: { icon: Vote, gradient: 'bg-gradient-to-br from-purple-500 to-pink-500', bgColor: 'bg-purple-100' },
  milestone: { icon: Sprout, gradient: 'bg-gradient-to-br from-green-500 to-teal-500', bgColor: 'bg-green-100' },
  system: { icon: Bell, gradient: 'bg-gradient-to-br from-gray-500 to-gray-600', bgColor: 'bg-gray-100' },
  update: { icon: FileText, gradient: 'bg-gradient-to-br from-orange-500 to-red-500', bgColor: 'bg-orange-100' },
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
  const [showAmplifyPrompt, setShowAmplifyPrompt] = useState(false);
  const [amplifyContent, setAmplifyContent] = useState('');
  const [amplifySummary, setAmplifySummary] = useState('');
  const [acceptedDemoIds, setAcceptedDemoIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('seedbase-accepted-demo-ids');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const navigate = useNavigate();

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
      setAcceptedTransferId(transfer.id);
      setShowConfetti(true);
      triggerHaptic('success');
      
      toast.success(`Accepted $${transfer.amount} from @${transfer.from_user?.username || 'user'}`);
      
      setTimeout(() => {
        setShowConfetti(false);
        setAcceptedTransferId(null);
        loadTransfers();
        
        setAmplifyContent(`Just accepted $${transfer.amount} USDC from @${transfer.from_user?.username || 'user'}! 🙏\n\nGenerosity in motion through @Seedbase.`);
        setAmplifySummary(`You accepted $${transfer.amount} USDC from ${transfer.from_user?.display_name || transfer.from_user?.username || 'a supporter'}`);
        setShowAmplifyPrompt(true);
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

  const handleDemoAccept = (messageId: string, message?: { from: string; amount?: number; title?: string }) => {
    const newAcceptedIds = new Set(acceptedDemoIds);
    newAcceptedIds.add(messageId);
    setAcceptedDemoIds(newAcceptedIds);
    localStorage.setItem('seedbase-accepted-demo-ids', JSON.stringify([...newAcceptedIds]));
    
    setShowConfetti(true);
    triggerHaptic('success');
    toast.success('Transfer accepted! Funds added to your wallet.');
    
    setTimeout(() => {
      setShowConfetti(false);
      
      if (message) {
        const amount = message.amount || 0;
        setAmplifyContent(`${message.title || `Received $${amount} USDC`} from ${message.from}! 🙏\n\nTransparency and trust in action through @Seedbase.`);
        setAmplifySummary(`${message.title || `You accepted $${amount} USDC`} from ${message.from}`);
        setShowAmplifyPrompt(true);
      }
    }, 2000);
  };

  const currentUserId = getCurrentUserId();

  // Light mode design - clean and fun like Telegram
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
            className="flex flex-col min-h-screen"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white shadow-sm">
              <header className="bg-white border-b border-gray-200">
                <div className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      OneAccord
                      <span className="text-lg">💬</span>
                    </h1>
                    <p className="text-sm text-gray-500">Messages & Transfers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={loadTransfers}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </header>

              {/* Info Banner */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">✨ All transfers arrive here.</span> Accept USDC transfers to move them to your wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Messages */}
            {isLoading ? (
              <div className="px-4 py-12 text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-2 pb-48">
                {/* Pending Section - items requiring acceptance */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="font-semibold text-gray-900">Pending</h2>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium">
                      {oneAccordMessages.filter(m => m.hasAcceptButton && m.status === 'pending' && !acceptedDemoIds.has(m.id)).length + pendingTransfers.length}
                    </span>
                  </div>
                  <div className="space-y-3">
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
                            "bg-white rounded-2xl border shadow-sm p-4",
                            !message.isRead ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-200"
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
                                <p className="font-semibold text-gray-900">{message.from}</p>
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase",
                                  config.bgColor,
                                  "text-gray-700"
                                )}>
                                  {message.fromRole}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            {message.amount && (
                              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${message.amount.toLocaleString()}
                              </p>
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <p className="font-medium text-gray-900">{message.title}</p>
                            <p className="text-sm text-gray-600 whitespace-pre-line">{message.body}</p>
                          </div>
                          
                          {/* Reactions & Reply */}
                          <div className="flex items-center gap-4 mb-3">
                            <MessageReactions messageId={message.id} />
                            <MessageThread
                              messageId={message.id}
                              originalMessage={{
                                from: message.from,
                                avatar: message.avatar,
                                body: message.body,
                                timestamp: message.timestamp,
                              }}
                            />
                          </div>
                          
                          {message.hasAcceptButton && (
                            <div className="flex gap-2">
                              {acceptedDemoIds.has(message.id) ? (
                                <div className="flex gap-2 w-full">
                                  <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium cursor-not-allowed"
                                  >
                                    <Check className="h-5 w-5" />
                                    Accepted ✨
                                  </motion.div>
                                  <AmplifyButton
                                    variant="small"
                                    content={`${message.title} from ${message.from}! 🙏\n\nTransparency in action through @Seedbase.`}
                                    impactSummary={message.title}
                                  />
                                </div>
                              ) : (
                                <>
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDemoAccept(message.id, { from: message.from, amount: message.amount, title: message.title })}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                                  >
                                    <Check className="h-4 w-4" />
                                    Accept
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
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

                {/* All Messages - shows everything */}
                <h2 className="font-semibold mb-3 text-gray-900">All Messages</h2>
                <div className="space-y-2">
                  {oneAccordMessages.map((message, i) => {
                    const config = messageTypeConfig[message.type] || messageTypeConfig.system;
                    const IconComponent = config.icon;
                    const isAmplifiable = ['distribution', 'harvest'].includes(message.type) || message.status === 'accepted' || acceptedDemoIds.has(message.id);
                    const isPendingWithAccept = message.hasAcceptButton && message.status === 'pending' && !acceptedDemoIds.has(message.id);
                    const wasAccepted = acceptedDemoIds.has(message.id);
                    
                    return (
                      <SwipeableMessageCard
                        key={message.id}
                        isPending={isPendingWithAccept}
                        onAccept={() => handleDemoAccept(message.id, { from: message.from, amount: message.amount, title: message.title })}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={cn(
                            "bg-white rounded-xl border p-4",
                            isPendingWithAccept ? "border-blue-200 ring-1 ring-blue-100" :
                            !message.isRead ? "border-blue-200" : "border-gray-200"
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
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.gradient)}>
                                {message.avatar.length <= 2 ? (
                                  <span className="text-lg">{message.avatar}</span>
                                ) : (
                                  <IconComponent className="h-5 w-5 text-white" />
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate text-gray-900">{message.from}</p>
                                {wasAccepted && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                                    Accepted ✓
                                  </span>
                                )}
                                {!wasAccepted && message.status === 'accepted' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                                    Accepted ✓
                                  </span>
                                )}
                                {message.status === 'review' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">
                                    In Review
                                  </span>
                                )}
                                {isPendingWithAccept && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-sm text-gray-900">{message.title}</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{message.body}</p>
                              
                              {/* Reactions & Reply */}
                              <div className="flex items-center gap-4 mt-2">
                                <MessageReactions messageId={`all-${message.id}`} />
                                <MessageThread
                                  messageId={`all-${message.id}`}
                                  originalMessage={{
                                    from: message.from,
                                    avatar: message.avatar,
                                    body: message.body,
                                    timestamp: message.timestamp,
                                  }}
                                />
                              </div>
                              
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                              </p>
                              
                              {/* Accept/Decline buttons for pending items */}
                              {isPendingWithAccept && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDemoAccept(message.id, { from: message.from, amount: message.amount, title: message.title })}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <Check className="h-4 w-4" />
                                    Accept
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </motion.button>
                                </div>
                              )}
                              
                              {isAmplifiable && !isPendingWithAccept && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <AmplifyButton
                                    variant="inline"
                                    content={`${message.title} from ${message.from}! 🙏\n\nTransparency in action through @Seedbase.`}
                                    impactSummary={message.title}
                                  />
                                </div>
                              )}
                            </div>
                            {message.amount && (
                              <p className={cn(
                                "font-semibold text-lg",
                                wasAccepted || message.status === 'accepted' ? "text-green-600" : 
                                isPendingWithAccept ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : 
                                "text-gray-900"
                              )}>
                                ${message.amount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </SwipeableMessageCard>
                    );
                  })}
                </div>

                {/* Real Transfers Section */}
                {(pendingTransfers.length > 0 || recentTransfers.length > 0) && (
                  <>
                    <div className="my-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-xs font-medium text-gray-500">YOUR TRANSFERS</span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {pendingTransfers.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <h2 className="font-semibold text-gray-900">Pending Transfers</h2>
                          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium">
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
                              className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 p-4 shadow-sm"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                {transfer.from_user?.avatar_url ? (
                                  <img 
                                    src={transfer.from_user.avatar_url}
                                    alt={transfer.from_user.display_name || transfer.from_user.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-white" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">@{transfer.from_user?.username || 'unknown'}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  ${transfer.amount.toFixed(2)}
                                </p>
                              </div>
                              
                              {transfer.purpose && (
                                <p className="text-sm text-gray-600 mb-3">"{transfer.purpose}"</p>
                              )}
                              
                              <div className="flex gap-2">
                                {acceptedTransferId === transfer.id ? (
                                  <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
                                  >
                                    <Check className="h-5 w-5" />
                                    Accepted! ✨
                                  </motion.div>
                                ) : (
                                  <>
                                    <motion.button
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleAccept(transfer)}
                                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-xl text-white font-medium shadow-lg"
                                    >
                                      <Check className="h-4 w-4" />
                                      Accept
                                    </motion.button>
                                    <motion.button
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleDecline(transfer)}
                                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                      <X className="h-4 w-4 text-gray-500" />
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
                        <h2 className="font-semibold mb-3 text-gray-900">Recent Activity</h2>
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
                                className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center",
                                  isAccepted ? "bg-green-100" : "bg-gray-100"
                                )}>
                                  <DollarSign className={cn(
                                    "h-5 w-5",
                                    isAccepted ? "text-green-600" : "text-gray-400"
                                  )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate text-gray-900">
                                    {isIncoming ? `From @${transfer.from_user?.username || 'user'}` : `To @${transfer.to_user?.username || 'user'}`}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {transfer.status === 'accepted' ? 'Accepted ✓' : 'Declined'} • {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <p className={cn(
                                  "font-semibold",
                                  isIncoming && isAccepted ? "text-green-600" : "text-gray-900"
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

      <InlineComposeBar onSuccess={loadTransfers} />

      <ComposeMessageModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSuccess={() => {
          loadTransfers();
          setShowComposeModal(false);
        }}
      />
      
      <AmplifyPromptModal
        isOpen={showAmplifyPrompt}
        onClose={() => setShowAmplifyPrompt(false)}
        impactSummary={amplifySummary}
        content={amplifyContent}
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
      className="flex flex-col min-h-screen bg-gray-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </motion.button>
          <div>
            <h1 className="font-semibold text-gray-900">Transfer Details</h1>
            <p className="text-xs text-gray-500 capitalize">{transfer.status}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="text-center mb-8">
          <div className={cn(
            "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
            transfer.status === 'accepted' ? "bg-gradient-to-br from-green-400 to-emerald-500" : 
            transfer.status === 'declined' ? "bg-gray-200" : "bg-gradient-to-br from-blue-500 to-purple-600"
          )}>
            <DollarSign className={cn(
              "h-8 w-8",
              transfer.status === 'declined' ? "text-gray-400" : "text-white"
            )} />
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {isIncoming ? '+' : '-'}${transfer.amount.toFixed(2)}
          </p>
          <p className="text-gray-500">USDC</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
          <div className="p-4 flex justify-between">
            <span className="text-gray-500">From</span>
            <span className="font-medium text-gray-900">@{transfer.from_user?.username || 'unknown'}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-500">To</span>
            <span className="font-medium text-gray-900">@{transfer.to_user?.username || 'unknown'}</span>
          </div>
          {transfer.purpose && (
            <div className="p-4 flex justify-between">
              <span className="text-gray-500">Purpose</span>
              <span className="font-medium text-gray-900">{transfer.purpose}</span>
            </div>
          )}
          <div className="p-4 flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className={cn(
              "font-medium capitalize",
              transfer.status === 'accepted' && "text-green-600",
              transfer.status === 'declined' && "text-red-500"
            )}>
              {transfer.status}
            </span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-900">
              {new Date(transfer.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isPending && isIncoming && (
          <div className="mt-6 space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="h-5 w-5" />
              Accept Transfer
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onDecline}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold flex items-center justify-center gap-2 text-gray-700"
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
