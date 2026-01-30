import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/hooks/useHaptic';
import { formatDistanceToNow } from 'date-fns';

interface Reply {
  id: string;
  body: string;
  author: string;
  authorAvatar?: string;
  timestamp: Date;
}

interface MessageThreadProps {
  messageId: string;
  originalMessage: {
    from: string;
    avatar?: string;
    body: string;
    timestamp: Date;
  };
  className?: string;
}

export function MessageThread({ messageId, originalMessage, className }: MessageThreadProps) {
  const [replies, setReplies] = useState<Reply[]>(() => {
    const saved = localStorage.getItem(`thread-${messageId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((r: Reply) => ({ ...r, timestamp: new Date(r.timestamp) }));
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    triggerHaptic('light');

    const newReply: Reply = {
      id: crypto.randomUUID(),
      body: replyText.trim(),
      author: 'You',
      timestamp: new Date(),
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    localStorage.setItem(`thread-${messageId}`, JSON.stringify(updatedReplies));
    setReplyText('');
  };

  return (
    <>
      {/* Reply Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          triggerHaptic('light');
        }}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors",
          className
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {replies.length > 0 && (
          <span className="font-medium">{replies.length}</span>
        )}
        <span className="hidden sm:inline">Reply</span>
      </button>

      {/* Thread Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="font-semibold text-lg">Thread</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Original Message */}
              <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  {originalMessage.avatar?.startsWith('http') ? (
                    <img 
                      src={originalMessage.avatar}
                      alt={originalMessage.from}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {originalMessage.from[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{originalMessage.from}</p>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(originalMessage.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{originalMessage.body}</p>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {replies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No replies yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {reply.author[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 text-sm">{reply.author}</p>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.body}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Reply Input */}
              <div className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white">
                <input
                  ref={inputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder="Reply to this thread..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 placeholder:text-gray-400"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    replyText.trim()
                      ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  )}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
