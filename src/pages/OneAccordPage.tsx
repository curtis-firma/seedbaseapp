import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, X, DollarSign, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  getPendingTransfers, 
  acceptTransfer, 
  declineTransfer,
  getTransfersForUser,
  createTransfer,
  type DemoTransfer 
} from '@/lib/supabase/transfersApi';
import { getWalletByUserId } from '@/lib/supabase/demoApi';
import { toast } from 'sonner';
import { SendModal } from '@/components/wallet/SendModal';
import { InlineComposeBar } from '@/components/oneaccord/InlineComposeBar';
import { useRealtimeTransfers } from '@/hooks/useRealtimeTransfers';
import { Confetti } from '@/components/shared/Confetti';
import { triggerHaptic } from '@/hooks/useHaptic';
import { AmplifyPromptModal } from '@/components/social/AmplifyPromptModal';
import { AmplifyButton } from '@/components/social/AmplifyButton';

// Conversation preview for inbox-style grouping
interface ConversationPreview {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  lastAmount: number;
  unreadCount: number;
  hasPendingTransfer: boolean;
  pendingAmount?: number;
  transfers: DemoTransfer[];
}

export default function OneAccordPage() {
  const [pendingTransfers, setPendingTransfers] = useState<DemoTransfer[]>([]);
  const [recentTransfers, setRecentTransfers] = useState<DemoTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [acceptedTransferId, setAcceptedTransferId] = useState<string | null>(null);
  const [showAmplifyPrompt, setShowAmplifyPrompt] = useState(false);
  const [amplifyContent, setAmplifyContent] = useState('');
  const [amplifySummary, setAmplifySummary] = useState('');
  
  // Track which conversation is open
  const [selectedConversation, setSelectedConversation] = useState<ConversationPreview | null>(null);
  // Track which transfer detail is open
  const [selectedTransfer, setSelectedTransfer] = useState<DemoTransfer | null>(null);
  
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

  const currentUserId = getCurrentUserId();

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
        getTransfersForUser(userId, 50)
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

  // Group transfers by conversation partner (inbox style)
  const conversations = useMemo(() => {
    if (!currentUserId) return [];
    
    const conversationMap = new Map<string, ConversationPreview>();
    
    recentTransfers.forEach(transfer => {
      const isIncoming = transfer.to_user_id === currentUserId;
      const partnerId = isIncoming ? transfer.from_user_id : transfer.to_user_id;
      
      if (!partnerId) return;
      
      const existingConvo = conversationMap.get(partnerId);
      const transferTime = new Date(transfer.created_at);
      
      // Build message preview
      const gifMatch = transfer.purpose?.match(/\[GIF\](https?:\/\/[^\s]+)/);
      const messageText = transfer.purpose?.replace(/\[GIF\]https?:\/\/[^\s]+/g, '').trim();
      const preview = gifMatch ? '📷 GIF' : messageText || `$${transfer.amount.toFixed(2)} USDC`;
      
      // Check if pending incoming transfer
      const isPendingIncoming = transfer.status === 'pending' && isIncoming;
      
      if (!existingConvo) {
        const partner = isIncoming ? transfer.from_user : transfer.to_user;
        conversationMap.set(partnerId, {
          id: partnerId,
          partnerId,
          partnerName: partner?.display_name || partner?.username || 'Unknown',
          partnerAvatar: partner?.avatar_url || null,
          lastMessage: preview,
          lastMessageTime: transferTime,
          lastAmount: transfer.amount,
          unreadCount: isPendingIncoming ? 1 : 0,
          hasPendingTransfer: isPendingIncoming,
          pendingAmount: isPendingIncoming ? transfer.amount : undefined,
          transfers: [transfer],
        });
      } else {
        // Update existing conversation
        existingConvo.transfers.push(transfer);
        
        // Update if this is newer
        if (transferTime > existingConvo.lastMessageTime) {
          existingConvo.lastMessage = preview;
          existingConvo.lastMessageTime = transferTime;
          existingConvo.lastAmount = transfer.amount;
        }
        
        // Track pending status
        if (isPendingIncoming) {
          existingConvo.unreadCount++;
          existingConvo.hasPendingTransfer = true;
          existingConvo.pendingAmount = (existingConvo.pendingAmount || 0) + transfer.amount;
        }
      }
    });
    
    // Sort by most recent
    return Array.from(conversationMap.values())
      .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  }, [recentTransfers, currentUserId]);

  const handleAccept = async (transfer: DemoTransfer, e?: React.MouseEvent) => {
    // Prevent event bubbling to parent elements
    e?.stopPropagation();
    e?.preventDefault();
    
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

  const handleDecline = async (transfer: DemoTransfer, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    const updated = await declineTransfer(transfer.id);
    if (updated) {
      triggerHaptic('light');
      toast.success('Transfer declined');
      loadTransfers();
    } else {
      toast.error('Failed to decline transfer');
    }
  };

  // Main view with inbox-style list
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
            onAccept={(e) => {
              handleAccept(selectedTransfer, e);
              setSelectedTransfer(null);
            }}
            onDecline={(e) => {
              handleDecline(selectedTransfer, e);
              setSelectedTransfer(null);
            }}
          />
        ) : selectedConversation ? (
          <ConversationThreadView
            key="thread"
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onBack={() => setSelectedConversation(null)}
            onAccept={handleAccept}
            onDecline={handleDecline}
            acceptedTransferId={acceptedTransferId}
            onMessageSent={loadTransfers}
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

            {/* Scrollable Content */}
            {isLoading ? (
              <div className="px-4 py-12 text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-2 pb-48">
                {/* Pending Section - Individual items requiring action */}
                {pendingTransfers.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="font-semibold text-gray-900">Pending</h2>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium">
                        {pendingTransfers.length}
                      </span>
                    </div>
                    <div className="space-y-3">
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
                          
                          {transfer.purpose && !transfer.purpose.startsWith('[GIF]') && (
                            <p className="text-sm text-gray-600 mb-3">"{transfer.purpose}"</p>
                          )}
                          
                          {/* GIF display */}
                          {(() => {
                            const gifMatch = transfer.purpose?.match(/\[GIF\](https?:\/\/[^\s]+)/);
                            if (gifMatch) {
                              return (
                                <div className="mb-3 rounded-lg overflow-hidden max-w-[200px]">
                                  <img src={gifMatch[1]} alt="GIF" className="w-full h-auto" />
                                </div>
                              );
                            }
                            return null;
                          })()}
                          
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
                                  onClick={(e) => handleAccept(transfer, e)}
                                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-xl text-white font-medium shadow-lg"
                                >
                                  <Check className="h-4 w-4" />
                                  Accept
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => handleDecline(transfer, e)}
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

                {/* All Messages - Inbox Style (grouped by conversation partner) */}
                <h2 className="font-semibold mb-3 text-gray-900">All Messages</h2>
                <div className="space-y-2">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Send USDC to start a conversation</p>
                    </div>
                  ) : (
                    conversations.map((convo, i) => (
                      <motion.button
                        key={convo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedConversation(convo)}
                        className={cn(
                          "w-full bg-white rounded-xl border p-4 flex items-center gap-3 text-left transition-colors",
                          convo.hasPendingTransfer 
                            ? "border-blue-200 ring-1 ring-blue-100 hover:bg-blue-50" 
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {/* Avatar */}
                        {convo.partnerAvatar ? (
                          <img 
                            src={convo.partnerAvatar}
                            alt={convo.partnerName}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-lg">
                              {convo.partnerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={cn(
                              "font-semibold truncate",
                              convo.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
                            )}>
                              @{convo.partnerName}
                            </p>
                            {convo.hasPendingTransfer && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium flex-shrink-0">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className={cn(
                            "text-sm truncate",
                            convo.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                          )}>
                            {convo.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDistanceToNow(convo.lastMessageTime, { addSuffix: true })}
                          </p>
                        </div>
                        
                        {/* Right side: unread count or chevron */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {convo.unreadCount > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium flex items-center justify-center">
                              {convo.unreadCount}
                            </span>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-300" />
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
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

      <AmplifyPromptModal
        isOpen={showAmplifyPrompt}
        onClose={() => setShowAmplifyPrompt(false)}
        impactSummary={amplifySummary}
        content={amplifyContent}
      />
    </div>
  );
}

// Conversation Thread View - shows all messages between you and one person
function ConversationThreadView({
  conversation,
  currentUserId,
  onBack,
  onAccept,
  onDecline,
  acceptedTransferId,
  onMessageSent,
}: {
  conversation: ConversationPreview;
  currentUserId: string | null;
  onBack: () => void;
  onAccept: (transfer: DemoTransfer, e?: React.MouseEvent) => void;
  onDecline: (transfer: DemoTransfer, e?: React.MouseEvent) => void;
  acceptedTransferId: string | null;
  onMessageSent: () => void;
}) {
  const [messageText, setMessageText] = useState('');
  const [amount, setAmount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [balance, setBalance] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sort transfers chronologically (oldest first for chat-like view)
  const sortedTransfers = useMemo(() => {
    return [...conversation.transfers].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [conversation.transfers]);

  // Load user balance
  useEffect(() => {
    const loadBalance = async () => {
      if (!currentUserId) return;
      const wallet = await getWalletByUserId(currentUserId);
      if (wallet) setBalance(wallet.balance);
    };
    loadBalance();
  }, [currentUserId]);

  // Scroll to bottom on load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sortedTransfers]);

  const handleSend = async () => {
    if (!currentUserId || !conversation.partnerId) return;
    if (!messageText.trim() && amount === 0) {
      toast.error('Enter a message or amount');
      return;
    }
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSending(true);
    try {
      const transferAmount = amount > 0 ? amount : 0.01; // Minimum amount for message-only
      await createTransfer(currentUserId, conversation.partnerId, transferAmount, messageText.trim() || undefined);
      triggerHaptic('success');
      toast.success('Message sent!');
      setMessageText('');
      setAmount(0);
      onMessageSent();
    } catch (err) {
      console.error('Failed to send:', err);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
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
          {conversation.partnerAvatar ? (
            <img 
              src={conversation.partnerAvatar}
              alt={conversation.partnerName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {conversation.partnerName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="font-semibold text-gray-900">@{conversation.partnerName}</h1>
            <p className="text-xs text-gray-500">{conversation.transfers.length} messages</p>
          </div>
        </div>
      </header>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-48 space-y-4">
        {sortedTransfers.map((transfer) => {
          const isIncoming = transfer.to_user_id === currentUserId;
          const isPending = transfer.status === 'pending';
          const isAccepted = transfer.status === 'accepted';
          
          // Extract GIF and message
          const gifMatch = transfer.purpose?.match(/\[GIF\](https?:\/\/[^\s]+)/);
          const gifUrl = gifMatch ? gifMatch[1] : null;
          const messageText = transfer.purpose?.replace(/\[GIF\]https?:\/\/[^\s]+/g, '').trim();
          
          return (
            <div
              key={transfer.id}
              className={cn(
                "flex",
                isIncoming ? "justify-start" : "justify-end"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl p-4",
                isIncoming 
                  ? "bg-white border border-gray-200" 
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              )}>
                {/* Amount badge */}
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold mb-2",
                  isIncoming
                    ? "bg-blue-50 text-blue-700"
                    : "bg-white/20 text-white"
                )}>
                  <DollarSign className="h-3.5 w-3.5" />
                  {transfer.amount.toFixed(2)} USDC
                </div>
                
                {/* Message text */}
                {messageText && (
                  <p className={cn(
                    "text-sm",
                    isIncoming ? "text-gray-700" : "text-white/90"
                  )}>
                    {messageText}
                  </p>
                )}
                
                {/* GIF */}
                {gifUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    <img src={gifUrl} alt="GIF" className="max-w-full h-auto" />
                  </div>
                )}
                
                {/* Status & time */}
                <div className={cn(
                  "flex items-center gap-2 mt-2 text-xs",
                  isIncoming ? "text-gray-400" : "text-white/60"
                )}>
                  <span>{formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}</span>
                  {isAccepted && (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {isIncoming ? 'Received' : 'Sent'}
                    </span>
                  )}
                  {transfer.status === 'declined' && (
                    <span className="text-red-400">Declined</span>
                  )}
                </div>
                
                {/* Accept/Decline buttons for pending incoming */}
                {isPending && isIncoming && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    {acceptedTransferId === transfer.id ? (
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium"
                      >
                        <Check className="h-5 w-5" />
                        Accepted! ✨
                      </motion.div>
                    ) : (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => onAccept(transfer, e)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Check className="h-4 w-4" />
                          Accept
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => onDecline(transfer, e)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </motion.button>
                      </>
                    )}
                  </div>
                )}
                
                {/* Amplify button for accepted */}
                {isAccepted && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <AmplifyButton
                      variant="inline"
                      content={`${isIncoming ? 'Received' : 'Sent'} $${transfer.amount.toFixed(2)} USDC ${isIncoming ? 'from' : 'to'} @${conversation.partnerName}! 🙏\n\nTransparency in action through @Seedbase.`}
                      impactSummary={`${isIncoming ? 'Received' : 'Sent'} $${transfer.amount.toFixed(2)} USDC`}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 safe-area-bottom z-40">
        <div className="flex items-center gap-3">
          {/* Amount toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setAmount(prev => prev === 0 ? 5 : 0)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-xl font-medium transition-colors",
              amount > 0
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <DollarSign className="h-4 w-4" />
            {amount > 0 ? amount : ''}
          </motion.button>
          
          {/* Amount presets when active */}
          {amount > 0 && (
            <div className="flex gap-1">
              {[5, 10, 25].map((preset) => (
                <motion.button
                  key={preset}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(preset)}
                  className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    amount === preset
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  ${preset}
                </motion.button>
              ))}
            </div>
          )}

          {/* Message input */}
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Send button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isSending || (!messageText.trim() && amount === 0)}
            className={cn(
              "p-3 rounded-xl transition-colors",
              messageText.trim() || amount > 0
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-gray-100 text-gray-400"
            )}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Balance indicator */}
        {amount > 0 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Balance: ${balance.toFixed(2)} USDC
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Transfer Detail View
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
  onAccept: (e?: React.MouseEvent) => void;
  onDecline: (e?: React.MouseEvent) => void;
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
              onClick={(e) => onAccept(e)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="h-5 w-5" />
              Accept Transfer
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={(e) => onDecline(e)}
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
