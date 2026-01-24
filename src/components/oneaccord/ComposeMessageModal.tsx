import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Send, Check, DollarSign, User, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getAllCompletedUsers, searchUsers, getWalletByUserId, type DemoUser } from '@/lib/supabase/demoApi';
import { createTransfer } from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { triggerHaptic } from '@/hooks/useHaptic';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100];

export function ComposeMessageModal({ isOpen, onClose, onSuccess }: ComposeMessageModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<'compose' | 'confirm' | 'success'>('compose');
  const [messageType, setMessageType] = useState<'direct' | 'group'>('direct');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [message, setMessage] = useState('');
  const [attachUsdc, setAttachUsdc] = useState(false);
  const [amount, setAmount] = useState(25);
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
        setAmount(25);
        setMessageType('direct');
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
    setSearchQuery('');
    triggerHaptic('light');
  };

  const handleRemoveUser = () => {
    setSelectedUser(null);
    triggerHaptic('light');
  };

  const handleAmountChange = (delta: number) => {
    const newAmount = Math.max(1, amount + delta);
    setAmount(newAmount);
    triggerHaptic('light');
  };

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount);
    triggerHaptic('light');
  };

  const handleSendMessage = () => {
    if (!selectedUser || !message.trim()) {
      toast.error('Please select a recipient and enter a message');
      return;
    }
    
    if (attachUsdc) {
      if (amount <= 0) {
        toast.error('Enter a valid amount');
        return;
      }
      if (amount > currentBalance) {
        toast.error('Insufficient balance');
        return;
      }
    }
    
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!currentUserId || !selectedUser) return;

    try {
      if (attachUsdc && amount > 0) {
        const transfer = await createTransfer(
          currentUserId,
          selectedUser.id,
          amount,
          message
        );

        if (!transfer) {
          toast.error('Transfer failed. Please try again.');
          return;
        }
      }

      setStep('success');
      triggerHaptic('success');
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={step === 'compose' ? onClose : () => setStep('compose')}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            {step === 'compose' ? (
              <X className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </motion.button>
          <h2 className="text-lg font-semibold">
            {step === 'compose' && 'New Message'}
            {step === 'confirm' && 'Confirm Send'}
            {step === 'success' && 'Sent!'}
          </h2>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Compose */}
            {step === 'compose' && (
              <motion.div
                key="compose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 space-y-4"
              >
                {/* Message Type Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMessageType('direct')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all",
                      messageType === 'direct'
                        ? "bg-[#0000ff] text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Direct Message
                  </button>
                  <button
                    disabled
                    className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground/50 cursor-not-allowed relative"
                  >
                    Group Chat
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gray-200 text-gray-500 text-[9px] font-semibold rounded-full">
                      Soon
                    </span>
                  </button>
                </div>

                {/* Selected User Chip or Search */}
                {selectedUser ? (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border/50">
                    <span className="text-sm text-muted-foreground">To:</span>
                    <div className="flex items-center gap-2 bg-[#0000ff]/10 border border-[#0000ff]/20 rounded-full pl-1 pr-2 py-1">
                      {selectedUser.avatar_url ? (
                        <img 
                          src={selectedUser.avatar_url} 
                          alt={selectedUser.display_name || selectedUser.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#0000ff] flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {selectedUser.display_name?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-[#0000ff]">
                        @{selectedUser.username}
                      </span>
                      <button
                        onClick={handleRemoveUser}
                        className="p-0.5 hover:bg-[#0000ff]/20 rounded-full transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-[#0000ff]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for users..."
                        className="w-full bg-muted/50 border border-border/50 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 ring-[#0000ff]/30 focus:border-[#0000ff]/50 transition-all"
                        autoFocus
                      />
                    </div>

                    {/* User List */}
                    <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
                      {isLoading ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <div className="w-5 h-5 border-2 border-[#0000ff] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm">Loading...</p>
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">No users found</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">Recent</p>
                          {filteredUsers.slice(0, 5).map((user) => (
                            <motion.button
                              key={user.id}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSelectUser(user)}
                              className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-muted/80 transition-colors text-left"
                            >
                              {user.avatar_url ? (
                                <img 
                                  src={user.avatar_url} 
                                  alt={user.display_name || user.username}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border/50">
                                  <span className="text-base font-medium text-muted-foreground">
                                    {user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{user.display_name || user.username}</p>
                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                              </div>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* USDC Amount Selector */}
                {attachUsdc && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-muted/30 border border-border/50 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Send USDC</span>
                      <button
                        onClick={() => setAttachUsdc(false)}
                        className="p-1 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    {/* Amount Display */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAmountChange(-5)}
                        className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <Minus className="h-5 w-5" />
                      </motion.button>
                      <div className="text-center">
                        <p className="text-4xl font-bold">${amount}</p>
                        <p className="text-xs text-muted-foreground mt-1">USDC</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAmountChange(5)}
                        className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>

                    {/* Preset Pills */}
                    <div className="flex gap-2 justify-center">
                      {PRESET_AMOUNTS.map((preset) => (
                        <motion.button
                          key={preset}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePresetClick(preset)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            amount === preset
                              ? "bg-[#0000ff] text-white"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          ${preset}
                        </motion.button>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Available: ${currentBalance.toFixed(2)}
                    </p>
                  </motion.div>
                )}

                {/* Amount Preview Banner */}
                {attachUsdc && amount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#0000ff]/5 border border-[#0000ff]/20 rounded-xl">
                    <DollarSign className="h-4 w-4 text-[#0000ff]" />
                    <span className="text-sm text-[#0000ff] font-medium">
                      Sending ${amount} USDC
                    </span>
                  </div>
                )}

                {/* Message Input Footer */}
                <div className="flex items-end gap-2 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAttachUsdc(!attachUsdc)}
                    className={cn(
                      "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all",
                      attachUsdc
                        ? "bg-[#0000ff] text-white"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    <DollarSign className="h-5 w-5" />
                  </motion.button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full bg-muted/50 border border-border/50 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 ring-[#0000ff]/30 focus:border-[#0000ff]/50 transition-all resize-none min-h-[44px] max-h-24"
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                      }}
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!selectedUser || !message.trim()}
                    className={cn(
                      "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all",
                      selectedUser && message.trim()
                        ? "bg-[#0000ff] text-white hover:bg-[#0000dd]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirm */}
            {step === 'confirm' && selectedUser && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4"
              >
                <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 mb-4">
                  {/* Recipient */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    {selectedUser.avatar_url ? (
                      <img 
                        src={selectedUser.avatar_url} 
                        alt={selectedUser.display_name || selectedUser.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#0000ff]/10 flex items-center justify-center">
                        <span className="text-xl font-medium text-[#0000ff]">
                          {selectedUser.display_name?.[0]?.toUpperCase() || selectedUser.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{selectedUser.display_name || selectedUser.username}</p>
                      <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-background rounded-xl p-3 mb-4">
                    <p className="text-sm">{message}</p>
                  </div>

                  {/* Amount */}
                  {attachUsdc && amount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-[#0000ff]/5 border border-[#0000ff]/20 rounded-xl">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-bold text-[#0000ff]">${amount.toFixed(2)} USDC</span>
                    </div>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="w-full py-4 bg-[#0000ff] hover:bg-[#0000dd] rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-colors"
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
                className="p-4 text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-[#0000ff] mx-auto mb-6 flex items-center justify-center"
                >
                  <Check className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  {attachUsdc && amount > 0 ? (
                    <>Sent ${amount.toFixed(2)} USDC to @{selectedUser?.username}</>
                  ) : (
                    <>Sent to @{selectedUser?.username}</>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
