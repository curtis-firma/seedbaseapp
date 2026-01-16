import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowUpRight, Check, AlertCircle, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getAllUsers, loadUserByPhone, type DemoUser } from '@/lib/demoAuth';
import { createTransfer } from '@/lib/demoTransfers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SendModal({ isOpen, onClose, onSuccess }: SendModalProps) {
  const { phoneNumber } = useUser();
  const [step, setStep] = useState<'search' | 'amount' | 'confirm' | 'success'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>([]);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    if (isOpen && phoneNumber) {
      // Load all users except current user
      const users = getAllUsers().filter(u => u.phone !== phoneNumber);
      setAvailableUsers(users);
      
      // Load current user for balance
      const user = loadUserByPhone(phoneNumber);
      setCurrentUser(user);
    }
  }, [isOpen, phoneNumber]);

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
    const query = searchQuery.toLowerCase().replace(/^@/, '');
    return u.username?.toLowerCase().includes(query) || 
           u.displayName?.toLowerCase().includes(query);
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
    if (currentUser && numAmount > currentUser.wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }
    setStep('confirm');
  };

  const handleSend = () => {
    if (!currentUser || !selectedUser || !phoneNumber) return;

    const numAmount = parseFloat(amount);
    const transfer = createTransfer(currentUser, selectedUser, numAmount, purpose || 'USDC Transfer');

    if (transfer) {
      setStep('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } else {
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
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.button
                      key={user.phone}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectUser(user)}
                      className="w-full p-4 bg-muted rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">
                          {user.displayName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.displayName || user.username}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user.role}
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
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">
                    {selectedUser.displayName?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{selectedUser.displayName || selectedUser.username}</p>
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
                  Available: ${currentUser?.wallet.balance.toFixed(2) || '0.00'}
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
                className="w-full py-4 gradient-seed rounded-xl text-white font-semibold flex items-center justify-center gap-2"
              >
                Confirm & Send
                <ArrowUpRight className="h-5 w-5" />
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
