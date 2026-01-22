import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowDownLeft, Check, User, Clock } from 'lucide-react';
import { getAllCompletedUsers, searchUsers, type DemoUser } from '@/lib/supabase/demoApi';
import { createPaymentRequest } from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RequestModal({ isOpen, onClose, onSuccess }: RequestModalProps) {
  const [step, setStep] = useState<'search' | 'amount' | 'success'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>([]);
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
        setMessage('');
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

  const handleSubmitRequest = async () => {
    if (!currentUserId || !selectedUser) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    
    try {
      // Create a pending payment request (from the selected user TO current user)
      const transfer = await createPaymentRequest(
        selectedUser.id, // from the person being requested
        currentUserId,   // to current user (requester)
        numAmount,
        message || 'Payment Request'
      );

      if (transfer) {
        setStep('success');
        toast.success(`Request sent to @${selectedUser.username}`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        toast.error('Failed to send request. Please try again.');
      }
    } catch (err) {
      console.error('Request error:', err);
      toast.error('Failed to send request. Please try again.');
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
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
      >
        {/* Drag Handle */}
        <div className="flex justify-center -mt-2 mb-4">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {step === 'search' && 'Request USDC'}
            {step === 'amount' && 'Request Amount'}
            {step === 'success' && 'Request Sent!'}
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
                  placeholder="Search @username to request from..."
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

          {/* Step 2: Enter amount and message */}
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
                <div className="flex-1">
                  <p className="font-medium">{selectedUser.display_name || selectedUser.username}</p>
                  <p className="text-sm text-muted-foreground">Request from @{selectedUser.username}</p>
                </div>
                <ArrowDownLeft className="h-5 w-5 text-seed" />
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
              </div>

              {/* Message input */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Message (optional)</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full bg-muted rounded-xl py-3 px-4 outline-none focus:ring-2 ring-primary/50"
                />
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2 mb-6 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <Clock className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  This will send a payment request to @{selectedUser.username}. They'll need to approve it for the funds to transfer.
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitRequest}
                disabled={!amount || parseFloat(amount) <= 0}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2",
                  amount && parseFloat(amount) > 0
                    ? "gradient-seed text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                Send Request
                <ArrowDownLeft className="h-5 w-5" />
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
              <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
              <p className="text-muted-foreground">
                ${parseFloat(amount).toFixed(2)} requested from @{selectedUser?.username}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-full text-sm font-medium">
                <Clock className="h-4 w-4" />
                Pending Approval
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
