import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, X, DollarSign, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { type DemoUser } from '@/lib/supabase/demoApi';
import { 
  getPendingTransfers, 
  acceptTransfer, 
  declineTransfer,
  getTransfersForUser,
  createTransfer,
  type DemoTransfer 
} from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { SendModal } from '@/components/wallet/SendModal';
import { InlineComposeBar } from '@/components/oneaccord/InlineComposeBar';
import { useRealtimeTransfers } from '@/hooks/useRealtimeTransfers';
import { Confetti } from '@/components/shared/Confetti';
import { triggerHaptic } from '@/hooks/useHaptic';
import { AmplifyPromptModal } from '@/components/social/AmplifyPromptModal';
import { AmplifyButton } from '@/components/social/AmplifyButton';
import { oneAccordMessages } from '@/data/mockData';

// Type for demo narrative messages from mock data
interface DemoMessage {
  id: string;
  type: string;
  from: string;
  fromRole: string;
  avatar: string;
  title: string;
  body: string;
  amount?: number;
  status: string;
  hasAcceptButton: boolean;
  timestamp: Date;
  isRead: boolean;
}

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
  isDemo?: boolean;
  demoMessage?: DemoMessage;
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
  
  // Track dismissed demo messages (persisted to localStorage)
  const [dismissedDemoIds, setDismissedDemoIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('oneaccord-dismissed-demos');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  
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

  // Get demo messages as typed array
  const demoMessages = useMemo<DemoMessage[]>(() => {
    return oneAccordMessages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    })) as DemoMessage[];
  }, []);

  // Demo pending messages (narrative content with accept buttons) - excluding dismissed
  const demoPending = useMemo(() => {
    return demoMessages.filter(m => 
      m.hasAcceptButton && 
      m.status === 'pending' && 
      !dismissedDemoIds.has(m.id)
    );
  }, [demoMessages, dismissedDemoIds]);

  // Dismiss a demo message
  const dismissDemoMessage = (id: string) => {
    const newDismissed = new Set(dismissedDemoIds);
    newDismissed.add(id);
    setDismissedDemoIds(newDismissed);
    localStorage.setItem('oneaccord-dismissed-demos', JSON.stringify([...newDismissed]));
    triggerHaptic('light');
    toast.success('Demo message dismissed');
  };

  // Restore all demo messages
  const restoreDemoMessages = () => {
    setDismissedDemoIds(new Set());
    localStorage.removeItem('oneaccord-dismissed-demos');
    triggerHaptic('light');
    toast.success('Demo messages restored');
  };

  // Group transfers by conversation partner (inbox style)
  const conversations = useMemo(() => {
    if (!currentUserId) return [];
    
    const conversationMap = new Map<string, ConversationPreview>();
    
    // Add real transfers first
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

    // Add demo narrative threads (not pending ones - those go in Pending section)
    // Exclude dismissed demo messages
    demoMessages
      .filter(msg => 
        (!msg.hasAcceptButton || msg.status !== 'pending') && 
        !dismissedDemoIds.has(msg.id)
      )
      .forEach(msg => {
        const demoId = `demo-${msg.id}`;
        if (!conversationMap.has(demoId)) {
          conversationMap.set(demoId, {
            id: demoId,
            partnerId: demoId,
            partnerName: msg.from,
            partnerAvatar: msg.avatar.startsWith('http') ? msg.avatar : null,
            lastMessage: msg.title,
            lastMessageTime: msg.timestamp,
            lastAmount: msg.amount || 0,
            unreadCount: msg.isRead ? 0 : 1,
            hasPendingTransfer: false,
            transfers: [],
            isDemo: true,
            demoMessage: msg,
          });
        }
      });
    
    // Sort by most recent
    return Array.from(conversationMap.values())
      .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  }, [recentTransfers, currentUserId, demoMessages, dismissedDemoIds]);

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
          // Use the same InlineComposeBar with preselected user
          <InlineComposeBar
            key="thread"
            preselectedUser={{
              id: selectedConversation.partnerId,
              username: selectedConversation.partnerName,
              display_name: selectedConversation.partnerName,
              avatar_url: selectedConversation.partnerAvatar,
              phone: '',
              created_at: null,
              active_role: null,
              last_login_at: null,
              onboarding_complete: true
            } as DemoUser}
            onBack={() => setSelectedConversation(null)}
            onSuccess={loadTransfers}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
                {/* Pending Section - Real + Demo items requiring action */}
                {(pendingTransfers.length > 0 || demoPending.length > 0) && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="font-semibold text-gray-900">Pending</h2>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium">
                        {pendingTransfers.length + demoPending.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {/* Real pending transfers */}
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

                      {/* Demo pending messages with distinct styling */}
                      {demoPending.map((msg, i) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: (pendingTransfers.length + i) * 0.05 }}
                          className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-2xl border border-blue-200/50 p-4 shadow-sm relative"
                        >
                          {/* Dismiss button */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dismissDemoMessage(msg.id)}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
                          >
                            <X className="h-3.5 w-3.5 text-gray-400" />
                          </motion.button>

                          <div className="flex items-center gap-3 mb-3 pr-8">
                            {msg.avatar.startsWith('http') ? (
                              <img 
                                src={msg.avatar}
                                alt={msg.from}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-xl">
                                {msg.avatar}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{msg.from}</p>
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium flex items-center gap-0.5">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Demo
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            {msg.amount && (
                              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${msg.amount.toLocaleString()}
                              </p>
                            )}
                          </div>
                          
                          <p className="font-medium text-gray-800 mb-1">{msg.title}</p>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{msg.body}</p>
                          
                          <div className="mt-3 pt-3 border-t border-blue-200/30">
                            <p className="text-xs text-gray-500 text-center">
                              This is example content to show how distributions appear
                            </p>
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
                      <motion.div
                        key={convo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: i * 0.03 }}
                        className="relative"
                      >
                        <motion.button
                          onClick={() => {
                            if (!convo.isDemo) {
                              setSelectedConversation(convo);
                            } else {
                              toast.info('This is demo content showing how messages appear');
                            }
                          }}
                          className={cn(
                            "w-full rounded-xl border p-4 flex items-center gap-3 text-left transition-colors",
                            convo.isDemo 
                              ? "bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-100 hover:from-blue-50 hover:to-purple-50 pr-12"
                              : convo.hasPendingTransfer 
                                ? "bg-white border-blue-200 ring-1 ring-blue-100 hover:bg-blue-50" 
                                : "bg-white border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          {/* Avatar */}
                          {convo.isDemo && convo.demoMessage ? (
                            convo.demoMessage.avatar.startsWith('http') ? (
                              <img 
                                src={convo.demoMessage.avatar}
                                alt={convo.partnerName}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-2xl">
                                {convo.demoMessage.avatar}
                              </div>
                            )
                          ) : convo.partnerAvatar ? (
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
                                {convo.isDemo ? convo.partnerName : `@${convo.partnerName}`}
                              </p>
                              {convo.isDemo && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium flex items-center gap-0.5 flex-shrink-0">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Demo
                                </span>
                              )}
                              {convo.hasPendingTransfer && !convo.isDemo && (
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
                            {convo.unreadCount > 0 && !convo.isDemo && (
                              <span className="min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium flex items-center justify-center">
                                {convo.unreadCount}
                              </span>
                            )}
                            {!convo.isDemo && (
                              <ChevronRight className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                        </motion.button>

                        {/* Dismiss button for demo items */}
                        {convo.isDemo && convo.demoMessage && (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissDemoMessage(convo.demoMessage!.id);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors z-10"
                          >
                            <X className="h-3.5 w-3.5 text-gray-400" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))
                  )}

                  {/* Restore demo messages option */}
                  {dismissedDemoIds.size > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={restoreDemoMessages}
                      className="w-full py-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Restore {dismissedDemoIds.size} hidden demo message{dismissedDemoIds.size > 1 ? 's' : ''}
                    </motion.button>
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
