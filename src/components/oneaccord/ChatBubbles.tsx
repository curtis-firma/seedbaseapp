import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, CheckCheck, DollarSign, Clock, X, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { getConversationHistory, acceptTransfer, declineTransfer, type DemoTransfer } from '@/lib/supabase/transfersApi';
import { type DemoUser } from '@/lib/supabase/demoApi';
import { useRealtimeConversation } from '@/hooks/useRealtimeConversation';
import { useTypingIndicator, getConversationId } from '@/hooks/useTypingIndicator';
import { triggerHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { Confetti } from '@/components/shared/Confetti';

const SWIPE_THRESHOLD = 100; // pixels to trigger accept

interface ChatBubblesProps {
  currentUserId: string | null;
  currentUserAvatar?: string | null;
  currentUsername?: string | null;
  selectedUser: DemoUser | null;
  className?: string;
  onTypingChange?: (onKeystroke: () => void, stopTyping: () => void) => void;
}

// Helper to extract GIF URL from message
const extractGif = (purpose: string | null): string | null => {
  if (!purpose) return null;
  const match = purpose.match(/\[GIF\](https?:\/\/[^\s]+)/);
  return match ? match[1] : null;
};

// Helper to get message text without GIF URL
const getMessageText = (purpose: string | null): string | null => {
  if (!purpose) return null;
  return purpose.replace(/\[GIF\]https?:\/\/[^\s]+\s?/, '').trim() || null;
};

export interface ChatBubblesRef {
  refresh: () => void;
}

export const ChatBubbles = forwardRef<ChatBubblesRef, ChatBubblesProps>(
  ({ currentUserId, currentUserAvatar, currentUsername, selectedUser, className, onTypingChange }, ref) => {
    const [messages, setMessages] = useState<DemoTransfer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [swipingId, setSwipingId] = useState<string | null>(null);
    const [swipeProgress, setSwipeProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Typing indicator
    const conversationId = getConversationId(currentUserId, selectedUser?.id || null);
    const { typingUsers, onKeystroke, stopTyping } = useTypingIndicator({
      conversationId,
      currentUserId,
      currentUsername: currentUsername || null,
    });

    // Pass typing handlers to parent
    useEffect(() => {
      if (onTypingChange) {
        onTypingChange(onKeystroke, stopTyping);
      }
    }, [onTypingChange, onKeystroke, stopTyping]);

    const loadConversation = useCallback(async () => {
      if (!currentUserId || !selectedUser?.id) return;
      
      setIsLoading(true);
      try {
        const history = await getConversationHistory(currentUserId, selectedUser.id);
        setMessages(history);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setIsLoading(false);
      }
    }, [currentUserId, selectedUser?.id]);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: loadConversation
    }), [loadConversation]);

    useEffect(() => {
      if (currentUserId && selectedUser?.id) {
        loadConversation();
      } else {
        setMessages([]);
      }
    }, [currentUserId, selectedUser?.id, loadConversation]);

    // Auto-scroll to bottom when messages or typing users change
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages, typingUsers]);

    // Real-time conversation updates
    useRealtimeConversation({
      userId1: currentUserId,
      userId2: selectedUser?.id || null,
      onNewMessage: useCallback((transfer) => {
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m.id === transfer.id)) return prev;
          return [...prev, transfer];
        });
      }, []),
      onMessageUpdate: useCallback((transfer) => {
        setMessages(prev => 
          prev.map(msg => msg.id === transfer.id ? transfer : msg)
        );
      }, []),
    });

    const getStatusIcon = (status: string, isOutgoing: boolean) => {
      switch (status) {
        case 'accepted':
          // For outgoing accepted = "Seen/Received"
          return isOutgoing ? (
            <span className="flex items-center gap-1 text-[10px] text-green-400">
              <Eye className="h-3 w-3" />
              Seen
            </span>
          ) : (
            <CheckCheck className="h-3 w-3 text-green-400" />
          );
        case 'declined':
          return <span className="text-xs text-red-400">Declined</span>;
        case 'pending':
          return isOutgoing ? (
            <span className="flex items-center gap-1 text-[10px] text-yellow-400">
              <Clock className="h-3 w-3" />
              Pending
            </span>
          ) : (
            <Clock className="h-3 w-3 text-yellow-400" />
          );
        default:
          return <Check className="h-3 w-3 text-gray-400" />;
      }
    };

    // Handle swipe gesture on pending transfers
    const handleDrag = (msgId: string, info: PanInfo) => {
      if (info.offset.x > 0) {
        setSwipingId(msgId);
        setSwipeProgress(Math.min(info.offset.x / SWIPE_THRESHOLD, 1));
      }
    };

    const handleDragEnd = async (msg: DemoTransfer, info: PanInfo) => {
      if (info.offset.x >= SWIPE_THRESHOLD) {
        // Trigger accept
        triggerHaptic('success');
        await handleAccept(msg);
      }
      setSwipingId(null);
      setSwipeProgress(0);
    };

    const handleAccept = async (transfer: DemoTransfer) => {
      setAcceptingId(transfer.id);
      try {
        const updated = await acceptTransfer(transfer.id);
        if (updated) {
          setShowConfetti(true);
          triggerHaptic('success');
          toast.success(`Accepted $${transfer.amount} from @${selectedUser?.username || 'user'}`);
          
          // Update local state
          setMessages(prev => 
            prev.map(msg => msg.id === transfer.id ? { ...msg, status: 'accepted' as const } : msg)
          );
          
          setTimeout(() => {
            setShowConfetti(false);
            setAcceptingId(null);
          }, 1500);
        } else {
          toast.error('Failed to accept transfer');
          setAcceptingId(null);
        }
      } catch (err) {
        console.error('Accept error:', err);
        toast.error('Failed to accept transfer');
        setAcceptingId(null);
      }
    };

    const handleDecline = async (transfer: DemoTransfer) => {
      try {
        const updated = await declineTransfer(transfer.id);
        if (updated) {
          triggerHaptic('light');
          toast.success('Transfer declined');
          setMessages(prev => 
            prev.map(msg => msg.id === transfer.id ? { ...msg, status: 'declined' as const } : msg)
          );
        } else {
          toast.error('Failed to decline transfer');
        }
      } catch (err) {
        console.error('Decline error:', err);
        toast.error('Failed to decline transfer');
      }
    };

    if (!currentUserId || !selectedUser) {
      return null;
    }

    return (
      <>
        <Confetti isActive={showConfetti} />
        <div 
          ref={scrollRef}
          className={cn(
            "flex-1 overflow-y-auto px-4 py-4 space-y-3",
            className
          )}
        >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              {selectedUser.avatar_url ? (
                <img 
                  src={selectedUser.avatar_url} 
                  alt=""
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white/60">
                  {selectedUser.display_name?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">No messages yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Send a message or USDC to start the conversation
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isOutgoing = msg.from_user_id === currentUserId;
              const isIncoming = !isOutgoing;
              const isPending = msg.status === 'pending';
              const showDate = index === 0 || 
                new Date(msg.created_at).toDateString() !== 
                new Date(messages[index - 1].created_at).toDateString();

              return (
                <div key={msg.id}>
                  {/* Date separator */}
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                        {new Date(msg.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: new Date(msg.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>
                  )}

                  {/* Swipe-to-accept wrapper for pending incoming transfers */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    drag={isIncoming && isPending && msg.amount > 0 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={{ left: 0, right: 0.5 }}
                    onDrag={(_, info) => isIncoming && isPending && handleDrag(msg.id, info)}
                    onDragEnd={(_, info) => isIncoming && isPending && handleDragEnd(msg, info)}
                    className={cn(
                      "flex gap-2 relative",
                      isOutgoing ? "justify-end" : "justify-start"
                    )}
                    style={{
                      touchAction: isIncoming && isPending ? 'pan-y' : 'auto',
                    }}
                  >
                    {/* Swipe indicator background */}
                    {isIncoming && isPending && msg.amount > 0 && swipingId === msg.id && (
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ 
                          width: `${swipeProgress * 80}px`,
                          opacity: swipeProgress,
                        }}
                      >
                        <Check className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                    {/* Avatar for incoming messages */}
                    {!isOutgoing && (
                      <div className="w-8 h-8 rounded-full flex-shrink-0 mt-auto overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                        {selectedUser?.avatar_url ? (
                          <img 
                            src={selectedUser.avatar_url} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {selectedUser?.display_name?.[0]?.toUpperCase() || selectedUser?.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
                        isOutgoing
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white/10 text-white rounded-bl-md"
                      )}
                    >
                      {/* Amount badge for transfers */}
                      {msg.amount > 0 && (
                        <div className={cn(
                          "flex items-center gap-1.5 mb-1.5 pb-1.5 border-b",
                          isOutgoing ? "border-white/20" : "border-white/10"
                        )}>
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center",
                            msg.status === 'accepted' 
                              ? "bg-green-500" 
                              : msg.status === 'declined'
                              ? "bg-red-500/50"
                              : "bg-yellow-500"
                          )}>
                            <DollarSign className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="font-bold text-lg">
                            ${msg.amount.toLocaleString()}
                          </span>
                          <span className="text-xs opacity-70 ml-auto">
                            USDC
                          </span>
                        </div>
                      )}

                      {/* GIF display */}
                      {(() => {
                        const gifUrl = extractGif(msg.purpose);
                        const textContent = getMessageText(msg.purpose);
                        
                        return (
                          <>
                            {gifUrl && (
                              <img 
                                src={gifUrl} 
                                alt="GIF"
                                className="rounded-lg max-w-full mb-2"
                                loading="lazy"
                              />
                            )}
                            
                            {/* Message text (without GIF URL) */}
                            {textContent && (
                              <p className={cn(
                                "text-sm leading-relaxed",
                                isOutgoing ? "text-white" : "text-gray-100"
                              )}>
                                {textContent}
                              </p>
                            )}
                          </>
                        );
                      })()}

                      {/* Timestamp and status */}
                      <div className={cn(
                        "flex items-center gap-1.5 mt-1.5",
                        isOutgoing ? "justify-end" : "justify-start"
                      )}>
                        <span className="text-[10px] opacity-50">
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </span>
                        {isOutgoing && getStatusIcon(msg.status, isOutgoing)}
                      </div>

                      {/* Accept/Decline buttons for pending incoming transfers */}
                      {isIncoming && isPending && msg.amount > 0 && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                          {acceptingId === msg.id ? (
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: [1, 1.05, 1] }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium text-sm"
                            >
                              <Check className="h-4 w-4" />
                              Accepted! ✨
                            </motion.div>
                          ) : (
                            <>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAccept(msg)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 rounded-xl text-white font-medium text-sm shadow-lg"
                              >
                                <Check className="h-4 w-4" />
                                Accept
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDecline(msg)}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                              >
                                <X className="h-4 w-4 text-gray-400" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Avatar for outgoing messages */}
                    {isOutgoing && (
                      <div className="w-8 h-8 rounded-full flex-shrink-0 mt-auto overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                        {currentUserAvatar ? (
                          <img 
                            src={currentUserAvatar} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">You</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-start gap-2 justify-start"
              >
                {/* Partner avatar */}
                {selectedUser?.avatar_url ? (
                  <img 
                    src={selectedUser.avatar_url}
                    alt={selectedUser.display_name || selectedUser.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {selectedUser?.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                
                {/* Typing bubble */}
                <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        </div>
      </>
    );
  }
);

ChatBubbles.displayName = 'ChatBubbles';
