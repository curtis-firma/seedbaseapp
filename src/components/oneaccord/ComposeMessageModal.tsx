import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Send, Check, DollarSign, User, ToggleLeft, ToggleRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getAllCompletedUsers, searchUsers, getWalletByUserId, type DemoUser } from '@/lib/supabase/demoApi';
import { createTransfer } from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ComposeMessageModal({ isOpen, onClose, onSuccess }: ComposeMessageModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<'compose' | 'confirm' | 'success'>('compose');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [message, setMessage] = useState('');
  const [attachUsdc, setAttachUsdc] = useState(false);
  const [amount, setAmount] = useState('');
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(true);

  // Load users from database
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const sessionData = localStorage.getItem('seedbase-session');
      let userId: string | null = null;
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          userId = parsed.userId || null;
        } catch {}
      }
      
      setCurrentUserId(userId);
      
      const users = await getAllCompletedUsers(userId || undefined);
      setAvailableUsers(users);
      
      if (userId) {
        const wallet = await getWalletByUserId(userId);
        if (wallet) {
          setCurrentBalance(wallet.balance);
        }
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search users when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers(searchQuery, currentUserId || undefined).then(setAvailableUsers);
    } else if (searchQuery.length === 0) {
      getAllCompletedUsers(currentUserId || undefined).then(setAvailableUsers);
    }
  }, [searchQuery, currentUserId]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('compose');
        setSearchQuery('');
        setSelectedUser(null);
        setMessage('');
        setAttachUsdc(false);
        setAmount('');
        setShowUserSearch(true);
      }, 300);
    }
  }, [isOpen]);

  const filteredUsers = availableUsers.filter(u => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().replace(/^@/, '');
    return u.username?.toLowerCase().includes(query) || 
           u.display_name?.toLowerCase().includes(query);
  });

  const handleSelectUser = (user: DemoUser) => {
    setSelectedUser(user);
    setShowUserSearch(false);
  };

  const handleSendMessage = () => {
    if (!selectedUser || !message.trim()) {
      toast.error('Please select a recipient and enter a message');
      return;
    }
    
    if (attachUsdc) {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        toast.error('Enter a valid amount');
        return;
      }
      if (numAmount > currentBalance) {
        toast.error('Insufficient balance');
        return;
      }
    }
    
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!currentUserId || !selectedUser) return;

    try {
      if (attachUsdc && amount) {
        const numAmount = parseFloat(amount);
        const transfer = await createTransfer(
          currentUserId,
          selectedUser.id,
          numAmount,
          message
        );

        if (!transfer) {
          toast.error('Transfer failed. Please try again.');
          return;
        }
      }

      // For demo, we just show success (in real app, would send message to conversation)
      setStep('success');
      toast.success(`Message sent to @${selectedUser.username}${attachUsdc ? ` with $${amount} USDC` : ''}`);
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Send error:', err);
      toast.error('Failed to send. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Logo variant="icon" size="sm" />
            <h2 className="text-xl font-bold">
              {step === 'compose' && 'New Message'}
              {step === 'confirm' && 'Confirm'}
              {step === 'success' && 'Sent!'}
            </h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-xl bg-muted"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Compose */}
          {step === 'compose' && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Recipient */}
              {showUserSearch ? (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">To</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search @username..."
                        className="w-full bg-muted rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 ring-primary/50"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* User list */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm">Loading users...</p>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No users found</p>
                      </div>
                    ) : (
                      filteredUsers.slice(0, 5).map((user) => (
                        <motion.button
                          key={user.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectUser(user)}
                          className="w-full p-3 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors text-left"
                        >
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.display_name || user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-lg">
                                {user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{user.display_name || user.username}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  {selectedUser?.avatar_url ? (
                    <img 
                      src={selectedUser.avatar_url} 
                      alt={selectedUser.display_name || selectedUser.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">
                        {selectedUser?.display_name?.[0]?.toUpperCase() || selectedUser?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{selectedUser?.display_name || selectedUser?.username}</p>
                    <p className="text-sm text-muted-foreground">@{selectedUser?.username}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserSearch(true)}
                    className="text-sm text-primary"
                  >
                    Change
                  </motion.button>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  className="w-full bg-muted rounded-xl py-3 px-4 outline-none focus:ring-2 ring-primary/50 resize-none"
                />
              </div>

              {/* Attach USDC Toggle */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setAttachUsdc(!attachUsdc)}
                className="w-full p-4 bg-muted rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Attach USDC</p>
                    <p className="text-sm text-muted-foreground">Send money with your message</p>
                  </div>
                </div>
                {attachUsdc ? (
                  <ToggleRight className="h-8 w-8 text-seed" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-muted-foreground" />
                )}
              </motion.button>

              {/* Amount input (if toggle on) */}
              {attachUsdc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm text-muted-foreground mb-2 block">Amount (USDC)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-xl font-bold bg-muted rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Available: ${currentBalance.toFixed(2)}
                  </p>
                </motion.div>
              )}

              {/* Send Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSendMessage}
                disabled={!selectedUser || !message.trim()}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2",
                  selectedUser && message.trim()
                    ? "gradient-base text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Send className="h-5 w-5" />
                Send Message
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Confirm */}
          {step === 'confirm' && selectedUser && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-muted rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {selectedUser.avatar_url ? (
                    <img 
                      src={selectedUser.avatar_url} 
                      alt={selectedUser.display_name || selectedUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">
                        {selectedUser.display_name?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{selectedUser.display_name || selectedUser.username}</p>
                    <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                  </div>
                </div>

                <div className="p-3 bg-background rounded-xl mb-4">
                  <p className="text-sm">{message}</p>
                </div>

                {attachUsdc && amount && (
                  <div className="flex items-center justify-between p-3 bg-seed/10 rounded-xl">
                    <span className="text-sm text-muted-foreground">Attached USDC</span>
                    <span className="font-bold text-seed">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Confirm & Send
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full gradient-seed mx-auto mb-6 flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">
                {attachUsdc && amount ? (
                  <>Message with ${parseFloat(amount).toFixed(2)} USDC sent to @{selectedUser?.username}</>
                ) : (
                  <>Sent to @{selectedUser?.username}</>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
