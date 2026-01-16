import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, X, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockConversations, mockMessages } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function OneAccordPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedConvo = mockConversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {selectedConversation ? (
          <ConversationView
            key="conversation"
            conversation={selectedConvo!}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <ConversationList
            key="list"
            conversations={mockConversations}
            onSelect={setSelectedConversation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConversationList({ 
  conversations, 
  onSelect 
}: { 
  conversations: typeof mockConversations; 
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold">OneAccord</h1>
          <p className="text-sm text-muted-foreground">Messages & Transfers</p>
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

      {/* Conversation List */}
      <div className="px-4 py-2">
        <div className="space-y-2">
          {conversations.map((convo, i) => (
            <motion.button
              key={convo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(convo.id)}
              className="w-full bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors"
            >
              {convo.participantAvatar.startsWith('http') ? (
                <img
                  src={convo.participantAvatar}
                  alt={convo.participantName}
                  className="w-12 h-12 rounded-full bg-muted"
                />
              ) : (
                <div className="w-12 h-12 rounded-full gradient-base flex items-center justify-center text-xl">
                  {convo.participantAvatar}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold truncate">{convo.participantName}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(convo.lastMessageTime, { addSuffix: false })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {convo.hasTransfer && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-seed/10 flex items-center justify-center">
                      <DollarSign className="h-3 w-3 text-seed" />
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
              </div>
              {convo.unreadCount > 0 && (
                <span className="w-6 h-6 rounded-full gradient-base text-white text-xs font-bold flex items-center justify-center">
                  {convo.unreadCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ConversationView({ 
  conversation, 
  onBack 
}: { 
  conversation: typeof mockConversations[0]; 
  onBack: () => void;
}) {
  const [message, setMessage] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen"
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
          {conversation.participantAvatar.startsWith('http') ? (
            <img
              src={conversation.participantAvatar}
              alt={conversation.participantName}
              className="w-10 h-10 rounded-full bg-muted"
            />
          ) : (
            <div className="w-10 h-10 rounded-full gradient-base flex items-center justify-center text-lg">
              {conversation.participantAvatar}
            </div>
          )}
          <div>
            <h1 className="font-semibold">{conversation.participantName}</h1>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {mockMessages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "max-w-[85%]",
              msg.senderId === 'user-1' ? "ml-auto" : "mr-auto"
            )}
          >
            {msg.isTransfer && msg.transfer ? (
              <div className="bg-card rounded-2xl border border-seed/30 p-4 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full gradient-seed flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-seed">Transfer</span>
                </div>
                <p className="text-2xl font-bold mb-1">${msg.transfer.amount} USDC</p>
                <p className="text-sm text-muted-foreground mb-4">{msg.transfer.purpose}</p>
                
                {msg.transfer.status === 'pending' && (
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 gradient-seed rounded-xl text-white font-medium"
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
                  </div>
                )}
                
                {msg.transfer.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-seed">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Accepted</span>
                  </div>
                )}
              </div>
            ) : (
              <div className={cn(
                "rounded-2xl p-4",
                msg.senderId === 'user-1' 
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              )}>
                <p>{msg.content}</p>
                <p className={cn(
                  "text-xs mt-2",
                  msg.senderId === 'user-1' ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 glass-strong border-t border-border/50 pb-safe-bottom">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-muted rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 gradient-base rounded-xl"
          >
            <Send className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
