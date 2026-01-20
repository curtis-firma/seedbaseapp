import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Send, Plus, Minus, X, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllCompletedUsers, searchUsers, getWalletByUserId, type DemoUser } from '@/lib/supabase/demoApi';
import { createTransfer } from '@/lib/supabase/transfersApi';
import { toast } from 'sonner';
import { triggerHaptic } from '@/hooks/useHaptic';

interface InlineComposeBarProps {
  onSuccess?: () => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100];

export function InlineComposeBar({ onSuccess }: InlineComposeBarProps) {
  const [message, setMessage] = useState('');
  const [attachUsdc, setAttachUsdc] = useState(false);
  const [amount, setAmount] = useState(25);
  const [showAmountPicker, setShowAmountPicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
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

  const filteredUsers = availableUsers.filter(u => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().replace(/^@/, '');
    return u.username?.toLowerCase().includes(query) || 
           u.display_name?.toLowerCase().includes(query);
  });

  const handleAmountChange = (delta: number) => {
    const newAmount = Math.max(1, Math.min(10000, amount + delta));
    setAmount(newAmount);
    triggerHaptic('light');
  };

  const handlePresetClick = (preset: number) => {
    setAmount(preset);
    triggerHaptic('light');
  };

  const handleSelectUser = (user: DemoUser) => {
    setSelectedUser(user);
    setShowUserPicker(false);
    setSearchQuery('');
    triggerHaptic('light');
  };

  const handleSend = async () => {
    if (!selectedUser) {
      toast.error('Please select a recipient');
      return;
    }
    
    if (!message.trim() && !attachUsdc) {
      toast.error('Please enter a message or attach USDC');
      return;
    }

    if (attachUsdc && amount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSending(true);
    triggerHaptic('medium');

    try {
      if (attachUsdc && amount > 0 && currentUserId) {
        await createTransfer(
          currentUserId,
          selectedUser.id,
          amount,
          message.trim() || 'Direct transfer'
        );
      }

      triggerHaptic('success');
      toast.success(
        attachUsdc && amount > 0
          ? `Sent $${amount} USDC to @${selectedUser.username}`
          : `Message sent to @${selectedUser.username}`
      );
      
      // Reset state
      setMessage('');
      setAttachUsdc(false);
      setAmount(25);
      setSelectedUser(null);
      setShowAmountPicker(false);
      
      onSuccess?.();
    } catch (error) {
      console.error('Error sending:', error);
      toast.error('Failed to send');
    } finally {
      setIsSending(false);
    }
  };

  const canSend = selectedUser && (message.trim() || (attachUsdc && amount > 0));

  return (
    <div className="fixed bottom-20 left-0 right-0 md:left-[260px] z-30 bg-card/95 backdrop-blur-xl border-t border-border/50">
      <AnimatePresence>
        {/* User Picker Dropdown */}
        {showUserPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 bg-card border-t border-border/50 max-h-[300px] overflow-y-auto"
          >
            <div className="p-3 border-b border-border/50 sticky top-0 bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 ring-primary/30"
                />
              </div>
            </div>
            
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">RECENT</p>
              {filteredUsers.slice(0, 8).map((user) => (
                <motion.button
                  key={user.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.display_name || user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-sm">{user.display_name || user.username}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Amount Picker Dropdown */}
        {showAmountPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 bg-card border-t border-border/50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Send USDC</span>
              <button
                onClick={() => {
                  setShowAmountPicker(false);
                  setAttachUsdc(false);
                }}
                className="p-1.5 hover:bg-muted rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Amount Controls */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAmountChange(-5)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              
              <div className="text-center">
                <p className="text-3xl font-bold">${amount}</p>
                <p className="text-xs text-muted-foreground">USDC</p>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAmountChange(5)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <Plus className="h-4 w-4" />
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
      </AnimatePresence>

      {/* Amount Preview Banner */}
      {attachUsdc && amount > 0 && !showAmountPicker && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between px-3 py-2 bg-[#0000ff]/5 border border-[#0000ff]/20 rounded-xl">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#0000ff]" />
              <span className="text-sm text-[#0000ff] font-medium">
                Sending ${amount} USDC
              </span>
            </div>
            <button
              onClick={() => {
                setAttachUsdc(false);
                setShowAmountPicker(false);
              }}
              className="p-1 hover:bg-[#0000ff]/10 rounded-lg"
            >
              <X className="h-3.5 w-3.5 text-[#0000ff]" />
            </button>
          </div>
        </div>
      )}

      {/* Selected User Chip */}
      {selectedUser && (
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">To:</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full">
              {selectedUser.avatar_url ? (
                <img 
                  src={selectedUser.avatar_url} 
                  alt=""
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-primary">
                    {selectedUser.username?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium">{selectedUser.username}</span>
              <button
                onClick={() => setSelectedUser(null)}
                className="ml-1 p-0.5 hover:bg-background/50 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2 p-3">
        {/* User Picker Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowUserPicker(!showUserPicker);
            setShowAmountPicker(false);
          }}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            showUserPicker || selectedUser
              ? "bg-[#0000ff] text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          <User className="h-5 w-5" />
        </motion.button>

        {/* $ Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!attachUsdc) {
              setAttachUsdc(true);
              setShowAmountPicker(true);
            } else {
              setShowAmountPicker(!showAmountPicker);
            }
            setShowUserPicker(false);
          }}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            attachUsdc
              ? "bg-[#0000ff] text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          <DollarSign className="h-5 w-5" />
        </motion.button>
        
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selectedUser ? "Type a message..." : "Select a recipient first"}
            rows={1}
            disabled={!selectedUser}
            className="w-full bg-muted/50 border border-border/50 rounded-2xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[40px] max-h-24 disabled:opacity-50"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 96) + 'px';
            }}
            onFocus={() => {
              setShowUserPicker(false);
              setShowAmountPicker(false);
            }}
          />
        </div>

        {/* Send Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!canSend || isSending}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            canSend && !isSending
              ? "bg-[#0000ff] text-white hover:bg-[#0000dd]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}