import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowUpRight, Check, AlertCircle, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getAllCompletedUsers, searchUsers, getWalletByUserId, type DemoUser } from '@/lib/supabase/demoApi';
import { createTransfer } from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SendModal({ isOpen, onClose, onSuccess }: SendModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<'search' | 'amount' | 'confirm' | 'success'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load users from database
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Get current user ID from localStorage session
      const sessionData = localStorage.getItem('seedbase-session');
      let userId: string | null = null;
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          userId = parsed.userId || null;
        } catch {}
      }
      
      setCurrentUserId(userId);
      
      // Load all users except current
      const users = await getAllCompletedUsers(userId || undefined);
      setAvailableUsers(users);
      
      // Load current user's balance
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
      // Reset state when closed
      setTimeout(() => {
        setStep('search');
        setSearchQuery('');
        setSelectedUser(null);
        setAmount('');
        setPurpose('');
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
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (numAmount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }
    setStep('confirm');
  };

  const handleSend = async () => {
    if (!currentUserId || !selectedUser) return;

    const numAmount = parseFloat(amount);
    
    try {
      const transfer = await createTransfer(
        currentUserId,
        selectedUser.id,
        numAmount,
        purpose || 'USDC Transfer'
      );

      if (transfer) {
        setStep('success');
        toast.success(`Sent $${numAmount.toFixed(2)} to @${selectedUser.username}`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        toast.error('Transfer failed. Please try again.');
      }
    } catch (err) {
      console.error('Transfer error:', err);
      toast.error('Transfer failed. Please try again.');
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
        className="w-full max-w-lg bg-card rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {step === 'search' && 'Send USDC'}
            {step === 'amount' && 'Enter Amount'}
            {step === 'confirm' && 'Confirm Transfer'}
            {step === 'success' && 'Sent!'}
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-xl bg-muted"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Search for user */}
          {step === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Search input */}
              <div className="relative mb-4">
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

              {/* User list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p>Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.button
                      key={user.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectUser(user)}
                      className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors text-left"
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
                      <div className="text-xs text-muted-foreground capitalize">
                        {user.active_role}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Enter amount */}
          {step === 'amount' && selectedUser && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Selected user */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-muted rounded-xl">
                {selectedUser.avatar_url ? (
                  <img 
                    src={selectedUser.avatar_url} 
                    alt={selectedUser.display_name || selectedUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">
                      {selectedUser.display_name?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedUser.display_name || selectedUser.username}</p>
                  <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                </div>
              </div>

              {/* Amount input */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Amount (USDC)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-2xl font-bold bg-muted rounded-xl py-4 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50"
                    autoFocus
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Available: ${currentBalance.toFixed(2)}
                </p>
              </div>

              {/* Purpose input */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Purpose (optional)</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full bg-muted rounded-xl py-3 px-4 outline-none focus:ring-2 ring-primary/50"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2",
                  amount && parseFloat(amount) > 0
                    ? "gradient-seed text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                Continue
                <ArrowUpRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedUser && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-muted rounded-2xl p-6 mb-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Sending</p>
                  <p className="text-4xl font-bold">${parseFloat(amount).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">USDC</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <span>to</span>
                  <span className="font-medium text-foreground">@{selectedUser.username}</span>
                </div>

                {purpose && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    "{purpose}"
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2 mb-6 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  This transfer will be sent to their OneAccord inbox. They must accept to receive the funds.
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                className={cn(
                  // Base-style button: rounded rectangle with proper height
                  "w-full h-14 px-6 rounded-xl font-semibold",
                  "inline-flex items-center justify-center gap-3.5",
                  "bg-foreground text-background hover:bg-foreground/90",
                  "transition-all duration-200"
                )}
              >
                {/* Blue square icon */}
                <span className="w-5 h-5 rounded-sm flex-shrink-0 bg-[#0000ff]" />
                <span>Base Pay</span>
              </motion.button>
            </motion.div>
          )}

          {/* Step 4: Success */}
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
              <h3 className="text-xl font-bold mb-2">Transfer Sent!</h3>
              <p className="text-muted-foreground">
                ${parseFloat(amount).toFixed(2)} sent to @{selectedUser?.username}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}